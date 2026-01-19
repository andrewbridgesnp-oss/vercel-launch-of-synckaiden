import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, SkipForward, CheckCircle } from "lucide-react";

interface WalkthroughVideoProps {
  onComplete: () => void;
}

export function WalkthroughVideo({ onComplete }: WalkthroughVideoProps) {
  const [videoWatched, setVideoWatched] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-gradient-to-br from-gray-900 to-black border-cyan-500/30 p-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Quick Walkthrough
          </h2>
          <p className="text-gray-400">
            Learn how to use KAIDEN in 2 minutes
          </p>
        </div>

        {/* Video Player */}
        <div className="mb-8 rounded-xl overflow-hidden border border-cyan-500/30 bg-black/50">
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            <video
              className="w-full h-full"
              controls
              onEnded={() => setVideoWatched(true)}
              src="/kaiden-walkthrough.mp4"
            >
              <source src="/kaiden-walkthrough.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">What You'll Learn</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyan-400 text-sm font-semibold">1</span>
              </div>
              <p className="text-gray-300">How to navigate the dashboard and access your 347 capabilities</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyan-400 text-sm font-semibold">2</span>
              </div>
              <p className="text-gray-300">How to create and approve automated workflows</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyan-400 text-sm font-semibold">3</span>
              </div>
              <p className="text-gray-300">How to chat with KAIDEN and get instant business insights</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-cyan-400 text-sm font-semibold">4</span>
              </div>
              <p className="text-gray-300">How to integrate your existing tools and services</p>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            onClick={onComplete}
            className="flex-1 py-6 text-lg"
            style={{
              background: videoWatched
                ? "linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)"
                : "linear-gradient(135deg, #4b5563 0%, #374151 100%)",
              color: videoWatched ? "#000" : "#9ca3af",
            }}
            disabled={!videoWatched}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {videoWatched ? "Continue to Dashboard" : "Watch video to continue"}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={onComplete}
            className="sm:w-auto py-6 text-lg border-gray-600 hover:bg-gray-800"
          >
            <SkipForward className="w-5 h-5 mr-2" />
            Skip for Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
