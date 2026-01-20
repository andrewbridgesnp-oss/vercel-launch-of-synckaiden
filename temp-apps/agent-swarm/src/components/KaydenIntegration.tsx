import { useState, useEffect } from 'react';
import { Wifi, WifiOff, ExternalLink, RefreshCw } from 'lucide-react';

export function KaydenIntegration() {
  const [isConnected, setIsConnected] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error'>('synced');
  const [lastSync, setLastSync] = useState('Just now');

  useEffect(() => {
    // Simulate periodic sync
    const interval = setInterval(() => {
      setSyncStatus('syncing');
      setTimeout(() => {
        setSyncStatus('synced');
        setLastSync('Just now');
      }, 1500);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleManualSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSync('Just now');
    }, 1500);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-blue-800/30">
        <div className="relative">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          {syncStatus === 'syncing' && (
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Kayden AI</span>
            <a
              href="https://synckaiden.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span className={`text-xs ${
            isConnected ? 'text-green-400' : 'text-red-400'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Sync Status */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-blue-800/30">
        <button
          onClick={handleManualSync}
          disabled={syncStatus === 'syncing'}
          className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
        </button>
        <div className="flex flex-col">
          <span className="text-white text-sm">
            {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : 'Error'}
          </span>
          <span className="text-blue-400 text-xs">{lastSync}</span>
        </div>
      </div>

      {/* Active Consultations */}
      <div className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-600/30">
        <div className="text-white text-sm">Real-time Consulting</div>
        <div className="text-purple-300 text-xs">3 active sessions</div>
      </div>
    </div>
  );
}
