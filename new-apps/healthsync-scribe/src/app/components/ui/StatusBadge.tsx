import { Check, X, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'complete' | 'incomplete' | 'pending' | 'warning';
  label: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const config = {
    complete: { 
      bg: 'bg-green-100', 
      border: 'border-green-300', 
      text: 'text-green-900',
      icon: <Check className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
    },
    incomplete: { 
      bg: 'bg-gray-100', 
      border: 'border-gray-300', 
      text: 'text-gray-700',
      icon: <X className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
    },
    pending: { 
      bg: 'bg-yellow-100', 
      border: 'border-yellow-300', 
      text: 'text-yellow-900',
      icon: <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
    },
    warning: { 
      bg: 'bg-orange-100', 
      border: 'border-orange-300', 
      text: 'text-orange-900',
      icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
    },
  };

  const { bg, border, text, icon } = config[status];
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`inline-flex items-center gap-1 ${padding} ${bg} border ${border} rounded-md`}>
      {icon}
      <span className={`${textSize} font-medium ${text}`}>{label}</span>
    </div>
  );
}
