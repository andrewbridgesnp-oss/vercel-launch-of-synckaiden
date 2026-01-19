import { useAuth } from "@/_core/hooks/useAuth";
import { hasFeature, getMinimumTierForFeature, FEATURES, type FeatureName, type SubscriptionTier } from "../../../shared/features.config";

export interface UseFeatureResult {
  hasAccess: boolean;
  minimumTier: SubscriptionTier;
  currentTier: SubscriptionTier;
  featureName: string;
  featureDescription: string;
}

/**
 * Hook to check if the current user has access to a specific feature
 * @param feature - The feature name to check
 * @returns Object with access status and upgrade information
 */
export function useFeature(feature: FeatureName): UseFeatureResult {
  const { user } = useAuth();
  
  const currentTier = (user?.subscriptionTier as SubscriptionTier) || "free_trial";
  const minimumTier = getMinimumTierForFeature(feature);
  const hasAccess = hasFeature(currentTier, feature);
  
  const featureConfig = FEATURES[feature];
  
  return {
    hasAccess,
    minimumTier,
    currentTier,
    featureName: featureConfig.displayName,
    featureDescription: featureConfig.description,
  };
}
