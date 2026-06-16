-- Decouple recruiter resume upload authorization from existing application linkage.
-- Previous policy used can_access_candidate(), which (a) blocks legitimate first-time
-- uploads during candidate creation (no application yet) and (b) grants INSERT to any
-- recruiter assigned to a job the moment an application row exists for that candidate,
-- regardless of who created the application (race / admin-created rows).
--
-- New rule: recruiters may upload to the resumes bucket only if they actually have at
-- least one job assignment (i.e. they are an active recruiter in the system). The
-- candidate row itself remains gated by the candidates RLS policies, so a recruiter
-- still cannot read or attach an unauthorized resume to a candidate they cannot access.

DROP POLICY IF EXISTS "Resumes: recruiter scoped insert" ON storage.objects;

CREATE POLICY "Resumes: recruiter scoped insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND public.has_role(auth.uid(), 'recruiter')
  AND EXISTS (
    SELECT 1 FROM public.job_assignments ja
    WHERE ja.user_id = auth.uid()
  )
);