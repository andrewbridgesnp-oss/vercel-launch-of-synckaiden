import { useState, useEffect } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  Palette, 
  Plug, 
  Users, 
  Shield,
  Bell,
  Briefcase,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { configService } from '../../../services/config-service';
import { ClinicConfig } from '../../../config/default-config';

type SettingsTab = 'branding' | 'integration' | 'workflow' | 'features' | 'compliance' | 'notifications';

export function ConfigurationSettings() {
  const [config, setConfig] = useState<ClinicConfig>(configService.getConfig());
  const [activeTab, setActiveTab] = useState<SettingsTab>('branding');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const unsubscribe = configService.subscribe((newConfig) => {
      setConfig(newConfig);
    });
    return unsubscribe;
  }, []);

  const handleUpdate = (section: keyof ClinicConfig, updates: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    try {
      configService.updateConfig(config);
      setHasChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleExport = () => {
    const configJson = configService.exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinic-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (configService.importConfig(content)) {
        setConfig(configService.getConfig());
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      configService.resetToDefaults();
      setConfig(configService.getConfig());
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'integration', label: 'EHR Integration', icon: Plug },
    { id: 'workflow', label: 'Workflow', icon: Briefcase },
    { id: 'features', label: 'Features', icon: Settings },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <div className="h-full flex flex-col bg-silver-50">
      {/* Header */}
      <div className="bg-white border-b border-silver-300 px-6 py-4 luxury-shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-navy-900">System Configuration</h1>
            <p className="text-sm text-silver-600 mt-1">Customize your platform to match your clinic's needs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-silver-100 hover:bg-silver-200 text-navy-900 rounded-lg transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </button>
            <label className="px-4 py-2 bg-silver-100 hover:bg-silver-200 text-navy-900 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import Config
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-silver-100 hover:bg-silver-200 text-navy-900 rounded-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Config
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === 'saving'}
              className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 font-semibold luxury-shadow ${
                hasChanges
                  ? 'bg-navy-700 hover:bg-navy-600 text-white'
                  : 'bg-silver-200 text-silver-500 cursor-not-allowed'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <X className="w-4 h-4" />
                  Error
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-silver-300">
        <div className="flex px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  isActive
                    ? 'border-navy-600 text-navy-900 font-semibold'
                    : 'border-transparent text-silver-600 hover:text-navy-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'branding' && (
            <BrandingSettings config={config.branding} onUpdate={(updates) => handleUpdate('branding', updates)} />
          )}
          {activeTab === 'integration' && (
            <IntegrationSettings config={config.integration} onUpdate={(updates) => handleUpdate('integration', updates)} />
          )}
          {activeTab === 'workflow' && (
            <WorkflowSettings config={config.workflow} onUpdate={(updates) => handleUpdate('workflow', updates)} />
          )}
          {activeTab === 'features' && (
            <FeatureSettings config={config.features} onUpdate={(updates) => handleUpdate('features', updates)} />
          )}
          {activeTab === 'compliance' && (
            <ComplianceSettings config={config.compliance} onUpdate={(updates) => handleUpdate('compliance', updates)} />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings config={config.notifications} onUpdate={(updates) => handleUpdate('notifications', updates)} />
          )}
        </div>
      </div>
    </div>
  );
}

// Branding Settings Component
function BrandingSettings({ config, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Clinic Identity</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Clinic Name</label>
            <input
              type="text"
              value={config.clinicName}
              onChange={(e) => onUpdate({ clinicName: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
              placeholder="Your Clinic Name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Platform Name</label>
            <input
              type="text"
              value={config.platformName}
              onChange={(e) => onUpdate({ platformName: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
              placeholder="HealthSync Scribe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Tagline</label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => onUpdate({ tagline: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
              placeholder="Document. Decide. Deliver."
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Color Theme</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                className="w-12 h-10 rounded border border-silver-300"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                className="flex-1 px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg text-navy-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Secondary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                className="w-12 h-10 rounded border border-silver-300"
              />
              <input
                type="text"
                value={config.secondaryColor}
                onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                className="flex-1 px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg text-navy-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => onUpdate({ accentColor: e.target.value })}
                className="w-12 h-10 rounded border border-silver-300"
              />
              <input
                type="text"
                value={config.accentColor}
                onChange={(e) => onUpdate({ accentColor: e.target.value })}
                className="flex-1 px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg text-navy-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Theme Preset</label>
            <select
              value={config.theme}
              onChange={(e) => onUpdate({ theme: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            >
              <option value="navy-silver">Navy & Silver (Professional)</option>
              <option value="medical-blue">Medical Blue</option>
              <option value="nature-green">Nature Green</option>
              <option value="warm-orange">Warm Orange</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Logos & Assets</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Logo URL</label>
            <input
              type="url"
              value={config.logoUrl || ''}
              onChange={(e) => onUpdate({ logoUrl: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Favicon URL</label>
            <input
              type="url"
              value={config.faviconUrl || ''}
              onChange={(e) => onUpdate({ faviconUrl: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Integration Settings Component
function IntegrationSettings({ config, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">EHR System</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">EHR Platform</label>
            <select
              value={config.ehrSystem}
              onChange={(e) => onUpdate({ ehrSystem: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            >
              <option value="none">None (Standalone Mode)</option>
              <option value="epic">Epic</option>
              <option value="cerner">Cerner (Oracle Health)</option>
              <option value="athenahealth">athenahealth</option>
              <option value="allscripts">Allscripts</option>
              <option value="eclinicalworks">eClinicalWorks</option>
              <option value="nextgen">NextGen Healthcare</option>
              <option value="custom">Custom API</option>
            </select>
          </div>
          {config.ehrSystem !== 'none' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">API Endpoint</label>
                <input
                  type="url"
                  value={config.apiEndpoint}
                  onChange={(e) => onUpdate({ apiEndpoint: e.target.value })}
                  className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
                  placeholder="https://api.example.com/fhir"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Authentication Type</label>
                <select
                  value={config.authType}
                  onChange={(e) => onUpdate({ authType: e.target.value })}
                  className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
                >
                  <option value="oauth2">OAuth 2.0</option>
                  <option value="apikey">API Key</option>
                  <option value="saml">SAML</option>
                  <option value="basic">Basic Auth</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">FHIR Configuration</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.fhirEnabled}
              onChange={(e) => onUpdate({ fhirEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <span className="text-sm font-semibold text-navy-900">Enable FHIR Support</span>
          </label>
          {config.fhirEnabled && (
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">FHIR Version</label>
              <select
                value={config.fhirVersion}
                onChange={(e) => onUpdate({ fhirVersion: e.target.value })}
                className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
              >
                <option value="R4">R4 (Recommended)</option>
                <option value="STU3">STU3</option>
                <option value="DSTU2">DSTU2</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Advanced Integration</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.cdsHooksEnabled}
              onChange={(e) => onUpdate({ cdsHooksEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <div>
              <span className="text-sm font-semibold text-navy-900">CDS Hooks</span>
              <p className="text-xs text-silver-600">Clinical Decision Support integration</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.ssoEnabled}
              onChange={(e) => onUpdate({ ssoEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <div>
              <span className="text-sm font-semibold text-navy-900">Single Sign-On (SSO)</span>
              <p className="text-xs text-silver-600">Enable SSO authentication</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Workflow Settings Component
function WorkflowSettings({ config, onUpdate }: any) {
  const [newSpecialty, setNewSpecialty] = useState('');

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      onUpdate({
        enabledSpecialties: [...config.enabledSpecialties, newSpecialty.trim()]
      });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    onUpdate({
      enabledSpecialties: config.enabledSpecialties.filter((s: string) => s !== specialty)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Specialties</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
              className="flex-1 px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
              placeholder="Add specialty (e.g., Cardiology)"
            />
            <button
              onClick={addSpecialty}
              className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.enabledSpecialties.map((specialty: string) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-navy-100 text-navy-900 rounded-full text-sm font-semibold flex items-center gap-2"
              >
                {specialty}
                <button
                  onClick={() => removeSpecialty(specialty)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Visit Types</h2>
        <div className="space-y-2">
          {config.visitTypes.map((visit: any) => (
            <div key={visit.id} className="flex items-center justify-between p-3 bg-silver-50 rounded-lg">
              <div>
                <p className="font-semibold text-navy-900">{visit.name}</p>
                <p className="text-sm text-silver-600">{visit.duration} minutes</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-silver-600">
                {visit.requiresConsent && <span className="px-2 py-1 bg-white rounded">Consent</span>}
                {visit.requiresPayment && <span className="px-2 py-1 bg-white rounded">Payment</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Feature Settings Component
function FeatureSettings({ config, onUpdate }: any) {
  const features = [
    { key: 'enableAIScribe', label: 'AI Scribe', description: 'Real-time ambient documentation' },
    { key: 'enableCodingAssist', label: 'Coding Assistant', description: 'ICD-10 & CPT code suggestions' },
    { key: 'enableCareGaps', label: 'Care Gaps', description: 'Quality measure tracking' },
    { key: 'enablePatientPortal', label: 'Patient Portal', description: 'Patient-facing mobile app' },
    { key: 'enableTelemedicine', label: 'Telemedicine', description: 'Video visit capabilities' },
    { key: 'enableEPrescribing', label: 'E-Prescribing', description: 'Electronic prescriptions' },
    { key: 'enableLabIntegration', label: 'Lab Integration', description: 'Lab orders and results' },
    { key: 'enableImagingIntegration', label: 'Imaging Integration', description: 'Imaging orders and PACS' },
    { key: 'enableBillingIntegration', label: 'Billing Integration', description: 'Revenue cycle management' },
    { key: 'enableAnalytics', label: 'Analytics & Reporting', description: 'Dashboard and insights' },
    { key: 'enableAuditLog', label: 'Audit Logging', description: 'Comprehensive activity logs' },
    { key: 'enableMultiLocation', label: 'Multi-Location', description: 'Support multiple clinics' },
  ];

  return (
    <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
      <h2 className="text-lg font-semibold text-navy-900 mb-4">Feature Toggles</h2>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <label key={feature.key} className="flex items-start gap-3 p-4 bg-silver-50 rounded-lg hover:bg-silver-100 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={config[feature.key]}
              onChange={(e) => onUpdate({ [feature.key]: e.target.checked })}
              className="w-5 h-5 mt-0.5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <div>
              <p className="font-semibold text-navy-900">{feature.label}</p>
              <p className="text-sm text-silver-600">{feature.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// Compliance Settings Component
function ComplianceSettings({ config, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">HIPAA & Security</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.hipaaMode}
              onChange={(e) => onUpdate({ hipaaMode: e.target.checked })}
              className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <div>
              <span className="text-sm font-semibold text-navy-900">HIPAA Compliance Mode</span>
              <p className="text-xs text-silver-600">Enhanced security and audit logging</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.requireMFA}
              onChange={(e) => onUpdate({ requireMFA: e.target.checked })}
              className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <div>
              <span className="text-sm font-semibold text-navy-900">Require Multi-Factor Authentication</span>
              <p className="text-xs text-silver-600">Mandatory MFA for all users</p>
            </div>
          </label>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Audit Logging Level</label>
            <select
              value={config.auditLoggingLevel}
              onChange={(e) => onUpdate({ auditLoggingLevel: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            >
              <option value="minimal">Minimal</option>
              <option value="standard">Standard</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Session & Access</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={config.sessionTimeoutMinutes}
              onChange={(e) => onUpdate({ sessionTimeoutMinutes: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Data Retention (days)</label>
            <input
              type="number"
              value={config.dataRetentionDays}
              onChange={(e) => onUpdate({ dataRetentionDays: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Password Policy</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Minimum Length</label>
            <input
              type="number"
              value={config.passwordPolicy.minLength}
              onChange={(e) => onUpdate({ 
                passwordPolicy: { ...config.passwordPolicy, minLength: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Expiry (days)</label>
            <input
              type="number"
              value={config.passwordPolicy.expiryDays}
              onChange={(e) => onUpdate({ 
                passwordPolicy: { ...config.passwordPolicy, expiryDays: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {['requireUppercase', 'requireLowercase', 'requireNumbers', 'requireSpecialChars'].map((key) => (
            <label key={key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config.passwordPolicy[key]}
                onChange={(e) => onUpdate({ 
                  passwordPolicy: { ...config.passwordPolicy, [key]: e.target.checked }
                })}
                className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
              />
              <span className="text-sm text-navy-900">
                {key.replace('require', 'Require ').replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings({ config, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Communication Providers</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">Email Provider</label>
            <select
              value={config.emailProvider}
              onChange={(e) => onUpdate({ emailProvider: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            >
              <option value="sendgrid">SendGrid</option>
              <option value="ses">Amazon SES</option>
              <option value="smtp">Custom SMTP</option>
              <option value="custom">Custom Provider</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">SMS Provider</label>
            <select
              value={config.smsProvider}
              onChange={(e) => onUpdate({ smsProvider: e.target.value })}
              className="w-full px-4 py-2 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
            >
              <option value="none">None</option>
              <option value="twilio">Twilio</option>
              <option value="nexmo">Nexmo (Vonage)</option>
              <option value="custom">Custom Provider</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-silver-300 rounded-lg p-6 luxury-shadow">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Notification Types</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.enableAppointmentReminders}
              onChange={(e) => onUpdate({ enableAppointmentReminders: e.target.checked })}
              className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <div>
              <span className="text-sm font-semibold text-navy-900">Appointment Reminders</span>
              <p className="text-xs text-silver-600">Automated patient appointment notifications</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.enableTaskNotifications}
              onChange={(e) => onUpdate({ enableTaskNotifications: e.target.checked })}
              className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <div>
              <span className="text-sm font-semibold text-navy-900">Task Notifications</span>
              <p className="text-xs text-silver-600">Staff task and message alerts</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.enableCriticalAlerts}
              onChange={(e) => onUpdate({ enableCriticalAlerts: e.target.checked })}
              className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
            />
            <div>
              <span className="text-sm font-semibold text-navy-900">Critical Alerts</span>
              <p className="text-xs text-silver-600">Urgent clinical notifications</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
