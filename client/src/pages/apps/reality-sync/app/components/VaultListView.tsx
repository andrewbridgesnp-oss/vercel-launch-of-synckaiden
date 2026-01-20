import { useState, useEffect } from 'react';
import { Plus, Home, Car, Package, Building, Lock, Settings, ChevronRight, HelpCircle, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import CreateVaultDialog from './CreateVaultDialog';
import { getVaults, getAssetsByVault, getRoomsByVault } from '../lib/storage';
import type { Vault } from '../types';

interface VaultListViewProps {
  onSelectVault: (vaultId: string) => void;
}

export default function VaultListView({ onSelectVault }: VaultListViewProps) {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    loadVaults();
  }, []);

  const loadVaults = () => {
    setVaults(getVaults());
  };

  const getVaultIcon = (type: string) => {
    switch (type) {
      case 'Home':
        return Home;
      case 'Rental':
        return Building;
      case 'Vehicle':
        return Car;
      case 'Storage':
        return Package;
      default:
        return Home;
    }
  };

  const vaultTypeIcons: { [key: string]: any } = {
    Home: Home,
    Rental: Building,
    Vehicle: Car,
    Storage: Package,
  };

  const vaultTypeColors: { [key: string]: string } = {
    Home: 'from-accent-blue to-accent-blue-light',
    Rental: 'from-accent-blue to-accent-blue-light',
    Vehicle: 'from-accent-blue to-accent-blue-light',
    Storage: 'from-accent-blue to-accent-blue-light',
  };

  const onVaultCreated = () => {
    loadVaults();
    setShowCreateDialog(false);
  };

  return (
    <div className="min-h-screen bg-silver-50 pb-20 md:pb-0">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 border-b border-navy-600 sticky top-0 z-30 luxury-shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Reality Sync</h1>
              <p className="text-silver-300 text-sm mt-1">Your Property Vaults</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate({ view: 'settings' })}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Privacy Status Banner */}
        <div className="bg-gradient-to-r from-accent-blue/10 to-accent-blue-light/10 rounded-xl p-4 mb-6 border border-accent-blue/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-navy-900">Local Storage Only</h3>
                <Badge variant="secondary" className="bg-white/80 text-accent-blue border-accent-blue/20">
                  Secure
                </Badge>
              </div>
              <p className="text-sm text-silver-500 mt-0.5">
                All vaults stored securely on your device
              </p>
            </div>
          </div>
        </div>

        {vaults.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
              <Lock className="w-8 h-8 text-neutral-400" />
            </div>
            <h2 className="text-xl text-neutral-900 mb-2">No vaults yet</h2>
            <p className="text-neutral-600 mb-6">Create your first vault to start protecting your property</p>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="group bg-gradient-to-br from-navy-800 to-navy-700 rounded-2xl p-12 border-2 border-dashed border-navy-600 hover:border-accent-blue transition-all luxury-shadow hover:luxury-shadow-lg"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform luxury-shadow">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Your First Vault</h3>
                <p className="text-silver-300 text-center max-w-sm">
                  Start documenting your property with a new vault. Organize by home, rental, storage, or vehicle.
                </p>
              </div>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-navy-900">Your Vaults</h2>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-accent-blue to-accent-blue-light hover:from-accent-blue-light hover:to-accent-blue text-white luxury-shadow"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Vault
              </Button>
            </div>

            <div className="grid gap-4">
              {vaults.map((vault) => {
                const Icon = vaultTypeIcons[vault.type];
                const colorClass = vaultTypeColors[vault.type];
                const assetCount = getAssetsByVault(vault.id).length;
                const roomCount = getRoomsByVault(vault.id).length;

                return (
                  <button
                    key={vault.id}
                    onClick={() => onSelectVault(vault.id)}
                    className="bg-white rounded-xl p-6 border border-silver-200 hover:border-accent-blue transition-all text-left group luxury-shadow hover:luxury-shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform luxury-shadow`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-navy-900 truncate">
                            {vault.name}
                          </h3>
                          {vault.lockType !== 'none' && (
                            <Lock className="w-4 h-4 text-accent-blue flex-shrink-0" />
                          )}
                        </div>

                        {vault.address && (
                          <p className="text-sm text-silver-500 mb-3 truncate">
                            {vault.address}
                          </p>
                        )}

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-sm text-silver-600">
                            <Package className="w-4 h-4 text-accent-blue" />
                            <span className="font-medium text-navy-700">{assetCount}</span>
                            <span>assets</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-silver-600">
                            <Home className="w-4 h-4 text-accent-blue" />
                            <span className="font-medium text-navy-700">{roomCount}</span>
                            <span>rooms</span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-silver-400 group-hover:text-accent-blue transition-colors flex-shrink-0 mt-1" />
                    </div>

                    <div className="mt-4 pt-4 border-t border-silver-100 flex items-center justify-between">
                      <Badge variant="secondary" className="bg-silver-100 text-navy-700 border-0">
                        {vault.type}
                      </Badge>
                      <span className="text-xs text-silver-400">
                        Updated {new Date(vault.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <CreateVaultDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onVaultCreated={onVaultCreated}
      />
    </div>
  );
}