// Reality Sync - Core Types

export type VaultType = 'Home' | 'Rental' | 'Storage' | 'Vehicle';
export type LockType = 'pin' | 'biometric' | 'none';
export type CaptureType = 'walkthrough' | 'photo_set' | 'single_photo';
export type ExportType = 'insurance_claim' | 'theft_report' | 'rental_condition';
export type StorageStatus = 'local_only' | 'synced';
export type ValueRange = 'low' | 'medium' | 'high' | 'very_high';

export interface Vault {
  id: string;
  name: string;
  type: VaultType;
  address?: string;
  owner?: string;
  lockType: LockType;
  pin?: string;
  createdAt: string;
  updatedAt: string;
  storageStatus: StorageStatus;
}

export interface Room {
  id: string;
  vaultId: string;
  name: string;
  createdAt: string;
}

export interface CaptureSession {
  id: string;
  vaultId: string;
  roomId: string;
  type: CaptureType;
  timestamp: string;
  notes?: string;
  integrityHash?: string;
  photos: string[]; // base64 or blob URLs
  videoUrl?: string;
  conditionTags?: string[];
}

export interface Asset {
  id: string;
  vaultId: string;
  roomId: string;
  name: string;
  category: string;
  makeModel?: string;
  serialNumber?: string;
  valueRange: ValueRange;
  condition: string;
  photos: string[]; // base64 or blob URLs
  receiptPhoto?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportPacket {
  id: string;
  vaultId: string;
  type: ExportType;
  dateRange: { start: string; end: string };
  generatedAt: string;
  format: 'pdf' | 'csv' | 'zip';
}
