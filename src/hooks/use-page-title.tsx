import { useEffect } from "react";

/**
 * Sets the document title with consistent branding.
 * @param title - The page-specific title (e.g., "Dashboard")
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Hireflow` : "Hireflow - Applicant Tracking Software & Hiring Platform";
    return () => {
      document.title = "Hireflow - Applicant Tracking Software & Hiring Platform";
    };
  }, [title]);
}
