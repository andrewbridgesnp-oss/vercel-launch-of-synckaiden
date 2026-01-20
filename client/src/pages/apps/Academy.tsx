import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the Academy app
const AcademyApp = lazy(() => import('./academy'));

export default function Academy() {
  return (
    <PlatformAccessGate platformSlug="professional-services-suite">
      <div className="min-h-screen bg-black">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading SyncKaiden Academy...</div>
          </div>
        }>
          <AcademyApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
