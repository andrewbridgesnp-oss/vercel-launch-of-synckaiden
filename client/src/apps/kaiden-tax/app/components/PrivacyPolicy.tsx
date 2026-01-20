import { Lock, Shield, Database, Eye, Mail } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            <Lock className="w-8 h-8 text-emerald-400" />
            Privacy Policy
          </h1>
          <p className="text-slate-400">Effective Date: January 15, 2026</p>
        </div>

        <div className="space-y-6">
          {/* Privacy Promise */}
          <div className="p-6 rounded-xl border" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))',
            borderColor: 'rgba(16, 185, 129, 0.3)',
          }}>
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-100 text-lg">Our Privacy Commitment</h3>
                <p className="text-sm text-slate-300">
                  Your privacy is critically important to us. <strong>We do not sell your data.</strong> We collect only 
                  what's necessary to provide our service, and we protect it with enterprise-grade encryption. 
                  You have full control over your information at all times.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 rounded-xl border space-y-8" style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderColor: 'rgba(168, 182, 216, 0.2)',
          }}>
            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="font-semibold text-slate-200 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Password (encrypted, never stored in plain text)</li>
                    <li>Payment information (processed and stored by Stripe, not on our servers)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-200 mb-2">Tax and Financial Data</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                    <li>Income information (W-2s, 1099s, self-employment income)</li>
                    <li>Deductions and credits you enter</li>
                    <li>Cryptocurrency transaction history (if uploaded)</li>
                    <li>Investment and retirement account data</li>
                    <li>State of residence</li>
                    <li>Filing status and dependent information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-200 mb-2">Uploaded Documents</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                    <li>PDF copies of tax forms (W-2, 1099, etc.)</li>
                    <li>CSV files of cryptocurrency transactions</li>
                    <li>Any other documents you choose to upload</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-200 mb-2">Usage and Technical Data</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on platform</li>
                    <li>Features used and actions taken</li>
                    <li>Error logs and performance metrics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" />
                2. How We Use Your Data
              </h2>
              <div className="space-y-3 text-slate-300">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li><strong>Provide tax calculations:</strong> Process your data through our tax engine</li>
                  <li><strong>Secure your account:</strong> Authenticate users and prevent unauthorized access</li>
                  <li><strong>Process payments:</strong> Handle subscriptions and one-time purchases</li>
                  <li><strong>Improve the service:</strong> Analyze usage patterns to enhance functionality</li>
                  <li><strong>Provide support:</strong> Respond to your questions and technical issues</li>
                  <li><strong>Send notifications:</strong> Tax deadline reminders and product updates (opt-out available)</li>
                  <li><strong>Comply with legal obligations:</strong> Respond to lawful requests from authorities</li>
                </ul>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 mt-4">
                  <p className="text-emerald-300 font-semibold">
                    We do NOT use your data to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400 mt-2">
                    <li>Sell to third parties or data brokers</li>
                    <li>Target you with ads</li>
                    <li>Share with other users</li>
                    <li>Train AI models for external purposes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">3. Data Sharing and Third Parties</h2>
              <div className="space-y-4 text-slate-300">
                <p className="font-semibold text-slate-200">
                  We do not sell your personal information. We only share data with the following trusted partners:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Supabase</h4>
                    <p className="text-sm text-slate-400">
                      <strong>Purpose:</strong> Authentication and database<br />
                      <strong>Data shared:</strong> Email, encrypted password, tax data<br />
                      <strong>Security:</strong> SOC 2 Type II certified
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Stripe</h4>
                    <p className="text-sm text-slate-400">
                      <strong>Purpose:</strong> Payment processing<br />
                      <strong>Data shared:</strong> Email, payment information<br />
                      <strong>Security:</strong> PCI DSS Level 1 certified
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Vercel/Netlify</h4>
                    <p className="text-sm text-slate-400">
                      <strong>Purpose:</strong> Hosting and delivery<br />
                      <strong>Data shared:</strong> Technical data only<br />
                      <strong>Security:</strong> Enterprise-grade infrastructure
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Legal Authorities</h4>
                    <p className="text-sm text-slate-400">
                      <strong>Purpose:</strong> Compliance with law<br />
                      <strong>Data shared:</strong> Only as legally required<br />
                      <strong>Notification:</strong> You'll be notified unless prohibited
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                4. Data Security
              </h2>
              <div className="space-y-4 text-slate-300">
                <p className="font-semibold text-slate-200">
                  We employ industry-leading security measures to protect your data:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-semibold text-emerald-300 text-sm mb-1">Encryption in Transit</h4>
                    <p className="text-xs text-slate-400">TLS 1.3 for all data transfers</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-semibold text-emerald-300 text-sm mb-1">Encryption at Rest</h4>
                    <p className="text-xs text-slate-400">AES-256 for stored data</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-semibold text-emerald-300 text-sm mb-1">Password Security</h4>
                    <p className="text-xs text-slate-400">Bcrypt hashing with salt</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-semibold text-emerald-300 text-sm mb-1">Access Control</h4>
                    <p className="text-xs text-slate-400">Role-based permissions</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-semibold text-emerald-300 text-sm mb-1">Regular Backups</h4>
                    <p className="text-xs text-slate-400">Daily encrypted backups</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-semibold text-emerald-300 text-sm mb-1">2FA Available</h4>
                    <p className="text-xs text-slate-400">Multi-factor authentication</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mt-4">
                  <p className="text-amber-300 text-sm">
                    <strong>Security Notice:</strong> No method of transmission or storage is 100% secure. 
                    While we use industry-standard measures, we cannot guarantee absolute security. 
                    You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">5. Your Privacy Rights</h2>
              <div className="space-y-4 text-slate-300">
                <p>You have the following rights regarding your personal data:</p>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Right to Access</h4>
                    <p className="text-sm text-slate-400">
                      You can request a copy of all personal data we hold about you at any time.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Right to Correction</h4>
                    <p className="text-sm text-slate-400">
                      You can update or correct your personal information through your account settings.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Right to Deletion</h4>
                    <p className="text-sm text-slate-400">
                      You can request deletion of your account and data, subject to legal retention requirements (7 years for tax records).
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Right to Export</h4>
                    <p className="text-sm text-slate-400">
                      You can download your data in CSV or JSON format at any time.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-semibold text-slate-200 mb-2">Right to Opt-Out</h4>
                    <p className="text-sm text-slate-400">
                      You can opt out of marketing emails and non-essential notifications.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    <strong>California Residents (CCPA):</strong> If you are a California resident, you have additional rights 
                    including the right to know what personal information we collect, the right to deletion, and the right to 
                    opt-out of any sale of personal information (which we don't do).
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">6. Data Retention</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  We retain different types of data for different periods:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li><strong>Tax data:</strong> 7 years (IRS recordkeeping requirement)</li>
                  <li><strong>Account information:</strong> Until account deletion + 7 years</li>
                  <li><strong>Payment records:</strong> 7 years (financial compliance)</li>
                  <li><strong>Usage logs:</strong> 90 days (security and debugging)</li>
                  <li><strong>Support tickets:</strong> 3 years</li>
                </ul>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 mt-4">
                  <p className="text-sm text-slate-400">
                    <strong className="text-slate-300">Why 7 years?</strong> The IRS recommends keeping tax records for at least 
                    3 years, but up to 7 years in certain situations. We retain data for 7 years to ensure you have access to 
                    historical tax information if needed for audits or amended returns.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">7. Children's Privacy</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  KAIDEN is not intended for use by individuals under the age of 18. We do not knowingly collect personal 
                  information from children. If you are under 18, you must have parental consent to use this service.
                </p>
                <p>
                  If we learn we have collected personal information from a child under 13 without parental consent, 
                  we will delete that information immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">8. Cookies and Tracking</h2>
              <div className="space-y-3 text-slate-300">
                <p>We use the following types of cookies:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li><strong>Essential cookies:</strong> Required for authentication and security</li>
                  <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Analytics cookies:</strong> Understand how you use the platform (anonymized)</li>
                </ul>
                <p>
                  You can disable cookies in your browser settings, but this may limit functionality. We do not use 
                  third-party advertising cookies or trackers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">9. International Users</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  KAIDEN is based in the United States. If you are accessing the service from outside the U.S., 
                  your data will be transferred to and stored on U.S. servers. By using KAIDEN, you consent to 
                  this data transfer.
                </p>
                <p>
                  <strong>GDPR (EU/UK):</strong> If you are in the European Union or United Kingdom, you have additional 
                  rights under GDPR including the right to object to processing and the right to data portability.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4">10. Changes to This Policy</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of material changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-slate-400">
                  <li>Email to your registered email address</li>
                  <li>Prominent notice on the KAIDEN platform</li>
                  <li>Updating the "Effective Date" at the top of this page</li>
                </ul>
                <p>
                  We encourage you to review this Privacy Policy periodically. Continued use after changes constitutes 
                  acceptance of the updated policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                11. Contact Us
              </h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  For questions about this Privacy Policy or to exercise your privacy rights, please contact:
                </p>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-slate-300">
                    <strong>KAIDEN Privacy Team</strong><br />
                    Email: <a href="mailto:privacy@kaiden.tax" className="text-blue-400 hover:text-blue-300">privacy@kaiden.tax</a><br />
                    Support: <a href="mailto:support@kaiden.tax" className="text-blue-400 hover:text-blue-300">support@kaiden.tax</a><br />
                    Response Time: Within 30 days
                  </p>
                </div>
                <p className="text-sm text-slate-400">
                  We take your privacy seriously and will respond to all legitimate requests within 30 days.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500 space-y-2">
            <p>Last updated: January 15, 2026</p>
            <p>
              <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</a>
              {' • '}
              <a href="/" className="text-blue-400 hover:text-blue-300 underline">Back to KAIDEN</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
