import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { mockStats, mockOrders } from "@/hooks/useMockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import {
  Users,
  Workflow,
  TrendingUp,
  DollarSign,
  Package,
  Megaphone,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Shield,
  Building2,
  Home,
  CreditCard,
  GraduationCap,
  Briefcase,
  Scale,
  FileText,
  Calculator,
  UserCheck,
  Landmark,
  Swords,
  Heart,
  FileSearch,
  Coins,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Youtube,
  Stamp,
  FileSignature,
  Stethoscope,
  Receipt,
  Link2
} from "lucide-react";

// Daily affirmations
const DAILY_AFFIRMATIONS = [
  "You are building something extraordinary today.",
  "Your business decisions create lasting impact.",
  "Success flows naturally to those who persist.",
  "Every challenge is an opportunity for growth.",
  "Your vision is becoming reality, one step at a time.",
  "Abundance and prosperity are your birthright.",
  "You attract the right clients and opportunities.",
  "Your leadership inspires those around you.",
  "Today is full of unlimited potential.",
  "You have the wisdom to make excellent decisions.",
  "Your business serves others and creates value.",
  "Financial freedom is within your reach.",
  "You are capable of achieving great things.",
  "Your hard work is paying off.",
  "Trust the process and embrace the journey.",
];

// Category-based organization
const CATEGORIES = {
  business: {
    title: "Business",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    items: [
      { title: "LLC Formation", description: "Start your business the right way", link: "/business-tools", icon: Building2 },
      { title: "Employees", description: "Hiring, payroll, performance", link: "/employees", icon: Users },
      { title: "Workflows", description: "Automation & approvals", link: "/workflows", icon: Workflow },
      { title: "Sales & CRM", description: "Leads, pipeline, proposals", link: "/sales", icon: TrendingUp },
      { title: "Finance", description: "Invoicing, expenses, tax", link: "/finance", icon: DollarSign },
      { title: "Operations", description: "Inventory, orders, shipping", link: "/orders", icon: Package },
      { title: "Marketing", description: "Email, social, SEO, ads", link: "/marketing", icon: Megaphone },
      { title: "Integrations", description: "Connect all your business tools", link: "/integrations", icon: Link2 },
    ]
  },
  credit: {
    title: "Credit",
    icon: CreditCard,
    color: "from-green-500 to-emerald-500",
    items: [
      { title: "Credit Repair", description: "Assess and improve your credit", link: "/business-tools", icon: CreditCard },
      { title: "Credit Monitoring", description: "Track your credit score", link: "/business-tools", icon: BarChart3 },
      { title: "Dispute Letters", description: "Templates for credit bureaus", link: "/business-tools", icon: FileText },
      { title: "Find Credit Attorney", description: "Licensed professionals", link: "/professionals", icon: Scale },
    ]
  },
  studentLoans: {
    title: "Student Loans",
    icon: GraduationCap,
    color: "from-purple-500 to-pink-500",
    items: [
      { title: "Brunner Test Calculator", description: "Assess discharge eligibility", link: "/business-tools", icon: Calculator },
      { title: "IDR Plan Comparison", description: "Income-driven repayment options", link: "/business-tools", icon: FileText },
      { title: "PSLF Tracker", description: "Public Service Loan Forgiveness", link: "/business-tools", icon: Landmark },
      { title: "Find Bankruptcy Attorney", description: "Licensed professionals", link: "/professionals", icon: Scale },
    ]
  },
  realEstate: {
    title: "Real Estate",
    icon: Home,
    color: "from-orange-500 to-amber-500",
    items: [
      { title: "Dynasty Trust", description: "Generational wealth planning", link: "/dynasty-trust", icon: Landmark },
      { title: "Property Analysis", description: "Investment calculators", link: "/tools/analytics", icon: Calculator },
      { title: "Find Real Estate Attorney", description: "Licensed professionals", link: "/professionals", icon: Scale },
      { title: "Title & Deed Services", description: "Property documentation", link: "/business-tools", icon: FileText },
    ]
  },
  housing: {
    title: "Housing",
    icon: Building2,
    color: "from-teal-500 to-cyan-500",
    items: [
      { title: "Rental Assistance", description: "Find housing programs", link: "/business-tools", icon: Home },
      { title: "Tenant Rights", description: "Know your legal protections", link: "/business-tools", icon: Scale },
      { title: "Eviction Defense", description: "Legal resources and help", link: "/professionals", icon: Shield },
      { title: "Fair Housing", description: "Discrimination protection", link: "/business-tools", icon: UserCheck },
    ]
  },
  legal: {
    title: "Business Tools",
    icon: Scale,
    color: "from-indigo-500 to-violet-500",
    items: [
      { title: "Find an Attorney", description: "Search by state & specialty", link: "/professionals", icon: Scale },
      { title: "Find a CPA", description: "Tax & accounting professionals", link: "/professionals", icon: Calculator },
      { title: "Document Review", description: "AI-assisted with attorney approval", link: "/business-tools", icon: FileText },
      { title: "Legal Resources", description: "Know your rights", link: "/business-tools", icon: Landmark },
    ]
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [affirmation, setAffirmation] = useState("");
  const [activeTab, setActiveTab] = useState("business");

  // Load real data from backend with fallback to mock data
  const { data: crmStats } = trpc.crm.getStats.useQuery({ workspaceId: 1 });
  const { data: orders } = trpc.orders.list.useQuery();
  const { data: conversations } = trpc.chat.getConversations.useQuery();

  // Use mock data as fallback if API returns empty
  const stats = (crmStats && Object.keys(crmStats).length > 0) ? crmStats : mockStats;
  const orderList = (orders && orders.length > 0) ? orders : mockOrders;

  // Calculate dashboard metrics
  const totalOrders = orderList?.length || 0;
  const totalRevenue = orderList?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
  const totalContacts = stats?.total || 0;
  const totalLeads = stats?.leads || 0;

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const index = dayOfYear % DAILY_AFFIRMATIONS.length;
    setAffirmation(DAILY_AFFIRMATIONS[index]);
  }, []);

  return (
    <div className="min-h-screen bg-background luxury-gradient relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.3, filter: 'blur(4px)', zIndex: 0 }}
        autoPlay loop muted playsInline
      >
        <source src="/grok-video-b0edb8c7-fea2-41fb-aacd-a0bd3c14f30f.mp4" type="video/mp4" />
      </video>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gold-shimmer">Dashboard</h1>
          <p className="text-muted-foreground mb-2">
            Welcome back, {user?.name || "User"}! Here's everything Kaiden can do for you.
          </p>
          {affirmation && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2 mb-3 inline-block">
              <p className="text-sm italic text-primary">✨ {affirmation}</p>
            </div>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              Not always listening • Push-to-talk only
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              Approval required before execution
            </span>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardDescription>Total Contacts</CardDescription>
              <CardTitle className="text-3xl text-cyan-400">{totalContacts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">CRM database</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardDescription>Active Leads</CardDescription>
              <CardTitle className="text-3xl text-blue-400">{totalLeads}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Ready to convert</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className="text-3xl text-green-400">{totalOrders}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl text-purple-400">${(totalRevenue / 100).toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">From orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-2 bg-card/50 backdrop-blur mb-6">
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <category.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(CATEGORIES).map(([key, category]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  {category.title}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((item, index) => (
                  <Link key={index} href={item.link}>
                    <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer group h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-lg mb-1">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Link href="/chat">
            <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 hover:border-primary/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Talk to Kaiden</h3>
                  <p className="text-sm text-muted-foreground">AI business guidance</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/ai-arena">
            <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 hover:border-cyan-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Swords className="h-8 w-8 text-cyan-500" />
                <div>
                  <h3 className="font-semibold">AI Arena</h3>
                  <p className="text-sm text-muted-foreground">Multi-AI debate</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/workflows">
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Workflow className="h-8 w-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold">Build Workflow</h3>
                  <p className="text-sm text-muted-foreground">Automate processes</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/professionals">
            <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Scale className="h-8 w-8 text-amber-500" />
                <div>
                  <h3 className="font-semibold">Find Professional</h3>
                  <p className="text-sm text-muted-foreground">Attorneys & CPAs</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/bougie-boutique">
            <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30 hover:border-pink-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Heart className="h-8 w-8 text-pink-500" />
                <div>
                  <h3 className="font-semibold">Bougie Boutique</h3>
                  <p className="text-sm text-muted-foreground">Kids mental health</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/shop">
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Package className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Buy Now</h3>
                  <p className="text-sm text-muted-foreground">Digital products</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Additional Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Link href="/grants">
            <Card className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <FileSearch className="h-8 w-8 text-emerald-500" />
                <div>
                  <h3 className="font-semibold">Grants</h3>
                  <p className="text-sm text-muted-foreground">Find funding</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/cost-reduction">
            <Card className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30 hover:border-blue-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Coins className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Cost Reduction</h3>
                  <p className="text-sm text-muted-foreground">Save money</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/business-credit">
            <Card className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/30 hover:border-violet-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <CreditCard className="h-8 w-8 text-violet-500" />
                <div>
                  <h3 className="font-semibold">Business Credit</h3>
                  <p className="text-sm text-muted-foreground">Build credit</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/new-business-guide">
            <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 hover:border-red-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <BookOpen className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="font-semibold">New Business Guide</h3>
                  <p className="text-sm text-muted-foreground">Avoid mistakes</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/threat-scan">
            <Card className="bg-gradient-to-r from-cyan-500/20 to-sky-500/20 border-cyan-500/30 hover:border-cyan-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <ShieldCheck className="h-8 w-8 text-cyan-500" />
                <div>
                  <h3 className="font-semibold">Threat Scan</h3>
                  <p className="text-sm text-muted-foreground">Cybersecurity</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/side-hustle">
            <Card className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30 hover:border-amber-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Sparkles className="h-8 w-8 text-amber-500" />
                <div>
                  <h3 className="font-semibold">1st World Problems</h3>
                  <p className="text-sm text-muted-foreground">Concierge</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Third Row - New Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/youtube-channel">
            <Card className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30 hover:border-red-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Youtube className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="font-semibold">AI YouTube Channel</h3>
                  <p className="text-sm text-muted-foreground">Automated content</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/virtual-notary">
            <Card className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border-indigo-500/30 hover:border-indigo-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Stamp className="h-8 w-8 text-indigo-500" />
                <div>
                  <h3 className="font-semibold">Virtual Notary</h3>
                  <p className="text-sm text-muted-foreground">Remote notarization</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/llc-formation">
            <Card className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border-teal-500/30 hover:border-teal-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <FileSignature className="h-8 w-8 text-teal-500" />
                <div>
                  <h3 className="font-semibold">LLC Formation</h3>
                  <p className="text-sm text-muted-foreground">Start your business</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dynasty-trust">
            <Card className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 hover:border-yellow-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Landmark className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold">Dynasty Trust</h3>
                  <p className="text-sm text-muted-foreground">Wealth protection</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Healthcare Provider Tools */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Link href="/sc-provider">
            <Card className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/30 hover:border-teal-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Stethoscope className="h-8 w-8 text-teal-500" />
                <div>
                  <h3 className="font-semibold">SC Provider Setup</h3>
                  <p className="text-sm text-muted-foreground">Telehealth practice guide</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/medical-billing">
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-500/50 cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <Receipt className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Medical Billing</h3>
                  <p className="text-sm text-muted-foreground">CPT/ICD-10 codes & billing</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Business Command Center */}
        <div className="mt-6">
          <Link href="/business-command">
            <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 hover:border-indigo-500/50 cursor-pointer">
              <CardContent className="flex items-center gap-4 py-6">
                <Building2 className="h-10 w-10 text-indigo-500" />
                <div>
                  <h3 className="text-xl font-semibold">Business Command Center</h3>
                  <p className="text-sm text-muted-foreground">DUNS, Stripe, Nav, BlueVine, SC Compliance, Social Media Analytics & Transcripts</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/settings" className="hover:text-primary">Settings</Link>
          </div>
          <p>© 2024 Kaiden AI by Syndica Solutions. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
