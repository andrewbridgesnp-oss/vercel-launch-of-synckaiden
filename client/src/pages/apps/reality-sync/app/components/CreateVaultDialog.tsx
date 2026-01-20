import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { saveVault } from '../lib/storage';
import type { Vault, VaultType, LockType } from '../types';
import { toast } from 'sonner';

interface CreateVaultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export default function CreateVaultDialog({ open, onOpenChange, onCreated }: CreateVaultDialogProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState<VaultType>('Home');
  const [address, setAddress] = useState('');
  const [lockType, setLockType] = useState<LockType>('pin');
  const [pin, setPin] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a vault name');
      return;
    }

    if (lockType === 'pin' && pin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    const vault: Vault = {
      id: `vault_${Date.now()}`,
      name: name.trim(),
      type,
      address: address.trim() || undefined,
      lockType,
      pin: lockType === 'pin' ? pin : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storageStatus: 'local_only',
    };

    saveVault(vault);
    toast.success(`Vault "${name}" created successfully`);
    
    // Reset form
    setStep(1);
    setName('');
    setType('Home');
    setAddress('');
    setLockType('pin');
    setPin('');
    
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Create Vault' : 'Secure Your Vault'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vault-name">Vault Name *</Label>
              <Input
                id="vault-name"
                placeholder="My Home"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="vault-type">Type *</Label>
              <Select value={type} onValueChange={(value) => setType(value as VaultType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Rental">Rental Property</SelectItem>
                  <SelectItem value="Storage">Storage Unit</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vault-address">Address (Optional)</Label>
              <Input
                id="vault-address"
                placeholder="123 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Lock Type</Label>
              <RadioGroup value={lockType} onValueChange={(value) => setLockType(value as LockType)} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pin" id="pin" />
                  <Label htmlFor="pin" className="font-normal">PIN Code</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="biometric" id="biometric" />
                  <Label htmlFor="biometric" className="font-normal">Biometric (Coming Soon)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="font-normal">No Lock</Label>
                </div>
              </RadioGroup>
            </div>

            {lockType === 'pin' && (
              <div>
                <Label htmlFor="pin-code">PIN Code *</Label>
                <Input
                  id="pin-code"
                  type="password"
                  placeholder="Enter 4+ digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button onClick={() => setStep(2)} disabled={!name.trim()}>
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              Create Vault
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
