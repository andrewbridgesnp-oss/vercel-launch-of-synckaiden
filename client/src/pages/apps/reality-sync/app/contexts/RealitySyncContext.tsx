import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Vault, Room, Asset, CaptureSession } from '../types';
import * as storage from '../lib/storage';

interface RealitySyncContextType {
  // Vaults
  vaults: Vault[];
  selectedVault: Vault | null;
  selectVault: (id: string) => void;
  createVault: (vault: Vault) => void;
  updateVault: (vault: Vault) => void;
  deleteVault: (id: string) => void;
  
  // Rooms
  rooms: Room[];
  getRoomsByVault: (vaultId: string) => Room[];
  createRoom: (room: Room) => void;
  
  // Assets
  assets: Asset[];
  getAssetsByVault: (vaultId: string) => Asset[];
  getAssetsByRoom: (roomId: string) => Asset[];
  createAsset: (asset: Asset) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  
  // Sessions
  sessions: CaptureSession[];
  createSession: (session: CaptureSession) => void;
  
  // Utilities
  refresh: () => void;
  exportAllData: () => string;
  importData: (data: string) => void;
  clearAllData: () => void;
}

const RealitySyncContext = createContext<RealitySyncContextType | null>(null);

export function RealitySyncProvider({ children }: { children: ReactNode }) {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [sessions, setSessions] = useState<CaptureSession[]>([]);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);

  const loadData = () => {
    setVaults(storage.getVaults());
    setRooms(storage.getRooms());
    setAssets(storage.getAssets());
    setSessions(storage.getSessions());
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectVault = (id: string) => {
    const vault = storage.getVault(id);
    setSelectedVault(vault || null);
  };

  const createVault = (vault: Vault) => {
    storage.saveVault(vault);
    loadData();
  };

  const updateVault = (vault: Vault) => {
    storage.saveVault(vault);
    loadData();
  };

  const deleteVault = (id: string) => {
    storage.deleteVault(id);
    if (selectedVault?.id === id) {
      setSelectedVault(null);
    }
    loadData();
  };

  const getRoomsByVault = (vaultId: string) => {
    return rooms.filter(r => r.vaultId === vaultId);
  };

  const createRoom = (room: Room) => {
    storage.saveRoom(room);
    loadData();
  };

  const getAssetsByVault = (vaultId: string) => {
    return assets.filter(a => a.vaultId === vaultId);
  };

  const getAssetsByRoom = (roomId: string) => {
    return assets.filter(a => a.roomId === roomId);
  };

  const createAsset = (asset: Asset) => {
    storage.saveAsset(asset);
    loadData();
  };

  const updateAsset = (asset: Asset) => {
    storage.saveAsset(asset);
    loadData();
  };

  const deleteAsset = (id: string) => {
    storage.deleteAsset(id);
    loadData();
  };

  const createSession = (session: CaptureSession) => {
    storage.saveSession(session);
    loadData();
  };

  const exportAllData = () => {
    return storage.exportAllData();
  };

  const importData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      // Save imported data
      parsed.vaults?.forEach((v: Vault) => storage.saveVault(v));
      parsed.rooms?.forEach((r: Room) => storage.saveRoom(r));
      parsed.assets?.forEach((a: Asset) => storage.saveAsset(a));
      parsed.sessions?.forEach((s: CaptureSession) => storage.saveSession(s));
      loadData();
    } catch (error) {
      throw new Error('Invalid data format');
    }
  };

  const clearAllData = () => {
    storage.deleteAllData();
    setSelectedVault(null);
    loadData();
  };

  return (
    <RealitySyncContext.Provider
      value={{
        vaults,
        selectedVault,
        selectVault,
        createVault,
        updateVault,
        deleteVault,
        rooms,
        getRoomsByVault,
        createRoom,
        assets,
        getAssetsByVault,
        getAssetsByRoom,
        createAsset,
        updateAsset,
        deleteAsset,
        sessions,
        createSession,
        refresh: loadData,
        exportAllData,
        importData,
        clearAllData,
      }}
    >
      {children}
    </RealitySyncContext.Provider>
  );
}

export function useRealitySync() {
  const context = useContext(RealitySyncContext);
  if (!context) {
    throw new Error('useRealitySync must be used within RealitySyncProvider');
  }
  return context;
}
