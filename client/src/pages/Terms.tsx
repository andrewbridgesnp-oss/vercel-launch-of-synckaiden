import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: December 15, 2024</p>

        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using Kaiden AI ("the Service"), operated by Syndica Solutions ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>

            <h2>2. Description of Service</h2>
            <p>Kaiden AI is a business operations platform that provides AI-powered tools for business management, including but not limited to: workflow automation, customer relationship management, employee management, financial tools, and educational resources. The Service includes interactive tools for LLC formation guidance, credit assessment, student loan analysis, and estate planning education.</p>

            <h2>3. User Accounts</h2>
            <p>To access certain features, you must create an account. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information is accurate and current</li>
            </ul>

            <h2>4. Subscription and Payment</h2>
            <p>Certain features require a paid subscription. By subscribing, you agree to:</p>
            <ul>
              <li>Pay all fees associated with your selected plan</li>
              <li>Automatic renewal unless cancelled before the renewal date</li>
              <li>Our refund policy as stated at the time of purchase</li>
            </ul>
            <p>Payments are processed securely through Stripe. We do not store your payment card information.</p>

            <h2>5. Disclaimer of Legal and Financial Advice</h2>
            <p><strong>IMPORTANT:</strong> The Service provides educational tools and general information only. The Service does NOT provide:</p>
            <ul>
              <li>Legal advice or attorney-client relationships</li>
              <li>Tax advice or CPA-client relationships</li>
              <li>Financial planning or investment advice</li>
              <li>Guarantees of any legal or financial outcomes</li>
            </ul>
            <p>Tools such as the LLC Formation Wizard, Credit Repair Assessment, Brunner Test Calculator, and Dynasty Trust Workbook are for educational purposes only. You MUST consult with licensed professionals (attorneys, CPAs, financial advisors) in your jurisdiction before taking any legal or financial action.</p>

            <h2>6. Professional Directory Disclaimer</h2>
            <p>The professional directory listing attorneys and CPAs is provided for informational convenience only. We do not:</p>
            <ul>
              <li>Endorse, recommend, or guarantee any listed professional</li>
              <li>Verify the accuracy of listed information</li>
              <li>Accept responsibility for services provided by listed professionals</li>
              <li>Create any partnership or agency relationship with listed professionals</li>
            </ul>
            <p>Users must independently verify credentials and conduct their own due diligence.</p>

            <h2>7. Voice Authentication</h2>
            <p>If you enable voice authentication, you consent to:</p>
            <ul>
              <li>Recording and processing of your voice samples</li>
              <li>Storage of voice biometric data for authentication purposes</li>
              <li>Use of voice data solely for account security</li>
            </ul>
            <p>Voice data is encrypted and never shared with third parties.</p>

            <h2>8. Acceptable Use</h2>
            <p>You agree NOT to:</p>
            <ul>
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the Service to harass, abuse, or harm others</li>
              <li>Resell or redistribute the Service without authorization</li>
            </ul>

            <h2>9. Intellectual Property Rights</h2>
            <p>All content, features, functionality, software, code, designs, text, graphics, logos, icons, images, audio, video, user interfaces, visual interfaces, algorithms, workflows, and the overall "look and feel" of the Service are the exclusive property of Syndica Solutions and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
            
            <h3>9.1 Ownership</h3>
            <p>Syndica Solutions retains all right, title, and interest in and to:</p>
            <ul>
              <li>The Kaiden AI platform, including all source code, object code, and documentation</li>
              <li>All proprietary algorithms, AI models, and automation workflows</li>
              <li>The "Kaiden" name, logo, and all associated branding</li>
              <li>All educational content, templates, wizards, and calculators</li>
              <li>The unique user interface design and user experience</li>
              <li>All trade secrets and confidential business information</li>
            </ul>

            <h3>9.2 Prohibited Activities</h3>
            <p><strong>You are STRICTLY PROHIBITED from:</strong></p>
            <ul>
              <li>Copying, reproducing, or duplicating any part of the Service</li>
              <li>Reverse engineering, decompiling, or disassembling the software</li>
              <li>Creating derivative works based on the Service</li>
              <li>Scraping, harvesting, or extracting data or content from the Service</li>
              <li>Using any automated tools (bots, spiders, crawlers) to access the Service</li>
              <li>Removing, altering, or obscuring any copyright or proprietary notices</li>
              <li>Selling, licensing, sublicensing, or transferring access to the Service</li>
              <li>Using the Service to develop a competing product or service</li>
              <li>Sharing account credentials or allowing unauthorized access</li>
              <li>Capturing screenshots, recordings, or documentation for commercial use</li>
            </ul>

            <h3>9.3 Legal Consequences for Infringement</h3>
            <p><strong>VIOLATION OF THESE INTELLECTUAL PROPERTY PROVISIONS MAY RESULT IN:</strong></p>
            <ul>
              <li><strong>Civil Liability:</strong> Statutory damages of up to $150,000 per work infringed under the U.S. Copyright Act (17 U.S.C. § 504)</li>
              <li><strong>Criminal Penalties:</strong> Willful copyright infringement for commercial advantage or private financial gain is a federal crime punishable by up to 5 years imprisonment and fines up to $250,000 under 17 U.S.C. § 506 and 18 U.S.C. § 2319</li>
              <li><strong>Trade Secret Misappropriation:</strong> Civil and criminal liability under the Defend Trade Secrets Act (18 U.S.C. § 1836), including damages, attorney's fees, and potential imprisonment</li>
              <li><strong>Computer Fraud:</strong> Unauthorized access may violate the Computer Fraud and Abuse Act (18 U.S.C. § 1030), punishable by fines and imprisonment</li>
              <li><strong>Injunctive Relief:</strong> We will seek immediate injunctive relief to stop any unauthorized use</li>
              <li><strong>Attorney's Fees:</strong> You will be responsible for all of our attorney's fees and costs in enforcing these rights</li>
            </ul>

            <h3>9.4 DMCA Compliance</h3>
            <p>We comply with the Digital Millennium Copyright Act (DMCA). If you believe your intellectual property has been infringed, contact our designated agent at legal@syndicasolutions.com.</p>

            <h3>9.5 Monitoring and Enforcement</h3>
            <p>We actively monitor for unauthorized use of our intellectual property. We employ technical measures to detect copying, scraping, and unauthorized access. We will pursue all available legal remedies against infringers to the fullest extent of the law.</p>

            <h2>10. Third-Party Integrations</h2>
            <p>The Service may integrate with third-party services (Stripe, Shopify, etc.). Your use of these integrations is subject to the respective third-party terms of service. We are not responsible for third-party services.</p>

            <h2>11. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul>
              <li>The Service is provided "AS IS" without warranties of any kind</li>
              <li>We disclaim all implied warranties, including merchantability and fitness for a particular purpose</li>
              <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
            </ul>

            <h2>12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Syndica Solutions, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.</p>

            <h2>13. Termination</h2>
            <p>We may terminate or suspend your account at any time for violation of these Terms. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination shall survive.</p>

            <h2>14. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of South Carolina, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in South Carolina.</p>

            <h2>15. Changes to Terms</h2>
            <p>We may modify these Terms at any time. We will notify you of material changes via email or in-app notification. Continued use after changes constitutes acceptance of the modified Terms.</p>

            <h2>16. Contact Information</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p>
              Syndica Solutions<br />
              Email: legal@syndicasolutions.com<br />
              Website: www.syndicasolutions.com
            </p>

            <hr className="my-8" />
            <p className="text-sm text-muted-foreground">By using Kaiden AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
