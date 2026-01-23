import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Filter, Mail, Phone, FileText, Star, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { usePagination } from "@/hooks/use-pagination";
import { useState, useMemo } from "react";

const allCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    role: "Senior Frontend Developer",
    stage: "Interview",
    score: 92,
    initials: "SC",
    skills: ["React", "TypeScript", "Node.js"],
    appliedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 (555) 234-5678",
    role: "Product Manager",
    stage: "Screening",
    score: 85,
    initials: "MB",
    skills: ["Strategy", "Agile", "Analytics"],
    appliedDate: "2024-01-14",
  },
  {
    id: 3,
    name: "Emily Johnson",
    email: "emily.j@email.com",
    phone: "+1 (555) 345-6789",
    role: "UX Designer",
    stage: "Offer",
    score: 88,
    initials: "EJ",
    skills: ["Figma", "User Research", "Prototyping"],
    appliedDate: "2024-01-13",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    role: "Backend Engineer",
    stage: "Applied",
    score: 78,
    initials: "DK",
    skills: ["Python", "Django", "PostgreSQL"],
    appliedDate: "2024-01-16",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    phone: "+1 (555) 567-8901",
    role: "Data Analyst",
    stage: "Interview",
    score: 90,
    initials: "LW",
    skills: ["SQL", "Python", "Tableau"],
    appliedDate: "2024-01-12",
  },
  {
    id: 6,
    name: "James Wilson",
    email: "j.wilson@email.com",
    phone: "+1 (555) 678-9012",
    role: "DevOps Engineer",
    stage: "Hired",
    score: 95,
    initials: "JW",
    skills: ["AWS", "Kubernetes", "Terraform"],
    appliedDate: "2024-01-10",
  },
  {
    id: 7,
    name: "Amanda Martinez",
    email: "amanda.m@email.com",
    phone: "+1 (555) 789-0123",
    role: "Senior Backend Engineer",
    stage: "Interview",
    score: 87,
    initials: "AM",
    skills: ["Java", "Spring Boot", "MongoDB"],
    appliedDate: "2024-01-09",
  },
  {
    id: 8,
    name: "Robert Taylor",
    email: "r.taylor@email.com",
    phone: "+1 (555) 890-1234",
    role: "Full Stack Developer",
    stage: "Screening",
    score: 81,
    initials: "RT",
    skills: ["React", "Node.js", "PostgreSQL"],
    appliedDate: "2024-01-08",
  },
];

const stageColors: Record<string, string> = {
  Applied: "bg-muted text-muted-foreground",
  Screening: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Interview: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Offer: "bg-warning/10 text-warning",
  Hired: "bg-success/10 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};

export default function Candidates() {
  const [stageFilter, setStageFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  const { searchQuery, setSearchQuery, filteredData: searchedCandidates } = useSearch({
    data: allCandidates,
    searchKeys: ["name", "email", "role", "skills"],
  });

  const filteredCandidates = useMemo(() => {
    return searchedCandidates.filter((candidate) => {
      if (stageFilter !== "all" && candidate.stage.toLowerCase() !== stageFilter) {
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
    itemsPerPage: 5,
  });

  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

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
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name, email, role, or skills..."
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
            </SelectContent>
          </Select>
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="frontend">Frontend Developer</SelectItem>
              <SelectItem value="pm">Product Manager</SelectItem>
              <SelectItem value="ux">UX Designer</SelectItem>
              <SelectItem value="backend">Backend Engineer</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates
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
                      Role
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
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
                            <AvatarFallback className="bg-transparent text-white text-sm font-medium">
                              {candidate.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{candidate.role}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={stageColors[candidate.stage]}>{candidate.stage}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-semibold">{candidate.score}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Send email">
                                <Mail className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send email</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Call candidate">
                                <Phone className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Call candidate</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View resume">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View resume</TooltipContent>
                          </Tooltip>
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
          <EmptyState
            icon={Users}
            title="No candidates found"
            description={searchQuery ? "Try adjusting your search or filters to find what you're looking for." : "Add your first candidate to get started."}
            actionLabel={searchQuery ? undefined : "Add Candidate"}
            onAction={searchQuery ? undefined : () => {}}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
