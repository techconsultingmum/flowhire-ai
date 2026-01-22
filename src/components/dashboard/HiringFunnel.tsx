const stages = [
  { name: "Applied", count: 245, percentage: 100, color: "bg-muted-foreground" },
  { name: "Screening", count: 180, percentage: 73, color: "bg-blue-500" },
  { name: "Interview", count: 95, percentage: 39, color: "bg-purple-500" },
  { name: "Offer", count: 28, percentage: 11, color: "bg-primary" },
  { name: "Hired", count: 18, percentage: 7, color: "bg-success" },
];

export function HiringFunnel() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Hiring Funnel</h3>
        <span className="text-sm text-muted-foreground">Last 30 days</span>
      </div>
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stage.name}</span>
              <span className="text-muted-foreground">{stage.count} candidates</span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${stage.color} rounded-full transition-all duration-500`}
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Conversion Rate</span>
          <span className="text-lg font-bold text-success">7.3%</span>
        </div>
      </div>
    </div>
  );
}
