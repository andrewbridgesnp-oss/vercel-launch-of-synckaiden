
import React, { useState } from 'react';

export const TaxTools: React.FC = () => {
  const [income, setIncome] = useState<number>(250000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');

  const calculateTax = () => {
    // Highly simplified mock luxury tax calculation
    const baseRate = filingStatus === 'single' ? 0.35 : 0.28;
    const estTax = income * baseRate;
    const deductions = income * 0.12;
    return {
      tax: estTax,
      net: income - estTax + deductions,
      rate: baseRate * 100
    };
  };

  const results = calculateTax();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif gold-text">Elite Tax Optimization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-kaiden-charcoal border border-kaiden-gold/20 shadow-xl">
          <h3 className="text-xl font-serif text-kaiden-gold mb-6">Income Parameters</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-kaiden-silver mb-2">Annual Gross Income ($)</label>
              <input 
                type="range" 
                min="100000" 
                max="5000000" 
                step="50000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-kaiden-black rounded-lg appearance-none cursor-pointer accent-kaiden-gold"
              />
              <div className="mt-2 text-2xl font-serif tracking-widest text-white">
                ${income.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-sm text-kaiden-silver mb-2">Filing Status</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setFilingStatus('single')}
                  className={`flex-1 py-3 rounded-xl border transition-all ${filingStatus === 'single' ? 'gold-bg text-kaiden-black border-kaiden-gold' : 'border-kaiden-gold/20 text-kaiden-silver'}`}
                >
                  Single
                </button>
                <button 
                  onClick={() => setFilingStatus('married')}
                  className={`flex-1 py-3 rounded-xl border transition-all ${filingStatus === 'married' ? 'gold-bg text-kaiden-black border-kaiden-gold' : 'border-kaiden-gold/20 text-kaiden-silver'}`}
                >
                  Married Filing Jointly
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-kaiden-black border border-kaiden-gold/30 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-kaiden-gold/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          <h3 className="text-xl font-serif text-kaiden-gold mb-6">Estimated Projection</h3>
          
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-kaiden-silver mb-1">Effective Tax Rate</p>
              <div className="text-4xl font-serif text-white">{results.rate}%</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-kaiden-silver uppercase">Estimated Tax</p>
                <p className="text-xl font-serif text-red-400">${results.tax.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-kaiden-silver uppercase">After-Tax Net</p>
                <p className="text-xl font-serif text-green-400">${results.net.toLocaleString()}</p>
              </div>
            </div>

            <button className="w-full py-4 bg-transparent border border-kaiden-gold text-kaiden-gold font-bold rounded-2xl hover:bg-kaiden-gold hover:text-kaiden-black transition-all">
              Download Detailed Fiscal Analysis (PDF)
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-kaiden-charcoal border border-kaiden-gold/20">
        <h3 className="text-xl font-serif text-kaiden-gold mb-4">Crypto Wash-Sale Watch</h3>
        <p className="text-kaiden-silver mb-6 text-sm">Our AI monitors your wallet 24/7 for tax-loss harvesting opportunities.</p>
        <div className="flex items-center gap-4 flex-wrap">
          {['BTC', 'ETH', 'SOL', 'USDC'].map(coin => (
            <div key={coin} className="px-4 py-2 bg-kaiden-black border border-kaiden-gold/10 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">{coin} Optimized</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
