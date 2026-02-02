import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FileSpreadsheet, Webhook, MessageSquare, Mail, Calendar, Slack } from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: typeof FileSpreadsheet;
  iconColor: string;
  iconBg: string;
  connected: boolean;
  status: string;
}

const initialIntegrations: Integration[] = [
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Import and export candidates via CSV. Sync your hiring data automatically.",
    icon: FileSpreadsheet,
    iconColor: "text-green-600",
    iconBg: "bg-green-500/10",
    connected: true,
    status: "Active",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Send real-time notifications to any URL when hiring events occur.",
    icon: Webhook,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-500/10",
    connected: true,
    status: "3 active",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get instant notifications in your Slack channels for hiring updates.",
    icon: Slack,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-500/10",
    connected: true,
    status: "Active",
  },
  {
    id: "email",
    name: "Email Automation",
    description: "Automate candidate communication with customizable email templates.",
    icon: Mail,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-500/10",
    connected: false,
    status: "Not connected",
  },
  {
    id: "calendar",
    name: "Calendar Sync",
    description: "Sync interviews with Google Calendar or Outlook automatically.",
    icon: Calendar,
    iconColor: "text-red-600",
    iconBg: "bg-red-500/10",
    connected: false,
    status: "Not connected",
  },
  {
    id: "messaging",
    name: "WhatsApp / SMS",
    description: "Send messages to candidates via WhatsApp or SMS notifications.",
    icon: MessageSquare,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-500/10",
    connected: false,
    status: "Not connected",
  },
];

const initialWebhookEvents = [
  { event: "candidate.created", description: "When a new candidate is added", enabled: true },
  { event: "candidate.stage_changed", description: "When a candidate moves stages", enabled: true },
  { event: "interview.scheduled", description: "When an interview is scheduled", enabled: true },
  { event: "offer.extended", description: "When an offer is made", enabled: false },
  { event: "candidate.hired", description: "When a candidate is hired", enabled: true },
  { event: "candidate.rejected", description: "When a candidate is rejected", enabled: false },
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [webhookEvents, setWebhookEvents] = useState(initialWebhookEvents);

  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) => {
        if (integration.id === id) {
          const newConnected = !integration.connected;
          toast.success(
            newConnected
              ? `${integration.name} connected successfully`
              : `${integration.name} disconnected`
          );
          return {
            ...integration,
            connected: newConnected,
            status: newConnected ? "Active" : "Not connected",
          };
        }
        return integration;
      })
    );
  };

  const handleToggleWebhookEvent = (event: string) => {
    setWebhookEvents((prev) =>
      prev.map((item) => {
        if (item.event === event) {
          return { ...item, enabled: !item.enabled };
        }
        return item;
      })
    );
    toast.success("Webhook settings updated");
  };
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect Hireflow with your favorite tools and services.
          </p>
        </div>

        {/* Available Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${integration.iconBg} flex items-center justify-center`}
                >
                  <integration.icon className={`w-6 h-6 ${integration.iconColor}`} />
                </div>
                <Badge
                  variant={integration.connected ? "default" : "secondary"}
                  className={integration.connected ? "bg-success/10 text-success" : ""}
                >
                  {integration.status}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{integration.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
              <Button
                variant={integration.connected ? "outline" : "default"}
                className="w-full"
                onClick={() => handleToggleIntegration(integration.id)}
              >
                {integration.connected ? "Configure" : "Connect"}
              </Button>
            </div>
          ))}
        </div>

        {/* Webhook Events */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Webhook Events</h3>
              <p className="text-sm text-muted-foreground">
                Choose which events trigger webhook notifications.
              </p>
            </div>
            <Button variant="outline">Add Webhook URL</Button>
          </div>
          <div className="space-y-4">
            {webhookEvents.map((item) => (
              <div
                key={item.event}
                className="flex items-center justify-between p-4 rounded-xl border border-border"
              >
                <div>
                  <p className="font-medium font-mono text-sm">{item.event}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch 
                  checked={item.enabled} 
                  onCheckedChange={() => handleToggleWebhookEvent(item.event)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">API Access</h3>
              <p className="text-sm text-muted-foreground">
                Manage your API keys for custom integrations.
              </p>
            </div>
            <Button>Generate API Key</Button>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-dashed border-border">
            <p className="text-sm text-muted-foreground text-center">
              No API keys generated yet. Create one to start building custom integrations.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
