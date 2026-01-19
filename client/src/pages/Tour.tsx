import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Play } from "lucide-react";

export default function Tour() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">KAIDEN Tour</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Main Tour Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(0,217,255,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            See KAIDEN in Action
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Watch how KAIDEN transforms your business with approval-gated automation, real-time intelligence, and human-centered control.
          </p>
        </div>

        {/* Main Tour Video */}
        <div className="mb-16 rounded-xl overflow-hidden border border-cyan-500/30 bg-black/50">
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            {!videoPlaying ? (
              <button
                onClick={() => setVideoPlaying(true)}
                className="relative z-10 flex items-center justify-center w-full h-full hover:bg-black/40 transition"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                  <p className="text-lg font-semibold">Play Full Tour (5 min)</p>
                </div>
              </button>
            ) : (
              <video
                className="w-full h-full"
                controls
                autoPlay
                src="/kaiden-tour-video.mp4"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Approval-Gated Automation</h3>
            <p className="text-gray-300 mb-4">
              Every workflow requires human approval before execution. You stay in control. No autonomous decisions that could harm your business.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Multi-step approval chains</li>
              <li>✓ Conditional approvals</li>
              <li>✓ Full audit trail</li>
              <li>✓ Rollback capability</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">Real-Time Intelligence</h3>
            <p className="text-gray-300 mb-4">
              AI-powered insights that predict outcomes, identify opportunities, and alert you to problems before they happen.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Predictive analytics</li>
              <li>✓ Anomaly detection</li>
              <li>✓ Natural language queries</li>
              <li>✓ Custom dashboards</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-green-400">Time Restoration</h3>
            <p className="text-gray-300 mb-4">
              Eliminate joyless, repetitive tasks. KAIDEN handles the busywork so you can focus on strategic decisions.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ 280+ pre-built capabilities</li>
              <li>✓ Workflow automation</li>
              <li>✓ Intelligent routing</li>
              <li>✓ Batch processing</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-orange-400">All-in-One Platform</h3>
            <p className="text-gray-300 mb-4">
              CRM, Finance, Marketing, Operations, Analytics—everything you need in one place. No tool switching. No data silos.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ 27 business modules</li>
              <li>✓ Unified data</li>
              <li>✓ Integrated workflows</li>
              <li>✓ 60% cheaper than HubSpot</li>
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">How Businesses Use KAIDEN</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-semibold mb-2">Sales Teams</h4>
              <p className="text-gray-400">Auto-route leads, score prospects, send follow-ups—all with approval gates. Close deals 3x faster.</p>
            </div>

            <div className="bg-black/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-semibold mb-2">Finance Teams</h4>
              <p className="text-gray-400">Invoice automation, expense tracking, tax optimization. Reduce accounting time by 70%.</p>
            </div>

            <div className="bg-black/50 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold mb-2">Marketing Teams</h4>
              <p className="text-gray-400">Campaign automation, content generation, social scheduling. Launch campaigns in minutes.</p>
            </div>
          </div>
        </div>

        {/* High-Revenue Capability Previews */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">High-Impact Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500 transition">
              <h4 className="text-xl font-semibold mb-2 text-cyan-400">💼 LLC Formation</h4>
              <p className="text-gray-400 mb-4">Automated business entity setup with state filing, EIN acquisition, and compliance documentation.</p>
              <p className="text-sm text-gray-500">Revenue Impact: $500-2,000 per formation</p>
            </div>

            <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500 transition">
              <h4 className="text-xl font-semibold mb-2 text-purple-400">📊 Grant Writing</h4>
              <p className="text-gray-400 mb-4">AI-powered grant proposal generation with compliance checking and submission tracking.</p>
              <p className="text-sm text-gray-500">Revenue Impact: $1,000-10,000 per grant</p>
            </div>

            <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 hover:border-green-500 transition">
              <h4 className="text-xl font-semibold mb-2 text-green-400">🎥 YouTube Channel Setup</h4>
              <p className="text-gray-400 mb-4">Complete channel creation, branding, SEO optimization, and content strategy planning.</p>
              <p className="text-sm text-gray-500">Revenue Impact: $500-3,000 per setup</p>
            </div>

            <div className="bg-black/50 border border-orange-500/30 rounded-lg p-6 hover:border-orange-500 transition">
              <h4 className="text-xl font-semibold mb-2 text-orange-400">🛒 E-Commerce Store Launch</h4>
              <p className="text-gray-400 mb-4">Full dropshipping setup with Shopify integration, product sourcing, and payment processing.</p>
              <p className="text-sm text-gray-500">Revenue Impact: $1,000-5,000 per store</p>
            </div>

            <div className="bg-black/50 border border-blue-500/30 rounded-lg p-6 hover:border-blue-500 transition">
              <h4 className="text-xl font-semibold mb-2 text-blue-400">⚖️ Trust Formation</h4>
              <p className="text-gray-400 mb-4">Dynasty trust creation for generational wealth protection and tax optimization.</p>
              <p className="text-sm text-gray-500">Revenue Impact: $2,000-10,000 per trust</p>
            </div>

            <div className="bg-black/50 border border-pink-500/30 rounded-lg p-6 hover:border-pink-500 transition">
              <h4 className="text-xl font-semibold mb-2 text-pink-400">🏥 Medical Billing</h4>
              <p className="text-gray-400 mb-4">Automated insurance claims processing, denial management, and revenue cycle optimization.</p>
              <p className="text-sm text-gray-500">Revenue Impact: $500-2,000/month per practice</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/capabilities">
              <Button size="lg" className="px-12 py-7 text-lg font-semibold rounded-full"
                style={{
                  background: "linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)",
                  color: "#000",
                  boxShadow: "0 0 30px rgba(0,217,255,0.4)",
                }}
              >
                Explore All 347 Capabilities →
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-16 border-t border-gray-700">
          <h3 className="text-3xl font-bold mb-4">Ready to Restore Your Time?</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Try KAIDEN free for 1 day ($0.99) or 1 week ($3.99). No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trial?plan=day">
              <Button size="lg" className="px-12 py-7 text-lg font-semibold rounded-full"
                style={{
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "#000",
                }}
              >
                Try 1 Day - $0.99
              </Button>
            </Link>
            <Link href="/trial?plan=week">
              <Button size="lg" className="px-12 py-7 text-lg font-semibold rounded-full"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#fff",
                }}
              >
                Try 1 Week - $3.99
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
