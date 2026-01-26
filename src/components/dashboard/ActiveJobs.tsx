import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, MapPin, Users } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { useApplications } from "@/hooks/use-applications";
import { useMemo } from "react";
import { differenceInDays } from "date-fns";

export function ActiveJobs() {
  const { jobs, isLoading: jobsLoading } = useJobs();
  const { applications, isLoading: applicationsLoading } = useApplications();

  const isLoading = jobsLoading || applicationsLoading;

  // Get active jobs with applicant count
  const activeJobs = useMemo(() => {
    return jobs
      .filter((job) => job.status === "active")
      .slice(0, 4)
      .map((job) => ({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        applicants: applications.filter((a) => a.job_id === job.id).length,
        daysOpen: differenceInDays(new Date(), new Date(job.posted_date)),
      }));
  }, [jobs, applications]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Active Jobs</h3>
        <a href="/jobs" className="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeJobs.length > 0 ? (
          activeJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer hover-lift"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">{job.type}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {job.applicants} applicants
                </span>
                <span className="text-muted-foreground">{job.daysOpen} days open</span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-sm text-muted-foreground text-center py-4">
            No active jobs. Create a job to start receiving applications.
          </p>
        )}
      </div>
    </div>
  );
}
