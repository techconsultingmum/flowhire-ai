import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentCandidates } from "@/components/dashboard/RecentCandidates";
import { HiringFunnel } from "@/components/dashboard/HiringFunnel";
import { ActiveJobs } from "@/components/dashboard/ActiveJobs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Briefcase, Clock, TrendingUp } from "lucide-react";
import { useCandidates } from "@/hooks/use-candidates";
import { useJobs } from "@/hooks/use-jobs";
import { useApplications } from "@/hooks/use-applications";
import { useMemo } from "react";
import { differenceInDays } from "date-fns";

export default function Dashboard() {
  const { candidates, isLoading: candidatesLoading } = useCandidates();
  const { jobs, isLoading: jobsLoading } = useJobs();
  const { applications, isLoading: applicationsLoading } = useApplications();

  const isLoading = candidatesLoading || jobsLoading || applicationsLoading;

  const stats = useMemo(() => {
    const totalCandidates = candidates.length;
    const activeJobs = jobs.filter((j) => j.status === "active").length;
    
    // Calculate average time to hire (from applied to hired)
    const hiredApps = applications.filter((a) => a.stage === "hired");
    const avgTimeToHire = hiredApps.length > 0
      ? Math.round(
          hiredApps.reduce((sum, app) => {
            return sum + differenceInDays(new Date(app.stage_updated_at), new Date(app.applied_at));
          }, 0) / hiredApps.length
        )
      : 0;

    // Calculate offer acceptance rate
    const offerApps = applications.filter((a) => a.stage === "offer" || a.stage === "hired");
    const acceptedOffers = applications.filter((a) => a.stage === "hired").length;
    const offerAcceptRate = offerApps.length > 0
      ? Math.round((acceptedOffers / offerApps.length) * 100)
      : 0;

    return {
      totalCandidates,
      activeJobs,
      avgTimeToHire,
      offerAcceptRate,
    };
  }, [candidates, jobs, applications]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-72 mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
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
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your hiring.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Candidates"
            value={stats.totalCandidates}
            change={`${candidates.length} in database`}
            changeType="neutral"
            icon={Users}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs}
            change={`${jobs.length} total jobs`}
            changeType="neutral"
            icon={Briefcase}
            iconColor="text-accent"
            iconBgColor="bg-accent/10"
          />
          <StatsCard
            title="Avg. Time to Hire"
            value={stats.avgTimeToHire > 0 ? `${stats.avgTimeToHire} days` : "—"}
            change={stats.avgTimeToHire > 0 ? "From application to hire" : "No hires yet"}
            changeType="neutral"
            icon={Clock}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-500/10"
          />
          <StatsCard
            title="Offer Accept Rate"
            value={stats.offerAcceptRate > 0 ? `${stats.offerAcceptRate}%` : "—"}
            change={stats.offerAcceptRate > 0 ? "Based on offers extended" : "No offers yet"}
            changeType={stats.offerAcceptRate >= 80 ? "positive" : "neutral"}
            icon={TrendingUp}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentCandidates />
          </div>
          <div>
            <HiringFunnel />
          </div>
        </div>

        {/* Active Jobs */}
        <ActiveJobs />
      </div>
    </DashboardLayout>
  );
}
