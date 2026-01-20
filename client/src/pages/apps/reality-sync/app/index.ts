/**
 * Reality Sync - Public API
 * 
 * This is the main entry point for integrating Reality Sync into your application.
 */

// Main Component
export { default as RealitySync } from './components/RealitySync';
export type { RealitySyncProps } from './components/RealitySync';

// Context & Hooks
export { RealitySyncProvider, useRealitySync } from './contexts/RealitySyncContext';
export { useRealitySyncRouter } from './hooks/useRealitySyncRouter';
export type { RealitySyncRoute } from './hooks/useRealitySyncRouter';

// Types
export type {
  Vault,
  Room,
  Asset,
  CaptureSession,
  ExportPacket,
  VaultType,
  LockType,
  CaptureType,
  ExportType,
  StorageStatus,
  ValueRange,
} from './types';

// Storage API (for advanced use cases)
export * as RealitySyncStorage from './lib/storage';

// Export Utilities
export * as RealitySyncExport from './lib/export-pdf';
