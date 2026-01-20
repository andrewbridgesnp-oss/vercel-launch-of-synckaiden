import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    id: 'basic',
    name: 'Basic Estimate',
    price: 29,
    description: 'Perfect for simple tax returns',
    features: [
      'Federal & State tax calculations',
      'Standard deductions',
      'CSV export to CPA',
      'Basic tax scenarios',
      'Email support'
    ],
    popular: false
  },
  {
    id: 'crypto',
    name: 'Crypto Package',
    price: 79,
    description: 'For cryptocurrency investors',
    features: [
      'Everything in Basic',
      'Crypto wash sale detection',
      'FIFO/LIFO/HIFO calculations',
      'Multiple exchange support',
      'Schedule D generation',
      'Priority email support'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 149,
    description: 'Advanced tax optimization',
    features: [
      'Everything in Crypto',
      'AI-powered optimization',
      'Multi-year analysis',
      'Investment tracking',
      'Retirement planning',
      'Priority support'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 299,
    description: 'For tax preparers',
    features: [
      'Everything in Premium',
      'Unlimited clients',
      'White-label option',
      'QuickBooks/Xero integration',
      'Audit risk assessment',
      'Phone support'
    ],
    popular: false
  }
];

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (planId: string) => {
    setLoading(planId);

    try {
      const response = await fetch(`${API_BASE_URL}/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ plan: planId })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Selected ${planId} plan - $${data.amount}. ${data.message}`);
        onOpenChange(false);
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
          border: '1px solid rgba(168, 182, 216, 0.2)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-100">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Select the plan that best fits your needs. No IRS filing - exports work with your existing workflow.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative rounded-xl p-6 transition-all"
              style={{
                background: plan.popular 
                  ? 'linear-gradient(135deg, rgba(168, 182, 216, 0.15), rgba(147, 158, 187, 0.1))'
                  : 'linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))',
                border: plan.popular 
                  ? '2px solid rgba(168, 182, 216, 0.4)'
                  : '1px solid rgba(168, 182, 216, 0.2)',
              }}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 182, 216, 0.9), rgba(147, 158, 187, 0.9))',
                    color: '#0f172a'
                  }}
                >
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-100 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-slate-100">${plan.price}</span>
                  <span className="text-slate-400 text-sm">one-time</span>
                </div>
                <p className="text-xs text-slate-400">{plan.description}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePurchase(plan.id)}
                disabled={loading === plan.id}
                className="w-full"
                style={{
                  background: plan.popular
                    ? 'linear-gradient(135deg, rgba(168, 182, 216, 0.9), rgba(147, 158, 187, 0.9))'
                    : 'rgba(168, 182, 216, 0.2)',
                  color: plan.popular ? '#0f172a' : '#e2e8f0',
                  border: '1px solid rgba(168, 182, 216, 0.3)'
                }}
              >
                {loading === plan.id ? 'Processing...' : 'Select Plan'}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg" style={{
          background: 'rgba(168, 182, 216, 0.1)',
          border: '1px solid rgba(168, 182, 216, 0.2)'
        }}>
          <p className="text-sm text-slate-300 text-center">
            <strong className="text-slate-100">Legal Disclaimer:</strong> KAIDEN provides tax calculations and planning scenarios for educational purposes. 
            This is not tax advice. Consult a licensed tax professional before making financial decisions. 
            KAIDEN does not file tax returns with the IRS.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}