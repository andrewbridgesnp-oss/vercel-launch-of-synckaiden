import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Mic, Clock, CheckCircle, Loader2, Plus } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function HealthSyncScribe() {
  const { user, isAuthenticated } = useAuth();

  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "healthsync-scribe" },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please sign in to access HealthSync Scribe.
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
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription Required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Subscribe to access HealthSync Scribe.
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
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">HealthSync Scribe</h1>
              <p className="text-muted-foreground text-lg">
                AI-powered medical transcription and documentation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transcribe">Transcribe</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass premium-card border-border/50 p-6">
                <FileText className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Total Documents</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Processing</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Completed</p>
              </Card>

              <Card className="glass premium-card border-border/50 p-6">
                <Mic className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0h</h3>
                <p className="text-sm text-muted-foreground">Audio Transcribed</p>
              </Card>
            </div>

            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Documents</h3>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No documents yet.</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  New Document
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="transcribe" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Start Transcription</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-32 flex flex-col items-center justify-center gap-2">
                  <Mic className="w-8 h-8" />
                  <span className="font-semibold">Record Audio</span>
                  <span className="text-xs text-muted-foreground">Live transcription</span>
                </Button>
                <Button variant="outline" className="h-32 flex flex-col items-center justify-center gap-2">
                  <FileText className="w-8 h-8" />
                  <span className="font-semibold">Upload Audio</span>
                  <span className="text-xs text-muted-foreground">Transcribe file</span>
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Your Documents</h3>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No documents yet.</p>
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
                    <h4 className="font-semibold mb-1">Record or Upload</h4>
                    <p className="text-sm text-muted-foreground">Record patient encounters or upload audio files</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">AI Transcription</h4>
                    <p className="text-sm text-muted-foreground">Medical-grade transcription with terminology recognition</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Review & Export</h4>
                    <p className="text-sm text-muted-foreground">Review, edit, and export to your EHR system</p>
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
