import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the full Audio Mastering app
const AudioMasteringApp = lazy(() => import('./audio-mastering/app/App'));

export default function AudioMastering() {
  return (
    <PlatformAccessGate platformSlug="professional-services-suite">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading Audio Mastering...</div>
              <div className="text-muted-foreground">Professional Services Suite</div>
            </div>
          </div>
        }>
          <AudioMasteringApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
