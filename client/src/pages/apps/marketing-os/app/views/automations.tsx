import { GlassCard } from "../components/glass-card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import {
  Zap,
  Plus,
  Play,
  Pause,
  Mail,
  MessageSquare,
  Clock,
  MousePointerClick,
  UserPlus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  status: "active" | "paused";
  runs: number;
  successRate: number;
  lastRun?: string;
}

const automations: Automation[] = [
  {
    id: "1",
    name: "Welcome Email Sequence",
    trigger: "Lead Created",
    actions: ["Send Welcome Email", "Wait 2 Days", "Send Resource Email", "Wait 3 Days", "Send Case Study"],
    status: "active",
    runs: 342,
    successRate: 98,
    lastRun: "5 minutes ago",
  },
  {
    id: "2",
    name: "Abandoned Cart Recovery",
    trigger: "Cart Abandoned (1 hour)",
    actions: ["Send Reminder Email", "Wait 24 Hours", "Send Discount Offer SMS"],
    status: "active",
    runs: 156,
    successRate: 87,
    lastRun: "12 minutes ago",
  },
  {
    id: "3",
    name: "High-Intent Lead Alert",
    trigger: "Intent Score > 90",
    actions: ["Notify Sales Team", "Send Priority Email", "Add to Hot Leads List"],
    status: "active",
    runs: 89,
    successRate: 100,
    lastRun: "1 hour ago",
  },
  {
    id: "4",
    name: "Re-engagement Campaign",
    trigger: "No Activity (30 days)",
    actions: ["Send Re-engagement Email", "Wait 7 Days", "Remove from Active List"],
    status: "paused",
    runs: 234,
    successRate: 65,
    lastRun: "3 days ago",
  },
];

const triggers = [
  { icon: UserPlus, label: "Lead Created", color: "text-blue-400" },
  { icon: MousePointerClick, label: "Link Clicked", color: "text-purple-400" },
  { icon: Mail, label: "Form Submitted", color: "text-emerald-400" },
  { icon: Clock, label: "Time Delay", color: "text-yellow-400" },
];

export function Automations() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Marketing Automations</h2>
          <p className="text-muted-foreground mt-1">Trigger-based workflows that run on autopilot</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
          <Plus className="h-4 w-4" />
          Create Automation
        </Button>
      </div>

      {/* Trigger Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {triggers.map((trigger) => {
          const Icon = trigger.icon;
          return (
            <GlassCard key={trigger.label} className="p-4 text-center" hover>
              <Icon className={`h-8 w-8 mx-auto mb-2 ${trigger.color}`} />
              <p className="text-sm font-medium">{trigger.label}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Automation List */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <GlassCard key={automation.id} className="p-6" hover>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{automation.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Trigger: <span className="font-medium text-foreground">{automation.trigger}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {automation.status === "active" ? "Active" : "Paused"}
                    </span>
                    <Switch checked={automation.status === "active"} />
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="p-4 rounded-lg bg-accent/30">
                <p className="text-sm font-medium mb-3">Workflow Steps:</p>
                <div className="space-y-2">
                  {automation.actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-xs font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 p-3 rounded-lg bg-background/50 border border-border">
                        <p className="text-sm">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Runs</span>
                  </div>
                  <p className="text-2xl font-semibold">{automation.runs}</p>
                </div>

                <div className="p-4 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    {automation.successRate >= 90 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                    )}
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                  </div>
                  <p
                    className={`text-2xl font-semibold ${
                      automation.successRate >= 90 ? "text-emerald-400" : "text-yellow-400"
                    }`}
                  >
                    {automation.successRate}%
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Last Run</span>
                  </div>
                  <p className="text-sm font-medium">{automation.lastRun}</p>
                </div>
              </div>

              {/* Status Badge */}
              {automation.status === "paused" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Pause className="h-4 w-4 text-yellow-400" />
                  <p className="text-sm text-yellow-400 font-medium">This automation is currently paused</p>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Visual Builder CTA */}
      <GlassCard className="p-6 border-2 border-dashed border-primary/30">
        <div className="text-center py-8">
          <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Build Custom Automation</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Use our drag-and-drop automation builder to create custom workflows tailored to your business
          </p>
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
            <Plus className="h-4 w-4" />
            Open Automation Builder
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
