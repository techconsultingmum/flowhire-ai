import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreVertical, Star, Calendar, Clock } from "lucide-react";

const stages = [
  {
    id: "applied",
    name: "Applied",
    color: "border-muted-foreground",
    bgColor: "bg-muted/30",
    candidates: [
      { id: 1, name: "Alex Rivera", role: "Frontend Developer", score: 72, initials: "AR", date: "Jan 18" },
      { id: 2, name: "Nina Patel", role: "UX Designer", score: 68, initials: "NP", date: "Jan 17" },
      { id: 3, name: "Tom Anderson", role: "Product Manager", score: 75, initials: "TA", date: "Jan 16" },
    ],
  },
  {
    id: "screening",
    name: "Screening",
    color: "border-blue-500",
    bgColor: "bg-blue-500/5",
    candidates: [
      { id: 4, name: "Maria Garcia", role: "Backend Engineer", score: 82, initials: "MG", date: "Jan 15" },
      { id: 5, name: "John Smith", role: "Data Analyst", score: 79, initials: "JS", date: "Jan 14" },
    ],
  },
  {
    id: "interview",
    name: "Interview",
    color: "border-purple-500",
    bgColor: "bg-purple-500/5",
    candidates: [
      { id: 6, name: "Sarah Chen", role: "Senior Frontend", score: 92, initials: "SC", date: "Jan 13" },
      { id: 7, name: "Lisa Wang", role: "Data Analyst", score: 90, initials: "LW", date: "Jan 12" },
      { id: 8, name: "Michael Lee", role: "DevOps Engineer", score: 88, initials: "ML", date: "Jan 11" },
    ],
  },
  {
    id: "offer",
    name: "Offer",
    color: "border-warning",
    bgColor: "bg-warning/5",
    candidates: [
      { id: 9, name: "Emily Johnson", role: "UX Designer", score: 88, initials: "EJ", date: "Jan 10" },
    ],
  },
  {
    id: "hired",
    name: "Hired",
    color: "border-success",
    bgColor: "bg-success/5",
    candidates: [
      { id: 10, name: "James Wilson", role: "DevOps Engineer", score: 95, initials: "JW", date: "Jan 8" },
    ],
  },
];

export default function Pipeline() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Pipeline</h1>
            <p className="text-muted-foreground mt-1">
              Drag and drop candidates through hiring stages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="pm">Product Manager</SelectItem>
                <SelectItem value="ux">UX Designer</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Candidate
            </Button>
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`flex-shrink-0 w-80 ${stage.bgColor} rounded-2xl border-2 ${stage.color} p-4`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{stage.name}</h3>
                  <span className="text-sm text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                    {stage.candidates.length}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Candidates */}
              <div className="space-y-3">
                {stage.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-card rounded-xl border border-border p-4 cursor-grab hover:shadow-md hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
                        <AvatarFallback className="bg-transparent text-white text-sm font-medium">
                          {candidate.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{candidate.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="font-medium">{candidate.score}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{candidate.date}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Button */}
                <button className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  + Add Candidate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Avg. time in stage: 3.5 days</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span>AI Match Score</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
