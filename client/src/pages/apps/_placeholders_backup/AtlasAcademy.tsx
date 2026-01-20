import { lazy, Suspense } from 'react';
import PlatformAccessGate from '../../components/PlatformAccessGate';

// Lazy load the full Atlas Academy app
const AtlasAcademyApp = lazy(() => import('./atlas-academy/App'));

export default function AtlasAcademy() {
  return (
    <PlatformAccessGate platformSlug="professional-services-suite">
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Loading Atlas Academy...</div>
              <div className="text-muted-foreground">Professional Services Suite</div>
            </div>
          </div>
        }>
          <AtlasAcademyApp />
        </Suspense>
      </div>
    </PlatformAccessGate>
  );
}
