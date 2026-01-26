import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidates } from "@/hooks/use-candidates";
import { useApplications } from "@/hooks/use-applications";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const stageColors: Record<string, string> = {
  applied: "bg-muted text-muted-foreground",
  screening: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  interview: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  offer: "bg-warning/10 text-warning",
  hired: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export function RecentCandidates() {
  const navigate = useNavigate();
  const { candidates, isLoading: candidatesLoading } = useCandidates();
  const { applications, isLoading: applicationsLoading } = useApplications();

  const isLoading = candidatesLoading || applicationsLoading;

  // Get recent candidates with their latest stage
  const recentCandidates = useMemo(() => {
    return candidates.slice(0, 5).map((candidate) => {
      const candidateApps = applications.filter((a) => a.candidate_id === candidate.id);
      const latestApp = candidateApps.sort(
        (a, b) => new Date(b.stage_updated_at).getTime() - new Date(a.stage_updated_at).getTime()
      )[0];
      
      return {
        id: candidate.id,
        name: `${candidate.first_name} ${candidate.last_name}`,
        role: latestApp?.jobs?.title || "No application",
        stage: latestApp?.stage || null,
        score: candidate.ai_score,
        initials: `${candidate.first_name[0]}${candidate.last_name[0]}`.toUpperCase(),
      };
    });
  }, [candidates, applications]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Candidates</h3>
        <a href="/candidates" className="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {recentCandidates.length > 0 ? (
          recentCandidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => navigate(`/candidates/${candidate.id}`)}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
                <AvatarFallback className="bg-transparent text-white text-sm font-medium">
                  {candidate.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{candidate.name}</p>
                <p className="text-sm text-muted-foreground truncate">{candidate.role}</p>
              </div>
              {candidate.stage ? (
                <Badge className={stageColors[candidate.stage] || stageColors.applied}>
                  {candidate.stage}
                </Badge>
              ) : (
                <Badge variant="outline">New</Badge>
              )}
              <div className="text-right">
                <p className="text-sm font-semibold">{candidate.score ?? "—"}%</p>
                <p className="text-xs text-muted-foreground">AI Score</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No candidates yet. Add your first candidate to get started.
          </p>
        )}
      </div>
    </div>
  );
}
