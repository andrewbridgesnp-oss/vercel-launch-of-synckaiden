
import React, { useState, useEffect, useCallback } from 'react';
import { KVRecord } from '../types';

export const DatabaseDashboard: React.FC = () => {
  const [records, setRecords] = useState<KVRecord[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<KVRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate real-world connectivity logic
      const response = await fetch('/api/kv/list').catch(() => ({ ok: false }));
      
      if ('ok' in response && response.ok) {
        const data = await (response as Response).json();
        setRecords(data);
        setIsOffline(false);
      } else {
        // ROBUST OFFLINE FALLBACK
        const localDataString = localStorage.getItem('kaiden_kv_store');
        const localData = localDataString ? JSON.parse(localDataString) : [];
        setRecords(localData);
        setIsOffline(true);
      }
    } catch (err) {
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSetRecord = async () => {
    if (!newKey || !newValue) return;

    const newRecord: KVRecord = {
      key: newKey,
      value: newValue,
      updated_at: new Date().toISOString()
    };

    if (isOffline) {
      const current = JSON.parse(localStorage.getItem('kaiden_kv_store') || '[]');
      const updated = [...current.filter((r: any) => r.key !== newKey), newRecord];
      localStorage.setItem('kaiden_kv_store', JSON.stringify(updated));
      setRecords(updated);
    } else {
      setRecords(prev => [...prev.filter(r => r.key !== newKey), newRecord]);
    }
    setNewKey('');
    setNewValue('');
  };

  const handleDeleteRecord = (key: string) => {
    const updated = records.filter(r => r.key !== key);
    if (isOffline) {
      localStorage.setItem('kaiden_kv_store', JSON.stringify(updated));
    }
    setRecords(updated);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-serif gold-text font-bold">Encrypted Ledger</h2>
          <p className="text-kaiden-silver mt-1">Direct access to the KAIDEN persistent storage layer.</p>
        </div>
        {isOffline && (
          <div className="px-4 py-2 rounded-2xl bg-yellow-900/20 text-yellow-500 border border-yellow-500/30 text-xs flex items-center shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-3 animate-pulse"></span>
            LOCAL PERSISTENCE ACTIVE
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Entry Form */}
        <div className="lg:col-span-4 p-8 rounded-[2.5rem] bg-kaiden-charcoal border border-kaiden-gold/20 shadow-2xl">
          <h3 className="text-xl font-serif mb-6 text-kaiden-gold font-bold">New Ledger Entry</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-kaiden-gold uppercase tracking-widest mb-2">Record Identifier</label>
              <input 
                type="text" 
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. portfolio:assets:main"
                className="w-full bg-kaiden-black border border-kaiden-gold/20 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-kaiden-gold/50 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-kaiden-gold uppercase tracking-widest mb-2">Payload (JSON/String)</label>
              <textarea 
                rows={6}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder='{ "type": "asset", "value": 500000 }'
                className="w-full bg-kaiden-black border border-kaiden-gold/20 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-kaiden-gold/50 transition-all font-mono text-sm resize-none"
              />
            </div>
            <button 
              onClick={handleSetRecord}
              className="w-full py-5 gold-bg text-kaiden-black font-black uppercase tracking-widest rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_10px_30px_rgba(183,110,121,0.3)]"
            >
              Commit to Ledger
            </button>
          </div>
        </div>

        {/* Record List */}
        <div className="lg:col-span-8 p-8 rounded-[2.5rem] bg-kaiden-charcoal border border-kaiden-gold/20 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-serif text-kaiden-gold font-bold">Persistent Registry</h3>
             <button 
               onClick={fetchRecords} 
               disabled={isLoading}
               className="p-3 bg-kaiden-black/50 border border-kaiden-gold/20 rounded-xl text-kaiden-silver hover:text-kaiden-gold transition-all disabled:opacity-50"
             >
               <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
               </svg>
             </button>
          </div>

          <div className="min-h-[400px]">
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-kaiden-silver border-2 border-dashed border-kaiden-gold/10 rounded-3xl">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="font-serif italic text-lg">Your ledger is currently pristine.</p>
                <p className="text-xs mt-2 opacity-50 uppercase tracking-widest">Awaiting fiscal data entry</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-kaiden-gold/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-kaiden-black border-b border-kaiden-gold/20 text-kaiden-gold text-[10px] uppercase tracking-[0.2em] font-black">
                      <th className="py-5 px-6">ID</th>
                      <th className="py-5 px-6">Preview</th>
                      <th className="py-5 px-6">Timestamp</th>
                      <th className="py-5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-kaiden-gold/5">
                    {records.map((record) => (
                      <tr key={record.key} className="hover:bg-kaiden-gold/5 transition-colors group">
                        <td className="py-5 px-6 font-mono text-xs text-white">{record.key}</td>
                        <td className="py-5 px-6 text-xs text-kaiden-silver truncate max-w-[150px]">
                          {typeof record.value === 'string' ? record.value : 'Object Payload'}
                        </td>
                        <td className="py-5 px-6 text-[10px] text-kaiden-silver/50">
                          {new Date(record.updated_at).toLocaleTimeString()}
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setSelectedRecord(record)}
                              className="p-2 bg-kaiden-gold/10 rounded-lg text-kaiden-gold hover:bg-kaiden-gold hover:text-kaiden-black transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteRecord(record.key)}
                              className="p-2 bg-red-900/10 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-kaiden-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-kaiden-charcoal border border-kaiden-gold/40 rounded-[3rem] shadow-[0_0_80px_rgba(183,110,121,0.2)] overflow-hidden">
            <div className="p-8 border-b border-kaiden-gold/10 flex items-center justify-between bg-kaiden-black/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 gold-bg rounded-xl flex items-center justify-center">
                   <svg className="w-5 h-5 text-kaiden-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-kaiden-gold font-bold">Encrypted Record</h3>
                  <p className="text-[10px] text-kaiden-silver uppercase tracking-widest">{selectedRecord.key}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="p-3 text-kaiden-silver hover:text-white transition-colors hover:rotate-90 duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-10">
              <div className="p-8 bg-kaiden-black rounded-3xl border border-kaiden-gold/20 shadow-inner overflow-auto max-h-[500px]">
                <pre className="font-mono text-sm text-kaiden-gold leading-relaxed">
                  {JSON.stringify(selectedRecord.value, null, 2)}
                </pre>
              </div>
            </div>
            <div className="p-8 bg-kaiden-black/40 border-t border-kaiden-gold/10 flex justify-end gap-4">
               <button 
                onClick={() => setSelectedRecord(null)}
                className="px-8 py-3 bg-kaiden-gold text-kaiden-black font-bold rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
