import { ExternalLink, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface Source {
  name: string;
  url: string;
  section?: string;
}

interface SuggestionCardProps {
  title: string;
  description: string;
  potentialBenefit?: string;
  category: "tax" | "legal" | "financial" | "hr";
  sources: Source[];
  requirements?: string[];
  onAccept?: () => void;
  onReject?: () => void;
  onReviewWithProfessional?: () => void;
}

export function SuggestionCard({
  title,
  description,
  potentialBenefit,
  category,
  sources,
  requirements = [],
  onAccept,
  onReject,
  onReviewWithProfessional,
}: SuggestionCardProps) {
  const [userDecision, setUserDecision] = useState<"pending" | "accepted" | "rejected" | "professional">("pending");

  const categoryColors = {
    tax: "border-yellow-500/30 bg-yellow-500/5",
    legal: "border-red-500/30 bg-red-500/5",
    financial: "border-green-500/30 bg-green-500/5",
    hr: "border-blue-500/30 bg-blue-500/5",
  };

  const categoryLabels = {
    tax: "Tax Suggestion",
    legal: "Legal Consideration",
    financial: "Financial Opportunity",
    hr: "HR Recommendation",
  };

  return (
    <Card className={`${categoryColors[category]} border-2`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {categoryLabels[category]}
              </Badge>
              {userDecision !== "pending" && (
                <Badge
                  variant={
                    userDecision === "accepted"
                      ? "default"
                      : userDecision === "professional"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {userDecision === "accepted" && "✓ Noted"}
                  {userDecision === "professional" && "→ Sent to Professional"}
                  {userDecision === "rejected" && "✗ Not Applicable"}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Potential Benefit */}
        {potentialBenefit && (
          <Alert className="border-green-500/30 bg-green-500/5">
            <AlertCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-sm">
              <span className="font-semibold text-green-600">Potential Benefit: </span>
              {potentialBenefit}
            </AlertDescription>
          </Alert>
        )}

        {/* Requirements to Qualify */}
        {requirements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Requirements to Qualify:</h4>
            <ul className="space-y-1">
              {requirements.map((req, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Sources */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Official Sources (Click to Verify):
          </h4>
          <div className="grid gap-2">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-colors group text-sm"
              >
                <div className="flex-1">
                  <div className="font-medium">{source.name}</div>
                  {source.section && (
                    <div className="text-xs text-muted-foreground">{source.section}</div>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Human Verification Required */}
        <Alert className="border-orange-500/30 bg-orange-500/5">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-sm">
            <span className="font-semibold text-orange-600">⚠️ Human Verification Required: </span>
            This is a suggestion only. You must verify this applies to YOUR specific situation by:
            <ol className="mt-2 ml-4 space-y-1 list-decimal">
              <li>Reading the official sources above</li>
              <li>Checking if you meet all requirements</li>
              <li>Consulting with a licensed professional</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        {userDecision === "pending" && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-500/30 hover:bg-green-500/10"
              onClick={() => {
                setUserDecision("accepted");
                onAccept?.();
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Note This
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 hover:bg-red-500/10"
              onClick={() => {
                setUserDecision("rejected");
                onReject?.();
              }}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Not Applicable
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setUserDecision("professional");
                onReviewWithProfessional?.();
              }}
            >
              → Review with Pro
            </Button>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
          Suggested: {new Date().toLocaleString()} • Sources verified: {new Date().toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for lists
export function SuggestionListItem({
  title,
  benefit,
  category,
  onClick,
}: {
  title: string;
  benefit: string;
  category: "tax" | "legal" | "financial" | "hr";
  onClick: () => void;
}) {
  const categoryIcons = {
    tax: "💰",
    legal: "⚖️",
    financial: "📊",
    hr: "👥",
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl">{categoryIcons[category]}</span>
        <div className="flex-1">
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-muted-foreground">{benefit}</div>
        </div>
      </div>
      <Badge variant="outline" className="text-xs">
        Review
      </Badge>
    </div>
  );
}
