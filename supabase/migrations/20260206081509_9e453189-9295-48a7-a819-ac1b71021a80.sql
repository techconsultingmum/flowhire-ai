-- Create job_assignments table to track which recruiters are assigned to which jobs
CREATE TABLE public.job_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    assigned_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, job_id)
);

-- Enable RLS on job_assignments
ALTER TABLE public.job_assignments ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if user is assigned to a job
CREATE OR REPLACE FUNCTION public.is_assigned_to_job(_user_id UUID, _job_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.job_assignments
        WHERE user_id = _user_id
          AND job_id = _job_id
    )
$$;

-- Create a function to check if user can access a candidate (via any assigned job application)
CREATE OR REPLACE FUNCTION public.can_access_candidate(_user_id UUID, _candidate_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.applications a
        INNER JOIN public.job_assignments ja ON ja.job_id = a.job_id
        WHERE a.candidate_id = _candidate_id
          AND ja.user_id = _user_id
    )
$$;

-- RLS Policies for job_assignments table
-- Admins can do everything
CREATE POLICY "Admins can manage all job assignments"
ON public.job_assignments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can view their own assignments
CREATE POLICY "Users can view their own job assignments"
ON public.job_assignments
FOR SELECT
USING (auth.uid() = user_id);

-- Deny anonymous access
CREATE POLICY "Deny anonymous access to job_assignments"
ON public.job_assignments
FOR SELECT
TO anon
USING (false);

-- Drop old overly permissive policies for candidates
DROP POLICY IF EXISTS "Recruiters and admins can view candidates" ON public.candidates;
DROP POLICY IF EXISTS "Recruiters and admins can create candidates" ON public.candidates;
DROP POLICY IF EXISTS "Recruiters and admins can update candidates" ON public.candidates;

-- Drop old overly permissive policies for applications
DROP POLICY IF EXISTS "Recruiters and admins can view applications" ON public.applications;
DROP POLICY IF EXISTS "Recruiters and admins can create applications" ON public.applications;
DROP POLICY IF EXISTS "Recruiters and admins can update applications" ON public.applications;

-- Drop old overly permissive policies for jobs
DROP POLICY IF EXISTS "Authorized users can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters and admins can create jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters and admins can update jobs" ON public.jobs;

-- New job-scoped policies for CANDIDATES
-- Admins can view all candidates
CREATE POLICY "Admins can view all candidates"
ON public.candidates
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can view candidates only for jobs they're assigned to
CREATE POLICY "Recruiters can view assigned job candidates"
ON public.candidates
FOR SELECT
USING (
    has_role(auth.uid(), 'recruiter'::app_role) AND
    can_access_candidate(auth.uid(), id)
);

-- Admins can create candidates
CREATE POLICY "Admins can create candidates"
ON public.candidates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can create candidates (they'll need to assign to a job after)
CREATE POLICY "Recruiters can create candidates"
ON public.candidates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'recruiter'::app_role));

-- Admins can update any candidate
CREATE POLICY "Admins can update all candidates"
ON public.candidates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can update candidates for their assigned jobs
CREATE POLICY "Recruiters can update assigned job candidates"
ON public.candidates
FOR UPDATE
USING (
    has_role(auth.uid(), 'recruiter'::app_role) AND
    can_access_candidate(auth.uid(), id)
);

-- New job-scoped policies for APPLICATIONS
-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can view applications only for jobs they're assigned to
CREATE POLICY "Recruiters can view assigned job applications"
ON public.applications
FOR SELECT
USING (
    has_role(auth.uid(), 'recruiter'::app_role) AND
    is_assigned_to_job(auth.uid(), job_id)
);

-- Admins can create applications
CREATE POLICY "Admins can create applications"
ON public.applications
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can create applications only for jobs they're assigned to
CREATE POLICY "Recruiters can create assigned job applications"
ON public.applications
FOR INSERT
WITH CHECK (
    has_role(auth.uid(), 'recruiter'::app_role) AND
    is_assigned_to_job(auth.uid(), job_id)
);

-- Admins can update any application
CREATE POLICY "Admins can update all applications"
ON public.applications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can update applications only for jobs they're assigned to
CREATE POLICY "Recruiters can update assigned job applications"
ON public.applications
FOR UPDATE
USING (
    has_role(auth.uid(), 'recruiter'::app_role) AND
    is_assigned_to_job(auth.uid(), job_id)
);

-- New job-scoped policies for JOBS
-- Admins can view all jobs
CREATE POLICY "Admins can view all jobs"
ON public.jobs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can view only jobs they're assigned to
CREATE POLICY "Recruiters can view assigned jobs"
ON public.jobs
FOR SELECT
USING (
    has_role(auth.uid(), 'recruiter'::app_role) AND
    is_assigned_to_job(auth.uid(), id)
);

-- Hiring managers can view only jobs they're assigned to
CREATE POLICY "Hiring managers can view assigned jobs"
ON public.jobs
FOR SELECT
USING (
    has_role(auth.uid(), 'hiring_manager'::app_role) AND
    is_assigned_to_job(auth.uid(), id)
);

-- Admins can create jobs
CREATE POLICY "Admins can create jobs"
ON public.jobs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can create jobs (they'll be auto-assigned)
CREATE POLICY "Recruiters can create jobs"
ON public.jobs
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'recruiter'::app_role));

-- Admins can update any job
CREATE POLICY "Admins can update all jobs"
ON public.jobs
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Recruiters can update only jobs they're assigned to
CREATE POLICY "Recruiters can update assigned jobs"
ON public.jobs
FOR UPDATE
USING (
    has_role(auth.uid(), 'recruiter'::app_role) AND
    is_assigned_to_job(auth.uid(), id)
);

-- Create trigger to auto-assign job creator to the job
CREATE OR REPLACE FUNCTION public.auto_assign_job_creator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Auto-assign the creator to the job
    INSERT INTO public.job_assignments (user_id, job_id, assigned_by)
    VALUES (auth.uid(), NEW.id, auth.uid())
    ON CONFLICT (user_id, job_id) DO NOTHING;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER auto_assign_job_on_create
AFTER INSERT ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_job_creator();

-- Enable realtime for job_assignments
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_assignments;