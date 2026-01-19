import { invokeLLM } from '../_core/llm';

export interface FundingApplication {
  id: number;
  userId: number;
  businessName: string;
  industry: string;
  fundingAmount: number;
  fundingPurpose: string;
  creditScore: number;
  annualRevenue: number;
  yearsInBusiness: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date | null;
  reviewedAt: Date | null;
}

export interface FundingOption {
  id: string;
  lenderName: string;
  lenderType: 'bank' | 'sba' | 'alternative' | 'venture_capital' | 'angel';
  fundingType: 'term_loan' | 'line_of_credit' | 'sba_loan' | 'equipment_financing' | 'invoice_factoring' | 'equity';
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  term: number; // months
  approvalTime: string; // e.g., "2-3 weeks"
  requirements: string[];
  matchScore: number; // 0-100
}

export interface BusinessProfile {
  businessName: string;
  industry: string;
  yearsInBusiness: number;
  annualRevenue: number;
  monthlyRevenue: number;
  employees: number;
  creditScore: number;
  hasCollateral: boolean;
  existingDebt: number;
}

/**
 * Get user's funding applications
 */
export async function getUserApplications(userId: number): Promise<FundingApplication[]> {
  return [
    {
      id: 1,
      userId,
      businessName: 'Tech Startup Inc',
      industry: 'Technology',
      fundingAmount: 250000,
      fundingPurpose: 'Expansion and hiring',
      creditScore: 720,
      annualRevenue: 500000,
      yearsInBusiness: 3,
      status: 'approved',
      submittedAt: new Date('2026-01-10'),
      reviewedAt: new Date('2026-01-15'),
    },
    {
      id: 2,
      userId,
      businessName: 'Tech Startup Inc',
      industry: 'Technology',
      fundingAmount: 100000,
      fundingPurpose: 'Equipment purchase',
      creditScore: 720,
      annualRevenue: 500000,
      yearsInBusiness: 3,
      status: 'under_review',
      submittedAt: new Date('2026-01-18'),
      reviewedAt: null,
    },
  ];
}

/**
 * Create a new funding application
 */
export async function createApplication(params: {
  userId: number;
  businessName: string;
  industry: string;
  fundingAmount: number;
  fundingPurpose: string;
  creditScore: number;
  annualRevenue: number;
  yearsInBusiness: number;
}): Promise<FundingApplication> {
  return {
    id: Date.now(),
    userId: params.userId,
    businessName: params.businessName,
    industry: params.industry,
    fundingAmount: params.fundingAmount,
    fundingPurpose: params.fundingPurpose,
    creditScore: params.creditScore,
    annualRevenue: params.annualRevenue,
    yearsInBusiness: params.yearsInBusiness,
    status: 'draft',
    submittedAt: null,
    reviewedAt: null,
  };
}

/**
 * Find matching funding options
 */
export async function findFundingOptions(params: {
  fundingAmount: number;
  creditScore: number;
  annualRevenue: number;
  yearsInBusiness: number;
  industry: string;
  fundingPurpose: string;
}): Promise<FundingOption[]> {
  const options: FundingOption[] = [];

  // SBA Loans (best for established businesses)
  if (params.yearsInBusiness >= 2 && params.creditScore >= 680) {
    options.push({
      id: 'sba-7a',
      lenderName: 'SBA 7(a) Loan Program',
      lenderType: 'sba',
      fundingType: 'sba_loan',
      minAmount: 50000,
      maxAmount: 5000000,
      interestRate: 6.5,
      term: 120, // 10 years
      approvalTime: '4-6 weeks',
      requirements: [
        'Credit score 680+',
        '2+ years in business',
        'Detailed business plan',
        'Personal guarantee',
      ],
      matchScore: 85,
    });
  }

  // Traditional Bank Loans
  if (params.creditScore >= 700 && params.annualRevenue >= 250000) {
    options.push({
      id: 'bank-term',
      lenderName: 'Traditional Bank Term Loan',
      lenderType: 'bank',
      fundingType: 'term_loan',
      minAmount: 25000,
      maxAmount: 500000,
      interestRate: 7.5,
      term: 60, // 5 years
      approvalTime: '2-4 weeks',
      requirements: [
        'Credit score 700+',
        'Strong cash flow',
        'Collateral required',
        'Financial statements',
      ],
      matchScore: 75,
    });
  }

  // Alternative Lenders (faster, more flexible)
  if (params.annualRevenue >= 100000) {
    options.push({
      id: 'alt-term',
      lenderName: 'Alternative Online Lender',
      lenderType: 'alternative',
      fundingType: 'term_loan',
      minAmount: 10000,
      maxAmount: 500000,
      interestRate: 12.0,
      term: 36, // 3 years
      approvalTime: '1-3 days',
      requirements: [
        'Credit score 600+',
        '6+ months in business',
        'Bank statements',
        'Minimal documentation',
      ],
      matchScore: 90,
    });
  }

  // Line of Credit
  if (params.creditScore >= 650 && params.yearsInBusiness >= 1) {
    options.push({
      id: 'loc-business',
      lenderName: 'Business Line of Credit',
      lenderType: 'bank',
      fundingType: 'line_of_credit',
      minAmount: 10000,
      maxAmount: 250000,
      interestRate: 9.0,
      term: 12, // revolving, 12-month review
      approvalTime: '1-2 weeks',
      requirements: [
        'Credit score 650+',
        '1+ year in business',
        'Regular revenue',
        'Good cash flow',
      ],
      matchScore: 80,
    });
  }

  // Equipment Financing
  if (params.fundingPurpose.toLowerCase().includes('equipment')) {
    options.push({
      id: 'equip-finance',
      lenderName: 'Equipment Financing',
      lenderType: 'alternative',
      fundingType: 'equipment_financing',
      minAmount: 5000,
      maxAmount: 500000,
      interestRate: 8.0,
      term: 60,
      approvalTime: '3-5 days',
      requirements: [
        'Equipment serves as collateral',
        'Credit score 600+',
        'Equipment quote/invoice',
      ],
      matchScore: 88,
    });
  }

  // Invoice Factoring (for B2B businesses)
  if (params.annualRevenue >= 250000) {
    options.push({
      id: 'invoice-factor',
      lenderName: 'Invoice Factoring',
      lenderType: 'alternative',
      fundingType: 'invoice_factoring',
      minAmount: 10000,
      maxAmount: 1000000,
      interestRate: 15.0, // Factor fee, not traditional interest
      term: 3, // 90 days typical
      approvalTime: '24-48 hours',
      requirements: [
        'B2B business model',
        'Outstanding invoices',
        'Creditworthy customers',
      ],
      matchScore: 70,
    });
  }

  // Sort by match score
  return options.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Calculate funding eligibility score
 */
export async function calculateEligibility(profile: BusinessProfile): Promise<{
  score: number; // 0-100
  grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }>;
  recommendations: string[];
}> {
  let score = 50; // Base score
  const factors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }> = [];
  const recommendations: string[] = [];

  // Credit score impact (30% weight)
  if (profile.creditScore >= 750) {
    score += 15;
    factors.push({
      factor: 'Excellent Credit Score',
      impact: 'positive',
      description: `Credit score of ${profile.creditScore} is excellent`,
    });
  } else if (profile.creditScore >= 680) {
    score += 10;
    factors.push({
      factor: 'Good Credit Score',
      impact: 'positive',
      description: `Credit score of ${profile.creditScore} is good`,
    });
  } else if (profile.creditScore < 600) {
    score -= 15;
    factors.push({
      factor: 'Low Credit Score',
      impact: 'negative',
      description: `Credit score of ${profile.creditScore} may limit options`,
    });
    recommendations.push('Work on improving your credit score before applying');
  }

  // Years in business (25% weight)
  if (profile.yearsInBusiness >= 5) {
    score += 12;
    factors.push({
      factor: 'Established Business',
      impact: 'positive',
      description: `${profile.yearsInBusiness} years shows stability`,
    });
  } else if (profile.yearsInBusiness >= 2) {
    score += 8;
    factors.push({
      factor: 'Growing Business',
      impact: 'positive',
      description: `${profile.yearsInBusiness} years of operation`,
    });
  } else {
    score -= 5;
    factors.push({
      factor: 'New Business',
      impact: 'negative',
      description: 'Less than 2 years may limit traditional options',
    });
    recommendations.push('Consider alternative lenders for newer businesses');
  }

  // Revenue (25% weight)
  if (profile.annualRevenue >= 1000000) {
    score += 12;
    factors.push({
      factor: 'Strong Revenue',
      impact: 'positive',
      description: `$${(profile.annualRevenue / 1000000).toFixed(1)}M annual revenue`,
    });
  } else if (profile.annualRevenue >= 250000) {
    score += 8;
    factors.push({
      factor: 'Solid Revenue',
      impact: 'positive',
      description: `$${(profile.annualRevenue / 1000).toFixed(0)}K annual revenue`,
    });
  } else {
    score -= 5;
    factors.push({
      factor: 'Limited Revenue',
      impact: 'negative',
      description: 'Revenue below $250K may limit options',
    });
    recommendations.push('Focus on revenue growth before seeking large funding');
  }

  // Collateral (10% weight)
  if (profile.hasCollateral) {
    score += 5;
    factors.push({
      factor: 'Collateral Available',
      impact: 'positive',
      description: 'Having collateral improves approval odds',
    });
  }

  // Existing debt (10% weight)
  const debtToRevenueRatio = profile.existingDebt / profile.annualRevenue;
  if (debtToRevenueRatio < 0.3) {
    score += 5;
    factors.push({
      factor: 'Low Debt',
      impact: 'positive',
      description: 'Debt-to-revenue ratio is healthy',
    });
  } else if (debtToRevenueRatio > 0.7) {
    score -= 10;
    factors.push({
      factor: 'High Existing Debt',
      impact: 'negative',
      description: 'High debt burden may reduce eligibility',
    });
    recommendations.push('Consider debt consolidation before seeking new funding');
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  let grade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  if (score >= 80) grade = 'Excellent';
  else if (score >= 65) grade = 'Good';
  else if (score >= 50) grade = 'Fair';
  else grade = 'Poor';

  return {
    score,
    grade,
    factors,
    recommendations,
  };
}

/**
 * Get AI funding advice
 */
export async function getFundingAdvice(params: {
  userId: number;
  question: string;
  businessProfile?: BusinessProfile;
}): Promise<{ advice: string; nextSteps: string[] }> {
  const contextStr = params.businessProfile
    ? `\nBusiness Profile:\n- Name: ${params.businessProfile.businessName}\n- Industry: ${params.businessProfile.industry}\n- Revenue: $${params.businessProfile.annualRevenue}\n- Years: ${params.businessProfile.yearsInBusiness}\n- Credit Score: ${params.businessProfile.creditScore}`
    : '';

  const prompt = `${params.question}${contextStr}

Provide expert business funding advice. Be specific and actionable.`;

  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: 'You are an expert business funding advisor. Provide practical, actionable advice on business financing options, loan applications, and funding strategies.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const advice = typeof rawContent === 'string' ? rawContent : '';

  // Extract action items
  const nextSteps = advice
    .split('\n')
    .filter((line: string) => line.trim().match(/^[-*\d.]/))
    .map((line: string) => line.trim())
    .slice(0, 5);

  return {
    advice,
    nextSteps: nextSteps.length > 0 ? nextSteps : [
      'Review your business financials',
      'Check your credit score',
      'Prepare a business plan',
      'Research funding options',
    ],
  };
}

/**
 * Generate application documents
 */
export async function generateApplicationDocuments(params: {
  businessProfile: BusinessProfile;
  fundingAmount: number;
  fundingPurpose: string;
}): Promise<{
  businessPlan: string;
  financialProjections: string;
  executiveSummary: string;
}> {
  const prompt = `Generate a professional business funding application package for:
- Business: ${params.businessProfile.businessName}
- Industry: ${params.businessProfile.industry}
- Funding Amount: $${params.fundingAmount}
- Purpose: ${params.fundingPurpose}
- Annual Revenue: $${params.businessProfile.annualRevenue}
- Years in Business: ${params.businessProfile.yearsInBusiness}

Provide:
1. Executive Summary (2-3 paragraphs)
2. Business Plan Outline
3. Financial Projections Summary`;

  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: 'You are an expert business consultant specializing in funding applications. Generate professional, compelling application documents.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const content = typeof rawContent === 'string' ? rawContent : '';

  // Parse sections (simplified)
  const sections = content.split('\n\n');

  return {
    executiveSummary: sections[0] || 'Executive summary to be generated',
    businessPlan: sections.slice(1, 3).join('\n\n') || 'Business plan to be generated',
    financialProjections: sections.slice(3).join('\n\n') || 'Financial projections to be generated',
  };
}

/**
 * Compare funding options
 */
export async function compareFundingOptions(optionIds: string[]): Promise<{
  comparison: Array<{
    metric: string;
    values: Record<string, string | number>;
  }>;
  recommendation: string;
}> {
  // In production, fetch actual options by IDs
  const metrics = [
    {
      metric: 'Interest Rate',
      values: { 'Option 1': '6.5%', 'Option 2': '12.0%', 'Option 3': '8.0%' },
    },
    {
      metric: 'Approval Time',
      values: { 'Option 1': '4-6 weeks', 'Option 2': '1-3 days', 'Option 3': '3-5 days' },
    },
    {
      metric: 'Max Amount',
      values: { 'Option 1': '$5M', 'Option 2': '$500K', 'Option 3': '$500K' },
    },
    {
      metric: 'Term Length',
      values: { 'Option 1': '10 years', 'Option 2': '3 years', 'Option 3': '5 years' },
    },
  ];

  return {
    comparison: metrics,
    recommendation: 'Based on your profile, Option 1 (SBA Loan) offers the best combination of low interest rate and long term, though it requires more time for approval.',
  };
}
