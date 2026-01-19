import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Sparkles, Briefcase, Rocket, Building2 } from "lucide-react";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function PricingNew() {
  const { user, isAuthenticated } = useAuth();
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");

  const handleUpgrade = async (tier: string, priceId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    try {
      const result = await createCheckout.mutateAsync({
        priceId,
        tier: tier as any,
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.");
    }
  };

  const tiers = [
    {
      name: "Personal",
      weeklyPrice: "$9",
      monthlyPrice: "$29",
      period: billingCycle === "weekly" ? "/week" : "/month",
      description: "Perfect for individuals and side hustles",
      icon: Sparkles,
      color: "text-cyan-400",
      features: [
        { name: "AI Business Consultant (Unlimited)", included: true },
        { name: "Document Templates Library", included: true },
        { name: "Business Formation Guides", included: true },
        { name: "Credit Repair Basics", included: true },
        { name: "Community Access", included: true },
        { name: "Email Support (48hr response)", included: true },
        { name: "Voice AI Assistant", included: false },
        { name: "Priority Support", included: false },
        { name: "Done-For-You Services", included: false },
        { name: "Team Collaboration", included: false },
      ],
      cta: "Get Started",
      highlighted: false,
      priceId: billingCycle === "weekly" ? "price_personal_weekly" : "price_personal_monthly",
      tier: "personal",
    },
    {
      name: "Small Business",
      weeklyPrice: "$24",
      monthlyPrice: "$79",
      period: billingCycle === "weekly" ? "/week" : "/month",
      description: "For growing businesses and teams",
      icon: Briefcase,
      color: "text-purple-400",
      features: [
        { name: "Everything in Personal, plus:", included: true },
        { name: "Voice AI Assistant (Personalized)", included: true },
        { name: "LLC & Trust Formation Assistance", included: true },
        { name: "Grant & Proposal Writing", included: true },
        { name: "Dropshipping Setup Help", included: true },
        { name: "Content Creation Tools", included: true },
        { name: "Priority Email Support (24hr response)", included: true },
        { name: "Up to 5 Team Members", included: true },
        { name: "Monthly Strategy Call (30 min)", included: true },
        { name: "Done-For-You Document Prep", included: true },
      ],
      cta: "Upgrade Now",
      highlighted: true,
      priceId: billingCycle === "weekly" ? "price_small_business_weekly" : "price_small_business_monthly",
      tier: "small_business",
    },
    {
      name: "Startup",
      weeklyPrice: "$49",
      monthlyPrice: "$149",
      period: billingCycle === "weekly" ? "/week" : "/month",
      description: "For ambitious startups scaling fast",
      icon: Rocket,
      color: "text-pink-400",
      features: [
        { name: "Everything in Small Business, plus:", included: true },
        { name: "Advanced AI Features (Multi-AI Debates)", included: true },
        { name: "Crypto & Investment Guidance", included: true },
        { name: "Medical Billing Setup", included: true },
        { name: "VitalSync Telehealth Integration", included: true },
        { name: "Where's My Tribe Community Platform", included: true },
        { name: "Kaiden Academy Access", included: true },
        { name: "Priority Phone Support", included: true },
        { name: "Up to 15 Team Members", included: true },
        { name: "Weekly Strategy Calls", included: true },
      ],
      cta: "Scale Up",
      highlighted: false,
      priceId: billingCycle === "weekly" ? "price_startup_weekly" : "price_startup_monthly",
      tier: "startup",
    },
    {
      name: "Enterprise",
      weeklyPrice: "$99",
      monthlyPrice: "$299",
      period: billingCycle === "weekly" ? "/week" : "/month",
      description: "For established businesses and agencies",
      icon: Building2,
      color: "text-gold-400",
      features: [
        { name: "Everything in Startup, plus:", included: true },
        { name: "White-Label Capabilities", included: true },
        { name: "Custom Integrations & API Access", included: true },
        { name: "Dedicated Account Manager", included: true },
        { name: "Unlimited Team Members", included: true },
        { name: "24/7 Priority Support", included: true },
        { name: "Custom Workflows & Automation", included: true },
        { name: "Advanced Analytics & Reporting", included: true },
        { name: "SLA Guarantee (99.9% uptime)", included: true },
        { name: "On-Demand Strategy Sessions", included: true },
      ],
      cta: "Contact Sales",
      highlighted: false,
      priceId: billingCycle === "weekly" ? "price_enterprise_weekly" : "price_enterprise_monthly",
      tier: "enterprise",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Choose Your Growth Path
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Start with a free trial, then select the plan that fits your ambition
        </p>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingCycle("weekly")}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === "weekly"
                ? "bg-cyan-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full transition-all ${
              billingCycle === "monthly"
                ? "bg-cyan-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Monthly
            <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded-full">Save 20%</span>
          </button>
        </div>

        {/* Free Trial CTA */}
        <div className="max-w-2xl mx-auto mb-16 p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-3xl font-bold mb-2">Start with a Free Trial</h2>
          <p className="text-gray-300 mb-6">
            Experience Kaiden for 1 day - no credit card, no SYNC required
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-6 text-lg"
            onClick={() => {
              if (!isAuthenticated) {
                window.location.href = getLoginUrl();
              } else {
                toast.success("Free trial activated!");
              }
            }}
          >
            Start Free Trial
          </Button>
          <p className="text-sm text-gray-400 mt-4">
            ✓ No credit card required • ✓ Cancel anytime • ✓ 100% approval-gated automation
          </p>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="container pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const price = billingCycle === "weekly" ? tier.weeklyPrice : tier.monthlyPrice;

            return (
              <Card
                key={tier.name}
                className={`relative p-8 ${
                  tier.highlighted
                    ? "border-2 border-purple-500 shadow-2xl shadow-purple-500/20"
                    : "border border-gray-700"
                } bg-gray-800/50 backdrop-blur-sm hover:scale-105 transition-transform`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${tier.color}`} />
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                  <div className="text-4xl font-bold mb-2">
                    {price}
                    <span className="text-lg text-gray-400">{tier.period}</span>
                  </div>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => handleUpgrade(tier.tier, tier.priceId)}
                >
                  {tier.cta}
                </Button>

                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-gray-200" : "text-gray-600"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="container pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <TestimonialCarousel />
      </div>

      {/* FAQ */}
      <div className="container pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Can I switch between weekly and monthly billing?</h3>
            <p className="text-gray-400">
              Yes! You can change your billing cycle at any time from your subscription settings.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">What happens after the free trial?</h3>
            <p className="text-gray-400">
              Your trial automatically ends after 24 hours. No charges are made unless you choose to upgrade.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-400">
              Absolutely. Cancel anytime from your subscription settings with no penalties or fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
