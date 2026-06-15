
-- Auth audit log
CREATE TABLE public.auth_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  email TEXT,
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_audit_log_created_at ON public.auth_audit_log (created_at DESC);
CREATE INDEX idx_auth_audit_log_event_type ON public.auth_audit_log (event_type);
CREATE INDEX idx_auth_audit_log_email ON public.auth_audit_log (email);

GRANT SELECT ON public.auth_audit_log TO authenticated;
GRANT ALL ON public.auth_audit_log TO service_role;

ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Block anonymous access entirely (defense in depth).
CREATE POLICY "Deny anonymous access to auth audit"
  ON public.auth_audit_log
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Admins can read auth audit log"
  ON public.auth_audit_log
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- No INSERT/UPDATE/DELETE policies for end users; only service_role writes.

-- Password reset throttling table
CREATE TABLE public.password_reset_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pra_email_hash_created ON public.password_reset_attempts (email_hash, created_at DESC);
CREATE INDEX idx_pra_ip_created ON public.password_reset_attempts (ip_address, created_at DESC);

GRANT ALL ON public.password_reset_attempts TO service_role;

ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anonymous access to reset attempts"
  ON public.password_reset_attempts
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny authenticated access to reset attempts"
  ON public.password_reset_attempts
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);
