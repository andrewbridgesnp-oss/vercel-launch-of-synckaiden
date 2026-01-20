import { motion } from 'motion/react';
import { Calculator, FileText, TrendingUp, Shield, Globe, Briefcase, DollarSign, FileSearch } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  category: string;
  color: string;
}

interface QuickActionsProps {
  onActionSelect: (action: QuickAction) => void;
}

export function QuickActions({ onActionSelect }: QuickActionsProps) {
  const actions: QuickAction[] = [
    { id: 'tax-calc', label: 'Tax Calculator', icon: Calculator, category: 'Calculate', color: 'from-blue-500 to-blue-600' },
    { id: 'crypto-report', label: 'Crypto Report', icon: TrendingUp, category: 'Generate', color: 'from-purple-500 to-purple-600' },
    { id: 'compliance', label: 'Compliance Check', icon: Shield, category: 'Verify', color: 'from-emerald-500 to-emerald-600' },
    { id: 'international', label: 'International', icon: Globe, category: 'Review', color: 'from-cyan-500 to-cyan-600' },
    { id: 'business', label: 'Business Taxes', icon: Briefcase, category: 'Manage', color: 'from-orange-500 to-orange-600' },
    { id: 'deductions', label: 'Deductions', icon: DollarSign, category: 'Optimize', color: 'from-green-500 to-green-600' },
    { id: 'audit', label: 'Audit Support', icon: FileSearch, category: 'Assist', color: 'from-red-500 to-red-600' },
    { id: 'filing', label: 'File Return', icon: FileText, category: 'Submit', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl">
      {actions.map((action, index) => {
        const Icon = action.icon;
        
        return (
          <motion.button
            key={action.id}
            onClick={() => onActionSelect(action)}
            className="group relative p-4 rounded-xl backdrop-blur-sm overflow-hidden"
            style={{
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(168, 182, 216, 0.15)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(168, 182, 216, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Gradient Background on Hover */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />
            
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                  {action.category}
                </div>
                <div className="text-sm text-slate-200 font-medium">
                  {action.label}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
