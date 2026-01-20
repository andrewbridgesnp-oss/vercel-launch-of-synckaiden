import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Zap, Shield, Sparkles, Check } from "lucide-react";

export default function SyncedSites() {
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
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
            <span className="text-purple-400 font-semibold">SYNCED SITES BY KAIDEN</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Your Digital Presence,<br />Perfected
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
            Professional website hosting and development services. From concept to launch, we build your digital presence with luxury and precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="px-12 py-7 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              className="px-12 py-7 text-lg font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30"
            >
              View Portfolio
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Full-Service Development</h3>
            <p className="text-gray-400">
              From initial concept to final launch, we handle every aspect of your website development with meticulous attention to detail.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
            <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Kaiden Integration</h3>
            <p className="text-gray-400">
              Seamlessly sync your website with Kaiden's AI-powered business tools for automated operations and enhanced functionality.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
            <p className="text-gray-400">
              Bank-level security, SSL certificates, DDoS protection, and regular backups ensure your site is always safe and available.
            </p>
          </div>
        </div>

        {/* Service Packages */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Service Packages</h2>
          <p className="text-xl text-gray-400">Choose the perfect package for your business</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Package */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Starter</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-white">$2,999</span>
              <span className="text-gray-400">one-time</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Up to 5 pages</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Responsive design</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Basic SEO optimization</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Contact form integration</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>1 month support</span>
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold">
              Get Started
            </Button>
          </div>

          {/* Professional Package */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-2 border-purple-500/50 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Professional</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-white">$7,999</span>
              <span className="text-gray-400">one-time</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Up to 15 pages</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Custom design & branding</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Advanced SEO optimization</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Kaiden AI integration</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>E-commerce ready</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>3 months support</span>
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold">
              Get Started
            </Button>
          </div>

          {/* Enterprise Package */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Unlimited pages</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Full custom development</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Advanced integrations</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Dedicated support team</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>Priority development</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span>12 months support</span>
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Digital Empire?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Let's create something extraordinary together. Schedule a consultation today.
          </p>
          <Button
            size="lg"
            className="px-12 py-7 text-lg font-semibold rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          >
            Schedule Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
