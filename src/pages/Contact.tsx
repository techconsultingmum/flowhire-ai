import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/use-page-title";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  company: z.string().max(200).optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export default function Contact() {
  usePageTitle("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      subject,
      message: formData.get("message") as string,
    };

    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message sent! We'll get back to you soon.");
    setIsSubmitting(false);
    setSubject("");
    setErrors({});
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a question or want to learn more about Hireflow? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Options */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Mail className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>
                    For general inquiries and support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="mailto:hello@hireflow.com" className="text-primary hover:underline">
                    hello@hireflow.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageSquare className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Live Chat</CardTitle>
                  <CardDescription>
                    Chat with our team in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Phone className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Call Us</CardTitle>
                  <CardDescription>
                    Mon-Fri, 9am-6pm PST
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a href="tel:+1-888-555-0123" className="text-primary hover:underline">
                    1-888-555-0123
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" className={errors.firstName ? "border-destructive" : ""} />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" className={errors.lastName ? "border-destructive" : ""} />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" className={errors.email ? "border-destructive" : ""} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className={errors.subject ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={5} 
                      placeholder="Tell us how we can help..."
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
