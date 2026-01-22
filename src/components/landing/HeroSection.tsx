import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Recruiting Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Hire Smarter,{" "}
            <span className="gradient-text">Not Harder</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            The modern applicant tracking system that uses AI to streamline your hiring workflow and find the best candidates faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/login">
              <Button variant="hero" size="xl" className="group">
                Start Hiring Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-4xl font-bold">
                <Users className="w-8 h-8 text-primary" />
                <span>10K+</span>
              </div>
              <span className="text-muted-foreground">Companies Trust Us</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-4xl font-bold">
                <Zap className="w-8 h-8 text-accent" />
                <span>50%</span>
              </div>
              <span className="text-muted-foreground">Faster Time-to-Hire</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-4xl font-bold">
                <Sparkles className="w-8 h-8 text-purple-500" />
                <span>1M+</span>
              </div>
              <span className="text-muted-foreground">Candidates Processed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}