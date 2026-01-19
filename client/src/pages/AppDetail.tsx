import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import { Link, useParams } from "wouter";

export default function AppDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const { data: product, isLoading: productLoading } = trpc.products.getBySlug.useQuery(
    { slug: slug || '' },
    { enabled: !!slug }
  );
  
  const { data: prices } = trpc.products.getPrices.useQuery(
    { productId: product?.id || 0 },
    { enabled: !!product?.id }
  );
  
  const { data: entitlements } = trpc.entitlements.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const { data: app } = trpc.apps.getBySlug.useQuery(
    { slug: slug || '' },
    { enabled: !!slug }
  );

  const hasAccess = entitlements?.some(e => e.productId === product?.id);
  const monthlyPrice = prices?.find(p => p.interval === 'month');
  const features = product?.features ? JSON.parse(product.features as string) : [];
  const metadata = product?.metadata ? JSON.parse(product.metadata as string) : {};

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardHeader>
            <CardTitle>App Not Found</CardTitle>
            <CardDescription>
              The app you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowRight className="mr-2 w-4 h-4 rotate-180" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button variant="ghost">Sign In</Button>
                  </a>
                  <a href={getLoginUrl()}>
                    <Button className="bg-primary hover:bg-primary/90">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* App Hero */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-3xl">
                {metadata.icon || '📱'}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-4xl font-bold">{product.name}</h1>
                  {hasAccess && (
                    <Badge className="bg-accent/20 text-accent">Active</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
            </div>

            <p className="text-xl text-muted-foreground mb-8">
              {product.description}
            </p>

            <div className="flex items-center space-x-4 mb-12">
              {hasAccess ? (
                <>
                  <Link href={`/apps/${slug}/dashboard`}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Open Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href={`/apps/${slug}/setup`}>
                    <Button size="lg" variant="outline">
                      Setup & Settings
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Subscribe Now - ${monthlyPrice ? (monthlyPrice.amount / 100).toFixed(2) : '0.00'}/mo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Link href="/#pricing">
                    <Button size="lg" variant="outline">
                      View All Plans
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {!hasAccess && (
              <Card className="glass-card border-accent/30 mb-12">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-accent" />
                    <CardTitle className="text-lg">Subscription Required</CardTitle>
                  </div>
                  <CardDescription>
                    Subscribe to unlock this app, or get the Sync Bundle for access to all apps at a discounted price.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature: string, index: number) => (
                <Card key={index} className="glass-card border-border/50">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Pricing</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle>Monthly Subscription</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${monthlyPrice ? (monthlyPrice.amount / 100).toFixed(2) : '0.00'}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-accent" />
                      <span>Full access to all features</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-accent" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-accent" />
                      <span>Cancel anytime</span>
                    </li>
                  </ul>
                  {!hasAccess && (
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Subscribe Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card border-accent/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Sync Bundle</CardTitle>
                    <Badge className="bg-accent/20 text-accent">SAVE 50%</Badge>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$39.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-accent" />
                      <span className="font-semibold">Access to ALL apps</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-accent" />
                      <span>Unlimited usage</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-accent" />
                      <span>Premium support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-accent" />
                      <span>Early access to new apps</span>
                    </li>
                  </ul>
                  <Link href="/#pricing">
                    <Button variant="outline" className="w-full border-accent/50">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Synckaiden. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
