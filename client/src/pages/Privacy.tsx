import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: December 15, 2024</p>

        <Card>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none pt-6">
            <h2>1. Introduction</h2>
            <p>Syndica Solutions ("we," "us," or "our") operates Kaiden AI. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this policy carefully.</p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and authentication credentials when you create an account</li>
              <li><strong>Profile Information:</strong> Business name, industry, and preferences you provide</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe (we do not store card numbers)</li>
              <li><strong>Voice Data:</strong> Voice recordings if you enable voice authentication (stored encrypted)</li>
              <li><strong>Form Submissions:</strong> Information entered in our tools (LLC wizard, credit assessment, etc.)</li>
              <li><strong>Communications:</strong> Messages, feedback, and support requests</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
              <li><strong>Cookies:</strong> Session cookies for authentication and preferences</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and send related information</li>
              <li>Authenticate your identity and secure your account</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Send administrative information (updates, security alerts)</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Voice Data and Biometrics</h2>
            <p>If you enable voice authentication:</p>
            <ul>
              <li>Voice samples are recorded during enrollment</li>
              <li>Voice data is converted to encrypted biometric templates</li>
              <li>Original voice recordings are not stored after processing</li>
              <li>Biometric templates are used solely for authentication</li>
              <li>Voice data is never shared with third parties</li>
              <li>You can delete your voice data at any time in Settings</li>
            </ul>

            <h2>5. Information Sharing and Disclosure</h2>
            <p>We do NOT sell your personal information. We may share information with:</p>
            
            <h3>5.1 Service Providers</h3>
            <ul>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Cloud Providers:</strong> Data storage and hosting</li>
              <li><strong>Analytics:</strong> Usage analysis (anonymized data only)</li>
            </ul>

            <h3>5.2 Legal Requirements</h3>
            <p>We may disclose information if required by law, court order, or government request, or to protect our rights, safety, or property.</p>

            <h3>5.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>

            <h2>6. Data Security</h2>
            <p>We implement appropriate security measures including:</p>
            <ul>
              <li>Encryption of data in transit (TLS/SSL) and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls limiting employee access to data</li>
              <li>Secure data centers with physical security</li>
            </ul>
            <p>However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.</p>

            <h2>7. Data Retention</h2>
            <p>We retain your information for as long as your account is active or as needed to provide services. We may retain certain information as required by law or for legitimate business purposes (fraud prevention, legal compliance).</p>

            <h2>8. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Voice Data:</strong> Delete voice biometric data at any time</li>
            </ul>
            <p>To exercise these rights, contact us at privacy@syndicasolutions.com.</p>

            <h2>9. Cookies and Tracking</h2>
            <p>We use cookies for:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for authentication and security</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Understand how you use the Service</li>
            </ul>
            <p>You can control cookies through your browser settings. Disabling essential cookies may affect Service functionality.</p>

            <h2>10. Third-Party Links</h2>
            <p>The Service may contain links to third-party websites (professional directory, external resources). We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies.</p>

            <h2>11. Children's Privacy</h2>
            <p>The Service is not intended for children under 18. We do not knowingly collect information from children. If we learn we have collected information from a child, we will delete it promptly.</p>

            <h2>12. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>

            <h2>13. California Privacy Rights (CCPA)</h2>
            <p>California residents have additional rights under the CCPA:</p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>
            <p>We do not sell personal information as defined by the CCPA.</p>

            <h2>14. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or in-app notification. The "Last Updated" date indicates when the policy was last revised.</p>

            <h2>15. Contact Us</h2>
            <p>For questions about this Privacy Policy or our data practices, contact us at:</p>
            <p>
              Syndica Solutions<br />
              Privacy Officer<br />
              Email: privacy@syndicasolutions.com<br />
              Website: www.syndicasolutions.com
            </p>

            <hr className="my-8" />
            <p className="text-sm text-muted-foreground">By using Kaiden AI, you acknowledge that you have read and understood this Privacy Policy.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
