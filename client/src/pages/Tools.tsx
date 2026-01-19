import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Package, 
  Calendar, 
  Phone, 
  Video, 
  TrendingUp,
  Lock,
  Shield
} from "lucide-react";
import { Link } from "wouter";

const tools = [
  {
    id: "website-builder",
    name: "Website Builder",
    description: "Generate static sites with embedded Stripe payments",
    icon: Globe,
    color: "silver-text",
    href: "/tools/websites",
  },
  {
    id: "inventory",
    name: "Inventory Manager",
    description: "Sync with Shopify/WooCommerce, manage dropshipping",
    icon: Package,
    color: "gold-text",
    href: "/tools/inventory",
  },
  {
    id: "scheduler",
    name: "Scheduler",
    description: "Book appointments via Google Calendar",
    icon: Calendar,
    color: "text-accent",
    href: "/tools/scheduler",
  },
  {
    id: "receptionist",
    name: "Receptionist",
    description: "Handle calls/SMS, log leads automatically",
    icon: Phone,
    color: "silver-text",
    href: "/tools/leads",
  },
  {
    id: "video-creator",
    name: "Video Creator",
    description: "Create reels for Instagram, Facebook, YouTube",
    icon: Video,
    color: "gold-text",
    href: "/tools/videos",
  },
  {
    id: "analytics",
    name: "Marketing Analytics",
    description: "Track campaigns, conversions, and ROI",
    icon: TrendingUp,
    color: "text-accent",
    href: "/tools/analytics",
  },
];

export default function Tools() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="" />

      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 gold-text">
            BUSINESS TOOLS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All-in-one suite for managing your business operations
          </p>
        </div>

        {/* Security Status Banner */}
        <Card className="mb-8 p-6 bg-card/50 backdrop-blur-sm border-2 border-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 gold-text pulse-glow" />
              <div>
                <h3 className="font-bold text-lg">ENTERPRISE SECURITY ACTIVE</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-stage prompt injection defense • Dynamic authorization • Anomaly detection
                </p>
              </div>
            </div>
            <Lock className="h-6 w-6 silver-text" />
          </div>
        </Card>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href}>
                <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary transition-all cursor-pointer group hover:scale-105">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <Icon className={`h-12 w-12 ${tool.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wider">
                      {tool.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground flex-1">
                      {tool.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-border">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between group-hover:silver-text"
                      >
                        LAUNCH
                        <span className="text-lg">→</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card/30 backdrop-blur-sm border border-border text-center">
            <div className="text-3xl font-bold silver-text mb-2">0</div>
            <div className="text-sm text-muted-foreground uppercase">Websites</div>
          </Card>
          <Card className="p-6 bg-card/30 backdrop-blur-sm border border-border text-center">
            <div className="text-3xl font-bold gold-text mb-2">0</div>
            <div className="text-sm text-muted-foreground uppercase">Products</div>
          </Card>
          <Card className="p-6 bg-card/30 backdrop-blur-sm border border-border text-center">
            <div className="text-3xl font-bold text-accent mb-2">0</div>
            <div className="text-sm text-muted-foreground uppercase">Appointments</div>
          </Card>
          <Card className="p-6 bg-card/30 backdrop-blur-sm border border-border text-center">
            <div className="text-3xl font-bold silver-text mb-2">0</div>
            <div className="text-sm text-muted-foreground uppercase">Campaigns</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
