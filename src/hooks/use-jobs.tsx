import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string | null;
  requirements: string[] | null;
  status: string;
  posted_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type JobInsert = Omit<Job, "id" | "created_at" | "updated_at" | "posted_date">;
export type JobUpdate = Partial<JobInsert>;

export function useJobs() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_date", { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("jobs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["jobs"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createJob = useMutation({
    mutationFn: async (job: JobInsert) => {
      const { data, error } = await supabase
        .from("jobs")
        .insert(job)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ 
        title: "Job created successfully",
        description: `"${data.title}" has been added to your job listings.`,
      });
    },
    onError: (error) => {
      const message = error.message.includes("permission")
        ? "You don't have permission to create jobs."
        : error.message;
      toast({ title: "Failed to create job", description: message, variant: "destructive" });
    },
  });

  const updateJob = useMutation({
    mutationFn: async ({ id, ...updates }: JobUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("jobs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update job", description: error.message, variant: "destructive" });
    },
  });

  const deleteJob = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Job deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete job", description: error.message, variant: "destructive" });
    },
  });

  return {
    jobs: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createJob,
    updateJob,
    deleteJob,
  };
}
