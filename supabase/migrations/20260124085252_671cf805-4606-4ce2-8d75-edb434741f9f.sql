
-- Create jobs table
CREATE TABLE public.jobs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Full-time',
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT,
    requirements TEXT[],
    status TEXT NOT NULL DEFAULT 'active',
    posted_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidates table
CREATE TABLE public.candidates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    resume_url TEXT,
    skills TEXT[],
    notes TEXT,
    ai_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table (links candidates to jobs with stage tracking)
CREATE TABLE public.applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    stage TEXT NOT NULL DEFAULT 'applied',
    stage_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(candidate_id, job_id)
);

-- Enable RLS on all tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Jobs policies - all authenticated users can read, recruiters+ can write
CREATE POLICY "Authenticated users can view jobs"
ON public.jobs FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Recruiters and admins can create jobs"
ON public.jobs FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters and admins can update jobs"
ON public.jobs FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete jobs"
ON public.jobs FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Candidates policies - all authenticated users can read, recruiters+ can write
CREATE POLICY "Authenticated users can view candidates"
ON public.candidates FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Recruiters and admins can create candidates"
ON public.candidates FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters and admins can update candidates"
ON public.candidates FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete candidates"
ON public.candidates FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Applications policies - all authenticated users can read/write
CREATE POLICY "Authenticated users can view applications"
ON public.applications FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Recruiters and admins can create applications"
ON public.applications FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters and admins can update applications"
ON public.applications FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'recruiter') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications"
ON public.applications FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Enable realtime for applications (for drag-and-drop updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;

-- Create triggers for updated_at
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
