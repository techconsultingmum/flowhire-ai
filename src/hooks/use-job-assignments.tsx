import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface JobAssignment {
  id: string;
  user_id: string;
  job_id: string;
  assigned_at: string;
  assigned_by: string | null;
  created_at: string;
}

export interface JobAssignmentWithJob extends JobAssignment {
  jobs?: {
    id: string;
    title: string;
    department: string;
    location: string;
    status: string;
  };
}

export function useJobAssignments(jobId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryKey = jobId ? ["job-assignments", jobId] : ["job-assignments"];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      let q = supabase
        .from("job_assignments")
        .select(`
          *,
          jobs (id, title, department, location, status)
        `)
        .order("assigned_at", { ascending: false });

      if (jobId) {
        q = q.eq("job_id", jobId);
      }

      const { data, error } = await q;
      if (error) throw error;
      return data as JobAssignmentWithJob[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("job-assignments-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_assignments" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["job-assignments"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const assignUserToJob = useMutation({
    mutationFn: async ({ userId, jobId }: { userId: string; jobId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("job_assignments")
        .insert({
          user_id: userId,
          job_id: jobId,
          assigned_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "User assigned to job successfully" });
    },
    onError: (error) => {
      const message = error.message.includes("duplicate")
        ? "This user is already assigned to this job."
        : error.message.includes("permission")
        ? "You don't have permission to assign users."
        : error.message;
      toast({ title: "Failed to assign user", description: message, variant: "destructive" });
    },
  });

  const removeUserFromJob = useMutation({
    mutationFn: async ({ userId, jobId }: { userId: string; jobId: string }) => {
      const { error } = await supabase
        .from("job_assignments")
        .delete()
        .eq("user_id", userId)
        .eq("job_id", jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "User removed from job successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to remove user", description: error.message, variant: "destructive" });
    },
  });

  return {
    assignments: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    assignUserToJob,
    removeUserFromJob,
  };
}

// Hook to get user's assigned jobs
export function useMyAssignedJobs() {
  const query = useQuery({
    queryKey: ["my-job-assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_assignments")
        .select(`
          *,
          jobs (*)
        `)
        .order("assigned_at", { ascending: false });

      if (error) throw error;
      return data as JobAssignmentWithJob[];
    },
  });

  return {
    assignedJobs: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
