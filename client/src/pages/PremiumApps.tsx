import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

const premiumApps = [
  {
    name: "Social Media Auto Pilot",
    description: "AI-powered social media management across all platforms. Schedule posts, analyze engagement, and grow your audience automatically.",
    price: "$19.99/mo",
    features: ["Multi-platform posting", "AI content generation", "Analytics dashboard", "Auto-scheduling"],
    gradient: "from-blue-500/20 to-purple-500/20",
    icon: "📱",
  },
  {
    name: "Comprehensive Tax Assistant",
    description: "Complete tax preparation and filing with AI-powered deduction finder. Maximize refunds and stay compliant effortlessly.",
    price: "$24.99/mo",
    features: ["Smart deduction finder", "E-file support", "Audit protection", "Tax strategy planning"],
    gradient: "from-green-500/20 to-emerald-500/20",
    icon: "💰",
  },
  {
    name: "Financial Co-Pilot",
    description: "Personal CFO in your pocket. Budget tracking, investment analysis, and AI-powered financial forecasting.",
    price: "$14.99/mo",
    features: ["Budget automation", "Investment tracking", "Cash flow forecasting", "Financial insights"],
    gradient: "from-amber-500/20 to-orange-500/20",
    icon: "📊",
  },
  {
    name: "Kaiden House Hack",
    description: "Real estate investment analyzer for house hacking strategies. Calculate ROI, find deals, and build wealth through property.",
    price: "$14.99/mo",
    features: ["Deal analyzer", "ROI calculator", "Market insights", "Financing options"],
    gradient: "from-rose-500/20 to-pink-500/20",
    icon: "🏠",
  },
  {
    name: "Elite Studio",
    description: "Professional video production suite with AI editing, effects, and rendering. Create studio-quality content in minutes.",
    price: "$24.99/mo",
    features: ["AI video editing", "Professional effects", "4K rendering", "Cloud storage"],
    gradient: "from-purple-500/20 to-indigo-500/20",
    icon: "🎬",
  },
  {
    name: "Content Creator",
    description: "All-in-one content creation platform. Generate blogs, videos, graphics, and social posts with AI assistance.",
    price: "$19.99/mo",
    features: ["AI writing assistant", "Image generation", "Video scripts", "SEO optimization"],
    gradient: "from-cyan-500/20 to-blue-500/20",
    icon: "✨",
  },
  {
    name: "AI Receptionist",
    description: "24/7 virtual receptionist powered by advanced AI. Handle calls, schedule appointments, and manage customer inquiries.",
    price: "$29.99/mo",
    features: ["24/7 availability", "Call handling", "Appointment scheduling", "CRM integration"],
    gradient: "from-teal-500/20 to-green-500/20",
    icon: "🤖",
  },
];

export default function PremiumApps() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10">
        {/* Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                    <img src="/kaiden-logo-ribbons.png" alt="Kaiden" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xl font-bold text-white">Synckaiden</span>
                </div>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold text-white">Premium Collection</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Elite Business Apps
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Handpicked premium applications designed for entrepreneurs, creators, and business owners who demand excellence.
            </p>
          </div>
        </section>

        {/* Premium Apps Grid */}
        <section className="pb-24 px-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumApps.map((app, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl hover:shadow-amber-500/30 transition-all hover:scale-105 p-8"
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="text-6xl mb-6">{app.icon}</div>
                    
                    {/* App Name */}
                    <h3 className="text-2xl font-bold text-white mb-3">{app.name}</h3>
                    
                    {/* Description */}
                    <p className="text-white/70 mb-6 leading-relaxed">{app.description}</p>
                    
                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {app.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-white/60">
                          <span className="mr-2 text-amber-400">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">{app.price}</span>
                      <Link href="/dashboard">
                        <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white">
                          Get Started
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-3xl border border-white/20 shadow-2xl p-16 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Elevate Your Business?
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of entrepreneurs using premium apps to scale faster and work smarter.
                </p>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 text-lg px-12 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all">
                    Start Your 3-Day Free Trial
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
