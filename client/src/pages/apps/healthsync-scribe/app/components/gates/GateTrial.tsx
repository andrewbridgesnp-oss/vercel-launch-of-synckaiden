import React from 'react';
import { GateCard } from '../integration/GateCard';
import { UsageMeter } from '../integration/UsageMeter';
import { Clock, Zap } from 'lucide-react';

interface GateTrialProps {
  daysRemaining: number;
  usageCurrent: number;
  usageLimit: number;
  onUpgrade: () => void;
  onContinueTrial: () => void;
}

export function GateTrial({
  daysRemaining,
  usageCurrent,
  usageLimit,
  onUpgrade,
  onContinueTrial,
}: GateTrialProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-navy-50/30 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <GateCard
          type="trial"
          title="Free Trial Active"
          description={`You have ${daysRemaining} days remaining in your free trial. Upgrade now to unlock unlimited access and premium features.`}
          primaryAction={{
            label: 'Upgrade to Pro',
            onClick: onUpgrade,
          }}
          secondaryAction={{
            label: 'Continue with Trial',
            onClick: onContinueTrial,
          }}
          usageData={{
            current: usageCurrent,
            limit: usageLimit,
            resetDate: 'End of Trial',
          }}
        >
          {/* Trial Limitations */}
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-sm font-semibold text-navy-900 mb-1">Trial Limitations</h4>
                <ul className="text-xs text-silver-700 space-y-1">
                  <li>• Limited to {usageLimit} visits per month</li>
                  <li>• Basic AI features only</li>
                  <li>• No custom specialty packs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Upgrade Benefits */}
          <div className="bg-navy-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-gold" />
              <h4 className="text-sm font-semibold text-navy-900">Upgrade Benefits</h4>
            </div>
            <ul className="text-xs text-silver-700 space-y-1 text-left">
              <li>✓ Unlimited visits</li>
              <li>✓ Advanced AI coding assistant</li>
              <li>✓ Custom specialty configurations</li>
              <li>✓ Priority support</li>
              <li>✓ HIPAA BAA included</li>
            </ul>
          </div>
        </GateCard>
      </div>
    </div>
  );
}
