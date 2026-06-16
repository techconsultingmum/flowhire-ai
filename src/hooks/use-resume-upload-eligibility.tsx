import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  RESUME_UPLOAD_ERROR,
  type ResumeUploadErrorCode,
} from "@/lib/resume-upload-errors";

/**
 * Client-side preflight for the resume upload policy.
 *
 * Mirrors the upload-resume edge function's authorization rules so the form
 * can surface the right inline CTA before the user picks a file. The edge
 * function remains the single source of truth — this hook only decides what
 * to render.
 */
export interface ResumeUploadEligibility {
  isLoading: boolean;
  canUpload: boolean;
  blockedCode: ResumeUploadErrorCode | null;
}

export function useResumeUploadEligibility(): ResumeUploadEligibility {
  const { user, role } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["resume-upload-eligibility", user?.id, role],
    enabled: !!user && role === "recruiter",
    queryFn: async () => {
      const { count } = await supabase
        .from("job_assignments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return { assignmentCount: count ?? 0 };
    },
  });

  if (!user) {
    return { isLoading: false, canUpload: false, blockedCode: RESUME_UPLOAD_ERROR.UNAUTHENTICATED };
  }
  if (role === "admin") {
    return { isLoading: false, canUpload: true, blockedCode: null };
  }
  if (role === "hiring_manager" || role === null) {
    return {
      isLoading: false,
      canUpload: false,
      blockedCode: RESUME_UPLOAD_ERROR.ROLE_FORBIDDEN,
    };
  }
  // recruiter
  if (isLoading) return { isLoading: true, canUpload: false, blockedCode: null };
  if ((data?.assignmentCount ?? 0) === 0) {
    return {
      isLoading: false,
      canUpload: false,
      blockedCode: RESUME_UPLOAD_ERROR.NO_JOB_ASSIGNMENT,
    };
  }
  return { isLoading: false, canUpload: true, blockedCode: null };
}