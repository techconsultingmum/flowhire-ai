import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Rocket, Settings, Users, Zap, Shield, Search } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    icon: Rocket,
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    articles: ["Quick Start Guide", "Account Setup", "Inviting Team Members", "Your First Job Posting"],
  },
  {
    icon: Users,
    title: "Managing Candidates",
    description: "Track and organize your candidate pipeline",
    articles: ["Adding Candidates", "Pipeline Stages", "Candidate Scoring", "Bulk Actions"],
  },
  {
    icon: BookOpen,
    title: "Job Postings",
    description: "Create and manage job listings",
    articles: ["Creating Jobs", "Job Templates", "Publishing to Job Boards", "Application Forms"],
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Set up workflows and automations",
    articles: ["Email Templates", "Automated Actions", "Stage Triggers", "Scheduling"],
  },
  {
    icon: Settings,
    title: "Settings & Configuration",
    description: "Customize Hireflow for your team",
    articles: ["Team Settings", "Permissions", "Integrations", "Branding"],
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description: "Keep your data safe and compliant",
    articles: ["Data Security", "GDPR Compliance", "Access Logs", "Two-Factor Authentication"],
  },
];

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => article.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to get the most out of Hireflow.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search documentation..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredCategories.map((category) => (
              <Card key={category.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article}>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Help CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              Can't find what you're looking for?{" "}
              <a href="/contact" className="text-primary hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
