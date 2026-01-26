import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { CandidateCard } from "./CandidateCard";
import { ApplicationFormDialog } from "./ApplicationFormDialog";
import { ApplicationWithDetails } from "@/hooks/use-applications";

interface StageColumnProps {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  applications: ApplicationWithDetails[];
}

export function StageColumn({
  id,
  name,
  color,
  bgColor,
  applications,
}: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 ${bgColor} rounded-2xl border-2 ${color} p-4 transition-all ${
        isOver ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
    >
      {/* Stage Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold capitalize">{name}</h3>
          <span className="text-sm text-muted-foreground bg-background px-2 py-0.5 rounded-full">
            {applications.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Candidates */}
      <SortableContext
        items={applications.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[100px]">
          {applications.map((application) => (
            <CandidateCard key={application.id} application={application} />
          ))}
        </div>
      </SortableContext>

      {/* Add Button */}
      <ApplicationFormDialog
        trigger={
          <button className="w-full py-3 mt-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            + Add Candidate
          </button>
        }
      />
    </div>
  );
}
