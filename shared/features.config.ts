/**
 * Feature Gating Configuration
 * Defines which features are available for each subscription tier
 */

export type SubscriptionTier = "free_trial" | "personal" | "small_business" | "startup" | "enterprise";

export type FeatureName =
  // Core Features
  | "ai_chat"
  | "document_templates"
  | "business_guides"
  | "community_access"
  
  // Personal Tier
  | "unlimited_ai"
  | "credit_repair"
  | "email_support"
  
  // Small Business Tier
  | "voice_ai"
  | "llc_formation"
  | "grant_writing"
  | "dropshipping_tools"
  | "content_creation"
  | "priority_support"
  | "team_members_5"
  | "strategy_call_monthly"
  | "done_for_you_docs"
  | "creative_content_engine"
  
  // Startup Tier
  | "ai_arena"
  | "crypto_investment"
  | "medical_billing"
  | "vitalsync_integration"
  | "tribe_integration"
  | "academy_access"
  | "creative_content_engine"
  | "phone_support"
  | "team_members_15"
  | "strategy_call_weekly"
  
  // Enterprise Tier
  | "white_label"
  | "custom_integrations"
  | "api_access"
  | "dedicated_manager"
  | "unlimited_team"
  | "support_24_7"
  | "custom_workflows"
  | "advanced_analytics"
  | "sla_guarantee"
  | "on_demand_sessions";

export interface FeatureConfig {
  name: FeatureName;
  displayName: string;
  description: string;
  tiers: SubscriptionTier[];
}

export const FEATURES: Record<FeatureName, FeatureConfig> = {
  // Core Features (Free Trial + All Tiers)
  ai_chat: {
    name: "ai_chat",
    displayName: "AI Business Consultant",
    description: "Chat with Kaiden AI for business advice",
    tiers: ["free_trial", "personal", "small_business", "startup", "enterprise"],
  },
  document_templates: {
    name: "document_templates",
    displayName: "Document Templates",
    description: "Access to business document templates",
    tiers: ["free_trial", "personal", "small_business", "startup", "enterprise"],
  },
  business_guides: {
    name: "business_guides",
    displayName: "Business Formation Guides",
    description: "Step-by-step business formation guides",
    tiers: ["free_trial", "personal", "small_business", "startup", "enterprise"],
  },
  community_access: {
    name: "community_access",
    displayName: "Community Access",
    description: "Access to Kaiden community forums",
    tiers: ["free_trial", "personal", "small_business", "startup", "enterprise"],
  },

  // Personal Tier Features
  unlimited_ai: {
    name: "unlimited_ai",
    displayName: "Unlimited AI Conversations",
    description: "No limits on AI chat interactions",
    tiers: ["personal", "small_business", "startup", "enterprise"],
  },
  credit_repair: {
    name: "credit_repair",
    displayName: "Credit Repair Basics",
    description: "Credit repair guidance and tools",
    tiers: ["personal", "small_business", "startup", "enterprise"],
  },
  email_support: {
    name: "email_support",
    displayName: "Email Support",
    description: "48-hour email support response",
    tiers: ["personal", "small_business", "startup", "enterprise"],
  },

  // Small Business Tier Features
  voice_ai: {
    name: "voice_ai",
    displayName: "Voice AI Assistant",
    description: "Personalized voice-based AI assistant",
    tiers: ["small_business", "startup", "enterprise"],
  },
  llc_formation: {
    name: "llc_formation",
    displayName: "LLC & Trust Formation",
    description: "Assistance with LLC and trust formation",
    tiers: ["small_business", "startup", "enterprise"],
  },
  grant_writing: {
    name: "grant_writing",
    displayName: "Grant & Proposal Writing",
    description: "AI-assisted grant and proposal writing",
    tiers: ["small_business", "startup", "enterprise"],
  },
  dropshipping_tools: {
    name: "dropshipping_tools",
    displayName: "Dropshipping Setup",
    description: "Tools and guidance for dropshipping",
    tiers: ["small_business", "startup", "enterprise"],
  },
  content_creation: {
    name: "content_creation",
    displayName: "Content Creation Tools",
    description: "AI-powered content generation",
    tiers: ["small_business", "startup", "enterprise"],
  },
  priority_support: {
    name: "priority_support",
    displayName: "Priority Support",
    description: "24-hour priority email support",
    tiers: ["small_business", "startup", "enterprise"],
  },
  team_members_5: {
    name: "team_members_5",
    displayName: "Up to 5 Team Members",
    description: "Add up to 5 team members",
    tiers: ["small_business"],
  },
  strategy_call_monthly: {
    name: "strategy_call_monthly",
    displayName: "Monthly Strategy Call",
    description: "30-minute monthly strategy call",
    tiers: ["small_business", "startup", "enterprise"],
  },
  done_for_you_docs: {
    name: "done_for_you_docs",
    displayName: "Done-For-You Documents",
    description: "Professional document preparation service",
    tiers: ["small_business", "startup", "enterprise"],
  },

  // Startup Tier Features
  ai_arena: {
    name: "ai_arena",
    displayName: "AI Arena",
    description: "Multi-AI debates and analysis",
    tiers: ["startup", "enterprise"],
  },
  crypto_investment: {
    name: "crypto_investment",
    displayName: "Crypto & Investment Guidance",
    description: "Cryptocurrency and investment advice",
    tiers: ["startup", "enterprise"],
  },
  medical_billing: {
    name: "medical_billing",
    displayName: "Medical Billing Setup",
    description: "Medical billing and healthcare tools",
    tiers: ["startup", "enterprise"],
  },
  vitalsync_integration: {
    name: "vitalsync_integration",
    displayName: "VitalSync Integration",
    description: "Full VitalSync telehealth platform access",
    tiers: ["startup", "enterprise"],
  },
  tribe_integration: {
    name: "tribe_integration",
    displayName: "Where's My Tribe Integration",
    description: "Community platform integration",
    tiers: ["startup", "enterprise"],
  },
  academy_access: {
    name: "academy_access",
    displayName: "Kaiden Academy",
    description: "Full access to Kaiden Academy courses",
    tiers: ["startup", "enterprise"],
  },
  phone_support: {
    name: "phone_support",
    displayName: "Priority Phone Support",
    description: "Direct phone support line",
    tiers: ["startup", "enterprise"],
  },
  team_members_15: {
    name: "team_members_15",
    displayName: "Up to 15 Team Members",
    description: "Add up to 15 team members",
    tiers: ["startup"],
  },
  strategy_call_weekly: {
    name: "strategy_call_weekly",
    displayName: "Weekly Strategy Calls",
    description: "Weekly strategy and planning calls",
    tiers: ["startup", "enterprise"],
  },
  creative_content_engine: {
    name: "creative_content_engine",
    displayName: "Creative Content Engine",
    description: "AI agent swarm for multi-platform content creation",
    tiers: ["startup", "enterprise"],
  },

  // Enterprise Tier Features
  white_label: {
    name: "white_label",
    displayName: "White-Label Capabilities",
    description: "Brand Kaiden as your own",
    tiers: ["enterprise"],
  },
  custom_integrations: {
    name: "custom_integrations",
    displayName: "Custom Integrations",
    description: "Custom API integrations and workflows",
    tiers: ["enterprise"],
  },
  api_access: {
    name: "api_access",
    displayName: "API Access",
    description: "Full API access for custom development",
    tiers: ["enterprise"],
  },
  dedicated_manager: {
    name: "dedicated_manager",
    displayName: "Dedicated Account Manager",
    description: "Personal account manager",
    tiers: ["enterprise"],
  },
  unlimited_team: {
    name: "unlimited_team",
    displayName: "Unlimited Team Members",
    description: "No limit on team size",
    tiers: ["enterprise"],
  },
  support_24_7: {
    name: "support_24_7",
    displayName: "24/7 Priority Support",
    description: "Round-the-clock priority support",
    tiers: ["enterprise"],
  },
  custom_workflows: {
    name: "custom_workflows",
    displayName: "Custom Workflows",
    description: "Custom automation workflows",
    tiers: ["enterprise"],
  },
  advanced_analytics: {
    name: "advanced_analytics",
    displayName: "Advanced Analytics",
    description: "Advanced reporting and analytics",
    tiers: ["enterprise"],
  },
  sla_guarantee: {
    name: "sla_guarantee",
    displayName: "SLA Guarantee",
    description: "99.9% uptime SLA guarantee",
    tiers: ["enterprise"],
  },
  on_demand_sessions: {
    name: "on_demand_sessions",
    displayName: "On-Demand Strategy Sessions",
    description: "Unlimited on-demand strategy sessions",
    tiers: ["enterprise"],
  },
};

/**
 * Check if a feature is available for a given subscription tier
 */
export function hasFeature(tier: SubscriptionTier, feature: FeatureName): boolean {
  const featureConfig = FEATURES[feature];
  return featureConfig.tiers.includes(tier);
}

/**
 * Get all features available for a given subscription tier
 */
export function getFeaturesForTier(tier: SubscriptionTier): FeatureConfig[] {
  return Object.values(FEATURES).filter((feature) => feature.tiers.includes(tier));
}

/**
 * Get the minimum tier required for a feature
 */
export function getMinimumTierForFeature(feature: FeatureName): SubscriptionTier {
  const featureConfig = FEATURES[feature];
  const tierOrder: SubscriptionTier[] = ["free_trial", "personal", "small_business", "startup", "enterprise"];
  
  for (const tier of tierOrder) {
    if (featureConfig.tiers.includes(tier)) {
      return tier;
    }
  }
  
  return "enterprise";
}
