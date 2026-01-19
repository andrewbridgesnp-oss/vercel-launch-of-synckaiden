import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, Sparkles, ShoppingBag, Briefcase, Globe, Check } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Synckaiden - Premium Digital Marketplace & AI Business Suite";
  }, []);
  
  const isAuthenticated = false; // Simplified - auth not yet configured

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Synckaiden</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-slate-300 hover:text-white">Dashboard</Button>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-amber-500">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button variant="ghost" className="text-slate-300 hover:text-white">Sign In</Button>
                  </a>
                  <a href={getLoginUrl()}>
                    <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920')] bg-cover bg-center opacity-5" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">Premium Digital Ecosystem</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Your Complete
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Digital Empire
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Premium digital products, AI-powered business tools, and professional website hosting—all in one luxurious platform.
            </p>

            <div className="flex flex-wrap gap-6 justify-center mb-16">
              <div className="flex items-center gap-2 text-slate-400">
                <Check className="w-5 h-5 text-amber-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Check className="w-5 h-5 text-amber-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Check className="w-5 h-5 text-amber-500" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Section Storefront */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Bougie Boutique */}
            <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-300 overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Bougie Boutique</h2>
                <p className="text-slate-400 mb-6">
                  Premium mental health awareness apparel. Two collections supporting youth and men's mental wellness.
                </p>
                <div className="space-y-3">
                  <Link href="/boutique">
                    <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                      Children's Collection
                    </Button>
                  </Link>
                  <Link href="/sigma-strength">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      Men's Collection
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Executive Suite */}
            <Link href="/pricing">
              <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-2xl p-8 hover:border-amber-500 transition-all duration-300 cursor-pointer overflow-hidden h-full">
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-4 py-1 text-sm font-bold">
                  FEATURED
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Executive Suite</h2>
                  <p className="text-slate-400 mb-6">
                    66 AI-powered business applications for automation, analytics, marketing, finance, and operations. Starting at $0.99/mo.
                  </p>
                  <div className="flex items-center text-amber-500 font-semibold group-hover:translate-x-2 transition-transform">
                    Explore Apps <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Kaiden Builds */}
            <Link href="/coxandco">
              <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-300 cursor-pointer overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Kaiden Builds</h2>
                  <p className="text-slate-400 mb-6">
                    Professional website hosting and development. Let AI build your perfect site with luxury design and premium features.
                  </p>
                  <div className="flex items-center text-amber-500 font-semibold group-hover:translate-x-2 transition-transform">
                    View Showcase <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-12">Trusted by Modern Entrepreneurs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-500 mb-2">66</div>
                <div className="text-slate-400">AI-Powered Apps</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-500 mb-2">$0.99</div>
                <div className="text-slate-400">Starting Price</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-500 mb-2">24/7</div>
                <div className="text-slate-400">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-lg px-12">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Synckaiden</span>
              </div>
              <p className="text-slate-400 text-sm">
                Premium digital ecosystem for modern entrepreneurs.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/store" className="hover:text-amber-500">Bougie Boutique</Link></li>
                <li><Link href="/pricing" className="hover:text-amber-500">Executive Suite</Link></li>
                <li><Link href="/coxandco" className="hover:text-amber-500">Kaiden Builds</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/contact" className="hover:text-amber-500">Contact</Link></li>
                <li><Link href="/request-app" className="hover:text-amber-500">Request App</Link></li>
                <li><Link href="/chat" className="hover:text-amber-500">Talk to Kaiden</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/privacy" className="hover:text-amber-500">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-amber-500">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>© 2026 Synckaiden. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
