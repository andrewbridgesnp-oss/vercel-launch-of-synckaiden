import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a1128] text-[#e8ecf4]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 text-[#c0c5ce] hover:text-[#e8ecf4]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-[#e8ecf4]">Terms of Service</h1>
        
        <div className="space-y-6 text-[#c0c5ce] leading-relaxed">
          <p className="text-sm text-[#9ca3b0]">
            <strong>Last Updated:</strong> January 11, 2026
          </p>

          <p className="text-lg">
            Please read these Terms of Service ("Terms") carefully before using KAIDEN HouseHack 203K ("the Platform," "Service," "we," "us," or "our").
          </p>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Platform, you agree to be bound by these Terms and our Privacy Policy. 
              If you do not agree, do not use the Service. We reserve the right to modify these Terms at any time. 
              Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">2. Educational Platform - No Financial Advice</h2>
            <div className="bg-[#ee6c4d]/10 border-2 border-[#ee6c4d] p-6 rounded-lg">
              <p className="font-bold text-[#ee6c4d] mb-4">CRITICAL DISCLAIMER:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Educational Tool Only:</strong> This Platform provides educational resources and organizational tools. It is NOT financial, legal, or tax advice.</li>
                <li><strong>No Guarantees:</strong> We do not guarantee loan approvals, interest rates, property values, rehab costs, rental income, or any financial outcomes.</li>
                <li><strong>Not Mortgage-Free:</strong> We do not promise "mortgage-free living" or that rental income will cover all expenses.</li>
                <li><strong>Assumptions & Estimates:</strong> All calculators use assumptions and estimates. Results may differ significantly from reality.</li>
                <li><strong>Consult Professionals:</strong> Always consult licensed mortgage lenders, real estate attorneys, CPAs, and other professionals before making financial decisions.</li>
                <li><strong>Lender Overlays:</strong> Individual lenders may have stricter requirements than FHA minimums. Approval depends on your specific situation.</li>
                <li><strong>Market Variability:</strong> Interest rates, property values, and rehab costs fluctuate. Historical data does not guarantee future results.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">3. Eligibility</h2>
            <p>You must be:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>At least 18 years of age</li>
              <li>Legally capable of entering into binding contracts</li>
              <li>A resident of the United States or its territories</li>
              <li>Not prohibited from using the Service by any applicable law</li>
            </ul>
            <p className="mt-4">
              Professional users (agents, lenders, contractors) must possess valid licenses where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">4. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate, current information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must not share login credentials</li>
              <li>One person per account (no sharing)</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>We reserve the right to suspend or terminate accounts for violations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">5. Subscription Plans & Billing</h2>
            
            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">5.1 Plan Types</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Free Plan:</strong> Limited to 1 Deal Room, basic features</li>
              <li><strong>Pro Plan ($29/month):</strong> Unlimited Deal Rooms, advanced features</li>
              <li><strong>Team Plan ($99/month):</strong> Multi-user workspace, partner features</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">5.2 Billing Terms</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions renew automatically each month</li>
              <li>Charges occur on signup date each billing cycle</li>
              <li>Prices may change with 30 days notice</li>
              <li>No refunds for partial months</li>
              <li>Cancel anytime (access continues until end of billing period)</li>
              <li>Downgrades take effect at next billing cycle</li>
              <li>Upgrades are effective immediately and prorated</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">5.3 Payment Processing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments processed securely via Stripe</li>
              <li>You must provide valid payment method</li>
              <li>We may suspend service for failed payments</li>
              <li>You authorize automatic billing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">6. Agent Referral Program</h2>
            
            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">6.1 Commission Structure</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Real estate agents earn 20% commission on referred client subscriptions</li>
              <li>Commissions are recurring as long as client maintains paid subscription</li>
              <li>Minimum payout threshold: $50</li>
              <li>Payouts processed monthly within 15 days of month-end</li>
              <li>Agents must provide valid tax information (W-9)</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">6.2 Agent Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Must hold valid real estate license</li>
              <li>Cannot make false claims about loan approvals or outcomes</li>
              <li>Cannot guarantee financial results</li>
              <li>Must comply with RESPA and state real estate laws</li>
              <li>No steering clients to specific lenders for additional compensation</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">6.3 Commission Forfeiture</h3>
            <p>We may withhold or cancel commissions if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fraudulent referrals detected</li>
              <li>Agent license suspended or revoked</li>
              <li>Violation of these Terms</li>
              <li>Client requests refund for service issues we caused</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">7. User Content & Conduct</h2>
            
            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">7.1 Your Content</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain ownership of content you upload (property data, documents, photos)</li>
              <li>You grant us a license to store, process, and display your content to provide the Service</li>
              <li>You are responsible for backing up your data</li>
              <li>You represent that you have rights to all uploaded content</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">7.2 Prohibited Conduct</h3>
            <p>You may NOT:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or viruses</li>
              <li>Scrape or harvest data from the Platform</li>
              <li>Reverse engineer or decompile the Service</li>
              <li>Resell or redistribute access to the Platform</li>
              <li>Create fake accounts or impersonate others</li>
              <li>Spam or harass other users</li>
              <li>Use bots or automated tools without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">8. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Platform, its design, code, and content are owned by KAIDEN HouseHack 203K</li>
              <li>Our trademarks, logos, and brand features are protected</li>
              <li>You receive a limited, non-exclusive license to use the Service</li>
              <li>This license terminates when your account is closed</li>
              <li>You may not use our IP for commercial purposes without written permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">9. Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Platform integrates with Stripe, Supabase, and other services</li>
              <li>These services have separate terms and privacy policies</li>
              <li>We are not responsible for third-party service issues</li>
              <li>Partner marketplace lists independent contractors - we do not employ them</li>
              <li>Transactions with partners are between you and them directly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">10. Partner Marketplace</h2>
            <div className="bg-[#3d5a80]/30 p-4 rounded-lg border border-[#98c1d9]/30">
              <p className="font-bold mb-2">Important:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Partners listed are independent third parties</li>
                <li>We do not employ, endorse, or guarantee any partner</li>
                <li>Verification badges indicate license/credential check only</li>
                <li>You are responsible for due diligence on partners</li>
                <li>Contracts and payments are between you and the partner</li>
                <li>We earn no compensation from partner transactions</li>
                <li>Report issues to support@kaiden203k.com</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">11. Data Accuracy & Limitations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>FHA Rules:</strong> We strive for accuracy but rules change. Verify with HUD.gov or your lender.</li>
              <li><strong>Loan Limits:</strong> County limits updated annually but may lag HUD announcements.</li>
              <li><strong>Calculators:</strong> Use default assumptions (stated clearly). Your actual costs may vary.</li>
              <li><strong>Property Valuations:</strong> Estimates only. Appraisals may differ significantly.</li>
              <li><strong>Rental Income:</strong> Market-based estimates. Actual rents depend on many factors.</li>
              <li><strong>No Real-Time Data:</strong> We do not provide live MLS feeds or real-time interest rates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">12. Limitation of Liability</h2>
            <div className="bg-[#ee6c4d]/10 border border-[#ee6c4d] p-4 rounded-lg">
              <p className="font-bold mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE"</li>
                <li>WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED</li>
                <li>WE ARE NOT LIABLE FOR LOAN DENIALS, FINANCIAL LOSSES, OR BUSINESS INTERRUPTION</li>
                <li>OUR TOTAL LIABILITY IS LIMITED TO FEES PAID IN THE PAST 12 MONTHS</li>
                <li>WE ARE NOT LIABLE FOR THIRD-PARTY ACTIONS (PARTNERS, LENDERS, ETC.)</li>
                <li>WE ARE NOT LIABLE FOR DATA LOSS (YOU SHOULD BACKUP YOUR DATA)</li>
                <li>SOME STATES DON'T ALLOW LIABILITY LIMITATIONS - YOUR RIGHTS MAY VARY</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless KAIDEN HouseHack 203K from any claims, damages, or expenses 
              (including attorneys' fees) arising from: (a) your use of the Service, (b) your violation of these Terms, 
              (c) your violation of any law or third-party rights, or (d) your content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">14. Termination</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may cancel your account anytime via account settings</li>
              <li>We may suspend or terminate accounts for Terms violations</li>
              <li>We may terminate the Service entirely with 30 days notice</li>
              <li>Upon termination, you may export your data (available for 30 days)</li>
              <li>No refunds for early termination</li>
              <li>Sections that should survive termination (IP, liability, etc.) will survive</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">15. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">15.1 Informal Resolution</h3>
            <p>
              Before filing any legal claim, you agree to contact us at legal@kaiden203k.com and attempt 
              informal resolution for at least 30 days.
            </p>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">15.2 Arbitration</h3>
            <p>
              Any disputes will be resolved through binding arbitration (not court), except for small claims 
              court matters. Arbitration will be conducted by the American Arbitration Association (AAA) under 
              its Commercial Arbitration Rules.
            </p>

            <h3 className="text-xl font-semibold text-[#e8ecf4] mt-4 mb-2">15.3 Class Action Waiver</h3>
            <p>
              You agree to resolve disputes individually, not as part of a class action, consolidated action, 
              or representative action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">16. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, without regard to conflict of law 
              principles. Any arbitration or court proceedings will occur in Delaware.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">17. Severability</h2>
            <p>
              If any provision of these Terms is found invalid or unenforceable, the remaining provisions will 
              remain in full effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">18. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Material changes will be communicated via email or platform 
              notification 30 days before taking effect. Continued use after changes constitutes acceptance. 
              If you don't agree to changes, you must cancel your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">19. Contact Information</h2>
            <div className="mt-4 bg-[#1a2238] p-6 rounded-lg border border-[#c0c5ce]/20">
              <p><strong>KAIDEN HouseHack 203K</strong></p>
              <p>Legal: <a href="mailto:legal@kaiden203k.com" className="text-[#98c1d9] hover:underline">legal@kaiden203k.com</a></p>
              <p>Support: <a href="mailto:support@kaiden203k.com" className="text-[#98c1d9] hover:underline">support@kaiden203k.com</a></p>
              <p>Privacy: <a href="mailto:privacy@kaiden203k.com" className="text-[#98c1d9] hover:underline">privacy@kaiden203k.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">20. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
              KAIDEN HouseHack 203K. They supersede all prior agreements or understandings.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-[#c0c5ce]/20">
            <p className="text-sm italic text-[#9ca3b0]">
              By clicking "I Agree" during signup or by using the Platform, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#c0c5ce]/20">
          <Link to="/privacy">
            <Button variant="outline" className="border-[#c0c5ce] text-[#c0c5ce] hover:bg-[#2d3e5f]">
              View Privacy Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
