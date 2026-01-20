import { GlassCard } from "../components/glass-card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Search,
  ShoppingBag,
  Star,
  Download,
  TrendingUp,
  Zap,
  Target,
  Mail,
  DollarSign,
  Crown,
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: "free" | number;
  rating: number;
  downloads: number;
  icon: any;
  isPremium?: boolean;
  tags: string[];
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: "1",
    name: "E-commerce Funnel Blueprint",
    category: "Campaign Template",
    description: "Complete funnel for online stores: product page → cart → checkout → upsell",
    price: "free",
    rating: 4.8,
    downloads: 2340,
    icon: ShoppingBag,
    tags: ["e-commerce", "funnel", "conversion"],
  },
  {
    id: "2",
    name: "Local Business Lead Gen",
    category: "Campaign Template",
    description: "Perfect for service providers: Facebook Ads → Landing Page → SMS Follow-up",
    price: 49,
    rating: 4.9,
    downloads: 1890,
    icon: Target,
    isPremium: true,
    tags: ["local", "services", "sms"],
  },
  {
    id: "3",
    name: "SaaS Onboarding Sequence",
    category: "Email Template",
    description: "7-day email sequence to onboard and activate new users",
    price: "free",
    rating: 4.7,
    downloads: 3120,
    icon: Mail,
    tags: ["saas", "onboarding", "email"],
  },
  {
    id: "4",
    name: "High-Ticket Sales Funnel",
    category: "Campaign Template",
    description: "Multi-touch campaign for high-value products ($1000+)",
    price: 99,
    rating: 5.0,
    downloads: 876,
    icon: DollarSign,
    isPremium: true,
    tags: ["high-ticket", "sales", "premium"],
  },
  {
    id: "5",
    name: "Webinar Registration Flow",
    category: "Landing Page",
    description: "Registration page + reminder emails + replay sequence",
    price: "free",
    rating: 4.6,
    downloads: 1560,
    icon: TrendingUp,
    tags: ["webinar", "event", "registration"],
  },
  {
    id: "6",
    name: "Agency Client Reporting",
    category: "Automation",
    description: "Automated weekly reports with key metrics for agency clients",
    price: 79,
    rating: 4.9,
    downloads: 654,
    icon: Zap,
    isPremium: true,
    tags: ["agency", "reporting", "automation"],
  },
];

export function Marketplace() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Marketplace</h2>
          <p className="text-muted-foreground mt-1">Ready-to-use templates and blueprints</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search templates, funnels, automations..." className="pl-10" />
      </div>

      {/* Featured */}
      <GlassCard className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="rounded-xl bg-gradient-to-br from-primary to-primary/70 p-6">
              <Crown className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">Featured This Week</Badge>
            <h3 className="text-2xl font-bold mb-2">Industry-Specific Funnel Collection</h3>
            <p className="text-muted-foreground mb-4">
              50+ proven funnels for restaurants, real estate, fitness, consulting, and more. One-click installation.
            </p>
            <Button className="bg-gradient-to-r from-primary to-primary/80">
              Explore Collection
            </Button>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="text-3xl font-bold text-primary">$149</div>
            <p className="text-sm text-muted-foreground">One-time purchase</p>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="free">Free</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="popular">Most Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems.map((item) => {
              const Icon = item.icon;
              return (
                <GlassCard key={item.id} className="p-6 flex flex-col" hover>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {item.isPremium && (
                      <Badge className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground border-0">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Download className="h-4 w-4" />
                        <span>{item.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {item.price === "free" ? "Free" : `$${item.price}`}
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                        Install
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="free">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems
              .filter((item) => item.price === "free")
              .map((item) => (
                <GlassCard key={item.id} className="p-6">
                  <p className="text-sm text-muted-foreground">Free items only</p>
                </GlassCard>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="premium">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems
              .filter((item) => item.isPremium)
              .map((item) => (
                <GlassCard key={item.id} className="p-6">
                  <p className="text-sm text-muted-foreground">Premium items only</p>
                </GlassCard>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems
              .sort((a, b) => b.downloads - a.downloads)
              .map((item) => (
                <GlassCard key={item.id} className="p-6">
                  <p className="text-sm text-muted-foreground">Sorted by popularity</p>
                </GlassCard>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Become a Creator CTA */}
      <GlassCard className="p-6 border-2 border-dashed border-primary/30">
        <div className="text-center py-8">
          <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Become a Marketplace Creator</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Build and sell your own templates, funnels, and automations. Earn passive income helping others succeed.
          </p>
          <Button className="bg-gradient-to-r from-primary to-primary/80">Start Selling</Button>
        </div>
      </GlassCard>
    </div>
  );
}
