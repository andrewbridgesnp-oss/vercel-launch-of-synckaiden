import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Sparkles, Building2, Plug, Settings as SettingsIcon } from 'lucide-react';
import { configService } from '../../../services/config-service';
import { BrandingConfig, IntegrationConfig, FeatureFlags } from '../../../config/default-config';

type WizardStep = 'welcome' | 'branding' | 'integration' | 'features' | 'complete';

interface SetupWizardProps {
  onComplete: () => void;
}

export function SetupWizard({ onComplete }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [branding, setBranding] = useState<Partial<BrandingConfig>>({
    clinicName: '',
    platformName: 'HealthSync Scribe',
    tagline: 'Document. Decide. Deliver.',
    theme: 'navy-silver',
  });
  const [integration, setIntegration] = useState<Partial<IntegrationConfig>>({
    ehrSystem: 'none',
    fhirEnabled: true,
  });
  const [features, setFeatures] = useState<Partial<FeatureFlags>>({
    enableAIScribe: true,
    enableCodingAssist: true,
    enableCareGaps: true,
    enablePatientPortal: true,
    enableTelemedicine: true,
  });

  const steps: { id: WizardStep; label: string; icon: any }[] = [
    { id: 'welcome', label: 'Welcome', icon: Sparkles },
    { id: 'branding', label: 'Branding', icon: Building2 },
    { id: 'integration', label: 'Integration', icon: Plug },
    { id: 'features', label: 'Features', icon: SettingsIcon },
    { id: 'complete', label: 'Complete', icon: Check },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleComplete = () => {
    configService.updateConfig({
      branding: branding as BrandingConfig,
      integration: integration as IntegrationConfig,
      features: features as FeatureFlags,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentIndex;
              
              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-gold text-navy-900 luxury-shadow-lg scale-110'
                        : isCompleted
                          ? 'bg-navy-600 text-white'
                          : 'bg-navy-700 text-silver-400'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`mt-2 text-sm font-semibold ${
                      isActive ? 'text-gold' : isCompleted ? 'text-white' : 'text-silver-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 transition-all ${
                      isCompleted ? 'bg-navy-600' : 'bg-navy-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl luxury-shadow-lg p-8">
          {currentStep === 'welcome' && (
            <WelcomeStep onNext={handleNext} />
          )}
          {currentStep === 'branding' && (
            <BrandingStep 
              data={branding} 
              onChange={setBranding}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 'integration' && (
            <IntegrationStep 
              data={integration} 
              onChange={setIntegration}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 'features' && (
            <FeaturesStep 
              data={features} 
              onChange={setFeatures}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {currentStep === 'complete' && (
            <CompleteStep onComplete={handleComplete} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-navy-700 to-navy-500 rounded-2xl flex items-center justify-center mx-auto mb-6 luxury-shadow-lg">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-navy-900 mb-4">Welcome to HealthSync Scribe</h1>
      <p className="text-lg text-silver-700 mb-8 max-w-2xl mx-auto">
        Let's get your clinic set up in just a few minutes. This wizard will help you customize 
        the platform to match your workflow and integrate with your existing systems.
      </p>
      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
        <div className="p-6 bg-navy-50 rounded-xl">
          <Building2 className="w-8 h-8 text-navy-600 mb-3 mx-auto" />
          <h3 className="font-semibold text-navy-900 mb-2">Your Branding</h3>
          <p className="text-sm text-silver-600">Customize colors, logos, and clinic name</p>
        </div>
        <div className="p-6 bg-navy-50 rounded-xl">
          <Plug className="w-8 h-8 text-navy-600 mb-3 mx-auto" />
          <h3 className="font-semibold text-navy-900 mb-2">EHR Integration</h3>
          <p className="text-sm text-silver-600">Connect to your existing system</p>
        </div>
        <div className="p-6 bg-navy-50 rounded-xl">
          <SettingsIcon className="w-8 h-8 text-navy-600 mb-3 mx-auto" />
          <h3 className="font-semibold text-navy-900 mb-2">Features</h3>
          <p className="text-sm text-silver-600">Enable modules you need</p>
        </div>
      </div>
      <button
        onClick={onNext}
        className="px-8 py-4 bg-navy-700 hover:bg-navy-600 text-white font-semibold rounded-lg luxury-shadow-lg transition-all inline-flex items-center gap-2"
      >
        Get Started
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function BrandingStep({ data, onChange, onNext, onBack }: any) {
  const canProceed = data.clinicName && data.clinicName.trim().length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 mb-2">Customize Your Branding</h2>
      <p className="text-silver-600 mb-8">Make the platform yours with your clinic's identity</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">
            Clinic Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={data.clinicName}
            onChange={(e) => onChange({ ...data, clinicName: e.target.value })}
            className="w-full px-4 py-3 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900 text-lg"
            placeholder="Acme Medical Group"
          />
          <p className="text-sm text-silver-600 mt-1">This will appear throughout the platform</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">Platform Name</label>
          <input
            type="text"
            value={data.platformName}
            onChange={(e) => onChange({ ...data, platformName: e.target.value })}
            className="w-full px-4 py-3 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
            placeholder="HealthSync Scribe"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">Tagline</label>
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => onChange({ ...data, tagline: e.target.value })}
            className="w-full px-4 py-3 bg-silver-50 border border-silver-300 rounded-lg focus:border-navy-500 focus:ring-2 focus:ring-navy-200 text-navy-900"
            placeholder="Document. Decide. Deliver."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">Theme</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'navy-silver', label: 'Navy & Silver', colors: ['#1d3660', '#757c88'] },
              { value: 'medical-blue', label: 'Medical Blue', colors: ['#0066cc', '#4a9eff'] },
              { value: 'nature-green', label: 'Nature Green', colors: ['#2d7a4f', '#52b788'] },
              { value: 'warm-orange', label: 'Warm Orange', colors: ['#d97706', '#f59e0b'] },
            ].map((theme) => (
              <button
                key={theme.value}
                onClick={() => onChange({ ...data, theme: theme.value })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  data.theme === theme.value
                    ? 'border-navy-600 bg-navy-50'
                    : 'border-silver-300 bg-white hover:border-silver-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {theme.colors.map((color, i) => (
                    <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="font-semibold text-navy-900">{theme.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-silver-300">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-silver-100 hover:bg-silver-200 text-navy-900 font-semibold rounded-lg transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-3 font-semibold rounded-lg transition-all inline-flex items-center gap-2 ${
            canProceed
              ? 'bg-navy-700 hover:bg-navy-600 text-white luxury-shadow'
              : 'bg-silver-200 text-silver-500 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function IntegrationStep({ data, onChange, onNext, onBack }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 mb-2">EHR Integration</h2>
      <p className="text-silver-600 mb-8">Connect to your existing Electronic Health Record system</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">Select Your EHR System</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'none', label: 'Standalone Mode', desc: 'No external integration' },
              { value: 'epic', label: 'Epic', desc: 'FHIR-enabled integration' },
              { value: 'cerner', label: 'Cerner / Oracle Health', desc: 'FHIR-enabled integration' },
              { value: 'athenahealth', label: 'athenahealth', desc: 'API integration' },
              { value: 'allscripts', label: 'Allscripts', desc: 'API integration' },
              { value: 'eclinicalworks', label: 'eClinicalWorks', desc: 'API integration' },
              { value: 'nextgen', label: 'NextGen Healthcare', desc: 'API integration' },
              { value: 'custom', label: 'Custom API', desc: 'Bring your own integration' },
            ].map((ehr) => (
              <button
                key={ehr.value}
                onClick={() => onChange({ ...data, ehrSystem: ehr.value })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  data.ehrSystem === ehr.value
                    ? 'border-navy-600 bg-navy-50'
                    : 'border-silver-300 bg-white hover:border-silver-400'
                }`}
              >
                <p className="font-semibold text-navy-900 mb-1">{ehr.label}</p>
                <p className="text-sm text-silver-600">{ehr.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {data.ehrSystem !== 'none' && (
          <div className="p-6 bg-navy-50 rounded-lg">
            <h3 className="font-semibold text-navy-900 mb-4">Integration Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">API Endpoint</label>
                <input
                  type="url"
                  value={data.apiEndpoint || ''}
                  onChange={(e) => onChange({ ...data, apiEndpoint: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-silver-300 rounded-lg focus:border-navy-500 text-navy-900"
                  placeholder="https://api.example.com/fhir"
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={data.fhirEnabled}
                  onChange={(e) => onChange({ ...data, fhirEnabled: e.target.checked })}
                  className="w-5 h-5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
                />
                <span className="text-sm font-semibold text-navy-900">Enable FHIR Support</span>
              </label>
            </div>
          </div>
        )}

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <strong>Note:</strong> You can configure detailed integration settings later in the admin panel. 
            This is just to get you started.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-silver-300">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-silver-100 hover:bg-silver-200 text-navy-900 font-semibold rounded-lg transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-navy-700 hover:bg-navy-600 text-white font-semibold rounded-lg luxury-shadow transition-all inline-flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function FeaturesStep({ data, onChange, onNext, onBack }: any) {
  const features = [
    { key: 'enableAIScribe', label: 'AI Scribe', desc: 'Ambient documentation during visits' },
    { key: 'enableCodingAssist', label: 'Coding Assistant', desc: 'ICD-10 & CPT suggestions' },
    { key: 'enableCareGaps', label: 'Care Gaps', desc: 'Quality measure tracking' },
    { key: 'enablePatientPortal', label: 'Patient Portal', desc: 'Patient-facing mobile app' },
    { key: 'enableTelemedicine', label: 'Telemedicine', desc: 'Video visits' },
    { key: 'enableEPrescribing', label: 'E-Prescribing', desc: 'Electronic prescriptions' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 mb-2">Choose Your Features</h2>
      <p className="text-silver-600 mb-8">Select the modules you want to enable (you can change these later)</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {features.map((feature) => (
          <label
            key={feature.key}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              data[feature.key]
                ? 'border-navy-600 bg-navy-50'
                : 'border-silver-300 bg-white hover:border-silver-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={data[feature.key]}
                onChange={(e) => onChange({ ...data, [feature.key]: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded border-silver-300 text-navy-600 focus:ring-navy-500"
              />
              <div>
                <p className="font-semibold text-navy-900">{feature.label}</p>
                <p className="text-sm text-silver-600">{feature.desc}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-silver-300">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-silver-100 hover:bg-silver-200 text-navy-900 font-semibold rounded-lg transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-navy-700 hover:bg-navy-600 text-white font-semibold rounded-lg luxury-shadow transition-all inline-flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function CompleteStep({ onComplete, onBack }: any) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 luxury-shadow-lg">
        <Check className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-navy-900 mb-4">You're All Set!</h2>
      <p className="text-lg text-silver-700 mb-8 max-w-2xl mx-auto">
        Your platform has been configured and is ready to use. You can always adjust 
        these settings later in the admin panel.
      </p>
      
      <div className="max-w-md mx-auto mb-8 p-6 bg-navy-50 rounded-xl text-left">
        <h3 className="font-semibold text-navy-900 mb-3">Next Steps:</h3>
        <ul className="space-y-2 text-sm text-silver-700">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-navy-600 mt-0.5 flex-shrink-0" />
            <span>Add your team members and assign roles</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-navy-600 mt-0.5 flex-shrink-0" />
            <span>Configure your workflow templates</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-navy-600 mt-0.5 flex-shrink-0" />
            <span>Test your EHR integration (if applicable)</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-navy-600 mt-0.5 flex-shrink-0" />
            <span>Schedule a demo visit to familiarize yourself</span>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-silver-100 hover:bg-silver-200 text-navy-900 font-semibold rounded-lg transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-navy-700 to-navy-600 hover:from-navy-600 hover:to-navy-500 text-white font-semibold rounded-lg luxury-shadow-lg transition-all inline-flex items-center gap-2"
        >
          Launch Platform
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
