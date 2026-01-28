import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the BuildWealth Pro app
const BuildWealthApp = lazy(() => import('./build-wealth/app/App'));

export default function BuildWealth() {
  return (
    <PlatformAccessGate platformSlug="financial-command-center">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading BuildWealth Pro...</div>
              <div className="text-muted-foreground">Financial Command Center</div>
            </div>
          </div>
        }>
          <BuildWealthApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
