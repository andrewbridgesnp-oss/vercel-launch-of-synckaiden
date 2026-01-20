/**
 * RealitySync - Main Component
 * 
 * A modular, embeddable property inventory and claims management system.
 * Can be used standalone or integrated into larger applications.
 * 
 * @example
 * ```tsx
 * // Standalone
 * <RealitySync />
 * 
 * // With custom initial route
 * <RealitySync initialRoute={{ view: 'vault-list' }} />
 * 
 * // With event callbacks
 * <RealitySync 
 *   onVaultCreated={(vault) => console.log('Created:', vault)}
 *   onExportGenerated={(data) => console.log('Export:', data)}
 * />
 * ```
 */

import { RealitySyncProvider } from '../contexts/RealitySyncContext';
import { useRealitySyncRouter, type RealitySyncRoute } from '../hooks/useRealitySyncRouter';
import RealitySyncContent from './RealitySyncContent';
import { Toaster } from './ui/sonner';
import type { Vault, Asset, ExportPacket } from '../types';

export interface RealitySyncProps {
  /** Initial route to display */
  initialRoute?: RealitySyncRoute;
  
  /** Callback when a vault is created */
  onVaultCreated?: (vault: Vault) => void;
  
  /** Callback when an asset is added */
  onAssetAdded?: (asset: Asset) => void;
  
  /** Callback when an export is generated */
  onExportGenerated?: (exportData: ExportPacket) => void;
  
  /** Callback when the user navigates */
  onNavigate?: (route: RealitySyncRoute) => void;
  
  /** Custom class name for the container */
  className?: string;
  
  /** Whether to show the toaster notifications */
  showToaster?: boolean;
  
  /** Theme preference */
  theme?: 'light' | 'dark' | 'auto';
}

export default function RealitySync({
  initialRoute,
  onVaultCreated,
  onAssetAdded,
  onExportGenerated,
  onNavigate,
  className = '',
  showToaster = true,
  theme = 'light',
}: RealitySyncProps) {
  return (
    <RealitySyncProvider>
      <div className={`reality-sync-app ${className}`} data-theme={theme}>
        <RealitySyncContent
          initialRoute={initialRoute}
          onVaultCreated={onVaultCreated}
          onAssetAdded={onAssetAdded}
          onExportGenerated={onExportGenerated}
          onNavigate={onNavigate}
        />
        {showToaster && <Toaster position="top-center" />}
      </div>
    </RealitySyncProvider>
  );
}

// Export types and hooks for external use
export { useRealitySync } from '../contexts/RealitySyncContext';
export { useRealitySyncRouter } from '../hooks/useRealitySyncRouter';
export type { RealitySyncRoute };
