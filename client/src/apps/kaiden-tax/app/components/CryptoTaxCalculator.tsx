import { useState } from 'react';
import { motion } from 'motion/react';
import { calculateCryptoGains, CryptoTransaction, CryptoTaxResult } from '@/lib/cryptoTaxEngine';
import { Bitcoin, TrendingUp, TrendingDown, AlertTriangle, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';

interface CryptoTaxCalculatorProps {
  importedTransactions?: CryptoTransaction[];
}

export function CryptoTaxCalculator({ importedTransactions }: CryptoTaxCalculatorProps) {
  const defaultTransactions: CryptoTransaction[] = [
    {
      id: '1',
      date: new Date('2023-01-15'),
      type: 'buy',
      asset: 'BTC',
      amount: 0.5,
      costBasis: 12000,
      fairMarketValue: 12000,
      exchange: 'Coinbase'
    },
    {
      id: '2',
      date: new Date('2024-06-20'),
      type: 'sell',
      asset: 'BTC',
      amount: 0.5,
      costBasis: 12000,
      fairMarketValue: 16000,
      exchange: 'Coinbase'
    },
    {
      id: '3',
      date: new Date('2023-03-10'),
      type: 'buy',
      asset: 'ETH',
      amount: 5,
      costBasis: 9000,
      fairMarketValue: 9000,
      exchange: 'Binance'
    },
    {
      id: '4',
      date: new Date('2024-08-15'),
      type: 'sell',
      asset: 'ETH',
      amount: 5,
      costBasis: 9000,
      fairMarketValue: 12500,
      exchange: 'Binance'
    },
    {
      id: '5',
      date: new Date('2024-09-01'),
      type: 'stake',
      asset: 'ETH',
      amount: 0.5,
      costBasis: 1250,
      fairMarketValue: 1250,
      exchange: 'Coinbase'
    }
  ];

  const [transactions, setTransactions] = useState<CryptoTransaction[]>(
    importedTransactions && importedTransactions.length > 0 ? importedTransactions : defaultTransactions
  );

  const [accountingMethod, setAccountingMethod] = useState<'fifo' | 'lifo' | 'hifo'>('fifo');
  const [taxResult, setTaxResult] = useState<CryptoTaxResult | null>(null);

  useState(() => {
    const result = calculateCryptoGains(transactions, accountingMethod);
    setTaxResult(result);
  });

  if (!taxResult) return null;

  const totalGainsLosses = taxResult.shortTermGains + taxResult.longTermGains;
  const isProfit = totalGainsLosses > 0;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl text-slate-100 font-light tracking-tight flex items-center gap-3">
              <Bitcoin className="w-10 h-10 text-orange-400" />
              Crypto Tax Calculator
            </h1>
            <p className="text-slate-400 text-sm mt-1">Professional cryptocurrency tax calculations</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2"
              onClick={() => {
                toast.info('Import CSV', {
                  description: 'Navigate to File Manager to import transactions'
                });
              }}
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all flex items-center gap-2"
              onClick={() => {
                toast.success('Export Report', {
                  description: 'Generating comprehensive crypto tax report'
                });
              }}
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Transactions"
            value={transactions.length.toString()}
            icon={Bitcoin}
            color="from-orange-500 to-orange-600"
          />
          <SummaryCard
            label="Short-Term Gains"
            value={`$${Math.round(taxResult.shortTermGains).toLocaleString()}`}
            icon={TrendingUp}
            color={taxResult.shortTermGains >= 0 ? "from-emerald-500 to-emerald-600" : "from-red-500 to-red-600"}
          />
          <SummaryCard
            label="Long-Term Gains"
            value={`$${Math.round(taxResult.longTermGains).toLocaleString()}`}
            icon={TrendingDown}
            color={taxResult.longTermGains >= 0 ? "from-blue-500 to-blue-600" : "from-red-500 to-red-600"}
          />
          <SummaryCard
            label="Estimated Tax"
            value={`$${Math.round(taxResult.taxLiability).toLocaleString()}`}
            icon={AlertTriangle}
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* Accounting Method */}
        <div className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}
        >
          <h2 className="text-lg text-slate-100 font-medium mb-4">Accounting Method</h2>
          <div className="flex gap-3">
            {['fifo', 'lifo', 'hifo'].map((method) => (
              <button
                key={method}
                onClick={() => setAccountingMethod(method as any)}
                className={`px-6 py-3 rounded-xl transition-all ${
                  accountingMethod === method
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-3">
            {accountingMethod === 'fifo' && 'First In, First Out: Sell oldest holdings first'}
            {accountingMethod === 'lifo' && 'Last In, First Out: Sell newest holdings first'}
            {accountingMethod === 'hifo' && 'Highest In, First Out: Sell highest cost basis first (minimizes gains)'}
          </p>
        </div>

        {/* Gains/Losses Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Tax Summary */}
          <div className="p-6 rounded-2xl backdrop-blur-md border"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <h2 className="text-xl text-slate-100 font-medium mb-4">Tax Summary</h2>
            
            <div className="space-y-4">
              <TaxLine 
                label="Short-Term Capital Gains"
                amount={taxResult.shortTermGains}
                rate={24}
                description="Taxed as ordinary income"
              />
              <TaxLine 
                label="Long-Term Capital Gains"
                amount={taxResult.longTermGains}
                rate={15}
                description="Preferential tax rate"
              />
              <TaxLine 
                label="Staking/Mining Income"
                amount={taxResult.ordinaryIncome}
                rate={24}
                description="Taxed as ordinary income"
              />
              
              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium">Total Taxable</span>
                  <span className="text-slate-100 text-xl font-bold">
                    ${Math.round(totalGainsLosses + taxResult.ordinaryIncome).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Estimated Tax Liability</span>
                  <span className="text-purple-400 text-lg font-semibold">
                    ${Math.round(taxResult.taxLiability).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Holdings */}
          <div className="p-6 rounded-2xl backdrop-blur-md border"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <h2 className="text-xl text-slate-100 font-medium mb-4">Current Holdings</h2>
            
            <div className="space-y-3">
              {taxResult.holdings.map((holding) => (
                <div key={holding.asset} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-slate-100 font-medium">{holding.asset}</div>
                      <div className="text-slate-400 text-sm">{holding.quantity.toFixed(4)} units</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-200">${Math.round(holding.currentValue).toLocaleString()}</div>
                      <div className={`text-sm ${holding.unrealizedGainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {holding.unrealizedGainLoss >= 0 ? '+' : ''}${Math.round(holding.unrealizedGainLoss).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Avg Cost: ${holding.averageCostBasis.toFixed(2)}</span>
                    <span>{holding.unrealizedGainLoss >= 0 ? 'Unrealized Gain' : 'Unrealized Loss'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wash Sales Warning */}
        {taxResult.washSales.length > 0 && (
          <div className="p-6 rounded-2xl backdrop-blur-md border border-amber-500/30"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-amber-400 font-medium mb-2">Wash Sale Detection</h3>
                <p className="text-slate-300 text-sm mb-3">
                  We detected {taxResult.washSales.length} potential wash sales. These losses may be disallowed by the IRS.
                </p>
                <div className="space-y-2">
                  {taxResult.washSales.map((ws, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-900/50 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Sold {ws.originalSale.asset}</span>
                        <span className="text-red-400">-${Math.round(ws.disallowedLoss).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-500 text-xs">
                        Repurchased {ws.daysApart} days later - loss may be disallowed
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Recommendations */}
        <div className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}
        >
          <h2 className="text-xl text-slate-100 font-medium mb-4">Tax Optimization Strategies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxResult.recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <h3 className="text-slate-200 font-medium mb-2">{rec.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{rec.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 text-sm font-semibold">
                    ${Math.round(rec.potentialSavings).toLocaleString()} savings
                  </span>
                  {rec.deadline && (
                    <span className="text-amber-400 text-xs">{rec.deadline}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}
        >
          <h2 className="text-xl text-slate-100 font-medium mb-4">Transaction History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Asset</th>
                  <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Amount</th>
                  <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Value</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Exchange</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 text-slate-300 text-sm">
                      {tx.date.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' :
                        tx.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium">{tx.asset}</td>
                    <td className="py-3 px-4 text-slate-300 text-sm text-right">{tx.amount.toFixed(4)}</td>
                    <td className="py-3 px-4 text-slate-200 text-sm text-right">
                      ${Math.round(tx.fairMarketValue).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{tx.exchange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: any) {
  return (
    <motion.div
      className="p-6 rounded-2xl backdrop-blur-md border"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderColor: 'rgba(168, 182, 216, 0.2)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl text-slate-100 font-semibold mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </motion.div>
  );
}

function TaxLine({ label, amount, rate, description }: any) {
  const tax = amount * (rate / 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-slate-300 text-sm">{label}</div>
          <div className="text-slate-500 text-xs">{description}</div>
        </div>
        <div className="text-right">
          <div className={`text-slate-200 font-medium ${amount >= 0 ? '' : 'text-red-400'}`}>
            ${Math.abs(Math.round(amount)).toLocaleString()}
          </div>
          <div className="text-slate-500 text-xs">@ {rate}% = ${Math.round(tax).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}