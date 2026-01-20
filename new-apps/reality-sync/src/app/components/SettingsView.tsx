import { ChevronLeft, Shield, Database, Download, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { exportAllData, deleteAllData } from '../lib/storage';
import { toast } from 'sonner';

interface SettingsViewProps {
  onBack: () => void;
}

export default function SettingsView({ onBack }: SettingsViewProps) {
  const handleExportData = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reality_sync_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };

  const handleDeleteAllData = () => {
    deleteAllData();
    toast.success('All data deleted');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-silver-50">
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
            <h1 className="text-xl text-white font-semibold tracking-tight">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Privacy Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Privacy & Security</h2>
          <Card className="bg-white border-silver-200 luxury-shadow p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center flex-shrink-0 luxury-shadow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-navy-900 mb-2">Local Storage Only</h3>
                <p className="text-sm text-silver-500 mb-4">
                  All your data is stored locally on your device. Reality Sync never sends your
                  information to the cloud or any external servers.
                </p>
                <div className="bg-accent-blue/10 rounded-lg p-3 border border-accent-blue/20">
                  <p className="text-sm text-navy-700">
                    ✓ No account required<br />
                    ✓ No tracking or analytics<br />
                    ✓ Complete data ownership
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Data Management */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Data Management</h2>
          <div className="space-y-4">
            <Card className="bg-white border-silver-200 luxury-shadow p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700 to-navy-600 flex items-center justify-center flex-shrink-0 luxury-shadow">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900 mb-1">Storage Status</h3>
                  <p className="text-sm text-silver-500 mb-4">
                    Your data is stored in your browser's local storage
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="border-silver-300 text-navy-700 hover:bg-silver-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-white border-destructive/20 luxury-shadow p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-destructive to-red-600 flex items-center justify-center flex-shrink-0 luxury-shadow">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900 mb-1">Danger Zone</h3>
                  <p className="text-sm text-silver-500 mb-4">
                    Permanently delete all vaults, assets, and data. This action cannot be undone.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border-silver-200 luxury-shadow-xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-navy-900">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-silver-600">
                          This will permanently delete all your vaults, assets, rooms, and captured data.
                          This action cannot be undone and your data cannot be recovered.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-silver-300 text-navy-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAllData}
                          className="bg-destructive text-white hover:bg-red-700"
                        >
                          Delete Everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold text-navy-900 mb-4">About</h2>
          <Card className="bg-white border-silver-200 luxury-shadow p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center luxury-shadow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-navy-900 mb-2">Reality Sync</h3>
              <p className="text-sm text-silver-500 mb-4">
                Premium Property Protection<br />
                Time-stamped proof of what you own
              </p>
              <p className="text-xs text-silver-400">
                Version 1.0.0 • Privacy-First Design
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}