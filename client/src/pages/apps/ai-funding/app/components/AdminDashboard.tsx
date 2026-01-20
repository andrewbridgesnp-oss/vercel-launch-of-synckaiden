// KAIDEN CAPITAL™ - Admin Dashboard

import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Shield,
  Users,
  AlertTriangle,
  TrendingUp,
  Settings,
  Activity,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useApp();

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-muted-foreground">
              This section is only available to system administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="kaiden-heading-lg mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System controls, trust management, and platform oversight
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold mt-1">1,247</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <p className="text-2xl font-bold mt-1">43</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Events</p>
                <p className="text-2xl font-bold mt-1">7</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold mt-1 text-green-600">99.8%</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="trust">
        <TabsList>
          <TabsTrigger value="trust">Trust Controls</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="partners">Partner Oversight</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="trust" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Thresholds</CardTitle>
              <CardDescription>Configure capability gating levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { capability: 'Browse & View', threshold: 0, description: 'Public access' },
                  { capability: 'Basic Tools', threshold: 30, description: 'Readiness checklists' },
                  { capability: 'Connect Integrations', threshold: 60, description: 'Bank & payment data' },
                  { capability: 'Submit to Partners', threshold: 80, description: 'Full platform access' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{item.capability}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Badge>{item.threshold}+ Trust Score</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Risk Events</CardTitle>
              <CardDescription>Flagged activities requiring review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: 'user_4521', event: 'Multiple failed logins', severity: 'medium', time: '2 hours ago' },
                  { user: 'user_3891', event: 'Suspicious pattern detected', severity: 'high', time: '5 hours ago' },
                  { user: 'user_2104', event: 'Device change flagged', severity: 'low', time: '1 day ago' },
                ].map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.event}</p>
                      <p className="text-xs text-muted-foreground">User: {event.user} • {event.time}</p>
                    </div>
                    <Badge
                      className={
                        event.severity === 'high' ? 'bg-red-500' :
                        event.severity === 'medium' ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }
                    >
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Overview</CardTitle>
              <CardDescription>Recent user activity and management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management tools would appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Management</CardTitle>
              <CardDescription>Active partners and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'FastFund Capital', status: 'active', approvalRate: 71.5, leads: 127 },
                  { name: 'SBA Lending Partners', status: 'active', approvalRate: 65.3, leads: 98 },
                  { name: 'Revenue Finance Co', status: 'active', approvalRate: 78.2, leads: 156 },
                ].map((partner, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {partner.leads} leads • {partner.approvalRate}% approval rate
                      </p>
                    </div>
                    <Badge className="bg-green-500">{partner.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Platform settings and feature flags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Partner Submissions', enabled: true },
                  { name: 'Service Marketplace', enabled: true },
                  { name: 'Real-time Trust Scoring', enabled: true },
                  { name: 'Auto-routing Engine', enabled: false },
                ].map((flag, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <p className="font-medium">{flag.name}</p>
                    <Badge className={flag.enabled ? 'bg-green-500' : 'bg-gray-400'}>
                      {flag.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
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
