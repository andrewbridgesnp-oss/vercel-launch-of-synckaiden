import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Zap, Moon, Sun, Globe, Lock, Bell } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    autoResponse: true,
    darkMode: true,
    notifications: true,
    privacy: 'high'
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 z-50 overflow-y-auto"
            style={{
              borderLeft: '1px solid rgba(168, 182, 216, 0.2)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl text-slate-100 font-medium">Settings</h2>
                  <p className="text-slate-500 text-sm mt-1">Configure KAIDEN preferences</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Voice Settings */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium">
                  Voice & Audio
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      {settings.voiceEnabled ? (
                        <Volume2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-slate-500" />
                      )}
                      <div>
                        <div className="text-slate-200 text-sm font-medium">Voice Responses</div>
                        <div className="text-slate-500 text-xs mt-0.5">Enable audio feedback</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSetting('voiceEnabled')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.voiceEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: settings.voiceEnabled ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Settings */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium">
                  AI Behavior
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Zap className={`w-5 h-5 ${settings.autoResponse ? 'text-blue-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-slate-200 text-sm font-medium">Auto-Response</div>
                        <div className="text-slate-500 text-xs mt-0.5">Instant analysis mode</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSetting('autoResponse')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.autoResponse ? 'bg-blue-500' : 'bg-slate-600'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: settings.autoResponse ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Bell className={`w-5 h-5 ${settings.notifications ? 'text-purple-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-slate-200 text-sm font-medium">Notifications</div>
                        <div className="text-slate-500 text-xs mt-0.5">Alerts & reminders</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSetting('notifications')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.notifications ? 'bg-purple-500' : 'bg-slate-600'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: settings.notifications ? 26 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium">
                  Appearance
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 rounded-xl bg-slate-800 border-2 border-blue-500 flex flex-col items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-200">Dark</span>
                  </button>
                  <button className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center gap-2 opacity-50">
                    <Sun className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-400">Light</span>
                  </button>
                </div>
              </div>

              {/* Privacy & Security */}
              <div className="space-y-4">
                <h3 className="text-sm text-slate-400 uppercase tracking-wider font-medium">
                  Privacy & Security
                </h3>
                
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-emerald-400" />
                    <div className="flex-1">
                      <div className="text-slate-200 text-sm font-medium">Data Protection</div>
                      <div className="text-slate-500 text-xs mt-0.5">End-to-end encryption enabled</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <div className="text-slate-200 text-sm font-medium">Region</div>
                      <div className="text-slate-500 text-xs mt-0.5">United States</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50">
                <div className="text-center space-y-2">
                  <div className="text-slate-400 text-xs uppercase tracking-wider">KAIDEN Version</div>
                  <div className="text-2xl text-slate-200 font-light">2.5.0</div>
                  <div className="text-slate-500 text-xs">Executive AI Engine</div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
