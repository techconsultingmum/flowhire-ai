import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Mail, FileText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I add a new job posting?",
    answer: "Navigate to the Jobs page and click 'Add Job'. Fill in the job details including title, department, location, and requirements. You can save as draft or publish immediately.",
  },
  {
    question: "Can I import candidates from a spreadsheet?",
    answer: "Yes! Go to Candidates > Import and upload a CSV file. We support standard formats and will map columns automatically. You can review the mapping before confirming the import.",
  },
  {
    question: "How does AI candidate scoring work?",
    answer: "Our AI analyzes candidate resumes against job requirements to generate a fit score. It considers skills, experience, and other relevant factors. Scores help prioritize your pipeline but should complement, not replace, human judgment.",
  },
  {
    question: "Can I customize the pipeline stages?",
    answer: "Absolutely. Go to Settings > Pipeline to add, remove, or reorder stages. You can also set up automated actions for each stage, like sending emails when candidates move to a new stage.",
  },
  {
    question: "How do I invite team members?",
    answer: "Navigate to Settings > Team and click 'Invite Member'. Enter their email and select their role. They'll receive an invitation to join your Hireflow workspace.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use industry-standard encryption, regular security audits, and are compliant with GDPR and other privacy regulations. See our Security page for more details.",
  },
  {
    question: "Can I integrate with my existing tools?",
    answer: "We integrate with popular job boards, calendar apps, communication tools, and HR systems. Check our Integrations page for the full list of available connections.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel anytime from Settings > Billing. Your account will remain active until the end of your billing period. Data export is available before cancellation.",
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers, get support, and learn how to make the most of Hireflow.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Documentation</CardTitle>
                <CardDescription>Detailed guides and tutorials</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/docs">
                  <Button variant="outline" className="w-full">Browse Docs</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Live Chat</CardTitle>
                <CardDescription>Chat with our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Email Support</CardTitle>
                <CardDescription>Get help via email</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">Contact Us</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No results found. Try a different search term or{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  contact support
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
