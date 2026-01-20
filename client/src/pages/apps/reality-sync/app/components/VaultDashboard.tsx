import { useState, useEffect } from 'react';
import { ChevronLeft, Camera, Package, FileText, MoreVertical, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getVault, getRoomsByVault, getAssetsByVault } from '../lib/storage';
import type { Vault } from '../types';

interface VaultDashboardProps {
  vaultId: string;
  onNavigate: (view: 'capture' | 'assets' | 'exports') => void;
  onBack: () => void;
}

export default function VaultDashboard({ vaultId, onNavigate, onBack }: VaultDashboardProps) {
  const [vault, setVault] = useState<Vault | null>(null);
  const [assetCount, setAssetCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);

  useEffect(() => {
    const vaultData = getVault(vaultId);
    if (vaultData) {
      setVault(vaultData);
      setAssetCount(getAssetsByVault(vaultId).length);
      setRoomCount(getRoomsByVault(vaultId).length);
    }
  }, [vaultId]);

  if (!vault) return null;

  return (
    <div className="min-h-screen bg-silver-50 pb-20 md:pb-0">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 border-b border-navy-600 sticky top-0 z-30 luxury-shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl text-white font-semibold tracking-tight">{vault.name}</h1>
                <p className="text-sm text-silver-300">{vault.type}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Status Banner */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary" className="bg-accent-blue/10 text-accent-blue border-accent-blue/20">
            {vault.storageStatus === 'local_only' ? '🔒 Local Only' : 'Synced'}
          </Badge>
          <p className="text-sm text-silver-500">
            Last updated {new Date(vault.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-silver-200 luxury-shadow">
            <div className="text-sm text-silver-500 mb-1 font-medium">Total Assets</div>
            <div className="text-3xl text-navy-900 font-semibold tracking-tight">{assetCount}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-silver-200 luxury-shadow">
            <div className="text-sm text-silver-500 mb-1 font-medium">Rooms</div>
            <div className="text-3xl text-navy-900 font-semibold tracking-tight">{roomCount}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h2>
          <div className="grid gap-3">
            <button
              onClick={() => onNavigate('capture')}
              className="bg-white rounded-xl p-5 border border-silver-200 hover:border-accent-blue hover:luxury-shadow-lg transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center group-hover:scale-110 transition-transform luxury-shadow">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-navy-900 font-semibold">Start Capture</div>
                <div className="text-sm text-silver-500">Photo or video walkthrough</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('assets')}
              className="bg-white rounded-xl p-5 border border-silver-200 hover:border-accent-blue hover:luxury-shadow-lg transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center group-hover:scale-110 transition-transform luxury-shadow">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-navy-900 font-semibold">Manage Assets</div>
                <div className="text-sm text-silver-500">View and edit your inventory</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('exports')}
              className="bg-white rounded-xl p-5 border border-silver-200 hover:border-accent-blue hover:luxury-shadow-lg transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-gold/80 to-accent-gold flex items-center justify-center group-hover:scale-110 transition-transform luxury-shadow">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-navy-900 font-semibold">Generate Report</div>
                <div className="text-sm text-silver-500">Export claim packet or CSV</div>
              </div>
            </button>
          </div>
        </div>

        {/* Get Started Message */}
        {assetCount === 0 && (
          <div className="mt-8 bg-gradient-to-br from-accent-blue/10 to-accent-blue-light/10 rounded-xl p-6 border border-accent-blue/20">
            <h3 className="text-navy-900 font-semibold mb-2">Get Started</h3>
            <p className="text-sm text-silver-600 mb-4">
              Start capturing your property to build your inventory. You can take photos, record walkthrough videos, or manually add assets.
            </p>
            <Button 
              onClick={() => onNavigate('capture')} 
              size="sm"
              className="bg-gradient-to-r from-accent-blue to-accent-blue-light hover:from-accent-blue-light hover:to-accent-blue text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Capturing
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}