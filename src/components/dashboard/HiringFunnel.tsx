import { Skeleton } from "@/components/ui/skeleton";
import { useApplications, PIPELINE_STAGES } from "@/hooks/use-applications";
import { useMemo } from "react";

const stageConfig: Record<string, { name: string; color: string }> = {
  applied: { name: "Applied", color: "bg-muted-foreground" },
  screening: { name: "Screening", color: "bg-blue-500" },
  interview: { name: "Interview", color: "bg-purple-500" },
  offer: { name: "Offer", color: "bg-primary" },
  hired: { name: "Hired", color: "bg-success" },
};

export function HiringFunnel() {
  const { applications, isLoading } = useApplications();

  const stages = useMemo(() => {
    const total = applications.length || 1; // Avoid division by zero
    
    return PIPELINE_STAGES.filter((s) => s !== "rejected").map((stage) => {
      const count = applications.filter((a) => a.stage === stage).length;
      return {
        name: stageConfig[stage]?.name || stage,
        count,
        percentage: Math.round((count / total) * 100) || 0,
        color: stageConfig[stage]?.color || "bg-muted",
      };
    });
  }, [applications]);

  const conversionRate = useMemo(() => {
    const applied = applications.filter((a) => a.stage === "applied" || true).length; // All started as applied
    const hired = applications.filter((a) => a.stage === "hired").length;
    if (applied === 0) return "0";
    return ((hired / applied) * 100).toFixed(1);
  }, [applications]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Hiring Funnel</h3>
        <span className="text-sm text-muted-foreground">All time</span>
      </div>
      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stage.name}</span>
              <span className="text-muted-foreground">{stage.count} candidates</span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${stage.color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.max(stage.percentage, stage.count > 0 ? 5 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Conversion Rate</span>
          <span className="text-lg font-bold text-success">{conversionRate}%</span>
        </div>
      </div>
    </div>
  );
}
