// KAIDEN CAPITAL™ - Specialized Engines

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Building2,
  Home,
  Palette,
  TrendingUp,
  FileText,
  Calculator,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const SpecializedEngines: React.FC = () => {
  const [selectedEngine, setSelectedEngine] = useState('sba');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="kaiden-heading-lg mb-2">Specialized Engines</h1>
        <p className="text-muted-foreground">
          Industry-specific tools and calculators for your funding journey
        </p>
      </div>

      {/* Engine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedEngine === 'sba' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setSelectedEngine('sba')}
        >
          <CardHeader>
            <div className="p-3 bg-blue-100 w-fit rounded-lg mb-3">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>SBA Engine</CardTitle>
            <CardDescription>
              Comprehensive SBA loan pathway and readiness assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-500">Business</Badge>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedEngine === 'real-estate' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setSelectedEngine('real-estate')}
        >
          <CardHeader>
            <div className="p-3 bg-green-100 w-fit rounded-lg mb-3">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>Real Estate Engine</CardTitle>
            <CardDescription>
              DSCR calculators, deal analysis, and property financing tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500">Real Estate</Badge>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedEngine === 'creator' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setSelectedEngine('creator')}
        >
          <CardHeader>
            <div className="p-3 bg-purple-100 w-fit rounded-lg mb-3">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Creator Engine</CardTitle>
            <CardDescription>
              Revenue-based financing for creators and digital businesses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className="bg-purple-500">Creator</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Engine Content */}
      <Tabs value={selectedEngine} onValueChange={setSelectedEngine}>
        <TabsContent value="sba" className="space-y-6">
          <SBAEngine />
        </TabsContent>

        <TabsContent value="real-estate" className="space-y-6">
          <RealEstateEngine />
        </TabsContent>

        <TabsContent value="creator" className="space-y-6">
          <CreatorEngine />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SBAEngine: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            SBA 7(a) Loan Readiness
          </CardTitle>
          <CardDescription>
            Assess your eligibility for SBA-backed financing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Eligibility Checklist</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>24+ months in business</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Credit score 680+</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gray-300" />
                  <span>Strong business plan</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gray-300" />
                  <span>3 years tax returns</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Required Documents</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Business tax returns (3 years)</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Personal financial statement</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Profit & Loss statements</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Business plan</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">
              Generate SBA Document Pack
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Estimator</CardTitle>
          <CardDescription>Typical SBA loan process duration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold">Document Preparation</p>
                <p className="text-sm text-muted-foreground">1-2 weeks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold">Lender Review</p>
                <p className="text-sm text-muted-foreground">2-4 weeks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold">SBA Approval</p>
                <p className="text-sm text-muted-foreground">3-4 weeks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div className="flex-1">
                <p className="font-semibold">Funding</p>
                <p className="text-sm text-muted-foreground">Total: 30-60 days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RealEstateEngine: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-500" />
            DSCR Calculator
          </CardTitle>
          <CardDescription>
            Calculate Debt Service Coverage Ratio for investment properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Rent</label>
              <input
                type="number"
                placeholder="$3,500"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Expenses</label>
              <input
                type="number"
                placeholder="$1,200"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Loan Amount</label>
              <input
                type="number"
                placeholder="$250,000"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
              <input
                type="number"
                placeholder="7.5"
                step="0.1"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Estimated DSCR</p>
              <p className="text-5xl font-bold text-green-600 mb-2">1.25</p>
              <p className="text-sm text-green-700">
                ✓ Meets typical lender requirement (1.2+)
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Generate Full Deal Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CreatorEngine: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            Revenue-Based Financing Calculator
          </CardTitle>
          <CardDescription>
            Estimate funding based on your recurring revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Recurring Revenue</label>
              <input
                type="number"
                placeholder="$15,000"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Revenue Consistency (months)</label>
              <input
                type="number"
                placeholder="12"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Estimated Advance</p>
              <p className="text-2xl font-bold text-purple-600">$45,000</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Payback Amount</p>
              <p className="text-2xl font-bold text-blue-600">$54,000</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
              <p className="text-2xl font-bold text-orange-600">$4,500</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-sm">
            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">No Credit Score Required</p>
              <p className="text-blue-700">
                Revenue-based financing evaluates your business performance, not personal credit.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              View Matching Lenders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
