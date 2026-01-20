import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the House Hack 203K app
const HouseHackApp = lazy(() => import('./house-hack/app/App'));

export default function HouseHack() {
  return (
    <PlatformAccessGate platformSlug="ecommerce-marketplace">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading KAIDEN House Hack 203K...</div>
              <div className="text-muted-foreground">E-Commerce & Marketplace</div>
            </div>
          </div>
        }>
          <HouseHackApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
