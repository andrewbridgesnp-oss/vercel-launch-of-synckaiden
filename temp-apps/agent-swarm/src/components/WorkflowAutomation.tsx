import { useState } from 'react';
import { Play, Pause, Edit, Trash2, Plus, GitBranch, Zap, Clock, CheckCircle2 } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  triggers: string[];
  actions: number;
  executions: number;
  successRate: number;
  lastRun?: string;
  agents: string[];
}

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Customer Onboarding Flow',
      description: 'Automated customer onboarding with personalized welcome sequences',
      status: 'active',
      triggers: ['New customer signup', 'Trial activation'],
      actions: 8,
      executions: 1247,
      successRate: 98.5,
      lastRun: '5 min ago',
      agents: ['Agent Beta', 'Agent Delta']
    },
    {
      id: '2',
      name: 'Market Intelligence Report',
      description: 'Daily market analysis and competitive intelligence gathering',
      status: 'active',
      triggers: ['Daily at 6:00 AM', 'Market event detected'],
      actions: 12,
      executions: 456,
      successRate: 96.2,
      lastRun: '2 hours ago',
      agents: ['Agent Alpha', 'Agent Gamma']
    },
    {
      id: '3',
      name: 'Risk Alert System',
      description: 'Real-time risk monitoring and automated escalation protocols',
      status: 'active',
      triggers: ['Risk threshold exceeded', 'Anomaly detected'],
      actions: 6,
      executions: 89,
      successRate: 100,
      lastRun: '1 day ago',
      agents: ['Agent Zeta']
    },
    {
      id: '4',
      name: 'Revenue Optimization',
      description: 'Dynamic pricing and revenue optimization based on market conditions',
      status: 'paused',
      triggers: ['Price change requested', 'Market shift detected'],
      actions: 15,
      executions: 234,
      successRate: 94.8,
      lastRun: '3 days ago',
      agents: ['Agent Gamma', 'Agent Alpha']
    },
    {
      id: '5',
      name: 'Supply Chain Sync',
      description: 'Automated inventory management and supplier coordination',
      status: 'active',
      triggers: ['Inventory low', 'Demand spike detected'],
      actions: 10,
      executions: 678,
      successRate: 97.1,
      lastRun: '30 min ago',
      agents: ['Agent Theta', 'Agent Delta']
    },
    {
      id: '6',
      name: 'Innovation Pipeline',
      description: 'Continuous scanning for innovation opportunities and R&D insights',
      status: 'draft',
      triggers: ['Weekly scan', 'Patent filing detected'],
      actions: 7,
      executions: 0,
      successRate: 0,
      agents: ['Agent Eta']
    },
  ]);

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev => prev.map(workflow =>
      workflow.id === id
        ? {
            ...workflow,
            status: workflow.status === 'active' ? 'paused' : 'active' as any
          }
        : workflow
    ));
  };

  const workflowTemplates = [
    { name: 'Lead Scoring Automation', category: 'Sales', agents: 3 },
    { name: 'Customer Health Monitoring', category: 'Customer Success', agents: 2 },
    { name: 'Financial Reporting Suite', category: 'Finance', agents: 4 },
    { name: 'Product Launch Workflow', category: 'Product', agents: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white">Automation Workflows</h2>
          <p className="text-blue-300">Design and deploy no-code agentic workflows</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <GitBranch className="w-5 h-5" />, label: 'Total Workflows', value: '43', color: 'blue' },
          { icon: <Zap className="w-5 h-5" />, label: 'Active Workflows', value: '31', color: 'green' },
          { icon: <Clock className="w-5 h-5" />, label: 'Total Executions', value: '12.4K', color: 'purple' },
          { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Avg Success Rate', value: '97.8%', color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 text-${stat.color}-400 flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="text-blue-300 text-sm">{stat.label}</span>
            </div>
            <div className="text-white text-2xl">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Active Workflows */}
      <div className="space-y-4">
        <h3 className="text-white">Active Workflows</h3>
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6 hover:border-blue-600/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white">{workflow.name}</h3>
                  <WorkflowStatusBadge status={workflow.status} />
                </div>
                <p className="text-blue-300 text-sm">{workflow.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWorkflowStatus(workflow.id)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    workflow.status === 'active'
                      ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                      : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                  }`}
                >
                  {workflow.status === 'active' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-blue-400 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Workflow Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-slate-950/50 rounded-lg border border-blue-700/20">
                <div className="text-blue-400 text-xs mb-1">Executions</div>
                <div className="text-white">{workflow.executions.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-lg border border-blue-700/20">
                <div className="text-blue-400 text-xs mb-1">Success Rate</div>
                <div className="text-green-400">{workflow.successRate}%</div>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-lg border border-blue-700/20">
                <div className="text-blue-400 text-xs mb-1">Actions</div>
                <div className="text-white">{workflow.actions}</div>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-lg border border-blue-700/20">
                <div className="text-blue-400 text-xs mb-1">Last Run</div>
                <div className="text-white">{workflow.lastRun || 'Never'}</div>
              </div>
            </div>

            {/* Triggers */}
            <div className="mb-4">
              <div className="text-blue-400 text-xs mb-2">Triggers</div>
              <div className="flex flex-wrap gap-2">
                {workflow.triggers.map((trigger, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Zap className="w-3 h-3" />
                    {trigger}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Agents */}
            <div>
              <div className="text-blue-400 text-xs mb-2">Assigned Agents</div>
              <div className="flex flex-wrap gap-2">
                {workflow.agents.map((agent, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm"
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Templates */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <h3 className="text-white mb-4">Workflow Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowTemplates.map((template, i) => (
            <div
              key={i}
              className="p-4 bg-slate-950/50 rounded-lg border border-blue-700/20 hover:border-blue-600/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                  {template.category}
                </span>
              </div>
              <h4 className="text-white mb-2">{template.name}</h4>
              <div className="text-blue-400 text-sm">{template.agents} agents required</div>
              <button className="w-full mt-3 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkflowStatusBadge({ status }: { status: Workflow['status'] }) {
  const styles = {
    active: 'bg-green-500/20 text-green-400 border-green-500/50',
    paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    draft: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${styles[status]}`}>
      {status}
    </span>
  );
}
