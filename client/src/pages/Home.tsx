import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Check, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Synckaiden - 66 AI-Powered Business Apps for Modern Entrepreneurs";
  }, []);
  const { user, isAuthenticated } = useAuth();
  const { data: products, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: entitlements } = trpc.entitlements.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const syncBundle = products?.find(p => p.type === 'bundle' && p.slug === 'sync-bundle');
  const apps = products?.filter(p => p.type === 'app') || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">Synckaiden</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#apps" className="text-muted-foreground hover:text-foreground transition-colors">
                Apps
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
            </div>

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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">The Future of AI-Powered Business</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">The </span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Executive Suite
              </span>
              <br />
              <span className="text-foreground">of AI-Powered Business Intelligence</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Access powerful AI-driven apps for e-commerce, automation, analytics, and growth. 
              One platform, unlimited possibilities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#apps">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 glow-blue">
                  Explore Apps
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="#pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                  View Pricing
                </Button>
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-accent" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-accent" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-accent" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Synckaiden</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for entrepreneurs who demand excellence, security, and scalability
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Built on cutting-edge technology for instant responses and real-time updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  AES-256 encryption, audit logging, and role-based access control built-in
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Scale Effortlessly</CardTitle>
                <CardDescription>
                  From startup to enterprise, our platform grows with your business needs
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Apps Catalog */}
      <section id="apps" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Apps at Your Fingertips</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each app is designed to solve real business problems with AI-powered intelligence
            </p>
          </div>

          {productsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="glass-card animate-pulse">
                  <CardHeader>
                    <div className="w-12 h-12 bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app, index) => {
                const hasAccess = entitlements?.some(e => e.productId === app.id);
                
                return (
                  <Card 
                    key={app.id} 
                    className="glass-card border-border/50 hover:border-primary/50 transition-all duration-300 card-hover"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="flex items-center justify-between">
                        {app.name}
                        {hasAccess && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>{app.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href="/dashboard">
                        <Button variant="outline" className="w-full">
                          {hasAccess ? 'Open App' : 'Learn More'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose individual apps or get the complete suite with our Sync bundle
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Individual Apps */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Individual Apps</CardTitle>
                <CardDescription>Perfect for focused needs</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">$9.99</span>
                  <span className="text-muted-foreground"> - $19.99/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Access to one app of your choice</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Full feature access</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Browse Apps
                </Button>
              </CardContent>
            </Card>

            {/* Sync Bundle */}
            <Card className="glass-card border-primary/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-sm font-semibold">
                BEST VALUE
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Sync Bundle</CardTitle>
                <CardDescription>Unlock everything</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">$39.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="font-semibold">Access to ALL apps</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Unlimited usage across all apps</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Premium support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Early access to new features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>Save over 50% vs individual apps</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90 glow-blue">
                  Get Sync Bundle
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="glass-card border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
            <CardHeader className="relative z-10 text-center py-16">
              <CardTitle className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Transform Your Business?
              </CardTitle>
              <CardDescription className="text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of entrepreneurs who trust Synckaiden to power their growth
              </CardDescription>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 glow-blue">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
                <a href="#apps">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                    Explore Apps
                  </Button>
                </a>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Synckaiden</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The unified platform for modern entrepreneurs
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#apps" className="hover:text-foreground transition-colors">Apps</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Synckaiden. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
