import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the Pantry Inventory app
const PantryInventoryApp = lazy(() => import('./pantry/app/App'));

export default function PantryInventory() {
  return (
    <PlatformAccessGate platformSlug="business-operations-hub">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading Pantry Inventory...</div>
              <div className="text-muted-foreground">Business Operations Hub</div>
            </div>
          </div>
        }>
          <PantryInventoryApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
