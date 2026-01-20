import { PlatformAccessGate } from '../../components/PlatformAccessGate';

// Import the complete KAIDEN Tax App
// Note: The full tax app will be integrated as a separate route
export default function KaidenTaxApp() {
  return (
    <PlatformAccessGate platformSlug="financial-command-center">
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#0A0A0A]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#B76E79] via-[#C0C0C0] to-[#B76E79] bg-clip-text text-transparent mb-4">
              KAIDEN Tax Application
            </h1>
            <p className="text-gray-300 text-lg">
              Professional-grade tax calculations with AI optimization
            </p>
          </div>

          {/* Tax App Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon="💰"
              title="Real-Time Calculations"
              description="IRS-compliant federal & state tax calculations with instant results"
            />
            <FeatureCard
              icon="₿"
              title="Crypto Tax Engine"
              description="FIFO/LIFO/HIFO accounting with wash sale detection"
            />
            <FeatureCard
              icon="🤖"
              title="AI Optimization"
              description="$7,200 average savings through 8 optimization categories"
            />
            <FeatureCard
              icon="👥"
              title="Dual Mode"
              description="Individual filers & tax preparers in one platform"
            />
            <FeatureCard
              icon="📊"
              title="QuickBooks & Xero"
              description="One-click import from accounting software"
            />
            <FeatureCard
              icon="📚"
              title="Tax Knowledge Base"
              description="Built-in IRS publications & CPA insights"
            />
          </div>

          {/* CTA to launch full app */}
          <div className="text-center">
            <a
              href="/apps/kaiden-tax/dashboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#B76E79] to-[#C0C0C0] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Launch Tax Application →
            </a>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400 text-center">
              <strong>Disclaimer:</strong> KAIDEN provides tax calculations and guidance but does not constitute professional tax advice. 
              Consult with a qualified tax professional for your specific situation.
            </p>
          </div>
        </div>
      </div>
    </PlatformAccessGate>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-[#B76E79] transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
