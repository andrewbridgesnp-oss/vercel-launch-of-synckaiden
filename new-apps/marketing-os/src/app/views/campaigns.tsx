import { GlassCard } from "../components/glass-card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Play,
  Pause,
  BarChart3,
  Users,
  DollarSign,
  Target,
  Copy,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  type: string;
  leads: number;
  conversions: number;
  spent: number;
  roi: number;
  progress: number;
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale 2026",
    status: "active",
    type: "Facebook + Email",
    leads: 342,
    conversions: 89,
    spent: 4280,
    roi: 385,
    progress: 68,
  },
  {
    id: "2",
    name: "Product Launch - Premium",
    status: "active",
    type: "Google Ads + Landing Page",
    leads: 156,
    conversions: 52,
    spent: 2840,
    roi: 412,
    progress: 45,
  },
  {
    id: "3",
    name: "Local Services Campaign",
    status: "paused",
    type: "Instagram + SMS",
    leads: 98,
    conversions: 34,
    spent: 1560,
    roi: 298,
    progress: 82,
  },
  {
    id: "4",
    name: "B2B Lead Generation",
    status: "draft",
    type: "LinkedIn + Email Sequence",
    leads: 0,
    conversions: 0,
    spent: 0,
    roi: 0,
    progress: 0,
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    draft: "bg-muted/50 text-muted-foreground border-border",
  };
  return colors[status as keyof typeof colors];
};

export function Campaigns() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Campaign Builder</h2>
          <p className="text-muted-foreground mt-1">Create and manage marketing campaigns</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((campaign) => (
          <GlassCard key={campaign.id} className="p-6" hover>
            <div className="flex flex-col gap-6">
              {/* Campaign Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)} variant="outline">
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{campaign.type}</p>
                </div>

                <div className="flex items-center gap-2">
                  {campaign.status === "active" && (
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  {campaign.status === "paused" && (
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  {campaign.status === "draft" && (
                    <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30">
                      <Play className="h-4 w-4 mr-2" />
                      Launch
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Leads</span>
                  </div>
                  <p className="text-2xl font-semibold">{campaign.leads}</p>
                </div>

                <div className="p-4 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Conversions</span>
                  </div>
                  <p className="text-2xl font-semibold">{campaign.conversions}</p>
                  {campaign.leads > 0 && (
                    <p className="text-xs text-emerald-400 mt-1">
                      {((campaign.conversions / campaign.leads) * 100).toFixed(1)}% rate
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-accent/30">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Spent</span>
                  </div>
                  <p className="text-2xl font-semibold">${campaign.spent.toLocaleString()}</p>
                  {campaign.leads > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ${(campaign.spent / campaign.leads).toFixed(2)} per lead
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">ROI</span>
                  </div>
                  <p className="text-2xl font-semibold text-primary">{campaign.roi}%</p>
                </div>
              </div>

              {/* Progress */}
              {campaign.status !== "draft" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Campaign Progress</span>
                    <span className="text-sm font-medium">{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <Button size="sm" variant="outline">
                  View Analytics
                </Button>
                <Button size="sm" variant="outline">
                  Edit Content
                </Button>
                <Button size="sm" variant="outline">
                  Adjust Budget
                </Button>
                <Button size="sm" variant="outline">
                  Export Report
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Campaign Builder Preview */}
      <GlassCard className="p-6 border-2 border-dashed border-primary/30">
        <div className="text-center py-8">
          <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Build Your First Campaign</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Use our visual campaign builder to create multi-channel marketing campaigns in minutes
          </p>
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
            <Plus className="h-4 w-4" />
            Open Campaign Builder
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
