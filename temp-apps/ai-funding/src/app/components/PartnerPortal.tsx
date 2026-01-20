// KAIDEN CAPITAL™ - Partner Portal

import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const PartnerPortal: React.FC = () => {
  const { partners, user } = useApp();

  if (!user || (user.role !== 'partner' && user.role !== 'admin')) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Partner Access Required</h3>
            <p className="text-muted-foreground">
              This section is only available to approved partners and affiliates.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock partner data for demonstration
  const mockPartnerStats = {
    totalLeads: 127,
    activeLeads: 23,
    approvedDeals: 45,
    totalRevenue: 12450,
    approvalRate: 0.71,
    avgTimeToDecision: 2.3,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="kaiden-heading-lg mb-2">Partner Portal</h1>
        <p className="text-muted-foreground">
          Manage your leads, offers, and revenue
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold mt-1">{mockPartnerStats.totalLeads}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round(mockPartnerStats.approvalRate * 100)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">
                  ${mockPartnerStats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Decision Time</p>
                <p className="text-2xl font-bold mt-1">{mockPartnerStats.avgTimeToDecision} days</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="leads">
            Leads ({mockPartnerStats.activeLeads})
          </TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Leads</CardTitle>
              <CardDescription>Recent referrals pending decision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">Business Lead #{i + 124}</p>
                      <p className="text-sm text-muted-foreground">
                        Amount: $150,000 • Submitted 2 days ago
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Reviewing</Badge>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Funding Offers</CardTitle>
              <CardDescription>Configure your lending criteria and terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Business Line of Credit</h4>
                      <p className="text-sm text-muted-foreground">$10k - $250k • 12-18% APR</p>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Min Credit Score</p>
                      <p className="font-medium">650</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Min Time in Business</p>
                      <p className="font-medium">12 months</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-3">Edit Offer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Commission payments and revenue tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { month: 'December 2025', amount: 4250, deals: 12 },
                  { month: 'November 2025', amount: 3800, deals: 10 },
                  { month: 'October 2025', amount: 4400, deals: 13 },
                ].map((payout, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{payout.month}</p>
                      <p className="text-sm text-muted-foreground">{payout.deals} deals closed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        ${payout.amount.toLocaleString()}
                      </p>
                      <Button size="sm" variant="ghost">Download Invoice</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
