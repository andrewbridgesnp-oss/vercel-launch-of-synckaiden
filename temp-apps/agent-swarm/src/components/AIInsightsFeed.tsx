import { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'recommendation' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
  timestamp: string;
  agent?: string;
  impact?: string;
}

export function AIInsightsFeed({ onClose }: { onClose: () => void }) {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: '1',
      type: 'opportunity',
      priority: 'high',
      title: 'Revenue Optimization Detected',
      description: 'Agent Gamma identified a 12% revenue increase opportunity through dynamic pricing adjustments in the EMEA region.',
      action: 'Review Strategy',
      timestamp: '2 min ago',
      agent: 'Agent Gamma',
      impact: '+$47K MRR'
    },
    {
      id: '2',
      type: 'warning',
      priority: 'high',
      title: 'Anomaly in Customer Churn',
      description: 'Agent Beta detected unusual churn patterns in enterprise accounts. 3 high-value customers showing early warning signals.',
      action: 'Investigate Now',
      timestamp: '8 min ago',
      agent: 'Agent Beta',
      impact: 'Risk: $125K ARR'
    },
    {
      id: '3',
      type: 'recommendation',
      priority: 'medium',
      title: 'Workflow Optimization Available',
      description: 'Combining Agent Delta and Agent Theta in supply chain workflow could reduce processing time by 34%.',
      action: 'Optimize Workflow',
      timestamp: '15 min ago',
      agent: 'System AI',
      impact: '8.5 hrs/week saved'
    },
    {
      id: '4',
      type: 'achievement',
      priority: 'low',
      title: 'Milestone Reached',
      description: 'Agent swarm completed 10,000 automated tasks this week with 98.7% success rate.',
      action: 'View Report',
      timestamp: '23 min ago',
      impact: '10K tasks'
    },
    {
      id: '5',
      type: 'opportunity',
      priority: 'medium',
      title: 'Market Entry Window Identified',
      description: 'Agent Alpha detected optimal conditions for APAC expansion. Competitor weakness and market demand align.',
      action: 'Review Analysis',
      timestamp: '1 hour ago',
      agent: 'Agent Alpha',
      impact: 'Market Cap: $2.3M'
    },
    {
      id: '6',
      type: 'recommendation',
      priority: 'high',
      title: 'Agent Deployment Suggestion',
      description: 'Deploy 2 additional agents to handle increased load during Q1 2026. Current utilization at 94%.',
      action: 'Deploy Agents',
      timestamp: '2 hours ago',
      agent: 'System AI',
      impact: '40% capacity increase'
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'opportunity' | 'warning' | 'recommendation'>('all');

  useEffect(() => {
    // Simulate real-time insights
    const interval = setInterval(() => {
      const newInsight: Insight = {
        id: Date.now().toString(),
        type: ['opportunity', 'warning', 'recommendation'][Math.floor(Math.random() * 3)] as any,
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
        title: 'New Insight Detected',
        description: 'AI agents continuously monitor and analyze business operations for optimization opportunities.',
        action: 'Review',
        timestamp: 'Just now',
        agent: `Agent ${['Alpha', 'Beta', 'Gamma', 'Delta'][Math.floor(Math.random() * 4)]}`,
      };
      setInsights(prev => [newInsight, ...prev].slice(0, 20));
    }, 45000); // New insight every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredInsights = filter === 'all' 
    ? insights 
    : insights.filter(i => i.type === filter);

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Target className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4" />;
      case 'achievement':
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return 'green';
      case 'warning':
        return 'red';
      case 'recommendation':
        return 'blue';
      case 'achievement':
        return 'purple';
    }
  };

  const getPriorityBadge = (priority: Insight['priority']) => {
    const styles = {
      high: 'bg-red-500/20 text-red-400 border-red-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs border ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-blue-800/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-white">AI Insights</h3>
            <p className="text-blue-400 text-xs">Real-time intelligence feed</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All', count: insights.length },
          { id: 'opportunity', label: 'Opportunities', count: insights.filter(i => i.type === 'opportunity').length },
          { id: 'warning', label: 'Warnings', count: insights.filter(i => i.type === 'warning').length },
          { id: 'recommendation', label: 'Recommendations', count: insights.filter(i => i.type === 'recommendation').length },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
              filter === f.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900/50 text-blue-300 hover:bg-slate-900 border border-blue-800/30'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-blue-800/30">
          <div className="text-blue-400 text-xs mb-1">Today's Insights</div>
          <div className="text-white text-xl">34</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-blue-800/30">
          <div className="text-blue-400 text-xs mb-1">Action Items</div>
          <div className="text-yellow-400 text-xl">7</div>
        </div>
      </div>

      {/* Insights Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {filteredInsights.map((insight) => {
          const color = getInsightColor(insight.type);
          return (
            <div
              key={insight.id}
              className="bg-slate-900/50 rounded-lg p-4 border border-blue-800/30 hover:border-blue-600/50 transition-all cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getPriorityBadge(insight.priority)}
                    <span className="text-blue-400 text-xs">{insight.timestamp}</span>
                  </div>
                  <h4 className="text-white text-sm mb-1">{insight.title}</h4>
                  <p className="text-blue-300 text-xs leading-relaxed">{insight.description}</p>
                </div>
              </div>

              {/* Meta Info */}
              {(insight.agent || insight.impact) && (
                <div className="flex items-center gap-3 mb-3 text-xs">
                  {insight.agent && (
                    <span className="text-blue-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {insight.agent}
                    </span>
                  )}
                  {insight.impact && (
                    <span className="text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {insight.impact}
                    </span>
                  )}
                </div>
              )}

              {/* Action Button */}
              {insight.action && (
                <button className={`w-full px-3 py-2 bg-${color}-600/20 hover:bg-${color}-600/30 text-${color}-400 rounded-lg text-xs transition-all flex items-center justify-center gap-2 group-hover:bg-${color}-600/30`}>
                  {insight.action}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-blue-800/30">
        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm transition-all flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          View All Insights
        </button>
      </div>
    </div>
  );
}
