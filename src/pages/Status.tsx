import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

const services = [
  { name: "Web Application", status: "operational", uptime: "99.99%" },
  { name: "API", status: "operational", uptime: "99.98%" },
  { name: "Database", status: "operational", uptime: "99.99%" },
  { name: "Email Delivery", status: "operational", uptime: "99.95%" },
  { name: "File Storage", status: "operational", uptime: "99.99%" },
  { name: "AI Services", status: "operational", uptime: "99.90%" },
];

const incidents = [
  {
    date: "Feb 3, 2026",
    title: "Scheduled Maintenance",
    status: "completed",
    description: "Scheduled database maintenance completed successfully. No impact to users.",
  },
  {
    date: "Jan 28, 2026",
    title: "API Latency Issues",
    status: "resolved",
    description: "Some users experienced increased API response times. Issue was identified and resolved within 45 minutes.",
  },
  {
    date: "Jan 15, 2026",
    title: "Email Delivery Delays",
    status: "resolved",
    description: "Email notifications were delayed by up to 2 hours due to third-party provider issues.",
  },
];

const statusConfig = {
  operational: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500", label: "Operational" },
  degraded: { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500", label: "Degraded" },
  outage: { icon: XCircle, color: "text-red-500", bg: "bg-red-500", label: "Outage" },
};

export default function Status() {
  const allOperational = services.every(s => s.status === "operational");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              System Status
            </h1>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${allOperational ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
              {allOperational ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">All Systems Operational</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">Some Systems Degraded</span>
                </>
              )}
            </div>
          </div>

          {/* Services */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>Current status of all Hireflow services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => {
                  const config = statusConfig[service.status as keyof typeof statusConfig];
                  return (
                    <div key={service.name} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <config.icon className={`w-5 h-5 ${config.color}`} />
                        <span className="font-medium text-foreground">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                        <Badge variant="secondary" className={config.color}>
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Uptime Chart Placeholder */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>90-Day Uptime</CardTitle>
              <CardDescription>Historical availability across all services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-0.5">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 flex-1 rounded-sm ${i === 45 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    title={`Day ${90 - i}: ${i === 45 ? '99.5%' : '100%'}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>90 days ago</span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Incidents</h2>
            <div className="space-y-6">
              {incidents.map((incident, index) => (
                <div key={index} className="border-l-2 border-muted pl-6 relative">
                  <div className="absolute w-3 h-3 bg-muted rounded-full -left-[7px] top-1" />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-muted-foreground">{incident.date}</span>
                    <Badge variant={incident.status === "completed" ? "secondary" : "outline"}>
                      {incident.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{incident.title}</h3>
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subscribe */}
          <div className="text-center mt-16 bg-muted/50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Subscribe to Updates
            </h3>
            <p className="text-muted-foreground mb-6">
              Get notified about scheduled maintenance and service incidents.
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                RSS Feed
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Email Alerts
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                Slack
              </Badge>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
