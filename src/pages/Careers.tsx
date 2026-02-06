import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building } from "lucide-react";

const openings = [
  {
    id: 1,
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: true,
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    remote: true,
  },
  {
    id: 3,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Austin, TX",
    type: "Full-time",
    remote: true,
  },
  {
    id: 4,
    title: "Machine Learning Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: false,
  },
  {
    id: 5,
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    remote: true,
  },
];

const perks = [
  "Competitive salary & equity",
  "Unlimited PTO",
  "Remote-first culture",
  "Health, dental & vision",
  "401(k) matching",
  "Learning & development budget",
  "Home office stipend",
  "Team offsites",
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us build the future of hiring. We're looking for passionate people who want to make a difference.
            </p>
          </div>

          {/* Why Join Us */}
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why Join Hireflow?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-3 bg-background rounded-lg p-4">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-foreground">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">Open Positions</h2>
            <div className="space-y-4">
              {openings.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </span>
                          {job.remote && (
                            <Badge variant="secondary">Remote OK</Badge>
                          )}
                        </CardDescription>
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* No Match CTA */}
          <div className="text-center mt-16">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Don't see a role that fits?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented people. Send us your resume and we'll keep you in mind.
            </p>
            <Button variant="outline">Send General Application</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
