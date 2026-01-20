import { Check, Star, Mic, Brain, TrendingUp, Sparkles, Video } from "lucide-react";
import { Button } from "../components/ui/button";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { StatusBadge } from "../components/avery/status-badge";

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const plans = [
    {
      name: "Starter",
      price: "$9.99",
      period: "/ month",
      description: "Perfect for solopreneurs and side hustles. Get started with AI call handling.",
      badge: "trial" as const,
      features: [
        "50 calls/month included",
        "24/7 AI call answering",
        "Appointment booking",
        "SMS confirmations",
        "Call transcripts",
        "Basic analytics",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$29.99",
      period: "/ month",
      description: "For growing businesses. Everything you need to scale with confidence.",
      badge: null,
      features: [
        "500 calls/month included",
        "Everything in Starter, plus:",
        "💳 Payment collection (Stripe)",
        "📅 Smart scheduling rules",
        "🎙️ Call recordings",
        "📊 Advanced analytics",
        "🔄 CRM integrations",
        "🎯 Lead scoring",
        "Priority support"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Elite",
      price: "$49.99",
      period: "/ month",
      description: "Maximum power. Destroy the competition with AI superpowers.",
      badge: null,
      features: [
        "Unlimited calls",
        "Everything in Professional, plus:",
        "🎤 Voice Cloning - Sounds like YOU",
        "🧠 AI Conversation Intelligence",
        "💰 Revenue Optimization Engine",
        "🌍 50+ languages",
        "👥 Team collaboration",
        "🏢 Multi-location support",
        "⚡ Real-time insights",
        "🎯 Priority routing",
        "📞 Dedicated success manager"
      ],
      cta: "Start Free Trial",
      popular: false,
      highlight: true
    }
  ];

  const killerFeatures = [
    {
      icon: Mic,
      title: "Voice Cloning",
      description: "Avery sounds exactly like YOU. Upload 30 seconds of your voice, and customers will think they're talking to you personally.",
      tier: "Elite",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Brain,
      title: "Emotional Intelligence",
      description: "Understands tone, urgency, de-escalates angry customers, and uses dry humor appropriately. Avery reads the room like a human.",
      tier: "Pro & Elite",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Revenue Optimization Engine",
      description: "AI-powered upselling, dynamic pricing suggestions, and conversion rate optimization. Turn every call into maximum revenue.",
      tier: "Elite",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Video,
      title: "Visual AI + Avatar",
      description: "Hyper-realistic avatar (YOUR face), intelligent video switching, AR product demos, and screen sharing. Competitors are audio-only.",
      tier: "Elite",
      color: "from-blue-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#00d9ff]" />
            <span className="text-sm text-[#00d9ff] font-semibold">Competitive Pricing • Elite Features</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Pricing That Makes Sense</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start at $9.99/month. No contracts. Cancel anytime. 14-day free trial on all plans.
          </p>
        </div>

        {/* Killer Features Showcase */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">3 Features That Destroy the Competition</h2>
            <p className="text-muted-foreground">Only available in Avery Elite - No one else has these</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {killerFeatures.map((feature, index) => (
              <GlassmorphismCard key={index} className="p-6 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`} />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <span className="text-xs bg-[#00d9ff]/20 text-[#00d9ff] px-2 py-1 rounded-full">
                      {feature.tier}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </GlassmorphismCard>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <GlassmorphismCard
              key={index}
              className={`p-8 relative ${
                plan.popular
                  ? "border-2 border-accent shadow-xl shadow-accent/20"
                  : plan.highlight
                  ? "border-2 border-[#00d9ff] shadow-xl shadow-[#00d9ff]/20"
                  : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4" fill="currentColor" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Elite Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Elite Plan
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Trial Badge */}
              {plan.badge && (
                <div className="mb-4">
                  <StatusBadge status={plan.badge} label="14-day free trial" />
                </div>
              )}

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                className={`w-full ${
                  plan.popular || plan.highlight
                    ? "bg-accent hover:bg-accent/90"
                    : "bg-primary/10 hover:bg-primary/20"
                }`}
                onClick={() => onNavigate("auth")}
              >
                {plan.cta}
              </Button>
            </GlassmorphismCard>
          ))}
        </div>

        {/* Comparison vs Competition */}
        <div className="max-w-4xl mx-auto mb-16">
          <GlassmorphismCard className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Avery vs. The Competition</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Other AI ($49.99)</th>
                    <th className="text-center py-3 px-4 bg-[#00d9ff]/10">
                      <div className="flex items-center justify-center gap-2">
                        <span>Avery Elite</span>
                        <span className="text-[#00d9ff] font-bold">($49.99)</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">24/7 Call Answering</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4 bg-[#00d9ff]/5">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">Appointment Booking</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4 bg-[#00d9ff]/5">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">Payment Collection</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4 bg-[#00d9ff]/5">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">
                      <strong>Voice Cloning (Sounds Like You)</strong>
                    </td>
                    <td className="text-center py-3 px-4 text-red-500">✗</td>
                    <td className="text-center py-3 px-4 bg-[#00d9ff]/5 text-green-500 font-bold">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">
                      <strong>AI Conversation Intelligence</strong>
                    </td>
                    <td className="text-center py-3 px-4 text-red-500">✗</td>
                    <td className="text-center py-3 px-4 bg-[#00d9ff]/5 text-green-500 font-bold">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">
                      <strong>Revenue Optimization Engine</strong>
                    </td>
                    <td className="text-center py-3 px-4 text-red-500">✗</td>
                    <td className="text-center py-3 px-4 bg-[#00d9ff]/5 text-green-500 font-bold">✓</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">Multi-language Support</td>
                    <td className="text-center py-3 px-4">Limited</td>
                    <td className="text-center py-3 px-4 bg-[#00d9ff]/5 text-green-500">50+ Languages</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">Call Volume</td>
                    <td className="text-center py-3 px-4">1,000/mo</td>
                    <td className="text-center py-3 px-4 bg-[#00d9ff]/5 text-green-500 font-bold">Unlimited</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Same price. Way more features. It's a no-brainer.
              </p>
              <Button
                size="lg"
                className="bg-[#00d9ff] hover:bg-[#00b8e6] text-[#0a0e27] font-semibold"
                onClick={() => onNavigate("auth")}
              >
                Start Your Free Trial
              </Button>
            </div>
          </GlassmorphismCard>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I really try it free for 14 days?",
                a: "Yes! All plans include a 14-day free trial. No credit card required. Cancel anytime."
              },
              {
                q: "What happens after I exceed my call limit?",
                a: "Starter: $0.25/call. Professional: $0.15/call. Elite: Unlimited - no overage charges!"
              },
              {
                q: "How does Voice Cloning work?",
                a: "Record 30 seconds of your voice, and our AI creates a perfect clone. Customers think they're talking to you personally. Only available in Elite plan."
              },
              {
                q: "What's the AI Conversation Intelligence feature?",
                a: "Real-time sentiment analysis, objection detection, urgency scoring, and smart escalation. Avery knows when to close deals and when to loop you in. Elite only."
              },
              {
                q: "Can I upgrade or downgrade anytime?",
                a: "Absolutely! Change plans anytime with no penalties. You'll be charged the prorated difference."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes! If you're not satisfied within the first 30 days, we'll refund 100% - no questions asked."
              }
            ].map((faq, index) => (
              <GlassmorphismCard key={index} className="p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </GlassmorphismCard>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <GlassmorphismCard className="p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Never Miss a Call Again?</h2>
            <p className="text-muted-foreground mb-8">
              Join 10,000+ businesses using Avery to capture every opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90"
                onClick={() => onNavigate("auth")}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("demo")}
              >
                Watch Demo
              </Button>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
}
