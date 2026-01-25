import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidates } from "@/hooks/use-candidates";
import { useApplications } from "@/hooks/use-applications";
import { useJobs } from "@/hooks/use-jobs";
import { AIScoringButton } from "@/components/candidates/AIScoringButton";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Star,
  Calendar,
  Briefcase,
  MapPin,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

const stageColors: Record<string, string> = {
  applied: "bg-muted text-muted-foreground",
  screening: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  interview: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  offer: "bg-warning/10 text-warning",
  hired: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { candidates, isLoading: candidatesLoading } = useCandidates();
  const { applications, isLoading: applicationsLoading } = useApplications();
  const { jobs } = useJobs();

  const candidate = candidates.find((c) => c.id === id);
  const candidateApplications = applications.filter((a) => a.candidate_id === id);

  const isLoading = candidatesLoading || applicationsLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Candidate Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The candidate you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/candidates")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const initials = `${candidate.first_name[0]}${candidate.last_name[0]}`.toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/candidates")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {candidate.first_name} {candidate.last_name}
            </h1>
            <p className="text-muted-foreground">{candidate.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <AIScoringButton candidateId={candidate.id} />
            <Button variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <Avatar className="w-20 h-20 bg-gradient-to-br from-primary to-accent">
                    <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">
                          {candidate.email}
                        </a>
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${candidate.phone}`} className="hover:underline">
                            {candidate.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Added {format(new Date(candidate.created_at), "MMM d, yyyy")}</span>
                      </div>
                      {candidate.resume_url && (
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={candidate.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View Resume
                          </a>
                        </div>
                      )}
                    </div>

                    {candidate.ai_score !== null && (
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-warning fill-warning" />
                        <span className="text-lg font-bold">{candidate.ai_score}%</span>
                        <span className="text-sm text-muted-foreground">AI Match Score</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.notes ? (
                  <p className="text-sm whitespace-pre-wrap">{candidate.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No notes added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Application History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application History</CardTitle>
              </CardHeader>
              <CardContent>
                {candidateApplications.length > 0 ? (
                  <div className="space-y-4">
                    {candidateApplications.map((application) => {
                      const job = jobs.find((j) => j.id === application.job_id);
                      return (
                        <div key={application.id} className="border border-border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-sm">{job?.title || "Unknown Job"}</h4>
                              {job && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <Briefcase className="w-3 h-3" />
                                  <span>{job.department}</span>
                                  <span>•</span>
                                  <MapPin className="w-3 h-3" />
                                  <span>{job.location}</span>
                                </div>
                              )}
                            </div>
                            <Badge className={stageColors[application.stage] || stageColors.applied}>
                              {application.stage}
                            </Badge>
                          </div>
                          <Separator />
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Applied {format(new Date(application.applied_at), "MMM d, yyyy")}</span>
                          </div>
                          {application.notes && (
                            <p className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-2">
                              {application.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No applications yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
