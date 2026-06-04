
DROP POLICY IF EXISTS "Authenticated can receive postgres_changes" ON realtime.messages;
CREATE POLICY "Authenticated can receive postgres_changes"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'realtime:%'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (SELECT 1 FROM public.job_assignments ja WHERE ja.user_id = auth.uid())
  )
);
