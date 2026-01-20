import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { PlanCard } from '../integration/PlanCard';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'free' | 'starter' | 'pro' | 'enterprise';
  onSelectPlan: (planId: string) => void;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentPlan = 'free',
  onSelectPlan,
}: UpgradeModalProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: billingPeriod === 'monthly' ? '$99' : '$990',
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      description: 'Perfect for solo practitioners',
      features: [
        'Up to 100 visits per month',
        'AI-powered documentation',
        'Basic coding assistant (ICD-10/CPT)',
        'Standard EHR integration',
        'Email support',
        'HIPAA-compliant',
      ],
      isCurrent: currentPlan === 'starter',
    },
    {
      id: 'pro',
      name: 'Professional',
      price: billingPeriod === 'monthly' ? '$299' : '$2,990',
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      description: 'For busy practices and clinics',
      features: [
        'Up to 500 visits per month',
        'Advanced AI documentation',
        'Intelligent coding with evidence',
        'Multi-specialty support',
        'Priority EHR integration',
        'Phone + email support',
        'Custom templates',
        'HIPAA BAA included',
      ],
      isPopular: true,
      isCurrent: currentPlan === 'pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingPeriod === 'monthly' ? '$999' : '$9,990',
      period: billingPeriod === 'monthly' ? 'month' : 'year',
      description: 'For large healthcare systems',
      features: [
        'Unlimited visits',
        'White-label customization',
        'Advanced analytics dashboard',
        'Dedicated account manager',
        '99.9% uptime SLA',
        'Custom integrations',
        'On-premise deployment option',
        'Training & onboarding',
        'SOC 2 Type II certified',
      ],
      isCurrent: currentPlan === 'enterprise',
    },
  ];

  return (
    <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto luxury-shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-silver-300 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 mb-2">Upgrade Kaiden Scribe</h2>
            <p className="text-silver-600">Choose the perfect plan for your practice</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-silver-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-silver-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-navy-800 text-white'
                  : 'bg-silver-100 text-navy-700 hover:bg-silver-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors relative ${
                billingPeriod === 'annual'
                  ? 'bg-navy-800 text-white'
                  : 'bg-silver-100 text-navy-700 hover:bg-silver-200'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-gold text-navy-900 text-xs font-bold px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                {...plan}
                onSelect={() => onSelectPlan(plan.id)}
              />
            ))}
          </div>

          {/* Trust Badges */}
          <div className="bg-navy-50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900">HIPAA Compliant</h4>
                <p className="text-xs text-silver-600">Enterprise-grade security</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900">Cancel Anytime</h4>
                <p className="text-xs text-silver-600">No long-term contracts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h4 className="font-semibold text-navy-900">30-Day Guarantee</h4>
                <p className="text-xs text-silver-600">Full refund if not satisfied</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
