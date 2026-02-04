-- Add explicit denial policies for anonymous users (defense-in-depth)
-- This provides explicit protection even though RLS defaults to deny

-- Deny anonymous access to candidates table
CREATE POLICY "Deny anonymous access to candidates"
ON public.candidates FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to jobs table  
CREATE POLICY "Deny anonymous access to jobs"
ON public.jobs FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to applications table
CREATE POLICY "Deny anonymous access to applications"
ON public.applications FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to profiles table
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles FOR SELECT
TO anon
USING (false);

-- Deny anonymous access to user_roles table
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles FOR SELECT
TO anon
USING (false);