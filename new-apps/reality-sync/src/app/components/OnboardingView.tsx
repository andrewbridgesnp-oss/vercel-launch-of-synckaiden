import { useState } from 'react';
import { Shield, Lock, Database, ArrowRight, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { setOnboardingComplete } from '../lib/storage';

interface OnboardingViewProps {
  onComplete: () => void;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Reality Sync',
      description: 'Time-stamped proof of what you own. Privacy-first documentation for your peace of mind.',
      icon: Shield,
      color: 'from-navy-700 to-navy-600',
    },
    {
      title: 'Local Storage Only',
      description: 'Your data stays on your device. No cloud, no servers, no tracking. Complete control over your information.',
      icon: Database,
      color: 'from-accent-blue to-accent-blue-light',
    },
    {
      title: 'Capture & Protect',
      description: 'Document your property room-by-room. Generate professional claim packets in seconds when you need them.',
      icon: Camera,
      color: 'from-navy-600 to-accent-blue',
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-blue-light flex items-center justify-center luxury-shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">Reality Sync</h1>
          <p className="text-silver-300 text-sm">Premium Property Protection</p>
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-2xl p-8 luxury-shadow-xl mb-8">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center mb-6 luxury-shadow`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-semibold text-navy-900 mb-3 tracking-tight">
            {currentStep.title}
          </h2>
          <p className="text-silver-500 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Privacy Badge */}
          {step === 1 && (
            <div className="mt-6 bg-silver-50 rounded-xl p-4 border border-silver-200">
              <div className="flex items-center gap-2 text-sm text-navy-700">
                <Lock className="w-4 h-4 text-accent-blue" />
                <span className="font-medium">Your data is encrypted locally</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress & Navigation */}
        <div className="space-y-4">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === step 
                    ? 'w-8 bg-accent-blue' 
                    : 'w-2 bg-silver-300 hover:bg-silver-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  setOnboardingComplete();
                  onComplete();
                }
              }}
              className="flex-1 bg-gradient-to-r from-accent-blue to-accent-blue-light hover:from-accent-blue-light hover:to-accent-blue text-white shadow-lg"
            >
              {step < steps.length - 1 ? 'Continue' : 'Get Started'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Skip */}
          {step < steps.length - 1 && (
            <button
              onClick={() => {
                setOnboardingComplete();
                onComplete();
              }}
              className="w-full text-center text-sm text-silver-300 hover:text-white transition-colors"
            >
              Skip tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}