/**
 * Shared resume-upload error codes.
 *
 * The upload-resume edge function is the single source of truth for resume
 * upload authorization. It returns one of these stable codes so the frontend
 * can render targeted inline guidance without re-implementing policy checks.
 */
export const RESUME_UPLOAD_ERROR = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  ROLE_FORBIDDEN: "ROLE_FORBIDDEN",
  NO_JOB_ASSIGNMENT: "NO_JOB_ASSIGNMENT",
  CANDIDATE_FORBIDDEN: "CANDIDATE_FORBIDDEN",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  MISSING_FIELDS: "MISSING_FIELDS",
  UPLOAD_FAILED: "UPLOAD_FAILED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ResumeUploadErrorCode =
  (typeof RESUME_UPLOAD_ERROR)[keyof typeof RESUME_UPLOAD_ERROR];

export interface ResumeUploadFailure {
  ok: false;
  code: ResumeUploadErrorCode;
  message: string;
}

export interface ResumeUploadSuccess {
  ok: true;
  path: string;
}

export type ResumeUploadResult = ResumeUploadFailure | ResumeUploadSuccess;

export const RESUME_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export const RESUME_ALLOWED_EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/**
 * Human-friendly message for an upload error, including a clear CTA.
 * Used by the inline alert in the candidate form.
 */
export function describeResumeUploadError(code: ResumeUploadErrorCode): {
  title: string;
  description: string;
  cta?: { label: string; href: string };
} {
  switch (code) {
    case RESUME_UPLOAD_ERROR.NO_JOB_ASSIGNMENT:
      return {
        title: "You're not assigned to any job yet",
        description:
          "Resume uploads are only available to recruiters who own at least one open job. Ask an admin to assign you to a job, then try again.",
        cta: { label: "Contact an admin", href: "mailto:admin@hireflow.app?subject=Job%20assignment%20request" },
      };
    case RESUME_UPLOAD_ERROR.ROLE_FORBIDDEN:
      return {
        title: "Your role can't upload resumes",
        description:
          "Hiring managers have read-only access to candidate resumes. Ask a recruiter or admin to attach the file.",
      };
    case RESUME_UPLOAD_ERROR.CANDIDATE_FORBIDDEN:
      return {
        title: "You can't modify this candidate",
        description:
          "This candidate is linked to a job you're not assigned to. Ask an admin for access.",
      };
    case RESUME_UPLOAD_ERROR.UNAUTHENTICATED:
      return {
        title: "Session expired",
        description: "Please sign in again to upload a resume.",
        cta: { label: "Sign in", href: "/login" },
      };
    case RESUME_UPLOAD_ERROR.INVALID_FILE_TYPE:
      return {
        title: "Unsupported file type",
        description: "Please upload a PDF or Word document (.pdf, .doc, .docx).",
      };
    case RESUME_UPLOAD_ERROR.FILE_TOO_LARGE:
      return {
        title: "File too large",
        description: "Resume files must be 5 MB or smaller.",
      };
    case RESUME_UPLOAD_ERROR.MISSING_FIELDS:
      return {
        title: "Missing required fields",
        description: "The upload request is missing required information. Please try again.",
      };
    case RESUME_UPLOAD_ERROR.UPLOAD_FAILED:
    case RESUME_UPLOAD_ERROR.INTERNAL_ERROR:
    default:
      return {
        title: "Upload failed",
        description: "Something went wrong on our end. Please try again in a moment.",
      };
  }
}