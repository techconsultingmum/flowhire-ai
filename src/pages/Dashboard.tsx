import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentCandidates } from "@/components/dashboard/RecentCandidates";
import { HiringFunnel } from "@/components/dashboard/HiringFunnel";
import { ActiveJobs } from "@/components/dashboard/ActiveJobs";
import { Users, Briefcase, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
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
            value="2,847"
            change="+12% from last month"
            changeType="positive"
            icon={Users}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatsCard
            title="Active Jobs"
            value="24"
            change="4 new this week"
            changeType="neutral"
            icon={Briefcase}
            iconColor="text-accent"
            iconBgColor="bg-accent/10"
          />
          <StatsCard
            title="Avg. Time to Hire"
            value="18 days"
            change="-3 days from last month"
            changeType="positive"
            icon={Clock}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-500/10"
          />
          <StatsCard
            title="Offer Accept Rate"
            value="89%"
            change="+5% from last month"
            changeType="positive"
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
