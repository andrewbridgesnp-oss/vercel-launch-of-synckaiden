import { TrendingUp, Users, DollarSign, Target, Zap, Clock } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { Button } from "../components/ui/button";

export function InvestorPage() {
  const metrics = [
    { label: "Active Businesses", value: "2,500+", change: "+156% YoY" },
    { label: "Monthly Calls Handled", value: "500K+", change: "+203% YoY" },
    { label: "Revenue Captured", value: "$125M+", change: "+187% YoY" },
    { label: "Customer Satisfaction", value: "4.8/5", change: "94% rating" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          Investment Opportunity
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
          Avery AI Receptionist
        </h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
          Transforming how small businesses capture revenue by never missing another opportunity
        </p>
      </div>

      {/* Problem */}
      <GlassmorphismCard className="p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">The Problem</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Small businesses lose <span className="text-foreground font-semibold">$75 billion annually</span> to missed calls and poor phone management.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>62% of calls to small businesses go unanswered</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>80% of callers won't leave a voicemail and never call back</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Average business loses $25K-$150K per year in missed revenue</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Hiring a receptionist costs $35K-$50K annually + benefits</span>
              </li>
            </ul>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Solution */}
      <GlassmorphismCard className="p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">The Solution</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Avery is an AI-powered receptionist that answers every call, books appointments, sends follow-ups, 
              and collects payments automatically — for <span className="text-foreground font-semibold">1/20th the cost</span> of hiring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                { title: "24/7 Availability", desc: "Never miss a call, even outside business hours" },
                { title: "Instant Setup", desc: "Operational in under 5 minutes" },
                { title: "Revenue Generation", desc: "Actively books appointments and collects payments" }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassmorphismCard>

      {/* How It Works */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Connect", desc: "Business adds their phone number to Avery" },
            { step: "2", title: "Configure", desc: "Set services, hours, and booking rules" },
            { step: "3", title: "Capture", desc: "Avery handles calls, books, and collects payments" }
          ].map((item, i) => (
            <GlassmorphismCard key={i} className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </GlassmorphismCard>
          ))}
        </div>
      </div>

      {/* Traction */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Traction</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <GlassmorphismCard key={i} className="p-6 text-center">
              <p className="text-3xl font-bold mb-2 text-accent">{metric.value}</p>
              <p className="font-medium mb-1">{metric.label}</p>
              <p className="text-sm text-green-500">{metric.change}</p>
            </GlassmorphismCard>
          ))}
        </div>
      </div>

      {/* Revenue Model */}
      <GlassmorphismCard className="p-8">
        <h2 className="text-2xl font-bold mb-6">Revenue Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-bold mb-2">$79/mo</h3>
            <p className="text-muted-foreground mb-4">Starter Plan</p>
            <p className="text-sm text-muted-foreground">Entry point for small businesses</p>
          </div>
          <div className="p-6 bg-accent/10 border-2 border-accent/50 rounded-lg">
            <h3 className="text-xl font-bold mb-2">$199/mo</h3>
            <p className="text-muted-foreground mb-4">Professional Plan</p>
            <p className="text-sm text-muted-foreground">60% of customers — highest margin</p>
          </div>
          <div className="p-6 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Custom</h3>
            <p className="text-muted-foreground mb-4">Enterprise</p>
            <p className="text-sm text-muted-foreground">Multi-location businesses</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Average Revenue Per User (ARPU)</span>
            <span className="text-2xl font-bold">$164/mo</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-muted-foreground">Customer Lifetime Value (LTV)</span>
            <span className="text-2xl font-bold">$5,900</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-muted-foreground">Customer Acquisition Cost (CAC)</span>
            <span className="text-2xl font-bold">$450</span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <span className="font-semibold">LTV:CAC Ratio</span>
            <span className="text-2xl font-bold text-green-500">13.1x</span>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Market Size */}
      <GlassmorphismCard className="p-8">
        <h2 className="text-2xl font-bold mb-6">Market Opportunity</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
            <span>Total Addressable Market (TAM)</span>
            <span className="text-xl font-bold">$24.5B</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
            <span>Serviceable Available Market (SAM)</span>
            <span className="text-xl font-bold">$8.2B</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
            <span>Serviceable Obtainable Market (SOM)</span>
            <span className="text-xl font-bold">$410M</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          33M small businesses in the US alone. Growing at 12% annually. Editable values for pitch customization.
        </p>
      </GlassmorphismCard>

      {/* Why Now */}
      <GlassmorphismCard className="p-8">
        <h2 className="text-2xl font-bold mb-6">Why Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Clock, title: "AI Breakthrough", desc: "Voice AI has reached human-level quality in 2025-2026" },
            { icon: DollarSign, title: "Economic Pressure", desc: "Businesses cutting costs but can't afford to lose customers" },
            { icon: Users, title: "Remote Work", desc: "Traditional reception desks becoming obsolete" },
            { icon: TrendingUp, title: "Digital Payments", desc: "Contactless payment adoption at all-time high" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* CTA */}
      <div className="text-center">
        <GlassmorphismCard className="p-12">
          <h2 className="text-3xl font-bold mb-4">Let's Talk</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Avery is disrupting the $24.5B business phone management market. Join us in helping millions 
            of businesses capture every opportunity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Request Investment Deck
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Schedule Meeting
            </Button>
          </div>
        </GlassmorphismCard>
      </div>
    </div>
  );
}
