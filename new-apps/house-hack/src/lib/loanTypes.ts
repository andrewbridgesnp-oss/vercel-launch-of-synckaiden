// KAIDEN HouseHack - Comprehensive loan type definitions
// Data accurate as of January 2025 - Subject to change based on HUD/FHA/FHFA updates
// 
// LEGAL DISCLAIMER: Information provided for educational purposes only.
// Actual loan terms vary by lender, location, credit profile, and market conditions.
// Consult licensed mortgage professionals for personalized advice.

export interface LoanType {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  minDownPayment: number;
  maxDTI: number;
  minCreditScore: number;
  allowsRenovation: boolean;
  maxUnits: number;
  requiresOwnerOccupancy: boolean;
  pros: string[];
  cons: string[];
  bestFor: string[];
  loanLimits: {
    floor: number; // Floor limit (most of SC/GA)
    highCost: number; // High-cost area limit
    notes: string;
  };
  features: string[];
  restrictions: string[];
  typical_interest_rate_premium: number; // Basis points above conventional
  dataSource: string;
  lastUpdated: string;
}

// 2025 Loan Limit Data - Verified from FHFA and HUD
// South Carolina and Georgia are predominantly "floor" limit areas
export const LOAN_LIMITS_2025 = {
  conventional: {
    floor: 806500, // 2025 conforming loan limit
    highCost: 1209750, // 150% of floor for high-cost areas
    source: 'FHFA November 2024 announcement'
  },
  fha: {
    floor: 498257, // 2025 FHA floor limit (1-unit)
    highCost: 1149825, // 150% of conventional floor
    source: 'HUD Mortgagee Letter 2024-17'
  },
  va: {
    floor: 806500, // VA follows conventional limits
    notes: 'No limit with full entitlement in most cases'
  }
};

export const loanTypes: Record<string, LoanType> = {
  'fha-203k-standard': {
    id: 'fha-203k-standard',
    name: 'FHA 203(k) Standard Renovation Loan',
    shortName: 'FHA 203(k) Standard',
    description: 'Finance purchase AND major renovations with one loan. Perfect for properties needing significant work ($35k+ repairs).',
    icon: '🏗️',
    minDownPayment: 3.5, // 3.5% with 580+ FICO, 10% with 500-579 FICO
    maxDTI: 43, // Standard max, up to 50% with compensating factors
    minCreditScore: 580, // Lender overlays may require 620+
    allowsRenovation: true,
    maxUnits: 4,
    requiresOwnerOccupancy: true,
    pros: [
      'Only 3.5% down (580+ credit score)',
      'Finance major structural repairs ($35k+)',
      'No maximum renovation amount',
      'Can purchase uninhabitable properties',
      'Build equity through forced appreciation',
      '1-4 unit properties eligible',
      'Streamline option available for refinance'
    ],
    cons: [
      'Requires HUD consultant ($400-$1,500)',
      'More paperwork and documentation',
      'Longer closing time (45-75 days typical)',
      'Must use licensed contractors',
      'Upfront mortgage insurance premium 1.75%',
      'Annual MIP 0.55-0.85% (never cancels unless refinance)',
      'Minimum $5,000 in eligible repairs required'
    ],
    bestFor: [
      'Properties needing major work ($35k+ repairs)',
      'Structural repairs (foundation, roof, HVAC)',
      'First-time house-hackers with limited cash',
      'Adding square footage or units',
      'Properties below market value due to condition'
    ],
    loanLimits: {
      floor: 498257, // SC/GA floor limit (2025)
      highCost: 1149825, // High-cost areas (rare in SC/GA)
      notes: 'Limits apply to purchase price + renovation costs combined. South Carolina and Georgia use floor limits statewide except specific high-cost counties.'
    },
    features: [
      'Up to 6 months contingency reserve (20% of renovation)',
      'HUD consultant fees can be financed',
      'Architectural/engineering fees can be financed',
      'Property must meet HUD Minimum Property Standards after work',
      'Contingency reserves protect against cost overruns',
      'Can finance energy efficiency improvements'
    ],
    restrictions: [
      'No luxury items (swimming pools, outdoor kitchens)',
      'Work must complete within 12 months (extendable to 18)',
      'Minimum $5,000 in eligible improvements',
      'Property must be primary residence',
      'Must have feasibility study for >$35k projects',
      'Landscaping limited to 10% of renovation budget'
    ],
    typical_interest_rate_premium: 0, // FHA rates competitive with conventional
    dataSource: 'HUD Handbook 4000.1, ML 2024-17, HUD 203(k) Consultant List',
    lastUpdated: '2025-01-11'
  },

  'fha-203k-limited': {
    id: 'fha-203k-limited',
    name: 'FHA 203(k) Limited Renovation Loan',
    shortName: 'FHA 203(k) Limited',
    description: 'Finance purchase AND minor renovations (up to $75k) with streamlined process. Also called "Streamline 203(k)".',
    icon: '🔨',
    minDownPayment: 3.5,
    maxDTI: 43,
    minCreditScore: 580,
    allowsRenovation: true,
    maxUnits: 4,
    requiresOwnerOccupancy: true,
    pros: [
      'Only 3.5% down payment',
      'No HUD consultant required',
      'Faster process than Standard 203(k)',
      'Lower costs and less paperwork',
      'Perfect for cosmetic updates',
      '1-4 unit properties eligible',
      'Can close in 30-45 days'
    ],
    cons: [
      'Maximum $75,000 in renovations (as of 11/2024)',
      'No structural work allowed',
      'Still requires mortgage insurance',
      'Must use licensed contractors',
      'Upfront MIP 1.75%',
      'Annual MIP 0.55-0.85%',
      'Work must complete in 9 months'
    ],
    bestFor: [
      'Properties needing cosmetic work only',
      'Repairs under $75k',
      'First-time buyers wanting quick closing',
      'Kitchen/bathroom remodels (non-structural)',
      'Flooring, paint, appliances, HVAC replacement'
    ],
    loanLimits: {
      floor: 498257,
      highCost: 1149825,
      notes: 'Renovation budget cannot exceed $75,000 as of November 2024 update. Combined purchase + renovation subject to FHA loan limits.'
    },
    features: [
      'No HUD consultant needed',
      'Streamlined documentation',
      'Faster closing (30-45 days)',
      'Can include energy efficiency upgrades',
      'No feasibility study required',
      'Can do multiple projects under $75k cap'
    ],
    restrictions: [
      'Maximum $75k in renovations (hard cap)',
      'No structural alterations',
      'No additions or new construction',
      'Property must be habitable at closing',
      'Complete work within 9 months',
      'No demolition requiring engineering'
    ],
    typical_interest_rate_premium: 0,
    dataSource: 'HUD ML 2024-14, FHA 203(k) Limited Program Guide',
    lastUpdated: '2025-01-11'
  },

  'conventional': {
    id: 'conventional',
    name: 'Conventional Conforming Loan',
    shortName: 'Conventional',
    description: 'Standard mortgage backed by Fannie Mae/Freddie Mac. Best rates and lowest total cost for qualified buyers.',
    icon: '🏦',
    minDownPayment: 3, // 3% first-time buyer, 5% repeat, 15% for 2-unit, 25% for 3-4 unit
    maxDTI: 50, // Up to 50% with strong compensating factors
    minCreditScore: 620, // Hard floor, 680+ for best rates
    allowsRenovation: false,
    maxUnits: 4,
    requiresOwnerOccupancy: true,
    pros: [
      'Best interest rates available',
      'No upfront mortgage insurance',
      'PMI cancels automatically at 78% LTV',
      'Higher loan limits than FHA',
      'Less restrictive property standards',
      'Faster closing (20-30 days)',
      'Can request PMI removal at 80% LTV'
    ],
    cons: [
      'Requires higher credit score (620+ minimum)',
      'PMI required if less than 20% down',
      'Stricter income/employment verification',
      'No renovation financing',
      'Higher down payment for multi-unit (15-25%)',
      '6-12 months reserves required for 2-4 units'
    ],
    bestFor: [
      'Buyers with good-excellent credit (680+)',
      'Properties in good condition',
      'Buyers who can put 5-20% down',
      'Those wanting lowest total cost',
      'Buyers avoiding FHA property restrictions'
    ],
    loanLimits: {
      floor: 806500, // 2025 conforming limit
      highCost: 1209750, // 2025 high-cost limit
      notes: 'South Carolina and Georgia use floor limits statewide. Limits increase for 2-4 unit properties (multiply by 1.28, 1.55, 1.92 respectively).'
    },
    features: [
      'No upfront mortgage insurance premium',
      'PMI automatically cancels at 78% LTV',
      'Can request PMI removal at 80% LTV',
      'Higher loan amounts than FHA',
      'Investment properties allowed (25% down, higher rates)',
      'First-time buyer programs at 3% down'
    ],
    restrictions: [
      'Property must be habitable and meet standards',
      'Stricter appraisal requirements',
      '2-6 months reserves for 2-4 units',
      'Rental income underwriting is conservative (75% typically)',
      'Multi-unit requires higher down (15-25%)',
      'No gift funds for investment properties'
    ],
    typical_interest_rate_premium: 0, // Baseline rate
    dataSource: 'FHFA 2025 Loan Limits, Fannie Mae Selling Guide',
    lastUpdated: '2025-01-11'
  },

  'fha-standard': {
    id: 'fha-standard',
    name: 'FHA Standard Purchase Loan',
    shortName: 'FHA Standard',
    description: 'Government-backed loan for move-in ready properties. Low down payment with flexible credit requirements.',
    icon: '🏘️',
    minDownPayment: 3.5,
    maxDTI: 43,
    minCreditScore: 580,
    allowsRenovation: false,
    maxUnits: 4,
    requiresOwnerOccupancy: true,
    pros: [
      'Only 3.5% down payment',
      'Lower credit score accepted (580+ typically)',
      'Flexible income requirements',
      'Seller can pay up to 6% closing costs',
      'Gift funds allowed for entire down payment',
      'Works with 2-4 unit properties',
      'Non-occupant co-borrower allowed'
    ],
    cons: [
      'Upfront mortgage insurance 1.75%',
      'Lifetime annual MIP 0.55-0.85%',
      'Lower loan limits than conventional',
      'Property must meet FHA standards',
      'No renovation financing',
      'MIP never cancels (unless 10% down + refinance)'
    ],
    bestFor: [
      'First-time buyers with limited savings',
      'Buyers with credit scores 580-680',
      'House-hackers buying turnkey properties',
      'Borrowers using gift funds',
      'Those needing flexible underwriting'
    ],
    loanLimits: {
      floor: 498257,
      highCost: 1149825,
      notes: 'SC/GA use floor limits. Multi-unit limits higher (2-unit: $638,308, 3-unit: $771,536, 4-unit: $958,464 in floor areas).'
    },
    features: [
      'Non-occupant co-borrower allowed',
      'Assumable loan (valuable in rising rate environment)',
      'Gift funds for entire down payment permitted',
      'FHA Streamline refinance available',
      'Seller concessions up to 6%',
      'Flexible debt-to-income ratios'
    ],
    restrictions: [
      'Property must be move-in ready',
      'FHA appraisal can be strict',
      'MIP required regardless of down payment',
      'Primary residence only for 1-unit (2-4 units OK)',
      'Property must meet HUD Minimum Property Standards',
      'Some lenders add overlays (620+ FICO)'
    ],
    typical_interest_rate_premium: 0,
    dataSource: 'HUD Handbook 4000.1, ML 2024-17',
    lastUpdated: '2025-01-11'
  },

  'va-loan': {
    id: 'va-loan',
    name: 'VA Home Loan',
    shortName: 'VA Loan',
    description: 'Zero down payment for veterans, active military, and eligible spouses. No monthly mortgage insurance.',
    icon: '🎖️',
    minDownPayment: 0,
    maxDTI: 41, // Guideline; can exceed with residual income
    minCreditScore: 580, // VA doesn't set minimum, lenders typically 580-620
    allowsRenovation: false, // Standard VA - VA Renovation loan exists separately
    maxUnits: 4,
    requiresOwnerOccupancy: true,
    pros: [
      '0% down payment',
      'No monthly mortgage insurance (PMI/MIP)',
      'Competitive interest rates',
      'No prepayment penalties',
      'Seller can pay all closing costs',
      'Assumable loan',
      'Can use multiple times'
    ],
    cons: [
      'VA funding fee 2.15-3.3% (can be financed)',
      'Must be veteran, active military, or eligible spouse',
      'Property must meet VA Minimum Property Requirements',
      'Limited to primary residence',
      'Can be harder to win competitive bids',
      'Funding fee adds to loan balance'
    ],
    bestFor: [
      'Veterans and active duty military',
      'Eligible surviving spouses',
      'Buyers with no down payment savings',
      'Those wanting no monthly mortgage insurance',
      'Service members with Certificate of Eligibility'
    ],
    loanLimits: {
      floor: 806500, // Full entitlement amount
      highCost: 806500,
      notes: 'No loan limit with full entitlement. Partial entitlement limits apply. SC/GA veterans typically have full entitlement available.'
    },
    features: [
      'No down payment required',
      'No monthly PMI or MIP',
      'Assumable at original rate (valuable benefit)',
      'Funding fee waived for disabled veterans (10%+)',
      'Can use VA loan multiple times',
      'VA Renovation Loan available (separate program)',
      'Residual income method protects borrowers'
    ],
    restrictions: [
      'Must have Certificate of Eligibility (COE)',
      'Property must be primary residence',
      'VA appraisal required (MPR standards)',
      'Pest inspection required in SC/GA (both are Wood-Destroying Insect zones)',
      'Not available for investment properties',
      'Occupancy required within 60 days'
    ],
    typical_interest_rate_premium: 0, // Competitive with conventional
    dataSource: 'VA Lender Handbook, VA Pamphlet 26-7',
    lastUpdated: '2025-01-11'
  },

  'usda-loan': {
    id: 'usda-loan',
    name: 'USDA Rural Development Loan',
    shortName: 'USDA',
    description: 'Zero down payment for eligible rural and suburban areas. Lower mortgage insurance than FHA.',
    icon: '🌾',
    minDownPayment: 0,
    maxDTI: 41,
    minCreditScore: 640, // Effective floor with most lenders
    allowsRenovation: false,
    maxUnits: 1, // USDA is single-family only
    requiresOwnerOccupancy: true,
    pros: [
      '0% down payment',
      'Lower mortgage insurance than FHA (0.35% annual)',
      'Competitive interest rates',
      'Seller can pay closing costs',
      'Income limits protect from competition',
      'Upfront guarantee fee only 1% (vs FHA 1.75%)',
      '100% financing'
    ],
    cons: [
      'Must be in USDA-eligible area',
      'Income limits (typically 115% of area median)',
      'Single-family homes only (no 2-4 units)',
      'Property must be modest (no luxury features)',
      'Longer processing time',
      'Annual fee never cancels',
      'Not available in all areas of SC/GA'
    ],
    bestFor: [
      'Buyers in eligible rural/suburban areas',
      'Those with no down payment savings',
      'Income below area median',
      'First-time buyers wanting low payments',
      'Single-family home purchase'
    ],
    loanLimits: {
      floor: 0, // No set limit, based on income and area limits
      highCost: 0,
      notes: 'No maximum loan amount, but limited by income (typically 29/41 DTI ratios). SC/GA have extensive USDA eligible areas. Check USDA eligibility map.'
    },
    features: [
      '100% financing',
      'Low annual guarantee fee (0.35%)',
      'Upfront guarantee fee only 1%',
      'Gift funds allowed',
      'USDA Streamline refinance available',
      'Moderate income limits (not just low income)',
      'Can include closing costs in loan'
    ],
    restrictions: [
      'Property must be in USDA-eligible area (check map)',
      'Income cannot exceed 115% of area median (SC/GA: $110k-$130k depending on county)',
      'Single-family only (no multi-family)',
      'Primary residence only',
      'Property cannot have income-producing features',
      'No house-hacking allowed (no rental income)',
      'Must be U.S. citizen or permanent resident'
    ],
    typical_interest_rate_premium: 0,
    dataSource: 'USDA RD Handbook HB-1-3555, USDA Eligibility Map 2025',
    lastUpdated: '2025-01-11'
  },

  'homestyle-renovation': {
    id: 'homestyle-renovation',
    name: 'Fannie Mae HomeStyle Renovation',
    shortName: 'HomeStyle',
    description: 'Conventional renovation loan. Better rates than FHA 203(k) for qualified buyers with good credit.',
    icon: '🏡',
    minDownPayment: 5, // Primary residence owner-occupied
    maxDTI: 50,
    minCreditScore: 620, // 680+ for best rates
    allowsRenovation: true,
    maxUnits: 4,
    requiresOwnerOccupancy: true, // For primary; can do investment at 25% down
    pros: [
      'Better interest rates than FHA 203(k)',
      'No upfront mortgage insurance',
      'Finance structural and luxury items',
      'Higher loan limits than FHA',
      'Can do investment properties (25% down)',
      'More flexible than 203(k)',
      'Allows luxury improvements'
    ],
    cons: [
      'Requires higher credit score (620+ minimum)',
      'Higher down payment (5-25%)',
      'PMI required if less than 20% down',
      'Stricter income requirements',
      'Consultant may be required for large projects',
      '2-6 months reserves required'
    ],
    bestFor: [
      'Buyers with good-excellent credit (680+)',
      'Those who can put 5-20% down',
      'Renovations on higher-value properties',
      'Buyers wanting lower interest rates than FHA',
      'Luxury improvements (pools, high-end finishes)'
    ],
    loanLimits: {
      floor: 806500, // Plus renovation costs
      highCost: 1209750,
      notes: 'Loan can be up to 75% of completed appraised value. Renovation costs can exceed base loan limit. Available in SC/GA at conforming limits.'
    },
    features: [
      'Finance up to 75% of improved value',
      'Luxury items allowed (pools, outdoor kitchens)',
      'Investment properties eligible (25% down)',
      'Secondary homes eligible (10% down)',
      'Energy efficiency upgrades',
      'Can add square footage',
      'Structural work allowed'
    ],
    restrictions: [
      'Property must be habitable at closing',
      'Renovation must complete within 12 months',
      'Licensed contractors required',
      'Detailed scope of work and budget needed',
      'Consultant required for projects >$35k (varies by lender)',
      'Cannot exceed 75% LTV of improved value'
    ],
    typical_interest_rate_premium: 0, // Conventional rates
    dataSource: 'Fannie Mae HomeStyle Renovation Matrix, Selling Guide',
    lastUpdated: '2025-01-11'
  },

  'jumbo': {
    id: 'jumbo',
    name: 'Jumbo Loan',
    shortName: 'Jumbo',
    description: 'For high-value properties exceeding conforming loan limits ($806,500+ in SC/GA).',
    icon: '💎',
    minDownPayment: 10, // Some lenders offer 5-10%
    maxDTI: 43, // Conservative, varies by lender
    minCreditScore: 700, // Most require 720+ for best terms
    allowsRenovation: false,
    maxUnits: 4,
    requiresOwnerOccupancy: false, // Can be investment
    pros: [
      'Borrow above conforming limits',
      'No mortgage insurance with 20% down',
      'Luxury properties eligible',
      'Competitive rates for qualified buyers',
      'Can be used for investment properties',
      'Higher loan amounts available'
    ],
    cons: [
      'Requires excellent credit (700-740+)',
      'Higher down payment (10-20%+)',
      'Larger cash reserves required (12+ months)',
      'Stricter income/asset verification',
      'Slightly higher interest rates',
      'Not all lenders offer jumbo',
      'More stringent underwriting'
    ],
    bestFor: [
      'High-income buyers',
      'Properties above $806,500 (2025)',
      'Buyers with significant assets and reserves',
      'Luxury house-hacking (expensive markets)',
      'High-net-worth individuals'
    ],
    loanLimits: {
      floor: 806500, // Anything above 2025 conforming limit
      highCost: 999999999, // No upper limit, lender-specific
      notes: 'Jumbo loans exceed conforming limits. In SC/GA, this means $806,500+ for single-family. Rates in Charleston and Savannah high-end markets.'
    },
    features: [
      'No maximum loan amount (lender dependent)',
      'Can finance luxury properties',
      'Investment properties allowed',
      'Portfolio lending available',
      'Jumbo construction loans available',
      'Relationship pricing with private banks'
    ],
    restrictions: [
      'Significant reserves required (12+ months)',
      'Very strict underwriting',
      'Multiple income sources scrutinized',
      'Appraisal challenging for unique properties',
      'Limited lender availability in SC/GA',
      'Higher rates than conforming'
    ],
    typical_interest_rate_premium: 50, // +0.25-0.50% vs conventional
    dataSource: 'Private lender guidelines, various jumbo loan programs',
    lastUpdated: '2025-01-11'
  }
};

// State-specific data for South Carolina and Georgia
export const STATE_DATA = {
  'south-carolina': {
    name: 'South Carolina',
    abbreviation: 'SC',
    loanLimitType: 'floor', // Uses floor limits statewide
    fhaLimit1Unit: 498257,
    conventionalLimit1Unit: 806500,
    highCostCounties: [], // No high-cost counties in SC
    medianHomePrice: 285000, // Approximate 2025
    notes: 'SC uses floor FHA and conventional limits statewide. VA requires wood-destroying insect inspection. Strong house-hacking markets in Charleston, Columbia, Greenville.',
    househackingMarkets: ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach'],
    avgPropertyTax: 0.0055, // 0.55% effective rate
    hasFirstTimeProgram: true,
    firstTimeProgramName: 'SC Housing Palmetto Heroes Program'
  },
  'georgia': {
    name: 'Georgia',
    abbreviation: 'GA',
    loanLimitType: 'floor',
    fhaLimit1Unit: 498257,
    conventionalLimit1Unit: 806500,
    highCostCounties: [], // No high-cost counties in GA
    medianHomePrice: 310000,
    notes: 'GA uses floor limits statewide. VA requires wood-destroying insect inspection. Atlanta metro has strong rental demand for house-hacking.',
    househackingMarkets: ['Atlanta', 'Savannah', 'Athens', 'Augusta'],
    avgPropertyTax: 0.0087, // 0.87% effective rate
    hasFirstTimeProgram: true,
    firstTimeProgramName: 'Georgia Dream Homeownership Program'
  }
};

// Loan comparison helper
export function compareLoanTypes(loanTypeIds: string[]): LoanType[] {
  return loanTypeIds.map(id => loanTypes[id]).filter(Boolean);
}

// Loan recommendation engine
export interface BuyerProfile {
  creditScore: number;
  downPaymentPercent: number;
  monthlyIncome: number;
  monthlyDebts: number;
  isVeteran: boolean;
  isFirstTimeBuyer: boolean;
  propertyNeedsWork: boolean;
  renovationBudget: number;
  units: number;
  propertyValue: number;
  location: {
    state: string;
    county?: string;
    isRural: boolean;
  };
}

export function recommendLoanTypes(profile: BuyerProfile): Array<{
  loanType: LoanType;
  score: number;
  reasoning: string[];
  warnings: string[];
}> {
  const recommendations: Array<{ loanType: LoanType; score: number; reasoning: string[]; warnings: string[] }> = [];

  Object.values(loanTypes).forEach(loan => {
    let score = 50; // Base score
    const reasoning: string[] = [];
    const warnings: string[] = [];

    // Credit score fit
    if (profile.creditScore >= loan.minCreditScore) {
      score += 10;
      if (profile.creditScore >= 740) {
        score += 5;
        reasoning.push('Excellent credit qualifies for best rates');
      }
    } else {
      warnings.push(`Credit score ${profile.creditScore} below minimum ${loan.minCreditScore}`);
      return; // Don't recommend if doesn't qualify
    }

    // Down payment fit
    if (profile.downPaymentPercent >= loan.minDownPayment) {
      score += 10;
      if (profile.downPaymentPercent < 5 && loan.minDownPayment === 0) {
        score += 25;
        reasoning.push('No down payment required - ideal for limited savings');
      }
      if (profile.downPaymentPercent >= 20) {
        score += 10;
        reasoning.push('20%+ down avoids mortgage insurance');
      }
    } else {
      warnings.push(`Down payment ${profile.downPaymentPercent}% below minimum ${loan.minDownPayment}%`);
      return;
    }

    // DTI fit
    const dti = (profile.monthlyDebts / profile.monthlyIncome) * 100;
    if (dti <= loan.maxDTI) {
      score += 10;
      if (dti <= 36) {
        score += 5;
        reasoning.push('Strong DTI ratio under 36%');
      }
    } else {
      warnings.push(`DTI ${dti.toFixed(1)}% exceeds maximum ${loan.maxDTI}%`);
      return;
    }

    // Renovation need
    if (profile.propertyNeedsWork && loan.allowsRenovation) {
      score += 25;
      reasoning.push('Allows renovation financing - consolidate purchase and rehab into one loan');
      
      if (profile.renovationBudget > 75000 && loan.id === 'fha-203k-standard') {
        score += 20;
        reasoning.push(`Best for major renovations over $75k (your budget: $${profile.renovationBudget.toLocaleString()})`);
      } else if (profile.renovationBudget <= 75000 && loan.id === 'fha-203k-limited') {
        score += 20;
        reasoning.push('Streamlined process for repairs under $75k');
      } else if (loan.id === 'homestyle-renovation' && profile.creditScore >= 680) {
        score += 15;
        reasoning.push('Lower rates than FHA 203(k) with your strong credit');
      }
    } else if (profile.propertyNeedsWork && !loan.allowsRenovation) {
      score -= 25;
      warnings.push('Property needs work but this loan does not allow renovation financing');
    }

    // Units
    if (profile.units > loan.maxUnits) {
      warnings.push(`${profile.units}-unit property exceeds ${loan.maxUnits}-unit maximum`);
      return;
    }
    if (profile.units > 1 && loan.maxUnits >= profile.units) {
      score += 15;
      reasoning.push(`Supports ${profile.units}-unit house-hacking strategy`);
    }

    // Veteran status
    if (profile.isVeteran && loan.id === 'va-loan') {
      score += 35;
      reasoning.push('VA benefits: 0% down, no monthly MI, funding fee can be financed');
      reasoning.push('Assumable loan is valuable benefit in rising rate environment');
    }

    // Rural location
    if (profile.location.isRural && loan.id === 'usda-loan') {
      score += 30;
      reasoning.push('USDA eligible area: 0% down + low 0.35% annual fee');
      reasoning.push('Check USDA eligibility map to confirm property location');
    } else if (!profile.location.isRural && loan.id === 'usda-loan') {
      score -= 50;
      warnings.push('Property location not in USDA eligible area');
    }

    // First-time buyer
    if (profile.isFirstTimeBuyer) {
      if (loan.id.includes('fha') || loan.id === 'conventional') {
        score += 10;
        reasoning.push('First-time buyer friendly with down payment assistance available');
      }
    }

    // High property value (jumbo)
    if (profile.propertyValue > LOAN_LIMITS_2025.conventional.floor && loan.id === 'jumbo') {
      score += 25;
      reasoning.push(`Required for properties above $${LOAN_LIMITS_2025.conventional.floor.toLocaleString()}`);
    } else if (profile.propertyValue <= LOAN_LIMITS_2025.conventional.floor && loan.id === 'jumbo') {
      score -= 45;
      warnings.push('Property value under conforming limit - jumbo not needed');
    }

    // Better credit gets better loan options
    if (profile.creditScore >= 700 && (loan.id === 'conventional' || loan.id === 'homestyle-renovation')) {
      score += 15;
      reasoning.push('Excellent credit qualifies for best conventional rates (typically 0.25-0.50% lower than FHA)');
    }

    // Conventional is competitive if qualified
    if (loan.id === 'conventional' && profile.creditScore >= 680 && profile.downPaymentPercent >= 5) {
      score += 15;
      reasoning.push('Best overall rates and lowest total cost over life of loan');
      reasoning.push('PMI cancels automatically at 78% LTV (unlike FHA lifetime MIP)');
    }

    // Location-specific notes
    if (profile.location.state === 'SC' || profile.location.state === 'GA') {
      if (loan.id === 'va-loan') {
        warnings.push('Wood-destroying insect (termite) inspection required in SC/GA');
      }
      if (loan.id === 'fha-203k-standard' || loan.id === 'fha-203k-limited') {
        reasoning.push(`SC/GA FHA limit: $${LOAN_LIMITS_2025.fha.floor.toLocaleString()} (floor limit area)`);
      }
    }

    recommendations.push({ loanType: loan, score, reasoning, warnings });
  });

  // Sort by score descending and return top 5
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

// Export loan type categories for filtering
export const loanCategories = {
  renovation: ['fha-203k-standard', 'fha-203k-limited', 'homestyle-renovation'],
  lowDownPayment: ['fha-203k-standard', 'fha-203k-limited', 'fha-standard', 'va-loan', 'usda-loan'],
  conventional: ['conventional', 'homestyle-renovation', 'jumbo'],
  government: ['fha-203k-standard', 'fha-203k-limited', 'fha-standard', 'va-loan', 'usda-loan'],
  multiFamily: ['fha-203k-standard', 'fha-203k-limited', 'fha-standard', 'conventional', 'homestyle-renovation', 'va-loan', 'jumbo']
};

// Legal disclaimer - to be displayed throughout app
export const LEGAL_DISCLAIMER = `
IMPORTANT LEGAL DISCLAIMER:

The information provided by KAIDEN HouseHack is for educational and informational purposes only and does not constitute financial, legal, or tax advice. 

• Loan terms, interest rates, and eligibility requirements vary by lender, location, credit profile, and market conditions
• All data is subject to change based on HUD, FHA, FHFA, VA, and USDA updates
• Information is accurate as of January 2025 but should be verified with licensed mortgage professionals
• This is not a commitment to lend or an advertisement for credit
• Consult with licensed mortgage brokers, real estate attorneys, CPAs, and financial advisors for personalized guidance
• Actual loan approval and terms depend on full underwriting review

KAIDEN HouseHack is a software tool and educational platform. We are not a lender, broker, or financial advisor.

Data Sources: HUD Handbook 4000.1, FHFA Loan Limits 2025, VA Lender Handbook, USDA RD Handbook HB-1-3555, Fannie Mae Selling Guide.
`;