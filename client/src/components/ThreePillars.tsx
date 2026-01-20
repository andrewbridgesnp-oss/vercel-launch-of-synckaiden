import { Link } from "wouter";
import { Sparkles, Store, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThreePillars() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Three Pillars of Success
        </h2>
        <p className="text-xl text-gray-400">
          Everything you need to build, grow, and scale your digital empire
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Pillar 1: E-Commerce (Bougie Boutique) */}
        <Link href="/bougie-boutique">
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Store className="w-8 h-8 text-pink-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">
                Bougie Boutique
              </h3>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Premium mental health awareness apparel for kids, men, women, plus hats and stickers. Every purchase supports mental wellness programs.
              </p>
              
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold"
              >
                Shop Collections
              </Button>
            </div>
          </div>
        </Link>

        {/* Pillar 2: GATE 8 (The 8 Platforms) */}
        <Link href="/gate-8">
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">
                GATE 8
              </h3>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                8 powerful business platforms covering AI, sales, finance, operations, HR, e-commerce, customer experience, and professional services. Your complete business command center.
              </p>
              
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
              >
                Explore Platforms
              </Button>
            </div>
          </div>
        </Link>

        {/* Pillar 3: Synced Sites by Kaiden */}
        <Link href="/synced-sites">
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">
                Synced Sites by Kaiden
              </h3>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Professional website hosting and development services. From concept to launch, we build your digital presence with luxury and precision.
              </p>
              
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold"
              >
                View Services
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
