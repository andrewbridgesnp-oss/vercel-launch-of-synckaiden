import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { io } from "socket.io-client";
import { OnboardingTour } from "@/components/OnboardingTour";
import { NotificationCenter } from "@/components/NotificationCenter";
import { DashboardStatsSkeleton, QuickActionsSkeleton } from "@/components/DashboardSkeleton";
import {
  LayoutGrid,
  List,
  Search,
  Bell,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  MessageSquare,
  Workflow,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
  badge?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "chat", title: "Chat with Kaiden", description: "AI business consultant", icon: MessageSquare, link: "/chat", badge: "AI" },
  { id: "crm", title: "CRM", description: "Manage contacts & leads", icon: Users, link: "/crm" },
  { id: "workflows", title: "Workflows", description: "Automate your business", icon: Workflow, link: "/workflows" },
  { id: "orders", title: "Orders", description: "Track sales & fulfillment", icon: Package, link: "/orders" },
  { id: "analytics", title: "Analytics", description: "Business insights", icon: BarChart3, link: "/analytics" },
  { id: "finance", title: "Finance", description: "Invoices & expenses", icon: DollarSign, link: "/finance" },
];

export default function DashboardNew() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("kayden_tour_completed");
    if (!tourCompleted && user) {
      setShowTour(true);
    }
  }, [user]);

  // Fetch real data
  const { data: conversations = [], isLoading: conversationsLoading } = trpc.chat.getConversations.useQuery();
  const { data: orders = [], isLoading: ordersLoading } = trpc.orders.list.useQuery();
  const { data: contactsData = [], isLoading: contactsLoading } = trpc.crm.listContacts.useQuery({ workspaceId: 1, limit: 100 });
  const contacts = contactsData;
  const isLoading = conversationsLoading || ordersLoading || contactsLoading;

  // WebSocket for real-time notifications
  useEffect(() => {
    if (!user) return;

    const socket = io(window.location.origin, {
      withCredentials: true,
    });

    socket.on("connected", (data) => {
      console.log("[Dashboard] WebSocket connected:", data);
    });

    socket.on("notification", (notification) => {
      console.log("[Dashboard] Notification:", notification);
      setNotifications((prev) => [notification, ...prev].slice(0, 10));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Filter actions by search
  const filteredActions = QUICK_ACTIONS.filter(
    (action) =>
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = [
    { label: "Conversations", value: conversations.length, icon: MessageSquare, trend: "+12%" },
    { label: "Orders", value: orders.length, icon: Package, trend: "+8%" },
    { label: "Contacts", value: contacts.length, icon: Users, trend: "+15%" },
    { label: "Revenue", value: "$0", icon: DollarSign, trend: "+0%" },
  ];

  return (
    <>
      {showTour && <OnboardingTour onComplete={() => setShowTour(false)} />}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <Link href="/">
              <a className="flex items-center gap-2 font-bold text-xl">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="hidden sm:inline">Kaiden</span>
              </a>
            </Link>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tools, contacts, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-100 dark:bg-slate-800 border-0"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{user?.name || "User"}</span>
            </div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-4 top-16 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="font-semibold mb-3">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No new notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif, i) => (
                  <div key={i} className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-sm">
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-muted-foreground text-xs">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {stat.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActions.map((action) => (
              <Link key={action.id} href={action.link}>
                <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group hover:scale-105">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <action.icon className="w-6 h-6 text-primary" />
                    </div>
                    {action.badge && (
                      <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-primary to-purple-600 text-white rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                  <div className="mt-4 flex items-center text-sm text-primary font-medium">
                    Open <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredActions.map((action) => (
              <Link key={action.id} href={action.link}>
                <Card className="p-4 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center">
                      <action.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    {action.badge && (
                      <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-primary to-purple-600 text-white rounded-full">
                        {action.badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card className="p-6">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No recent activity yet</p>
                <Button asChild>
                  <Link href="/chat">
                    <Zap className="w-4 h-4 mr-2" />
                    Start a conversation
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.slice(0, 5).map((conv: any) => (
                  <Link key={conv.id} href={`/chat?id=${conv.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{conv.title || "Untitled Conversation"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}
