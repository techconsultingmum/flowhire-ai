-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own resumes
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
);

-- Allow recruiters and admins to view all resumes
CREATE POLICY "Recruiters and admins can view resumes"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (
    has_role(auth.uid(), 'recruiter'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Allow recruiters and admins to delete resumes
CREATE POLICY "Recruiters and admins can delete resumes"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (
    has_role(auth.uid(), 'recruiter'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Allow recruiters and admins to update resumes
CREATE POLICY "Recruiters and admins can update resumes"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (
    has_role(auth.uid(), 'recruiter'::app_role) 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);