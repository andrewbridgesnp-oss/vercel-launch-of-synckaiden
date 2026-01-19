import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { ArrowRight, ShoppingBag, Briefcase, Globe } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const backgroundVideos = [
    "/kaiden-bg-1.mp4",
    "/kaiden-bg-2.mp4",
    "/kaiden-bg-3.mp4",
    "/kaiden-bg-4.mp4",
    "/kaiden-bg-5.mp4",
    "/kaiden-bg-6.mp4", // Added video 9 from uploads
  ];

  useEffect(() => {
    document.title = "Synckaiden - Premium Digital Marketplace & AI Business Suite";
    
    // Rotate background videos every 10 seconds
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % backgroundVideos.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const isAuthenticated = false;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Rotating Background Videos - SLOWED TO 0.5x */}
      {backgroundVideos.map((video, index) => (
        <video
          key={video}
          autoPlay
          loop
          muted
          playsInline
          style={{ playbackRate: 0.5 }}
          onLoadedMetadata={(e) => {
            const videoElement = e.currentTarget;
            videoElement.playbackRate = 0.3; // Slow down to 30% speed
          }}
          className={`fixed inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
            index === currentVideoIndex ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>
      ))}
      
      {/* Dark Overlay for Readability */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1]" />

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Navigation with Liquid Glass Effect */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/personality-sync">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  {/* Rose Gold Kaiden Logo - Links to Chat */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                    <img 
                      src="/kaiden-logo-ribbons.png" 
                      alt="Kaiden" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-2xl font-bold text-white drop-shadow-lg">Synckaiden</span>
                </div>
              </Link>

              <div className="flex items-center space-x-4">
                {/* Premium Apps Button */}
                <Link href="/premium-apps">
                  <button className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-2xl transition-all border border-white/30 hover:border-white/40 shadow-2xl hover:shadow-amber-500/40 hover:scale-105 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative text-sm font-semibold bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">Premium Apps ✨</span>
                  </button>
                </Link>
                
                {/* Spotify Button */}
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl transition-all border border-white/20 hover:border-white/30 shadow-lg hover:shadow-green-500/20">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    <span className="text-sm font-medium text-green-300">Spotify</span>
                  </button>
                </a>
              
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-xl">Dashboard</Button>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 backdrop-blur-xl flex items-center justify-center border border-amber-400/30">
                        <span className="text-sm font-semibold text-amber-400">U</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <a href={getLoginUrl()}>
                      <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-xl">Sign In</Button>
                    </a>
                    <a href={getLoginUrl()}>
                      <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-amber-500/30 text-white">
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

        {/* Hero Section - Simplified */}
        <section className="min-h-screen flex items-center justify-center pt-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow-lg backdrop-blur-sm bg-black/20 px-8 py-4 rounded-2xl border border-white/10">
                Premium digital products, AI-powered business tools, and professional website hosting—all in one luxurious platform.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                  <span>Cancel anytime</span>
                </div>
              </div>

              <a href={getLoginUrl()}>
                <Button size="lg" className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-white/20 shadow-2xl hover:shadow-white/30 text-white text-lg px-12 py-6 rounded-2xl transition-all hover:scale-105">
                  Start Your Empire
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Three Pillars Section with Liquid Glass Cards */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Three Pillars of Success</h2>
              <p className="text-xl text-white/80 backdrop-blur-sm">Everything you need to build, grow, and scale your digital empire</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Bougie Boutique */}
              <Link href="/boutique">
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl hover:shadow-pink-500/30 transition-all hover:scale-105 p-8 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      {/* Bougie Boutique Logo Video */}
                      <div className="mb-6 flex justify-center">
                        <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg">
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="/bougie-logo.mp4" type="video/mp4" />
                          </video>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Bougie Boutique</h3>
                      <p className="text-white/80 mb-6 leading-relaxed">
                        Premium mental health awareness apparel for kids, men, women, plus hats and stickers. Every purchase supports mental wellness programs.
                      </p>
                      <div className="flex items-center text-pink-300 font-semibold group-hover:text-pink-200 transition-colors">
                        <span>Shop Collections</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Executive Suite */}
              <Link href="/apps">
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl hover:shadow-cyan-500/30 transition-all hover:scale-105 p-8 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      {/* Kaiden Icon Video 2 */}
                      <div className="mb-6 flex justify-center">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg">
                          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                            <source src="/kaiden-icon-2.mp4" type="video/mp4" />
                          </video>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Executive Suite</h3>
                      <p className="text-white/80 mb-6 leading-relaxed">
                        66 AI-powered business applications covering finance, productivity, marketing, and operations. Your complete business command center.
                      </p>
                      <div className="flex items-center text-cyan-300 font-semibold group-hover:text-cyan-200 transition-colors">
                        <span>Explore Apps</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Synced Sites by Kaiden */}
              <Link href="/cox-and-co">
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl hover:shadow-amber-500/30 transition-all hover:scale-105 p-8 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      {/* Kaiden Icon Video 3 */}
                      <div className="mb-6 flex justify-center">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg">
                          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                            <source src="/kaiden-icon-3.mp4" type="video/mp4" />
                          </video>
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Synced Sites by Kaiden</h3>
                      <p className="text-white/80 mb-6 leading-relaxed">
                        Professional website hosting and development services. From concept to launch, we build your digital presence with luxury and precision.
                      </p>
                      <div className="flex items-center text-amber-300 font-semibold group-hover:text-amber-200 transition-colors">
                        <span>View Services</span>
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - MOVED TO BOTTOM with Toroidal Background */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/30 shadow-2xl p-16 text-center">
              {/* Toroidal Sphere Background */}
              <div className="absolute inset-0 opacity-30">
                <img 
                  src="/kaiden-toroid.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-purple-500/30" />
              
              <div className="relative z-10">
                <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Ready to Build Your Empire?</h2>
                <p className="text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
                  Join thousands of entrepreneurs leveraging Synckaiden's premium ecosystem
                </p>
                <p className="text-lg text-white/80 mb-8 font-semibold">
                  3-Day Limited Free Trial
                </p>
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white text-lg px-12 py-6 rounded-2xl shadow-2xl hover:shadow-white/30 transition-all hover:scale-105">
                    Start Free Trial
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-black/40 backdrop-blur-xl border-t border-white/10">
          <div className="container mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-4 shadow-lg">
              <span className="text-white/90 text-sm font-medium">Premium Digital Ecosystem</span>
            </div>
            <p className="text-white/60">© 2026 Synckaiden. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
