import { useState } from 'react';
import PlatformAccessGate from '@/components/PlatformAccessGate';

// Import Avery pages - using absolute path from project root
import { DashboardPage } from '@/../src/app/pages/dashboard';
import { CallsPage } from '@/../src/app/pages/calls';
import { BookingsPage } from '@/../src/app/pages/bookings';
import { AnalyticsPage } from '@/../src/app/pages/analytics';
import { IntegrationsPage } from '@/../src/app/pages/integrations';
import { SettingsPage } from '@/../src/app/pages/settings';

export default function AveryAIReceptionist() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'calls':
        return <CallsPage onNavigate={setCurrentPage} />;
      case 'bookings':
        return <BookingsPage onNavigate={setCurrentPage} />;
      case 'analytics':
        return <AnalyticsPage onNavigate={setCurrentPage} />;
      case 'integrations':
        return <IntegrationsPage onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <PlatformAccessGate platformSlug="customer-experience-suite">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <h1 className="text-2xl font-bold text-white">Avery AI Receptionist</h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === 'dashboard'
                        ? 'bg-purple-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentPage('calls')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === 'calls'
                        ? 'bg-purple-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Calls
                  </button>
                  <button
                    onClick={() => setCurrentPage('bookings')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === 'bookings'
                        ? 'bg-purple-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Bookings
                  </button>
                  <button
                    onClick={() => setCurrentPage('analytics')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === 'analytics'
                        ? 'bg-purple-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => setCurrentPage('integrations')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === 'integrations'
                        ? 'bg-purple-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Integrations
                  </button>
                  <button
                    onClick={() => setCurrentPage('settings')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === 'settings'
                        ? 'bg-purple-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="container mx-auto px-6 py-8">
          {renderPage()}
        </div>
      </div>
    </PlatformAccessGate>
  );
}
