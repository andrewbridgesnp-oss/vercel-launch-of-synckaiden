// KAIDEN CAPITAL™ - Intake Wizard Component
// 7-minute onboarding flow

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  DollarSign,
  Target,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export const IntakeWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    track: '',
    businessName: '',
    entityType: '',
    timeInBusiness: '',
    annualRevenue: '',
    targetAmount: '',
    urgency: '',
    purpose: '',
  });

  const steps = [
    {
      id: 'track',
      title: 'Choose Your Track',
      description: 'What type of funding are you seeking?',
    },
    {
      id: 'business-info',
      title: 'Business Information',
      description: 'Tell us about your business',
    },
    {
      id: 'funding-needs',
      title: 'Funding Needs',
      description: 'How much capital do you need?',
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'When do you need funding?',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success('Intake completed!', {
        description: 'Generating your personalized funding map...',
      });
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-1">
              KAIDEN <span className="kaiden-gradient-text">CAPITAL</span>
            </h1>
            <p className="text-sm text-muted-foreground">Let's find your perfect funding match</p>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>

          {/* Step Content */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'business', name: 'Business', icon: Building2, desc: 'Traditional business funding' },
                { id: 'real-estate', name: 'Real Estate', icon: Building2, desc: 'Property investment loans' },
                { id: 'creator', name: 'Creator', icon: Target, desc: 'Revenue-based financing' },
              ].map((track) => (
                <button
                  key={track.id}
                  onClick={() => setFormData({ ...formData, track: track.id })}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    formData.track === track.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <track.icon className={`w-8 h-8 mb-3 ${formData.track === track.id ? 'text-blue-500' : 'text-gray-400'}`} />
                  <h3 className="font-semibold mb-1">{track.name}</h3>
                  <p className="text-sm text-muted-foreground">{track.desc}</p>
                  {formData.track === track.id && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-2" />
                  )}
                </button>
              ))}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Your Business LLC"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Entity Type</label>
                <select
                  value={formData.entityType}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select entity type</option>
                  <option value="llc">LLC</option>
                  <option value="s-corp">S-Corp</option>
                  <option value="c-corp">C-Corp</option>
                  <option value="sole-proprietor">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time in Business (months)</label>
                <input
                  type="number"
                  value={formData.timeInBusiness}
                  onChange={(e) => setFormData({ ...formData, timeInBusiness: e.target.value })}
                  placeholder="24"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Annual Revenue</label>
                <input
                  type="number"
                  value={formData.annualRevenue}
                  onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                  placeholder="500000"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Target Funding Amount</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="150000"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter the amount you're looking to secure
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Primary Purpose</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select purpose</option>
                  <option value="expansion">Business Expansion</option>
                  <option value="equipment">Equipment Purchase</option>
                  <option value="inventory">Inventory</option>
                  <option value="working-capital">Working Capital</option>
                  <option value="marketing">Marketing & Growth</option>
                  <option value="hiring">Hiring & Payroll</option>
                  <option value="real-estate">Real Estate Purchase</option>
                  <option value="refinance">Refinance Debt</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">When do you need funding?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'critical', name: 'ASAP (Within 1 week)', color: 'red' },
                    { id: 'high', name: 'Soon (1-2 weeks)', color: 'orange' },
                    { id: 'medium', name: 'Within a month', color: 'yellow' },
                    { id: 'low', name: 'No rush (1-3 months)', color: 'blue' },
                  ].map((urgency) => (
                    <button
                      key={urgency.id}
                      onClick={() => setFormData({ ...formData, urgency: urgency.id })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.urgency === urgency.id
                          ? `border-${urgency.color}-500 bg-${urgency.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold mb-1">{urgency.name}</h3>
                      {formData.urgency === urgency.id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-500 mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-sm">
                <p className="font-semibold text-blue-900 mb-1">Almost done!</p>
                <p className="text-blue-700">
                  We'll use this information to generate your personalized Funding Map with ranked recommendations.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
