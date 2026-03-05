
-- Add missing hiring_manager policies for candidates
CREATE POLICY "Hiring managers can view assigned job candidates"
ON public.candidates
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'hiring_manager'::app_role)
  AND can_access_candidate(auth.uid(), id)
);

-- Add missing hiring_manager policies for applications
CREATE POLICY "Hiring managers can view assigned job applications"
ON public.applications
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'hiring_manager'::app_role)
  AND is_assigned_to_job(auth.uid(), job_id)
);
