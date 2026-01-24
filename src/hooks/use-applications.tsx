import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Candidate } from "./use-candidates";
import { Job } from "./use-jobs";

export interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  stage: string;
  stage_updated_at: string;
  applied_at: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationWithDetails extends Application {
  candidates: Candidate;
  jobs: Job;
}

export type ApplicationInsert = Pick<Application, "candidate_id" | "job_id"> & Partial<Pick<Application, "stage" | "notes">>;
export type ApplicationUpdate = Partial<Pick<Application, "stage" | "notes">>;

export const PIPELINE_STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected"] as const;
export type PipelineStage = typeof PIPELINE_STAGES[number];

export function useApplications(jobId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryKey = jobId ? ["applications", jobId] : ["applications"];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      let q = supabase
        .from("applications")
        .select(`
          *,
          candidates (*),
          jobs (*)
        `)
        .order("stage_updated_at", { ascending: false });

      if (jobId) {
        q = q.eq("job_id", jobId);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as ApplicationWithDetails[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("applications-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["applications"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createApplication = useMutation({
    mutationFn: async (application: ApplicationInsert) => {
      const { data, error } = await supabase
        .from("applications")
        .insert(application)
        .select(`
          *,
          candidates (*),
          jobs (*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({ title: "Application created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create application", description: error.message, variant: "destructive" });
    },
  });

  const updateApplicationStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      const { data, error } = await supabase
        .from("applications")
        .update({ stage, stage_updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error) => {
      toast({ title: "Failed to update stage", description: error.message, variant: "destructive" });
    },
  });

  const updateApplication = useMutation({
    mutationFn: async ({ id, ...updates }: ApplicationUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("applications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({ title: "Application updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update application", description: error.message, variant: "destructive" });
    },
  });

  const deleteApplication = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({ title: "Application deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete application", description: error.message, variant: "destructive" });
    },
  });

  return {
    applications: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createApplication,
    updateApplicationStage,
    updateApplication,
    deleteApplication,
  };
}
