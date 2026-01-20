import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the Reality Sync app
const RealitySyncApp = lazy(() => import('./reality-sync/app/App'));

export default function RealitySync() {
  return (
    <PlatformAccessGate platformSlug="professional-services-suite">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading Reality Sync...</div>
              <div className="text-muted-foreground">Professional Services Suite</div>
            </div>
          </div>
        }>
          <RealitySyncApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
