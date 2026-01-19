import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Clock, Users, Trophy, Zap, Youtube, Play, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { getLoginUrl } from '@/const';

export default function CreativeClashLive() {
  const { isAuthenticated } = useAuth();
  const [timeToNext, setTimeToNext] = useState({ minutes: 0, seconds: 0 });
  const [sessionStatus, setSessionStatus] = useState<'LIVE' | 'OFF'>('OFF');

  // Calculate cycle time (30min ON, 60min OFF = 90min total)
  useEffect(() => {
    document.title = "Creative Clash Live - AI-Powered Writing Competition | Synckaiden";
    
    const calculateNextSession = () => {
      const now = new Date();
      const minutesSinceStart = now.getMinutes() + now.getHours() * 60;
      const cyclePosition = minutesSinceStart % 90;
      
      if (cyclePosition < 30) {
        setSessionStatus('LIVE');
        const remaining = 30 - cyclePosition;
        setTimeToNext({ 
          minutes: Math.floor(remaining), 
          seconds: 60 - now.getSeconds() 
        });
      } else {
        setSessionStatus('OFF');
        const remaining = 90 - cyclePosition;
        setTimeToNext({ 
          minutes: Math.floor(remaining), 
          seconds: 60 - now.getSeconds() 
        });
      }
    };

    calculateNextSession();
    const interval = setInterval(calculateNextSession, 1000);
    return () => clearInterval(interval);
  }, []);

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
              <Link href="/">
                <Button variant="ghost" className="text-slate-300 hover:text-white">Back to Home</Button>
              </Link>
              {!isAuthenticated && (
                <a href={getLoginUrl()}>
                  <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                    Sign In
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920')] bg-cover bg-center opacity-5" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 rounded-full px-6 py-2 mb-8">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">AI-Hosted Live Competition</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Creative Clash Live
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Write, compete, and win in our live AI-powered creative writing challenges. Stream live on Kaiden's YouTube channel every 90 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Countdown/Status Card */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <Card className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700">
            <div className="text-center space-y-6">
              {sessionStatus === 'LIVE' ? (
                <>
                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full animate-pulse shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full" />
                    <span className="font-bold text-2xl">LIVE NOW!</span>
                  </div>
                  <div className="text-7xl md:text-9xl font-black bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    {String(timeToNext.minutes).padStart(2, '0')}:{String(timeToNext.seconds).padStart(2, '0')}
                  </div>
                  <p className="text-xl text-slate-400">Time remaining in this session</p>
                  <div className="pt-6">
                    <a href="https://youtube.com/@kaidensync" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-xl px-12 py-8">
                        <Youtube className="w-6 h-6 mr-3" />
                        Watch Live on YouTube
                      </Button>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-full shadow-lg">
                    <Clock className="w-6 h-6" />
                    <span className="font-bold text-2xl">Next Session In</span>
                  </div>
                  <div className="text-7xl md:text-9xl font-black bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    {String(timeToNext.minutes).padStart(2, '0')}:{String(timeToNext.seconds).padStart(2, '0')}
                  </div>
                  <p className="text-xl text-slate-400">Live for 30 minutes every 90 minutes</p>
                  <div className="pt-6">
                    <a href="https://youtube.com/@kaidensync" target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="outline" className="text-xl px-12 py-8 border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10">
                        <Youtube className="w-6 h-6 mr-3" />
                        Subscribe for Notifications
                      </Button>
                    </a>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              How It Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">1. Join Live</h3>
                <p className="text-slate-400">
                  Join the live session when it starts. Sessions run for 30 minutes every 90 minutes, streamed live on YouTube.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">2. Create</h3>
                <p className="text-slate-400">
                  AI generates a creative writing prompt. You have limited time to write your best response and submit.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-xl flex items-center justify-center mb-6">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">3. Win</h3>
                <p className="text-slate-400">
                  AI judges all submissions in real-time. Top 10 advance to bracket-style voting. Winner gets featured!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
              Why Creative Clash Live?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">AI-Powered Judging</h3>
                  <p className="text-slate-400">Fair, instant evaluation of creativity, originality, and writing quality by advanced AI.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Live on YouTube</h3>
                  <p className="text-slate-400">Watch the competition unfold in real-time on Kaiden's YouTube channel with live commentary.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Regular Schedule</h3>
                  <p className="text-slate-400">30-minute sessions every 90 minutes means you can always catch the next round.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Win Recognition</h3>
                  <p className="text-slate-400">Winners get featured on the channel, social media, and in our Hall of Fame.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Compete?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Join the next live session and showcase your creative writing skills to the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-lg px-12">
                  <Play className="mr-2 w-5 h-5" />
                  Enter Next Round
                </Button>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-lg px-12">
                    Sign Up to Compete
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              )}
              <a href="https://youtube.com/@kaidensync" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-lg px-12 border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10">
                  <Youtube className="mr-2 w-5 h-5" />
                  Watch on YouTube
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-slate-500 text-sm">
            <p>© 2026 Synckaiden. All rights reserved.</p>
            <p className="mt-2">Part of the Executive Suite - 66 AI-Powered Business Apps</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
