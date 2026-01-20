import React from 'react';
import { GateCard } from '../integration/GateCard';
import { TrendingUp, Zap } from 'lucide-react';

interface GateLimitReachedProps {
  currentUsage: number;
  limit: number;
  resetDate: string;
  currentPlan: string;
  onUpgrade: () => void;
  onViewUsage: () => void;
}

export function GateLimitReached({
  currentUsage,
  limit,
  resetDate,
  currentPlan,
  onUpgrade,
  onViewUsage,
}: GateLimitReachedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-navy-50/30 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <GateCard
          type="limit_reached"
          title="Usage Limit Reached"
          description={`You've reached your ${currentPlan} plan limit of ${limit} visits this month. Upgrade to continue documenting visits or wait until your limit resets.`}
          primaryAction={{
            label: 'Upgrade Plan',
            onClick: onUpgrade,
          }}
          secondaryAction={{
            label: 'View Usage Details',
            onClick: onViewUsage,
          }}
          usageData={{
            current: currentUsage,
            limit: limit,
            resetDate: resetDate,
          }}
        >
          {/* Upgrade Benefits */}
          <div className="bg-navy-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              <h4 className="text-sm font-semibold text-navy-900">Upgrade to Continue</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-white rounded-lg p-3 border border-silver-300">
                <p className="text-xs text-silver-600 mb-1">Pro Plan</p>
                <p className="text-lg font-bold text-navy-900">500</p>
                <p className="text-xs text-silver-600">visits/month</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-silver-300">
                <p className="text-xs text-silver-600 mb-1">Enterprise</p>
                <p className="text-lg font-bold text-navy-900">Unlimited</p>
                <p className="text-xs text-silver-600">visits/month</p>
              </div>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-sm font-semibold text-orange-900 mb-1">Can't Upgrade Now?</h4>
                <p className="text-xs text-orange-700">
                  Your limit will automatically reset on <strong>{resetDate}</strong>. In the meantime, your existing documentation remains accessible.
                </p>
              </div>
            </div>
          </div>
        </GateCard>
      </div>
    </div>
  );
}
