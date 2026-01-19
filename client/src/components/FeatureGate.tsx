import { ReactNode, useState } from "react";
import { useFeature } from "@/hooks/useFeature";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, TrendingUp, Zap } from "lucide-react";
import { Link } from "wouter";
import type { FeatureName } from "../../shared/features.config";
import { SingleUsePurchaseModal } from "./SingleUsePurchaseModal";

interface FeatureGateProps {
  feature: FeatureName;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

/**
 * Component that restricts access to features based on subscription tier
 * Shows upgrade prompt if user doesn't have access
 */
export function FeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpgradePrompt = true 
}: FeatureGateProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { hasAccess, minimumTier, featureName, featureDescription } = useFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <>
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl">{featureName}</CardTitle>
              <CardDescription>{featureDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-4">
            This feature is available on the <span className="font-semibold text-purple-400 capitalize">{minimumTier.replace("_", " ")}</span> plan and above.
          </p>
          <div className="space-y-3">
            <Link href="/pricing" className="block">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade to Unlock
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              onClick={() => setShowPurchaseModal(true)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Buy Once Instead
            </Button>
          </div>
        </CardContent>
      </Card>

      <SingleUsePurchaseModal
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
        feature={feature}
      />
    </>
  );
}

/**
 * Inline feature gate that shows a lock icon and upgrade button
 */
export function InlineFeatureGate({ feature }: { feature: FeatureName }) {
  const { minimumTier, featureName } = useFeature(feature);

  return (
    <div className="flex items-center gap-2 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
      <Lock className="w-5 h-5 text-purple-400 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">{featureName} is locked</p>
        <p className="text-xs text-gray-400">
          Available on <span className="capitalize">{minimumTier.replace("_", " ")}</span> plan
        </p>
      </div>
      <Link href="/pricing">
        <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20">
          Upgrade
        </Button>
      </Link>
    </div>
  );
}
