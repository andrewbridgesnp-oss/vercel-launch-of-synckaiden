import React from 'react';
import { Settings, CreditCard, Database, Trash2, Download, Shield } from 'lucide-react';
import { UsageMeter } from '../integration/UsageMeter';

interface AppSettingsProps {
  currentPlan: string;
  planPrice: string;
  nextBillingDate: string;
  usageCurrent: number;
  usageLimit: number;
  onUpgrade: () => void;
  onManageBilling: () => void;
  onExportData: () => void;
  onUninstall: () => void;
}

export function AppSettings({
  currentPlan,
  planPrice,
  nextBillingDate,
  usageCurrent,
  usageLimit,
  onUpgrade,
  onManageBilling,
  onExportData,
  onUninstall,
}: AppSettingsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-navy-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-navy-900">App Settings</h1>
          </div>
          <p className="text-silver-600">Manage your Kaiden Scribe subscription and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Plan & Billing Section */}
          <div className="bg-white rounded-xl border border-silver-300 overflow-hidden luxury-shadow">
            <div className="bg-navy-50 px-6 py-4 border-b border-silver-300">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-navy-700" />
                <h2 className="text-lg font-semibold text-navy-900">Plan & Billing</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Current Plan */}
                <div>
                  <p className="text-sm text-silver-600 mb-1">Current Plan</p>
                  <p className="text-2xl font-bold text-navy-900">{currentPlan}</p>
                  <p className="text-sm text-silver-600 mt-1">{planPrice}</p>
                </div>

                {/* Next Billing Date */}
                <div>
                  <p className="text-sm text-silver-600 mb-1">Next Billing Date</p>
                  <p className="text-lg font-semibold text-navy-900">{nextBillingDate}</p>
                  <button
                    onClick={onManageBilling}
                    className="text-sm text-navy-700 hover:text-navy-900 font-semibold underline mt-2"
                  >
                    Manage Payment Method
                  </button>
                </div>
              </div>

              {/* Usage Meter */}
              <div className="mb-6">
                <UsageMeter
                  current={usageCurrent}
                  limit={usageLimit}
                  label="Monthly Visit Usage"
                  unit=" visits"
                  resetDate={nextBillingDate}
                  showPercentage={true}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onUpgrade}
                  className="bg-navy-800 hover:bg-navy-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Upgrade Plan
                </button>
                <button
                  onClick={onManageBilling}
                  className="bg-silver-100 hover:bg-silver-200 text-navy-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  View Billing History
                </button>
              </div>
            </div>
          </div>

          {/* App Preferences Section */}
          <div className="bg-white rounded-xl border border-silver-300 overflow-hidden luxury-shadow">
            <div className="bg-navy-50 px-6 py-4 border-b border-silver-300">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-navy-700" />
                <h2 className="text-lg font-semibold text-navy-900">App Preferences</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Preference Toggles */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-900">Email Notifications</p>
                  <p className="text-sm text-silver-600">Receive updates about new features</p>
                </div>
                <button className="w-12 h-6 bg-navy-700 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-navy-900">Auto-Save Drafts</p>
                  <p className="text-sm text-silver-600">Automatically save documentation drafts</p>
                </div>
                <button className="w-12 h-6 bg-navy-700 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-white rounded-xl border border-silver-300 overflow-hidden luxury-shadow">
            <div className="bg-navy-50 px-6 py-4 border-b border-silver-300">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-navy-700" />
                <h2 className="text-lg font-semibold text-navy-900">Data Management</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900 mb-1">Export Your Data</h3>
                  <p className="text-sm text-silver-600 mb-3">
                    Download all your clinical documentation, visit records, and settings in JSON format.
                  </p>
                  <button
                    onClick={onExportData}
                    className="bg-silver-100 hover:bg-silver-200 text-navy-900 px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Export Data
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900 mb-1">HIPAA Compliance</h3>
                  <p className="text-sm text-silver-600">
                    Your data is encrypted at rest and in transit. We maintain strict HIPAA compliance standards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="bg-white rounded-xl border-2 border-red-300 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-300">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900 mb-1">Uninstall Kaiden Scribe</h3>
                  <p className="text-sm text-silver-600 mb-3">
                    This will remove the app from your Kaiden workspace. Your data will be retained for 30 days before permanent deletion.
                  </p>
                  <button
                    onClick={onUninstall}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Uninstall App
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
