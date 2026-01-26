import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCandidates } from "@/hooks/use-candidates";
import { useJobs } from "@/hooks/use-jobs";
import { useApplications } from "@/hooks/use-applications";
import { UserPlus, Loader2 } from "lucide-react";

const applicationSchema = z.object({
  candidate_id: z.string().min(1, "Please select a candidate"),
  job_id: z.string().min(1, "Please select a job"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormDialogProps {
  trigger?: React.ReactNode;
  defaultJobId?: string;
}

export function ApplicationFormDialog({ trigger, defaultJobId }: ApplicationFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { candidates } = useCandidates();
  const { jobs } = useJobs();
  const { applications, createApplication } = useApplications();

  const activeJobs = jobs.filter((j) => j.status === "active");

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      candidate_id: "",
      job_id: defaultJobId || "",
    },
  });

  // Filter out candidates who already have an application for the selected job
  const selectedJobId = form.watch("job_id");
  const availableCandidates = candidates.filter((candidate) => {
    if (!selectedJobId) return true;
    return !applications.some(
      (app) => app.candidate_id === candidate.id && app.job_id === selectedJobId
    );
  });

  const onSubmit = async (values: ApplicationFormValues) => {
    await createApplication.mutateAsync({
      candidate_id: values.candidate_id,
      job_id: values.job_id,
      stage: "applied",
    });

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add to Pipeline
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Candidate to Pipeline</DialogTitle>
          <DialogDescription>
            Select a candidate and job to create a new application.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="job_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Position *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeJobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} - {job.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="candidate_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a candidate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCandidates.length > 0 ? (
                        availableCandidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            {candidate.first_name} {candidate.last_name} - {candidate.email}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="_none" disabled>
                          {selectedJobId 
                            ? "All candidates already applied to this job" 
                            : "Select a job first"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createApplication.isPending}>
                {createApplication.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add to Pipeline
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
