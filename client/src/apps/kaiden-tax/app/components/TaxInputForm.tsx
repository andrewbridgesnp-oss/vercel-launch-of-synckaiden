import { useState, useEffect } from 'react';
import { Calculator, Save, Trash2 } from 'lucide-react';
import { TaxReturn } from '@/lib/taxEngine';
import { toast } from 'sonner';
import { RealtimeRefundTracker } from '@/app/components/RealtimeRefundTracker';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface TaxInputFormProps {
  onCalculate: (data: Partial<TaxReturn>) => void;
  initialData?: Partial<TaxReturn>;
}

export function TaxInputForm({ onCalculate, initialData }: TaxInputFormProps) {
  const [formData, setFormData] = useState<Partial<TaxReturn>>(
    initialData || {
      filingStatus: 'single',
      state: 'CA',
      w2Income: 0,
      selfEmploymentIncome: 0,
      interestIncome: 0,
      qualifiedDividends: 0,
      ordinaryDividends: 0,
      shortTermCapitalGains: 0,
      longTermCapitalGains: 0,
      cryptoIncome: 0,
      iraContributions: 0,
      studentLoanInterest: 0,
      hsaContributions: 0,
    }
  );

  // Auto-save to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('kaiden_tax_data', JSON.stringify(formData));
  }, [formData]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('kaiden_tax_data');
    if (saved && !initialData) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    onCalculate(formData);
    toast.success('Tax calculation complete! Scroll down to see results.');
  };

  const handleClear = () => {
    if (confirm('Clear all data? This cannot be undone.')) {
      const empty: Partial<TaxReturn> = {
        filingStatus: 'single',
        state: 'CA',
        w2Income: 0,
        selfEmploymentIncome: 0,
        interestIncome: 0,
        qualifiedDividends: 0,
        ordinaryDividends: 0,
        shortTermCapitalGains: 0,
        longTermCapitalGains: 0,
        cryptoIncome: 0,
        iraContributions: 0,
        studentLoanInterest: 0,
        hsaContributions: 0,
      };
      setFormData(empty);
      sessionStorage.removeItem('kaiden_tax_data');
      toast.success('Data cleared');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-2">Enter Your Tax Information</h2>
            <p className="text-slate-400">Watch your refund update in real-time as you type →</p>
          </div>

          <div className="rounded-xl border p-6 space-y-6"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            {/* Filing Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Filing Status</Label>
                <Select 
                  value={formData.filingStatus} 
                  onValueChange={(value) => updateField('filingStatus', value)}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                    <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                    <SelectItem value="head-of-household">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">State</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => updateField('state', value)}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Income Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700 pb-2">
                Income
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">W-2 Wages</Label>
                  <Input
                    type="number"
                    value={formData.w2Income || ''}
                    onChange={(e) => updateField('w2Income', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Self-Employment Income</Label>
                  <Input
                    type="number"
                    value={formData.selfEmploymentIncome || ''}
                    onChange={(e) => updateField('selfEmploymentIncome', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Interest Income</Label>
                  <Input
                    type="number"
                    value={formData.interestIncome || ''}
                    onChange={(e) => updateField('interestIncome', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Crypto Income</Label>
                  <Input
                    type="number"
                    value={formData.cryptoIncome || ''}
                    onChange={(e) => updateField('cryptoIncome', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Qualified Dividends</Label>
                  <Input
                    type="number"
                    value={formData.qualifiedDividends || ''}
                    onChange={(e) => updateField('qualifiedDividends', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Ordinary Dividends</Label>
                  <Input
                    type="number"
                    value={formData.ordinaryDividends || ''}
                    onChange={(e) => updateField('ordinaryDividends', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Short-Term Capital Gains</Label>
                  <Input
                    type="number"
                    value={formData.shortTermCapitalGains || ''}
                    onChange={(e) => updateField('shortTermCapitalGains', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Long-Term Capital Gains</Label>
                  <Input
                    type="number"
                    value={formData.longTermCapitalGains || ''}
                    onChange={(e) => updateField('longTermCapitalGains', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700 pb-2">
                Deductions & Adjustments
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">IRA Contributions</Label>
                  <Input
                    type="number"
                    value={formData.iraContributions || ''}
                    onChange={(e) => updateField('iraContributions', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Student Loan Interest</Label>
                  <Input
                    type="number"
                    value={formData.studentLoanInterest || ''}
                    onChange={(e) => updateField('studentLoanInterest', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">HSA Contributions</Label>
                  <Input
                    type="number"
                    value={formData.hsaContributions || ''}
                    onChange={(e) => updateField('hsaContributions', parseFloat(e.target.value) || 0)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleCalculate}
                className="flex-1 py-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
                  color: '#ffffff'
                }}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate My Taxes
              </Button>

              <Button
                onClick={handleClear}
                variant="outline"
                className="sm:w-auto"
                style={{
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: '#f87171'
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            <p className="text-xs text-slate-500 text-center mt-4">
              💾 Your data is automatically saved in your browser and never uploaded to our servers unless you create an account.
            </p>
          </div>
        </div>

        {/* Realtime Refund Tracker - Right Side */}
        <div className="lg:col-span-1">
          <RealtimeRefundTracker formData={formData} />
        </div>
      </div>
    </div>
  );
}