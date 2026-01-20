import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Sparkles, Shield, TrendingUp, Briefcase, Users, 
  ShoppingCart, Headphones, Stethoscope, ArrowRight, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const platformIcons: Record<string, any> = {
  'ai-intelligence-suite': Sparkles,
  'sales-marketing-command': TrendingUp,
  'financial-command': Briefcase,
  'business-operations': Briefcase,
  'hr-people-management': Users,
  'ecommerce-marketplace': ShoppingCart,
  'customer-experience': Headphones,
  'professional-services': Stethoscope,
  'security-infrastructure': Shield,
};

const platformColors: Record<string, string> = {
  'ai-intelligence-suite': 'from-cyan-500 to-blue-500',
  'sales-marketing-command': 'from-green-500 to-emerald-500',
  'financial-command': 'from-orange-500 to-amber-500',
  'business-operations': 'from-blue-500 to-indigo-500',
  'hr-people-management': 'from-purple-500 to-violet-500',
  'ecommerce-marketplace': 'from-pink-500 to-rose-500',
  'customer-experience': 'from-teal-500 to-cyan-500',
  'professional-services': 'from-blue-600 to-purple-600',
  'security-infrastructure': 'from-green-600 to-emerald-600',
};

export default function Gate8() {
  const [tier, setTier] = useState<'pro' | 'enterprise'>('pro');
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch platforms
      const platformsRes = await fetch('/api/platforms');
      const platformsData = await platformsRes.json();
      setPlatforms(platformsData);

      // Fetch user subscriptions
      try {
        const subsRes = await fetch('/api/platforms/subscriptions', {
          credentials: 'include',
        });
        if (subsRes.ok) {
          const subsData = await subsRes.json();
          setUserSubscriptions(subsData);
        }
      } catch (err) {
        // User not logged in, that's okay
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  async function handleSubscribe(platformSlug: string) {
    setSubscribing(platformSlug);
    
    try {
      const response = await fetch(`/api/platforms/${platformSlug}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to start subscription. Please try again.');
    } finally {
      setSubscribing(null);
    }
  }

  function isSubscribed(platformSlug: string) {
    return userSubscriptions.some(sub => sub.slug === platformSlug && sub.status === 'active');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading platforms...</div>
      </div>
    );
  }

  const paidPlatforms = platforms.filter(p => !p.is_free);
  const freePlatform = platforms.find(p => p.is_free);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="text-white mb-8">
            ← Back to Home
          </Button>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
            GATE 8
          </h1>
          <p className="text-2xl text-white/80 max-w-3xl mx-auto">
            Eight powerful platforms to transform your business. Choose your tier and unlock the tools you need.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 inline-flex gap-2 border border-white/20">
            <button
              onClick={() => setTier('pro')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                tier === 'pro'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Pro Tier
            </button>
            <button
              onClick={() => setTier('enterprise')}
              className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                tier === 'enterprise'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Enterprise Tier
            </button>
          </div>
        </div>

        {tier === 'enterprise' && (
          <div className="text-center mb-12 bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise Tier - $99.99/mo</h3>
            <p className="text-white/80">
              Unlimited API calls, all integrations at full capacity, priority support, and advanced features
            </p>
          </div>
        )}

        {/* Platform Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paidPlatforms.map((platform) => {
            const Icon = platformIcons[platform.slug] || Sparkles;
            const colorClass = platformColors[platform.slug] || 'from-purple-500 to-pink-500';
            const subscribed = isSubscribed(platform.slug);
            const price = tier === 'enterprise' ? platform.price_enterprise : platform.price_pro;

            return (
              <Card
                key={platform.id}
                className="bg-white/10 backdrop-blur-xl border-white/20 p-6 hover:scale-105 transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{platform.name}</h3>
                <p className="text-white/70 mb-4 text-sm">{platform.description}</p>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">${price}</div>
                  <div className="text-white/60 text-sm">per month</div>
                </div>

                <div className="text-white/80 text-sm mb-6">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  {platform.app_count} apps included
                </div>

                {subscribed ? (
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    disabled
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Subscribed
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(platform.slug)}
                    disabled={subscribing === platform.slug}
                    className={`w-full bg-gradient-to-r ${colorClass} text-white hover:opacity-90`}
                  >
                    {subscribing === platform.slug ? 'Processing...' : 'Subscribe Now'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Free Platform */}
        {freePlatform && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border-green-400/30 p-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">{freePlatform.name}</h3>
                  <p className="text-white/80">{freePlatform.description}</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400">FREE</div>
                  <div className="text-white/60 text-sm">with any platform</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
