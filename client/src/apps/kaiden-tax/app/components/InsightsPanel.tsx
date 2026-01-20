import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  value?: string;
  change?: number;
}

interface InsightsPanelProps {
  isOpen: boolean;
}

export function InsightsPanel({ isOpen }: InsightsPanelProps) {
  const insights: Insight[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'Tax Savings Opportunity',
      description: 'Harvesting crypto losses could reduce liability by $12,450',
      value: '$12.4K',
      change: 18.5
    },
    {
      id: '2',
      type: 'success',
      title: 'Retirement Contributions',
      description: 'You\'re on track to maximize 401(k) contributions',
      value: '$23K',
      change: 100
    },
    {
      id: '3',
      type: 'warning',
      title: 'Estimated Tax Payment Due',
      description: 'Q1 estimated payment due in 14 days',
      value: '$8.2K'
    },
    {
      id: '4',
      type: 'info',
      title: 'International Reporting',
      description: 'FBAR filing recommended for foreign accounts',
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'opportunity': return TrendingUp;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getColors = (type: string) => {
    switch(type) {
      case 'opportunity':
        return {
          bg: 'from-emerald-500/20 to-emerald-600/10',
          border: 'border-emerald-500/30',
          icon: 'text-emerald-400',
          accent: 'bg-emerald-500'
        };
      case 'warning':
        return {
          bg: 'from-amber-500/20 to-amber-600/10',
          border: 'border-amber-500/30',
          icon: 'text-amber-400',
          accent: 'bg-amber-500'
        };
      case 'success':
        return {
          bg: 'from-blue-500/20 to-blue-600/10',
          border: 'border-blue-500/30',
          icon: 'text-blue-400',
          accent: 'bg-blue-500'
        };
      default:
        return {
          bg: 'from-slate-500/20 to-slate-600/10',
          border: 'border-slate-500/30',
          icon: 'text-slate-400',
          accent: 'bg-slate-500'
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute right-8 top-24 w-96 backdrop-blur-xl rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(168, 182, 216, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-slate-200 font-medium tracking-wide">AI Insights</h3>
            <p className="text-slate-500 text-sm mt-1">Strategic recommendations</p>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {insights.map((insight, index) => {
              const Icon = getIcon(insight.type);
              const colors = getColors(insight.type);
              
              return (
                <motion.div
                  key={insight.id}
                  className={`p-4 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} hover:scale-[1.02] transition-transform cursor-pointer`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${colors.accent} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${colors.icon}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-slate-200 text-sm font-medium">
                          {insight.title}
                        </h4>
                        {insight.value && (
                          <span className={`text-sm font-semibold ${colors.icon}`}>
                            {insight.value}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-slate-400 text-xs leading-relaxed mb-2">
                        {insight.description}
                      </p>
                      
                      {insight.change !== undefined && (
                        <div className="flex items-center gap-1">
                          {insight.change > 0 ? (
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                          )}
                          <span className={`text-xs ${insight.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {insight.change > 0 ? '+' : ''}{insight.change}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <button className="w-full py-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
              View All Insights →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
