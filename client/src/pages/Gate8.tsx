import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp, DollarSign, Briefcase, Users, ShoppingCart, Headphones, Building2, Shield } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface Platform {
  id: string;
  name: string;
  price: number;
  appCount: number;
  icon: React.ReactNode;
  description: string;
  apps: string[];
  color: string;
  gradient: string;
}

const platforms: Platform[] = [
  {
    id: "ai-intelligence",
    name: "AI Intelligence Suite",
    price: 39.99,
    appCount: 5,
    icon: <Sparkles className="w-6 h-6" />,
    description: "Advanced AI capabilities for your business",
    apps: ["AI Chat", "Agent Swarm", "Content Engine", "AI Arena", "Voice Auth"],
    color: "cyan",
    gradient: "from-cyan-500/10 to-blue-500/10",
  },
  {
    id: "sales-marketing",
    name: "Sales & Marketing Command Center",
    price: 49.99,
    appCount: 13,
    icon: <TrendingUp className="w-6 h-6" />,
    description: "Complete sales and marketing automation",
    apps: ["CRM", "Marketing OS", "Social Media", "YouTube", "Email", "Video", "Website Builder", "Analytics", "Lead Generation", "Campaign Manager", "SEO Tools", "Ad Manager", "Conversion Optimizer"],
    color: "green",
    gradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    id: "financial",
    name: "Financial Command Center",
    price: 49.99,
    appCount: 8,
    icon: <DollarSign className="w-6 h-6" />,
    description: "Comprehensive financial management",
    apps: ["Financial Co-Pilot", "Tax App", "Estate Planning", "Invoicing", "Funding", "Wealth Building", "Expense Tracking", "Financial Reporting"],
    color: "yellow",
    gradient: "from-yellow-500/10 to-orange-500/10",
  },
  {
    id: "business-operations",
    name: "Business Operations Hub",
    price: 49.99,
    appCount: 10,
    icon: <Briefcase className="w-6 h-6" />,
    description: "Streamline your business operations",
    apps: ["Business Hub", "Analytics", "Project Management", "Workflows", "LLC Formation", "Document Management", "Task Automation", "Reporting", "Compliance", "Process Optimization"],
    color: "blue",
    gradient: "from-blue-500/10 to-indigo-500/10",
  },
  {
    id: "hr-people",
    name: "HR & People Management",
    price: 39.99,
    appCount: 2,
    icon: <Users className="w-6 h-6" />,
    description: "Manage your team effectively",
    apps: ["Employee OS", "Psychological Profiling (FREE with login & sync)"],
    color: "purple",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    id: "ecommerce-marketplace",
    name: "E-Commerce & Marketplace",
    price: 49.99,
    appCount: 7,
    icon: <ShoppingCart className="w-6 h-6" />,
    description: "Build and manage your online store",
    apps: ["Boutique", "Marketplace", "Inventory", "Orders", "Shopify Integration", "Product Manager", "Payment Processing"],
    color: "pink",
    gradient: "from-pink-500/10 to-rose-500/10",
  },
  {
    id: "customer-experience",
    name: "Customer Experience Suite",
    price: 39.99,
    appCount: 4,
    icon: <Headphones className="w-6 h-6" />,
    description: "Deliver exceptional customer service",
    apps: ["AI Receptionist", "Help Desk", "Live Chat", "Feedback Manager"],
    color: "teal",
    gradient: "from-teal-500/10 to-cyan-500/10",
  },
  {
    id: "professional-services",
    name: "Professional Services Suite",
    price: 49.99,
    appCount: 13,
    icon: <Building2 className="w-6 h-6" />,
    description: "Specialized tools for professionals",
    apps: ["Healthcare Scribe", "Medical Billing", "Education", "Legal", "Notary", "Community", "Consulting", "Appointment Scheduler", "Client Portal", "Documentation", "Compliance", "Reporting", "Certification"],
    color: "indigo",
    gradient: "from-indigo-500/10 to-purple-500/10",
  },
];

export default function Gate8() {
  const { isAuthenticated } = useAuth();
  const [selectedTier, setSelectedTier] = useState<"pro" | "enterprise">("pro");

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 25%, #0f1428 50%, #1a1f3a 75%, #0a0e27 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <span className="text-cyan-400 font-semibold">GATE 8</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            8 Powerful Business Platforms
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
            Your complete business command center. Choose the platforms you need, scale as you grow.
          </p>

          {/* Tier Selection */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => setSelectedTier("pro")}
              className={`px-8 py-6 text-lg font-semibold rounded-xl transition-all ${
                selectedTier === "pro"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Pro Tier
            </Button>
            <Button
              onClick={() => setSelectedTier("enterprise")}
              className={`px-8 py-6 text-lg font-semibold rounded-xl transition-all ${
                selectedTier === "enterprise"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Enterprise Tier
            </Button>
          </div>

          {/* Tier Description */}
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white/5 border border-white/10">
            {selectedTier === "pro" ? (
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro Tier</h3>
                <p className="text-gray-400">
                  Standard API call limits with all core features and integrations
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise Tier - $99.99/mo</h3>
                <p className="text-gray-400">
                  Unlimited API calls, all integrations at full capacity, priority support, and advanced features
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`group relative p-6 rounded-3xl bg-gradient-to-br ${platform.gradient} border border-${platform.color}-500/30 hover:border-${platform.color}-500/60 transition-all duration-300 hover:scale-105`}
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 bg-${platform.color}-500/20 rounded-2xl flex items-center justify-center mb-4 text-${platform.color}-400`}>
                  {platform.icon}
                </div>

                {/* Name & Price */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {platform.name}
                </h3>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-white">
                    ${selectedTier === "pro" ? platform.price.toFixed(2) : "99.99"}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>

                {/* App Count */}
                <div className="text-sm text-gray-400 mb-4">
                  {platform.appCount} apps included
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6">
                  {platform.description}
                </p>

                {/* Apps List */}
                <div className="space-y-2 mb-6">
                  {platform.apps.slice(0, 3).map((app, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>{app}</span>
                    </div>
                  ))}
                  {platform.apps.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{platform.apps.length - 3} more apps
                    </div>
                  )}
                </div>

                {/* Subscribe Button */}
                <Button
                  className={`w-full bg-gradient-to-r from-${platform.color}-500 to-${platform.color}-600 hover:from-${platform.color}-600 hover:to-${platform.color}-700 text-white font-semibold`}
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.href = "/pricing";
                    } else {
                      // Handle subscription via Stripe
                      console.log(`Subscribe to ${platform.id} - ${selectedTier}`);
                    }
                  }}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Infrastructure - FREE */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Security & Infrastructure</h3>
              <p className="text-green-400 font-semibold">FREE with any platform subscription</p>
            </div>
          </div>
          <p className="text-gray-400">
            Enterprise-grade security, infrastructure monitoring, backup systems, and compliance tools included with every platform subscription.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Start with one platform or get them all. Cancel anytime.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pricing">
            <Button
              size="lg"
              className="px-12 py-7 text-lg font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              View All Pricing
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-12 py-7 text-lg font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
