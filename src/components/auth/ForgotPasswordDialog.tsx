 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
 import { z } from "zod";
 
 const emailSchema = z.string().email("Please enter a valid email address");
 
 export function ForgotPasswordDialog() {
   const [open, setOpen] = useState(false);
   const [email, setEmail] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const [sent, setSent] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError("");
 
     const result = emailSchema.safeParse(email);
     if (!result.success) {
       setError(result.error.errors[0].message);
       return;
     }
 
     setIsLoading(true);
 
     try {
       const { error: resetError } = await supabase.auth.resetPasswordForEmail(
         email,
         { redirectTo: `${window.location.origin}/login` }
       );
 
       if (resetError) {
         toast.error(resetError.message);
         setError(resetError.message);
       } else {
         setSent(true);
         toast.success("Password reset email sent!");
       }
     } catch (err) {
       toast.error("An unexpected error occurred");
     } finally {
       setIsLoading(false);
     }
   };
 
   const handleOpenChange = (isOpen: boolean) => {
     setOpen(isOpen);
     if (!isOpen) {
       // Reset state when closing
       setTimeout(() => {
         setEmail("");
         setError("");
         setSent(false);
       }, 200);
     }
   };
 
   return (
     <Dialog open={open} onOpenChange={handleOpenChange}>
       <DialogTrigger asChild>
         <button
           type="button"
           className="text-sm text-primary hover:underline"
         >
           Forgot password?
         </button>
       </DialogTrigger>
       <DialogContent className="sm:max-w-md">
         {sent ? (
           <div className="flex flex-col items-center text-center py-6">
             <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
               <CheckCircle2 className="w-8 h-8 text-success" />
             </div>
             <DialogHeader className="space-y-2">
               <DialogTitle>Check your email</DialogTitle>
               <DialogDescription>
                 We've sent a password reset link to <strong>{email}</strong>. 
                 Please check your inbox and follow the instructions.
               </DialogDescription>
             </DialogHeader>
             <Button
               className="mt-6"
               onClick={() => handleOpenChange(false)}
             >
               Back to Sign In
             </Button>
           </div>
         ) : (
           <>
             <DialogHeader>
               <DialogTitle>Reset your password</DialogTitle>
               <DialogDescription>
                 Enter your email address and we'll send you a link to reset your password.
               </DialogDescription>
             </DialogHeader>
             <form onSubmit={handleSubmit} className="space-y-4 mt-4">
               <div className="space-y-2">
                 <Label htmlFor="reset-email">Email</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input
                     id="reset-email"
                     type="email"
                     placeholder="you@company.com"
                     className={`pl-10 ${error ? "border-destructive" : ""}`}
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     disabled={isLoading}
                   />
                 </div>
                 {error && (
                   <p className="text-sm text-destructive">{error}</p>
                 )}
               </div>
               <div className="flex gap-3">
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => handleOpenChange(false)}
                   disabled={isLoading}
                   className="flex-1"
                 >
                   <ArrowLeft className="w-4 h-4 mr-2" />
                   Back
                 </Button>
                 <Button
                   type="submit"
                   disabled={isLoading}
                   className="flex-1"
                 >
                   {isLoading ? (
                     <>
                       <Loader2 className="w-4 h-4 animate-spin mr-2" />
                       Sending...
                     </>
                   ) : (
                     "Send Reset Link"
                   )}
                 </Button>
               </div>
             </form>
           </>
         )}
       </DialogContent>
     </Dialog>
   );
 }