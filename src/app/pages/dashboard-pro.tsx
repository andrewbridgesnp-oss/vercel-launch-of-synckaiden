import { useState, useEffect } from "react"
import {
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Users,
  MessageSquare,
  Video,
  Zap,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Mic,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Switch } from "../components/ui/switch"
import { Progress } from "../components/ui/progress"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DashboardProProps {
  onNavigate: (page: string) => void
}

const todayData = [
  { time: "00:00", calls: 2, bookings: 1, revenue: 120 },
  { time: "03:00", calls: 1, bookings: 0, revenue: 0 },
  { time: "06:00", calls: 3, bookings: 2, revenue: 340 },
  { time: "09:00", calls: 12, bookings: 7, revenue: 1240 },
  { time: "12:00", calls: 18, bookings: 11, revenue: 1890 },
  { time: "15:00", calls: 24, bookings: 15, revenue: 2450 },
  { time: "18:00", calls: 31, bookings: 19, revenue: 3120 },
  { time: "21:00", calls: 34, bookings: 21, revenue: 3420 },
]

export function DashboardPro({ onNavigate }: DashboardProProps) {
  const [isLive, setIsLive] = useState(true)
  const [liveStats, setLiveStats] = useState({
    callsToday: 147,
    bookingsToday: 52,
    revenueToday: 12450,
    activeCalls: 2,
  })

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        callsToday: prev.callsToday + Math.floor(Math.random() * 2),
        bookingsToday: prev.bookingsToday + (Math.random() > 0.7 ? 1 : 0),
        revenueToday: prev.revenueToday + (Math.random() > 0.6 ? Math.floor(Math.random() * 200) : 0),
        activeCalls: Math.floor(Math.random() * 4),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive])

  const recentCalls = [
    {
      id: 1,
      caller: "Sarah Martinez",
      phone: "+1 (555) 123-4567",
      type: "booking",
      outcome: "Hair Color + Blowout",
      revenue: 280,
      duration: "3m 24s",
      sentiment: "positive",
      time: "2m ago",
      status: "completed",
    },
    {
      id: 2,
      caller: "Jessica Chen",
      phone: "+1 (555) 234-5678",
      type: "inquiry",
      outcome: "Pricing Information",
      revenue: 0,
      duration: "1m 45s",
      sentiment: "neutral",
      time: "8m ago",
      status: "completed",
    },
    {
      id: 3,
      caller: "Unknown Caller",
      phone: "+1 (555) 345-6789",
      type: "ongoing",
      outcome: "Booking in Progress...",
      revenue: 0,
      duration: "0m 42s",
      sentiment: "positive",
      time: "now",
      status: "active",
    },
  ]

  const aiInsights = [
    {
      type: "success",
      icon: TrendingUp,
      title: "Revenue Surge Detected",
      message: "Today's revenue is up 32% compared to last Friday. Avery successfully upsold 8 clients.",
      time: "15m ago",
    },
    {
      type: "warning",
      icon: AlertCircle,
      title: "Peak Hour Starting",
      message: "4-6 PM rush beginning. Avery is ready to handle increased call volume.",
      time: "22m ago",
    },
    {
      type: "info",
      icon: Users,
      title: "Repeat Client Pattern",
      message: "Sarah Martinez booked her 5th appointment this month. Consider loyalty program.",
      time: "1h ago",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with Live Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-light mb-2">Dashboard</h1>
          <p className="text-luxury-stone">Real-time business intelligence</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg">
            <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-sm font-medium">{isLive ? "Live" : "Paused"}</span>
            <Switch checked={isLive} onCheckedChange={setIsLive} />
          </div>

          <Button onClick={() => onNavigate("analytics")}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Full Analytics
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-luxury border-l-4 border-l-accent-rose-gold">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Calls Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-light">{liveStats.callsToday}</div>
              {isLive && (
                <div className="text-xs text-green-600 flex items-center">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  Live
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
              <span className="text-muted-foreground">vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-luxury border-l-4 border-l-blue-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookings Made</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-light">{liveStats.bookingsToday}</div>
              {liveStats.activeCalls > 0 && (
                <div className="text-xs text-blue-600 flex items-center">
                  <Phone className="w-3 h-3 mr-1 animate-pulse" />
                  {liveStats.activeCalls} active
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Progress value={68} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground">68% rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-luxury border-l-4 border-l-green-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-light">${liveStats.revenueToday.toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18%
              </Badge>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-luxury border-l-4 border-l-purple-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-light">4.9</div>
              <div className="text-lg text-muted-foreground">/5.0</div>
            </div>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full ${i < 5 ? "bg-accent-rose-gold" : "bg-gray-200"}`} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Activity Chart */}
      <Card className="hover-luxury">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-light">Today's Activity</CardTitle>
              <CardDescription>Real-time call volume, bookings, and revenue</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Calls
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Bookings
              </Button>
              <Button variant="outline" size="sm">
                <DollarSign className="w-4 h-4 mr-2" />
                Revenue
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={todayData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a88a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a88a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b8c4b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#b8c4b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e0" />
              <XAxis dataKey="time" stroke="#8a857a" />
              <YAxis stroke="#8a857a" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e8e6e0",
                  borderRadius: "0.5rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#c9a88a"
                fillOpacity={1}
                fill="url(#colorCalls)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#b8c4b8"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Calls & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <Card className="hover-luxury">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-light">Recent Calls</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("calls")}>
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                className={`p-4 border rounded-lg transition-all cursor-pointer hover:border-accent-rose-gold ${
                  call.status === "active" ? "border-blue-400 bg-blue-50/50" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {call.caller}
                      {call.status === "active" && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Activity className="w-3 h-3 mr-1 animate-pulse" />
                          Live
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{call.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{call.duration}</div>
                    <div className="text-xs text-muted-foreground">{call.time}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {call.type === "booking" && <Calendar className="w-4 h-4 text-green-600" />}
                    {call.type === "inquiry" && <MessageSquare className="w-4 h-4 text-blue-600" />}
                    {call.type === "ongoing" && <Phone className="w-4 h-4 text-blue-600 animate-pulse" />}
                    <span className="text-sm">{call.outcome}</span>
                  </div>
                  {call.revenue > 0 && <div className="text-sm font-medium text-green-600">+${call.revenue}</div>}
                </div>

                {call.sentiment && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">Sentiment:</div>
                    {call.sentiment === "positive" && (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Positive
                      </Badge>
                    )}
                    {call.sentiment === "neutral" && (
                      <Badge variant="secondary" className="text-xs">
                        Neutral
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="hover-luxury border-accent-rose-gold/30 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-rose-gold" />
              <CardTitle className="text-xl font-light">AI Insights</CardTitle>
            </div>
            <CardDescription>Real-time intelligence from your calls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-border hover:border-accent-rose-gold transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        insight.type === "success"
                          ? "bg-green-100"
                          : insight.type === "warning"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          insight.type === "success"
                            ? "text-green-600"
                            : insight.type === "warning"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{insight.title}</div>
                      <div className="text-sm text-muted-foreground mb-2">{insight.message}</div>
                      <div className="text-xs text-muted-foreground">{insight.time}</div>
                    </div>
                  </div>
                </div>
              )
            })}

            <Button variant="outline" className="w-full bg-transparent">
              View All Insights
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 bg-transparent"
          onClick={() => onNavigate("voice-cloning")}
        >
          <Mic className="w-6 h-6" />
          <span>Voice Clone</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 bg-transparent"
          onClick={() => onNavigate("visual-ai")}
        >
          <Video className="w-6 h-6" />
          <span>Avatar Studio</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 bg-transparent"
          onClick={() => onNavigate("integrations")}
        >
          <Zap className="w-6 h-6" />
          <span>Integrations</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2 bg-transparent"
          onClick={() => onNavigate("analytics")}
        >
          <TrendingUp className="w-6 h-6" />
          <span>Analytics</span>
        </Button>
      </div>
    </div>
  )
}

export default DashboardPro
