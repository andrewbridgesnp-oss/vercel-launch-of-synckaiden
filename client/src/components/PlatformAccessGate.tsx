import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';

interface PlatformAccessGateProps {
  platformSlug: string;
  children: React.ReactNode;
}

export default function PlatformAccessGate({ platformSlug, children }: PlatformAccessGateProps) {
  const [, setLocation] = useLocation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<any>(null);

  useEffect(() => {
    checkAccess();
  }, [platformSlug]);

  async function checkAccess() {
    try {
      // Check if user has access to this platform
      const response = await fetch(`/api/platforms/${platformSlug}/access`, {
        credentials: 'include',
      });
      
      const data = await response.json();
      setHasAccess(data.hasAccess);

      // Get platform details
      const platformsResponse = await fetch('/api/platforms');
      const platforms = await platformsResponse.json();
      const currentPlatform = platforms.find((p: any) => p.slug === platformSlug);
      setPlatform(currentPlatform);
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking access:', error);
      setLoading(false);
      setHasAccess(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show subscription prompt
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <Card className="max-w-2xl w-full bg-white/10 backdrop-blur-xl border-white/20 p-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            {platform?.name || 'Premium Platform'}
          </h2>
          
          <p className="text-white/80 text-lg mb-6">
            {platform?.description || 'This platform requires an active subscription to access.'}
          </p>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 mb-8 border border-white/10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  ${platform?.price_pro || '39.99'}
                </div>
                <div className="text-white/60 text-sm">per month</div>
              </div>
              <div className="text-white/40">or</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  ${platform?.price_enterprise || '99.99'}
                </div>
                <div className="text-white/60 text-sm">Enterprise</div>
              </div>
            </div>
            
            <div className="text-white/70 text-sm">
              <Sparkles className="w-4 h-4 inline mr-2" />
              {platform?.app_count || 0} powerful apps included
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setLocation('/gate-8')}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              View All Platforms
            </Button>
            <Button
              onClick={() => setLocation(`/gate-8?subscribe=${platformSlug}`)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
