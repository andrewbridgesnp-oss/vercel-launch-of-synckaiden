import { AlertCircle } from 'lucide-react';

export function LegalDisclaimer() {
  return (
    <div className="w-full p-4 rounded-xl border" style={{
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    }}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-3 text-sm text-slate-300">
          <p className="font-semibold text-slate-200">
            Legal Disclaimer
          </p>
          <p>
            <strong>KAIDEN is not a tax filing service</strong> and does not provide tax, legal, or financial advice. 
            The information and calculations provided are for educational and planning purposes only. 
            You should consult with a licensed tax professional before filing your return or making financial decisions. 
            Use of this platform does not create a client relationship with any tax advisor.
          </p>
          <div className="pt-2 mt-2 border-t border-red-400/20">
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">IRS Circular 230 Notice:</strong> Nothing in this tool is intended or written to be used, 
              and it cannot be used, for the purpose of (i) avoiding tax penalties under the Internal Revenue Code, 
              or (ii) promoting, marketing, or recommending any transaction or matter addressed herein.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompactLegalDisclaimer() {
  return (
    <div className="text-xs text-slate-500 text-center max-w-4xl mx-auto">
      <p>
        <strong className="text-slate-400">Disclaimer:</strong> KAIDEN is an educational tax planning tool, not a tax filing service. 
        Consult a licensed tax professional before making financial decisions. 
        See our <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</a> and{' '}
        <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
