import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const integrations = [
  {
    category: "Job Boards",
    items: [
      { name: "LinkedIn", description: "Post jobs and source candidates directly from LinkedIn.", status: "available" },
      { name: "Indeed", description: "Automatically sync job postings with Indeed.", status: "available" },
      { name: "Glassdoor", description: "Manage your employer brand and job listings.", status: "available" },
      { name: "ZipRecruiter", description: "Distribute jobs across multiple platforms.", status: "coming-soon" },
    ],
  },
  {
    category: "Communication",
    items: [
      { name: "Slack", description: "Get notifications and updates in your Slack channels.", status: "available" },
      { name: "Microsoft Teams", description: "Integrate hiring workflows with Teams.", status: "available" },
      { name: "Gmail", description: "Send and track emails directly from Hireflow.", status: "available" },
      { name: "Outlook", description: "Sync calendars and send emails via Outlook.", status: "available" },
    ],
  },
  {
    category: "HR & Onboarding",
    items: [
      { name: "Workday", description: "Seamlessly transfer hired candidates to Workday.", status: "available" },
      { name: "BambooHR", description: "Sync employee data with BambooHR.", status: "available" },
      { name: "Gusto", description: "Streamline payroll setup for new hires.", status: "coming-soon" },
      { name: "Rippling", description: "Automate onboarding workflows.", status: "coming-soon" },
    ],
  },
  {
    category: "Assessment & Testing",
    items: [
      { name: "HackerRank", description: "Send coding assessments to candidates.", status: "available" },
      { name: "Codility", description: "Technical screening integration.", status: "available" },
      { name: "TestGorilla", description: "Pre-employment testing suite.", status: "coming-soon" },
      { name: "Criteria", description: "Aptitude and personality assessments.", status: "coming-soon" },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Integrations
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect Hireflow with the tools you already use. Our growing ecosystem of integrations helps you build a seamless hiring workflow.
            </p>
          </div>

          {/* Integration Categories */}
          {integrations.map((category) => (
            <div key={category.category} className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">{category.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((integration) => (
                  <Card key={integration.name} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge 
                          variant={integration.status === "available" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {integration.status === "available" ? "Available" : "Coming Soon"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="text-center mt-16 bg-muted/50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Don't see what you need?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              We're always adding new integrations. Let us know what tools you'd like to connect with Hireflow.
            </p>
            <Link to="/contact">
              <Button>Request an Integration</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
