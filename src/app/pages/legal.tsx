import { FileText, Shield, Eye, Lock } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";

export function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Legal & Compliance</h1>
        <p className="text-muted-foreground">
          Terms of Service, Privacy Policy, and important disclaimers
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, title: "Terms of Service", href: "#terms" },
          { icon: Shield, title: "Privacy Policy", href: "#privacy" },
          { icon: Lock, title: "Data Security", href: "#security" },
          { icon: Eye, title: "Cookie Policy", href: "#cookies" }
        ].map((link, i) => (
          <a key={i} href={link.href}>
            <GlassmorphismCard className="p-6 text-center hover:scale-105 transition-transform">
              <link.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
              <p className="font-medium">{link.title}</p>
            </GlassmorphismCard>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <GlassmorphismCard className="p-8 border-2 border-accent/20 bg-accent/5">
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-accent shrink-0" />
          <div>
            <h2 className="text-xl font-bold mb-3">Important Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              Avery provides automated assistance based on business-defined rules and instructions. 
              Avery is a software tool designed to handle routine business communications and does not 
              provide legal, medical, or financial advice. All actions taken by Avery are based on 
              predefined workflows and business logic configured by the account owner. The account 
              owner maintains full responsibility for all business operations and customer interactions.
            </p>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Terms of Service */}
      <GlassmorphismCard className="p-8" id="terms">
        <h2 className="text-2xl font-bold mb-6">Terms of Service</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">1. Acceptance of Terms</h3>
            <p>
              By accessing and using Avery AI Receptionist ("Service"), you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">2. Service Description</h3>
            <p>
              Avery is an AI-powered receptionist service that handles phone calls, schedules appointments, 
              sends automated follow-ups, and processes payments on behalf of your business. The Service 
              operates based on rules and workflows you configure.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">3. User Responsibilities</h3>
            <p>
              You are responsible for configuring Avery appropriately for your business, ensuring compliance 
              with applicable laws, obtaining necessary customer consents, and monitoring Avery's performance.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">4. Data Ownership</h3>
            <p>
              You retain all ownership rights to your business data, customer information, and call recordings. 
              We process this data solely to provide the Service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">5. Limitations of Liability</h3>
            <p>
              Avery is provided "as is" without warranties. We are not liable for missed calls, booking errors, 
              payment processing issues, or any business losses resulting from Service use.
            </p>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Privacy Policy */}
      <GlassmorphismCard className="p-8" id="privacy">
        <h2 className="text-2xl font-bold mb-6">Privacy Policy</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Data Collection</h3>
            <p>
              We collect business information, customer data provided during calls, call recordings, 
              transcripts, and usage analytics to provide and improve the Service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Data Usage</h3>
            <p>
              Your data is used exclusively to operate the Service, process transactions, and improve 
              AI performance. We never sell your data to third parties.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Data Security</h3>
            <p>
              All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We employ industry-standard 
              security measures including regular audits and penetration testing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Data Retention</h3>
            <p>
              Call recordings and transcripts are retained for 90 days by default. You can configure 
              custom retention periods or request immediate deletion.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Your Rights</h3>
            <p>
              You have the right to access, export, or delete your data at any time. Contact 
              privacy@avery.ai for data requests.
            </p>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Data Security */}
      <GlassmorphismCard className="p-8" id="security">
        <h2 className="text-2xl font-bold mb-6">Data Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Encryption", desc: "AES-256 encryption at rest, TLS 1.3 in transit" },
            { title: "Access Control", desc: "Role-based permissions and 2FA" },
            { title: "Monitoring", desc: "24/7 security monitoring and alerts" },
            { title: "Compliance", desc: "SOC 2 Type II certified" },
            { title: "Backups", desc: "Automated daily backups with 30-day retention" },
            { title: "Audits", desc: "Regular third-party security audits" }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* Contact */}
      <div className="text-center pt-8 border-t">
        <p className="text-muted-foreground mb-4">
          Questions about our legal policies?
        </p>
        <p className="text-sm">
          Contact us at{" "}
          <a href="mailto:legal@avery.ai" className="text-accent hover:underline">
            legal@avery.ai
          </a>
        </p>
        <p className="text-xs text-muted-foreground mt-6">
          Last updated: January 11, 2026
        </p>
      </div>
    </div>
  );
}
