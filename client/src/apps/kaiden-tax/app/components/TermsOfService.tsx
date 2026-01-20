import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Shield, AlertTriangle, Scale, Lock } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            <Scale className="w-8 h-8 text-emerald-400" />
            Terms of Service
          </h1>
          <p className="text-slate-400">Effective Date: January 15, 2026</p>
        </div>

        <div className="space-y-6">
          {/* Critical Notice */}
          <div className="p-6 rounded-xl border" style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          }}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-100 text-lg">Important Legal Notice</h3>
                <p className="text-sm text-slate-300">
                  KAIDEN is an educational tax calculation and planning platform. <strong>We do not file tax returns</strong> and 
                  <strong> do not provide tax, legal, or financial advice</strong>. All calculations and recommendations are for 
                  informational purposes only. You must consult with a licensed tax professional before making any financial decisions 
                  or filing your tax return.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="p-6 rounded-xl border space-y-8" style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}>
            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">1. Nature of the Service</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  KAIDEN is a tax calculation and planning platform that provides automated estimates based on user input. 
                  KAIDEN is <strong>not a tax filing service</strong>, does not file tax returns, and does not provide tax, 
                  legal, or financial advice. All outputs are for informational and educational purposes only.
                </p>
                <p>
                  By using KAIDEN, you acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li>Calculations are estimates and may differ from actual IRS calculations</li>
                  <li>You are solely responsible for the accuracy of information you provide</li>
                  <li>KAIDEN does not replace professional tax advice</li>
                  <li>You must verify all calculations with a licensed tax professional</li>
                  <li>Use of KAIDEN does not create any professional relationship with tax advisors</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">2. User Accounts</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  You must create an account to access certain features of KAIDEN. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain the security of your password and account credentials</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Be at least 18 years old or have parental consent</li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms or are inactive for extended periods.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">3. Data Collection and Use</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  By using KAIDEN, you agree to our data practices as outlined in the Privacy Policy. 
                  You retain ownership of your data, but grant KAIDEN a limited license to use it to provide the Service.
                </p>
                <p>
                  We collect and process:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li>Personal information (name, email address)</li>
                  <li>Tax data you input into the platform</li>
                  <li>Uploaded documents (W-2s, 1099s, crypto transaction CSVs)</li>
                  <li>Usage data and analytics</li>
                  <li>Payment information (processed securely via Stripe)</li>
                </ul>
                <p>
                  All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We retain data for 7 years in accordance 
                  with IRS recordkeeping guidelines.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">4. Limitations and Disclaimers</h2>
              <div className="space-y-3 text-slate-300">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="font-semibold text-amber-300 mb-2">CRITICAL DISCLAIMERS:</p>
                  <ul className="list-disc list-inside space-y-2 text-slate-400">
                    <li>KAIDEN does <strong>not guarantee accuracy</strong> of calculations</li>
                    <li>You are <strong>solely responsible</strong> for your tax filings and financial decisions</li>
                    <li>Use of this platform does <strong>not create a client relationship</strong> with any tax professional</li>
                    <li>Results may differ from IRS or state filings</li>
                    <li>Calculations are based on general tax rules and may not account for all circumstances</li>
                    <li>We make no warranties, express or implied, about the Service</li>
                  </ul>
                </div>
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, 
                  FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">5. IRS Circular 230 Disclaimer</h2>
              <div className="space-y-3 text-slate-300">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm italic text-blue-300">
                    <strong>IRS Circular 230 Notice:</strong> Nothing in this platform is intended or written to be used, 
                    and it cannot be used, for the purpose of (i) avoiding penalties under the Internal Revenue Code or 
                    (ii) promoting, marketing, or recommending any transaction or matter addressed herein.
                  </p>
                </div>
                <p className="text-sm text-slate-400">
                  This disclaimer is required by U.S. Treasury regulations governing tax advisors. KAIDEN is a calculation 
                  tool, not a tax advisory service, and does not provide opinions or recommendations intended to be used 
                  for tax penalty avoidance.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">6. Third-Party Services</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  KAIDEN uses the following third-party services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li><strong>Supabase:</strong> Authentication and database services</li>
                  <li><strong>Stripe:</strong> Payment processing</li>
                  <li><strong>Vercel/Netlify:</strong> Hosting and content delivery</li>
                </ul>
                <p>
                  By using KAIDEN, you agree to the terms and privacy policies of these third-party providers. 
                  We are not responsible for their practices or any issues arising from their services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">7. Limitation of Liability</h2>
              <div className="space-y-3 text-slate-300">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="font-semibold text-red-300 mb-2">MAXIMUM LIABILITY:</p>
                  <p className="text-slate-400">
                    KAIDEN shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                    resulting from your use of the Service, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-slate-400">
                    <li>Tax penalties or interest</li>
                    <li>Missed deductions or credits</li>
                    <li>Audit-related costs</li>
                    <li>Lost refunds or overpayments</li>
                    <li>Business interruption or data loss</li>
                  </ul>
                </div>
                <p>
                  <strong>Our maximum liability to you will not exceed the amount you paid, if any, in the last 12 months.</strong>
                </p>
                <p className="text-sm text-slate-400">
                  Some jurisdictions do not allow limitation of liability, so this may not apply to you.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">8. Indemnification</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  You agree to indemnify, defend, and hold harmless KAIDEN, its affiliates, officers, directors, employees, 
                  and agents from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including 
                  reasonable attorneys' fees) arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li>Your use or misuse of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Inaccurate information you provide</li>
                  <li>Tax filings you submit based on KAIDEN calculations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">9. Payments and Refunds</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  Certain features of KAIDEN require payment. By purchasing access:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li>You agree to pay all fees as displayed at time of purchase</li>
                  <li>All payments are processed securely through Stripe</li>
                  <li>Prices are subject to change with 30 days notice</li>
                  <li>Refunds are provided at our sole discretion within 7 days of purchase</li>
                  <li>Subscriptions auto-renew unless cancelled before renewal date</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">10. Termination</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  We reserve the right to suspend or terminate your account at our sole discretion, with or without notice, for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Abuse of the Service or other users</li>
                  <li>Non-payment of fees</li>
                  <li>Extended inactivity (12+ months)</li>
                </ul>
                <p>
                  Upon termination, your right to use the Service ceases immediately. We will retain your data for 7 years 
                  as required by IRS regulations, but you may request deletion subject to legal requirements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">11. Dispute Resolution</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  <strong>Binding Arbitration:</strong> Any dispute arising from these Terms or use of KAIDEN shall be 
                  resolved through binding arbitration in accordance with the American Arbitration Association rules, 
                  rather than in court, except you may assert claims in small claims court if they qualify.
                </p>
                <p>
                  <strong>Class Action Waiver:</strong> You agree to bring claims only in your individual capacity, 
                  not as a class member in any class action proceeding.
                </p>
                <p className="text-sm text-slate-400">
                  Some jurisdictions do not allow arbitration agreements, so this may not apply to you.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">12. Governing Law</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  These Terms are governed by the laws of the State of Delaware, United States, without regard to its 
                  conflict of law principles. Any legal action must be brought in the state or federal courts located 
                  in Delaware.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">13. Changes to Terms</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  We may update these Terms from time to time. We will notify you of material changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li>Email notification to your registered email address</li>
                  <li>Prominent notice on the KAIDEN platform</li>
                  <li>Updating the "Effective Date" at the top of this page</li>
                </ul>
                <p>
                  Continued use of KAIDEN after changes constitutes your acceptance of the new Terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">14. Contact Us</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  For questions about these Terms of Service, please contact:
                </p>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-slate-300">
                    <strong>KAIDEN Legal Team</strong><br />
                    Email: <a href="mailto:legal@kaiden.tax" className="text-blue-400 hover:text-blue-300">legal@kaiden.tax</a><br />
                    Support: <a href="mailto:support@kaiden.tax" className="text-blue-400 hover:text-blue-300">support@kaiden.tax</a>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500 space-y-2">
            <p>Last updated: January 15, 2026</p>
            <p>
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>
              {' • '}
              <a href="/" className="text-blue-400 hover:text-blue-300 underline">Back to KAIDEN</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
