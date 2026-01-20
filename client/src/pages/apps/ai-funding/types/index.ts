// KAIDEN CAPITAL™ - Core Type Definitions
// Production-ready types matching backend schema

export type TrustScoreLevel = 'critical' | 'low' | 'medium' | 'good' | 'excellent';
export type UserRole = 'user' | 'partner' | 'affiliate' | 'admin';
export type FundingTrack = 'business' | 'real-estate' | 'creator';
export type EntityType = 'sole-proprietor' | 'llc' | 's-corp' | 'c-corp' | 'partnership' | 'none';
export type CreditTier = 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'pro' | 'enterprise';

// Trust System
export interface TrustScore {
  score: number; // 0-100
  level: TrustScoreLevel;
  lastCalculated: string;
  factors: TrustFactor[];
  capabilities: string[];
  blockers: string[];
}

export interface TrustFactor {
  id: string;
  name: string;
  value: number;
  weight: number;
  verified: boolean;
  verifiedAt?: string;
}

export interface TrustEvent {
  id: string;
  userId: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  metadata: Record<string, any>;
}

// User & Organization
export interface User {
  id: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  passkeyEnabled: boolean;
  role: UserRole;
  trustScore: TrustScore;
  subscription: SubscriptionTier;
  createdAt: string;
  lastLoginAt: string;
  profile: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  businessName?: string;
  entityType: EntityType;
  creditTier: CreditTier;
  annualRevenue?: number;
  monthlyRevenue?: number;
  timeInBusiness?: number; // months
  industry?: string;
  state?: string;
  fundingTrack: FundingTrack[];
}

// Funding System
export interface FundingProfile {
  id: string;
  userId: string;
  track: FundingTrack;
  targetAmount: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  purpose: string;
  readinessScore: number;
  intakeCompleted: boolean;
  intakeData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface FundingSource {
  id: string;
  name: string;
  type: 'loan' | 'line-of-credit' | 'equity' | 'grant' | 'alternative';
  track: FundingTrack[];
  minAmount: number;
  maxAmount: number;
  minCreditScore?: number;
  minTimeInBusiness?: number;
  minRevenue?: number;
  approvalTimeframe: string; // "1-3 days", "1-2 weeks", etc.
  costStructure: {
    apr?: string;
    fees?: string;
    equityStake?: string;
  };
  requirements: string[];
  restrictions: {
    industries?: string[];
    states?: string[];
    entityTypes?: EntityType[];
  };
  partnerId?: string;
}

export interface FundingRecommendation {
  id: string;
  fundingProfileId: string;
  source: FundingSource;
  approvalProbability: number; // 0-1
  speed: number; // days to funding
  netCost: number; // total cost of capital
  score: number; // composite score
  confidence: number; // 0-1
  explanation: string;
  tradeoffs: string[];
  nextActions: string[];
  blockers: string[];
  estimatedAmount: number;
  rank: number;
}

// Readiness System
export interface ReadinessScore {
  id: string;
  fundingProfileId: string;
  score: number; // 0-100
  calculatedAt: string;
  blockers: ReadinessBlocker[];
  tasks: ReadinessTask[];
  projectedImprovement: number;
}

export interface ReadinessBlocker {
  id: string;
  category: 'credit' | 'revenue' | 'documentation' | 'entity' | 'banking' | 'time' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number; // impact on approval odds
  estimatedTimeToFix: string;
}

export interface ReadinessTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  estimatedTime: string;
  resources: TaskResource[];
  completedAt?: string;
}

export interface TaskResource {
  type: 'template' | 'guide' | 'checklist' | 'tool' | 'service';
  title: string;
  description: string;
  url?: string;
  isPaid?: boolean;
  price?: number;
}

// Partner System
export interface Partner {
  id: string;
  name: string;
  type: 'lender' | 'broker' | 'affiliate';
  status: 'pending' | 'active' | 'suspended' | 'deactivated';
  trustScore: number;
  businessInfo: {
    legalName: string;
    ein?: string;
    website: string;
    contactEmail: string;
    contactPhone: string;
  };
  offers: FundingSource[];
  statistics: {
    totalReferrals: number;
    totalApprovals: number;
    approvalRate: number;
    averageTimeToDecision: number;
    totalRevenue: number;
  };
  onboardedAt: string;
}

export interface PartnerReferral {
  id: string;
  partnerId: string;
  userId: string;
  fundingProfileId: string;
  sourceId: string;
  status: 'pending' | 'reviewing' | 'approved' | 'declined' | 'funded';
  submittedAt: string;
  decidedAt?: string;
  fundedAt?: string;
  amount?: number;
  commission?: number;
  metadata: Record<string, any>;
}

// Services & Monetization
export interface Service {
  id: string;
  name: string;
  description: string;
  type: 'one-time' | 'subscription';
  price: number;
  currency: 'USD';
  features: string[];
  deliverables: string[];
  estimatedDeliveryTime: string;
  requiredTrustScore: number;
}

export interface ServicePurchase {
  id: string;
  userId: string;
  serviceId: string;
  status: 'pending' | 'in-progress' | 'delivered' | 'cancelled';
  purchasedAt: string;
  deliveredAt?: string;
  amount: number;
  stripePaymentId?: string;
  metadata: Record<string, any>;
}

// Application & Submission
export interface Application {
  id: string;
  userId: string;
  fundingProfileId: string;
  status: 'draft' | 'ready' | 'submitted' | 'reviewing' | 'approved' | 'declined';
  documentPackage: DocumentPackage;
  submissions: PartnerReferral[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentPackage {
  id: string;
  applicationId: string;
  documents: Document[];
  completeness: number; // 0-1
  lastUpdated: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: 'identity' | 'financial' | 'business' | 'legal' | 'other';
  required: boolean;
  status: 'missing' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt?: string;
  verifiedAt?: string;
  url?: string;
  size?: number;
}

// Analytics & Insights
export interface DashboardStats {
  trustScore: TrustScore;
  activeFundingProfiles: number;
  recommendationsCount: number;
  applicationsInProgress: number;
  estimatedApprovalOdds: number;
  nextSteps: string[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Admin & Configuration
export interface AdminConfig {
  trustScoreWeights: Record<string, number>;
  gatingThresholds: Record<string, number>;
  featureFlags: Record<string, boolean>;
  riskRules: RiskRule[];
}

export interface RiskRule {
  id: string;
  name: string;
  condition: string;
  action: 'flag' | 'block' | 'review' | 'notify';
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
}
