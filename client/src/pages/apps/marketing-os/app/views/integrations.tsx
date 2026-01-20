import { GlassCard } from "../components/glass-card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import {
  Plug,
  CheckCircle2,
  Mail,
  MessageSquare,
  Share2,
  FileText,
  Zap,
  Settings,
  ExternalLink,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "connected" | "disconnected";
  icon: any;
  features: string[];
  lastSync?: string;
}

const integrations: Integration[] = [
  {
    id: "1",
    name: "Mailchimp",
    category: "Email Marketing",
    description: "Send email campaigns and manage subscribers",
    status: "connected",
    icon: Mail,
    features: ["Email Campaigns", "List Management", "Automation"],
    lastSync: "5 minutes ago",
  },
  {
    id: "2",
    name: "Twilio",
    category: "SMS Provider",
    description: "Send SMS messages and manage phone numbers",
    status: "connected",
    icon: MessageSquare,
    features: ["SMS Campaigns", "2-Way Messaging", "Phone Numbers"],
    lastSync: "12 minutes ago",
  },
  {
    id: "3",
    name: "Facebook Ads",
    category: "Ad Platform",
    description: "Create and manage Facebook advertising campaigns",
    status: "connected",
    icon: Share2,
    features: ["Ad Creation", "Audience Targeting", "Performance Tracking"],
    lastSync: "1 hour ago",
  },
  {
    id: "4",
    name: "Google Ads",
    category: "Ad Platform",
    description: "Run search and display advertising on Google",
    status: "disconnected",
    icon: Share2,
    features: ["Search Ads", "Display Ads", "Video Ads"],
  },
  {
    id: "5",
    name: "Typeform",
    category: "Forms",
    description: "Create beautiful forms and capture leads",
    status: "connected",
    icon: FileText,
    features: ["Form Builder", "Lead Capture", "Conditional Logic"],
    lastSync: "3 hours ago",
  },
  {
    id: "6",
    name: "Zapier",
    category: "Automation",
    description: "Connect to 5000+ apps with Zapier integration",
    status: "disconnected",
    icon: Zap,
    features: ["App Connections", "Automation", "Data Sync"],
  },
];

const kaidenApps = [
  {
    name: "Kaiden CMS",
    description: "Content management for websites",
    status: "available",
  },
  {
    name: "Kaiden Analytics",
    description: "Advanced analytics platform",
    status: "available",
  },
  {
    name: "Kaiden Social",
    description: "Social media management",
    status: "coming-soon",
  },
];

export function Integrations() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Integrations</h2>
          <p className="text-muted-foreground mt-1">Connect your marketing tools and platforms</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connected</p>
              <p className="text-2xl font-semibold">
                {integrations.filter((i) => i.status === "connected").length}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Plug className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-semibold">{integrations.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kaiden Apps</p>
              <p className="text-2xl font-semibold">{kaidenApps.length}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Integrations Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <GlassCard key={integration.id} className="p-6" hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {integration.category}
                      </Badge>
                    </div>
                  </div>

                  <Switch checked={integration.status === "connected"} />
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {integration.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Status */}
                {integration.status === "connected" ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400">Connected</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</span>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full">
                    Connect {integration.name}
                  </Button>
                )}

                {/* Settings Button */}
                {integration.status === "connected" && (
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Kaiden Ecosystem */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Kaiden Ecosystem Apps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kaidenApps.map((app) => (
            <GlassCard key={app.name} className="p-6 border-2 border-primary/20" hover>
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold">{app.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
              {app.status === "available" ? (
                <Button variant="outline" className="w-full gap-2">
                  Connect App
                  <ExternalLink className="h-4 w-4" />
                </Button>
              ) : (
                <Badge variant="secondary" className="w-full justify-center">
                  Coming Soon
                </Badge>
              )}
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Custom Integration CTA */}
      <GlassCard className="p-6 border-2 border-dashed border-primary/30">
        <div className="text-center py-8">
          <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4">
            <Plug className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Need a Custom Integration?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Use our REST API to build custom integrations or request a new integration from our team
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline">View API Docs</Button>
            <Button className="bg-gradient-to-r from-primary to-primary/80">Request Integration</Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
