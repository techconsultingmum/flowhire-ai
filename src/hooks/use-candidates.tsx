import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  skills: string[] | null;
  notes: string | null;
  ai_score: number | null;
  created_at: string;
  updated_at: string;
}

export type CandidateInsert = Omit<Candidate, "id" | "created_at" | "updated_at">;
export type CandidateUpdate = Partial<CandidateInsert>;

export function useCandidates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Candidate[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("candidates-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "candidates" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["candidates"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createCandidate = useMutation({
    mutationFn: async (candidate: CandidateInsert) => {
      const { data, error } = await supabase
        .from("candidates")
        .insert(candidate)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast({ 
        title: "Candidate added successfully",
        description: `${data.first_name} ${data.last_name} has been added to your database.`,
      });
    },
    onError: (error) => {
      const message = error.message.includes("duplicate")
        ? "A candidate with this email already exists."
        : error.message.includes("permission")
        ? "You don't have permission to add candidates."
        : error.message;
      toast({ title: "Failed to add candidate", description: message, variant: "destructive" });
    },
  });

  const updateCandidate = useMutation({
    mutationFn: async ({ id, ...updates }: CandidateUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("candidates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast({ title: "Candidate updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update candidate", description: error.message, variant: "destructive" });
    },
  });

  const deleteCandidate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("candidates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      toast({ title: "Candidate deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete candidate", description: error.message, variant: "destructive" });
    },
  });

  return {
    candidates: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createCandidate,
    updateCandidate,
    deleteCandidate,
  };
}
