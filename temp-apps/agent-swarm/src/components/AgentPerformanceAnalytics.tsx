import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Award, Clock, Zap, Target, Activity, BarChart3 } from 'lucide-react';

export function AgentPerformanceAnalytics() {
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');

  const agents = [
    { id: 'all', name: 'All Agents' },
    { id: 'alpha', name: 'Agent Alpha' },
    { id: 'beta', name: 'Agent Beta' },
    { id: 'gamma', name: 'Agent Gamma' },
    { id: 'delta', name: 'Agent Delta' },
    { id: 'epsilon', name: 'Agent Epsilon' },
    { id: 'zeta', name: 'Agent Zeta' },
  ];

  const performanceData = [
    { date: 'Dec 21', alpha: 92, beta: 85, gamma: 88, delta: 95, epsilon: 78, zeta: 91 },
    { date: 'Dec 22', alpha: 94, beta: 87, gamma: 90, delta: 96, epsilon: 82, zeta: 89 },
    { date: 'Dec 23', alpha: 91, beta: 89, gamma: 92, delta: 94, epsilon: 85, zeta: 93 },
    { date: 'Dec 24', alpha: 93, beta: 91, gamma: 89, delta: 97, epsilon: 87, zeta: 90 },
    { date: 'Dec 25', alpha: 95, beta: 88, gamma: 91, delta: 95, epsilon: 89, zeta: 92 },
    { date: 'Dec 26', alpha: 94, beta: 92, gamma: 93, delta: 98, epsilon: 91, zeta: 94 },
    { date: 'Dec 27', alpha: 96, beta: 90, gamma: 94, delta: 97, epsilon: 93, zeta: 95 },
  ];

  const taskCompletionData = [
    { hour: '00:00', completed: 12, failed: 1 },
    { hour: '04:00', completed: 18, failed: 0 },
    { hour: '08:00', completed: 45, failed: 2 },
    { hour: '12:00', completed: 67, failed: 3 },
    { hour: '16:00', completed: 52, failed: 1 },
    { hour: '20:00', completed: 38, failed: 2 },
  ];

  const capabilityData = [
    { capability: 'Data Analysis', score: 95 },
    { capability: 'Decision Making', score: 88 },
    { capability: 'Prediction', score: 92 },
    { capability: 'Optimization', score: 90 },
    { capability: 'Learning', score: 87 },
    { capability: 'Adaptation', score: 93 },
  ];

  const agentComparison = [
    { agent: 'Alpha', efficiency: 94, speed: 92, accuracy: 96, reliability: 95 },
    { agent: 'Beta', efficiency: 87, speed: 89, accuracy: 91, reliability: 88 },
    { agent: 'Gamma', efficiency: 91, speed: 93, accuracy: 90, reliability: 92 },
    { agent: 'Delta', efficiency: 96, speed: 95, accuracy: 98, reliability: 97 },
    { agent: 'Epsilon', efficiency: 85, speed: 84, accuracy: 87, reliability: 86 },
    { agent: 'Zeta', efficiency: 89, speed: 91, accuracy: 92, reliability: 90 },
  ];

  const metrics = [
    {
      label: 'Avg Response Time',
      value: '1.2s',
      change: -0.3,
      trend: 'down',
      icon: Clock,
      color: 'green'
    },
    {
      label: 'Tasks/Hour',
      value: '847',
      change: 12.5,
      trend: 'up',
      icon: Zap,
      color: 'blue'
    },
    {
      label: 'Success Rate',
      value: '98.2%',
      change: 1.8,
      trend: 'up',
      icon: Target,
      color: 'green'
    },
    {
      label: 'Learning Rate',
      value: '94%',
      change: 3.2,
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    },
  ];

  const topPerformers = [
    { agent: 'Agent Delta', score: 97, improvement: 4.2, tasks: 1247 },
    { agent: 'Agent Alpha', score: 94, improvement: 2.8, tasks: 1189 },
    { agent: 'Agent Zeta', score: 92, improvement: 5.1, tasks: 1034 },
  ];

  const recentAchievements = [
    { agent: 'Agent Delta', achievement: 'Perfect Week', description: '100% task success rate for 7 days', time: '2 hours ago', icon: Award },
    { agent: 'Agent Alpha', achievement: 'Speed Demon', description: 'Completed 1000 tasks in 24 hours', time: '1 day ago', icon: Zap },
    { agent: 'Agent Gamma', achievement: 'Accuracy Master', description: '99.8% prediction accuracy this month', time: '2 days ago', icon: Target },
    { agent: 'Agent Beta', achievement: 'Learning Curve', description: 'Improved efficiency by 15% this week', time: '3 days ago', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white">Agent Performance Analytics</h2>
          <p className="text-blue-300">Deep insights into agent capabilities and efficiency</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-blue-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-blue-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${metric.color}-500/20 flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
              </div>
              <span className="text-blue-300 text-sm">{metric.label}</span>
            </div>
            <div className="text-white text-3xl mb-2">{metric.value}</div>
            <div className={`flex items-center gap-1 text-sm ${
              metric.trend === 'up' ? 'text-green-400' : 'text-green-400'
            }`}>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(metric.change)}% {metric.trend === 'up' ? 'increase' : 'faster'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Trends */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <h3 className="text-white mb-4">Performance Trends - Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDelta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.1} />
            <XAxis dataKey="date" stroke="#60a5fa" />
            <YAxis stroke="#60a5fa" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e40af',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="delta" stroke="#10b981" fillOpacity={1} fill="url(#colorDelta)" name="Agent Delta" />
            <Area type="monotone" dataKey="alpha" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAlpha)" name="Agent Alpha" />
            <Area type="monotone" dataKey="gamma" stroke="#8b5cf6" fillOpacity={0.6} fill="#8b5cf6" name="Agent Gamma" />
            <Area type="monotone" dataKey="zeta" stroke="#f59e0b" fillOpacity={0.4} fill="#f59e0b" name="Agent Zeta" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Task Completion & Agent Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Timeline */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
          <h3 className="text-white mb-4">Task Completion Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.1} />
              <XAxis dataKey="hour" stroke="#60a5fa" />
              <YAxis stroke="#60a5fa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e40af',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Comparison Radar */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
          <h3 className="text-white mb-4">Multi-dimensional Agent Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={capabilityData}>
              <PolarGrid stroke="#1e40af" />
              <PolarAngleAxis dataKey="capability" stroke="#60a5fa" />
              <PolarRadiusAxis stroke="#60a5fa" />
              <Radar name="Capability Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e40af',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {topPerformers.map((performer, i) => (
              <div key={i} className="p-4 bg-slate-950/50 rounded-lg border border-blue-700/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white">#{i + 1}</span>
                    </div>
                    <div>
                      <div className="text-white">{performer.agent}</div>
                      <div className="text-blue-400 text-xs">{performer.tasks} tasks completed</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-xl">{performer.score}%</div>
                    <div className="text-green-400 text-xs">+{performer.improvement}%</div>
                  </div>
                </div>
                <div className="h-2 bg-slate-950/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{ width: `${performer.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
          <h3 className="text-white mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement, i) => (
              <div key={i} className="p-4 bg-slate-950/50 rounded-lg border border-blue-700/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-white">{achievement.achievement}</div>
                      <div className="text-blue-400 text-xs">{achievement.time}</div>
                    </div>
                    <div className="text-blue-300 text-sm mb-1">{achievement.description}</div>
                    <div className="text-blue-400 text-xs">{achievement.agent}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Agent Comparison Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <h3 className="text-white mb-4">Detailed Agent Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-800/30">
                <th className="text-left text-blue-300 p-3">Agent</th>
                <th className="text-left text-blue-300 p-3">Efficiency</th>
                <th className="text-left text-blue-300 p-3">Speed</th>
                <th className="text-left text-blue-300 p-3">Accuracy</th>
                <th className="text-left text-blue-300 p-3">Reliability</th>
                <th className="text-left text-blue-300 p-3">Overall</th>
              </tr>
            </thead>
            <tbody>
              {agentComparison.map((agent, i) => {
                const overall = ((agent.efficiency + agent.speed + agent.accuracy + agent.reliability) / 4).toFixed(1);
                return (
                  <tr key={i} className="border-b border-blue-800/10 hover:bg-blue-500/5 transition-colors">
                    <td className="text-white p-3">{agent.agent}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-950/50 rounded-full overflow-hidden max-w-[100px]">
                          <div className="h-full bg-blue-500" style={{ width: `${agent.efficiency}%` }} />
                        </div>
                        <span className="text-blue-400 text-sm">{agent.efficiency}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-950/50 rounded-full overflow-hidden max-w-[100px]">
                          <div className="h-full bg-purple-500" style={{ width: `${agent.speed}%` }} />
                        </div>
                        <span className="text-purple-400 text-sm">{agent.speed}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-950/50 rounded-full overflow-hidden max-w-[100px]">
                          <div className="h-full bg-green-500" style={{ width: `${agent.accuracy}%` }} />
                        </div>
                        <span className="text-green-400 text-sm">{agent.accuracy}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-950/50 rounded-full overflow-hidden max-w-[100px]">
                          <div className="h-full bg-yellow-500" style={{ width: `${agent.reliability}%` }} />
                        </div>
                        <span className="text-yellow-400 text-sm">{agent.reliability}%</span>
                      </div>
                    </td>
                    <td className="text-white p-3">{overall}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
