import { useState, useRef } from 'react';
import { ChevronLeft, Camera, Video, Plus, Check, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { saveSession, saveRoom, getRoomsByVault } from '../lib/storage';
import { toast } from 'sonner';
import type { Room, CaptureSession } from '../types';

interface CaptureViewProps {
  vaultId: string;
  onBack: () => void;
}

export default function CaptureView({ vaultId, onBack }: CaptureViewProps) {
  const [step, setStep] = useState<'select' | 'room' | 'checklist' | 'capture' | 'review'>('select');
  const [captureType, setCaptureType] = useState<'photo' | 'video'>('photo');
  const [rooms, setRooms] = useState<Room[]>(getRoomsByVault(vaultId));
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;

    const room: Room = {
      id: `room_${Date.now()}`,
      vaultId,
      name: newRoomName.trim(),
      createdAt: new Date().toISOString(),
    };

    saveRoom(room);
    setRooms([...rooms, room]);
    setSelectedRoomId(room.id);
    setNewRoomName('');
    toast.success(`Room "${room.name}" added`);
  };

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

  const handleSave = () => {
    if (!selectedRoomId || photos.length === 0) {
      toast.error('Please select a room and capture at least one photo');
      return;
    }

    const session: CaptureSession = {
      id: `session_${Date.now()}`,
      vaultId,
      roomId: selectedRoomId,
      type: captureType === 'photo' ? 'photo_set' : 'walkthrough',
      timestamp: new Date().toISOString(),
      photos,
      notes: notes.trim() || undefined,
      integrityHash: `hash_${Date.now()}`,
    };

    saveSession(session);
    toast.success('Capture session saved successfully');
    onBack();
  };

  return (
    <div className="min-h-screen bg-silver-50 pb-20 md:pb-0">
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 border-b border-navy-600 sticky top-0 z-30 luxury-shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              <h1 className="text-xl text-white font-semibold tracking-tight">Capture</h1>
              <p className="text-sm text-silver-300">Document your property</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {step === 'select' && (
          <div>
            <h2 className="text-lg font-semibold text-navy-900 mb-4">Choose Capture Mode</h2>
            <div className="grid gap-4">
              <button
                onClick={() => {
                  setCaptureType('photo');
                  setStep('room');
                }}
                className="bg-white rounded-xl p-6 border border-silver-200 hover:border-accent-blue hover:luxury-shadow-lg transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center group-hover:scale-110 transition-transform luxury-shadow">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-navy-900 mb-1">Photo Set</div>
                  <div className="text-sm text-silver-500">Take multiple photos of a room or area</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setCaptureType('video');
                  setStep('room');
                }}
                className="bg-white rounded-xl p-6 border border-silver-200 hover:border-accent-blue hover:luxury-shadow-lg transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center group-hover:scale-110 transition-transform luxury-shadow">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-navy-900 mb-1">Video Walkthrough</div>
                  <div className="text-sm text-silver-500">Record a guided tour (Coming Soon)</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'room' && (
          <div>
            <h2 className="text-lg text-neutral-900 mb-4">Select Room/Area</h2>
            
            {rooms.length > 0 && (
              <div className="mb-6">
                <Label htmlFor="room-select">Existing Room</Label>
                <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a room" />
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
            )}

            <div className="mb-6">
              <Label htmlFor="new-room">Or Add New Room</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="new-room"
                  placeholder="Living Room"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                <Button onClick={handleAddRoom} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button onClick={() => setStep('checklist')} disabled={!selectedRoomId}>
              Next
            </Button>
          </div>
        )}

        {step === 'checklist' && (
          <div>
            <h2 className="text-lg text-neutral-900 mb-4">Pre-Capture Checklist</h2>
            
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Ensure good lighting for clear photos</li>
                  <li>Avoid capturing personal documents or sensitive information</li>
                  <li>Include serial numbers and identifying marks</li>
                  <li>Capture damage or condition notes</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('room')}>
                Back
              </Button>
              <Button onClick={() => setStep('capture')}>
                Start Capturing
              </Button>
            </div>
          </div>
        )}

        {step === 'capture' && (
          <div>
            <h2 className="text-lg text-neutral-900 mb-4">Capture Photos</h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="mb-6"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>

            {photos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-neutral-900 mb-3">Captured Photos ({photos.length})</h3>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                      <img src={photo} alt={`Capture ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about the condition or items captured..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('checklist')}>
                Back
              </Button>
              <Button onClick={handleSave} disabled={photos.length === 0}>
                <Check className="w-4 h-4 mr-2" />
                Save Session
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}