import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { AlertCircle, FileText, Shield } from 'lucide-react';

interface TermsAcceptanceProps {
  onAccept: () => void;
}

export function TermsAcceptance({ onAccept }: TermsAcceptanceProps) {
  const [open, setOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    // Check if user has previously accepted terms
    const accepted = localStorage.getItem('kaiden_terms_accepted');
    if (!accepted) {
      setOpen(true);
    } else {
      onAccept();
    }
  }, []);

  const handleAccept = () => {
    if (termsAccepted && privacyAccepted && disclaimerAccepted) {
      localStorage.setItem('kaiden_terms_accepted', 'true');
      localStorage.setItem('kaiden_terms_date', new Date().toISOString());
      setOpen(false);
      onAccept();
    }
  };

  const canProceed = termsAccepted && privacyAccepted && disclaimerAccepted;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh]"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
          border: '1px solid rgba(168, 182, 216, 0.2)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            Welcome to KAIDEN
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Please review and accept our terms before using the platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Critical Disclaimer */}
          <div className="p-4 rounded-xl border" style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm text-slate-300">
                <p className="font-semibold text-slate-200">
                  IMPORTANT: KAIDEN Is NOT a Tax Filing Service
                </p>
                <p>
                  KAIDEN provides tax calculations and planning scenarios for <strong>educational purposes only</strong>. 
                  This is not tax advice. We do not file tax returns. You must consult a licensed tax professional 
                  before making financial decisions or filing with the IRS.
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Terms Preview */}
          <ScrollArea className="h-64 rounded-xl border p-4" style={{
            background: 'rgba(15, 23, 42, 0.5)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}>
            <div className="space-y-4 text-sm text-slate-300 pr-4">
              <div>
                <h3 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Key Terms of Service
                </h3>
                <ul className="space-y-2 list-disc list-inside text-slate-400">
                  <li>KAIDEN is an educational tool, not a tax filing or advisory platform</li>
                  <li>You are solely responsible for your tax filings and financial decisions</li>
                  <li>All calculations are estimates and may differ from IRS results</li>
                  <li>We do not guarantee accuracy or refund amounts</li>
                  <li>Use does not create a client-advisor relationship</li>
                  <li>Data is encrypted and stored securely (AES-256)</li>
                  <li>We retain data for 7 years per IRS guidelines</li>
                  <li>Liability is limited to amount paid in last 12 months</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <h4 className="font-semibold text-slate-200 mb-2">IRS Circular 230 Disclaimer</h4>
                <p className="text-xs text-slate-400 italic">
                  Nothing in this platform is intended or written to be used, and it cannot be used, 
                  for the purpose of (i) avoiding penalties under the Internal Revenue Code or 
                  (ii) promoting, marketing, or recommending any transaction or matter addressed herein.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <h4 className="font-semibold text-slate-200 mb-2">Privacy Highlights</h4>
                <ul className="space-y-1 list-disc list-inside text-slate-400 text-xs">
                  <li>We collect: email, tax data, payment info (via Stripe)</li>
                  <li>We do NOT sell your data to third parties</li>
                  <li>Data shared only with: Supabase (auth/database), Stripe (payments)</li>
                  <li>You can access or delete your data anytime</li>
                  <li>All data encrypted in transit and at rest</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <h4 className="font-semibold text-slate-200 mb-2">Your Responsibilities</h4>
                <ul className="space-y-1 list-disc list-inside text-slate-400 text-xs">
                  <li>Provide accurate information for calculations</li>
                  <li>Verify all results with a licensed tax professional</li>
                  <li>Keep your account credentials secure</li>
                  <li>Do not use KAIDEN as substitute for professional tax advice</li>
                  <li>Understand that calculations are estimates only</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-700/50 text-xs text-slate-500">
                <p>
                  Full <a href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</a> and{' '}
                  <a href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a> available for review.
                </p>
              </div>
            </div>
          </ScrollArea>

          {/* Acceptance Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor="terms" 
                className="text-sm text-slate-300 cursor-pointer"
              >
                I have read and agree to the{' '}
                <a href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                  Terms of Service
                </a>
                {' '}and understand that KAIDEN is not a tax filing service
              </label>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
              <Checkbox 
                id="privacy" 
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor="privacy" 
                className="text-sm text-slate-300 cursor-pointer"
              >
                I have read and agree to the{' '}
                <a href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </a>
                {' '}and consent to data collection as described
              </label>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/30 transition-colors">
              <Checkbox 
                id="disclaimer" 
                checked={disclaimerAccepted}
                onCheckedChange={(checked) => setDisclaimerAccepted(checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor="disclaimer" 
                className="text-sm text-slate-300 cursor-pointer"
              >
                I understand this is for <strong>educational purposes only</strong> and I will consult 
                a licensed tax professional before filing my return or making financial decisions
              </label>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleAccept}
            disabled={!canProceed}
            className="w-full py-6 text-lg"
            style={{
              background: canProceed
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))'
                : 'rgba(71, 85, 105, 0.5)',
              color: canProceed ? '#ffffff' : '#94a3b8',
              cursor: canProceed ? 'pointer' : 'not-allowed'
            }}
          >
            {canProceed ? 'I Accept - Continue to KAIDEN' : 'Please Accept All Terms to Continue'}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By clicking "I Accept", you acknowledge you have read, understood, and agree to be bound by these terms.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
