import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const candidates = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    stage: "Interview",
    score: 92,
    initials: "SC",
  },
  {
    id: 2,
    name: "Michael Brown",
    role: "Product Manager",
    stage: "Screening",
    score: 85,
    initials: "MB",
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "UX Designer",
    stage: "Offer",
    score: 88,
    initials: "EJ",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Backend Engineer",
    stage: "Applied",
    score: 78,
    initials: "DK",
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Data Analyst",
    stage: "Interview",
    score: 90,
    initials: "LW",
  },
];

const stageColors: Record<string, string> = {
  Applied: "bg-muted text-muted-foreground",
  Screening: "bg-blue-500/10 text-blue-600",
  Interview: "bg-purple-500/10 text-purple-600",
  Offer: "bg-success/10 text-success",
  Hired: "bg-success text-success-foreground",
  Rejected: "bg-destructive/10 text-destructive",
};

export function RecentCandidates() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Candidates</h3>
        <a href="/candidates" className="text-sm text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
              <AvatarFallback className="bg-transparent text-white text-sm font-medium">
                {candidate.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{candidate.name}</p>
              <p className="text-sm text-muted-foreground truncate">{candidate.role}</p>
            </div>
            <Badge className={stageColors[candidate.stage]}>{candidate.stage}</Badge>
            <div className="text-right">
              <p className="text-sm font-semibold">{candidate.score}%</p>
              <p className="text-xs text-muted-foreground">AI Score</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
