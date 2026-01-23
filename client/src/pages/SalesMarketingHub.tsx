import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Mail,
  MessageSquare,
  Video,
  TrendingUp,
  Target,
  Calendar,
  Zap,
  Globe,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  DollarSign,
  UserPlus,
  Activity
} from "lucide-react";

export default function SalesMarketingHub() {
  const [workspaceId] = useState(1);

  // Fetch aggregated stats from all sales & marketing apps
  const { data: crmStats } = trpc.salesCrm.getStats.useQuery({ workspaceId });
  const { data: leadStats } = trpc.leadManagement.getStats.useQuery({ workspaceId });
  const { data: emailStats } = trpc.emailMarketing.getStats.useQuery({ workspaceId });
  const { data: socialStats } = trpc.socialMedia.getStats.useQuery({ workspaceId });
  const { data: youtubeStats } = trpc.youtube.getStats.useQuery({ workspaceId });

  const apps = [
    {
      id: "crm",
      name: "Sales CRM",
      description: "Manage contacts, deals, and sales pipeline",
      icon: Users,
      href: "/crm",
      stats: crmStats ? [
        { label: "Total Contacts", value: crmStats.totalContacts || 0 },
        { label: "Active Deals", value: crmStats.activeDeals || 0 },
        { label: "Revenue", value: `$${(crmStats.totalRevenue || 0).toLocaleString()}` }
      ] : [],
      color: "bg-blue-500"
    },
    {
      id: "leads",
      name: "Lead Management",
      description: "Capture, score, and nurture leads",
      icon: Target,
      href: "/leads",
      stats: leadStats ? [
        { label: "Total Leads", value: leadStats.totalLeads || 0 },
        { label: "Qualified", value: leadStats.qualifiedLeads || 0 },
        { label: "Conversion Rate", value: `${(leadStats.conversionRate || 0).toFixed(1)}%` }
      ] : [],
      color: "bg-green-500"
    },
    {
      id: "marketing",
      name: "Marketing OS",
      description: "Campaign management and analytics",
      icon: BarChart3,
      href: "/marketing",
      stats: [],
      color: "bg-purple-500"
    },
    {
      id: "email",
      name: "Email Marketing",
      description: "Email campaigns and automation",
      icon: Mail,
      href: "/email-marketing",
      stats: emailStats ? [
        { label: "Campaigns", value: emailStats.totalCampaigns || 0 },
        { label: "Sent", value: (emailStats.totalSent || 0).toLocaleString() },
        { label: "Open Rate", value: `${(emailStats.avgOpenRate || 0).toFixed(1)}%` }
      ] : [],
      color: "bg-orange-500"
    },
    {
      id: "social",
      name: "Social Media Autopilot",
      description: "Schedule and manage social posts",
      icon: MessageSquare,
      href: "/social-media",
      stats: socialStats ? [
        { label: "Scheduled", value: socialStats.scheduledPosts || 0 },
        { label: "Published", value: socialStats.publishedPosts || 0 },
        { label: "Engagement", value: (socialStats.totalEngagement || 0).toLocaleString() }
      ] : [],
      color: "bg-pink-500"
    },
    {
      id: "youtube",
      name: "YouTube Automation",
      description: "Video publishing and analytics",
      icon: Youtube,
      href: "/youtube-channel",
      stats: youtubeStats ? [
        { label: "Videos", value: youtubeStats.totalVideos || 0 },
        { label: "Views", value: (youtubeStats.totalViews || 0).toLocaleString() },
        { label: "Subscribers", value: (youtubeStats.totalSubscribers || 0).toLocaleString() }
      ] : [],
      color: "bg-red-500"
    },
    {
      id: "websites",
      name: "Website Builder",
      description: "Create and manage landing pages",
      icon: Globe,
      href: "/websites",
      stats: [],
      color: "bg-cyan-500"
    },
    {
      id: "videos",
      name: "Video Production",
      description: "Create and edit marketing videos",
      icon: Video,
      href: "/videos",
      stats: [],
      color: "bg-indigo-500"
    }
  ];

  // Calculate platform-wide metrics
  const totalContacts = (crmStats?.totalContacts || 0) + (leadStats?.totalLeads || 0);
  const totalRevenue = crmStats?.totalRevenue || 0;
  const totalEngagement = (socialStats?.totalEngagement || 0) + (youtubeStats?.totalViews || 0);
  const activeC ampaigns = (emailStats?.totalCampaigns || 0) + (socialStats?.scheduledPosts || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sales & Marketing Command Center
          </h1>
          <p className="text-muted-foreground text-lg">
            Unified platform for all your sales and marketing operations
          </p>
        </div>

        {/* Platform-wide Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts & Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContacts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all apps</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Pipeline value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Views & interactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1">Running now</p>
            </CardContent>
          </Card>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link key={app.id} href={app.href}>
                <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${app.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                        <Icon className={`h-6 w-6 ${app.color.replace('bg-', 'text-')}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="mt-4">{app.name}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </CardHeader>
                  {app.stats.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        {app.stats.map((stat, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{stat.label}</span>
                            <span className="font-semibold">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks across all apps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/crm">
                  <Button variant="outline" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Contact
                  </Button>
                </Link>
                <Link href="/email-marketing">
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    New Campaign
                  </Button>
                </Link>
                <Link href="/social-media">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Schedule Post
                  </Button>
                </Link>
                <Link href="/marketing">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
