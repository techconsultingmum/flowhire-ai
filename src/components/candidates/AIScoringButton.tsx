import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobs } from "@/hooks/use-jobs";
import { useCandidates } from "@/hooks/use-candidates";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, Star } from "lucide-react";

interface AIScoringButtonProps {
  candidateId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AIScoringButton({ candidateId, variant = "default", size = "default" }: AIScoringButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isScoring, setIsScoring] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState<string>("");

  const { jobs } = useJobs();
  const { candidates, updateCandidate } = useCandidates();
  const { toast } = useToast();

  const candidate = candidates.find((c) => c.id === candidateId);
  const activeJobs = jobs.filter((j) => j.status === "active");

  const handleScore = async () => {
    if (!selectedJobId || !candidate) return;

    const job = jobs.find((j) => j.id === selectedJobId);
    if (!job) return;

    setIsScoring(true);
    setScore(null);
    setReasoning("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-candidate-scoring", {
        body: {
          candidate: {
            name: `${candidate.first_name} ${candidate.last_name}`,
            skills: candidate.skills || [],
            notes: candidate.notes || "",
          },
          job: {
            title: job.title,
            department: job.department,
            description: job.description || "",
            requirements: job.requirements || [],
          },
        },
      });

      if (error) throw error;

      setScore(data.score);
      setReasoning(data.reasoning);

      // Update candidate's AI score
      await updateCandidate.mutateAsync({
        id: candidateId,
        ai_score: data.score,
      });

      toast({
        title: "AI Scoring Complete",
        description: `${candidate.first_name} scored ${data.score}% for ${job.title}`,
      });
    } catch (error) {
      console.error("AI scoring error:", error);
      toast({
        title: "Scoring Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI score",
        variant: "destructive",
      });
    } finally {
      setIsScoring(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset state when opening
      setScore(null);
      setReasoning("");
      setSelectedJobId("");
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Sparkles className="w-4 h-4" />
          {size === "icon" ? null : "AI Score"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Candidate Scoring
          </DialogTitle>
          <DialogDescription>
            Select a job to score {candidate?.first_name}'s fit based on skills and requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Job Position</label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a job to compare against" />
              </SelectTrigger>
              <SelectContent>
                {activeJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} - {job.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {score !== null && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-8 h-8 text-warning fill-warning" />
                <span className="text-4xl font-bold">{score}%</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">Match Score</p>
              {reasoning && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-2">AI Analysis:</p>
                  <p className="text-sm text-muted-foreground">{reasoning}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={handleScore} disabled={!selectedJobId || isScoring}>
              {isScoring && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isScoring ? "Analyzing..." : "Generate Score"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
