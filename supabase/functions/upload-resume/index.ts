import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Resume upload — server-side enforcement.
 *
 * This function is the SINGLE source of truth for resume upload authorization.
 * RLS on storage.objects is a defense-in-depth backstop; the policy mirrored
 * here is what the frontend can rely on.
 *
 * Policy:
 *   - admin                → always allowed
 *   - recruiter            → must have ≥1 job assignment AND, if a candidateId
 *                            is provided, must be able to access that candidate
 *                            (or the candidate must have no applications yet,
 *                            i.e. is being created right now)
 *   - hiring_manager       → never allowed (read-only role)
 *   - anything else / null → denied
 *
 * All denials are recorded in public.auth_audit_log with role, candidate id,
 * IP, and user agent so admins can review abuse and onboarding gaps.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESUME_MAX_BYTES = 5 * 1024 * 1024;

const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

type Code =
  | "UNAUTHENTICATED"
  | "ROLE_FORBIDDEN"
  | "NO_JOB_ASSIGNMENT"
  | "CANDIDATE_FORBIDDEN"
  | "INVALID_FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "MISSING_FIELDS"
  | "UPLOAD_FAILED"
  | "INTERNAL_ERROR";

const httpStatusForCode: Record<Code, number> = {
  UNAUTHENTICATED: 401,
  ROLE_FORBIDDEN: 403,
  NO_JOB_ASSIGNMENT: 403,
  CANDIDATE_FORBIDDEN: 403,
  INVALID_FILE_TYPE: 400,
  FILE_TOO_LARGE: 413,
  MISSING_FIELDS: 400,
  UPLOAD_FAILED: 500,
  INTERNAL_ERROR: 500,
};

function fail(code: Code, message: string) {
  return new Response(JSON.stringify({ ok: false, code, message }), {
    status: httpStatusForCode[code],
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return (fwd.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return fail("MISSING_FIELDS", "POST required.");
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const logDenied = async (
    code: Code,
    ctx: { userId: string | null; role: string | null; candidateId: string | null; email: string | null; extra?: Record<string, unknown> },
  ) => {
    try {
      await admin.from("auth_audit_log").insert({
        event_type: "resume_upload_denied",
        user_id: ctx.userId,
        email: ctx.email,
        ip_address: ip,
        user_agent: userAgent,
        metadata: {
          code,
          role: ctx.role,
          candidate_id: ctx.candidateId,
          ...ctx.extra,
        },
      });
    } catch (err) {
      console.error("audit log insert failed:", err);
    }
  };

  try {
    // ---- Authentication ----------------------------------------------------
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      await logDenied("UNAUTHENTICATED", { userId: null, role: null, candidateId: null, email: null });
      return fail("UNAUTHENTICATED", "Sign in to upload resumes.");
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      await logDenied("UNAUTHENTICATED", { userId: null, role: null, candidateId: null, email: null });
      return fail("UNAUTHENTICATED", "Sign in to upload resumes.");
    }

    // ---- Parse multipart body ---------------------------------------------
    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return fail("MISSING_FIELDS", "Expected multipart/form-data with 'file' and 'candidateId'.");
    }
    const file = form.get("file");
    const candidateId = (form.get("candidateId") as string | null)?.trim() ?? "";
    if (!(file instanceof File) || !candidateId) {
      return fail("MISSING_FIELDS", "Both 'file' and 'candidateId' are required.");
    }

    // ---- File validation ---------------------------------------------------
    const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "";
    const safeContentType = EXT_TO_MIME[rawExt];
    if (!safeContentType || safeContentType !== file.type) {
      return fail("INVALID_FILE_TYPE", "Only PDF or Word documents are allowed.");
    }
    if (file.size > RESUME_MAX_BYTES) {
      return fail("FILE_TOO_LARGE", "Resume files must be 5 MB or smaller.");
    }

    // ---- Role lookup -------------------------------------------------------
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    const role = (roleRow?.role as string | undefined) ?? null;

    const baseCtx = {
      userId: user.id,
      role,
      candidateId,
      email: user.email ?? null,
    };

    // ---- Policy enforcement ------------------------------------------------
    if (role !== "admin" && role !== "recruiter") {
      await logDenied("ROLE_FORBIDDEN", baseCtx);
      return fail("ROLE_FORBIDDEN", "Your role cannot upload resumes.");
    }

    if (role === "recruiter") {
      const { count: assignCount } = await admin
        .from("job_assignments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (!assignCount || assignCount === 0) {
        await logDenied("NO_JOB_ASSIGNMENT", baseCtx);
        return fail(
          "NO_JOB_ASSIGNMENT",
          "You need at least one assigned job before uploading resumes. Contact an admin.",
        );
      }

      // Recruiter must own the candidate via job assignment, OR the candidate
      // must currently have no applications (i.e. is being created now).
      const { count: appCount } = await admin
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("candidate_id", candidateId);

      if ((appCount ?? 0) > 0) {
        const { data: accessRow } = await admin.rpc("can_access_candidate", {
          _user_id: user.id,
          _candidate_id: candidateId,
        });
        if (!accessRow) {
          await logDenied("CANDIDATE_FORBIDDEN", baseCtx);
          return fail("CANDIDATE_FORBIDDEN", "You don't have access to this candidate.");
        }
      }
    }

    // ---- Upload via service role ------------------------------------------
    const objectPath = `${candidateId}/${Date.now()}.${rawExt}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: upErr } = await admin.storage.from("resumes").upload(objectPath, bytes, {
      cacheControl: "3600",
      upsert: true,
      contentType: safeContentType,
    });
    if (upErr) {
      console.error("storage upload error:", upErr.message);
      return fail("UPLOAD_FAILED", "Could not save the resume. Please try again.");
    }

    // Success audit (non-blocking).
    admin
      .from("auth_audit_log")
      .insert({
        event_type: "resume_upload_succeeded",
        user_id: user.id,
        email: user.email ?? null,
        ip_address: ip,
        user_agent: userAgent,
        metadata: { role, candidate_id: candidateId, path: objectPath },
      })
      .then(({ error }) => {
        if (error) console.error("audit log success insert failed:", error.message);
      });

    return new Response(JSON.stringify({ ok: true, path: objectPath }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("upload-resume internal error:", err);
    return fail("INTERNAL_ERROR", "An internal error occurred. Please try again later.");
  }
});