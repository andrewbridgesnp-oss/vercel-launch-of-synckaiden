import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { calculateTax, TaxReturn, TaxResult } from '@/lib/taxEngine';
import { exportTaxReturnAsCSV } from '@/lib/csvExport';
import { PricingModal } from '@/app/components/PricingModal';
import { AuthModal } from '@/app/components/AuthModal';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Download,
  CreditCard,
  Save
} from 'lucide-react';

import { toast } from 'sonner';
import { supabase, API_BASE_URL } from '@/lib/supabase';
import { publicAnonKey } from '/utils/supabase/info';

interface TaxDashboardProps {
  importedData?: Partial<TaxReturn>;
}

export function TaxDashboard({ importedData }: TaxDashboardProps) {
  const [pricingOpen, setPricingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleExportCSV = () => {
    exportTaxReturnAsCSV(taxReturn);
    toast.success('Tax return exported to CSV successfully!');
  };

  const handleSaveTaxReturn = async () => {
    if (!user) {
      setAuthMode('signup');
      setAuthOpen(true);
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      const response = await fetch(`${API_BASE_URL}/save-tax-return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(taxReturn)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Tax return saved successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save tax return');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  const defaultTaxReturn: TaxReturn = {
    filingStatus: 'single',
    income: {
      wages: 85000,
      selfEmployment: 25000,
      interest: 500,
      dividends: { qualified: 1200, ordinary: 300 },
      capitalGains: { shortTerm: 3000, longTerm: 5000 },
      rentalIncome: 0,
      retirement: 0,
      other: 0
    },
    deductions: {
      method: 'standard',
      mortgageInterest: 0,
      propertyTax: 0,
      stateLocalTax: 0,
      charitableCash: 0,
      charitableNonCash: 0,
      medicalExpenses: 0,
      other: 0
    },
    adjustments: {
      traditionalIRA: 5000,
      studentLoanInterest: 1500,
      hsaContribution: 2000,
      selfEmploymentTax: 0,
      other: 0
    },
    credits: {
      childTaxCredit: 0,
      earnedIncomeCredit: 0,
      educationCredit: 0,
      other: 0
    },
    dependents: 0,
    age: 35,
    state: 'CA'
  };

  const [taxReturn, setTaxReturn] = useState<TaxReturn>({
    ...defaultTaxReturn,
    ...importedData
  });

  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const [withholding, setWithholding] = useState(18000);

  useEffect(() => {
    const result = calculateTax(taxReturn, withholding);
    setTaxResult(result);
  }, [taxReturn, withholding]);

  if (!taxResult) return null;

  const topOptimizations = taxResult.optimizations.slice(0, 4);
  const totalPotentialSavings = topOptimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl text-slate-100 font-light tracking-tight">
              Tax Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">2024 Tax Year Analysis</p>
          </div>
          
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium transition-all flex items-center gap-2 shadow-lg"
            onClick={() => {
              toast.success('File Return', {
                description: 'This feature will electronically file your tax return to the IRS. Coming soon!'
              });
            }}
          >
            <FileText className="w-5 h-5" />
            File Return
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={DollarSign}
            label="Total Income"
            value={`$${Math.round(taxResult.grossIncome).toLocaleString()}`}
            subtext="Gross income"
            color="from-blue-500 to-blue-600"
          />
          
          <MetricCard
            icon={Calculator}
            label="Total Tax"
            value={`$${Math.round(taxResult.totalTax).toLocaleString()}`}
            subtext={`${(taxResult.effectiveRate * 100).toFixed(1)}% effective rate`}
            color="from-purple-500 to-purple-600"
          />
          
          <MetricCard
            icon={taxResult.refundOrOwed >= 0 ? TrendingUp : TrendingDown}
            label={taxResult.refundOrOwed >= 0 ? "Refund" : "Amount Owed"}
            value={`$${Math.abs(Math.round(taxResult.refundOrOwed)).toLocaleString()}`}
            subtext={taxResult.refundOrOwed >= 0 ? "Coming back to you" : "Payment required"}
            color={taxResult.refundOrOwed >= 0 ? "from-emerald-500 to-emerald-600" : "from-red-500 to-red-600"}
          />
          
          <MetricCard
            icon={Target}
            label="Savings Opportunity"
            value={`$${Math.round(totalPotentialSavings).toLocaleString()}`}
            subtext={`${topOptimizations.length} recommendations`}
            color="from-amber-500 to-amber-600"
          />
        </div>

        {/* Tax Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Income Breakdown */}
          <div className="p-6 rounded-2xl backdrop-blur-md border"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <h2 className="text-xl text-slate-100 font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Income Breakdown
            </h2>
            
            <div className="space-y-3">
              <BreakdownItem 
                label="Wages (W-2)" 
                amount={taxReturn.income.wages}
                total={taxResult.grossIncome}
              />
              <BreakdownItem 
                label="Self-Employment" 
                amount={taxReturn.income.selfEmployment}
                total={taxResult.grossIncome}
              />
              <BreakdownItem 
                label="Capital Gains (ST)" 
                amount={taxReturn.income.capitalGains.shortTerm}
                total={taxResult.grossIncome}
              />
              <BreakdownItem 
                label="Capital Gains (LT)" 
                amount={taxReturn.income.capitalGains.longTerm}
                total={taxResult.grossIncome}
              />
              <BreakdownItem 
                label="Dividends & Interest" 
                amount={taxReturn.income.interest + taxReturn.income.dividends.qualified + taxReturn.income.dividends.ordinary}
                total={taxResult.grossIncome}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Gross Income</span>
                <span className="text-slate-100 text-lg font-semibold">
                  ${Math.round(taxResult.grossIncome).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Tax Calculation Flow */}
          <div className="p-6 rounded-2xl backdrop-blur-md border"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <h2 className="text-xl text-slate-100 font-medium mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              Tax Calculation
            </h2>
            
            <div className="space-y-4">
              <FlowItem 
                label="Gross Income"
                amount={taxResult.grossIncome}
              />
              <FlowItem 
                label="Adjustments"
                amount={-(taxResult.grossIncome - taxResult.adjustedGrossIncome)}
                isSubtraction
              />
              <FlowItem 
                label="Adjusted Gross Income"
                amount={taxResult.adjustedGrossIncome}
                highlight
              />
              <FlowItem 
                label={`${taxResult.deductions.type === 'standard' ? 'Standard' : 'Itemized'} Deduction`}
                amount={-taxResult.deductions.amount}
                isSubtraction
              />
              <FlowItem 
                label="Taxable Income"
                amount={taxResult.taxableIncome}
                highlight
              />
              <FlowItem 
                label="Tax Before Credits"
                amount={taxResult.federalTax + taxResult.stateTax + taxResult.selfEmploymentTax}
              />
              <FlowItem 
                label="Tax Credits"
                amount={-taxResult.credits}
                isSubtraction
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Total Tax Liability</span>
                <span className="text-slate-100 text-xl font-bold">
                  ${Math.round(taxResult.totalTax).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Brackets */}
        <div className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}
        >
          <h2 className="text-xl text-slate-100 font-medium mb-4">Federal Tax Brackets</h2>
          <div className="space-y-2">
            {taxResult.breakdown.map((bracket, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-16 text-slate-400 text-sm">{bracket.bracket}</div>
                <div className="flex-1 h-8 bg-slate-800/50 rounded-lg overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-60"
                    initial={{ width: 0 }}
                    animate={{ width: `${(bracket.income / taxResult.taxableIncome) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                  />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-slate-200 text-sm font-medium">
                      ${Math.round(bracket.income).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-24 text-right text-slate-300 text-sm">
                  ${Math.round(bracket.tax).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">Marginal Rate: {(taxResult.marginalRate * 100).toFixed(0)}%</span>
            <span className="text-slate-400">Effective Rate: {(taxResult.effectiveRate * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Optimization Opportunities */}
        <div className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}
        >
          <h2 className="text-xl text-slate-100 font-medium mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            AI-Powered Tax Optimizations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topOptimizations.map((opt) => (
              <OptimizationCard key={opt.id} optimization={opt} />
            ))}
          </div>

          {taxResult.optimizations.length > 4 && (
            <button className="mt-4 w-full py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-slate-200 transition-colors flex items-center justify-center gap-2">
              View All {taxResult.optimizations.length} Recommendations
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 rounded-2xl backdrop-blur-md border"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}
        >
          <h2 className="text-xl text-slate-100 font-medium mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium transition-all flex items-center gap-2 shadow-lg"
              onClick={handleSaveTaxReturn}
            >
              <Save className="w-5 h-5" />
              Save Tax Return
            </button>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all flex items-center gap-2 shadow-lg"
              onClick={handleExportCSV}
            >
              <Download className="w-5 h-5" />
              Export as CSV
            </button>
            {user && (
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all flex items-center gap-2 shadow-lg"
                onClick={handleSignOut}
              >
                <ArrowRight className="w-5 h-5" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} mode={authMode} />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subtext, color }: any) {
  return (
    <motion.div
      className="p-6 rounded-2xl backdrop-blur-md border hover:scale-[1.02] transition-transform"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderColor: 'rgba(168, 182, 216, 0.2)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-3xl text-slate-100 font-semibold mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-xs text-slate-500 mt-1">{subtext}</div>
    </motion.div>
  );
}

function BreakdownItem({ label, amount, total }: any) {
  const percentage = (amount / total) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-200 font-medium">${Math.round(amount).toLocaleString()}</span>
      </div>
      <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
}

function FlowItem({ label, amount, isSubtraction, highlight }: any) {
  return (
    <div className={`flex justify-between items-center py-2 ${highlight ? 'border-y border-slate-700/50' : ''}`}>
      <span className={`text-sm ${highlight ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
        {label}
      </span>
      <span className={`text-sm font-mono ${
        isSubtraction 
          ? 'text-red-400' 
          : highlight 
          ? 'text-slate-100 font-semibold' 
          : 'text-slate-300'
      }`}>
        {isSubtraction ? '-' : ''}${Math.abs(Math.round(amount)).toLocaleString()}
      </span>
    </div>
  );
}

function OptimizationCard({ optimization }: any) {
  const getIcon = () => {
    switch(optimization.category) {
      case 'retirement': return CheckCircle;
      case 'deduction': return FileText;
      case 'credit': return DollarSign;
      case 'timing': return AlertCircle;
      default: return Lightbulb;
    }
  };

  const getColor = () => {
    switch(optimization.confidence) {
      case 'high': return 'from-emerald-500 to-emerald-600';
      case 'medium': return 'from-blue-500 to-blue-600';
      case 'low': return 'from-amber-500 to-amber-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const Icon = getIcon();
  const color = getColor();

  return (
    <motion.div
      className="p-4 rounded-xl backdrop-blur-sm border hover:border-slate-600/50 transition-colors cursor-pointer"
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        borderColor: 'rgba(168, 182, 216, 0.15)',
      }}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-200 text-sm font-medium mb-1">{optimization.title}</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold">
              ${Math.round(optimization.potentialSavings).toLocaleString()} savings
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 capitalize">{optimization.complexity}</span>
          </div>
        </div>
      </div>
      <p className="text-slate-400 text-xs leading-relaxed mb-3">
        {optimization.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{optimization.action}</span>
        {optimization.deadline && (
          <span className="text-xs text-amber-400">{optimization.deadline}</span>
        )}
      </div>
    </motion.div>
  );
}