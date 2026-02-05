 import { useMemo } from "react";
 import { Check, X } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface PasswordStrengthIndicatorProps {
   password: string;
 }
 
 interface Requirement {
   label: string;
   met: boolean;
 }
 
 export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
   const requirements = useMemo((): Requirement[] => {
     return [
       { label: "At least 6 characters", met: password.length >= 6 },
       { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
       { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
       { label: "Contains a number", met: /\d/.test(password) },
     ];
   }, [password]);
 
   const strength = useMemo(() => {
     const metCount = requirements.filter((r) => r.met).length;
     if (metCount === 0) return { level: 0, label: "", color: "" };
     if (metCount === 1) return { level: 1, label: "Weak", color: "bg-destructive" };
     if (metCount === 2) return { level: 2, label: "Fair", color: "bg-warning" };
     if (metCount === 3) return { level: 3, label: "Good", color: "bg-warning" };
     return { level: 4, label: "Strong", color: "bg-success" };
   }, [requirements]);
 
   if (!password) return null;
 
   return (
     <div className="mt-2 space-y-3" role="status" aria-live="polite">
       {/* Strength bar */}
       <div className="space-y-1">
         <div className="flex gap-1">
           {[1, 2, 3, 4].map((level) => (
             <div
               key={level}
               className={cn(
                 "h-1 flex-1 rounded-full transition-colors",
                 level <= strength.level ? strength.color : "bg-muted"
               )}
             />
           ))}
         </div>
         {strength.label && (
           <p className={cn(
             "text-xs font-medium",
             strength.level <= 1 && "text-destructive",
             strength.level === 2 && "text-warning",
             strength.level === 3 && "text-warning",
             strength.level === 4 && "text-success"
           )}>
             {strength.label}
           </p>
         )}
       </div>
 
       {/* Requirements checklist */}
       <ul className="space-y-1 text-xs">
         {requirements.map((req) => (
           <li
             key={req.label}
             className={cn(
               "flex items-center gap-2 transition-colors",
               req.met ? "text-success" : "text-muted-foreground"
             )}
           >
             {req.met ? (
               <Check className="w-3 h-3" aria-hidden="true" />
             ) : (
               <X className="w-3 h-3" aria-hidden="true" />
             )}
             <span>{req.label}</span>
           </li>
         ))}
       </ul>
     </div>
   );
 }