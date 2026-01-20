import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the Social Media Auto-Pilot app
const SocialMediaAutopilotApp = lazy(() => import('./social-media/App.jsx'));

export default function SocialMediaAutopilot() {
  return (
    <PlatformAccessGate platformSlug="sales-marketing-command">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading Social Media Auto-Pilot...</div>
              <div className="text-muted-foreground">Sales & Marketing Command Center</div>
            </div>
          </div>
        }>
          <SocialMediaAutopilotApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
