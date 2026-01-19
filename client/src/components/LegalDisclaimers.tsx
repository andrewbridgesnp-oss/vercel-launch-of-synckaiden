import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface LegalDisclaimersProps {
  onAccept: () => void;
}

export function LegalDisclaimers({ onAccept }: LegalDisclaimersProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedLiability, setAcceptedLiability] = useState(false);
  const [acceptedAutomation, setAcceptedAutomation] = useState(false);

  const canProceed = acceptedTerms && acceptedLiability && acceptedAutomation;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-gradient-to-br from-gray-900 to-black border-cyan-500/30 p-8">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Legal Disclaimers & Consent
          </h2>
          <p className="text-gray-400">
            Please review and accept the following terms before proceeding
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Terms of Service */}
          <div className="bg-black/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Terms of Service</h3>
            <ScrollArea className="h-40 pr-4">
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  By using KAIDEN, you agree to our Terms of Service. KAIDEN is an AI-powered business automation platform that requires human approval for all automated actions.
                </p>
                <p>
                  <strong>Key Points:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>All automated workflows require explicit human approval before execution</li>
                  <li>You retain full control and responsibility for all business decisions</li>
                  <li>KAIDEN provides recommendations and automation, not legal or financial advice</li>
                  <li>You must comply with all applicable laws and regulations in your jurisdiction</li>
                  <li>Service availability and features may change with notice</li>
                </ul>
              </div>
            </ScrollArea>
            <div className="flex items-center gap-3 mt-4">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="cursor-pointer">
                I have read and agree to the Terms of Service
              </Label>
            </div>
          </div>

          {/* Liability Waiver */}
          <div className="bg-black/50 border border-orange-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-orange-400">Liability Waiver</h3>
            <ScrollArea className="h-40 pr-4">
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <strong>IMPORTANT: Please read carefully.</strong>
                </p>
                <p>
                  KAIDEN is provided "as is" without warranties of any kind. By using this service, you acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>The owner and operators of KAIDEN are not liable for any business losses, damages, or consequences resulting from your use of the platform</li>
                  <li>You assume full responsibility for all decisions made using KAIDEN's recommendations</li>
                  <li>KAIDEN does not provide legal, financial, tax, or medical advice</li>
                  <li>You will consult appropriate professionals for specialized advice</li>
                  <li>Any data loss, system errors, or service interruptions are not the responsibility of KAIDEN's operators</li>
                  <li>You release KAIDEN and its operators from all claims, demands, and damages of any kind arising from your use of the service</li>
                </ul>
              </div>
            </ScrollArea>
            <div className="flex items-center gap-3 mt-4">
              <Checkbox
                id="liability"
                checked={acceptedLiability}
                onCheckedChange={(checked) => setAcceptedLiability(checked as boolean)}
              />
              <Label htmlFor="liability" className="cursor-pointer">
                I understand and accept the liability waiver
              </Label>
            </div>
          </div>

          {/* Automation Consent */}
          <div className="bg-black/50 border border-blue-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Automation Consent</h3>
            <ScrollArea className="h-32 pr-4">
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  KAIDEN uses approval-gated automation to streamline your business operations. By proceeding, you consent to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>KAIDEN analyzing your business data to provide personalized recommendations</li>
                  <li>Automated workflows executing ONLY after you explicitly approve them</li>
                  <li>KAIDEN accessing integrated third-party services on your behalf (with your credentials)</li>
                  <li>Receiving notifications and approval requests for pending automations</li>
                  <li>Your data being processed to improve KAIDEN's AI capabilities (anonymized)</li>
                </ul>
              </div>
            </ScrollArea>
            <div className="flex items-center gap-3 mt-4">
              <Checkbox
                id="automation"
                checked={acceptedAutomation}
                onCheckedChange={(checked) => setAcceptedAutomation(checked as boolean)}
              />
              <Label htmlFor="automation" className="cursor-pointer">
                I consent to approval-gated automation
              </Label>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onAccept}
          disabled={!canProceed}
          className="w-full py-6 text-lg"
          style={{
            background: canProceed
              ? "linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)"
              : "linear-gradient(135deg, #4b5563 0%, #374151 100%)",
            color: canProceed ? "#000" : "#9ca3af",
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {canProceed ? "Accept & Continue" : "Please accept all terms to continue"}
        </Button>
      </Card>
    </div>
  );
}
