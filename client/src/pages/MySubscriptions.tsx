import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Check, X, Calendar, CreditCard, AlertCircle,
  Sparkles, Shield
} from 'lucide-react';

export default function MySubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    try {
      const response = await fetch('/api/platforms/subscriptions', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setLoading(false);
    }
  }

  async function handleCancelSubscription(subscriptionId: number) {
    if (!confirm('Are you sure you want to cancel this subscription? You will lose access at the end of the current billing period.')) {
      return;
    }

    setCancelling(subscriptionId);
    
    try {
      const response = await fetch(`/api/platforms/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Subscription cancelled successfully');
        fetchSubscriptions();
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancelling(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <Link href="/dashboard">
          <Button variant="ghost" className="text-white mb-8">
            ← Back to Dashboard
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">My Subscriptions</h1>
          <p className="text-xl text-white/70">
            Manage your platform subscriptions and billing
          </p>
        </div>

        {subscriptions.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No Active Subscriptions</h2>
            <p className="text-white/70 mb-8">
              You don't have any active platform subscriptions yet. Explore GATE 8 to get started!
            </p>
            <Link href="/gate-8">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Browse Platforms
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((sub) => (
              <Card
                key={sub.id}
                className="bg-white/10 backdrop-blur-xl border-white/20 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      <h3 className="text-2xl font-bold text-white">{sub.name}</h3>
                      {sub.status === 'active' && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-400/30">
                          <Check className="w-3 h-3 inline mr-1" />
                          Active
                        </span>
                      )}
                      {sub.status === 'cancelled' && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold border border-red-400/30">
                          <X className="w-3 h-3 inline mr-1" />
                          Cancelled
                        </span>
                      )}
                    </div>

                    <p className="text-white/70 mb-4">{sub.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-white/80">
                        <CreditCard className="w-4 h-4" />
                        <span className="capitalize">{sub.tier} Tier</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Renews {new Date(sub.current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${sub.tier === 'enterprise' ? '99.99' : sub.price_pro}
                    </div>
                    <div className="text-white/60 text-sm mb-4">per month</div>
                    
                    {sub.status === 'active' && (
                      <Button
                        onClick={() => handleCancelSubscription(sub.id)}
                        disabled={cancelling === sub.id}
                        variant="outline"
                        className="bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20"
                      >
                        {cancelling === sub.id ? 'Cancelling...' : 'Cancel Subscription'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Free Platform Notice */}
        <Card className="mt-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-green-400/30 p-6">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-green-400" />
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Security & Infrastructure (FREE)
              </h3>
              <p className="text-white/80 text-sm">
                Included free with any active subscription
              </p>
            </div>
          </div>
        </Card>

        {/* Billing Info */}
        <div className="mt-12 text-center text-white/60 text-sm">
          <p>
            Need help with billing?{' '}
            <Link href="/contact">
              <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                Contact Support
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
