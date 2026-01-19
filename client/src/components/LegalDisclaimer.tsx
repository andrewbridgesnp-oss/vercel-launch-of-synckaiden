import { AlertTriangle, ExternalLink, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LegalDisclaimerProps {
  type: "tax" | "legal" | "financial" | "hr";
  feature: string;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export function LegalDisclaimer({ type, feature, onAccept, showAcceptButton = false }: LegalDisclaimerProps) {
  const disclaimers = {
    tax: {
      title: "Tax Information Disclaimer",
      icon: AlertTriangle,
      color: "text-yellow-500",
      warnings: [
        "This tool is for educational and informational purposes only",
        "kaiden is NOT a licensed CPA, tax professional, or tax preparation service",
        "Tax laws change frequently - always verify with current IRS publications",
        "This does NOT constitute professional tax advice",
        "We are NOT responsible for any tax filing errors or penalties",
        "ALWAYS consult a licensed tax professional before making tax decisions",
      ],
      sources: [
        { name: "IRS Official Website", url: "https://www.irs.gov" },
        { name: "IRS Tax Forms", url: "https://www.irs.gov/forms-instructions" },
        { name: "Find a Tax Professional", url: "https://www.irs.gov/tax-professionals/choosing-a-tax-professional" },
      ],
    },
    legal: {
      title: "Legal Information Disclaimer",
      icon: Shield,
      color: "text-red-500",
      warnings: [
        "This tool is for educational and informational purposes only",
        "kaiden is NOT a licensed attorney or law firm",
        "This does NOT constitute legal advice or create an attorney-client relationship",
        "Laws vary by jurisdiction - always verify with local regulations",
        "We are NOT responsible for any legal consequences of using this information",
        "ALWAYS consult a licensed attorney for legal matters",
      ],
      sources: [
        { name: "Find a Lawyer (ABA)", url: "https://www.americanbar.org/groups/legal_services/flh-home/" },
        { name: "State Bar Associations", url: "https://www.americanbar.org/groups/legal_services/resources/state-local-bar-associations/" },
        { name: "Legal Aid Services", url: "https://www.lsc.gov/what-legal-aid/find-legal-aid" },
      ],
    },
    financial: {
      title: "Financial Information Disclaimer",
      icon: AlertTriangle,
      color: "text-orange-500",
      warnings: [
        "This tool is for educational and informational purposes only",
        "kaiden is NOT a licensed financial advisor or investment professional",
        "This does NOT constitute financial, investment, or retirement advice",
        "Past performance does not guarantee future results",
        "We are NOT responsible for any financial losses",
        "ALWAYS consult a licensed financial advisor before making financial decisions",
      ],
      sources: [
        { name: "Find a Financial Advisor (CFP Board)", url: "https://www.letsmakeaplan.org/" },
        { name: "SEC Investor Resources", url: "https://www.investor.gov/" },
        { name: "FINRA BrokerCheck", url: "https://brokercheck.finra.org/" },
      ],
    },
    hr: {
      title: "HR & Employment Disclaimer",
      icon: AlertTriangle,
      color: "text-blue-500",
      warnings: [
        "This tool is for educational and informational purposes only",
        "kaiden is NOT a licensed HR professional or employment attorney",
        "Employment laws vary by state and locality",
        "This does NOT constitute legal or HR compliance advice",
        "We are NOT responsible for employment law violations",
        "ALWAYS consult an employment attorney or HR professional for compliance matters",
      ],
      sources: [
        { name: "U.S. Department of Labor", url: "https://www.dol.gov/" },
        { name: "EEOC Guidelines", url: "https://www.eeoc.gov/" },
        { name: "State Labor Departments", url: "https://www.dol.gov/agencies/eta/contacts/state_UC" },
      ],
    },
  };

  const config = disclaimers[type];
  const Icon = config.icon;

  return (
    <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{config.title}</CardTitle>
            <CardDescription>
              Important legal notice - Please read carefully
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warnings */}
        <Alert className="border-yellow-500/30 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-500 font-semibold">
            ⚠️ IMPORTANT DISCLAIMERS
          </AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 text-sm">
              {config.warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>

        {/* Professional Resources */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Get Professional Help
          </h4>
          <div className="grid gap-2">
            {config.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-colors group"
              >
                <span className="text-sm font-medium">{source.name}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* AI Professional Chat */}
        <div className="grid md:grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
            onClick={() => window.open('/chat?mode=accountant', '_blank')}
          >
            💼 Chat with AI Accountant
          </Button>
          <Button
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
            onClick={() => window.open('/chat?mode=lawyer', '_blank')}
          >
            ⚖️ Chat with AI Lawyer
          </Button>
        </div>

        {/* Acceptance */}
        {showAcceptButton && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <input
                type="checkbox"
                id="legal-accept"
                className="mt-1"
                onChange={(e) => {
                  if (e.target.checked && onAccept) {
                    onAccept();
                  }
                }}
              />
              <label htmlFor="legal-accept" className="text-sm text-muted-foreground cursor-pointer">
                I understand that this is for educational purposes only and does not constitute professional {type} advice.
                I will consult a licensed professional before making any important decisions.
              </label>
            </div>
          </div>
        )}

        {/* Data Source Info */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
          <p className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            All {type} information is sourced from official government websites and verified third-party sources.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact inline disclaimer for feature pages
export function InlineDisclaimer({ type }: { type: "tax" | "legal" | "financial" | "hr" }) {
  const labels = {
    tax: "Tax",
    legal: "Legal",
    financial: "Financial",
    hr: "HR/Employment",
  };

  return (
    <Alert className="border-yellow-500/30 bg-yellow-500/5">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-sm font-semibold">
        {labels[type]} Disclaimer
      </AlertTitle>
      <AlertDescription className="text-xs">
        For educational purposes only. Not professional {type} advice. 
        <a href="/legal-disclaimer" className="underline ml-1 hover:text-primary">
          Read full disclaimer
        </a>
      </AlertDescription>
    </Alert>
  );
}
