import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/use-page-title";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { toast } from "sonner";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/\d/, "Password must contain a number");

function hashFlagsFromUrl(): { recovery: boolean; errorDescription: string | null } {
  const hash = (typeof window !== "undefined" ? window.location.hash : "") || "";
  const stripped = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(stripped);
  return {
    recovery: params.get("type") === "recovery",
    errorDescription: params.get("error_description"),
  };
}

export default function ResetPassword() {
  usePageTitle("Reset Password");
  const navigate = useNavigate();

  const [isRecovery, setIsRecovery] = useState<boolean | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Supabase puts an error on the URL hash when a recovery link is expired
    // or otherwise rejected ("#error=access_denied&error_description=...").
    const { recovery, errorDescription } = hashFlagsFromUrl();
    if (errorDescription) {
      setLinkError(decodeURIComponent(errorDescription.replace(/\+/g, " ")));
      setIsRecovery(false);
      return;
    }
    if (recovery) setIsRecovery(true);

    // Supabase fires PASSWORD_RECOVERY when the user lands here via the email link.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });

    // Resolve a definitive state once we know whether a session exists.
    supabase.auth.getSession().then(({ data }) => {
      setIsRecovery((prev) => {
        if (prev !== null) return prev;
        return recovery && !!data.session ? true : false;
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const passwordIssue = useMemo(() => {
    if (!password) return null;
    const r = passwordSchema.safeParse(password);
    return r.success ? null : r.error.errors[0].message;
  }, [password]);

  const confirmIssue = useMemo(() => {
    if (!confirm) return null;
    return confirm === password ? null : "Passwords do not match";
  }, [confirm, password]);

  const canSubmit =
    !isLoading && !passwordIssue && !confirmIssue && password.length > 0 && confirm.length > 0;

  const logEvent = async (event: "password_reset_succeeded" | "password_reset_failed", reason?: string) => {
    try {
      await supabase.functions.invoke("log-password-reset", { body: { event, reason } });
    } catch {
      /* non-blocking */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const result = passwordSchema.safeParse(password);
    if (!result.success) newErrors.password = result.error.errors[0].message;
    if (password !== confirm) newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        await logEvent("password_reset_failed", error.message);
        toast.error(error.message);
        setErrors({ password: error.message });
        return;
      }
      await logEvent("password_reset_succeeded");
      setDone(true);
      toast.success("Password updated successfully");
      // Sign out so the user must log in with their new password.
      await supabase.auth.signOut();
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch {
      await logEvent("password_reset_failed", "unexpected_client_error");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while we determine whether this is a valid recovery session.
  if (isRecovery === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        data-testid="reset-loading"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (isRecovery === false) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        data-testid="reset-invalid"
      >
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold">Invalid or expired link</h1>
          <p className="text-muted-foreground">
            {linkError ??
              "This password reset link is no longer valid. Please request a new one."}
          </p>
          <Button onClick={() => navigate("/login", { replace: true })}>
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-background"
      data-testid="reset-form"
    >
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 shadow-sm">
        {done ? (
          <div className="flex flex-col items-center text-center space-y-4" data-testid="reset-success">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-xl font-semibold">Password updated</h1>
            <p className="text-sm text-muted-foreground">Redirecting you to sign in…</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Set a new password</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a strong password you haven't used before.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {(errors.password || passwordIssue) && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.password ?? passwordIssue}
                  </p>
                )}
                {password && <PasswordStrengthIndicator password={password} />}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    className={`pl-10 ${errors.confirm ? "border-destructive" : ""}`}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                {(errors.confirm || confirmIssue) && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.confirm ?? confirmIssue}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}