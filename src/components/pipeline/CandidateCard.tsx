import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Calendar, GripVertical } from "lucide-react";
import { ApplicationWithDetails } from "@/hooks/use-applications";

interface CandidateCardProps {
  application: ApplicationWithDetails;
}

export function CandidateCard({ application }: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const candidate = application.candidates;
  const initials = `${candidate.first_name[0]}${candidate.last_name[0]}`.toUpperCase();
  const appliedDate = new Date(application.applied_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-accent">
          <AvatarFallback className="bg-transparent text-white text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {candidate.first_name} {candidate.last_name}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            {application.jobs.title}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        {candidate.ai_score !== null ? (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-warning fill-warning" />
            <span className="font-medium">{candidate.ai_score}%</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No score</span>
        )}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{appliedDate}</span>
        </div>
      </div>
    </div>
  );
}
