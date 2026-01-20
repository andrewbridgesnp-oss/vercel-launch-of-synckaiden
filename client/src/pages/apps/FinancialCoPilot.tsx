import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the Financial Co-Pilot app
const FinancialCoPilotApp = lazy(() => import('./financial-copilot/app/App'));

export default function FinancialCoPilot() {
  return (
    <PlatformAccessGate platformSlug="financial-command-center">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading Financial Co-Pilot...</div>
              <div className="text-muted-foreground">Financial Command Center</div>
            </div>
          </div>
        }>
          <FinancialCoPilotApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
