import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { JobFormDialog } from "@/components/jobs/JobFormDialog";
import { Briefcase, MapPin, Users, Search, Filter } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useJobs } from "@/hooks/use-jobs";
import { useApplications } from "@/hooks/use-applications";
import { useState, useMemo } from "react";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  draft: "bg-muted text-muted-foreground",
  paused: "bg-warning/10 text-warning",
  closed: "bg-destructive/10 text-destructive",
};

const formatSalary = (min: number | null, max: number | null) => {
  if (!min && !max) return null;
  const formatNum = (n: number) => {
    if (n >= 1000) return `$${Math.round(n / 1000)}k`;
    return `$${n}`;
  };
  if (min && max) return `${formatNum(min)} - ${formatNum(max)}`;
  if (min) return `${formatNum(min)}+`;
  if (max) return `Up to ${formatNum(max)}`;
  return null;
};

export default function Jobs() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { jobs, isLoading } = useJobs();
  const { applications } = useApplications();

  // Count applicants per job
  const jobsWithApplicants = useMemo(() => {
    return jobs.map((job) => ({
      ...job,
      applicantCount: applications.filter((a) => a.job_id === job.id).length,
    }));
  }, [jobs, applications]);

  const { searchQuery, setSearchQuery, filteredData: searchedJobs } = useSearch({
    data: jobsWithApplicants,
    searchKeys: ["title", "department", "location"],
  });

  const filteredJobs = useMemo(() => {
    return searchedJobs.filter((job) => {
      if (statusFilter !== "all" && job.status.toLowerCase() !== statusFilter) {
        return false;
      }
      if (departmentFilter !== "all" && job.department.toLowerCase() !== departmentFilter) {
        return false;
      }
      return true;
    });
  }, [searchedJobs, statusFilter, departmentFilter]);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(jobs.map((j) => j.department));
    return Array.from(depts).sort();
  }, [jobs]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
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
            <h1 className="text-3xl font-bold">Jobs</h1>
            <p className="text-muted-foreground mt-1">
              Manage your job postings and track applications.
            </p>
          </div>
          <JobFormDialog />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, department, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept.toLowerCase()}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all cursor-pointer hover-lift"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge className={statusColors[job.status] || statusColors.draft}>
                    {job.status}
                  </Badge>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-medium">{job.applicantCount}</span>
                    <span className="text-muted-foreground">applicants</span>
                  </span>
                  {formatSalary(job.salary_min, job.salary_max) && (
                    <span className="text-sm font-medium text-primary">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <EmptyState
              icon={Briefcase}
              title="No jobs found"
              description={searchQuery ? "Try adjusting your search or filters to find what you're looking for." : "Create your first job posting to get started."}
            />
            {!searchQuery && (
              <div className="mt-4">
                <JobFormDialog />
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
