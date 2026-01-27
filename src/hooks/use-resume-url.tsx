import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to generate fresh signed URLs for resume files.
 * Since resume URLs have a 2-hour expiry for security, this hook
 * generates new signed URLs on demand when viewing resumes.
 */
export function useResumeUrl() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getResumeUrl = useCallback(async (resumePath: string): Promise<string | null> => {
    if (!resumePath) return null;

    setIsLoading(true);
    setError(null);

    try {
      // Extract the file path from the full URL if it's a signed URL
      let filePath = resumePath;
      
      // If it's already a full URL, extract just the file path
      if (resumePath.includes("/storage/v1/object/")) {
        const pathMatch = resumePath.match(/resumes\/(.+?)(\?|$)/);
        if (pathMatch) {
          filePath = pathMatch[1];
        }
      } else if (resumePath.startsWith("resumes/")) {
        filePath = resumePath.replace("resumes/", "");
      }

      // Generate a new signed URL with 2-hour expiry
      const { data, error: signedUrlError } = await supabase.storage
        .from("resumes")
        .createSignedUrl(filePath, 60 * 60 * 2); // 2 hours

      if (signedUrlError) {
        throw signedUrlError;
      }

      return data?.signedUrl || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load resume";
      setError(message);
      console.error("Error generating resume URL:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getResumeUrl,
    isLoading,
    error,
  };
}
