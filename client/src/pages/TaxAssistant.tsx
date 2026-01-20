import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, FileText, Shield, Sparkles, DollarSign } from 'lucide-react';

export default function TaxAssistant() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [taxResult, setTaxResult] = useState<number | null>(null);

  const calculateTax = () => {
    const incomeNum = parseFloat(income) || 0;
    const deductionsNum = parseFloat(deductions) || 0;
    const taxableIncome = Math.max(0, incomeNum - deductionsNum);
    
    // Simplified progressive tax calculation (2024 rates)
    let tax = 0;
    if (taxableIncome <= 11000) {
      tax = taxableIncome * 0.10;
    } else if (taxableIncome <= 44725) {
      tax = 1100 + (taxableIncome - 11000) * 0.12;
    } else if (taxableIncome <= 95375) {
      tax = 5147 + (taxableIncome - 44725) * 0.22;
    } else if (taxableIncome <= 182100) {
      tax = 16290 + (taxableIncome - 95375) * 0.24;
    } else if (taxableIncome <= 231250) {
      tax = 37104 + (taxableIncome - 182100) * 0.32;
    } else if (taxableIncome <= 578125) {
      tax = 52832 + (taxableIncome - 231250) * 0.35;
    } else {
      tax = 174238.25 + (taxableIncome - 578125) * 0.37;
    }
    
    setTaxResult(Math.round(tax));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">KAIDEN LUXURY TAX SUITE</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Elite Tax Intelligence
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Sophisticated fiscal architecture powered by AI. Optimize returns, minimize risk, maximize wealth preservation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-900/50 border border-zinc-800">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400">
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400">
              <Calculator className="w-4 h-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="strategies" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400">
              <Shield className="w-4 h-4 mr-2" />
              Strategies
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur">
                <CardHeader>
                  <CardDescription className="text-amber-400 text-xs uppercase tracking-wider">Projected Returns</CardDescription>
                  <CardTitle className="text-4xl text-white">$248,310</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 w-3/4"></div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-3">Optimized via AI Audit Protection</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur">
                <CardHeader>
                  <CardDescription className="text-amber-400 text-xs uppercase tracking-wider">Crypto Asset Value</CardDescription>
                  <CardTitle className="text-4xl text-white">32.41 ETH</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">+4.2% today</span>
                    <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs">Optimized</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-3">Real-time tracking of 14 elite wallets</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur">
                <CardHeader>
                  <CardDescription className="text-amber-400 text-xs uppercase tracking-wider">Audit Risk Rating</CardDescription>
                  <CardTitle className="text-4xl text-green-400">Minimal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i === 1 ? 'bg-green-400' : 'bg-zinc-800'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500 mt-3">Compliant with current IRS standards</p>
                </CardContent>
              </Card>
            </div>

            {/* Fiscal Trajectory Chart */}
            <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-white">Fiscal Trajectory</CardTitle>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full uppercase tracking-wider">Premium Alpha</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {[35, 60, 42, 85, 58, 72, 45, 78, 92, 55, 68, 100].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-amber-500/80 to-amber-600/80 rounded-t-lg hover:from-amber-500 hover:to-amber-600 transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`Month ${i + 1}: $${height}k`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-zinc-500 uppercase tracking-wider">
                  <span>JAN 2024</span>
                  <span>DEC 2024 (Projected)</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="mt-8">
            <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Tax Calculator</CardTitle>
                <CardDescription className="text-zinc-400">Calculate your estimated tax liability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="income" className="text-zinc-300">Annual Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <Input
                        id="income"
                        type="number"
                        placeholder="150000"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="pl-10 bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deductions" className="text-zinc-300">Total Deductions</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <Input
                        id="deductions"
                        type="number"
                        placeholder="25000"
                        value={deductions}
                        onChange={(e) => setDeductions(e.target.value)}
                        className="pl-10 bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={calculateTax}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Tax
                  </Button>
                </div>

                {taxResult !== null && (
                  <div className="mt-6 p-6 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-400 uppercase tracking-wider mb-2">Estimated Tax Liability</p>
                    <p className="text-4xl font-bold text-white">${taxResult.toLocaleString()}</p>
                    <p className="text-xs text-zinc-400 mt-2">Based on 2024 federal tax brackets (single filer)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="mt-8">
            <div className="grid gap-6">
              {[
                {
                  title: 'Retirement Account Maximization',
                  description: 'Leverage 401(k) and IRA contributions to reduce taxable income while building long-term wealth.',
                  savings: '$8,500/year',
                },
                {
                  title: 'Crypto Tax-Loss Harvesting',
                  description: 'Strategically realize losses to offset capital gains while maintaining market exposure.',
                  savings: '$12,300/year',
                },
                {
                  title: 'Business Entity Optimization',
                  description: 'Structure your business as an S-Corp or LLC to minimize self-employment taxes.',
                  savings: '$15,700/year',
                },
                {
                  title: 'Charitable Giving Strategy',
                  description: 'Maximize deductions through donor-advised funds and appreciated asset donations.',
                  savings: '$6,200/year',
                },
              ].map((strategy, i) => (
                <Card key={i} className="bg-zinc-900/50 border-amber-500/20 backdrop-blur hover:border-amber-500/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-white">{strategy.title}</CardTitle>
                        <CardDescription className="text-zinc-400 mt-2">{strategy.description}</CardDescription>
                      </div>
                      <span className="text-green-400 font-semibold whitespace-nowrap ml-4">{strategy.savings}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-8">
            <Card className="bg-zinc-900/50 border-amber-500/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Tax Documents</CardTitle>
                <CardDescription className="text-zinc-400">Upload and manage your tax documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center hover:border-amber-500/50 transition-colors cursor-pointer">
                  <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 mb-2">Drag and drop files here, or click to browse</p>
                  <p className="text-xs text-zinc-600">Supported: PDF, DOC, XLS, CSV</p>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { name: 'W-2_2024.pdf', date: 'Jan 15, 2025', size: '245 KB' },
                    { name: '1099-MISC_2024.pdf', date: 'Jan 12, 2025', size: '189 KB' },
                    { name: 'Crypto_Transactions_2024.csv', date: 'Jan 10, 2025', size: '87 KB' },
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{doc.name}</p>
                          <p className="text-zinc-500 text-xs">{doc.date} • {doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
