/**
 * Single-Use Feature Purchase Pricing
 * Allows users to unlock specific features without subscribing to full tiers
 */

import type { FeatureName } from "./features.config";

export interface FeaturePricing {
  feature: FeatureName;
  displayName: string;
  description: string;
  price: number; // in cents
  currency: string;
  lifetime: boolean; // true = lifetime access, false = temporary
  durationDays?: number; // only if lifetime = false
}

export const FEATURE_PRICES: Record<string, FeaturePricing> = {
  ai_arena: {
    feature: "ai_arena",
    displayName: "AI Arena",
    description: "Multi-AI debates and analysis - Lifetime Access",
    price: 4900, // $49
    currency: "usd",
    lifetime: true,
  },
  medical_billing: {
    feature: "medical_billing",
    displayName: "Medical Billing Setup",
    description: "Medical billing and healthcare tools - Lifetime Access",
    price: 9900, // $99
    currency: "usd",
    lifetime: true,
  },
  vitalsync_integration: {
    feature: "vitalsync_integration",
    displayName: "VitalSync Integration",
    description: "Full VitalSync telehealth platform access - Lifetime Access",
    price: 14900, // $149
    currency: "usd",
    lifetime: true,
  },
  academy_access: {
    feature: "academy_access",
    displayName: "Kaiden Academy",
    description: "Full access to Kaiden Academy courses - Lifetime Access",
    price: 7900, // $79
    currency: "usd",
    lifetime: true,
  },
  grant_writing: {
    feature: "grant_writing",
    displayName: "Grant & Proposal Writing",
    description: "AI-assisted grant and proposal writing - Lifetime Access",
    price: 5900, // $59
    currency: "usd",
    lifetime: true,
  },
  llc_formation: {
    feature: "llc_formation",
    displayName: "LLC & Trust Formation + Business Credit Builder",
    description: "Assistance with LLC and trust formation, plus business credit building tools - Lifetime Access",
    price: 12900, // $129
    currency: "usd",
    lifetime: true,
  },
};

/**
 * Get pricing for a specific feature
 */
export function getFeaturePricing(feature: FeatureName): FeaturePricing | null {
  return FEATURE_PRICES[feature] || null;
}

/**
 * Format price for display
 */
export function formatPrice(cents: number, currency: string = "usd"): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(dollars);
}
