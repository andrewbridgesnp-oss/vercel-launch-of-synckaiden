import { TrendingUp, Users, Play, Heart, Globe, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function AnalyticsDashboard() {
  const streamData = [
    { date: 'Jan 1', streams: 1200 },
    { date: 'Jan 2', streams: 1800 },
    { date: 'Jan 3', streams: 1400 },
    { date: 'Jan 4', streams: 2200 },
    { date: 'Jan 5', streams: 2800 },
    { date: 'Jan 6', streams: 3200 },
    { date: 'Jan 7', streams: 2900 },
  ];

  const platformData = [
    { name: 'Spotify', value: 4500, color: '#1DB954' },
    { name: 'Apple Music', value: 3200, color: '#FA243C' },
    { name: 'SoundCloud', value: 2100, color: '#FF5500' },
    { name: 'YouTube', value: 1800, color: '#FF0000' },
  ];

  const geographyData = [
    { country: 'USA', listeners: 3200 },
    { country: 'UK', listeners: 2100 },
    { country: 'Canada', listeners: 1500 },
    { country: 'Australia', listeners: 1200 },
    { country: 'Germany', listeners: 980 },
  ];

  const stats = [
    { label: 'Total Streams', value: '11.6K', change: '+23%', icon: Play, color: '#00FFAA' },
    { label: 'Total Listeners', value: '8.9K', change: '+15%', icon: Users, color: '#4ECDC4' },
    { label: 'Total Likes', value: '2.4K', change: '+31%', icon: Heart, color: '#FF6B6B' },
    { label: 'Total Downloads', value: '1.2K', change: '+8%', icon: Download, color: '#FFE66D' },
  ];

  return (
    <div className="h-full bg-[#1A1A1A] p-4 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#00FFAA]">Analytics Dashboard</h2>
          <p className="text-gray-400 mt-1">Track your music's performance across platforms</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#252525] rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                <span className={`text-xs font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Streams Over Time */}
          <div className="bg-[#252525] rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#00FFAA]" />
              <h3 className="font-semibold text-white">Streams Over Time</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={streamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" tick={{ fill: '#999' }} />
                <YAxis stroke="#666" tick={{ fill: '#999' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="streams"
                  stroke="#00FFAA"
                  strokeWidth={2}
                  dot={{ fill: '#00FFAA', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Distribution */}
          <div className="bg-[#252525] rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[#00FFAA]" />
              <h3 className="font-semibold text-white">Platform Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geography and Top Tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Countries */}
          <div className="bg-[#252525] rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-[#00FFAA]" />
              <h3 className="font-semibold text-white">Top Countries</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={geographyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="country" stroke="#666" tick={{ fill: '#999' }} />
                <YAxis stroke="#666" tick={{ fill: '#999' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="listeners" fill="#00FFAA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#252525] rounded-lg p-6 border border-gray-700">
            <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { track: 'Summer Vibes', plays: 1234, time: '2 hours ago', trend: 'up' },
                { track: 'Midnight Dreams', plays: 987, time: '5 hours ago', trend: 'up' },
                { track: 'Acoustic Sessions', plays: 756, time: '1 day ago', trend: 'down' },
                { track: 'Hip-Hop Beat', plays: 654, time: '2 days ago', trend: 'up' },
                { track: 'Rock Anthem', plays: 543, time: '3 days ago', trend: 'up' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{item.track}</div>
                    <div className="text-xs text-gray-400">{item.time}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#00FFAA]">{item.plays}</div>
                      <div className="text-xs text-gray-400">plays</div>
                    </div>
                    <div className={`text-xs ${
                      item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.trend === 'up' ? '↑' : '↓'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Section (Mock) */}
        <div className="mt-6 bg-[#252525] rounded-lg p-6 border border-gray-700">
          <h3 className="font-semibold text-white mb-4">Revenue Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#1A1A1A] rounded-lg">
              <div className="text-xs text-gray-400 mb-1">This Month</div>
              <div className="text-2xl font-bold text-[#00FFAA]">$1,234</div>
              <div className="text-xs text-green-400 mt-1">+18% from last month</div>
            </div>
            <div className="p-4 bg-[#1A1A1A] rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Total Earnings</div>
              <div className="text-2xl font-bold text-white">$8,456</div>
              <div className="text-xs text-gray-400 mt-1">All time</div>
            </div>
            <div className="p-4 bg-[#1A1A1A] rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Avg. Per Stream</div>
              <div className="text-2xl font-bold text-white">$0.004</div>
              <div className="text-xs text-gray-400 mt-1">Industry standard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
