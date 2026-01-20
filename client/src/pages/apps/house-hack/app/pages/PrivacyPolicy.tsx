import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a1128] text-[#e8ecf4]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-[#c0c5ce] hover:text-[#e8ecf4]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-[#e8ecf4]">Privacy Policy</h1>
        
        <div className="space-y-6 text-[#c0c5ce] leading-relaxed">
          <p className="text-sm text-[#9ca3b0]">
            <strong>Last Updated:</strong> January 11, 2026
          </p>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">1. Introduction</h2>
            <p>
              KAIDEN HouseHack 203K ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
              This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and password</li>
              <li>Phone number (optional)</li>
              <li>Professional credentials (license numbers for agents, lenders, contractors)</li>
              <li>Property and financial information you enter for deal analysis</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">2.2 Usage Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address, browser type, and device information</li>
              <li>Pages visited, time spent, and features used</li>
              <li>Referral source (including agent referral codes)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">2.3 Communications</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Messages sent through the platform</li>
              <li>Support inquiries and feedback</li>
              <li>Email correspondence</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Provide Services:</strong> Enable deal room management, calculations, team collaboration</li>
              <li><strong>Process Payments:</strong> Handle subscriptions and agent commissions</li>
              <li><strong>Improve Platform:</strong> Analyze usage patterns to enhance features</li>
              <li><strong>Communications:</strong> Send account updates, security alerts, and marketing (with consent)</li>
              <li><strong>Compliance:</strong> Meet legal obligations and enforce our Terms of Service</li>
              <li><strong>Security:</strong> Protect against fraud, abuse, and security threats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">4. Data Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">4.1 We Share Data With:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Team Members:</strong> Users you invite to your deal rooms</li>
              <li><strong>Service Providers:</strong> Supabase (hosting), Stripe (payments), email services</li>
              <li><strong>Agents:</strong> Referring agents can see their referral statistics but NOT your financial details</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">4.2 We DO NOT:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sell your personal information to third parties</li>
              <li>Share financial details with lenders without your explicit consent</li>
              <li>Use your property data for competing services</li>
              <li>Send unsolicited marketing from third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">5. Data Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption:</strong> All data transmitted via SSL/TLS</li>
              <li><strong>Storage:</strong> Data encrypted at rest via Supabase</li>
              <li><strong>Access Controls:</strong> Role-based permissions and authentication</li>
              <li><strong>Monitoring:</strong> Continuous security monitoring and audit logs</li>
              <li><strong>Payment Security:</strong> PCI-DSS compliant via Stripe (we never store card numbers)</li>
            </ul>
            <p className="mt-4 text-sm bg-[#2d3e5f] p-4 rounded-lg border border-[#c0c5ce]/20">
              <strong>Note:</strong> No system is 100% secure. While we implement industry-standard security measures, 
              we cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">6. Your Privacy Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request account deletion (some data may be retained for legal compliance)</li>
              <li><strong>Export:</strong> Download your deal data in portable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
              <li><strong>Object:</strong> Object to certain data processing activities</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@kaiden203k.com" className="text-[#98c1d9] hover:underline">privacy@kaiden203k.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">7. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Essential:</strong> Authentication, security, session management (required)</li>
              <li><strong>Analytics:</strong> Usage statistics and performance monitoring (optional)</li>
              <li><strong>Preferences:</strong> Remember your settings and language (optional)</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. Disabling essential cookies may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">8. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Active Accounts:</strong> Data retained while account is active</li>
              <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days</li>
              <li><strong>Legal Requirements:</strong> Some data retained for 7 years (financial records, commissions)</li>
              <li><strong>Backups:</strong> Backup copies deleted within 90 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">9. Children's Privacy</h2>
            <p>
              Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information 
              from children. If you believe a child has provided us with data, contact us immediately at 
              <a href="mailto:privacy@kaiden203k.com" className="text-[#98c1d9] hover:underline"> privacy@kaiden203k.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">10. International Users</h2>
            <p>
              Our services are designed for users in the United States. If you access our platform from outside the U.S., 
              your data may be transferred to and processed in the United States. By using our services, you consent to 
              this transfer and processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">11. California Privacy Rights (CCPA)</h2>
            <p>California residents have additional rights:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of sale of personal information (we don't sell data)</li>
              <li>Right to deletion of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>
            <p className="mt-4">
              To submit a CCPA request: <a href="mailto:privacy@kaiden203k.com" className="text-[#98c1d9] hover:underline">privacy@kaiden203k.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">12. Third-Party Services</h2>
            <p>Our platform integrates with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Supabase:</strong> Database and authentication (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#98c1d9] hover:underline">Privacy Policy</a>)</li>
              <li><strong>Stripe:</strong> Payment processing (<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#98c1d9] hover:underline">Privacy Policy</a>)</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies. We recommend reviewing them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">13. Changes to This Policy</h2>
            <p>
              We may update this privacy policy periodically. Changes will be posted on this page with an updated 
              "Last Updated" date. Significant changes will be communicated via email or platform notification. 
              Continued use of the platform after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">14. Contact Us</h2>
            <p>For privacy-related questions or concerns:</p>
            <div className="mt-4 bg-[#1a2238] p-6 rounded-lg border border-[#c0c5ce]/20">
              <p><strong>KAIDEN HouseHack 203K</strong></p>
              <p>Email: <a href="mailto:privacy@kaiden203k.com" className="text-[#98c1d9] hover:underline">privacy@kaiden203k.com</a></p>
              <p>Support: <a href="mailto:support@kaiden203k.com" className="text-[#98c1d9] hover:underline">support@kaiden203k.com</a></p>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-[#c0c5ce]/20">
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">Educational Disclaimer</h2>
            <p className="text-sm bg-[#3d5a80]/30 p-4 rounded-lg border border-[#98c1d9]/30">
              <strong>Important:</strong> KAIDEN HouseHack 203K is an educational platform providing organizational 
              tools and calculators. We do not provide financial advice, guarantee loan approvals, or ensure specific 
              outcomes. All financial projections are estimates based on user inputs and assumptions. Consult with 
              licensed professionals (mortgage lenders, attorneys, accountants) before making financial decisions.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#c0c5ce]/20">
          <Link to="/terms">
            <Button variant="outline" className="border-[#c0c5ce] text-[#c0c5ce] hover:bg-[#2d3e5f]">
              View Terms of Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
