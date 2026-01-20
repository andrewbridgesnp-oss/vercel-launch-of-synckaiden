import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Camera, X } from 'lucide-react';
import { saveAsset } from '../lib/storage';
import { toast } from 'sonner';
import type { Asset, Room, ValueRange } from '../types';

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaultId: string;
  rooms: Room[];
  onAdded: (asset: Asset) => void;
}

export default function AddAssetDialog({ open, onOpenChange, vaultId, rooms, onAdded }: AddAssetDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [roomId, setRoomId] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [valueRange, setValueRange] = useState<ValueRange>('medium');
  const [condition, setCondition] = useState('Good');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter an asset name');
      return;
    }

    if (!category.trim()) {
      toast.error('Please enter a category');
      return;
    }

    if (!roomId) {
      toast.error('Please select a room');
      return;
    }

    const asset: Asset = {
      id: `asset_${Date.now()}`,
      vaultId,
      roomId,
      name: name.trim(),
      category: category.trim(),
      makeModel: makeModel.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
      valueRange,
      condition,
      photos,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAsset(asset);
    toast.success(`Asset "${name}" added successfully`);

    // Reset form
    setName('');
    setCategory('');
    setRoomId('');
    setMakeModel('');
    setSerialNumber('');
    setValueRange('medium');
    setCondition('Good');
    setNotes('');
    setPhotos([]);

    onAdded(asset);
  };

  const categories = [
    'Electronics',
    'Furniture',
    'Appliances',
    'Jewelry',
    'Art',
    'Tools',
    'Sports Equipment',
    'Clothing',
    'Books',
    'Other',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Asset</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="asset-name">Asset Name *</Label>
            <Input
              id="asset-name"
              placeholder="MacBook Pro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="room">Room *</Label>
            <Select value={roomId} onValueChange={setRoomId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make-model">Make/Model</Label>
              <Input
                id="make-model"
                placeholder="Apple"
                value={makeModel}
                onChange={(e) => setMakeModel(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="serial">Serial Number</Label>
              <Input
                id="serial"
                placeholder="ABC123"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Value Range</Label>
              <Select value={valueRange} onValueChange={(v) => setValueRange(v as ValueRange)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low ($0-$100)</SelectItem>
                  <SelectItem value="medium">Medium ($100-$1000)</SelectItem>
                  <SelectItem value="high">High ($1000-$5000)</SelectItem>
                  <SelectItem value="very_high">Very High ($5000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Photos</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              Add Photos
            </Button>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-neutral-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Add Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}