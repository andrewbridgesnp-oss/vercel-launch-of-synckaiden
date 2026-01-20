import { useState } from 'react';
import { ArrowRight, Video, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function FreeKlingVideo() {
  const [usageCount, setUsageCount] = useState(0);
  const FREE_LIMIT = 3;
  const KLING_REFERRAL_URL = 'https://pro.klingai.com/h5-app/invitation?code=7BE5X8CQJEVA';

  const handleKlingRedirect = () => {
    if (usageCount < FREE_LIMIT) {
      setUsageCount(usageCount + 1);
      window.open(KLING_REFERRAL_URL, '_blank');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/kling-background.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay for Readability */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[1]" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 bg-white/10 backdrop-blur-xl border border-white/20">
              ← Back to Home
            </Button>
          </Link>
          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
            <span className="text-white/90 text-sm font-medium">
              {FREE_LIMIT - usageCount} free generations left
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-xl border border-purple-500/30 mb-6">
              <Video className="w-5 h-5 text-purple-300" />
              <span className="text-purple-200 font-semibold">AI Video Generator</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Kling AI Video Generator
            </h1>
            <p className="text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Create stunning AI-generated videos from text prompts. Professional quality, cinematic results.
            </p>
          </div>

          {/* Video Generator Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl p-12 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            
            <div className="relative z-10">
              {usageCount < FREE_LIMIT ? (
                <div className="text-center space-y-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                        <Video className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center animate-bounce">
                        <Sparkles className="w-6 h-6 text-yellow-900" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">Ready to Create Magic?</h3>
                    <p className="text-xl text-white/70 max-w-xl mx-auto">
                      Click below to access Kling AI and start generating professional videos with AI
                    </p>
                  </div>

                  <Button
                    onClick={handleKlingRedirect}
                    size="lg"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
                  >
                    <Video className="mr-3 w-7 h-7" />
                    Generate Video with Kling AI
                    <ExternalLink className="ml-3 w-6 h-6" />
                  </Button>

                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-300 mb-2">5s-10s</div>
                      <div className="text-sm text-white/60">Video Length</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-300 mb-2">1080p</div>
                      <div className="text-sm text-white/60">HD Quality</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-300 mb-2">AI</div>
                      <div className="text-sm text-white/60">Powered</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl">
                      <Sparkles className="w-16 h-16 text-white" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">Free Limit Reached!</h3>
                    <p className="text-xl text-white/70 max-w-xl mx-auto">
                      Upgrade to AI Intelligence Suite for unlimited video generation
                    </p>
                  </div>

                  <Link href="/gate-8">
                    <Button
                      size="lg"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border-2 border-amber-400/50 text-white text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-105"
                    >
                      Unlock Unlimited Access - $39.99/mo
                      <ArrowRight className="ml-3 w-7 h-7" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h4 className="text-xl font-bold text-white mb-3">✨ Text-to-Video</h4>
              <p className="text-white/70">
                Describe your vision and watch Kling AI bring it to life with stunning visuals
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h4 className="text-xl font-bold text-white mb-3">🎬 Cinematic Quality</h4>
              <p className="text-white/70">
                Professional-grade video output with smooth motion and realistic details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
