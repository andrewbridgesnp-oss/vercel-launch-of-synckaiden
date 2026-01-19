import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Lock, Sparkles, Settings, CreditCard, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: products } = trpc.products.list.useQuery();
  const { data: entitlements } = trpc.entitlements.list.useQuery();
  const { data: subscriptions } = trpc.billing.getSubscriptions.useQuery();

  const apps = products?.filter(p => p.type === 'app') || [];
  const userApps = apps.filter(app => entitlements?.some(e => e.productId === app.id));
  const availableApps = apps.filter(app => !entitlements?.some(e => e.productId === app.id));

  const hasBundle = entitlements?.some(e => {
    const product = products?.find(p => p.id === e.productId);
    return product?.type === 'bundle';
  });

  const activeSubscriptions = subscriptions?.filter(s => 
    s.status === 'active' || s.status === 'trialing'
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">Synckaiden</span>
              </a>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your apps and subscriptions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Active Apps</CardTitle>
                <div className="text-4xl font-bold text-primary mt-2">
                  {hasBundle ? apps.length : userApps.length}
                </div>
              </CardHeader>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Active Subscriptions</CardTitle>
                <div className="text-4xl font-bold text-accent mt-2">
                  {activeSubscriptions.length}
                </div>
              </CardHeader>
            </Card>

            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Account Type</CardTitle>
                <div className="mt-2">
                  <Badge className={hasBundle ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}>
                    {hasBundle ? 'Sync Bundle' : 'Individual Apps'}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Bundle Upsell */}
          {!hasBundle && userApps.length > 0 && (
            <Card className="glass-card border-accent/50 mb-12">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">Upgrade to Sync Bundle</CardTitle>
                    <CardDescription className="text-base">
                      Get access to all {apps.length} apps for just $39.99/month. Save over 50% compared to individual subscriptions!
                    </CardDescription>
                  </div>
                  <Badge className="bg-accent/20 text-accent">BEST VALUE</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/#pricing">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Upgrade Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Your Apps */}
          {userApps.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Your Apps</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(hasBundle ? apps : userApps).map((app) => {
                  const metadata = app.metadata ? JSON.parse(app.metadata as string) : {};
                  const features = app.features ? JSON.parse(app.features as string) : [];
                  
                  return (
                    <Card key={app.id} className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 card-hover">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-2xl">
                            {metadata.icon || '📱'}
                          </div>
                          <Badge className="bg-accent/20 text-accent">Active</Badge>
                        </div>
                        <CardTitle>{app.name}</CardTitle>
                        <CardDescription>{app.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {features.slice(0, 3).map((feature: string, idx: number) => (
                            <div key={idx} className="text-sm text-muted-foreground flex items-center space-x-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/apps/${app.slug}/dashboard`}>
                            <Button className="flex-1 bg-primary hover:bg-primary/90">
                              Open
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/apps/${app.slug}/setup`}>
                            <Button variant="outline" size="icon">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Apps */}
          {availableApps.length > 0 && !hasBundle && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Available Apps</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableApps.map((app) => {
                  const metadata = app.metadata ? JSON.parse(app.metadata as string) : {};
                  const features = app.features ? JSON.parse(app.features as string) : [];
                  
                  return (
                    <Card key={app.id} className="glass-card border-border/50 hover:border-muted transition-all duration-300 opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl opacity-50">
                            {metadata.icon || '📱'}
                          </div>
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <CardTitle>{app.name}</CardTitle>
                        <CardDescription>{app.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {features.slice(0, 3).map((feature: string, idx: number) => (
                            <div key={idx} className="text-sm text-muted-foreground flex items-center space-x-2">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Link href={`/apps/${app.slug}`}>
                          <Button variant="outline" className="w-full">
                            Learn More
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Apps Yet */}
          {userApps.length === 0 && !hasBundle && (
            <Card className="glass-card border-border/50 max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Get Started with Synckaiden</CardTitle>
                <CardDescription className="text-base">
                  Subscribe to individual apps or get the Sync Bundle for access to everything.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/#apps">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Browse Apps
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/#pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Subscriptions Section */}
          {activeSubscriptions.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Active Subscriptions</h2>
                <Button variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {activeSubscriptions.map((subscription) => {
                  const product = products?.find(p => p.id === subscription.productId);
                  
                  return (
                    <Card key={subscription.id} className="glass-card border-border/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{product?.name || 'Unknown Product'}</CardTitle>
                            <CardDescription>
                              {subscription.status === 'trialing' ? 'Trial Period' : 'Active Subscription'}
                            </CardDescription>
                          </div>
                          <Badge className={subscription.status === 'trialing' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}>
                            {subscription.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Current Period:</span>
                            <span className="text-foreground">
                              {subscription.currentPeriodStart && subscription.currentPeriodEnd ? (
                                `${new Date(subscription.currentPeriodStart).toLocaleDateString()} - ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                              ) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Provider:</span>
                            <span className="text-foreground capitalize">{subscription.provider}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
