import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Phone, MessageSquare, Settings, Zap, Clock, Users, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function AveryAI() {
  const { user, isAuthenticated } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Check if user has access to this app
  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "avery-ai-receptionist" },
    { enabled: isAuthenticated }
  );

  const saveApiKey = trpc.apiKeys.create.useMutation({
    onSuccess: () => {
      toast.success("API key saved securely");
      setApiKey("");
    },
    onError: (error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    saveApiKey.mutate({
      service: "avery-ai",
      keyName: "primary",
      apiKey: apiKey.trim(),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Bot className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please sign in to access Avery AI Receptionist.
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
          <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription Required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Subscribe to access Avery AI Receptionist or get the Sync Bundle for all apps.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                <a>View Plans</a>
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/app/sync-bundle">
                <a>Get Bundle</a>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      {/* Hero Section */}
      <div className="border-b border-border/50 glass">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/30">
              <Bot className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">Avery AI Receptionist</h1>
              <p className="text-muted-foreground text-lg">
                24/7 AI-powered customer service for your business
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">24/7 Availability</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm">Instant Responses</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm">Unlimited Conversations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass premium-card border-border/50 p-6">
                <MessageSquare className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Conversations Today</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <Phone className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Calls Handled</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">100%</h3>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </Card>
            </div>

            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No activity yet. Complete setup to get started.</p>
              </div>
            </Card>
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Business Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Avery will answer calls to this number
                  </p>
                </div>

                <div>
                  <Label htmlFor="apikey">OpenAI API Key (Optional)</Label>
                  <Input
                    id="apikey"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use your own API key for custom responses
                  </p>
                </div>

                <Button 
                  onClick={handleSaveApiKey}
                  disabled={saveApiKey.isPending}
                  className="w-full"
                >
                  {saveApiKey.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Configuration"
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Tutorial Tab */}
          <TabsContent value="tutorial" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Configure Your Phone Number</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter your business phone number in the Setup tab. Avery will automatically answer incoming calls.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Customize Responses (Optional)</h4>
                    <p className="text-sm text-muted-foreground">
                      Add your OpenAI API key to customize Avery's personality and responses for your brand.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Monitor Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Track conversations, satisfaction rates, and customer interactions from your dashboard.
                    </p>
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
