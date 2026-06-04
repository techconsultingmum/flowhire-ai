
-- ===== Storage: restrict resumes to assigned recruiters / admins =====
DROP POLICY IF EXISTS "Recruiters and admins can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Recruiters and admins can delete resumes" ON storage.objects;
DROP POLICY IF EXISTS "Recruiters and admins can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Recruiters and admins can upload resumes" ON storage.objects;

-- Path format: {candidate_id}/{timestamp}.{ext}
CREATE POLICY "Resumes: admin full access"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Resumes: recruiter scoped select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'resumes'
  AND public.has_role(auth.uid(), 'recruiter')
  AND public.can_access_candidate(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Resumes: recruiter scoped insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND public.has_role(auth.uid(), 'recruiter')
  AND public.can_access_candidate(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Resumes: recruiter scoped update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'resumes'
  AND public.has_role(auth.uid(), 'recruiter')
  AND public.can_access_candidate(auth.uid(), ((storage.foldername(name))[1])::uuid)
)
WITH CHECK (
  bucket_id = 'resumes'
  AND public.has_role(auth.uid(), 'recruiter')
  AND public.can_access_candidate(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Resumes: recruiter scoped delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'resumes'
  AND public.has_role(auth.uid(), 'recruiter')
  AND public.can_access_candidate(auth.uid(), ((storage.foldername(name))[1])::uuid)
);

-- ===== Realtime: lock down channel subscriptions =====
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can receive realtime" ON realtime.messages;
CREATE POLICY "Authenticated can receive realtime"
ON realtime.messages FOR SELECT TO authenticated
USING (true);

-- Block anon entirely (no policy granted to anon)
