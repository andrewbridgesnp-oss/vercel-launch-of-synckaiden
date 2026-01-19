import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot, Phone, MessageSquare, Settings, Zap, Clock, Users, Loader2, Calendar, DollarSign, PhoneCall, TrendingUp, Search, Download, Play, Send } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function AveryAI() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOutcome, setFilterOutcome] = useState("all");
  const [averyActive, setAveryActive] = useState(true);

  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "avery-ai-receptionist" },
    { enabled: isAuthenticated }
  );

  const { data: conversations = [] } = trpc.averyAI.getConversations.useQuery(
    undefined,
    { enabled: isAuthenticated && entitlement?.hasAccess }
  );

  const { data: analytics } = trpc.averyAI.getAnalytics.useQuery(
    undefined,
    { enabled: isAuthenticated && entitlement?.hasAccess }
  );

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

  const kpis = [
    { title: "Calls Answered", value: analytics?.totalCalls || "0", change: "+12% vs last week", icon: Phone, trend: "up" },
    { title: "Missed Calls Prevented", value: analytics?.missedCallsPrevented || "0", change: "+23% vs last week", icon: PhoneCall, trend: "up" },
    { title: "Appointments Booked", value: analytics?.appointmentsBooked || "0", change: "+8% vs last week", icon: Calendar, trend: "up" },
    { title: "Payments Collected", value: `$${analytics?.paymentsCollected || "0"}`, change: "+15% vs last week", icon: DollarSign, trend: "up" },
    { title: "Customer Satisfaction", value: analytics?.satisfaction || "4.8/5", change: "Based on responses", icon: Users, trend: "neutral" },
    { title: "Avg. Response Time", value: analytics?.avgResponseTime || "2.3s", change: "-0.5s vs last week", icon: Clock, trend: "up" }
  ];

  const mockCalls = [
    {
      id: "C-1001",
      caller: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      date: "Jan 19, 2026",
      time: "2:45 PM",
      duration: "3:24",
      outcome: "Appointment Booked",
      outcomeType: "success",
      transcript: "Customer called to schedule a consultation. Avery successfully booked an appointment and sent confirmation via SMS."
    },
    {
      id: "C-1002",
      caller: "Michael Chen",
      phone: "+1 (555) 234-5678",
      date: "Jan 19, 2026",
      time: "1:20 PM",
      duration: "2:15",
      outcome: "Payment Collected",
      outcomeType: "success",
      transcript: "Customer inquired about services. Avery provided information and successfully processed a $150 deposit payment."
    },
    {
      id: "C-1003",
      caller: "Emma Davis",
      phone: "+1 (555) 345-6789",
      date: "Jan 19, 2026",
      time: "11:05 AM",
      duration: "1:48",
      outcome: "Information Provided",
      outcomeType: "info",
      transcript: "Customer asked about business hours and services. Avery provided requested information."
    }
  ];

  const mockBookings = [
    {
      id: "B-2001",
      customer: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      service: "Consultation",
      date: "Jan 22, 2026",
      time: "2:00 PM",
      price: "$150",
      status: "paid"
    },
    {
      id: "B-2002",
      customer: "Michael Chen",
      phone: "+1 (555) 234-5678",
      service: "Follow-up Session",
      date: "Jan 23, 2026",
      time: "10:00 AM",
      price: "$75",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      {/* Hero */}
      <div className="border-b border-border/50 glass">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/30">
              <Bot className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">Avery AI Receptionist</h1>
              <p className="text-muted-foreground text-lg">
                24/7 AI-powered call handling, appointment scheduling, and payment collection
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calls">Calls & Messages</TabsTrigger>
            <TabsTrigger value="bookings">Appointments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Avery Status Card */}
            <Card className="glass premium-card border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      <Phone className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">Avery Status</h3>
                        <Badge variant={averyActive ? "default" : "secondary"}>
                          {averyActive ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Business Phone: <span className="text-foreground font-medium">+1 (555) 100-2000</span></p>
                        <p>Coverage: <span className="text-foreground font-medium">24/7</span></p>
                        <p>Plan: <span className="text-foreground font-medium">Professional</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {averyActive ? "Active" : "Paused"}
                    </span>
                    <Switch checked={averyActive} onCheckedChange={setAveryActive} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPIs */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                  <Card key={index} className="glass premium-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <kpi.icon className="w-8 h-8 text-primary" />
                        {kpi.trend === "up" && <TrendingUp className="w-5 h-5 text-green-500" />}
                      </div>
                      <h3 className="text-3xl font-bold mb-1">{kpi.value}</h3>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</p>
                      <p className="text-xs text-muted-foreground">{kpi.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Live Activity Feed */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Live Activity</h2>
              <Card className="glass premium-card border-border/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {conversations.slice(0, 5).map((conv: any) => (
                      <div
                        key={conv.id}
                        className="flex items-start gap-4 p-4 hover:bg-muted/30 rounded-lg transition-colors cursor-pointer"
                        onClick={() => setActiveTab("calls")}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-500/10">
                          <Phone className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="font-medium">{conv.customerName || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">{conv.customerPhone || "No phone"}</p>
                            </div>
                            <Badge variant={conv.status === "resolved" ? "default" : "secondary"}>
                              {conv.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(conv.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {conversations.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No recent activity. Avery is ready to handle your calls!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calls & Messages */}
          <TabsContent value="calls" className="space-y-6">
            <Card className="glass premium-card border-border/50">
              <CardHeader>
                <CardTitle>Calls & Messages</CardTitle>
                <CardDescription>Review all interactions handled by Avery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or phone..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={filterOutcome} onValueChange={setFilterOutcome}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filter by outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Outcomes</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                {/* Calls Table */}
                <div className="border border-border/30 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Caller</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCalls.map((call) => (
                        <TableRow key={call.id}>
                          <TableCell className="font-medium">{call.id}</TableCell>
                          <TableCell>{call.caller}</TableCell>
                          <TableCell className="text-muted-foreground">{call.phone}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{call.date}</div>
                              <div className="text-muted-foreground">{call.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>{call.duration}</TableCell>
                          <TableCell>
                            <Badge variant={call.outcomeType === "success" ? "default" : "secondary"}>
                              {call.outcome}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              Play
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments/Bookings */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="glass premium-card border-border/50">
              <CardHeader>
                <CardTitle>Appointments & Bookings</CardTitle>
                <CardDescription>Manage appointments scheduled by Avery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-border/30 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div>
                              <div>{booking.customer}</div>
                              <div className="text-sm text-muted-foreground">{booking.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.service}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{booking.date}</div>
                              <div className="text-muted-foreground">{booking.time}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{booking.price}</TableCell>
                          <TableCell>
                            <Badge variant={booking.status === "paid" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {booking.status === "pending" && (
                              <Button variant="ghost" size="sm" onClick={() => toast.success("Payment link sent")}>
                                <Send className="w-4 h-4 mr-2" />
                                Send Link
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="glass premium-card border-border/50">
              <CardHeader>
                <CardTitle>Avery Settings</CardTitle>
                <CardDescription>Configure your AI receptionist</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" placeholder="Your Business Name" />
                  </div>
                  <div>
                    <Label htmlFor="business-phone">Business Phone</Label>
                    <Input id="business-phone" placeholder="+1 (555) 100-2000" />
                  </div>
                  <div>
                    <Label htmlFor="greeting">Custom Greeting</Label>
                    <Input id="greeting" placeholder="Thank you for calling..." />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Book Appointments</Label>
                      <p className="text-sm text-muted-foreground">Allow Avery to automatically book appointments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Collect Payments</Label>
                      <p className="text-sm text-muted-foreground">Enable payment collection during calls</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send SMS confirmations to customers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
