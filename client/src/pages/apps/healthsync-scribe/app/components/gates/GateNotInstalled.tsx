import React from 'react';
import { GateCard } from '../integration/GateCard';
import { Package, Sparkles } from 'lucide-react';

interface GateNotInstalledProps {
  onInstall: () => void;
  onViewFeatures: () => void;
  onViewPricing: () => void;
}

export function GateNotInstalled({
  onInstall,
  onViewFeatures,
  onViewPricing,
}: GateNotInstalledProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-silver-50 to-navy-50/30 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <GateCard
          type="not_installed"
          title="Install Kaiden Scribe"
          description="AI-powered clinical documentation platform. Save 90+ minutes daily with automated visit documentation, intelligent coding suggestions, and seamless EHR integration."
          primaryAction={{
            label: 'Install App',
            onClick: onInstall,
          }}
          secondaryAction={{
            label: 'View Features',
            onClick: onViewFeatures,
          }}
        >
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3 p-4 bg-navy-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-navy-900 mb-1">AI Scribe</h4>
                <p className="text-sm text-silver-600">
                  Automatic visit documentation with evidence-based suggestions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-navy-50 rounded-lg">
              <Package className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-navy-900 mb-1">EHR Integration</h4>
                <p className="text-sm text-silver-600">
                  Works with Epic, Cerner, and any FHIR-compliant system
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Link */}
          <button
            onClick={onViewPricing}
            className="text-navy-700 hover:text-navy-900 text-sm font-semibold underline"
          >
            View Pricing Plans
          </button>
        </GateCard>
      </div>
    </div>
  );
}
