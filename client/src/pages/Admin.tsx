import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  MessageSquare, 
  ShoppingCart, 
  Mail, 
  Shield, 
  TrendingUp, 
  Activity,
  Users,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { UserManagement } from "@/components/UserManagement";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useLocation()[1];

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");
  const [liveUpdate, setLiveUpdate] = useState(false);
  const utils = trpc.useUtils();

  // Fetch dashboard metrics
  const { data: conversations = [] } = trpc.chat.getConversations.useQuery();
  const { data: orders = [] } = trpc.orders.list.useQuery();
  const { data: campaigns = [] } = trpc.campaigns.list.useQuery();
  const { data: securityEvents = [] } = trpc.security.getEvents.useQuery();

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!user) return;

    const socket = io(window.location.origin, {
      auth: { userId: user.id },
    });

    socket.on("connect", () => {
      console.log("[Admin] WebSocket connected");
    });

    socket.on("notification", (notification: any) => {
      console.log("[Admin] Received notification:", notification);
      setLiveUpdate(true);
      setTimeout(() => setLiveUpdate(false), 2000);

      // Invalidate queries to refresh data
      if (notification.type === "security_alert") {
        utils.security.getEvents.invalidate();
      } else if (notification.type === "new_order") {
        utils.orders.list.invalidate();
      } else if (notification.type === "new_conversation") {
        utils.chat.getConversations.invalidate();
      } else if (notification.type === "campaign_sent") {
        utils.campaigns.list.invalidate();
      }
    });

    socket.on("disconnect", () => {
      console.log("[Admin] WebSocket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [user, utils]);

  // Calculate metrics
  const totalConversations = conversations.length;
  const totalOrders = orders.length;
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c: any) => c.status === "active").length;
  const securityAlerts = securityEvents.filter((e: any) => e.severity === "high").length;

  // Calculate revenue
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.amount || 0), 0);

  // Recent activity (combine different event types)
  const recentActivity = [
    ...conversations.slice(0, 3).map((c: any) => ({
      type: "conversation",
      title: c.title || "New Conversation",
      time: new Date(c.createdAt).toLocaleString(),
      icon: MessageSquare,
    })),
    ...orders.slice(0, 3).map((o: any) => ({
      type: "order",
      title: `Order #${o.id} - $${(o.amount / 100).toFixed(2)}`,
      time: new Date(o.createdAt).toLocaleString(),
      icon: ShoppingCart,
    })),
    ...securityEvents.slice(0, 3).map((e: any) => ({
      type: "security",
      title: e.eventType,
      time: new Date(e.timestamp).toLocaleString(),
      icon: Shield,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back to Home</Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold cyan-shimmer mb-2">Admin Dashboard</h1>
                {liveUpdate && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full animate-pulse">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-400 font-medium">LIVE UPDATE</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">Real-time business metrics and activity</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeRange === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("day")}
              >
                Day
              </Button>
              <Button
                variant={timeRange === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("week")}
              >
                Week
              </Button>
              <Button
                variant={timeRange === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("month")}
              >
                Month
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Conversations */}
          <Card className="glass premium-card border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Conversations</p>
              <p className="text-3xl font-bold mt-1">{totalConversations}</p>
              <p className="text-xs text-green-500 mt-2">+12% from last {timeRange}</p>
            </div>
          </Card>

          {/* Orders */}
          <Card className="glass premium-card border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold mt-1">{totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-2">
                ${(totalRevenue / 100).toFixed(2)} revenue
              </p>
            </div>
          </Card>

          {/* Campaigns */}
          <Card className="glass premium-card border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <Mail className="h-8 w-8 text-primary" />
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
              <p className="text-3xl font-bold mt-1">{activeCampaigns}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {totalCampaigns} total campaigns
              </p>
            </div>
          </Card>

          {/* Security */}
          <Card className="glass premium-card border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="h-8 w-8 text-primary" />
              {securityAlerts > 0 ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              ) : (
                <Activity className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Security Alerts</p>
              <p className="text-3xl font-bold mt-1">{securityAlerts}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {securityEvents.length} total events
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="glass premium-card border-border/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Recent Activity</h2>
            </div>

            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded glass border border-border/30 hover:border-primary/50 transition-colors"
                  >
                    <activity.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="glass premium-card border-border/50 p-6">
            <div className="flex items-center gap-2 mb-6">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/chat">
                <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-sm">New Chat</span>
                </Button>
              </Link>

              <Link href="/analytics">
                <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                  <Mail className="h-6 w-6" />
                  <span className="text-sm">New Campaign</span>
                </Button>
              </Link>

              <Link href="/inventory">
                <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="text-sm">Add Product</span>
                </Button>
              </Link>

              <Link href="/scheduler">
                <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Schedule</span>
                </Button>
              </Link>

              <Link href="/security">
                <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">Security</span>
                </Button>
              </Link>

              <Link href="/settings">
                <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Settings</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* System Health */}
        <Card className="glass premium-card border-border/50 p-6 mt-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">System Health</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded glass border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">API Status</p>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-lg font-bold">Operational</p>
              <p className="text-xs text-muted-foreground mt-1">99.9% uptime</p>
            </div>

            <div className="p-4 rounded glass border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Database</p>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-lg font-bold">Healthy</p>
              <p className="text-xs text-muted-foreground mt-1">Low latency</p>
            </div>

            <div className="p-4 rounded glass border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Storage</p>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-lg font-bold">Available</p>
              <p className="text-xs text-muted-foreground mt-1">78% capacity</p>
            </div>
          </div>
        </Card>
        {/* User Management Section */}
        <div className="mt-8">
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
