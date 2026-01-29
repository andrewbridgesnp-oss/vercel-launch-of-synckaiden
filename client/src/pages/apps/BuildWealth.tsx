import PlatformAccessGate from '../../components/PlatformAccessGate';

// Placeholder for BuildWealth app
// TODO: Extract and integrate BuildWealth Pro App Prototype.zip

export default function BuildWealth() {
  return (
    <PlatformAccessGate platformSlug="financial-command-center">
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_240)] via-[oklch(0.14_0.03_260)] to-[oklch(0.12_0.02_240)] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-4">
              BuildWealth Pro
            </h1>
            <p className="text-[oklch(0.78_0.08_240)] text-lg mb-8">
              Your comprehensive wealth building platform
            </p>
            <div className="bg-[oklch(0.16_0.02_240)]/50 border border-[oklch(0.78_0.08_240)]/20 rounded-lg p-8">
              <p className="text-[oklch(0.85_0.05_240)]">
                This app is currently being integrated into the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PlatformAccessGate>
  );
}
