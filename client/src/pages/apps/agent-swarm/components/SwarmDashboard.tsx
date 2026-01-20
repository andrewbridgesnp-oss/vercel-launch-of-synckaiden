import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing';
  task: string;
  efficiency: number;
  x: number;
  y: number;
}

export function SwarmDashboard() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Agent Alpha', status: 'active', task: 'Market Analysis', efficiency: 94, x: 20, y: 30 },
    { id: '2', name: 'Agent Beta', status: 'processing', task: 'Customer Insights', efficiency: 87, x: 60, y: 20 },
    { id: '3', name: 'Agent Gamma', status: 'active', task: 'Financial Forecasting', efficiency: 91, x: 40, y: 60 },
    { id: '4', name: 'Agent Delta', status: 'active', task: 'Operations Optimization', efficiency: 96, x: 75, y: 50 },
    { id: '5', name: 'Agent Epsilon', status: 'idle', task: 'Standby', efficiency: 100, x: 50, y: 40 },
    { id: '6', name: 'Agent Zeta', status: 'processing', task: 'Risk Assessment', efficiency: 89, x: 30, y: 70 },
  ]);

  const [stats] = useState({
    totalAgents: 24,
    activeAgents: 18,
    tasksCompleted: 1847,
    efficiency: 92,
    predictions: 156,
    automations: 43
  });

  // Animate agents slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        x: agent.x + (Math.random() - 0.5) * 2,
        y: agent.y + (Math.random() - 0.5) * 2,
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Total Agents"
          value={stats.totalAgents}
          change="+3 today"
          trend="up"
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="Active Agents"
          value={stats.activeAgents}
          change="75% utilization"
          trend="up"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Tasks Completed"
          value={stats.tasksCompleted}
          change="+127 today"
          trend="up"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Swarm Efficiency"
          value={`${stats.efficiency}%`}
          change="+4% vs last week"
          trend="up"
        />
      </div>

      {/* Swarm Visualization */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-800/30 p-6">
        <h2 className="text-white mb-4">Agent Swarm Visualization</h2>
        <div className="relative h-96 bg-slate-950/50 rounded-xl border border-blue-700/30 overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-blue-500/20" />
              ))}
            </div>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {agents.map((agent, i) => 
              agents.slice(i + 1).map((otherAgent, j) => (
                <line
                  key={`${i}-${j}`}
                  x1={`${agent.x}%`}
                  y1={`${agent.y}%`}
                  x2={`${otherAgent.x}%`}
                  y2={`${otherAgent.y}%`}
                  stroke="rgba(59, 130, 246, 0.1)"
                  strokeWidth="1"
                />
              ))
            )}
          </svg>

          {/* Agents */}
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="absolute transition-all duration-2000 ease-in-out"
              style={{
                left: `${agent.x}%`,
                top: `${agent.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className={`relative group cursor-pointer`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  agent.status === 'active' 
                    ? 'bg-blue-500 animate-pulse' 
                    : agent.status === 'processing'
                    ? 'bg-purple-500 animate-bounce'
                    : 'bg-slate-600'
                }`}>
                  <div className="w-6 h-6 bg-white rounded-full" />
                </div>
                
                {/* Pulse ring for active agents */}
                {agent.status === 'active' && (
                  <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-slate-950 border border-blue-500/50 rounded-lg px-3 py-2 whitespace-nowrap">
                    <div className="text-white text-sm">{agent.name}</div>
                    <div className="text-blue-300 text-xs">{agent.task}</div>
                    <div className="text-green-400 text-xs">{agent.efficiency}% efficient</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-800/30 p-6">
          <h3 className="text-white mb-4">Recent Agent Tasks</h3>
          <div className="space-y-3">
            {[
              { agent: 'Agent Alpha', task: 'Completed market trend analysis', time: '2 min ago', status: 'success' },
              { agent: 'Agent Delta', task: 'Optimized supply chain routes', time: '5 min ago', status: 'success' },
              { agent: 'Agent Beta', task: 'Processing customer sentiment data', time: '8 min ago', status: 'processing' },
              { agent: 'Agent Gamma', task: 'Generated Q1 forecast report', time: '12 min ago', status: 'success' },
              { agent: 'Agent Zeta', task: 'Analyzing risk factors', time: '15 min ago', status: 'processing' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-blue-700/20">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-blue-100 text-sm">{activity.task}</div>
                  <div className="text-blue-400 text-xs mt-1">{activity.agent} • {activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-800/30 p-6">
          <h3 className="text-white mb-4">Swarm Performance Metrics</h3>
          <div className="space-y-4">
            {[
              { label: 'Task Completion Rate', value: 97, color: 'bg-green-500' },
              { label: 'Resource Utilization', value: 85, color: 'bg-blue-500' },
              { label: 'Prediction Accuracy', value: 94, color: 'bg-purple-500' },
              { label: 'Automation Coverage', value: 78, color: 'bg-yellow-500' },
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm">{metric.label}</span>
                  <span className="text-white">{metric.value}%</span>
                </div>
                <div className="h-2 bg-slate-950/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${metric.color} transition-all duration-1000`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, trend }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
}) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-800/30 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-blue-300">{label}</span>
      </div>
      <div className="text-white text-3xl mt-2">{value}</div>
      <div className={`text-sm mt-1 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </div>
    </div>
  );
}
