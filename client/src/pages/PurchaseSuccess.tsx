import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { FEATURE_PRICES } from "../../../shared/feature-pricing.config";
import type { FeatureName } from "../../../shared/features.config";

export function PurchaseSuccess() {
  const [, params] = useRoute("/purchase-success?session_id=:sessionId");
  const [, navigate] = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [feature, setFeature] = useState<FeatureName | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyPurchase = trpc.purchases.verifyPurchase.useMutation();

  useEffect(() => {
    const verifySession = async () => {
      if (!params?.sessionId) {
        setError("No session ID provided");
        setVerifying(false);
        return;
      }

      try {
        const result = await verifyPurchase.mutateAsync({
          sessionId: params.sessionId,
        });

        setFeature(result.feature as FeatureName);
        setVerified(true);
        toast.success("✅ Feature unlocked successfully!");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to verify purchase";
        setError(message);
        toast.error(message);
      } finally {
        setVerifying(false);
      }
    };

    verifySession();
  }, [params?.sessionId]);

  const featurePricing = feature ? FEATURE_PRICES[feature] : null;

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-border/50">
          <CardContent className="pt-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            <p className="text-lg font-semibold text-gray-300">Verifying your purchase...</p>
            <p className="text-sm text-gray-400">This may take a few moments</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-red-500/30 bg-red-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-red-400">Purchase Verification Failed</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">{error || "Unable to verify your purchase"}</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/pricing")}
              >
                Back to Pricing
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success Card */}
        <Card className="glass border-green-500/30 bg-green-500/5">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-green-400">Purchase Successful!</CardTitle>
                <CardDescription className="text-green-300/70">
                  Your feature has been activated
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Feature Details */}
        {featurePricing && (
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Feature Activated</CardTitle>
              <CardDescription>You now have full access to this premium feature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{featurePricing.displayName}</p>
                    <p className="text-sm text-gray-400">{featurePricing.description}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    Activated
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-800/50 border border-border/30">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Amount Paid</p>
                    <p className="text-xl font-bold text-white">
                      ${(featurePricing.price / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Access Type</p>
                    <p className="text-xl font-bold text-green-400">
                      {featurePricing.lifetime ? "Lifetime" : "Temporary"}
                    </p>
                  </div>
                </div>

                {featurePricing.lifetime && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-sm text-blue-300">
                      ✨ You have lifetime access to this feature. No renewal needed!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* What's Next */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Get started with your new feature</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-400">1</span>
                </div>
                <div>
                  <p className="font-medium text-white">Access Your Dashboard</p>
                  <p className="text-sm text-gray-400">
                    Go to your dashboard to start using {featurePricing?.displayName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-400">2</span>
                </div>
                <div>
                  <p className="font-medium text-white">Explore Features</p>
                  <p className="text-sm text-gray-400">
                    Check out the new capabilities available in your account
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-400">3</span>
                </div>
                <div>
                  <p className="font-medium text-white">Need Help?</p>
                  <p className="text-sm text-gray-400">
                    Contact our support team if you have any questions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Order Confirmation */}
        <Card className="glass border-border/30 bg-slate-800/30">
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 text-center">
              A confirmation email has been sent to your registered email address.
              <br />
              Check your inbox for receipt and access details.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
