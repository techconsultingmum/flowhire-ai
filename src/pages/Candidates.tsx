import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateFormDialog } from "@/components/candidates/CandidateFormDialog";
import { AIScoringButton } from "@/components/candidates/AIScoringButton";
import { Search, Filter, Mail, Phone, FileText, Star, Users, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { usePagination } from "@/hooks/use-pagination";
import { useCandidates, Candidate } from "@/hooks/use-candidates";
import { useApplications } from "@/hooks/use-applications";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const stageColors: Record<string, string> = {
  applied: "bg-muted text-muted-foreground",
  screening: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  interview: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  offer: "bg-warning/10 text-warning",
  hired: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function Candidates() {
  const navigate = useNavigate();
  const [stageFilter, setStageFilter] = useState("all");
  const { candidates, isLoading: candidatesLoading } = useCandidates();
  const { applications } = useApplications();

  // Enrich candidates with their latest application stage
  const enrichedCandidates = useMemo(() => {
    return candidates.map((candidate) => {
      const candidateApps = applications.filter((a) => a.candidate_id === candidate.id);
      const latestApp = candidateApps.sort(
        (a, b) => new Date(b.stage_updated_at).getTime() - new Date(a.stage_updated_at).getTime()
      )[0];
      return {
        ...candidate,
        stage: latestApp?.stage || null,
        fullName: `${candidate.first_name} ${candidate.last_name}`,
        initials: `${candidate.first_name[0]}${candidate.last_name[0]}`.toUpperCase(),
      };
    });
  }, [candidates, applications]);

  const { searchQuery, setSearchQuery, filteredData: searchedCandidates } = useSearch({
    data: enrichedCandidates,
    searchKeys: ["fullName", "email", "skills"],
  });

  const filteredCandidates = useMemo(() => {
    return searchedCandidates.filter((candidate) => {
      if (stageFilter !== "all" && candidate.stage !== stageFilter) {
        return false;
      }
      return true;
    });
  }, [searchedCandidates, stageFilter]);

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
  } = usePagination({
    totalItems: filteredCandidates.length,
    itemsPerPage: 10,
  });

  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  if (candidatesLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
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
            <h1 className="text-3xl font-bold">Candidates</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your candidate applications.
            </p>
          </div>
          <CandidateFormDialog />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name, email, or skills..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredCandidates.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates
        </div>

        {/* Candidates List */}
        {paginatedCandidates.length > 0 ? (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Candidate
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Stage
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      AI Score
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                      Skills
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
                            <AvatarFallback className="bg-transparent text-white text-sm font-medium">
                              {candidate.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{candidate.fullName}</p>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {candidate.stage ? (
                          <Badge className={stageColors[candidate.stage] || stageColors.applied}>
                            {candidate.stage}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">No application</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {candidate.ai_score !== null ? (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <span className="font-semibold">{candidate.ai_score}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills?.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills && candidate.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => navigate(`/candidates/${candidate.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View profile</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => window.location.href = `mailto:${candidate.email}`}
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send email</TooltipContent>
                          </Tooltip>
                          {candidate.phone && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => window.location.href = `tel:${candidate.phone}`}
                                >
                                  <Phone className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Call candidate</TooltipContent>
                            </Tooltip>
                          )}
                          {candidate.resume_url && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => window.open(candidate.resume_url!, "_blank")}
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View resume</TooltipContent>
                            </Tooltip>
                          )}
                          <AIScoringButton candidateId={candidate.id} variant="ghost" size="icon" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={!canGoPrev}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={!canGoNext}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <EmptyState
              icon={Users}
              title="No candidates found"
              description={searchQuery ? "Try adjusting your search or filters to find what you're looking for." : "Add your first candidate to get started."}
            />
            {!searchQuery && (
              <div className="mt-4">
                <CandidateFormDialog />
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
