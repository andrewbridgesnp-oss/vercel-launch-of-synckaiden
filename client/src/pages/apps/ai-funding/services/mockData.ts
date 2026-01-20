// KAIDEN CAPITAL™ - Mock Data Service
// Production-ready mock data for frontend demonstration

import type {
  User,
  FundingSource,
  FundingRecommendation,
  ReadinessScore,
  Partner,
  Service,
  DashboardStats,
  TrustScore,
  FundingProfile,
} from '../types';

// Mock Current User
export const mockUser: User = {
  id: 'user_1',
  email: 'founder@example.com',
  phone: '+1 (555) 123-4567',
  emailVerified: true,
  phoneVerified: true,
  passkeyEnabled: true,
  role: 'user',
  subscription: 'premium',
  createdAt: '2026-01-01T00:00:00Z',
  lastLoginAt: '2026-01-12T08:00:00Z',
  trustScore: {
    score: 72,
    level: 'good',
    lastCalculated: '2026-01-12T08:00:00Z',
    factors: [
      { id: 'f1', name: 'Email Verified', value: 15, weight: 15, verified: true, verifiedAt: '2026-01-01T00:00:00Z' },
      { id: 'f2', name: 'Phone Verified', value: 15, weight: 15, verified: true, verifiedAt: '2026-01-02T00:00:00Z' },
      { id: 'f3', name: 'Passkey Enabled', value: 10, weight: 10, verified: true, verifiedAt: '2026-01-02T00:00:00Z' },
      { id: 'f4', name: 'Account Age', value: 12, weight: 15, verified: true },
      { id: 'f5', name: 'Activity Pattern', value: 10, weight: 15, verified: true },
      { id: 'f6', name: 'Payment Method', value: 10, weight: 10, verified: true },
      { id: 'f7', name: 'Business Verification', value: 0, weight: 20, verified: false },
    ],
    capabilities: [
      'view-funding-map',
      'use-readiness-tools',
      'connect-integrations',
      'request-concierge',
      'generate-documents',
    ],
    blockers: [
      'Business verification required for partner submissions',
      'Complete business credit profile for advanced routing',
    ],
  },
  profile: {
    firstName: 'Alex',
    lastName: 'Chen',
    businessName: 'TechFlow Solutions LLC',
    entityType: 'llc',
    creditTier: 'good',
    annualRevenue: 450000,
    monthlyRevenue: 37500,
    timeInBusiness: 18,
    industry: 'Software & Technology',
    state: 'California',
    fundingTrack: ['business'],
  },
};

// Mock Funding Sources
export const mockFundingSources: FundingSource[] = [
  {
    id: 'source_1',
    name: 'Business Line of Credit - Fast Track',
    type: 'line-of-credit',
    track: ['business'],
    minAmount: 10000,
    maxAmount: 250000,
    minCreditScore: 650,
    minTimeInBusiness: 12,
    minRevenue: 200000,
    approvalTimeframe: '24-48 hours',
    costStructure: {
      apr: '12-18%',
      fees: '$0 origination, $99 annual fee',
    },
    requirements: [
      'Active business checking account',
      '12+ months in business',
      'Minimum $200k annual revenue',
      'Personal credit 650+',
    ],
    restrictions: {
      industries: ['Cannabis', 'Adult Entertainment', 'Gambling'],
      states: [],
      entityTypes: [],
    },
    partnerId: 'partner_1',
  },
  {
    id: 'source_2',
    name: 'SBA 7(a) Loan',
    type: 'loan',
    track: ['business'],
    minAmount: 50000,
    maxAmount: 5000000,
    minCreditScore: 680,
    minTimeInBusiness: 24,
    minRevenue: 250000,
    approvalTimeframe: '30-60 days',
    costStructure: {
      apr: '6.5-10%',
      fees: '2-3% guarantee fee',
    },
    requirements: [
      '2+ years in business',
      'Strong business plan',
      'Personal guarantee',
      'Collateral required',
      'Tax returns (3 years)',
      'Financial statements',
    ],
    restrictions: {
      industries: ['Lending', 'Speculation', 'Multi-level Marketing'],
      states: [],
      entityTypes: ['sole-proprietor'],
    },
    partnerId: 'partner_2',
  },
  {
    id: 'source_3',
    name: 'Revenue-Based Financing',
    type: 'alternative',
    track: ['business', 'creator'],
    minAmount: 25000,
    maxAmount: 500000,
    minTimeInBusiness: 6,
    minRevenue: 150000,
    approvalTimeframe: '3-5 days',
    costStructure: {
      fees: '1.2-1.4x payback',
    },
    requirements: [
      'Recurring revenue model',
      '6+ months operating history',
      'Bank account or payment processor access',
      'No minimum credit score',
    ],
    restrictions: {
      industries: [],
      states: [],
      entityTypes: [],
    },
    partnerId: 'partner_3',
  },
  {
    id: 'source_4',
    name: 'DSCR Investment Property Loan',
    type: 'loan',
    track: ['real-estate'],
    minAmount: 100000,
    maxAmount: 3000000,
    approvalTimeframe: '14-21 days',
    costStructure: {
      apr: '7.5-9.5%',
      fees: '1-2 points origination',
    },
    requirements: [
      'DSCR 1.2+',
      'Property appraisal',
      '20-25% down payment',
      'Rent roll or lease agreements',
      'Property insurance',
    ],
    restrictions: {
      states: [],
      entityTypes: [],
    },
    partnerId: 'partner_4',
  },
  {
    id: 'source_5',
    name: 'Equipment Financing',
    type: 'loan',
    track: ['business'],
    minAmount: 5000,
    maxAmount: 500000,
    minCreditScore: 600,
    minTimeInBusiness: 6,
    approvalTimeframe: '2-3 days',
    costStructure: {
      apr: '8-15%',
      fees: 'First and last payment upfront',
    },
    requirements: [
      'Equipment quote or invoice',
      '6+ months in business',
      'Basic financial statements',
    ],
    restrictions: {
      industries: [],
      states: [],
      entityTypes: [],
    },
  },
];

// Mock Funding Profile
export const mockFundingProfile: FundingProfile = {
  id: 'profile_1',
  userId: 'user_1',
  track: 'business',
  targetAmount: 150000,
  urgency: 'medium',
  purpose: 'Expand operations, hire team, and increase marketing',
  readinessScore: 68,
  intakeCompleted: true,
  intakeData: {
    fundingUse: 'expansion',
    existingDebt: 25000,
    collateralAvailable: true,
    personalGuaranteeAccepted: true,
  },
  createdAt: '2026-01-10T00:00:00Z',
  updatedAt: '2026-01-12T08:00:00Z',
};

// Mock Funding Recommendations
export const mockRecommendations: FundingRecommendation[] = [
  {
    id: 'rec_1',
    fundingProfileId: 'profile_1',
    source: mockFundingSources[0],
    approvalProbability: 0.85,
    speed: 2,
    netCost: 18000,
    score: 92,
    confidence: 0.88,
    explanation: 'Excellent match based on your revenue, credit tier, and time in business. Fast approval likely.',
    tradeoffs: [
      'Higher APR than SBA, but 30x faster',
      'Lower credit limit than term loan',
    ],
    nextActions: [
      'Connect business bank account',
      'Upload last 3 months bank statements',
      'Complete credit authorization',
    ],
    blockers: [],
    estimatedAmount: 150000,
    rank: 1,
  },
  {
    id: 'rec_2',
    fundingProfileId: 'profile_1',
    source: mockFundingSources[2],
    approvalProbability: 0.78,
    speed: 4,
    netCost: 30000,
    score: 85,
    confidence: 0.82,
    explanation: 'Good fit for recurring revenue business. No hard credit pull. Fast funding.',
    tradeoffs: [
      'Higher total cost (1.2x payback)',
      'Automatic revenue deductions',
    ],
    nextActions: [
      'Connect payment processor',
      'Provide revenue documentation',
      'Review repayment terms',
    ],
    blockers: [],
    estimatedAmount: 150000,
    rank: 2,
  },
  {
    id: 'rec_3',
    fundingProfileId: 'profile_1',
    source: mockFundingSources[1],
    approvalProbability: 0.65,
    speed: 45,
    netCost: 12000,
    score: 72,
    confidence: 0.75,
    explanation: 'Lowest cost option, but requires extensive documentation and longer timeline.',
    tradeoffs: [
      'Lowest APR (6.5-10%)',
      '30-60 day process',
      'Extensive documentation required',
    ],
    nextActions: [
      'Complete SBA readiness checklist',
      'Gather 3 years tax returns',
      'Prepare business plan',
      'Compile financial statements',
    ],
    blockers: [
      'May need stronger financials for full approval',
    ],
    estimatedAmount: 150000,
    rank: 3,
  },
];

// Mock Readiness Score
export const mockReadinessScore: ReadinessScore = {
  id: 'readiness_1',
  fundingProfileId: 'profile_1',
  score: 68,
  calculatedAt: '2026-01-12T08:00:00Z',
  blockers: [
    {
      id: 'blocker_1',
      category: 'documentation',
      severity: 'high',
      title: 'Missing Business Tax Returns',
      description: 'Most lenders require 2-3 years of business tax returns for amounts over $100k.',
      impact: 15,
      estimatedTimeToFix: '1-2 days (if available)',
    },
    {
      id: 'blocker_2',
      category: 'credit',
      severity: 'medium',
      title: 'Business Credit Profile Incomplete',
      description: 'Building a business credit profile increases approval odds by 20-30%.',
      impact: 10,
      estimatedTimeToFix: '30-60 days',
    },
    {
      id: 'blocker_3',
      category: 'banking',
      severity: 'low',
      title: 'Recent NSF Incidents',
      description: '2 NSF transactions in the last 90 days may concern underwriters.',
      impact: 5,
      estimatedTimeToFix: '30-90 days (wait for clean period)',
    },
  ],
  tasks: [
    {
      id: 'task_1',
      title: 'Obtain Business Tax Returns',
      description: 'Download your last 2 years of business tax returns from your accountant or IRS.',
      category: 'documentation',
      priority: 'critical',
      status: 'pending',
      estimatedTime: '1-2 days',
      resources: [
        {
          type: 'guide',
          title: 'How to Get Tax Transcripts from IRS',
          description: 'Step-by-step guide to requesting official transcripts',
          url: '#',
        },
      ],
    },
    {
      id: 'task_2',
      title: 'Build Business Credit File',
      description: 'Establish trade lines and register with business credit bureaus.',
      category: 'credit',
      priority: 'high',
      status: 'pending',
      estimatedTime: '30-60 days',
      resources: [
        {
          type: 'service',
          title: 'Business Credit Build Plan',
          description: 'Guided program to establish business credit',
          isPaid: true,
          price: 299,
        },
      ],
    },
    {
      id: 'task_3',
      title: 'Prepare Profit & Loss Statement',
      description: 'Create a current P&L statement showing revenue and expenses.',
      category: 'documentation',
      priority: 'high',
      status: 'in-progress',
      estimatedTime: '2-3 hours',
      resources: [
        {
          type: 'template',
          title: 'P&L Template',
          description: 'Excel template for creating professional financial statements',
        },
      ],
    },
  ],
  projectedImprovement: 18,
};

// Mock Partners
export const mockPartners: Partner[] = [
  {
    id: 'partner_1',
    name: 'FastFund Business Capital',
    type: 'lender',
    status: 'active',
    trustScore: 88,
    businessInfo: {
      legalName: 'FastFund Capital LLC',
      ein: '12-3456789',
      website: 'https://fastfund.example.com',
      contactEmail: 'partners@fastfund.example.com',
      contactPhone: '+1 (800) 555-0100',
    },
    offers: [mockFundingSources[0]],
    statistics: {
      totalReferrals: 1247,
      totalApprovals: 892,
      approvalRate: 0.715,
      averageTimeToDecision: 1.8,
      totalRevenue: 124500,
    },
    onboardedAt: '2025-06-15T00:00:00Z',
  },
  {
    id: 'partner_2',
    name: 'SBA Certified Lending Partners',
    type: 'lender',
    status: 'active',
    trustScore: 95,
    businessInfo: {
      legalName: 'SBA Certified Lending Partners Inc',
      ein: '98-7654321',
      website: 'https://sbalending.example.com',
      contactEmail: 'applications@sbalending.example.com',
      contactPhone: '+1 (800) 555-0200',
    },
    offers: [mockFundingSources[1]],
    statistics: {
      totalReferrals: 456,
      totalApprovals: 298,
      approvalRate: 0.653,
      averageTimeToDecision: 42,
      totalRevenue: 89200,
    },
    onboardedAt: '2025-03-10T00:00:00Z',
  },
];

// Mock Services
export const mockServices: Service[] = [
  {
    id: 'service_1',
    name: 'Funding Readiness Audit',
    description: 'Comprehensive analysis of your funding profile with actionable recommendations',
    type: 'one-time',
    price: 199,
    currency: 'USD',
    features: [
      'Complete funding readiness assessment',
      'Personalized action plan',
      'Document requirements checklist',
      'Approval probability analysis',
      '30-minute strategy call',
    ],
    deliverables: [
      'Detailed PDF report',
      'Customized roadmap',
      'Template library access',
    ],
    estimatedDeliveryTime: '2-3 business days',
    requiredTrustScore: 60,
  },
  {
    id: 'service_2',
    name: 'Application Concierge',
    description: 'White-glove application packaging and submission support',
    type: 'one-time',
    price: 499,
    currency: 'USD',
    features: [
      'Document package preparation',
      'Application review and optimization',
      'Direct submission to qualified lenders',
      'Follow-up and status tracking',
      'Unlimited revisions',
    ],
    deliverables: [
      'Professional document package',
      'Lender submissions (up to 3)',
      'Status dashboard access',
    ],
    estimatedDeliveryTime: '5-7 business days',
    requiredTrustScore: 70,
  },
  {
    id: 'service_3',
    name: 'Business Credit Build Plan',
    description: 'Structured 90-day program to establish and build business credit',
    type: 'one-time',
    price: 299,
    currency: 'USD',
    features: [
      'Credit bureau registration',
      'Trade line recommendations',
      'Monthly credit monitoring',
      'Expert guidance and support',
      '90-day action plan',
    ],
    deliverables: [
      'Week-by-week roadmap',
      'Vendor contact list',
      'Credit monitoring reports',
    ],
    estimatedDeliveryTime: 'Ongoing - 90 days',
    requiredTrustScore: 50,
  },
  {
    id: 'service_4',
    name: 'Deal Structuring Session',
    description: 'One-on-one consultation on optimal funding structure for your needs',
    type: 'one-time',
    price: 349,
    currency: 'USD',
    features: [
      '60-minute strategy session',
      'Capital stack analysis',
      'Cost comparison modeling',
      'Risk assessment',
      'Custom recommendations',
    ],
    deliverables: [
      'Session recording',
      'Strategy summary document',
      'Custom financial model',
    ],
    estimatedDeliveryTime: 'Scheduled within 48 hours',
    requiredTrustScore: 65,
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  trustScore: mockUser.trustScore,
  activeFundingProfiles: 1,
  recommendationsCount: 3,
  applicationsInProgress: 0,
  estimatedApprovalOdds: 0.78,
  nextSteps: [
    'Complete your business verification to unlock partner submissions',
    'Upload business tax returns to improve readiness score',
    'Review your top 3 funding recommendations',
  ],
  recentActivity: [
    {
      id: 'activity_1',
      type: 'funding-map',
      title: 'Funding Map Generated',
      description: '3 high-probability recommendations found',
      timestamp: '2026-01-12T08:00:00Z',
    },
    {
      id: 'activity_2',
      type: 'readiness',
      title: 'Readiness Score Updated',
      description: 'Score: 68/100 - Good readiness level',
      timestamp: '2026-01-12T07:55:00Z',
    },
    {
      id: 'activity_3',
      type: 'task',
      title: 'Task In Progress',
      description: 'Preparing Profit & Loss Statement',
      timestamp: '2026-01-11T14:30:00Z',
    },
  ],
};

// Trust Score calculation helper
export const calculateTrustLevel = (score: number): TrustScore['level'] => {
  if (score < 30) return 'critical';
  if (score < 60) return 'low';
  if (score < 75) return 'medium';
  if (score < 85) return 'good';
  return 'excellent';
};

// Mock delay for simulating API calls
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
