
-- Convert all anonymous deny policies from PERMISSIVE to RESTRICTIVE

-- candidates
DROP POLICY IF EXISTS "Deny anonymous access to candidates" ON public.candidates;
CREATE POLICY "Deny anonymous access to candidates" ON public.candidates AS RESTRICTIVE FOR SELECT TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous insert to candidates" ON public.candidates;
CREATE POLICY "Deny anonymous insert to candidates" ON public.candidates AS RESTRICTIVE FOR INSERT TO anon WITH CHECK (false);
DROP POLICY IF EXISTS "Deny anonymous update to candidates" ON public.candidates;
CREATE POLICY "Deny anonymous update to candidates" ON public.candidates AS RESTRICTIVE FOR UPDATE TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous delete to candidates" ON public.candidates;
CREATE POLICY "Deny anonymous delete to candidates" ON public.candidates AS RESTRICTIVE FOR DELETE TO anon USING (false);

-- applications
DROP POLICY IF EXISTS "Deny anonymous access to applications" ON public.applications;
CREATE POLICY "Deny anonymous access to applications" ON public.applications AS RESTRICTIVE FOR SELECT TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous insert to applications" ON public.applications;
CREATE POLICY "Deny anonymous insert to applications" ON public.applications AS RESTRICTIVE FOR INSERT TO anon WITH CHECK (false);
DROP POLICY IF EXISTS "Deny anonymous update to applications" ON public.applications;
CREATE POLICY "Deny anonymous update to applications" ON public.applications AS RESTRICTIVE FOR UPDATE TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous delete to applications" ON public.applications;
CREATE POLICY "Deny anonymous delete to applications" ON public.applications AS RESTRICTIVE FOR DELETE TO anon USING (false);

-- jobs
DROP POLICY IF EXISTS "Deny anonymous access to jobs" ON public.jobs;
CREATE POLICY "Deny anonymous access to jobs" ON public.jobs AS RESTRICTIVE FOR SELECT TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous insert to jobs" ON public.jobs;
CREATE POLICY "Deny anonymous insert to jobs" ON public.jobs AS RESTRICTIVE FOR INSERT TO anon WITH CHECK (false);
DROP POLICY IF EXISTS "Deny anonymous update to jobs" ON public.jobs;
CREATE POLICY "Deny anonymous update to jobs" ON public.jobs AS RESTRICTIVE FOR UPDATE TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous delete to jobs" ON public.jobs;
CREATE POLICY "Deny anonymous delete to jobs" ON public.jobs AS RESTRICTIVE FOR DELETE TO anon USING (false);

-- profiles
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
CREATE POLICY "Deny anonymous access to profiles" ON public.profiles AS RESTRICTIVE FOR SELECT TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous insert to profiles" ON public.profiles;
CREATE POLICY "Deny anonymous insert to profiles" ON public.profiles AS RESTRICTIVE FOR INSERT TO anon WITH CHECK (false);
DROP POLICY IF EXISTS "Deny anonymous update to profiles" ON public.profiles;
CREATE POLICY "Deny anonymous update to profiles" ON public.profiles AS RESTRICTIVE FOR UPDATE TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous delete to profiles" ON public.profiles;
CREATE POLICY "Deny anonymous delete to profiles" ON public.profiles AS RESTRICTIVE FOR DELETE TO anon USING (false);

-- user_roles
DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;
CREATE POLICY "Deny anonymous access to user_roles" ON public.user_roles AS RESTRICTIVE FOR SELECT TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous insert to user_roles" ON public.user_roles;
CREATE POLICY "Deny anonymous insert to user_roles" ON public.user_roles AS RESTRICTIVE FOR INSERT TO anon WITH CHECK (false);
DROP POLICY IF EXISTS "Deny anonymous update to user_roles" ON public.user_roles;
CREATE POLICY "Deny anonymous update to user_roles" ON public.user_roles AS RESTRICTIVE FOR UPDATE TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous delete to user_roles" ON public.user_roles;
CREATE POLICY "Deny anonymous delete to user_roles" ON public.user_roles AS RESTRICTIVE FOR DELETE TO anon USING (false);

-- job_assignments
DROP POLICY IF EXISTS "Deny anonymous access to job_assignments" ON public.job_assignments;
CREATE POLICY "Deny anonymous access to job_assignments" ON public.job_assignments AS RESTRICTIVE FOR SELECT TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous insert to job_assignments" ON public.job_assignments;
CREATE POLICY "Deny anonymous insert to job_assignments" ON public.job_assignments AS RESTRICTIVE FOR INSERT TO anon WITH CHECK (false);
DROP POLICY IF EXISTS "Deny anonymous update to job_assignments" ON public.job_assignments;
CREATE POLICY "Deny anonymous update to job_assignments" ON public.job_assignments AS RESTRICTIVE FOR UPDATE TO anon USING (false);
DROP POLICY IF EXISTS "Deny anonymous delete to job_assignments" ON public.job_assignments;
CREATE POLICY "Deny anonymous delete to job_assignments" ON public.job_assignments AS RESTRICTIVE FOR DELETE TO anon USING (false);
