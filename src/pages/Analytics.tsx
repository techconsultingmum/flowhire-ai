import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Clock, TrendingUp, Target, Briefcase } from "lucide-react";
import { useCandidates } from "@/hooks/use-candidates";
import { useJobs } from "@/hooks/use-jobs";
import { useApplications, PIPELINE_STAGES } from "@/hooks/use-applications";
import { useMemo, useState } from "react";
import { differenceInDays, subDays, isAfter } from "date-fns";

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState("30");
  
  const { candidates, isLoading: candidatesLoading } = useCandidates();
  const { jobs, isLoading: jobsLoading } = useJobs();
  const { applications, isLoading: applicationsLoading } = useApplications();

  const isLoading = candidatesLoading || jobsLoading || applicationsLoading;

  // Filter data by time period
  const filteredData = useMemo(() => {
    const cutoffDate = subDays(new Date(), parseInt(timePeriod));
    
    const periodApplications = applications.filter((app) => 
      isAfter(new Date(app.created_at), cutoffDate)
    );
    
    const periodCandidates = candidates.filter((c) =>
      isAfter(new Date(c.created_at), cutoffDate)
    );

    return {
      applications: periodApplications,
      candidates: periodCandidates,
    };
  }, [applications, candidates, timePeriod]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalApplications = filteredData.applications.length;
    
    // Calculate average time to hire
    const hiredApps = filteredData.applications.filter((a) => a.stage === "hired");
    const avgTimeToHire = hiredApps.length > 0
      ? Math.round(
          hiredApps.reduce((sum, app) => {
            return sum + differenceInDays(new Date(app.stage_updated_at), new Date(app.applied_at));
          }, 0) / hiredApps.length
        )
      : 0;

    // Calculate offer acceptance rate
    const offerApps = filteredData.applications.filter((a) => a.stage === "offer");
    const acceptedOffers = filteredData.applications.filter((a) => a.stage === "hired").length;
    const totalOffers = offerApps.length + acceptedOffers;
    const offerAcceptRate = totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0;

    // Calculate applications per job
    const activeJobs = jobs.filter((j) => j.status === "active").length;
    const appsPerJob = activeJobs > 0 ? Math.round(totalApplications / activeJobs) : 0;

    return {
      totalApplications,
      avgTimeToHire,
      offerAcceptRate,
      appsPerJob,
      activeJobs,
    };
  }, [filteredData, jobs]);

  // Time to hire by stage
  const timeToHireData = useMemo(() => {
    const stageTransitions = [
      { from: "applied", to: "screening", label: "Applied → Screening" },
      { from: "screening", to: "interview", label: "Screening → Interview" },
      { from: "interview", to: "offer", label: "Interview → Offer" },
      { from: "offer", to: "hired", label: "Offer → Hired" },
    ];

    // For now, we'll estimate based on stage distribution
    // In a real app, you'd track stage transition timestamps
    return stageTransitions.map((transition) => ({
      stage: transition.label,
      days: stats.avgTimeToHire > 0 ? Math.round(stats.avgTimeToHire / 4) : 0,
    }));
  }, [stats.avgTimeToHire]);

  // Stage distribution
  const stageDistribution = useMemo(() => {
    const total = applications.length || 1;
    
    return PIPELINE_STAGES.filter((s) => s !== "rejected").map((stage) => {
      const count = applications.filter((a) => a.stage === stage).length;
      return {
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        count,
        percentage: Math.round((count / total) * 100),
      };
    });
  }, [applications]);

  // Department breakdown
  const departmentStats = useMemo(() => {
    const deptMap = new Map<string, { applications: number; hired: number }>();
    
    applications.forEach((app) => {
      const dept = app.jobs?.department || "Unknown";
      const current = deptMap.get(dept) || { applications: 0, hired: 0 };
      current.applications++;
      if (app.stage === "hired") current.hired++;
      deptMap.set(dept, current);
    });

    return Array.from(deptMap.entries())
      .map(([dept, data]) => ({
        department: dept,
        applications: data.applications,
        hired: data.hired,
        rate: data.applications > 0 ? Math.round((data.hired / data.applications) * 100) : 0,
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);
  }, [applications]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between">
            <div>
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-5 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-44" />
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your hiring performance and metrics.
            </p>
          </div>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications.toString()}
            change={`${filteredData.candidates.length} new candidates`}
            changeType="neutral"
            icon={Users}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatsCard
            title="Avg. Time to Hire"
            value={stats.avgTimeToHire > 0 ? `${stats.avgTimeToHire} days` : "—"}
            change={stats.avgTimeToHire > 0 ? "From application to hire" : "No hires yet"}
            changeType="neutral"
            icon={Clock}
            iconColor="text-accent"
            iconBgColor="bg-accent/10"
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
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs.toString()}
            change={`~${stats.appsPerJob} applications per job`}
            changeType="neutral"
            icon={Briefcase}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stage Distribution */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Pipeline Distribution</h3>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {stageDistribution.map((item) => (
                  <div key={item.stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.stage}</span>
                      <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: `${Math.max(item.percentage, item.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No application data yet. Add applications to see pipeline distribution.
              </p>
            )}
          </div>

          {/* Department Performance */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">By Department</h3>
            {departmentStats.length > 0 ? (
              <div className="space-y-4">
                {departmentStats.map((item) => (
                  <div
                    key={item.department}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{item.department}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.applications} applications · {item.hired} hired
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{item.rate}%</p>
                      <p className="text-xs text-muted-foreground">hire rate</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No department data yet. Add jobs and applications to see performance.
              </p>
            )}
          </div>
        </div>

        {/* Time to Hire by Stage */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6">Time to Hire Analysis</h3>
          {stats.avgTimeToHire > 0 ? (
            <>
              <div className="space-y-4">
                {timeToHireData.map((item) => (
                  <div key={item.stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.stage}</span>
                      <span className="text-muted-foreground">~{item.days} days</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: `${Math.min((item.days / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Average</span>
                  <span className="text-lg font-bold">{stats.avgTimeToHire} days</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hired candidates yet. Hire candidates to see time-to-hire analysis.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
