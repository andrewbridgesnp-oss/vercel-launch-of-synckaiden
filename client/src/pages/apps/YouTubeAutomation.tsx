import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, Upload, BarChart3, Clock, Loader2, Plus, Eye, ThumbsUp } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function YouTubeAutomation() {
  const { user, isAuthenticated } = useAuth();

  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "youtube-automation" },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Youtube className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please sign in to access YouTube Automation.
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
          <Youtube className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription Required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Subscribe to access YouTube Automation.
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
              <Youtube className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">YouTube Automation</h1>
              <p className="text-muted-foreground text-lg">
                Automated YouTube content creation, scheduling, and analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass premium-card border-border/50 p-6">
                <Youtube className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Total Videos</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <Eye className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <ThumbsUp className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </Card>

              <Card className="glass premium-card border-border/50 p-6">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass premium-card border-border/50 p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Videos</h3>
                <div className="text-center py-12 text-muted-foreground">
                  <Youtube className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No videos yet.</p>
                  <Button className="mt-4">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              </Card>

              <Card className="glass premium-card border-border/50 p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Analytics will appear here.</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Videos</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Video
                </Button>
              </div>
              <div className="text-center py-12 text-muted-foreground">
                <Youtube className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No videos uploaded.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Publishing Schedule</h3>
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No scheduled videos.</p>
                <Button className="mt-4">Schedule Video</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Channel Analytics</h3>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Connect your YouTube channel to view analytics.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">YouTube API Setup</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <h4 className="font-semibold mb-2">YouTube API Key</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect your YouTube account to enable automation features.
                  </p>
                  <Button>Connect YouTube</Button>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <h4 className="font-semibold mb-2">Channel Settings</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure default settings for automated uploads.
                  </p>
                  <Button variant="outline">Configure</Button>
                </div>
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
                    <h4 className="font-semibold mb-1">Connect YouTube Account</h4>
                    <p className="text-sm text-muted-foreground">Authorize access to your YouTube channel</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Upload or Generate Content</h4>
                    <p className="text-sm text-muted-foreground">Create videos manually or use AI generation</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Automate Publishing</h4>
                    <p className="text-sm text-muted-foreground">Schedule videos and let the system handle uploads</p>
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
