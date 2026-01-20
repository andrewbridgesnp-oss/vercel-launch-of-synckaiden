/**
 * Example 4: Advanced API Usage
 * 
 * Demonstrates programmatic control of Reality Sync
 * using the context API
 */

import { useEffect } from 'react';
import { RealitySyncProvider, useRealitySync, RealitySync } from '../src/app';
import { Button } from '../src/app/components/ui/button';
import { Card } from '../src/app/components/ui/card';
import type { Vault, Asset } from '../src/app/types';

// Component using the Reality Sync API
function InventoryController() {
  const {
    vaults,
    assets,
    createVault,
    createAsset,
    selectVault,
    selectedVault,
    getRoomsByVault,
    createRoom,
    exportAllData,
    importData,
  } = useRealitySync();

  // Example: Create a vault programmatically
  const handleCreateDemoVault = () => {
    const demoVault: Vault = {
      id: `vault_${Date.now()}`,
      name: 'Demo Property',
      type: 'Home',
      address: '123 Main Street',
      lockType: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storageStatus: 'local_only',
    };
    
    createVault(demoVault);
    selectVault(demoVault.id);
  };

  // Example: Seed with sample data
  const handleSeedData = () => {
    if (vaults.length === 0) {
      handleCreateDemoVault();
      return;
    }

    const vault = vaults[0];
    const rooms = getRoomsByVault(vault.id);
    
    // Create a room if none exists
    if (rooms.length === 0) {
      createRoom({
        id: `room_${Date.now()}`,
        vaultId: vault.id,
        name: 'Living Room',
        createdAt: new Date().toISOString(),
      });
    }

    // Add sample assets
    const sampleAssets = [
      { name: 'MacBook Pro', category: 'Electronics', valueRange: 'high' as const },
      { name: 'Leather Sofa', category: 'Furniture', valueRange: 'medium' as const },
      { name: 'Sony TV', category: 'Electronics', valueRange: 'high' as const },
    ];

    const room = getRoomsByVault(vault.id)[0];
    
    sampleAssets.forEach((sample, index) => {
      setTimeout(() => {
        const asset: Asset = {
          id: `asset_${Date.now()}_${index}`,
          vaultId: vault.id,
          roomId: room.id,
          name: sample.name,
          category: sample.category,
          valueRange: sample.valueRange,
          condition: 'Good',
          photos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        createAsset(asset);
      }, index * 100);
    });
  };

  // Example: Export and download data
  const handleExportData = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reality-sync-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Example: Calculate total estimated value
  const calculateTotalValue = () => {
    const valueMap = {
      low: 50,
      medium: 500,
      high: 2500,
      very_high: 10000,
    };
    
    return assets.reduce((sum, asset) => {
      return sum + (valueMap[asset.valueRange] || 0);
    }, 0);
  };

  // Example: Get statistics
  const stats = {
    totalVaults: vaults.length,
    totalAssets: assets.length,
    estimatedValue: calculateTotalValue(),
    byCategory: assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-neutral-600 mb-1">Total Vaults</div>
          <div className="text-3xl text-neutral-900">{stats.totalVaults}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-neutral-600 mb-1">Total Assets</div>
          <div className="text-3xl text-neutral-900">{stats.totalAssets}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-neutral-600 mb-1">Estimated Value</div>
          <div className="text-3xl text-neutral-900">
            ${stats.estimatedValue.toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.byCategory).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg text-neutral-900 mb-4">Assets by Category</h3>
          <div className="space-y-2">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-neutral-700">{category}</span>
                <span className="text-neutral-900 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* API Actions */}
      <Card className="p-6">
        <h3 className="text-lg text-neutral-900 mb-4">API Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleCreateDemoVault} variant="outline">
            Create Demo Vault
          </Button>
          <Button onClick={handleSeedData} variant="outline">
            Seed Sample Data
          </Button>
          <Button onClick={handleExportData} variant="outline">
            Export All Data
          </Button>
          <Button 
            onClick={() => {
              if (confirm('Clear all data?')) {
                localStorage.clear();
                window.location.reload();
              }
            }} 
            variant="destructive"
          >
            Clear All Data
          </Button>
        </div>
      </Card>

      {/* Selected Vault Info */}
      {selectedVault && (
        <Card className="p-6">
          <h3 className="text-lg text-neutral-900 mb-2">Selected Vault</h3>
          <div className="space-y-1 text-sm">
            <div><strong>Name:</strong> {selectedVault.name}</div>
            <div><strong>Type:</strong> {selectedVault.type}</div>
            <div><strong>Status:</strong> {selectedVault.storageStatus}</div>
            {selectedVault.address && (
              <div><strong>Address:</strong> {selectedVault.address}</div>
            )}
          </div>
        </Card>
      )}

      {/* Recent Assets */}
      {assets.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg text-neutral-900 mb-4">Recent Assets</h3>
          <div className="space-y-2">
            {assets.slice(-5).reverse().map((asset) => (
              <div 
                key={asset.id} 
                className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0"
              >
                <div>
                  <div className="text-neutral-900">{asset.name}</div>
                  <div className="text-sm text-neutral-600">{asset.category}</div>
                </div>
                <div className="text-sm text-neutral-600">
                  {asset.valueRange.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Code Example */}
      <Card className="p-6 bg-neutral-900 text-neutral-100">
        <h3 className="text-lg mb-4">API Usage Example</h3>
        <pre className="text-sm overflow-x-auto">
{`const { 
  vaults,
  assets,
  createVault,
  createAsset,
  exportAllData,
} = useRealitySync();

// Create a vault
createVault({
  id: 'vault_123',
  name: 'My Home',
  type: 'Home',
  // ...
});

// Add an asset
createAsset({
  id: 'asset_123',
  vaultId: 'vault_123',
  name: 'MacBook Pro',
  // ...
});

// Export data
const backup = exportAllData();`}
        </pre>
      </Card>
    </div>
  );
}

// Main example component
export default function APIUsageExample() {
  return (
    <RealitySyncProvider>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl text-neutral-900 mb-2">
              Reality Sync API Demo
            </h1>
            <p className="text-neutral-600">
              Demonstrating programmatic control and data access
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* API Controller */}
            <div>
              <h2 className="text-xl text-neutral-900 mb-4">
                External Controls & Stats
              </h2>
              <InventoryController />
            </div>

            {/* Reality Sync UI */}
            <div>
              <h2 className="text-xl text-neutral-900 mb-4">
                Reality Sync Interface
              </h2>
              <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                <RealitySync 
                  initialRoute={{ view: 'vault-list' }}
                  showToaster={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RealitySyncProvider>
  );
}
