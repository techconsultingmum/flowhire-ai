import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase, MapPin, Users, Plus, Search, Filter } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useState, useMemo } from "react";

const allJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    applicants: 45,
    status: "Active",
    postedDate: "2024-01-10",
    salary: "$150k - $180k",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    applicants: 78,
    status: "Active",
    postedDate: "2024-01-12",
    salary: "$130k - $160k",
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    applicants: 32,
    status: "Active",
    postedDate: "2024-01-15",
    salary: "$100k - $130k",
  },
  {
    id: 4,
    title: "Backend Engineer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    applicants: 56,
    status: "Active",
    postedDate: "2024-01-08",
    salary: "$140k - $170k",
  },
  {
    id: 5,
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
    applicants: 23,
    status: "Draft",
    postedDate: "2024-01-18",
    salary: "$90k - $120k",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Seattle, WA",
    type: "Full-time",
    applicants: 41,
    status: "Paused",
    postedDate: "2024-01-05",
    salary: "$160k - $190k",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Draft: "bg-muted text-muted-foreground",
  Paused: "bg-warning/10 text-warning",
  Closed: "bg-destructive/10 text-destructive",
};

export default function Jobs() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { searchQuery, setSearchQuery, filteredData: searchedJobs } = useSearch({
    data: allJobs,
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
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Job
          </Button>
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
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredJobs.length} of {allJobs.length} jobs
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
                  <Badge className={statusColors[job.status]}>{job.status}</Badge>
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
                    <span className="font-medium">{job.applicants}</span>
                    <span className="text-muted-foreground">applicants</span>
                  </span>
                  <span className="text-sm font-medium text-primary">{job.salary}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            description={searchQuery ? "Try adjusting your search or filters to find what you're looking for." : "Create your first job posting to get started."}
            actionLabel={searchQuery ? undefined : "Create Job"}
            onAction={searchQuery ? undefined : () => {}}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
