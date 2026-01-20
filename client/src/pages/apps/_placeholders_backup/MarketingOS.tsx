import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, Mail, Users, Loader2, BarChart3, Megaphone } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function MarketingOS() {
  const { user, isAuthenticated } = useAuth();

  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "marketing-os" },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Target className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please sign in to access Kaiden Marketing OS.
          </p>
          <Button asChild className="w-full">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </Card>
      </div>
    );
  }

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!entitlement?.hasAccess) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription Required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Subscribe to access Kaiden Marketing OS.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard"><a>View Plans</a></Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/app/sync-bundle"><a>Get Bundle</a></Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="border-b border-border/50 glass">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/30">
              <Target className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">Kaiden Marketing OS</h1>
              <p className="text-muted-foreground text-lg">
                Complete marketing automation and campaign management platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass premium-card border-border/50 p-6">
                <Megaphone className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Total Reach</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="text-2xl font-bold mb-1">0%</h3>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </Card>

              <Card className="glass premium-card border-border/50 p-6">
                <Mail className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Email Subscribers</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass premium-card border-border/50 p-6">
                <h3 className="text-xl font-semibold mb-4">Campaign Performance</h3>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No campaigns yet.</p>
                  <Button className="mt-4">Create Campaign</Button>
                </div>
              </Card>

              <Card className="glass premium-card border-border/50 p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No recent activity.</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Campaigns</h3>
                <Button>
                  <Megaphone className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>
              <div className="text-center py-12 text-muted-foreground">
                <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No campaigns created.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Marketing Analytics</h3>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No analytics data available.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Audience Management</h3>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No audience segments created.</p>
                <Button className="mt-4">Create Segment</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tutorial" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Define Your Audience</h4>
                    <p className="text-sm text-muted-foreground">Create audience segments based on demographics and behavior</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Campaigns</h4>
                    <p className="text-sm text-muted-foreground">Design multi-channel marketing campaigns with AI assistance</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Track & Optimize</h4>
                    <p className="text-sm text-muted-foreground">Monitor performance and optimize campaigns in real-time</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
