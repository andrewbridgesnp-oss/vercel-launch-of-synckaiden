import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';
import { VoiceCommand } from './components/VoiceCommand';
import { KaydenIntegration } from './components/KaydenIntegration';
import { Bell, Download } from 'lucide-react';

// Lazy load heavy components for better initial load performance
const SwarmDashboard = lazy(() => import('./components/SwarmDashboard').then(m => ({ default: m.SwarmDashboard })));
const AgentGrid = lazy(() => import('./components/AgentGrid').then(m => ({ default: m.AgentGrid })));
const PredictiveAnalytics = lazy(() => import('./components/PredictiveAnalytics').then(m => ({ default: m.PredictiveAnalytics })));
const WorkflowAutomation = lazy(() => import('./components/WorkflowAutomation').then(m => ({ default: m.WorkflowAutomation })));
const WorkflowBuilder = lazy(() => import('./components/WorkflowBuilder').then(m => ({ default: m.WorkflowBuilder })));
const AgentPerformanceAnalytics = lazy(() => import('./components/AgentPerformanceAnalytics').then(m => ({ default: m.AgentPerformanceAnalytics })));
const AIInsightsFeed = lazy(() => import('./components/AIInsightsFeed').then(m => ({ default: m.AIInsightsFeed })));
const N8nTemplates = lazy(() => import('./components/N8nTemplates').then(m => ({ default: m.N8nTemplates })));

type TabId = 'dashboard' | 'agents' | 'analytics' | 'workflows' | 'builder' | 'performance' | 'templates';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'dashboard', label: 'Swarm Dashboard' },
  { id: 'agents', label: 'Agent Management' },
  { id: 'analytics', label: 'Predictive Analytics' },
  { id: 'performance', label: 'Performance Analytics' },
  { id: 'workflows', label: 'Automation Workflows' },
  { id: 'builder', label: 'Workflow Builder' },
  { id: 'templates', label: 'n8n Templates' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [showInsightsFeed, setShowInsightsFeed] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Memoize export handler to prevent recreation
  const handleExport = useCallback(() => {
    setIsExporting(true);
    
    const data = {
      timestamp: new Date().toISOString(),
      platform: 'Kaiden AI Swarm™',
      version: '2026.1.0',
      message: 'Export functionality ready for GitHub deployment'
    };
    
    // Simulate export process
    setTimeout(() => {
      console.warn('Exporting application data:', data);
      alert('Application exported successfully! Ready for GitHub upload.');
      setIsExporting(false);
    }, 500);
  }, []);

  // Memoize toggle insights handler
  const toggleInsightsFeed = useCallback(() => {
    setShowInsightsFeed(prev => !prev);
  }, []);

  // Prefetch components on hover for smoother transitions
  const handleTabHover = useCallback((tabId: TabId) => {
    // Prefetch logic can be added here
  }, []);

  // Memoize active component to prevent unnecessary re-renders
  const ActiveComponent = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return <SwarmDashboard />;
      case 'agents':
        return <AgentGrid />;
      case 'analytics':
        return <PredictiveAnalytics />;
      case 'performance':
        return <AgentPerformanceAnalytics />;
      case 'workflows':
        return <WorkflowAutomation />;
      case 'builder':
        return <WorkflowBuilder />;
      case 'templates':
        return <N8nTemplates />;
      default:
        return <SwarmDashboard />;
    }
  }, [activeTab]);

  // Add document title based on active tab
  useEffect(() => {
    const currentTab = TABS.find(t => t.id === activeTab);
    document.title = `${currentTab?.label || 'Dashboard'} - Kaiden AI Swarm™`;
  }, [activeTab]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Header */}
        <header className="border-b border-blue-800/30 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <div className="w-6 h-6 border-2 border-white rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-white">Kaiden AI Swarm™</h1>
                  <p className="text-blue-300 text-sm">Autonomous Operations Platform 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <VoiceCommand />
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors flex items-center gap-2 border border-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Export application"
                >
                  <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
                  {isExporting ? 'Exporting...' : 'Export'}
                </button>
                <button 
                  className="relative px-4 py-2 bg-slate-900/50 hover:bg-slate-900 text-blue-400 rounded-lg transition-colors border border-blue-800/30"
                  aria-label={`Notifications: ${notifications} unread`}
                >
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" aria-label={`${notifications} notifications`}>
                      {notifications}
                    </span>
                  )}
                </button>
                <KaydenIntegration />
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-b border-blue-800/30 bg-slate-900/50 backdrop-blur-xl sticky top-[73px] z-40" role="navigation" aria-label="Main navigation">
          <div className="container mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={() => handleTabHover(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  className={`px-6 py-4 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-blue-500 bg-blue-500/10'
                      : 'text-blue-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex">
          <main className="flex-1 container mx-auto px-6 py-8" role="main" id={`panel-${activeTab}`}>
            <Suspense fallback={<LoadingFallback message="Loading component..." />}>
              {ActiveComponent}
            </Suspense>
          </main>

          {/* AI Insights Sidebar */}
          {showInsightsFeed && (
            <aside 
              className="w-96 border-l border-blue-800/30 bg-slate-950/30 backdrop-blur-xl p-6 overflow-y-auto max-h-screen sticky top-[137px]"
              role="complementary"
              aria-label="AI Insights Feed"
            >
              <Suspense fallback={<LoadingFallback message="Loading insights..." />}>
                <AIInsightsFeed onClose={toggleInsightsFeed} />
              </Suspense>
            </aside>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}