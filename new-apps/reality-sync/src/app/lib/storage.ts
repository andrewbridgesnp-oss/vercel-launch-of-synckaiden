// Reality Sync - Local Storage Manager

import type { Vault, Room, CaptureSession, Asset, ExportPacket } from '../types';

const STORAGE_KEYS = {
  VAULTS: 'reality_sync_vaults',
  ROOMS: 'reality_sync_rooms',
  SESSIONS: 'reality_sync_sessions',
  ASSETS: 'reality_sync_assets',
  EXPORTS: 'reality_sync_exports',
  ONBOARDING_COMPLETE: 'reality_sync_onboarding',
};

// Generic storage helpers
const getItem = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItem = <T>(key: string, value: T[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Vaults
export const getVaults = (): Vault[] => getItem<Vault>(STORAGE_KEYS.VAULTS);

export const getVault = (id: string): Vault | undefined => {
  return getVaults().find(v => v.id === id);
};

export const saveVault = (vault: Vault): void => {
  const vaults = getVaults();
  const index = vaults.findIndex(v => v.id === vault.id);
  if (index >= 0) {
    vaults[index] = vault;
  } else {
    vaults.push(vault);
  }
  setItem(STORAGE_KEYS.VAULTS, vaults);
};

export const deleteVault = (id: string): void => {
  const vaults = getVaults().filter(v => v.id !== id);
  setItem(STORAGE_KEYS.VAULTS, vaults);
  
  // Also delete related data
  const rooms = getRooms().filter(r => r.vaultId !== id);
  setItem(STORAGE_KEYS.ROOMS, rooms);
  
  const sessions = getSessions().filter(s => s.vaultId !== id);
  setItem(STORAGE_KEYS.SESSIONS, sessions);
  
  const assets = getAssets().filter(a => a.vaultId !== id);
  setItem(STORAGE_KEYS.ASSETS, assets);
};

// Rooms
export const getRooms = (): Room[] => getItem<Room>(STORAGE_KEYS.ROOMS);

export const getRoomsByVault = (vaultId: string): Room[] => {
  return getRooms().filter(r => r.vaultId === vaultId);
};

export const saveRoom = (room: Room): void => {
  const rooms = getRooms();
  const index = rooms.findIndex(r => r.id === room.id);
  if (index >= 0) {
    rooms[index] = room;
  } else {
    rooms.push(room);
  }
  setItem(STORAGE_KEYS.ROOMS, rooms);
};

// Capture Sessions
export const getSessions = (): CaptureSession[] => getItem<CaptureSession>(STORAGE_KEYS.SESSIONS);

export const getSessionsByVault = (vaultId: string): CaptureSession[] => {
  return getSessions().filter(s => s.vaultId === vaultId);
};

export const saveSession = (session: CaptureSession): void => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  setItem(STORAGE_KEYS.SESSIONS, sessions);
};

// Assets
export const getAssets = (): Asset[] => getItem<Asset>(STORAGE_KEYS.ASSETS);

export const getAssetsByVault = (vaultId: string): Asset[] => {
  return getAssets().filter(a => a.vaultId === vaultId);
};

export const getAssetsByRoom = (roomId: string): Asset[] => {
  return getAssets().filter(a => a.roomId === roomId);
};

export const saveAsset = (asset: Asset): void => {
  const assets = getAssets();
  const index = assets.findIndex(a => a.id === asset.id);
  if (index >= 0) {
    assets[index] = asset;
  } else {
    assets.push(asset);
  }
  setItem(STORAGE_KEYS.ASSETS, assets);
};

export const deleteAsset = (id: string): void => {
  const assets = getAssets().filter(a => a.id !== id);
  setItem(STORAGE_KEYS.ASSETS, assets);
};

// Exports
export const getExports = (): ExportPacket[] => getItem<ExportPacket>(STORAGE_KEYS.EXPORTS);

export const saveExport = (exportPacket: ExportPacket): void => {
  const exports = getExports();
  exports.push(exportPacket);
  setItem(STORAGE_KEYS.EXPORTS, exports);
};

// Onboarding
export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
};

export const setOnboardingComplete = (): void => {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
};

// Data Export/Delete
export const exportAllData = (): string => {
  return JSON.stringify({
    vaults: getVaults(),
    rooms: getRooms(),
    sessions: getSessions(),
    assets: getAssets(),
    exports: getExports(),
  }, null, 2);
};

export const deleteAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
