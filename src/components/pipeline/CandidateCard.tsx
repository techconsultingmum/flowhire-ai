import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Calendar, GripVertical } from "lucide-react";
import { ApplicationWithDetails } from "@/hooks/use-applications";
 import { useNavigate } from "react-router-dom";

interface CandidateCardProps {
  application: ApplicationWithDetails;
}

export function CandidateCard({ application }: CandidateCardProps) {
  const navigate = useNavigate();
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the drag handle
    if ((e.target as HTMLElement).closest('[data-drag-handle]')) {
      return;
    }
    navigate(`/candidates/${candidate.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/candidates/${candidate.id}`);
        }
      }}
      aria-label={`View ${candidate.first_name} ${candidate.last_name}'s details`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          data-drag-handle
          className="cursor-grab active:cursor-grabbing mt-1"
          onClick={(e) => e.stopPropagation()}
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
