import { StatCard } from "../components/stat-card";
import { GlassCard } from "../components/glass-card";
import { Users, TrendingUp, DollarSign, Target, ArrowUpRight, Lightbulb } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const leadData = [
  { name: "Mon", leads: 24, conversions: 8 },
  { name: "Tue", leads: 32, conversions: 12 },
  { name: "Wed", leads: 28, conversions: 10 },
  { name: "Thu", leads: 45, conversions: 18 },
  { name: "Fri", leads: 38, conversions: 15 },
  { name: "Sat", leads: 22, conversions: 9 },
  { name: "Sun", leads: 18, conversions: 7 },
];

const funnelData = [
  { stage: "Visitors", value: 10000, fill: "#c0c8d8" },
  { stage: "Leads", value: 2500, fill: "#60a5fa" },
  { stage: "Qualified", value: 800, fill: "#818cf8" },
  { stage: "Customers", value: 240, fill: "#a78bfa" },
];

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 58000 },
  { month: "Jun", revenue: 72000 },
];

export function Overview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Leads This Month"
          value="1,284"
          change="+23.5% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Conversion Rate"
          value="34.2%"
          change="+5.3% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Cost Per Lead"
          value="$12.40"
          change="-8.2% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Revenue Generated"
          value="$72,450"
          change="+18.7% from last month"
          changeType="positive"
          icon={Target}
        />
      </div>

      {/* AI Insight Card */}
      <GlassCard className="p-6 border-l-4 border-l-primary">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-3">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">AI Insight: What to Fix Next</h3>
            <p className="text-muted-foreground mb-3">
              Your "Summer Sale" campaign has a 42% drop-off rate on the landing page. Consider A/B testing a
              shorter form or adding social proof above the fold. Projected impact: +18 conversions/week.
            </p>
            <button className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View Recommendations
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Trends */}
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg mb-4">Lead & Conversion Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={leadData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c0c8d8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c0c8d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 200, 216, 0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(192, 200, 216, 0.2)",
                  borderRadius: "8px",
                  color: "#e8edf5",
                }}
              />
              <Area type="monotone" dataKey="leads" stroke="#60a5fa" fillOpacity={1} fill="url(#colorLeads)" />
              <Area type="monotone" dataKey="conversions" stroke="#c0c8d8" fillOpacity={1} fill="url(#colorConv)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Funnel Visualization */}
        <GlassCard className="p-6">
          <h3 className="font-semibold text-lg mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((stage, index) => {
              const percentage = index === 0 ? 100 : ((stage.value / funnelData[0].value) * 100).toFixed(1);
              const conversionRate =
                index > 0 ? ((stage.value / funnelData[index - 1].value) * 100).toFixed(1) : null;
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-4">
                      {conversionRate && (
                        <span className="text-xs text-emerald-400">{conversionRate}% converted</span>
                      )}
                      <span className="text-sm font-semibold">{stage.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-12 rounded-lg overflow-hidden relative" style={{ backgroundColor: "rgba(30, 41, 59, 0.5)" }}>
                    <div
                      className="h-full rounded-lg transition-all duration-500 flex items-center justify-center"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: stage.fill,
                      }}
                    >
                      <span className="text-xs font-semibold text-primary-foreground">{percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Revenue Chart */}
      <GlassCard className="p-6">
        <h3 className="font-semibold text-lg mb-4">Revenue Attribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c0c8d8" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(192, 200, 216, 0.1)" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(192, 200, 216, 0.2)",
                borderRadius: "8px",
                color: "#e8edf5",
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Bar dataKey="revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}
