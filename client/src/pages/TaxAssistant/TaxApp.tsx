
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { DatabaseDashboard } from './components/DatabaseDashboard';
import { AiAssistant } from './components/AiAssistant';
import { TaxTools } from './components/TaxTools';
import { SupabaseConnectionWidget } from './components/SupabaseConnectionWidget';
import { TermsAcceptance } from './components/TermsAcceptance';
import { DemoWatermark } from './components/DemoWatermark';
import { SkipToContent } from './components/SkipToContent';
import { performanceMonitor } from './lib/performance';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tax' | 'ai' | 'database'>('dashboard');
  const [termsAccepted, setTermsAccepted] = useState(() => {
    return localStorage.getItem('kaiden_terms_accepted') === 'true';
  });

  // FIXED: useCallback ensures this reference stays stable, preventing the Terms dialog from triggering infinite loops
  const handleTermsAccept = useCallback(() => {
    setTermsAccepted(true);
    localStorage.setItem('kaiden_terms_accepted', 'true');
    performanceMonitor.trackEvent('terms_accepted');
  }, []);

  useEffect(() => {
    performanceMonitor.log('app_mount', 'success');
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-kaiden-gold selection:text-white overflow-hidden flex flex-col">
      <SkipToContent />
      <DemoWatermark />
      
      {!termsAccepted && (
        <TermsAcceptance onAccept={handleTermsAccept} />
      )}

      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-700">
              <header className="mb-12">
                <h1 className="text-5xl font-serif font-bold gold-text tracking-tight">Welcome, KAIDEN Elite</h1>
                <p className="text-kaiden-silver mt-3 text-xl font-light">Your private portal for sophisticated fiscal architecture.</p>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-[2rem] bg-kaiden-charcoal border border-kaiden-gold/20 shadow-2xl group hover:border-kaiden-gold/40 transition-all">
                  <h3 className="text-kaiden-gold font-semibold uppercase tracking-widest text-xs mb-4">Projected Returns</h3>
                  <div className="text-4xl font-serif text-white">$248,310.00</div>
                  <div className="h-1 w-full bg-white/5 mt-6 rounded-full overflow-hidden">
                    <div className="h-full gold-bg w-3/4 shadow-[0_0_10px_#B76E79]"></div>
                  </div>
                  <p className="text-[10px] text-kaiden-silver mt-3">Optimized via AI Audit Protection</p>
                </div>

                <div className="p-8 rounded-[2rem] bg-kaiden-charcoal border border-kaiden-gold/20 shadow-2xl group hover:border-kaiden-gold/40 transition-all">
                  <h3 className="text-kaiden-gold font-semibold uppercase tracking-widest text-xs mb-4">Crypto Asset Value</h3>
                  <div className="text-4xl font-serif text-white">32.41 ETH</div>
                  <div className="flex gap-2 mt-6">
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px]">+4.2% today</span>
                    <span className="px-2 py-1 rounded bg-kaiden-gold/10 text-kaiden-gold text-[10px]">Optimized</span>
                  </div>
                  <p className="text-[10px] text-kaiden-silver mt-3">Real-time tracking of 14 elite wallets</p>
                </div>

                <div className="p-8 rounded-[2rem] bg-kaiden-charcoal border border-kaiden-gold/20 shadow-2xl group hover:border-kaiden-gold/40 transition-all">
                  <h3 className="text-kaiden-gold font-semibold uppercase tracking-widest text-xs mb-4">Audit Risk Rating</h3>
                  <div className="text-4xl font-serif text-green-400">Minimal</div>
                  <div className="flex items-center gap-1 mt-6">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1 w-8 rounded-full ${i === 1 ? 'bg-green-400' : 'bg-white/5'}`}></div>
                    ))}
                  </div>
                  <p className="text-[10px] text-kaiden-silver mt-3">Compliant with current IRS standards</p>
                </div>
              </div>

              <div className="mt-12 bg-kaiden-charcoal/50 rounded-[3rem] p-12 border border-kaiden-gold/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150">
                   <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                   </svg>
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-4">
                    Fiscal Trajectory 
                    <span className="text-xs bg-kaiden-gold/20 text-kaiden-gold px-3 py-1 rounded-full uppercase tracking-widest font-sans">Premium Alpha</span>
                  </h2>
                  <div className="h-64 flex items-end gap-3 px-4">
                    {[35, 60, 42, 85, 58, 72, 45, 78, 92, 55, 68, 100].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 gold-bg opacity-20 hover:opacity-100 transition-all duration-500 rounded-t-xl cursor-help group relative"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-kaiden-black border border-kaiden-gold/30 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          M{i+1}: ${h}k
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6 text-[10px] text-kaiden-silver uppercase tracking-widest font-medium opacity-50">
                    <span>JAN 2024</span>
                    <span>DEC 2024 (Projected)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tax' && <TaxTools />}
          {activeTab === 'ai' && <AiAssistant />}
          {activeTab === 'database' && <DatabaseDashboard />}
        </div>
      </Layout>

      <SupabaseConnectionWidget />
    </div>
  );
};

export default App;
