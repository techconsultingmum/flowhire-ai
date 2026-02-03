import { 
  Brain, 
  FileSearch, 
  GitBranch, 
  MessageSquare, 
  PieChart, 
  Sheet, 
  Upload, 
  Users2, 
  Webhook 
} from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Visual Pipeline",
    description: "Drag-and-drop candidates through customizable hiring stages with our intuitive Kanban board.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI Resume Parsing",
    description: "Automatically extract skills, experience, and qualifications from resumes in seconds.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: FileSearch,
    title: "Smart Scoring",
    description: "AI-powered candidate scoring based on job requirements and cultural fit analysis.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Users2,
    title: "Team Collaboration",
    description: "Leave feedback, share notes, and make collaborative hiring decisions in real-time.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Sheet,
    title: "Google Sheets Sync",
    description: "Import and export candidates via CSV. Keep your spreadsheets in sync automatically.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Webhook,
    title: "Webhooks & APIs",
    description: "Connect to Slack, WhatsApp, or any tool with customizable webhook notifications.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: PieChart,
    title: "Advanced Analytics",
    description: "Track hiring metrics, time-to-hire, and source effectiveness with beautiful dashboards.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: MessageSquare,
    title: "AI Interview Prep",
    description: "Generate tailored interview questions and evaluation criteria for each role.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: Upload,
    title: "Easy Job Posting",
    description: "Create and publish job postings across multiple platforms with one click.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section 
      id="features" 
      className="py-24 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Features</span>
          <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Hire the Best</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From AI-powered screening to seamless integrations, Hireflow has all the tools to transform your recruiting process.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
