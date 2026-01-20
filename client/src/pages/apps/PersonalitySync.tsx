import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the Personality Sync app
const PersonalitySyncApp = lazy(() => import('./personality-sync/App.jsx'));

export default function PersonalitySync() {
  return (
    <PlatformAccessGate platformSlug="ai-intelligence-suite">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading Personality Sync...</div>
              <div className="text-muted-foreground">AI Intelligence Suite</div>
            </div>
          </div>
        }>
          <PersonalitySyncApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
