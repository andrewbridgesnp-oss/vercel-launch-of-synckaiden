import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Calendar, Video, FileText, Activity, Loader2, Clock } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function VitalSync() {
  const { user, isAuthenticated } = useAuth();

  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "vitalsync-health" },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Heart className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please sign in to access VitalSync Health.
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
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription Required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Subscribe to access VitalSync Health.
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
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">VitalSync Health</h1>
              <p className="text-muted-foreground text-lg">
                Comprehensive telehealth and wellness platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass premium-card border-border/50 p-6">
                <Calendar className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <Video className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Video Consultations</p>
              </Card>
              
              <Card className="glass premium-card border-border/50 p-6">
                <FileText className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-sm text-muted-foreground">Health Records</p>
              </Card>

              <Card className="glass premium-card border-border/50 p-6">
                <Activity className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-2xl font-bold mb-1">Good</h3>
                <p className="text-sm text-muted-foreground">Health Status</p>
              </Card>
            </div>

            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Next Appointment</h3>
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No upcoming appointments.</p>
                <Button className="mt-4">Schedule Appointment</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Schedule Appointment</h3>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Primary Care", "Mental Health", "Specialist", "Urgent Care"].map((type) => (
                  <Card key={type} className="glass border-border/30 p-4">
                    <h4 className="font-semibold mb-2">{type}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Available today
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Clock className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">Health Records</h3>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No health records yet.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tutorial" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-4">How to Use VitalSync</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Schedule an Appointment</h4>
                    <p className="text-sm text-muted-foreground">Choose your provider and preferred time slot</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Join Video Consultation</h4>
                    <p className="text-sm text-muted-foreground">Connect with your provider from anywhere</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Access Your Records</h4>
                    <p className="text-sm text-muted-foreground">View prescriptions, test results, and visit summaries</p>
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
