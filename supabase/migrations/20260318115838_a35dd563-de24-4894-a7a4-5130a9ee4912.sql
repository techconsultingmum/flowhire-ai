DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;

CREATE POLICY "Recruiters and admins can upload resumes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND (
    has_role(auth.uid(), 'recruiter'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);