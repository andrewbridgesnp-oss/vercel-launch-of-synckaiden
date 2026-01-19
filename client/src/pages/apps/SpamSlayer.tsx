import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Mail, AlertTriangle, CheckCircle, Loader2, Settings } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function SpamSlayer() {
  const { user, isAuthenticated } = useAuth();

  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "spam-slayer" },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please sign in to access SpamSlayer.
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
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription Required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Subscribe to access SpamSlayer.
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
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">SpamSlayer</h1>
              <p className="text-muted-foreground text-lg">
                Advanced AI-powered spam detection and email protection
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass premium-card border-border/50 p-6">
                <Mail className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Emails Scanned</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Spam Blocked</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="text-2xl font-bold mb-1">100%</h3>
                <p className="text-sm text-muted-foreground">Protection Rate</p>
              </Card>

              <Card className="glass premium-card border-border/50 p-6">
                <Shield className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">Active</h3>
                <p className="text-sm text-muted-foreground">Protection Status</p>
              </Card>
            </div>

            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No spam detected yet. Your inbox is protected!</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="blocked" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Blocked Emails</h3>
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No blocked emails.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Protection Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div>
                    <h4 className="font-semibold mb-1">Spam Detection</h4>
                    <p className="text-sm text-muted-foreground">AI-powered spam filtering</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div>
                    <h4 className="font-semibold mb-1">Phishing Protection</h4>
                    <p className="text-sm text-muted-foreground">Block phishing attempts</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30">
                  <div>
                    <h4 className="font-semibold mb-1">Malware Scanning</h4>
                    <p className="text-sm text-muted-foreground">Scan attachments for malware</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tutorial" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Connect Your Email</h4>
                    <p className="text-sm text-muted-foreground">Link your email account for protection</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">AI Scans Everything</h4>
                    <p className="text-sm text-muted-foreground">Our AI analyzes every incoming email</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Stay Protected</h4>
                    <p className="text-sm text-muted-foreground">Spam, phishing, and malware are automatically blocked</p>
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
