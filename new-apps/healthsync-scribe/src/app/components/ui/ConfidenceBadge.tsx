interface ConfidenceBadgeProps {
  level: 'high' | 'medium' | 'low';
  percentage?: number;
}

export function ConfidenceBadge({ level, percentage }: ConfidenceBadgeProps) {
  const config = {
    high: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-900', label: 'High' },
    medium: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900', label: 'Medium' },
    low: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-900', label: 'Low' },
  };

  const { bg, border, text, label } = config[level];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 ${bg} border ${border} rounded-full`}>
      <div className={`w-1.5 h-1.5 rounded-full ${
        level === 'high' ? 'bg-green-600' :
        level === 'medium' ? 'bg-yellow-600' :
        'bg-orange-600'
      }`} />
      <span className={`text-xs font-medium ${text}`}>
        {percentage ? `${percentage}%` : label}
      </span>
    </div>
  );
}
