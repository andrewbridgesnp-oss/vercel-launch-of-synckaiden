import React from 'react';

interface UsageMeterProps {
  current: number;
  limit: number;
  label?: string;
  unit?: string;
  resetDate?: string;
  showPercentage?: boolean;
  colorThreshold?: {
    warning: number; // percentage
    danger: number; // percentage
  };
}

export function UsageMeter({
  current,
  limit,
  label = 'Usage',
  unit = '',
  resetDate,
  showPercentage = true,
  colorThreshold = { warning: 75, danger: 90 },
}: UsageMeterProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  
  const getColor = () => {
    if (percentage >= colorThreshold.danger) {
      return 'from-red-500 to-red-600';
    } else if (percentage >= colorThreshold.warning) {
      return 'from-orange-500 to-orange-600';
    } else {
      return 'from-navy-700 to-navy-500';
    }
  };

  const getTextColor = () => {
    if (percentage >= colorThreshold.danger) {
      return 'text-red-600';
    } else if (percentage >= colorThreshold.warning) {
      return 'text-orange-600';
    } else {
      return 'text-navy-900';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm text-silver-600">{label}</span>
        <span className={`text-sm font-semibold ${getTextColor()}`}>
          {current.toLocaleString()}
          {unit} / {limit.toLocaleString()}
          {unit}
          {showPercentage && ` (${percentage.toFixed(0)}%)`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-silver-200 rounded-full h-3 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${getColor()} h-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Reset Date */}
      {resetDate && (
        <p className="text-xs text-silver-500 mt-2">
          Resets on {resetDate}
        </p>
      )}

      {/* Warning Messages */}
      {percentage >= colorThreshold.danger && (
        <p className="text-xs text-red-600 mt-2 font-medium">
          ⚠️ You're approaching your usage limit. Consider upgrading your plan.
        </p>
      )}
      {percentage >= colorThreshold.warning && percentage < colorThreshold.danger && (
        <p className="text-xs text-orange-600 mt-2 font-medium">
          You've used {percentage.toFixed(0)}% of your allocation.
        </p>
      )}
    </div>
  );
}
