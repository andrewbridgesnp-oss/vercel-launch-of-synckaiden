import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: number;
  color: string;
  delay?: number;
}

export function MetricsCard({ icon: Icon, label, value, change, color, delay = 0 }: MetricsCardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <motion.div
      className="p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-transform cursor-pointer"
      style={{
        background: 'rgba(15, 23, 42, 0.5)',
        borderColor: 'rgba(168, 182, 216, 0.2)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{
        borderColor: 'rgba(168, 182, 216, 0.4)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        {change !== undefined && (
          <div className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            isPositive 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? '+' : ''}{change}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl text-slate-100 font-semibold">
          {value}
        </div>
        <div className="text-sm text-slate-400">
          {label}
        </div>
      </div>
    </motion.div>
  );
}
