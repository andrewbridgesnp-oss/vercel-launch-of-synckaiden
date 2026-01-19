import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Mail,
  FileText,
  BarChart3,
  Link2,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageSquare,
  Send,
  Eye,
  Heart,
  Share2,
  Settings,
  RefreshCw,
  Video,
  Ghost,
  Music,
} from "lucide-react";

// SC LLC Compliance Checklist
const SC_LLC_CHECKLIST = [
  { id: 1, task: "File Articles of Organization with SC Secretary of State", required: true, link: "https://sos.sc.gov/online-filings" },
  { id: 2, task: "Obtain EIN from IRS", required: true, link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
  { id: 3, task: "Register for SC Business License", required: true, link: "https://dor.sc.gov/tax/business-license" },
  { id: 4, task: "Register for SC Withholding Tax (if employees)", required: false, link: "https://dor.sc.gov/tax/withholding" },
  { id: 5, task: "Register for SC Sales Tax (if selling goods)", required: false, link: "https://dor.sc.gov/tax/sales" },
  { id: 6, task: "File Annual Report with SC Secretary of State", required: true, link: "https://sos.sc.gov/online-filings" },
  { id: 7, task: "Maintain Registered Agent in SC", required: true, link: "" },
  { id: 8, task: "Create Operating Agreement", required: false, link: "" },
  { id: 9, task: "Open Business Bank Account", required: false, link: "" },
  { id: 10, task: "Obtain Business Insurance", required: false, link: "" },
];

export default function BusinessCommand() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  
  // Business account placeholders
  const [businessAccounts] = useState({
    duns: { connected: false, number: "" },
    broadstreet: { connected: false, accountId: "" },
    nav: { connected: false, accountId: "" },
    bluevine: { connected: false, accountId: "" },
    stripe: { connected: true, accountId: "acct_1SdulmDDDze9czV5" },
  });

  // Social media placeholders - User's platforms: Facebook, TikTok, Snapchat, Instagram, YouTube
  const [socialAccounts] = useState([
    { platform: "facebook", connected: false, followers: 0, engagement: 0, icon: Facebook },
    { platform: "instagram", connected: false, followers: 0, engagement: 0, icon: Instagram },
    { platform: "tiktok", connected: false, followers: 0, engagement: 0, icon: Music },
    { platform: "snapchat", connected: false, followers: 0, engagement: 0, icon: Ghost },
    { platform: "youtube", connected: false, subscribers: 0, views: 0, icon: Youtube },
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleTask = (taskId: number) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gold-shimmer">Business Command Center</h1>
              <p className="text-muted-foreground">
                Manage all your business accounts, compliance, and analytics in one place
              </p>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2 bg-card/50 backdrop-blur mb-8">
            <TabsTrigger value="overview" className="py-3">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="accounts" className="py-3">
              <Link2 className="h-4 w-4 mr-2" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="compliance" className="py-3">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              SC Compliance
            </TabsTrigger>
            <TabsTrigger value="social" className="py-3">
              <Share2 className="h-4 w-4 mr-2" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="transcripts" className="py-3">
              <FileText className="h-4 w-4 mr-2" />
              Transcripts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Sales</p>
                      <p className="text-3xl font-bold">$0.00</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <Package className="h-10 w-10 text-blue-500/50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="text-3xl font-bold">0</p>
                    </div>
                    <Users className="h-10 w-10 text-purple-500/50" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Growth</p>
                      <p className="text-3xl font-bold">0%</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-amber-500/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats by Site */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    Kaiden AI Platform
                  </CardTitle>
                  <CardDescription>Main business platform analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gross Sales (Today)</span>
                      <span className="font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Net Sales (Today)</span>
                      <span className="font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active Subscribers</span>
                      <span className="font-bold">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Top Product</span>
                      <span className="font-bold text-sm">No sales yet</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    Bougie Boutique
                  </CardTitle>
                  <CardDescription>Emily's mental health platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gross Sales (Today)</span>
                      <span className="font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Net Sales (Today)</span>
                      <span className="font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Products Sold</span>
                      <span className="font-bold">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Top Product</span>
                      <span className="font-bold text-sm">No sales yet</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Business Accounts Tab */}
          <TabsContent value="accounts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DUNS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>D-U-N-S Number</span>
                    <Badge variant={businessAccounts.duns.connected ? "default" : "secondary"}>
                      {businessAccounts.duns.connected ? "Connected" : "Not Set"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Dun & Bradstreet business identifier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>DUNS Number</Label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Enter your DUNS number" />
                        <Button>Save</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://www.dnb.com/duns-number/get-a-duns.html" target="_blank" rel="noopener">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Get a DUNS Number
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Broadstreet */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Broadstreet</span>
                    <Badge variant={businessAccounts.broadstreet.connected ? "default" : "secondary"}>
                      {businessAccounts.broadstreet.connected ? "Connected" : "Not Set"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Business credit monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Account ID</Label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Enter your Broadstreet ID" />
                        <Button>Save</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://www.nav.com" target="_blank" rel="noopener">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Broadstreet
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Nav */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Nav</span>
                    <Badge variant={businessAccounts.nav.connected ? "default" : "secondary"}>
                      {businessAccounts.nav.connected ? "Connected" : "Not Set"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Business credit scores & financing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Nav Account</Label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Enter your Nav account email" />
                        <Button>Save</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://www.nav.com" target="_blank" rel="noopener">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Nav
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* BlueVine */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>BlueVine</span>
                    <Badge variant={businessAccounts.bluevine.connected ? "default" : "secondary"}>
                      {businessAccounts.bluevine.connected ? "Connected" : "Not Set"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Business banking & credit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>BlueVine Account</Label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Enter your BlueVine email" />
                        <Button>Save</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://www.bluevine.com" target="_blank" rel="noopener">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit BlueVine
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stripe */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Stripe
                    </span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </CardTitle>
                  <CardDescription>Payment processing for all platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Label className="text-muted-foreground">Account ID</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm">{businessAccounts.stripe.accountId}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(businessAccounts.stripe.accountId)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <Label className="text-muted-foreground">Status</Label>
                      <p className="text-sm mt-1 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        Sandbox - Claim to activate
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button asChild>
                      <a href="https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU2R1bG1ERER6ZTljelY1LDE3NjYyNTYxMTIv100U9whSflK" target="_blank" rel="noopener">
                        Claim Stripe Sandbox
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://dashboard.stripe.com" target="_blank" rel="noopener">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Dashboard
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SC Compliance Tab */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>South Carolina LLC Compliance Checklist</CardTitle>
                <CardDescription>
                  Track your compliance requirements for operating an LLC in South Carolina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {SC_LLC_CHECKLIST.map((item) => (
                    <div 
                      key={item.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                        completedTasks.includes(item.id) 
                          ? "bg-green-500/10 border-green-500/30" 
                          : "bg-card hover:bg-muted/50"
                      }`}
                      onClick={() => toggleTask(item.id)}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        completedTasks.includes(item.id) 
                          ? "bg-green-500 border-green-500" 
                          : "border-muted-foreground"
                      }`}>
                        {completedTasks.includes(item.id) && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={completedTasks.includes(item.id) ? "line-through text-muted-foreground" : ""}>
                          {item.task}
                        </p>
                        {item.required && (
                          <Badge variant="destructive" className="mt-1 text-xs">Required</Badge>
                        )}
                      </div>
                      {item.link && (
                        <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                          <a href={item.link} target="_blank" rel="noopener">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Progress:</strong> {completedTasks.length} of {SC_LLC_CHECKLIST.length} tasks completed
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(completedTasks.length / SC_LLC_CHECKLIST.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialAccounts.map((account) => (
                <Card key={account.platform}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2 capitalize">
                        <account.icon className="h-5 w-5" />
                        {account.platform}
                      </span>
                      <Badge variant={account.connected ? "default" : "secondary"}>
                        {account.connected ? "Connected" : "Not Connected"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {account.connected ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Followers
                          </span>
                          <span className="font-bold">{(account.followers || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            Views
                          </span>
                          <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            Replies
                          </span>
                          <span className="font-bold">0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Send className="h-4 w-4" />
                            Sent
                          </span>
                          <span className="font-bold">0</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Stats
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm mb-4">
                          Connect your {account.platform} account to track analytics
                        </p>
                        <Button onClick={() => { toast.info("Connect Social Media", { description: "Go to Integrations to connect your accounts" }); window.location.href = "/integrations"; }}>
                          Connect {account.platform}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transcripts Tab */}
          <TabsContent value="transcripts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Business Transcripts
                </CardTitle>
                <CardDescription>
                  All business-related conversation transcripts with option to forward to email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transcripts yet</p>
                  <p className="text-sm mt-2">
                    Business conversations will appear here with options to forward to your email
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Email Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Business Email
                </CardTitle>
                <CardDescription>
                  Configure your business email for daily reports and transcript forwarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Business Email Address</Label>
                    <div className="flex gap-2 mt-1">
                      <Input placeholder="business@syndicasolutions.com" type="email" />
                      <Button>Save</Button>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Daily Report Schedule:</strong> 11:30 PM EST
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Includes: Gross/net sales, top products, top customers for both Kaiden AI and Bougie Boutique
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
