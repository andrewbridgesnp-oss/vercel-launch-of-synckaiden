import React from 'react';
import { Lock, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface GateCardProps {
  type: 'not_installed' | 'trial' | 'active' | 'paused' | 'expired' | 'limit_reached';
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  usageData?: {
    current: number;
    limit: number;
    resetDate?: string;
  };
  children?: React.ReactNode;
}

export function GateCard({
  type,
  title,
  description,
  primaryAction,
  secondaryAction,
  usageData,
  children,
}: GateCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'not_installed':
        return <Lock className="w-12 h-12 text-silver-400" />;
      case 'trial':
        return <Clock className="w-12 h-12 text-gold" />;
      case 'active':
        return <CheckCircle2 className="w-12 h-12 text-green-500" />;
      case 'paused':
      case 'expired':
        return <AlertCircle className="w-12 h-12 text-red-500" />;
      case 'limit_reached':
        return <AlertCircle className="w-12 h-12 text-orange-500" />;
    }
  };

  const getStatusBadge = () => {
    const badges = {
      not_installed: { label: 'Not Installed', color: 'bg-silver-700' },
      trial: { label: 'Trial', color: 'bg-gold/20 text-gold border border-gold/30' },
      active: { label: 'Active', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
      paused: { label: 'Paused', color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
      expired: { label: 'Expired', color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
      limit_reached: { label: 'Limit Reached', color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
    };
    
    const badge = badges[type];
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-silver-300 p-8 luxury-shadow">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-4">{getIcon()}</div>

        {/* Status Badge */}
        <div className="mb-4">{getStatusBadge()}</div>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold text-navy-900 mb-2">{title}</h2>
        <p className="text-silver-600 mb-6">{description}</p>

        {/* Usage Meter (if applicable) */}
        {usageData && (
          <div className="w-full mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-silver-600">Usage</span>
              <span className="text-navy-900 font-semibold">
                {usageData.current} / {usageData.limit}
              </span>
            </div>
            <div className="w-full bg-silver-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-navy-700 to-navy-500 h-full transition-all duration-300"
                style={{ width: `${Math.min((usageData.current / usageData.limit) * 100, 100)}%` }}
              />
            </div>
            {usageData.resetDate && (
              <p className="text-xs text-silver-500 mt-2">Resets on {usageData.resetDate}</p>
            )}
          </div>
        )}

        {/* Custom Content */}
        {children && <div className="w-full mb-6">{children}</div>}

        {/* Actions */}
        <div className="flex gap-3 w-full">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="flex-1 bg-navy-800 hover:bg-navy-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="flex-1 bg-silver-100 hover:bg-silver-200 text-navy-900 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
