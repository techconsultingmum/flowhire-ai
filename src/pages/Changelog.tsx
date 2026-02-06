import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";

const releases = [
  {
    version: "2.4.0",
    date: "February 2026",
    title: "AI Candidate Scoring",
    type: "feature",
    changes: [
      "Introduced AI-powered candidate scoring based on job requirements",
      "New scoring dashboard with detailed breakdowns",
      "Batch scoring for multiple candidates",
      "Customizable scoring criteria",
    ],
  },
  {
    version: "2.3.0",
    date: "January 2026",
    title: "Enhanced Pipeline Management",
    type: "feature",
    changes: [
      "Drag-and-drop pipeline stages",
      "Custom stage creation",
      "Automated stage transitions",
      "Stage-based email triggers",
    ],
  },
  {
    version: "2.2.1",
    date: "January 2026",
    title: "Bug Fixes & Improvements",
    type: "fix",
    changes: [
      "Fixed candidate search performance issues",
      "Resolved email notification delays",
      "Improved mobile responsiveness",
      "Various UI polish updates",
    ],
  },
  {
    version: "2.2.0",
    date: "December 2025",
    title: "Team Collaboration",
    type: "feature",
    changes: [
      "Role-based access control",
      "Team notes and comments on candidates",
      "Shared evaluation scorecards",
      "Activity feed for team visibility",
    ],
  },
  {
    version: "2.1.0",
    date: "November 2025",
    title: "Analytics Dashboard",
    type: "feature",
    changes: [
      "Comprehensive hiring analytics",
      "Time-to-hire metrics",
      "Source effectiveness tracking",
      "Custom report builder",
    ],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Changelog
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay up to date with everything new in Hireflow.
            </p>
          </div>

          {/* Releases */}
          <div className="space-y-12">
            {releases.map((release) => (
              <article key={release.version} className="border-l-2 border-primary/20 pl-6 relative">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1" />
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge variant="outline">{release.version}</Badge>
                  <Badge variant={release.type === "feature" ? "default" : "secondary"}>
                    {release.type === "feature" ? "Feature" : "Fix"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{release.date}</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-3">{release.title}</h2>
                <ul className="space-y-2">
                  {release.changes.map((change, index) => (
                    <li key={index} className="text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
