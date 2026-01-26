import { useState, useEffect } from "react";
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
import { Plus, Loader2, Edit } from "lucide-react";

const candidateSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().max(20, "Phone number must be less than 20 characters").optional().or(z.literal("")),
  skills: z.string().optional(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  resume_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface CandidateFormDialogProps {
  trigger?: React.ReactNode;
  candidate?: Candidate;
}

export function CandidateFormDialog({ trigger, candidate }: CandidateFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { createCandidate, updateCandidate } = useCandidates();
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
      resume_url: "",
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
        resume_url: candidate.resume_url || "",
      });
    } else if (open && !candidate) {
      form.reset({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        skills: "",
        notes: "",
        resume_url: "",
      });
    }
  }, [open, candidate, form]);

  const onSubmit = async (values: CandidateFormValues) => {
    const skills = values.skills
      ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : null;

    if (isEditing && candidate) {
      await updateCandidate.mutateAsync({
        id: candidate.id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone || null,
        skills,
        notes: values.notes || null,
        resume_url: values.resume_url || null,
      });
    } else {
      await createCandidate.mutateAsync({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone || null,
        skills,
        notes: values.notes || null,
        resume_url: values.resume_url || null,
        ai_score: null,
      });
    }

    form.reset();
    setOpen(false);
  };

  const isPending = createCandidate.isPending || updateCandidate.isPending;

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

            <FormField
              control={form.control}
              name="resume_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/resume.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
