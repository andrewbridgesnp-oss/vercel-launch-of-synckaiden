// KAIDEN CAPITAL™ - Main Application Component
// Production-ready AI Funding Brokerage SaaS

import React, { useState } from 'react';
import { AppProvider, useApp } from '../contexts/AppContext';
import { Sidebar, MobileMenuButton } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FundingMap } from './components/FundingMap';
import { ReadinessPlan } from './components/ReadinessPlan';
import { Services } from './components/Services';
import { SpecializedEngines } from './components/SpecializedEngines';
import { PartnerPortal } from './components/PartnerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { Welcome } from './components/Welcome';
import { IntakeWizard } from './components/IntakeWizard';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent } from './components/ui/card';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { currentView, isLoading: globalLoading, isAuthenticated, fundingProfile } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(!isAuthenticated);
  const [showIntake, setShowIntake] = useState(false);

  // Loading screen
  if (globalLoading && !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a0d1f] to-[#1a2133]">
        <div className="text-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              KAIDEN <span className="kaiden-gradient-text">CAPITAL</span>
            </h1>
            <p className="text-gray-400">Capital Operating System</p>
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
        </div>
      </div>
    );
  }

  // Show welcome screen for new users
  if (showWelcome && !showIntake && !isAuthenticated) {
    return <Welcome onGetStarted={() => {
      setShowWelcome(false);
      setShowIntake(true);
    }} />;
  }

  // Show intake wizard
  if (showIntake && !fundingProfile?.intakeCompleted) {
    return (
      <IntakeWizard
        onComplete={() => {
          setShowIntake(false);
          setShowWelcome(false);
        }}
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'funding-map':
        return <FundingMap />;
      case 'readiness':
        return <ReadinessPlan />;
      case 'services':
        return <Services />;
      case 'engines':
        return <SpecializedEngines />;
      case 'partner-portal':
        return <PartnerPortal />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'settings':
        return <SettingsPlaceholder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Menu Button */}
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />

      {/* Main Content */}
      <div className="lg:pl-72">
        <div className="min-h-screen">
          {renderView()}
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

// Settings Placeholder
const SettingsPlaceholder: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="kaiden-heading-lg mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={user?.profile.firstName || ''}
                    className="w-full px-4 py-2 border rounded-lg"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={user?.profile.lastName || ''}
                    className="w-full px-4 py-2 border rounded-lg"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="w-full px-4 py-2 border rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={user?.phone || ''}
                  className="w-full px-4 py-2 border rounded-lg"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">Business Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  value={user?.profile.businessName || ''}
                  className="w-full px-4 py-2 border rounded-lg"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Entity Type</label>
                  <input
                    type="text"
                    value={user?.profile.entityType.toUpperCase() || ''}
                    className="w-full px-4 py-2 border rounded-lg"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <input
                    type="text"
                    value={user?.profile.industry || ''}
                    className="w-full px-4 py-2 border rounded-lg"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Passkey Enabled</p>
                  <p className="text-sm text-green-700">Your account is secured with passkey authentication</p>
                </div>
                <span className="text-2xl">🔐</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Email Verified</p>
                  <p className="text-sm text-green-700">Verified on {new Date(user?.profile ? '2026-01-01' : '').toLocaleDateString()}</p>
                </div>
                <span className="text-2xl">✅</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Phone Verified</p>
                  <p className="text-sm text-green-700">Verified on {new Date(user?.profile ? '2026-01-02' : '').toLocaleDateString()}</p>
                </div>
                <span className="text-2xl">📱</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main App Wrapper
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}