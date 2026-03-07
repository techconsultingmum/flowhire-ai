import { useState, useMemo } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Loader2, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { StageColumn } from "@/components/pipeline/StageColumn";
import { CandidateCard } from "@/components/pipeline/CandidateCard";
import { ApplicationFormDialog } from "@/components/pipeline/ApplicationFormDialog";
import { useApplications, PIPELINE_STAGES, ApplicationWithDetails } from "@/hooks/use-applications";
import { useJobs } from "@/hooks/use-jobs";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stageConfig = {
  applied: { name: "Applied", color: "border-muted-foreground", bgColor: "bg-muted/30" },
  screening: { name: "Screening", color: "border-blue-500", bgColor: "bg-blue-500/5" },
  interview: { name: "Interview", color: "border-purple-500", bgColor: "bg-purple-500/5" },
  offer: { name: "Offer", color: "border-warning", bgColor: "bg-warning/5" },
  hired: { name: "Hired", color: "border-success", bgColor: "bg-success/5" },
  rejected: { name: "Rejected", color: "border-destructive", bgColor: "bg-destructive/5" },
};

export default function Pipeline() {
  const [jobFilter, setJobFilter] = useState<string>("all");
  usePageTitle("Pipeline");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showRejected, setShowRejected] = useState(false);
  const navigate = useNavigate();

  const { applications, isLoading, updateApplicationStage } = useApplications();
  const { jobs } = useJobs();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredApplications = useMemo(() => {
    if (jobFilter === "all") return applications;
    return applications.filter((app) => app.job_id === jobFilter);
  }, [applications, jobFilter]);

  const applicationsByStage = useMemo(() => {
    const grouped: Record<string, ApplicationWithDetails[]> = {};
    PIPELINE_STAGES.filter(s => s !== "rejected").forEach((stage) => {
      grouped[stage] = filteredApplications.filter((app) => app.stage === stage);
    });
    return grouped;
  }, [filteredApplications]);

  const rejectedApplications = useMemo(() => {
    return filteredApplications.filter((app) => app.stage === "rejected");
  }, [filteredApplications]);

  const activeApplication = useMemo(() => {
    if (!activeId) return null;
    return applications.find((app) => app.id === activeId) || null;
  }, [activeId, applications]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const applicationId = active.id as string;
    const newStage = over.id as string;

    // Check if dropped on a stage column
    if (PIPELINE_STAGES.includes(newStage as any)) {
      const application = applications.find((app) => app.id === applicationId);
      if (application && application.stage !== newStage) {
        updateApplicationStage.mutate({ id: applicationId, stage: newStage });
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Pipeline</h1>
            <p className="text-muted-foreground mt-1">
              Drag and drop candidates through hiring stages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ApplicationFormDialog 
              defaultJobId={jobFilter !== "all" ? jobFilter : undefined} 
            />
          </div>
        </div>

        {/* Pipeline Board */}
        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <EmptyState
              icon={Users}
              title="No applications yet"
              description="Start by adding candidates and jobs, then create applications to track them through the pipeline."
            />
            <div className="mt-4">
              <ApplicationFormDialog defaultJobId={jobFilter !== "all" ? jobFilter : undefined} />
            </div>
          </div>
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-4 overflow-x-auto pb-4">
                {PIPELINE_STAGES.filter(s => s !== "rejected").map((stage) => (
                  <StageColumn
                    key={stage}
                    id={stage}
                    name={stageConfig[stage].name}
                    color={stageConfig[stage].color}
                    bgColor={stageConfig[stage].bgColor}
                    applications={applicationsByStage[stage] || []}
                  />
                ))}
              </div>
              <DragOverlay>
                {activeApplication ? (
                  <div className="w-80">
                    <CandidateCard application={activeApplication} />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {/* Rejected Candidates Section */}
            {rejectedApplications.length > 0 && (
              <div className="border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowRejected(!showRejected)}
                  className="w-full flex items-center justify-between p-4 bg-destructive/5 hover:bg-destructive/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <span className="font-semibold">Rejected</span>
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                      {rejectedApplications.length}
                    </Badge>
                  </div>
                  {showRejected ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {showRejected && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {rejectedApplications.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => navigate(`/candidates/${app.candidates.id}`)}
                        className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-foreground text-sm font-medium">
                              {app.candidates.first_name[0]}{app.candidates.last_name[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {app.candidates.first_name} {app.candidates.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {app.jobs.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Drag cards to move between stages</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span>AI Match Score</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
