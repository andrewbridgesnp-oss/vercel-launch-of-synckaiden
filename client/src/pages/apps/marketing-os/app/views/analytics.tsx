import { GlassCard } from "../components/glass-card";
import { StatCard } from "../components/stat-card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  TrendingUp,
  DollarSign,
  Users,
  MousePointerClick,
  Download,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const campaignPerformance = [
  { name: "Summer Sale", leads: 342, conversions: 89, revenue: 24500, roi: 385 },
  { name: "Product Launch", leads: 156, conversions: 52, revenue: 18200, roi: 412 },
  { name: "Local Services", leads: 98, conversions: 34, revenue: 8900, roi: 298 },
  { name: "B2B Campaign", leads: 234, conversions: 78, revenue: 31200, roi: 356 },
];

const funnelDropoff = [
  { stage: "Landing Page", visitors: 10000, dropoff: 0 },
  { stage: "Form View", visitors: 6500, dropoff: 35 },
  { stage: "Form Submit", visitors: 2500, dropoff: 62 },
  { stage: "Thank You", visitors: 2400, dropoff: 4 },
];

const channelData = [
  { name: "Facebook", value: 35, color: "#60a5fa" },
  { name: "Google", value: 28, color: "#c0c8d8" },
  { name: "Email", value: 22, color: "#818cf8" },
  { name: "LinkedIn", value: 15, color: "#a78bfa" },
];

const revenueByMonth = [
  { month: "Jan", revenue: 45000, cost: 12000 },
  { month: "Feb", revenue: 52000, cost: 13500 },
  { month: "Mar", revenue: 48000, cost: 11800 },
  { month: "Apr", revenue: 61000, cost: 14200 },
  { month: "May", revenue: 58000, cost: 13000 },
  { month: "Jun", revenue: 72000, cost: 15600 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Analytics & ROI</h2>
          <p className="text-muted-foreground mt-1">Data-driven insights for better decisions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$336K"
          change="+24.3% vs last period"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Total Leads"
          value="3,284"
          change="+18.7% vs last period"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Avg. Conversion Rate"
          value="28.4%"
          change="+3.2% vs last period"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Click-Through Rate"
          value="4.8%"
          change="+0.9% vs last period"
          changeType="positive"
          icon={MousePointerClick}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Comparison</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue vs Cost */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue vs Marketing Spend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueByMonth}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#c0c8d8"
                  strokeWidth={3}
                  dot={{ fill: "#c0c8d8", r: 5 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ fill: "#60a5fa", r: 5 }}
                  name="Cost"
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Channel Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Key Metrics Explanation</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/30">
                  <h4 className="font-semibold mb-1">Revenue Attribution</h4>
                  <p className="text-sm text-muted-foreground">
                    We track which campaigns directly led to purchases using multi-touch attribution modeling.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30">
                  <h4 className="font-semibold mb-1">ROI Calculation</h4>
                  <p className="text-sm text-muted-foreground">
                    ROI = (Revenue - Marketing Spend) / Marketing Spend × 100%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30">
                  <h4 className="font-semibold mb-1">Conversion Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Conversions are tracked from first touch to final purchase across all channels.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={campaignPerformance}>
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
                <Legend />
                <Bar dataKey="leads" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Leads" />
                <Bar dataKey="conversions" fill="#c0c8d8" radius={[4, 4, 0, 0]} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {campaignPerformance.map((campaign) => (
                <div key={campaign.name} className="p-4 rounded-lg bg-accent/30">
                  <p className="text-sm text-muted-foreground mb-1">{campaign.name}</p>
                  <p className="text-2xl font-semibold text-primary">{campaign.roi}%</p>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Funnel Drop-off Analysis</h3>
            <div className="space-y-4">
              {funnelDropoff.map((stage, index) => {
                const percentage = ((stage.visitors / funnelDropoff[0].visitors) * 100).toFixed(1);
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-4">
                        {stage.dropoff > 0 && (
                          <span
                            className={`text-sm ${
                              stage.dropoff > 50 ? "text-red-400" : stage.dropoff > 20 ? "text-yellow-400" : "text-emerald-400"
                            }`}
                          >
                            {stage.dropoff}% drop-off
                          </span>
                        )}
                        <span className="text-sm font-semibold">{stage.visitors.toLocaleString()} visitors</span>
                      </div>
                    </div>
                    <div className="h-16 rounded-lg overflow-hidden relative bg-accent/30">
                      <div
                        className="h-full rounded-lg transition-all duration-500 flex items-center px-4"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, #c0c8d8 0%, #60a5fa ${percentage}%)`,
                        }}
                      >
                        <span className="text-sm font-semibold text-primary-foreground">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-400">
                <strong>Optimization Opportunity:</strong> 62% drop-off between form view and submission suggests
                form complexity issues. Consider A/B testing a shorter form.
              </p>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Multi-Touch Attribution Model</h3>
            <p className="text-muted-foreground mb-6">
              Understanding which touchpoints contribute most to conversions
            </p>

            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-accent/30">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">First Touch Attribution</h4>
                  <span className="text-2xl font-bold text-primary">42%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Initial awareness campaigns (ads, social) account for 42% of conversions
                </p>
              </div>

              <div className="p-6 rounded-lg bg-accent/30">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Middle Touch Attribution</h4>
                  <span className="text-2xl font-bold text-primary">31%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Nurture sequences (email, content) contribute 31% to final conversions
                </p>
              </div>

              <div className="p-6 rounded-lg bg-accent/30">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Last Touch Attribution</h4>
                  <span className="text-2xl font-bold text-primary">27%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Direct actions (retargeting, remarketing) close 27% of deals
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
