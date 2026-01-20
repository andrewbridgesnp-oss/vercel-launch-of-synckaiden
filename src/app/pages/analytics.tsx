import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Phone,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
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
  ResponsiveContainer,
  Legend 
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 42000, calls: 342, bookings: 156 },
  { month: 'Feb', revenue: 48000, calls: 389, bookings: 178 },
  { month: 'Mar', revenue: 52000, calls: 421, bookings: 201 },
  { month: 'Apr', revenue: 58000, calls: 467, bookings: 223 },
  { month: 'May', revenue: 64000, calls: 512, bookings: 249 },
  { month: 'Jun', revenue: 71000, calls: 556, bookings: 278 },
];

const callTypeData = [
  { name: 'Bookings', value: 45, color: '#c9a88a' },
  { name: 'Inquiries', value: 30, color: '#d4b896' },
  { name: 'Cancellations', value: 10, color: '#b8c4b8' },
  { name: 'Complaints', value: 8, color: '#a68a6d' },
  { name: 'Other', value: 7, color: '#8a857a' },
];

const peakHoursData = [
  { hour: '9am', calls: 12 },
  { hour: '10am', calls: 24 },
  { hour: '11am', calls: 31 },
  { hour: '12pm', calls: 28 },
  { hour: '1pm', calls: 19 },
  { hour: '2pm', calls: 26 },
  { hour: '3pm', calls: 35 },
  { hour: '4pm', calls: 42 },
  { hour: '5pm', calls: 38 },
  { hour: '6pm', calls: 21 },
];

const upsellData = [
  { service: 'Hair Color', upsells: 42, revenue: 8400 },
  { service: 'Deep Conditioning', upsells: 38, revenue: 3800 },
  { service: 'Blowout', upsells: 56, revenue: 5600 },
  { service: 'Nail Art', upsells: 31, revenue: 3100 },
  { service: 'Facial Add-on', upsells: 28, revenue: 4200 },
];

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light mb-2">Analytics</h1>
          <p className="text-luxury-stone">Complete business intelligence powered by AI</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-luxury">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-accent-rose-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">$71,240</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              <span className="text-green-600">+18.2%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover-luxury">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="w-4 h-4 text-accent-rose-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">2,687</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              <span className="text-green-600">+12.5%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover-luxury">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookings Made</CardTitle>
            <Calendar className="w-4 h-4 text-accent-rose-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">1,285</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              <span className="text-green-600">+24.1%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover-luxury">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Call Time</CardTitle>
            <Clock className="w-4 h-4 text-accent-rose-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">2m 34s</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
              <span className="text-red-600">-8.3%</span>
              <span className="ml-1">more efficient</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="hover-luxury">
        <CardHeader>
          <CardTitle className="text-xl font-light">Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue, calls, and bookings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e0" />
              <XAxis dataKey="month" stroke="#8a857a" />
              <YAxis stroke="#8a857a" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e8e6e0',
                  borderRadius: '0.5rem'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#c9a88a" 
                strokeWidth={3}
                name="Revenue ($)"
              />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#d4b896" 
                strokeWidth={2}
                name="Total Calls"
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#b8c4b8" 
                strokeWidth={2}
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Call Distribution & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-luxury">
          <CardHeader>
            <CardTitle className="text-xl font-light">Call Type Distribution</CardTitle>
            <CardDescription>Breakdown of call purposes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={callTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {callTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover-luxury">
          <CardHeader>
            <CardTitle className="text-xl font-light">Peak Call Hours</CardTitle>
            <CardDescription>Busiest times for incoming calls</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e0" />
                <XAxis dataKey="hour" stroke="#8a857a" />
                <YAxis stroke="#8a857a" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e8e6e0',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Bar dataKey="calls" fill="#c9a88a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Upsell Performance */}
      <Card className="hover-luxury">
        <CardHeader>
          <CardTitle className="text-xl font-light">AI Upsell Performance</CardTitle>
          <CardDescription>Revenue generated by AI recommendation engine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upsellData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="font-medium">{item.service}</div>
                  <div className="text-sm text-muted-foreground">{item.upsells} successful upsells</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-light">${item.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">additional revenue</div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-6 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total AI-Generated Revenue</div>
                <div className="text-3xl font-light">$25,100</div>
              </div>
              <Target className="w-12 h-12 text-accent-rose-gold" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Avery's AI upselling generated an additional <strong>35.2%</strong> in revenue this month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-accent-rose-gold/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Target className="w-5 h-5" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-border">
            <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Peak Performance: 4-6 PM</div>
              <div className="text-sm text-muted-foreground">
                Your booking conversion rate is 23% higher during afternoon hours. 
                Consider offering limited-time promotions during this window.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-border">
            <Users className="w-5 h-5 text-accent-rose-gold mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">High-Value Client Pattern Detected</div>
              <div className="text-sm text-muted-foreground">
                Clients who book hair color services have a 68% chance of accepting a blowout upsell. 
                Avery now automatically suggests this combination.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-border">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium mb-1">Call Duration Optimization</div>
              <div className="text-sm text-muted-foreground">
                Average call time decreased by 18 seconds while maintaining 98% satisfaction. 
                Avery's efficiency improvements saved you 47 hours this month.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticsPage;
