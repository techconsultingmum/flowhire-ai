import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCandidates, Candidate } from "@/hooks/use-candidates";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, Edit, Upload, FileText, X } from "lucide-react";

const candidateSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().max(20, "Phone number must be less than 20 characters").optional().or(z.literal("")),
  skills: z.string().optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface CandidateFormDialogProps {
  trigger?: React.ReactNode;
  candidate?: Candidate;
}

export function CandidateFormDialog({ trigger, candidate }: CandidateFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createCandidate, updateCandidate } = useCandidates();
  const { toast } = useToast();
  const isEditing = !!candidate;

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      skills: "",
      notes: "",
    },
  });

  // Reset form when dialog opens with candidate data
  useEffect(() => {
    if (open && candidate) {
      form.reset({
        first_name: candidate.first_name,
        last_name: candidate.last_name,
        email: candidate.email,
        phone: candidate.phone || "",
        skills: candidate.skills?.join(", ") || "",
        notes: candidate.notes || "",
      });
      setExistingResumeUrl(candidate.resume_url);
      setResumeFile(null);
    } else if (open && !candidate) {
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        skills: "",
        notes: "",
      });
      setExistingResumeUrl(null);
      setResumeFile(null);
    }
  }, [open, candidate, form]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Resume must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
      setExistingResumeUrl(null);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setExistingResumeUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadResume = async (file: File, candidateId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${candidateId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    // Since bucket is private, we need to create a signed URL
    // Using 2-hour expiry for security - URLs should be regenerated when needed
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('resumes')
      .createSignedUrl(fileName, 60 * 60 * 2); // 2 hours expiry for security

    if (signedUrlError) {
      throw signedUrlError;
    }

    return signedUrlData.signedUrl;
  };

  const onSubmit = async (values: CandidateFormValues) => {
    setIsUploading(true);
    
    try {
      const skills = values.skills
        ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : null;

      let resumeUrl: string | null = existingResumeUrl;

      if (isEditing && candidate) {
        // Upload new resume if selected
        if (resumeFile) {
          resumeUrl = await uploadResume(resumeFile, candidate.id);
        }

        await updateCandidate.mutateAsync({
          id: candidate.id,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone || null,
          skills,
          notes: values.notes || null,
          resume_url: resumeUrl,
        });
      } else {
        // Create candidate first, then upload resume
        const newCandidate = await createCandidate.mutateAsync({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone || null,
          skills,
          notes: values.notes || null,
          resume_url: null,
          ai_score: null,
        });

        // Upload resume if provided
        if (resumeFile && newCandidate?.id) {
          resumeUrl = await uploadResume(resumeFile, newCandidate.id);
          await updateCandidate.mutateAsync({
            id: newCandidate.id,
            resume_url: resumeUrl,
          });
        }
      }

      form.reset();
      setResumeFile(null);
      setExistingResumeUrl(null);
      setOpen(false);
    } catch (error) {
      console.error("Error saving candidate:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save candidate",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = createCandidate.isPending || updateCandidate.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          isEditing ? (
            <Button variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
          ) : (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Candidate
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the candidate's information below."
              : "Enter the candidate's information below. All fields marked with * are required."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Input placeholder="React, TypeScript, Node.js (comma-separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume Upload */}
            <div className="space-y-2">
              <FormLabel>Resume</FormLabel>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {resumeFile || existingResumeUrl ? (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm truncate flex-1">
                    {resumeFile ? resumeFile.name : "Current resume"}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={removeResume}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-20 border-dashed gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Upload Resume</div>
                    <div className="text-xs text-muted-foreground">PDF or Word, max 5MB</div>
                  </div>
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about the candidate..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? "Save Changes" : "Add Candidate"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
