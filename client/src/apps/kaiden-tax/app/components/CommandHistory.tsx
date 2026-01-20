import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, TrendingUp, Shield, BarChart3 } from 'lucide-react';

interface Command {
  id: string;
  type: 'query' | 'analysis' | 'calculation' | 'report';
  title: string;
  timestamp: string;
  status: 'completed' | 'processing';
  result?: string;
}

interface CommandHistoryProps {
  isOpen: boolean;
}

export function CommandHistory({ isOpen }: CommandHistoryProps) {
  const recentCommands: Command[] = [
    {
      id: '1',
      type: 'analysis',
      title: 'Q4 Tax Optimization Analysis',
      timestamp: '2 min ago',
      status: 'completed',
      result: '$47,329 potential savings identified'
    },
    {
      id: '2',
      type: 'calculation',
      title: 'Crypto Portfolio Tax Calculation',
      timestamp: '8 min ago',
      status: 'completed',
      result: 'Capital gains: $12,450'
    },
    {
      id: '3',
      type: 'report',
      title: 'International Holdings Report',
      timestamp: '15 min ago',
      status: 'completed',
      result: '7 jurisdictions, 23 accounts'
    },
    {
      id: '4',
      type: 'query',
      title: 'Estate Planning Strategy Review',
      timestamp: '1 hr ago',
      status: 'completed',
      result: '14 recommendations generated'
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'analysis': return TrendingUp;
      case 'calculation': return BarChart3;
      case 'report': return Shield;
      default: return Clock;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute left-8 top-24 w-96 backdrop-blur-xl rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(168, 182, 216, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-slate-200 font-medium tracking-wide">Recent Activity</h3>
            <p className="text-slate-500 text-sm mt-1">Executive command history</p>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {recentCommands.map((command, index) => {
              const Icon = getIcon(command.type);
              
              return (
                <motion.div
                  key={command.id}
                  className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-slate-200 text-sm font-medium truncate">
                          {command.title}
                        </h4>
                        <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      </div>
                      
                      {command.result && (
                        <p className="text-slate-400 text-xs mb-2">{command.result}</p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-500 text-xs">{command.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <button className="w-full py-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
              View All Activity →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
