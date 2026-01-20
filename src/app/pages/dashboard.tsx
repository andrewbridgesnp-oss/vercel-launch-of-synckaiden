import { Phone, Calendar, DollarSign, Users, PhoneCall, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { KPICard } from "../components/avery/kpi-card";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { StatusBadge } from "../components/avery/status-badge";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const kpis = [
    { title: "Calls Answered", value: "147", change: "+12% vs last week", icon: Phone, trend: "up" as const },
    { title: "Missed Calls Prevented", value: "89", change: "+23% vs last week", icon: PhoneCall, trend: "up" as const },
    { title: "Appointments Booked", value: "52", change: "+8% vs last week", icon: Calendar, trend: "up" as const },
    { title: "Payments Collected", value: "$12,450", change: "+15% vs last week", icon: DollarSign, trend: "up" as const },
    { title: "Customer Satisfaction", value: "4.8/5", change: "Based on 94 responses", icon: Users, trend: "neutral" as const },
    { title: "Avg. Response Time", value: "2.3s", change: "-0.5s vs last week", icon: Clock, trend: "up" as const }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "call",
      caller: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      outcome: "Appointment Booked",
      time: "2 minutes ago",
      status: "success"
    },
    {
      id: 2,
      type: "payment",
      caller: "Michael Chen",
      phone: "+1 (555) 234-5678",
      outcome: "Payment Received - $150",
      time: "15 minutes ago",
      status: "success"
    },
    {
      id: 3,
      type: "call",
      caller: "Emma Davis",
      phone: "+1 (555) 345-6789",
      outcome: "Information Provided",
      time: "32 minutes ago",
      status: "info"
    },
    {
      id: 4,
      type: "booking",
      caller: "James Wilson",
      phone: "+1 (555) 456-7890",
      outcome: "Consultation - Jan 15, 2pm",
      time: "1 hour ago",
      status: "success"
    },
    {
      id: 5,
      type: "call",
      caller: "Lisa Anderson",
      phone: "+1 (555) 567-8901",
      outcome: "Voicemail + SMS Follow-up",
      time: "2 hours ago",
      status: "pending"
    }
  ];

  const averyStatus = {
    active: true,
    phone: "+1 (555) 100-2000",
    coverageHours: "24/7",
    plan: "Professional"
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what Avery has been up to.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onNavigate("calls")}>
            View All Calls
          </Button>
          <Button onClick={() => onNavigate("settings")}>
            Settings
          </Button>
        </div>
      </div>

      {/* Avery Status Card */}
      <GlassmorphismCard className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">Avery Status</h3>
                <StatusBadge status={averyStatus.active ? "active" : "pending"} />
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Business Phone: <span className="text-foreground font-medium">{averyStatus.phone}</span></p>
                <p>Coverage: <span className="text-foreground font-medium">{averyStatus.coverageHours}</span></p>
                <p>Plan: <span className="text-foreground font-medium">{averyStatus.plan}</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {averyStatus.active ? "Active" : "Paused"}
            </span>
            <Switch checked={averyStatus.active} />
          </div>
        </div>
      </GlassmorphismCard>

      {/* KPIs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Live Activity</h2>
        <GlassmorphismCard className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 hover:bg-muted/30 rounded-lg transition-colors cursor-pointer"
                onClick={() => onNavigate("calls")}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.status === "success" ? "bg-green-500/10" :
                  activity.status === "pending" ? "bg-yellow-500/10" :
                  "bg-blue-500/10"
                }`}>
                  {activity.type === "call" && <Phone className="w-5 h-5 text-accent" />}
                  {activity.type === "payment" && <DollarSign className="w-5 h-5 text-green-500" />}
                  {activity.type === "booking" && <Calendar className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{activity.caller}</p>
                      <p className="text-sm text-muted-foreground">{activity.phone}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <p className="text-sm">{activity.outcome}</p>
                  </div>
                </div>
              </div>
            ))}

            {recentActivity.length === 0 && (
              <div className="text-center py-12">
                <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground">Avery is standing by and ready to take calls</p>
              </div>
            )}
          </div>
        </GlassmorphismCard>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
            onClick={() => onNavigate("calls")}
          >
            <Phone className="w-6 h-6" />
            <span>View Calls</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
            onClick={() => onNavigate("bookings")}
          >
            <Calendar className="w-6 h-6" />
            <span>Bookings</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
            onClick={() => onNavigate("bookings")}
          >
            <DollarSign className="w-6 h-6" />
            <span>Payments</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
            onClick={() => onNavigate("settings")}
          >
            <TrendingUp className="w-6 h-6" />
            <span>Analytics</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
