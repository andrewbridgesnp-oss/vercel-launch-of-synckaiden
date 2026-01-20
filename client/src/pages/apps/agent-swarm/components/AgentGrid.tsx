import { useState } from 'react';
import { Play, Pause, RotateCcw, Trash2, Plus, Settings } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'processing' | 'offline';
  tasksCompleted: number;
  efficiency: number;
  currentTask?: string;
  capabilities: string[];
}

export function AgentGrid() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Agent Alpha',
      type: 'Market Intelligence',
      status: 'active',
      tasksCompleted: 234,
      efficiency: 94,
      currentTask: 'Analyzing competitor pricing strategies',
      capabilities: ['Data Analysis', 'Market Research', 'Trend Forecasting']
    },
    {
      id: '2',
      name: 'Agent Beta',
      type: 'Customer Intelligence',
      status: 'processing',
      tasksCompleted: 189,
      efficiency: 87,
      currentTask: 'Processing customer sentiment analysis',
      capabilities: ['NLP', 'Sentiment Analysis', 'Behavior Prediction']
    },
    {
      id: '3',
      name: 'Agent Gamma',
      type: 'Financial Intelligence',
      status: 'active',
      tasksCompleted: 312,
      efficiency: 91,
      currentTask: 'Generating revenue forecasts',
      capabilities: ['Financial Modeling', 'Risk Analysis', 'Forecasting']
    },
    {
      id: '4',
      name: 'Agent Delta',
      type: 'Operations Intelligence',
      status: 'active',
      tasksCompleted: 267,
      efficiency: 96,
      currentTask: 'Optimizing resource allocation',
      capabilities: ['Process Optimization', 'Resource Management', 'Logistics']
    },
    {
      id: '5',
      name: 'Agent Epsilon',
      type: 'Strategic Intelligence',
      status: 'idle',
      tasksCompleted: 145,
      efficiency: 100,
      capabilities: ['Strategic Planning', 'Decision Support', 'Scenario Analysis']
    },
    {
      id: '6',
      name: 'Agent Zeta',
      type: 'Risk Intelligence',
      status: 'processing',
      tasksCompleted: 198,
      efficiency: 89,
      currentTask: 'Evaluating operational risks',
      capabilities: ['Risk Assessment', 'Compliance', 'Threat Detection']
    },
    {
      id: '7',
      name: 'Agent Eta',
      type: 'Innovation Intelligence',
      status: 'active',
      tasksCompleted: 156,
      efficiency: 92,
      currentTask: 'Identifying innovation opportunities',
      capabilities: ['Opportunity Detection', 'Innovation Analysis', 'R&D Insights']
    },
    {
      id: '8',
      name: 'Agent Theta',
      type: 'Supply Chain Intelligence',
      status: 'idle',
      tasksCompleted: 223,
      efficiency: 88,
      capabilities: ['Supply Chain Analysis', 'Vendor Management', 'Inventory Optimization']
    },
  ]);

  const toggleAgentStatus = (id: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === 'active' ? 'idle' : 'active' as any }
        : agent
    ));
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white">Agent Management</h2>
          <p className="text-blue-300">Deploy and manage your autonomous agent fleet</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Deploy New Agent
        </button>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-5 hover:border-blue-600/50 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white">{agent.name}</h3>
                  <StatusBadge status={agent.status} />
                </div>
                <p className="text-blue-300 text-sm">{agent.type}</p>
              </div>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-300 text-sm">Tasks Completed</span>
                <span className="text-white">{agent.tasksCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-300 text-sm">Efficiency</span>
                <span className="text-green-400">{agent.efficiency}%</span>
              </div>
            </div>

            {/* Current Task */}
            {agent.currentTask && (
              <div className="mb-4 p-3 bg-slate-950/50 rounded-lg border border-blue-700/20">
                <div className="text-blue-400 text-xs mb-1">Current Task</div>
                <div className="text-blue-100 text-sm">{agent.currentTask}</div>
              </div>
            )}

            {/* Capabilities */}
            <div className="mb-4">
              <div className="text-blue-400 text-xs mb-2">Capabilities</div>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAgentStatus(agent.id)}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  agent.status === 'active'
                    ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                    : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                }`}
              >
                {agent.status === 'active' ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span className="text-sm">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span className="text-sm">Activate</span>
                  </>
                )}
              </button>
              <button className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-blue-400 rounded-lg transition-colors">
                <RotateCcw className="w-3 h-3" />
              </button>
              <button className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Agent['status'] }) {
  const styles = {
    active: 'bg-green-500/20 text-green-400 border-green-500/50',
    idle: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
    processing: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    offline: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${styles[status]}`}>
      {status}
    </span>
  );
}
