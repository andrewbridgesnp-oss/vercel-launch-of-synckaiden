import { Phone, Calendar, Send, CreditCard, Package, TrendingUp, Users, Music, Mic, QrCode, Shield, Lock, FileText, Eye } from "lucide-react";
import { Button } from "../components/ui/button";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";

interface MarketingPageProps {
  onNavigate: (page: string) => void;
}

export function MarketingPage({ onNavigate }: MarketingPageProps) {
  const features = [
    { icon: Phone, title: "24/7 Phone Answering", description: "Never miss a call again. Avery answers professionally around the clock." },
    { icon: Calendar, title: "Smart Scheduling", description: "Intelligent appointment booking that respects your availability and rules." },
    { icon: Send, title: "Automated Follow-ups", description: "Send confirmations, reminders, and payment links automatically." },
    { icon: CreditCard, title: "Secure Payment Links", description: "Collect deposits and payments seamlessly through secure links." },
    { icon: Package, title: "Inventory Tracking", description: "Keep track of products and services in real-time." },
    { icon: TrendingUp, title: "Vendor Deal Finder", description: "Find the best deals from your vendors automatically." },
    { icon: Users, title: "Team Tools", description: "Collaborate efficiently with built-in team management." },
    { icon: Music, title: "Ambient Music", description: "Professional hold music and ambiance for callers." },
    { icon: Mic, title: "Voice Commands", description: "Control Avery with natural voice interactions." },
    { icon: QrCode, title: "Visitor QR Codes", description: "Quick check-ins for visitors with QR code scanning." }
  ];

  const stats = [
    { label: "Calls Answered", value: "10,000+" },
    { label: "Appointments Booked", value: "5,000+" },
    { label: "Revenue Captured", value: "$2.5M+" }
  ];

  const trustFeatures = [
    { icon: FileText, title: "Call Logging", description: "Every interaction is recorded and accessible" },
    { icon: Lock, title: "Permission-Based Actions", description: "You control what Avery can and cannot do" },
    { icon: Shield, title: "Secure Payments", description: "Bank-grade encryption for all transactions" },
    { icon: Eye, title: "Data Privacy", description: "Your data is private and never shared" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent">
            Avery — Your 24/7 AI Receptionist
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Avery answers calls, books appointments, sends follow-ups, and collects payments automatically — so your business never misses an opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onNavigate("auth")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => onNavigate("interactive-demo")}
            >
              Try Interactive Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => onNavigate("demo")}
            >
              Watch Video Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Results Band */}
      <div className="bg-primary/10 backdrop-blur-sm border-y border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-accent mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Everything Your Business Needs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassmorphismCard key={index} className="p-6 group">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </GlassmorphismCard>
          ))}
        </div>
      </div>

      {/* Security & Trust Section */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Built on Trust & Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24 text-center">
        <GlassmorphismCard className="p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of businesses using Avery to capture every opportunity.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => onNavigate("pricing")}
          >
            View Pricing
          </Button>
        </GlassmorphismCard>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Avery AI Receptionist. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button onClick={() => onNavigate("legal")} className="text-muted-foreground hover:text-foreground">
                Terms
              </button>
              <button onClick={() => onNavigate("legal")} className="text-muted-foreground hover:text-foreground">
                Privacy
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
            Avery provides automated assistance based on business-defined rules. Avery does not provide legal, medical, or financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
