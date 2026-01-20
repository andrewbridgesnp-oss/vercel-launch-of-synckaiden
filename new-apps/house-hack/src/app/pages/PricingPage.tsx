import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../../lib/store';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Home, Check, Loader2 } from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      const { url } = await api.subscriptions.createCheckout(plan);
      window.location.href = url;
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error(error.message || 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for exploring your first deal',
      features: [
        '1 Deal Room',
        'Basic calculators',
        'Document checklist',
        'Fit Score analysis',
        'Limited exports',
        'Email support'
      ],
      cta: 'Current Plan',
      ctaVariant: 'secondary' as const,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For serious house-hackers managing multiple deals',
      features: [
        'Unlimited Deal Rooms',
        'Advanced calculators',
        'Team invitations',
        'Custom templates',
        'Unlimited exports',
        'Priority support',
        'Marketplace access',
        '7-day free trial'
      ],
      cta: 'Start Free Trial',
      ctaVariant: 'default' as const,
      popular: true
    },
    {
      id: 'team',
      name: 'Team',
      price: '$99',
      period: 'per month',
      description: 'For partners managing client pipelines',
      features: [
        'Everything in Pro',
        'Partner workspace',
        'Client pipeline views',
        'Multi-seat access',
        'White-label reports',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      ctaVariant: 'outline' as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">KAIDEN HouseHack 203K</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're starting your first deal or managing multiple properties, 
            we have a plan that fits your needs.
          </p>
          {user && (
            <div className="mt-6">
              <Badge className="text-sm px-4 py-2">
                Current Plan: {user.plan.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${
                plan.popular 
                  ? 'border-blue-600 border-2 shadow-xl' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/ {plan.period}</span>
                </div>
                <CardDescription className="mt-3">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.ctaVariant}
                  onClick={() => {
                    if (plan.id === 'free') {
                      if (user) {
                        navigate('/dashboard');
                      } else {
                        navigate('/auth');
                      }
                    } else if (plan.id === 'team') {
                      toast.info('Please contact sales for Team plan details');
                    } else {
                      handleUpgrade(plan.id);
                    }
                  }}
                  disabled={loading || (user?.plan === plan.id)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : user?.plan === plan.id ? (
                    'Current Plan'
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                  and billing adjustments are prorated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards (Visa, MasterCard, American Express) through 
                  our secure payment processor, Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a contract or commitment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No contracts! All plans are month-to-month. You can cancel anytime from your 
                  account settings or by contacting support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens to my data if I downgrade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your data is always safe. If you downgrade to Free (1 Deal Room limit), you can 
                  choose which deal to keep active. Other deals are archived and can be reactivated 
                  by upgrading again.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, 
                  contact support within 7 days of purchase for a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Master Your 203(k) Journey?
          </h2>
          <p className="text-gray-600 mb-8">
            Join hundreds of house-hackers who trust KAIDEN for their FHA 203(k) deals.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">
            © 2026 KAIDEN HouseHack 203K. Educational platform for FHA 203(k) financing.
          </p>
          <p className="text-sm">
            This platform provides educational resources only. Not financial or legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
