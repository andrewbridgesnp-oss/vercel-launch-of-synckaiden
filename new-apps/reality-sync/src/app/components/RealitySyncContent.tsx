import { useEffect } from 'react';
import { Home, Camera, Package, FileText } from 'lucide-react';
import { useRealitySyncRouter, type RealitySyncRoute } from '../hooks/useRealitySyncRouter';
import { isOnboardingComplete } from '../lib/storage';

// Views
import OnboardingView from './OnboardingView';
import VaultListView from './VaultListView';
import VaultDashboard from './VaultDashboard';
import CaptureView from './CaptureView';
import AssetsView from './AssetsView';
import ExportsView from './ExportsView';
import SettingsView from './SettingsView';

import type { Vault, Asset, ExportPacket } from '../types';

interface RealitySyncContentProps {
  initialRoute?: RealitySyncRoute;
  onVaultCreated?: (vault: Vault) => void;
  onAssetAdded?: (asset: Asset) => void;
  onExportGenerated?: (exportData: ExportPacket) => void;
  onNavigate?: (route: RealitySyncRoute) => void;
}

export default function RealitySyncContent({
  initialRoute,
  onVaultCreated,
  onAssetAdded,
  onExportGenerated,
  onNavigate,
}: RealitySyncContentProps) {
  const router = useRealitySyncRouter(
    initialRoute || (isOnboardingComplete() ? { view: 'vault-list' } : { view: 'onboarding' })
  );

  useEffect(() => {
    onNavigate?.(router.currentRoute);
  }, [router.currentRoute, onNavigate]);

  const handleSelectVault = (vaultId: string) => {
    router.navigate({ view: 'vault-dashboard', vaultId });
  };

  const handleCompleteOnboarding = () => {
    router.navigate({ view: 'vault-list' });
  };

  const handleNavigateFromDashboard = (view: 'capture' | 'assets' | 'exports', vaultId: string) => {
    router.navigate({ view, vaultId });
  };

  // Render current view
  const renderView = () => {
    const route = router.currentRoute;

    switch (route.view) {
      case 'onboarding':
        return <OnboardingView onComplete={handleCompleteOnboarding} />;
      
      case 'vault-list':
        return <VaultListView onSelectVault={handleSelectVault} />;
      
      case 'vault-dashboard':
        return (
          <VaultDashboard
            vaultId={route.vaultId}
            onNavigate={(view) => handleNavigateFromDashboard(view, route.vaultId)}
            onBack={() => router.navigate({ view: 'vault-list' })}
          />
        );
      
      case 'capture':
        return (
          <CaptureView
            vaultId={route.vaultId}
            onBack={() => router.navigate({ view: 'vault-dashboard', vaultId: route.vaultId })}
          />
        );
      
      case 'assets':
        return (
          <AssetsView
            vaultId={route.vaultId}
            onBack={() => router.navigate({ view: 'vault-dashboard', vaultId: route.vaultId })}
            onAssetAdded={onAssetAdded}
          />
        );
      
      case 'exports':
        return (
          <ExportsView
            vaultId={route.vaultId}
            onBack={() => router.navigate({ view: 'vault-dashboard', vaultId: route.vaultId })}
            onExportGenerated={onExportGenerated}
          />
        );
      
      case 'settings':
        return <SettingsView onBack={() => router.navigate({ view: 'vault-list' })} />;
      
      default:
        return <VaultListView onSelectVault={handleSelectVault} />;
    }
  };

  // Bottom navigation for mobile
  const BottomNav = () => {
    const route = router.currentRoute;
    
    if (route.view === 'onboarding' || route.view === 'vault-list' || route.view === 'settings') {
      return null;
    }

    if (route.view === 'vault-dashboard' || route.view === 'capture' || route.view === 'assets' || route.view === 'exports') {
      const vaultId = route.vaultId;
      
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-silver-200 md:hidden z-40 luxury-shadow-lg">
          <div className="flex items-center justify-around py-3 px-2">
            <button
              onClick={() => router.navigate({ view: 'vault-dashboard', vaultId })}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                route.view === 'vault-dashboard' 
                  ? 'text-accent-blue bg-accent-blue/10' 
                  : 'text-silver-400 hover:text-navy-700 hover:bg-silver-50'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Vault</span>
            </button>
            <button
              onClick={() => router.navigate({ view: 'capture', vaultId })}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                route.view === 'capture' 
                  ? 'text-accent-blue bg-accent-blue/10' 
                  : 'text-silver-400 hover:text-navy-700 hover:bg-silver-50'
              }`}
            >
              <Camera className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Capture</span>
            </button>
            <button
              onClick={() => router.navigate({ view: 'assets', vaultId })}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                route.view === 'assets' 
                  ? 'text-accent-blue bg-accent-blue/10' 
                  : 'text-silver-400 hover:text-navy-700 hover:bg-silver-50'
              }`}
            >
              <Package className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Assets</span>
            </button>
            <button
              onClick={() => router.navigate({ view: 'exports', vaultId })}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                route.view === 'exports' 
                  ? 'text-accent-blue bg-accent-blue/10' 
                  : 'text-silver-400 hover:text-navy-700 hover:bg-silver-50'
              }`}
            >
              <FileText className="w-6 h-6" />
              <span className="text-xs mt-1 font-medium">Exports</span>
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-silver-50">
      {renderView()}
      <BottomNav />
    </div>
  );
}