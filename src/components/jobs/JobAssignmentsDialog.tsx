import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useJobAssignments } from "@/hooks/use-job-assignments";
import { useUserRoles, type UserWithRole } from "@/hooks/use-user-roles";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserPlus, UserMinus, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobAssignmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
}

export function JobAssignmentsDialog({
  open,
  onOpenChange,
  jobId,
  jobTitle,
}: JobAssignmentsDialogProps) {
  const { role } = useAuth();
  const { assignments, isLoading: assignmentsLoading, assignUserToJob, removeUserFromJob } = useJobAssignments(jobId);
  const { users, isLoading: usersLoading } = useUserRoles();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const isAdmin = role === "admin";
  const assignedUserIds = new Set(assignments.map(a => a.user_id));
  const availableUsers = users.filter(u => !assignedUserIds.has(u.user_id));

  const handleAssign = async () => {
    if (!selectedUserId) return;
    
    await assignUserToJob.mutateAsync({ userId: selectedUserId, jobId });
    setSelectedUserId("");
  };

  const handleRemove = async (userId: string) => {
    await removeUserFromJob.mutateAsync({ userId, jobId });
  };

  const getInitials = (user: UserWithRole) => {
    const first = user.first_name?.[0] || "";
    const last = user.last_name?.[0] || "";
    return (first + last).toUpperCase() || user.email[0].toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "recruiter":
        return "default";
      case "hiring_manager":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Job Assignments
          </DialogTitle>
          <DialogDescription>
            Assign team members to "{jobTitle}" to give them access to candidates and applications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new assignment */}
          {isAdmin && (
            <div className="flex gap-2">
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
                disabled={usersLoading || availableUsers.length === 0}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={
                    usersLoading 
                      ? "Loading users..." 
                      : availableUsers.length === 0 
                        ? "All users assigned" 
                        : "Select a user to assign"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      <div className="flex items-center gap-2">
                        <span>
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          ({user.email})
                        </span>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="ml-1 text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAssign} 
                disabled={!selectedUserId || assignUserToJob.isPending}
              >
                {assignUserToJob.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          {/* Current assignments */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Assigned Team Members ({assignments.length})
            </h4>
            
            {assignmentsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No team members assigned yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {assignments.map((assignment) => {
                  const user = users.find(u => u.user_id === assignment.user_id);
                  
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user ? getInitials(user) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                        {user && (
                          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                      
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(assignment.user_id)}
                          disabled={removeUserFromJob.isPending}
                          aria-label="Remove user from job"
                        >
                          {removeUserFromJob.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserMinus className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
