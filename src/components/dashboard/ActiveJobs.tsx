import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Users } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    applicants: 45,
    daysOpen: 12,
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    applicants: 78,
    daysOpen: 8,
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    applicants: 32,
    daysOpen: 5,
  },
  {
    id: 4,
    title: "Backend Engineer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    applicants: 56,
    daysOpen: 15,
  },
];

export function ActiveJobs() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Active Jobs</h3>
        <a href="/jobs" className="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {jobs.map((job) => (
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
        ))}
      </div>
    </div>
  );
}
