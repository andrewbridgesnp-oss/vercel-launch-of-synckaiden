import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the AI Funding Brokerage app
const AIFundingApp = lazy(() => import('./ai-funding/app/App'));

export default function AIFundingBrokerage() {
  return (
    <PlatformAccessGate platformSlug="financial-command-center">
      <div className="min-h-screen bg-black">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading AI Funding Brokerage...</div>
          </div>
        }>
          <AIFundingApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
