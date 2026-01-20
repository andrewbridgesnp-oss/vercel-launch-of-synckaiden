import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the Marketing OS app
const MarketingOSApp = lazy(() => import('./marketing-os/app/App'));

export default function MarketingOS() {
  return (
    <PlatformAccessGate platformSlug="sales-marketing-command">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading Kaiden Marketing OS...</div>
              <div className="text-muted-foreground">Sales & Marketing Command Center</div>
            </div>
          </div>
        }>
          <MarketingOSApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
