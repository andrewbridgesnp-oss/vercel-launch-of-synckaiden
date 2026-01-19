import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Sparkles, Zap, Crown, Building2 } from "lucide-react";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const createCheckout = trpc.stripe.createCheckoutSession.useMutation();

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
      name: "1-Day Free Trial",
      price: "$0",
      period: "24 hours",
      description: "Try Kaiden instantly - no SYNC required",
      icon: Sparkles,
      color: "text-gray-400",
      features: [
        { name: "AI Business Consultant (5 chats/day)", included: true },
        { name: "Document Templates Library", included: true },
        { name: "Business Formation Guides", included: true },
        { name: "Credit Repair Basics", included: true },
        { name: "Community Access", included: true },
        { name: "Email Support", included: true },
        { name: "Advanced AI Features", included: false },
        { name: "Personalized Voice AI", included: false },
        { name: "Priority Support", included: false },
        { name: "Done-For-You Services", included: false },
      ],
      cta: "Start Instantly",
      highlighted: false,
      priceId: "",
      tier: "free",
    },
    {
      name: "Starter",
      price: "$97",
      period: "/month",
      description: "For individuals getting started",
      icon: Zap,
      color: "text-cyan-400",
      features: [
        { name: "Unlimited AI Conversations", included: true },
        { name: "All Document Templates", included: true },
        { name: "LLC & Business Formation Assistance", included: true },
        { name: "Credit Repair Guidance", included: true },
        { name: "Brunner Test Analysis", included: true },
        { name: "AI Arena (Multi-AI Debates)", included: true },
        { name: "Personalized AI Voice", included: true },
        { name: "Email Support (24hr response)", included: true },
        { name: "Done-For-You Services", included: false },
        { name: "Priority Phone Support", included: false },
      ],
      cta: "Get Started",
      highlighted: false,
      priceId: "price_starter",
      tier: "starter",
    },
    {
      name: "Professional",
      price: "$197",
      period: "/month",
      description: "Full service for serious builders",
      icon: Crown,
      color: "text-purple-400",
      features: [
        { name: "Everything in Starter, plus:", included: true },
        { name: "Grant & Proposal Writing Assistance", included: true },
        { name: "Trust Formation Guidance", included: true },
        { name: "Dropshipping Setup Help", included: true },
        { name: "Content Creation Tools", included: true },
        { name: "Priority Email Support (4hr response)", included: true },
        { name: "Monthly Strategy Call (30 min)", included: true },
        { name: "Done-For-You Document Prep", included: true },
        { name: "Crypto & Investment Basics", included: true },
        { name: "501(c)(3) Formation Guide", included: true },
      ],
      cta: "Upgrade Now",
      highlighted: true,
      priceId: "price_professional",
      tier: "professional",
    },
    {
      name: "VIP",
      price: "$497",
      period: "/month",
      description: "White-glove service",
      icon: Building2,
      color: "text-blue-400",
      features: [
        { name: "Everything in Professional, plus:", included: true },
        { name: "Weekly Strategy Calls (1 hour)", included: true },
        { name: "Done-For-You Business Setup", included: true },
        { name: "Direct Phone/Text Access", included: true },
        { name: "Custom Document Drafting", included: true },
        { name: "Full Grant Application Support", included: true },
        { name: "YouTube Channel Setup", included: true },
        { name: "E-commerce Store Launch", included: true },
        { name: "Priority Everything", included: true },
        { name: "Lifetime Founding Member Status", included: true },
      ],
      cta: "Join VIP",
      highlighted: false,
      priceId: "price_vip",
      tier: "vip",
    },
  ];

  return (
    <div className="min-h-screen bg-background luxury-gradient relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity: 0.3,
          filter: 'blur(4px)',
          zIndex: 0
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/grok-video-f14f30f2-5402-4aaf-9275-fd17eb9a7c44.mp4" type="video/mp4" />
      </video>
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 fade-in">
          <h1 className="text-5xl font-bold mb-6"
              style={{
                background: "linear-gradient(135deg, #e0e0e8 0%, #ffffff 50%, #c0c0d0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 40px rgba(255,255,255,0.3)",
              }}>
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Start with a free trial, upgrade as you grow. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`glass premium-card border-border/50 p-8 flex flex-col ${
                tier.highlighted 
                  ? "border-primary/50 shadow-lg shadow-primary/20 scale-105" 
                  : ""
              }`}
              style={{
                background: tier.highlighted
                  ? "linear-gradient(135deg, rgba(200,200,220,0.15) 0%, rgba(180,180,200,0.1) 100%)"
                  : "linear-gradient(135deg, rgba(180,180,200,0.1) 0%, rgba(160,160,180,0.05) 100%)",
              }}
            >
              {tier.highlighted && (
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                        style={{
                          background: "linear-gradient(135deg, rgba(200,200,220,0.3) 0%, rgba(180,180,200,0.2) 100%)",
                          color: "rgba(220,220,240,0.9)"
                        }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <tier.icon className={`w-12 h-12 mx-auto mb-4 ${tier.color}`} />
                <h3 className="text-2xl font-bold mb-2 text-gray-200">{tier.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{tier.description}</p>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-100">{tier.price}</span>
                  <span className="text-gray-400 ml-1">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-gray-300" : "text-gray-600"}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {isAuthenticated ? (
                <Button
                  onClick={() => tier.priceId && handleUpgrade(tier.tier, tier.priceId)}
                  disabled={!tier.priceId || createCheckout.isPending}
                  className={`w-full ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] hover:opacity-90"
                      : "bg-primary/10 hover:bg-primary/20 border border-primary/30"
                  }`}
                >
                  {createCheckout.isPending ? "Processing..." : tier.cta}
                </Button>
              ) : (
                <a href={getLoginUrl()}>
                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? "bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] hover:opacity-90"
                        : "bg-primary/10 hover:bg-primary/20 border border-primary/30"
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </a>
              )}
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-200">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card className="glass border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                Can I switch plans later?
              </h3>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate the billing accordingly.
              </p>
            </Card>
            <Card className="glass border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                What happens after my free trial ends?
              </h3>
              <p className="text-gray-400">
                Your account will be downgraded to read-only mode. You can upgrade to any paid plan 
                to restore full access to your data and features.
              </p>
            </Card>
            <Card className="glass border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                How do I cancel my subscription?
              </h3>
              <p className="text-gray-400">
                You can cancel anytime from your account settings. Your access continues until the end of your billing period.
              </p>
            </Card>
            <Card className="glass border-border/50 p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                Is there a setup fee?
              </h3>
              <p className="text-gray-400">
                No setup fees, no hidden charges. You only pay the monthly subscription price.
              </p>
            </Card>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-200">
            What Our Users Say
          </h2>
          <TestimonialCarousel />
          <p className="text-center text-sm text-gray-500 mt-6">
            🎬 Watch our TikTok live to claim your free service and become a founding reviewer
          </p>
          <div className="text-center mt-4">
            <a 
              href="https://www.tiktok.com/@projectblacklight" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#ff0050] to-[#00f2ea] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
              Follow @projectblacklight
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">
            Still have questions? <Link href="/chat"><a className="text-primary hover:underline">Chat with Kaiden</a></Link> or contact our sales team.
          </p>
        </div>
      </div>
    </div>
  );
}
