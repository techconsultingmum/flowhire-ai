/**
 * Integration tests for the upload-resume edge function policy.
 *
 * Run with:
 *   deno test --allow-net --allow-env --allow-read supabase/functions/upload-resume/index.test.ts
 *
 * Required env (loaded from project .env):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_PUBLISHABLE_KEY
 *   E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD
 *   E2E_RECRUITER_EMAIL / E2E_RECRUITER_PASSWORD              (recruiter w/ ≥1 job assignment)
 *   E2E_RECRUITER_NOJOB_EMAIL / E2E_RECRUITER_NOJOB_PASSWORD  (recruiter w/ 0 assignments)
 *   E2E_HIRING_MANAGER_EMAIL / E2E_HIRING_MANAGER_PASSWORD
 *   E2E_TEST_CANDIDATE_ID                                     (a candidate id with no applications yet)
 *
 * Tests are skipped automatically if these env vars are missing so CI without
 * fixtures stays green.
 */
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? "";
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? "";
const CANDIDATE_ID = Deno.env.get("E2E_TEST_CANDIDATE_ID") ?? "";

const fnUrl = `${SUPABASE_URL}/functions/v1/upload-resume`;

function fixturePdf(): File {
  // Minimal valid-ish PDF header bytes; the edge function validates by ext+mime,
  // not content.
  const bytes = new TextEncoder().encode("%PDF-1.4\n%fixture\n");
  return new File([bytes], "fixture.pdf", { type: "application/pdf" });
}

async function getAccessToken(email: string, password: string): Promise<string> {
  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error(error?.message ?? "no session");
  return data.session.access_token;
}

async function callUpload(token: string, candidateId: string, file = fixturePdf()) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("candidateId", candidateId);
  const res = await fetch(fnUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY },
    body: fd,
  });
  const json = await res.json();
  return { status: res.status, json };
}

function envReady(...keys: string[]): boolean {
  return keys.every((k) => Boolean(Deno.env.get(k)));
}

Deno.test("rejects unauthenticated requests with UNAUTHENTICATED", async () => {
  if (!SUPABASE_URL || !ANON_KEY) return;
  const fd = new FormData();
  fd.append("file", fixturePdf());
  fd.append("candidateId", CANDIDATE_ID || "00000000-0000-0000-0000-000000000000");
  const res = await fetch(fnUrl, { method: "POST", headers: { apikey: ANON_KEY }, body: fd });
  const json = await res.json();
  assertEquals(res.status, 401);
  assertEquals(json.code, "UNAUTHENTICATED");
});

Deno.test("hiring manager is denied with ROLE_FORBIDDEN", async () => {
  if (!envReady("E2E_HIRING_MANAGER_EMAIL", "E2E_HIRING_MANAGER_PASSWORD") || !CANDIDATE_ID) return;
  const token = await getAccessToken(
    Deno.env.get("E2E_HIRING_MANAGER_EMAIL")!,
    Deno.env.get("E2E_HIRING_MANAGER_PASSWORD")!,
  );
  const { status, json } = await callUpload(token, CANDIDATE_ID);
  assertEquals(status, 403);
  assertEquals(json.code, "ROLE_FORBIDDEN");
});

Deno.test("recruiter without job assignment is denied with NO_JOB_ASSIGNMENT", async () => {
  if (!envReady("E2E_RECRUITER_NOJOB_EMAIL", "E2E_RECRUITER_NOJOB_PASSWORD") || !CANDIDATE_ID) return;
  const token = await getAccessToken(
    Deno.env.get("E2E_RECRUITER_NOJOB_EMAIL")!,
    Deno.env.get("E2E_RECRUITER_NOJOB_PASSWORD")!,
  );
  const { status, json } = await callUpload(token, CANDIDATE_ID);
  assertEquals(status, 403);
  assertEquals(json.code, "NO_JOB_ASSIGNMENT");
});

Deno.test("recruiter with ≥1 job assignment can upload for an unassigned candidate", async () => {
  if (!envReady("E2E_RECRUITER_EMAIL", "E2E_RECRUITER_PASSWORD") || !CANDIDATE_ID) return;
  const token = await getAccessToken(
    Deno.env.get("E2E_RECRUITER_EMAIL")!,
    Deno.env.get("E2E_RECRUITER_PASSWORD")!,
  );
  const { status, json } = await callUpload(token, CANDIDATE_ID);
  assertEquals(status, 200);
  assertEquals(json.ok, true);
  assertExists(json.path);
});

Deno.test("admin can always upload", async () => {
  if (!envReady("E2E_ADMIN_EMAIL", "E2E_ADMIN_PASSWORD") || !CANDIDATE_ID) return;
  const token = await getAccessToken(
    Deno.env.get("E2E_ADMIN_EMAIL")!,
    Deno.env.get("E2E_ADMIN_PASSWORD")!,
  );
  const { status, json } = await callUpload(token, CANDIDATE_ID);
  assertEquals(status, 200);
  assertEquals(json.ok, true);
});

Deno.test("rejects unsupported file types with INVALID_FILE_TYPE", async () => {
  if (!envReady("E2E_ADMIN_EMAIL", "E2E_ADMIN_PASSWORD") || !CANDIDATE_ID) return;
  const token = await getAccessToken(
    Deno.env.get("E2E_ADMIN_EMAIL")!,
    Deno.env.get("E2E_ADMIN_PASSWORD")!,
  );
  const bad = new File([new Uint8Array([60, 115, 118, 103])], "evil.svg", { type: "image/svg+xml" });
  const { status, json } = await callUpload(token, CANDIDATE_ID, bad);
  assertEquals(status, 400);
  assertEquals(json.code, "INVALID_FILE_TYPE");
});

Deno.test("rejects oversize files with FILE_TOO_LARGE", async () => {
  if (!envReady("E2E_ADMIN_EMAIL", "E2E_ADMIN_PASSWORD") || !CANDIDATE_ID) return;
  const token = await getAccessToken(
    Deno.env.get("E2E_ADMIN_EMAIL")!,
    Deno.env.get("E2E_ADMIN_PASSWORD")!,
  );
  const huge = new File([new Uint8Array(6 * 1024 * 1024)], "big.pdf", { type: "application/pdf" });
  const { status, json } = await callUpload(token, CANDIDATE_ID, huge);
  assertEquals(status, 413);
  assertEquals(json.code, "FILE_TOO_LARGE");
});