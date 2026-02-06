import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Zap } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "People First",
    description: "We believe hiring is about finding the right people, not just filling positions. Our tools are designed to help you see candidates as individuals.",
  },
  {
    icon: Target,
    title: "Focused Innovation",
    description: "We don't chase every trend. We focus on solving real problems that recruiters and hiring managers face every day.",
  },
  {
    icon: Heart,
    title: "Candidate Experience",
    description: "A great hiring process benefits everyone. We help you create experiences that candidates will remember positively.",
  },
  {
    icon: Zap,
    title: "Efficiency Without Compromise",
    description: "Speed matters in hiring, but not at the cost of quality. Our AI helps you move faster while making better decisions.",
  },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-founder", image: "/placeholder.svg" },
  { name: "Marcus Johnson", role: "CTO & Co-founder", image: "/placeholder.svg" },
  { name: "Emily Rodriguez", role: "VP of Product", image: "/placeholder.svg" },
  { name: "David Kim", role: "VP of Engineering", image: "/placeholder.svg" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Making Hiring Human Again
            </h1>
            <p className="text-xl text-muted-foreground">
              We started Hireflow because we believe technology should enhance the human side of hiring, not replace it. Our mission is to help teams find great people faster while creating better experiences for everyone involved.
            </p>
          </div>

          {/* Our Story */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground">
              <p>
                Hireflow was born in 2023 when our founders, both experienced recruiters and engineers, realized that most hiring tools were built for processes, not people.
              </p>
              <p>
                After years of using clunky ATS systems that treated candidates as data points and made recruiters' lives harder, they set out to build something different—a platform that combines the power of modern AI with a deep understanding of what makes hiring truly successful.
              </p>
              <p>
                Today, Hireflow helps hundreds of companies streamline their hiring while keeping the human touch that great hiring requires. We're proud to be trusted by teams ranging from fast-growing startups to established enterprises.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Leadership Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Companies Trust Us</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Candidates Placed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">40%</div>
                <div className="text-muted-foreground">Faster Time-to-Hire</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
