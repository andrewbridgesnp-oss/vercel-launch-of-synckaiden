import { GlassCard } from "../components/glass-card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Search,
  Filter,
  TrendingUp,
  Mail,
  Phone,
  MessageSquare,
  MoreVertical,
  Shield,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  intentScore: number;
  trustScore: number;
  status: "new" | "contacted" | "qualified" | "converted";
  createdAt: string;
  lastActivity: string;
}

const leads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    source: "Facebook Ads",
    intentScore: 92,
    trustScore: 88,
    status: "new",
    createdAt: "2 hours ago",
    lastActivity: "Viewed pricing page 3 times",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@startup.io",
    source: "Google Search",
    intentScore: 85,
    trustScore: 95,
    status: "contacted",
    createdAt: "5 hours ago",
    lastActivity: "Downloaded whitepaper",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@enterprise.com",
    source: "LinkedIn Campaign",
    intentScore: 78,
    trustScore: 82,
    status: "qualified",
    createdAt: "1 day ago",
    lastActivity: "Replied to email sequence",
  },
  {
    id: "4",
    name: "David Park",
    email: "david@agency.com",
    source: "Referral",
    intentScore: 95,
    trustScore: 98,
    status: "converted",
    createdAt: "3 days ago",
    lastActivity: "Completed purchase",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@business.net",
    source: "Instagram Ads",
    intentScore: 68,
    trustScore: 72,
    status: "new",
    createdAt: "6 hours ago",
    lastActivity: "Submitted contact form",
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    contacted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    qualified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    converted: "bg-primary/10 text-primary border-primary/20",
  };
  return colors[status as keyof typeof colors];
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

export function Leads() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Lead Engine</h2>
          <p className="text-muted-foreground mt-1">Manage and convert your leads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search leads..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lead Cards */}
      <div className="space-y-4">
        {leads.map((lead) => (
          <GlassCard key={lead.id} className="p-6" hover>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Lead Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{lead.name}</h3>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <Badge className={getStatusColor(lead.status)} variant="outline">
                    {lead.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Source:</span>
                    <span className="font-medium">{lead.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{lead.createdAt}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-accent/30">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Last Activity:</span> {lead.lastActivity}
                  </p>
                </div>
              </div>

              {/* Scores */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="mb-1 text-xs text-muted-foreground">Intent Score</div>
                  <div className={`text-2xl font-bold ${getScoreColor(lead.intentScore)}`}>{lead.intentScore}</div>
                  <div className="w-16 h-1 bg-accent rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-current transition-all"
                      style={{ width: `${lead.intentScore}%` }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-1 text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Trust Score
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(lead.trustScore)}`}>{lead.trustScore}</div>
                  <div className="w-16 h-1 bg-accent rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-current transition-all"
                      style={{ width: `${lead.trustScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send SMS
                    </DropdownMenuItem>
                    <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                    <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
                    <DropdownMenuItem>View Timeline</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Lead</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
