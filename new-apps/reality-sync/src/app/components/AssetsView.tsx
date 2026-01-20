import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Package, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { getAssetsByVault, getRoomsByVault } from '../lib/storage';
import AddAssetDialog from './AddAssetDialog';
import type { Asset, Room } from '../types';

interface AssetsViewProps {
  vaultId: string;
  onBack: () => void;
  onAssetAdded?: (asset: Asset) => void;
}

export default function AssetsView({ vaultId, onBack, onAssetAdded }: AssetsViewProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadAssets();
  }, [vaultId]);

  const loadAssets = () => {
    setAssets(getAssetsByVault(vaultId));
    setRooms(getRoomsByVault(vaultId));
  };

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoomName = (roomId: string) => {
    return rooms.find((r) => r.id === roomId)?.name || 'Unknown';
  };

  const getValueColor = (valueRange: string) => {
    switch (valueRange) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'very_high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="min-h-screen bg-silver-50 pb-20 md:pb-0">
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 border-b border-navy-600 sticky top-0 z-30 luxury-shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl text-white font-semibold tracking-tight">Assets</h1>
              <p className="text-sm text-silver-300">{assets.length} items</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-400" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-silver-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {assets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center luxury-shadow">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-navy-900 mb-2">No assets yet</h2>
            <p className="text-silver-500 mb-6">Start adding items to your inventory</p>
            <Button 
              onClick={() => setShowAddDialog(true)} 
              size="lg"
              className="bg-gradient-to-r from-accent-blue to-accent-blue-light hover:from-accent-blue-light hover:to-accent-blue text-white luxury-shadow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Asset
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-silver-500 font-medium">
                {filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'}
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-accent-blue to-accent-blue-light hover:from-accent-blue-light hover:to-accent-blue text-white luxury-shadow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </div>

            <div className="grid gap-3">
              {filteredAssets.map((asset) => (
                <Card key={asset.id} className="bg-white border-silver-200 p-4 hover:border-accent-blue hover:luxury-shadow-lg transition-all">
                  <div className="flex gap-4">
                    {asset.photos.length > 0 && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-silver-200 flex-shrink-0 luxury-shadow">
                        <img
                          src={asset.photos[0]}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy-900 mb-1">{asset.name}</h3>
                      <p className="text-sm text-silver-500 mb-2">{asset.category}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs border-silver-300 text-navy-700">
                          {getRoomName(asset.roomId)}
                        </Badge>
                        <Badge className={`text-xs ${getValueColor(asset.valueRange)}`}>
                          {asset.valueRange.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {asset.serialNumber && (
                          <Badge variant="outline" className="text-xs border-silver-300 text-navy-700">
                            S/N: {asset.serialNumber}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <AddAssetDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        vaultId={vaultId}
        rooms={rooms}
        onAdded={(asset) => {
          loadAssets();
          setShowAddDialog(false);
          if (onAssetAdded) {
            onAssetAdded(asset);
          }
        }}
      />
    </div>
  );
}