import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Settings() {
  const { profile, role, isLoading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Profile form state
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Notification preferences
  const [notifications, setNotifications] = useState({
    newApplications: true,
    interviewReminders: true,
    stageChanges: true,
    teamMentions: true,
    weeklyDigest: false,
  });

  // Sync form values when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    // Trim and validate inputs
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    
    if (!trimmedFirstName || !trimmedLastName) {
      toast.error("First name and last name are required");
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: trimmedFirstName,
          last_name: trimmedLastName,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;
      
      // Update local state with trimmed values
      setFirstName(trimmedFirstName);
      setLastName(trimmedLastName);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordErrors({});
    
    const validation = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setPasswordErrors(errors);
      return;
    }

    setIsChangingPassword(true);
    try {
      // Step 1: Re-authenticate with current password to verify identity
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error("User email not found. Please try logging in again.");
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (signInError) {
        setPasswordErrors({ currentPassword: "Current password is incorrect" });
        toast.error("Current password is incorrect");
        setIsChangingPassword(false);
        return;
      }
      
      // Step 2: Update to new password after successful verification
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;
      
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const roleLabel = role === "admin" ? "Admin" : role === "hiring_manager" ? "Hiring Manager" : "Recruiter";
  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : profile?.email?.substring(0, 2).toUpperCase() || "??";

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 max-w-4xl">
          <div>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-64 mt-2" />
          </div>
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="w-20 h-20 bg-gradient-to-br from-primary to-accent">
                  <AvatarFallback className="bg-transparent text-white text-2xl font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profile?.email}</p>
                  <p className="text-sm text-muted-foreground">{roleLabel}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile?.email || ""} 
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input 
                    value={roleLabel}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Contact an admin to change your role</p>
                </div>
              </div>
              <Button className="mt-6" onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-6">Password & Security</h3>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmNewPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
              <Button className="mt-6" onClick={handleChangePassword} disabled={isChangingPassword}>
                {isChangingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Password
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold mb-6">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: "newApplications", label: "New candidate applications", description: "Get notified when candidates apply" },
                  { key: "interviewReminders", label: "Interview reminders", description: "Receive reminders before scheduled interviews" },
                  { key: "stageChanges", label: "Stage changes", description: "Updates when candidates move through pipeline" },
                  { key: "teamMentions", label: "Team mentions", description: "When someone mentions you in notes" },
                  { key: "weeklyDigest", label: "Weekly digest", description: "Weekly summary of hiring activity" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl border border-border"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch 
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Note: Email notification preferences are stored locally. Full email integration coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
