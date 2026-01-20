
import React, { useEffect, useCallback } from 'react';

interface TermsAcceptanceProps {
  onAccept: () => void;
}

export const TermsAcceptance: React.FC<TermsAcceptanceProps> = ({ onAccept }) => {
  // Prevent scrolling when terms are open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Stabilize the button click
  const handleInternalAccept = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onAccept();
  }, [onAccept]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-kaiden-black/98 backdrop-blur-2xl">
      <div className="w-full max-w-2xl bg-kaiden-charcoal border border-kaiden-gold/50 rounded-[3rem] shadow-[0_0_100px_rgba(183,110,121,0.3)] overflow-hidden animate-in zoom-in-95 duration-700">
        <div className="p-10 md:p-16 text-center">
          <div className="w-20 h-20 gold-bg rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-2xl animate-pulse">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          
          <h2 className="text-4xl font-serif font-bold text-white mb-6">Elite Compliance Protocol</h2>
          <p className="text-kaiden-silver mb-10 text-lg font-light leading-relaxed">
            Welcome to the KAIDEN Luxury Tax Suite. Access is strictly reserved for verified elite users who adhere to our rigorous fiscal privacy standards.
          </p>

          <div className="space-y-4 mb-12 max-h-40 overflow-y-auto pr-4 text-left custom-scrollbar text-xs text-kaiden-silver/60 border-y border-kaiden-gold/10 py-6">
            <p className="flex gap-3"><span className="text-kaiden-gold">01</span> All interactions are encrypted via 256-bit AES protocols.</p>
            <p className="flex gap-3"><span className="text-kaiden-gold">02</span> AI fiscal architectural advice is provided as-is for strategic simulation.</p>
            <p className="flex gap-3"><span className="text-kaiden-gold">03</span> Database persistency uses an offline-first high-availability architecture.</p>
            <p className="flex gap-3"><span className="text-kaiden-gold">04</span> You acknowledge full responsibility for final regulatory submissions.</p>
            <p className="flex gap-3"><span className="text-kaiden-gold">05</span> High-net-worth privacy is our ultimate operational priority.</p>
          </div>

          <button 
            onClick={handleInternalAccept}
            className="w-full py-5 gold-bg text-kaiden-black font-black uppercase tracking-[0.2em] rounded-2xl text-lg hover:brightness-110 active:scale-95 transition-all shadow-[0_15px_40px_rgba(183,110,121,0.4)]"
          >
            Authorize Entry
          </button>
          
          <p className="mt-8 text-[9px] uppercase tracking-widest text-kaiden-silver/30">
            System Hash: {Math.random().toString(16).substring(2, 10).toUpperCase()} • SECURE SESSION INITIALIZED
          </p>
        </div>
      </div>
    </div>
  );
};
