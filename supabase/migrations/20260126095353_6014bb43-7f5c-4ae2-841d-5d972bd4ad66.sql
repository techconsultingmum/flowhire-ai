-- Fix RLS policies for candidates table - restrict to recruiters and admins only
DROP POLICY IF EXISTS "Authenticated users can view candidates" ON public.candidates;

CREATE POLICY "Recruiters and admins can view candidates"
ON public.candidates FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'recruiter'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Fix RLS policies for applications table - restrict to recruiters and admins only
DROP POLICY IF EXISTS "Authenticated users can view applications" ON public.applications;

CREATE POLICY "Recruiters and admins can view applications"
ON public.applications FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'recruiter'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Also restrict jobs viewing to recruiters, admins, and hiring managers
DROP POLICY IF EXISTS "Authenticated users can view jobs" ON public.jobs;

CREATE POLICY "Authorized users can view jobs"
ON public.jobs FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'recruiter'::app_role) 
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'hiring_manager'::app_role)
);