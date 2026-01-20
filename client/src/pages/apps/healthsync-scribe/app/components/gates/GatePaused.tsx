import React from 'react';
import { GateCard } from '../integration/GateCard';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface GatePausedProps {
  reason: 'payment_failed' | 'subscription_expired' | 'manually_paused';
  expiryDate?: string;
  onReactivate: () => void;
  onContactSupport: () => void;
}

export function GatePaused({
  reason,
  expiryDate,
  onReactivate,
  onContactSupport,
}: GatePausedProps) {
  const getReasonMessage = () => {
    switch (reason) {
      case 'payment_failed':
        return 'Your payment method failed. Please update your billing information to reactivate your subscription.';
      case 'subscription_expired':
        return `Your subscription expired${expiryDate ? ` on ${expiryDate}` : ''}. Reactivate to continue using Kaiden Scribe.`;
      case 'manually_paused':
        return 'Your subscription is paused. You can reactivate it at any time to resume access.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-navy-50/30 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <GateCard
          type="paused"
          title="Subscription Paused"
          description={getReasonMessage()}
          primaryAction={{
            label: 'Reactivate Subscription',
            onClick: onReactivate,
          }}
          secondaryAction={{
            label: 'Contact Support',
            onClick: onContactSupport,
          }}
        >
          {/* Warning Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-sm font-semibold text-orange-900 mb-1">Access Suspended</h4>
                <p className="text-xs text-orange-700">
                  All clinical documentation features are temporarily unavailable. Your data is safe and will be restored upon reactivation.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          {reason === 'payment_failed' && (
            <div className="bg-navy-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-navy-700 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-navy-900 mb-1">Next Steps</h4>
                  <ol className="text-xs text-silver-700 space-y-1">
                    <li>1. Update your payment method</li>
                    <li>2. Click "Reactivate Subscription"</li>
                    <li>3. Your access will be restored immediately</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </GateCard>
      </div>
    </div>
  );
}
