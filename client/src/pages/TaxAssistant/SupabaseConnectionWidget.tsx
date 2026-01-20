
import React, { useState, useEffect, useCallback } from 'react';
import { ServiceStatus } from '../types';

export const SupabaseConnectionWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ServiceStatus>({
    database: 'checking',
    auth: 'connected', 
    functions: 'checking'
  });

  const checkConnectivity = useCallback(async () => {
    setStatus(prev => ({ ...prev, database: 'checking', functions: 'checking' }));
    
    // Simulate high-end system check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStatus({
      database: 'offline', // Fallback to local storage in current demo
      auth: 'connected',
      functions: 'error'
    });
  }, []);

  useEffect(() => {
    checkConnectivity();
  }, [checkConnectivity]);

  const StatusItem = ({ label, currentStatus }: { label: string, currentStatus: string }) => {
    const config = {
      connected: { color: 'bg-green-500', shadow: 'shadow-[0_0_10px_#22c55e]' },
      error: { color: 'bg-red-500', shadow: 'shadow-[0_0_10px_#ef4444]' },
      checking: { color: 'bg-kaiden-gold animate-pulse', shadow: 'shadow-[0_0_10px_#B76E79]' },
      offline: { color: 'bg-yellow-500', shadow: 'shadow-[0_0_10px_#eab308]' }
    }[currentStatus as any] || { color: 'bg-kaiden-silver', shadow: '' };

    return (
      <div className="flex items-center justify-between text-[10px] py-2 border-b border-kaiden-gold/5 last:border-0">
        <span className="text-kaiden-silver font-medium uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-3">
          <span className="capitalize text-[9px] font-bold opacity-60">{currentStatus}</span>
          <div className={`w-2 h-2 rounded-full ${config.color} ${config.shadow}`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-[1.5rem] bg-kaiden-black border border-kaiden-gold/30 flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:border-kaiden-gold hover:scale-105 transition-all group"
        >
          <div className="relative">
            <svg className="w-8 h-8 text-kaiden-gold group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-500 border-2 border-kaiden-black animate-pulse"></div>
          </div>
        </button>
      ) : (
        <div className="w-72 bg-kaiden-charcoal border border-kaiden-gold/40 rounded-[2rem] shadow-2xl p-6 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6 border-b border-kaiden-gold/10 pb-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] gold-text">Neural Core</h4>
              <p className="text-[8px] text-kaiden-silver opacity-50">HEARTBEAT MONITOR v4.2</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-kaiden-silver hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1 mb-8">
            <StatusItem label="Encrypted Ledger" currentStatus={status.database} />
            <StatusItem label="Identity Engine" currentStatus={status.auth} />
            <StatusItem label="Fiscal Compute" currentStatus={status.functions} />
          </div>

          <div className="bg-kaiden-black/60 rounded-xl p-4 mb-6 border border-kaiden-gold/5">
            <p className="text-[9px] text-kaiden-silver leading-relaxed italic">
              System is operating in <span className="text-kaiden-gold font-bold">Resilient Mode</span>. Persistent data is currently secured in localized quantum cache.
            </p>
          </div>

          <button 
            onClick={checkConnectivity}
            className="w-full py-3 gold-bg text-kaiden-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg"
          >
            Re-Authorize Sync
          </button>
        </div>
      )}
    </div>
  );
};
