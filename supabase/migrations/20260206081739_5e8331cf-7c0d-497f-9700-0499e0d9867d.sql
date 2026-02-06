-- Add explicit anonymous denial policies for all operations on all tables
-- This provides defense-in-depth by explicitly denying anonymous access for all operations

-- job_assignments: Add anonymous denial for non-SELECT operations
CREATE POLICY "Deny anonymous insert to job_assignments"
ON public.job_assignments
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to job_assignments"
ON public.job_assignments
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to job_assignments"
ON public.job_assignments
FOR DELETE
TO anon
USING (false);

-- candidates: Add anonymous denial for non-SELECT operations
CREATE POLICY "Deny anonymous insert to candidates"
ON public.candidates
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to candidates"
ON public.candidates
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to candidates"
ON public.candidates
FOR DELETE
TO anon
USING (false);

-- jobs: Add anonymous denial for non-SELECT operations
CREATE POLICY "Deny anonymous insert to jobs"
ON public.jobs
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to jobs"
ON public.jobs
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to jobs"
ON public.jobs
FOR DELETE
TO anon
USING (false);

-- applications: Add anonymous denial for non-SELECT operations
CREATE POLICY "Deny anonymous insert to applications"
ON public.applications
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to applications"
ON public.applications
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to applications"
ON public.applications
FOR DELETE
TO anon
USING (false);

-- profiles: Add anonymous denial for all non-SELECT operations and DELETE protection
CREATE POLICY "Deny anonymous insert to profiles"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to profiles"
ON public.profiles
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to profiles"
ON public.profiles
FOR DELETE
TO anon
USING (false);

-- Admins can delete profiles (for user management)
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- user_roles: Add anonymous denial for non-SELECT operations
CREATE POLICY "Deny anonymous insert to user_roles"
ON public.user_roles
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update to user_roles"
ON public.user_roles
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete to user_roles"
ON public.user_roles
FOR DELETE
TO anon
USING (false);