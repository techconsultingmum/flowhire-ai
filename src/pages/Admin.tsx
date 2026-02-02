import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, Users, Loader2 } from "lucide-react";
import { useUserRoles, AppRole } from "@/hooks/use-user-roles";
import { useAuth } from "@/hooks/use-auth";
import { EmptyState } from "@/components/ui/empty-state";

const roleColors: Record<AppRole, string> = {
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  recruiter: "bg-primary/10 text-primary border-primary/20",
  hiring_manager: "bg-warning/10 text-warning border-warning/20",
};

const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  recruiter: "Recruiter",
  hiring_manager: "Hiring Manager",
};

export default function Admin() {
  const { users, isLoading, updateUserRole } = useUserRoles();
  const { user, role: currentUserRole } = useAuth();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    newRole: AppRole;
    userName: string;
  }>({ open: false, userId: "", newRole: "recruiter", userName: "" });

  const isAdmin = currentUserRole === "admin";

  const handleRoleChange = (userId: string, newRole: AppRole, userName: string) => {
    setConfirmDialog({ open: true, userId, newRole, userName });
  };

  const confirmRoleChange = () => {
    updateUserRole.mutate({
      userId: confirmDialog.userId,
      role: confirmDialog.newRole,
    });
    setConfirmDialog({ open: false, userId: "", newRole: "recruiter", userName: "" });
  };


  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Handle error state for non-admin users or network errors
  if (!isAdmin && !isLoading) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={Shield}
          title="Access Denied"
          description="You don't have permission to access the admin panel. Only administrators can manage user roles."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">
              Manage user roles and permissions.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{users.length} users</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Shield className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "admin").length}
                </p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "recruiter").length}
                </p>
                <p className="text-sm text-muted-foreground">Recruiters</p>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "hiring_manager").length}
                </p>
                <p className="text-sm text-muted-foreground">Hiring Managers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((userItem) => {
                const initials = `${userItem.first_name?.[0] || ""}${userItem.last_name?.[0] || ""}`.toUpperCase() || userItem.email[0].toUpperCase();
                const fullName = userItem.first_name && userItem.last_name
                  ? `${userItem.first_name} ${userItem.last_name}`
                  : userItem.email.split("@")[0];
                const isCurrentUser = userItem.user_id === user?.id;
                const joinedDate = new Date(userItem.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <TableRow key={userItem.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{fullName}</p>
                          {isCurrentUser && (
                            <span className="text-xs text-muted-foreground">(You)</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {userItem.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[userItem.role]}>
                        {roleLabels[userItem.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {joinedDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={userItem.role}
                        onValueChange={(value: AppRole) =>
                          handleRoleChange(userItem.user_id, value, fullName)
                        }
                        disabled={isCurrentUser}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="recruiter">Recruiter</SelectItem>
                          <SelectItem value="hiring_manager">Hiring Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change {confirmDialog.userName}'s role to{" "}
              <strong>{roleLabels[confirmDialog.newRole]}</strong>? This will
              update their permissions immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
