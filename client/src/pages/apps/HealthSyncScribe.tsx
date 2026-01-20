import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the HealthSync Scribe app
const HealthSyncScribeApp = lazy(() => import('./healthsync-scribe/app/App'));

export default function HealthSyncScribe() {
  return (
    <PlatformAccessGate platformSlug="customer-experience-suite">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading HealthSync Scribe...</div>
              <div className="text-muted-foreground">Customer Experience Suite</div>
            </div>
          </div>
        }>
          <HealthSyncScribeApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
