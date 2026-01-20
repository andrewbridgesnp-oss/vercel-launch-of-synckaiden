// KAIDEN CAPITAL™ - Trust Score Badge Component

import React from 'react';
import { Shield, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { TrustScore } from '../../types';
import { cn } from '../components/ui/utils';

interface TrustScoreBadgeProps {
  trustScore: TrustScore;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({
  trustScore,
  size = 'md',
  showDetails = false,
  className,
}) => {
  const getColorClasses = (level: TrustScore['level']) => {
    switch (level) {
      case 'excellent':
        return 'from-emerald-500 to-teal-500 text-white';
      case 'good':
        return 'from-blue-500 to-cyan-500 text-white';
      case 'medium':
        return 'from-yellow-500 to-amber-500 text-white';
      case 'low':
        return 'from-orange-500 to-red-500 text-white';
      case 'critical':
        return 'from-red-600 to-rose-700 text-white';
    }
  };

  const getIcon = (level: TrustScore['level']) => {
    switch (level) {
      case 'excellent':
      case 'good':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'medium':
        return <Shield className="w-4 h-4" />;
      case 'low':
        return <AlertCircle className="w-4 h-4" />;
      case 'critical':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={cn('inline-flex flex-col gap-2', className)}>
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full bg-gradient-to-r font-semibold shadow-md',
          getColorClasses(trustScore.level),
          sizeClasses[size]
        )}
      >
        {getIcon(trustScore.level)}
        <span>Trust Score: {trustScore.score}</span>
        <span className="opacity-80 capitalize">({trustScore.level})</span>
      </div>
      
      {showDetails && (
        <div className="mt-2 text-sm text-muted-foreground">
          <p className="mb-1">
            <strong>Capabilities:</strong> {trustScore.capabilities.length} unlocked
          </p>
          {trustScore.blockers.length > 0 && (
            <p className="text-orange-600">
              <strong>Blockers:</strong> {trustScore.blockers.length} remaining
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface TrustScoreDetailsProps {
  trustScore: TrustScore;
  className?: string;
}

export const TrustScoreDetails: React.FC<TrustScoreDetailsProps> = ({
  trustScore,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h4 className="mb-3 font-semibold">Trust Factors</h4>
        <div className="space-y-2">
          {trustScore.factors.map((factor) => (
            <div key={factor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {factor.verified ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
                <span className="text-sm">{factor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {factor.value}/{factor.weight}
                </span>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(factor.value / factor.weight) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {trustScore.capabilities.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold text-green-700">Unlocked Capabilities</h4>
          <ul className="space-y-1 text-sm">
            {trustScore.capabilities.map((cap, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>{cap.split('-').join(' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {trustScore.blockers.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold text-orange-700">Remaining Blockers</h4>
          <ul className="space-y-1 text-sm">
            {trustScore.blockers.map((blocker, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertCircle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{blocker}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
