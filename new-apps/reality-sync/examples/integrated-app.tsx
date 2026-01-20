/**
 * Example 2: Integrated Multi-App Dashboard
 * 
 * Shows how to integrate Reality Sync with other apps
 * using shared context and navigation
 */

import { useState } from 'react';
import { RealitySyncProvider, RealitySync, useRealitySync } from '../src/app';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/app/components/ui/tabs';
import { Card } from '../src/app/components/ui/card';
import { Home, Calendar, CheckSquare, Package } from 'lucide-react';

// Mock other apps
function CalendarApp() {
  return (
    <Card className="p-8 text-center">
      <Calendar className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
      <h2 className="text-xl mb-2">Calendar App</h2>
      <p className="text-neutral-600">Your calendar would go here</p>
    </Card>
  );
}

function TaskManager() {
  return (
    <Card className="p-8 text-center">
      <CheckSquare className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
      <h2 className="text-xl mb-2">Task Manager</h2>
      <p className="text-neutral-600">Your tasks would go here</p>
    </Card>
  );
}

// Dashboard stats using shared Reality Sync context
function DashboardStats() {
  const { vaults, assets } = useRealitySync();
  
  const totalValue = assets.reduce((sum, asset) => {
    const valueMap = { low: 50, medium: 500, high: 2500, very_high: 10000 };
    return sum + (valueMap[asset.valueRange] || 0);
  }, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="text-sm text-neutral-600 mb-1">Total Vaults</div>
        <div className="text-2xl text-neutral-900">{vaults.length}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-neutral-600 mb-1">Total Assets</div>
        <div className="text-2xl text-neutral-900">{assets.length}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-neutral-600 mb-1">Est. Total Value</div>
        <div className="text-2xl text-neutral-900">${totalValue.toLocaleString()}</div>
      </Card>
    </div>
  );
}

export default function IntegratedApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <RealitySyncProvider>
      <div className="min-h-screen bg-neutral-50">
        {/* Top Navigation */}
        <header className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl text-neutral-900">My Dashboard</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">Multi-App Platform</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Tasks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div>
                <h2 className="text-xl text-neutral-900 mb-4">Overview</h2>
                <DashboardStats />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-6">
                    <h3 className="text-lg text-neutral-900 mb-2">Quick Actions</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      Access your most used features
                    </p>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Go to Inventory →
                    </button>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg text-neutral-900 mb-2">Recent Activity</h3>
                    <p className="text-sm text-neutral-600">
                      No recent activity
                    </p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <RealitySync
                initialRoute={{ view: 'vault-list' }}
                onVaultCreated={(vault) => {
                  console.log('✅ Vault created:', vault.name);
                }}
                onAssetAdded={(asset) => {
                  console.log('✅ Asset added:', asset.name);
                }}
                onNavigate={(route) => {
                  console.log('📍 Navigation:', route.view);
                }}
                showToaster={true}
              />
            </TabsContent>

            <TabsContent value="calendar">
              <CalendarApp />
            </TabsContent>

            <TabsContent value="tasks">
              <TaskManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RealitySyncProvider>
  );
}
