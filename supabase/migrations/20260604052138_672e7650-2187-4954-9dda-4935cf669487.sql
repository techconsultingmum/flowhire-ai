
-- ===== Candidates: require recruiters to be assigned to at least one job =====
DROP POLICY IF EXISTS "Recruiters can create candidates" ON public.candidates;
CREATE POLICY "Recruiters can create candidates"
ON public.candidates FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'recruiter')
  AND EXISTS (
    SELECT 1 FROM public.job_assignments ja WHERE ja.user_id = auth.uid()
  )
);

-- ===== Storage: hiring managers can read resumes for accessible candidates =====
CREATE POLICY "Resumes: hiring manager scoped select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'resumes'
  AND public.has_role(auth.uid(), 'hiring_manager')
  AND public.can_access_candidate(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

-- ===== Realtime: restrict subscriptions to known postgres_changes topics =====
DROP POLICY IF EXISTS "Authenticated can receive realtime" ON realtime.messages;
CREATE POLICY "Authenticated can receive postgres_changes"
ON realtime.messages FOR SELECT TO authenticated
USING (
  (realtime.topic() LIKE 'realtime:%')
);
