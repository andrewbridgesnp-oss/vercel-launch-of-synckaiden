import { useState } from 'react';
import { Settings, Bell, Lock, Palette, Zap, Database, Globe, Shield } from 'lucide-react';

export function AdvancedSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      insights: true,
      warnings: true,
      achievements: true,
      agentStatus: false,
    },
    performance: {
      autoOptimize: true,
      maxConcurrentAgents: 24,
      taskPriority: 'balanced' as 'speed' | 'balanced' | 'accuracy',
      cachingEnabled: true,
    },
    integrations: {
      kaydenAI: true,
      n8nSync: true,
      voiceCommands: false,
      autoSync: true,
    },
    appearance: {
      theme: 'dark' as 'light' | 'dark' | 'auto',
      animations: true,
      compactMode: false,
      sidebarPosition: 'right' as 'left' | 'right',
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      dataEncryption: true,
      auditLog: true,
    },
  });

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Advanced Settings
        </h2>
        <p className="text-blue-300">Configure your Agentic AI Business Swarm platform</p>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white">Notifications</h3>
            <p className="text-blue-400 text-sm">Manage alert preferences</p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
              <span className="text-blue-100 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Performance */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white">Performance</h3>
            <p className="text-blue-400 text-sm">Optimize system performance</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-slate-950/50 rounded-lg">
            <label className="text-blue-100 text-sm block mb-2">Max Concurrent Agents</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="50"
                value={settings.performance.maxConcurrentAgents}
                onChange={(e) => updateSetting('performance', 'maxConcurrentAgents', parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white min-w-[3rem] text-right">{settings.performance.maxConcurrentAgents}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-lg">
            <label className="text-blue-100 text-sm block mb-2">Task Priority Mode</label>
            <select
              value={settings.performance.taskPriority}
              onChange={(e) => updateSetting('performance', 'taskPriority', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-blue-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="speed">Speed - Fastest execution</option>
              <option value="balanced">Balanced - Optimal performance</option>
              <option value="accuracy">Accuracy - Highest quality</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
            <div>
              <span className="text-blue-100 block">Auto-Optimize</span>
              <span className="text-blue-400 text-xs">Automatically optimize agent workload</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.performance.autoOptimize}
                onChange={(e) => updateSetting('performance', 'autoOptimize', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white">Integrations</h3>
            <p className="text-blue-400 text-sm">Manage external connections</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
            <div>
              <span className="text-blue-100 block">Kayden AI (synckaiden.com)</span>
              <span className="text-blue-400 text-xs">Real-time consulting & automation</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.kaydenAI}
                onChange={(e) => updateSetting('integrations', 'kaydenAI', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
            <div>
              <span className="text-blue-100 block">n8n Sync</span>
              <span className="text-blue-400 text-xs">Workflow template synchronization</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.n8nSync}
                onChange={(e) => updateSetting('integrations', 'n8nSync', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
            <div>
              <span className="text-blue-100 block">Voice Commands</span>
              <span className="text-blue-400 text-xs">Enable voice-activated controls</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.integrations.voiceCommands}
                onChange={(e) => updateSetting('integrations', 'voiceCommands', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-white">Appearance</h3>
            <p className="text-blue-400 text-sm">Customize the interface</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-slate-950/50 rounded-lg">
            <label className="text-blue-100 text-sm block mb-2">Theme</label>
            <select
              value={settings.appearance.theme}
              onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-blue-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="light">Light</option>
              <option value="dark">Dark (Recommended)</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
            <span className="text-blue-100">Animations</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.appearance.animations}
                onChange={(e) => updateSetting('appearance', 'animations', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white">Security</h3>
            <p className="text-blue-400 text-sm">Protect your data and account</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
            <div>
              <span className="text-blue-100 block">Two-Factor Authentication</span>
              <span className="text-blue-400 text-xs">Add an extra layer of security</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-lg">
            <label className="text-blue-100 text-sm block mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-800 border border-blue-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Save Changes
        </button>
        <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-blue-400 rounded-lg transition-colors">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
