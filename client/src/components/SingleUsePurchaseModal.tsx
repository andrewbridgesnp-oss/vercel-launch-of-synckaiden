import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Check, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { FeatureName } from "../../shared/features.config";

interface SingleUsePurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: FeatureName;
  onSuccess?: () => void;
}

export function SingleUsePurchaseModal({
  open,
  onOpenChange,
  feature,
  onSuccess,
}: SingleUsePurchaseModalProps) {
  const [loading, setLoading] = useState(false);
  const createCheckout = trpc.purchases.createCheckoutSession.useMutation();
  const getFeatures = trpc.purchases.getAvailableFeatures.useQuery();

  const featurePricing = getFeatures.data?.find((f) => f.feature === feature);

  const handlePurchase = async () => {
    if (!featurePricing) {
      toast.error("Feature pricing not found");
      return;
    }

    setLoading(true);
    try {
      const result = await createCheckout.mutateAsync({ feature });
      if (result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create checkout session"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock Feature</DialogTitle>
          <DialogDescription>
            Get instant access to this premium feature with a one-time payment
          </DialogDescription>
        </DialogHeader>

        {featurePricing && (
          <div className="space-y-6">
            {/* Feature Card */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{featurePricing.displayName}</CardTitle>
                <CardDescription>{featurePricing.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-gray-400">One-time payment</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-white">
                      ${(featurePricing.price / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                {featurePricing.lifetime && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-green-400">Lifetime access</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-300">What you get:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Instant access
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {featurePricing.lifetime ? "Lifetime" : "Temporary"} access
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Secure Stripe payment
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={handlePurchase}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Now
                  </>
                )}
              </Button>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-400">
                Payments are securely processed by Stripe. Your payment information is never stored on our servers.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
