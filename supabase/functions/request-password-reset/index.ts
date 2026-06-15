import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  redirectTo: z.string().url().max(500),
});

// Throttle: per-email and per-IP windows.
const PER_EMAIL_LIMIT = 3;
const PER_EMAIL_WINDOW_MIN = 60;
const PER_IP_LIMIT = 10;
const PER_IP_WINDOW_MIN = 60;

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return (fwd.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  // Generic success response — never reveal whether the email exists.
  const genericOk = () =>
    new Response(
      JSON.stringify({
        ok: true,
        message:
          "If an account exists for that email, a password reset link is on its way.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );

  try {
    const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ ok: false, error: "Please enter a valid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { email, redirectTo } = parsed.data;

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
    const emailHash = await sha256Hex(email);

    const since = new Date(Date.now() - PER_EMAIL_WINDOW_MIN * 60 * 1000).toISOString();
    const ipSince = new Date(Date.now() - PER_IP_WINDOW_MIN * 60 * 1000).toISOString();

    const [{ count: emailCount }, { count: ipCount }] = await Promise.all([
      admin
        .from("password_reset_attempts")
        .select("id", { count: "exact", head: true })
        .eq("email_hash", emailHash)
        .gte("created_at", since),
      admin
        .from("password_reset_attempts")
        .select("id", { count: "exact", head: true })
        .eq("ip_address", ip)
        .gte("created_at", ipSince),
    ]);

    const overLimit =
      (emailCount ?? 0) >= PER_EMAIL_LIMIT || (ipCount ?? 0) >= PER_IP_LIMIT;

    if (overLimit) {
      await admin.from("auth_audit_log").insert({
        event_type: "password_reset_rate_limited",
        email,
        ip_address: ip,
        user_agent: userAgent,
        metadata: { email_count: emailCount, ip_count: ipCount },
      });
      return new Response(
        JSON.stringify({
          ok: false,
          error:
            "Too many reset requests. Please wait a while before trying again.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Record the attempt BEFORE issuing the email to ensure the throttle counts.
    await admin.from("password_reset_attempts").insert({
      email_hash: emailHash,
      ip_address: ip,
    });

    // Issue the recovery email via the public auth API (anon key).
    const publicClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error: resetError } = await publicClient.auth.resetPasswordForEmail(
      email,
      { redirectTo },
    );

    await admin.from("auth_audit_log").insert({
      event_type: resetError
        ? "password_reset_request_failed"
        : "password_reset_requested",
      email,
      ip_address: ip,
      user_agent: userAgent,
      metadata: resetError ? { error: resetError.message } : null,
    });

    if (resetError) {
      console.error("resetPasswordForEmail error:", resetError.message);
    }

    // Always return the same generic success to prevent account enumeration.
    return genericOk();
  } catch (err) {
    console.error("request-password-reset internal error:", err);
    // Still return generic success to avoid leaking system state via timing/branching.
    return genericOk();
  }
});