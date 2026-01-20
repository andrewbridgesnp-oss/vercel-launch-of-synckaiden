// KAIDEN CAPITAL™ - Welcome Screen

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Sparkles,
  Target,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0d1f] via-[#1a2133] to-[#0a0d1f] text-white overflow-auto">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
              KAIDEN <span className="kaiden-gradient-text">CAPITAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-2">Capital Operating System™</p>
            <p className="text-lg text-gray-400">
              Broker-grade funding intelligence + Fastest legitimate path to capital
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg"
            >
              Get Started - Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-500 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              Watch Demo
            </Button>
          </div>

          <p className="text-sm text-gray-400">
            ✨ No credit card required • 7-minute setup • Instant funding map
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="kaiden-glass-card border-0 text-white">
            <CardContent className="pt-6">
              <div className="p-3 bg-blue-500/20 w-fit rounded-lg mb-4">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ranked Funding Map</h3>
              <p className="text-gray-300">
                AI-powered recommendations ranked by Approval Probability × Speed × Net Cost. 
                See your best options instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="kaiden-glass-card border-0 text-white">
            <CardContent className="pt-6">
              <div className="p-3 bg-green-500/20 w-fit rounded-lg mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fix-First Readiness</h3>
              <p className="text-gray-300">
                Don't waste time on bad applications. Get a readiness score and action plan 
                before you apply.
              </p>
            </CardContent>
          </Card>

          <Card className="kaiden-glass-card border-0 text-white">
            <CardContent className="pt-6">
              <div className="p-3 bg-purple-500/20 w-fit rounded-lg mb-4">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Path Services</h3>
              <p className="text-gray-300">
                Professional concierge services to package, optimize, and submit your 
                applications for maximum success.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Everything You Need to Get Funded
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Intelligent Routing',
                description: 'Graph-based decision engine matches you to the right lenders based on your exact profile.',
              },
              {
                icon: Shield,
                title: 'Trust-First Security',
                description: 'Passkey authentication, verified identity, and capability gating protect every action.',
              },
              {
                icon: Target,
                title: 'Specialized Engines',
                description: 'SBA, Real Estate, and Creator tracks with industry-specific calculators and tools.',
              },
              {
                icon: CheckCircle2,
                title: 'No False Promises',
                description: 'Conservative, transparent approach. We show you real approval odds and next steps.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors">
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-[#1a2133]"
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">Join 1,247+ funded businesses</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">$127M+</p>
              <p className="text-sm">Capital Facilitated</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">71%</p>
              <p className="text-sm">Avg Approval Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">2.3 days</p>
              <p className="text-sm">Avg Time to Decision</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="kaiden-glass-card border-2 border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Find Your Funding?</h2>
              <p className="text-gray-300 mb-6">
                Complete our 7-minute intake and get your personalized Funding Map with 
                ranked recommendations based on your exact situation.
              </p>
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg"
              >
                Start Your Funding Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-xs text-gray-400 mt-4">
                No guarantees of funding • All decisions made by independent lenders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          <p>© 2026 Kaiden Capital™ • All Rights Reserved</p>
          <p className="mt-2">
            Professional funding intelligence platform • Not a lender
          </p>
        </div>
      </div>
    </div>
  );
};
