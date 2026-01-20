import React, { useState, useEffect, useCallback } from 'react';
import '@/App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Demo user ID for testing
const DEMO_USER_ID = 'demo-user-001';

// Status indicator component
const StatusIndicator = ({ status }) => {
  const statusColors = {
    running: 'bg-green-500',
    paused: 'bg-yellow-500',
    stopped: 'bg-red-500',
    emergency_stop: 'bg-red-600 animate-pulse',
  };

  const statusLabels = {
    running: 'Running Autonomously',
    paused: 'Paused',
    stopped: 'Stopped',
    emergency_stop: 'Emergency Stop Active',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${statusColors[status] || 'bg-gray-500'}`} />
      <span className="text-sm font-medium">{statusLabels[status] || status}</span>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const statusIcons = {
    completed: '✅',
    failed: '❌',
    pending: '⏳',
    running: '🔄',
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-lg transition-all">
      <span className="text-lg">{statusIcons[activity.execution_status] || '📋'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{activity.action_description}</p>
        <p className="text-gray-500 text-xs">
          {new Date(activity.created_at).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

// Approval Request Component
const ApprovalCard = ({ approval, onApprove, onDeny }) => (
  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-3">
    <div className="flex items-start gap-3">
      <span className="text-2xl">📨</span>
      <div className="flex-1">
        <p className="text-white font-medium">{approval.action_summary}</p>
        <p className="text-gray-400 text-sm mt-1">
          {approval.is_reversible ? 'Reversible action' : '⚠️ Irreversible action'}
        </p>
        <p className="text-gray-500 text-xs mt-2">{approval.consequence_description}</p>
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => onDeny(approval.id)}
        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm"
        data-testid={`deny-btn-${approval.id}`}
      >
        Deny
      </button>
      <button
        onClick={() => onApprove(approval.id)}
        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all text-sm font-medium"
        data-testid={`approve-btn-${approval.id}`}
      >
        Approve
      </button>
    </div>
  </div>
);

// Quick Action Button
const QuickAction = ({ icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    data-testid={`quick-action-${label.toLowerCase().replace(/\s/g, '-')}`}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-xs text-gray-400">{label}</span>
  </button>
);

// Main Dashboard Component
const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const [statusRes, approvalsRes, activityRes, metricsRes] = await Promise.all([
        axios.get(`${API}/kaiden/status/${DEMO_USER_ID}`),
        axios.get(`${API}/approvals/${DEMO_USER_ID}`),
        axios.get(`${API}/activity/${DEMO_USER_ID}?limit=10`),
        axios.get(`${API}/metrics/${DEMO_USER_ID}/summary`),
      ]);

      setStatus(statusRes.data);
      setApprovals(approvalsRes.data);
      setActivities(activityRes.data);
      setMetrics(metricsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to connect to KAIDEN. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Initialize user if needed
  useEffect(() => {
    const initUser = async () => {
      try {
        await axios.get(`${API}/users/${DEMO_USER_ID}`);
      } catch (err) {
        if (err.response?.status === 404) {
          await axios.post(`${API}/users`, {
            email: 'demo@kaiden.app',
            name: 'Demo User',
          });
        }
      }
    };
    initUser();
  }, []);

  // Handle approval response
  const handleApproval = async (approvalId, approved) => {
    try {
      await axios.post(`${API}/approvals/${DEMO_USER_ID}/${approvalId}/respond`, { approved });
      fetchDashboardData();
    } catch (err) {
      console.error('Error processing approval:', err);
    }
  };

  // Handle emergency stop
  const handleEmergencyStop = async () => {
    if (window.confirm('Are you sure you want to activate Emergency Stop? All operations will halt immediately.')) {
      try {
        await axios.post(`${API}/kaiden/emergency-stop/${DEMO_USER_ID}`);
        fetchDashboardData();
      } catch (err) {
        console.error('Error activating emergency stop:', err);
      }
    }
  };

  // Handle pause/resume
  const handlePauseResume = async () => {
    try {
      if (status?.status === 'paused' || status?.status === 'emergency_stop') {
        await axios.post(`${API}/kaiden/resume/${DEMO_USER_ID}`);
      } else {
        await axios.post(`${API}/kaiden/pause/${DEMO_USER_ID}`);
      }
      fetchDashboardData();
    } catch (err) {
      console.error('Error toggling pause:', err);
    }
  };

  // Handle quick actions
  const handleQuickAction = async (actionType) => {
    try {
      let endpoint = '';
      let payload = {};

      switch (actionType) {
        case 'email':
          endpoint = `/quick/${DEMO_USER_ID}/email-draft`;
          payload = { recipient: 'team@company.com', subject: 'Quick Update' };
          break;
        case 'schedule':
          endpoint = `/quick/${DEMO_USER_ID}/schedule`;
          payload = { title: 'Quick Meeting', date: new Date().toISOString().split('T')[0], time: '14:00' };
          break;
        case 'reminder':
          endpoint = `/quick/${DEMO_USER_ID}/reminder`;
          payload = { message: 'Follow up on tasks', remind_at: new Date(Date.now() + 3600000).toISOString() };
          break;
        case 'report':
          endpoint = `/quick/${DEMO_USER_ID}/report`;
          payload = { report_type: 'activity', period: 'daily' };
          break;
        default:
          return;
      }

      await axios.post(`${API}${endpoint}`, null, { params: payload });
      fetchDashboardData();
    } catch (err) {
      console.error('Error executing quick action:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Connecting to KAIDEN...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
                K
              </div>
              <div>
                <h1 className="text-xl font-bold">KAIDEN</h1>
                <p className="text-xs text-gray-500">Your Business Operator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusIndicator status={status?.status || 'running'} />
              <button
                onClick={handlePauseResume}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all"
                data-testid="pause-resume-btn"
              >
                {status?.status === 'running' ? '⏸️ Pause' : '▶️ Resume'}
              </button>
              <button
                onClick={handleEmergencyStop}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-all"
                data-testid="emergency-stop-btn"
              >
                ⛔ Stop
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-2xl font-light text-gray-300">
            {status?.greeting || "Ready when you are. What can I handle for you?"}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {/* Emergency Stop Banner */}
        {status?.status === 'emergency_stop' && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-red-200">Emergency Stop Active</p>
                <p className="text-sm text-red-300/70">All operations halted. Click Resume when ready.</p>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Tasks Completed"
            value={status?.tasks_completed_today || 0}
            subtitle="Today"
            icon="✅"
          />
          <MetricCard
            title="Pending Approvals"
            value={status?.approvals_pending || 0}
            subtitle="Need your attention"
            icon="📋"
          />
          <MetricCard
            title="Time Saved"
            value={`${Math.round(status?.time_saved_minutes || 0)}m`}
            subtitle="Today"
            icon="⏱️"
          />
          <MetricCard
            title="Tasks Pending"
            value={status?.tasks_pending || 0}
            subtitle="In queue"
            icon="📦"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Approvals */}
          <div className="lg:col-span-2">
            {/* Pending Approvals */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📨</span> Needs Your Attention
              </h2>
              {approvals.length > 0 ? (
                <div>
                  {approvals.map((approval) => (
                    <ApprovalCard
                      key={approval.id}
                      approval={approval}
                      onApprove={(id) => handleApproval(id, true)}
                      onDeny={(id) => handleApproval(id, false)}
                    />
                  ))}
                  {approvals.length > 1 && (
                    <button
                      onClick={async () => {
                        if (window.confirm(`Approve all ${approvals.length} pending requests?`)) {
                          await axios.post(`${API}/approvals/${DEMO_USER_ID}/batch`, {
                            approval_ids: approvals.map(a => a.id),
                            approved: true
                          });
                          fetchDashboardData();
                        }
                      }}
                      className="w-full mt-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-400 rounded-lg transition-all text-sm"
                      data-testid="approve-all-btn"
                    >
                      ✅ Approve All ({approvals.length})
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-8 text-center">
                  <span className="text-4xl mb-4 block">✨</span>
                  <p className="text-gray-400">All caught up! No pending approvals.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span> Quick Actions
              </h2>
              <div className="grid grid-cols-4 gap-3">
                <QuickAction
                  icon="✉️"
                  label="Draft Email"
                  onClick={() => handleQuickAction('email')}
                  disabled={status?.status !== 'running'}
                />
                <QuickAction
                  icon="📅"
                  label="Schedule"
                  onClick={() => handleQuickAction('schedule')}
                  disabled={status?.status !== 'running'}
                />
                <QuickAction
                  icon="⏰"
                  label="Reminder"
                  onClick={() => handleQuickAction('reminder')}
                  disabled={status?.status !== 'running'}
                />
                <QuickAction
                  icon="📊"
                  label="Report"
                  onClick={() => handleQuickAction('report')}
                  disabled={status?.status !== 'running'}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Activity */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📜</span> Recent Activity
            </h2>
            <div className="bg-white/5 rounded-xl border border-white/10">
              {activities.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <span className="text-4xl mb-4 block">🌱</span>
                  <p className="text-gray-400 text-sm">No activity yet. Let's get started!</p>
                </div>
              )}
            </div>

            {/* Status Message */}
            {metrics && (
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <p className="text-sm text-purple-200">{metrics.message}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>KAIDEN • Approval-Gated Automation for Human Agency</p>
            <p>Stop scrolling. Start living.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return <Dashboard />;
}

export default App;
