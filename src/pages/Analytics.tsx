import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Clock, TrendingUp, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";

const timeToHireData = [
  { stage: "Applied → Screening", days: 2.3 },
  { stage: "Screening → Interview", days: 4.1 },
  { stage: "Interview → Offer", days: 5.8 },
  { stage: "Offer → Hired", days: 3.2 },
];

const sourceData = [
  { source: "LinkedIn", candidates: 145, hired: 12, rate: 8.3 },
  { source: "Indeed", candidates: 89, hired: 6, rate: 6.7 },
  { source: "Referrals", candidates: 34, hired: 8, rate: 23.5 },
  { source: "Company Website", candidates: 67, hired: 5, rate: 7.5 },
  { source: "Other", candidates: 28, hired: 2, rate: 7.1 },
];

const recruiterData = [
  { name: "Jane Cooper", hires: 15, avgTime: 14, offers: 18 },
  { name: "John Smith", hires: 12, avgTime: 16, offers: 14 },
  { name: "Sarah Chen", hires: 10, avgTime: 12, offers: 11 },
  { name: "Mike Johnson", hires: 8, avgTime: 18, offers: 10 },
];

export default function Analytics() {
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
          <Select defaultValue="30">
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
            value="1,234"
            change="+18% from last period"
            changeType="positive"
            icon={Users}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatsCard
            title="Avg. Time to Hire"
            value="15.4 days"
            change="-2.1 days from last period"
            changeType="positive"
            icon={Clock}
            iconColor="text-accent"
            iconBgColor="bg-accent/10"
          />
          <StatsCard
            title="Offer Accept Rate"
            value="87%"
            change="+3% from last period"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-success"
            iconBgColor="bg-success/10"
          />
          <StatsCard
            title="Quality of Hire"
            value="4.2/5"
            change="Stable"
            changeType="neutral"
            icon={Target}
            iconColor="text-purple-500"
            iconBgColor="bg-purple-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time to Hire by Stage */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Time to Hire by Stage</h3>
            <div className="space-y-4">
              {timeToHireData.map((item) => (
                <div key={item.stage} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.stage}</span>
                    <span className="text-muted-foreground">{item.days} days</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      style={{ width: `${(item.days / 6) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Average</span>
                <span className="text-lg font-bold">15.4 days</span>
              </div>
            </div>
          </div>

          {/* Source Effectiveness */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-6">Source Effectiveness</h3>
            <div className="space-y-4">
              {sourceData.map((item) => (
                <div
                  key={item.source}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.source}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.candidates} candidates · {item.hired} hired
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{item.rate}%</p>
                    <p className="text-xs text-muted-foreground">hire rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recruiter Performance */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6">Recruiter Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-4 text-sm font-medium text-muted-foreground">
                    Recruiter
                  </th>
                  <th className="text-left pb-4 text-sm font-medium text-muted-foreground">
                    Total Hires
                  </th>
                  <th className="text-left pb-4 text-sm font-medium text-muted-foreground">
                    Avg. Time to Hire
                  </th>
                  <th className="text-left pb-4 text-sm font-medium text-muted-foreground">
                    Offers Extended
                  </th>
                  <th className="text-left pb-4 text-sm font-medium text-muted-foreground">
                    Accept Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {recruiterData.map((recruiter) => {
                  const acceptRate = Math.round((recruiter.hires / recruiter.offers) * 100);
                  return (
                    <tr
                      key={recruiter.name}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-4 font-medium">{recruiter.name}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <span>{recruiter.hires}</span>
                          <ArrowUpRight className="w-4 h-4 text-success" />
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <span>{recruiter.avgTime} days</span>
                          {recruiter.avgTime <= 14 ? (
                            <ArrowDownRight className="w-4 h-4 text-success" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </td>
                      <td className="py-4">{recruiter.offers}</td>
                      <td className="py-4">
                        <span
                          className={
                            acceptRate >= 80 ? "text-success" : "text-muted-foreground"
                          }
                        >
                          {acceptRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
