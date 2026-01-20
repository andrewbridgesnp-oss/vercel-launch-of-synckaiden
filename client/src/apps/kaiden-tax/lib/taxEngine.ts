/**
 * KAIDEN Tax Calculation Engine
 * Professional-grade tax calculations for Federal & State taxes
 */

// 2024 Tax Year Constants
export const TAX_YEAR = 2024;

// Federal Tax Brackets 2024 (Single)
export const FEDERAL_TAX_BRACKETS_SINGLE = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 }
];

// Federal Tax Brackets 2024 (Married Filing Jointly)
export const FEDERAL_TAX_BRACKETS_JOINT = [
  { min: 0, max: 23200, rate: 0.10 },
  { min: 23200, max: 94300, rate: 0.12 },
  { min: 94300, max: 201050, rate: 0.22 },
  { min: 201050, max: 383900, rate: 0.24 },
  { min: 383900, max: 487450, rate: 0.32 },
  { min: 487450, max: 731200, rate: 0.35 },
  { min: 731200, max: Infinity, rate: 0.37 }
];

// Standard Deductions 2024
export const STANDARD_DEDUCTIONS = {
  single: 14600,
  marriedJoint: 29200,
  marriedSeparate: 14600,
  headOfHousehold: 21900
};

// Retirement Contribution Limits 2024
export const CONTRIBUTION_LIMITS = {
  traditional401k: 23000,
  catchUp401k: 7500, // Age 50+
  ira: 7000,
  catchUpIRA: 1000, // Age 50+
  sep: 69000,
  simple: 16000
};

// State Tax Rates (simplified - top marginal rates)
export const STATE_TAX_RATES: Record<string, number> = {
  CA: 0.133, // California
  NY: 0.109, // New York
  NJ: 0.1075, // New Jersey
  HI: 0.11, // Hawaii
  OR: 0.099, // Oregon
  MN: 0.0985, // Minnesota
  DC: 0.1075, // District of Columbia
  VT: 0.0875, // Vermont
  IA: 0.085, // Iowa
  WI: 0.0765, // Wisconsin
  TX: 0, // No state income tax
  FL: 0, // No state income tax
  WA: 0, // No state income tax
  NV: 0, // No state income tax
  WY: 0, // No state income tax
  SD: 0, // No state income tax
  TN: 0, // No state income tax
  AK: 0, // No state income tax
  NH: 0, // No state income tax (only dividends/interest)
};

export interface TaxReturn {
  filingStatus: 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold';
  income: {
    wages: number;
    selfEmployment: number;
    interest: number;
    dividends: {
      qualified: number;
      ordinary: number;
    };
    capitalGains: {
      shortTerm: number;
      longTerm: number;
    };
    rentalIncome: number;
    retirement: number;
    other: number;
  };
  deductions: {
    method: 'standard' | 'itemized';
    mortgageInterest: number;
    propertyTax: number;
    stateLocalTax: number;
    charitableCash: number;
    charitableNonCash: number;
    medicalExpenses: number;
    other: number;
  };
  adjustments: {
    traditionalIRA: number;
    studentLoanInterest: number;
    hsaContribution: number;
    selfEmploymentTax: number;
    other: number;
  };
  credits: {
    childTaxCredit: number;
    earnedIncomeCredit: number;
    educationCredit: number;
    other: number;
  };
  dependents: number;
  age: number;
  state: string;
}

export interface TaxResult {
  grossIncome: number;
  adjustedGrossIncome: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  credits: number;
  refundOrOwed: number;
  federalRefund: number;
  stateRefund: number;
  withholding: number;
  breakdown: {
    bracket: string;
    income: number;
    tax: number;
    rate: number;
  }[];
  deductions: {
    type: 'standard' | 'itemized';
    amount: number;
  };
  optimizations: TaxOptimization[];
}

export interface TaxOptimization {
  id: string;
  category: 'retirement' | 'deduction' | 'credit' | 'timing' | 'entity';
  title: string;
  description: string;
  potentialSavings: number;
  confidence: 'high' | 'medium' | 'low';
  actionItems: string[];
}

/**
 * Calculate Federal Tax using marginal brackets
 */
export function calculateFederalTax(taxableIncome: number, filingStatus: string): { tax: number; breakdown: any[] } {
  const brackets = filingStatus === 'marriedJoint' ? FEDERAL_TAX_BRACKETS_JOINT : FEDERAL_TAX_BRACKETS_SINGLE;
  
  let totalTax = 0;
  const breakdown = [];
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const previousMax = i > 0 ? brackets[i - 1].max : 0;
    
    if (taxableIncome > bracket.min) {
      const incomeInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      const taxInBracket = incomeInBracket * bracket.rate;
      totalTax += taxInBracket;
      
      breakdown.push({
        bracket: `${(bracket.rate * 100).toFixed(0)}%`,
        income: incomeInBracket,
        tax: taxInBracket,
        rate: bracket.rate
      });
      
      if (taxableIncome <= bracket.max) break;
    }
  }
  
  return { tax: totalTax, breakdown };
}

/**
 * Calculate Self-Employment Tax (Social Security + Medicare)
 */
export function calculateSelfEmploymentTax(selfEmploymentIncome: number): number {
  const netEarnings = selfEmploymentIncome * 0.9235; // 92.35% of SE income
  
  // Social Security: 12.4% up to $168,600 (2024)
  const ssWageBase = 168600;
  const ssTax = Math.min(netEarnings, ssWageBase) * 0.124;
  
  // Medicare: 2.9% on all earnings
  const medicareTax = netEarnings * 0.029;
  
  // Additional Medicare: 0.9% on earnings over $200,000
  const additionalMedicare = netEarnings > 200000 
    ? (netEarnings - 200000) * 0.009 
    : 0;
  
  return ssTax + medicareTax + additionalMedicare;
}

/**
 * Calculate State Tax (simplified top marginal rate)
 */
export function calculateStateTax(taxableIncome: number, state: string): number {
  const stateRate = STATE_TAX_RATES[state] || 0.05; // Default 5% if state not found
  return taxableIncome * stateRate;
}

/**
 * Calculate Total Itemized Deductions
 */
export function calculateItemizedDeductions(deductions: TaxReturn['deductions']): number {
  // SALT cap: $10,000
  const saltDeduction = Math.min(10000, deductions.propertyTax + deductions.stateLocalTax);
  
  return (
    deductions.mortgageInterest +
    saltDeduction +
    deductions.charitableCash +
    deductions.charitableNonCash +
    deductions.medicalExpenses +
    deductions.other
  );
}

/**
 * Main Tax Calculation Engine
 */
export function calculateTax(taxReturn: TaxReturn, federalWithholding: number = 0, stateWithholding: number = 0): TaxResult {
  // 1. Calculate Gross Income
  const grossIncome = 
    taxReturn.income.wages +
    taxReturn.income.selfEmployment +
    taxReturn.income.interest +
    taxReturn.income.dividends.qualified +
    taxReturn.income.dividends.ordinary +
    taxReturn.income.capitalGains.shortTerm +
    taxReturn.income.capitalGains.longTerm +
    taxReturn.income.rentalIncome +
    taxReturn.income.retirement +
    taxReturn.income.other;

  // 2. Calculate Self-Employment Tax
  const selfEmploymentTax = taxReturn.income.selfEmployment > 0 
    ? calculateSelfEmploymentTax(taxReturn.income.selfEmployment)
    : 0;

  // 3. Calculate Adjustments (Above-the-line deductions)
  const totalAdjustments = 
    taxReturn.adjustments.traditionalIRA +
    taxReturn.adjustments.studentLoanInterest +
    taxReturn.adjustments.hsaContribution +
    (selfEmploymentTax * 0.5) + // Deductible portion of SE tax
    taxReturn.adjustments.other;

  // 4. Calculate AGI
  const adjustedGrossIncome = grossIncome - totalAdjustments;

  // 5. Calculate Deductions
  const standardDeduction = STANDARD_DEDUCTIONS[taxReturn.filingStatus];
  const itemizedDeduction = calculateItemizedDeductions(taxReturn.deductions);
  
  const deductionAmount = taxReturn.deductions.method === 'itemized'
    ? Math.max(itemizedDeduction, standardDeduction)
    : standardDeduction;
  
  const deductionType = deductionAmount === standardDeduction ? 'standard' : 'itemized';

  // 6. Calculate Taxable Income
  const taxableIncome = Math.max(0, adjustedGrossIncome - deductionAmount);

  // 7. Calculate Federal Tax
  const { tax: federalTax, breakdown } = calculateFederalTax(taxableIncome, taxReturn.filingStatus);

  // 8. Calculate Tax Credits
  const totalCredits = 
    taxReturn.credits.childTaxCredit +
    taxReturn.credits.earnedIncomeCredit +
    taxReturn.credits.educationCredit +
    taxReturn.credits.other;

  // 9. Calculate net federal tax after credits
  const federalTaxAfterCredits = Math.max(0, federalTax - totalCredits);

  // 10. Calculate State Tax
  const stateTax = calculateStateTax(taxableIncome, taxReturn.state);

  // 11. Calculate Total Tax
  const totalTax = federalTaxAfterCredits + stateTax + selfEmploymentTax;

  // 12. Calculate Effective Rate
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  // 13. Calculate Marginal Rate
  const brackets = taxReturn.filingStatus === 'marriedJoint' 
    ? FEDERAL_TAX_BRACKETS_JOINT 
    : FEDERAL_TAX_BRACKETS_SINGLE;
  const marginalBracket = brackets.find(b => taxableIncome >= b.min && taxableIncome < b.max);
  const marginalRate = marginalBracket ? marginalBracket.rate * 100 : 37;

  // 14. Calculate Refund or Amount Owed
  const totalWithholding = federalWithholding + stateWithholding;
  const refundOrOwed = totalWithholding - totalTax;
  const federalRefund = federalWithholding - federalTaxAfterCredits;
  const stateRefund = stateWithholding - stateTax;

  // 15. Generate Tax Optimizations
  const optimizations = generateOptimizations(taxReturn, adjustedGrossIncome, taxableIncome);

  return {
    grossIncome,
    adjustedGrossIncome,
    taxableIncome,
    federalTax: federalTaxAfterCredits,
    stateTax,
    selfEmploymentTax,
    totalTax,
    effectiveRate,
    marginalRate,
    credits: totalCredits,
    refundOrOwed,
    federalRefund,
    stateRefund,
    withholding: totalWithholding,
    breakdown,
    deductions: {
      type: deductionType,
      amount: deductionAmount
    },
    optimizations
  };
}

/**
 * Generate tax optimization recommendations
 */
function generateOptimizations(
  taxReturn: TaxReturn, 
  agi: number, 
  taxableIncome: number
): TaxOptimization[] {
  const optimizations: TaxOptimization[] = [];

  // IRA Contribution Optimization
  const currentIRA = taxReturn.adjustments.traditionalIRA;
  const iraLimit = taxReturn.age >= 50 
    ? CONTRIBUTION_LIMITS.ira + CONTRIBUTION_LIMITS.catchUpIRA 
    : CONTRIBUTION_LIMITS.ira;
  
  if (currentIRA < iraLimit && agi > 30000) {
    const additionalContribution = iraLimit - currentIRA;
    const potentialSavings = additionalContribution * (taxReturn.filingStatus === 'marriedJoint' ? 0.22 : 0.24);
    
    optimizations.push({
      id: 'ira-max',
      category: 'retirement',
      title: 'Maximize Traditional IRA Contribution',
      description: `You can contribute an additional $${additionalContribution.toLocaleString()} to your Traditional IRA for ${TAX_YEAR}.`,
      potentialSavings: Math.round(potentialSavings),
      confidence: 'high',
      actionItems: [
        'Open or contribute to a Traditional IRA before tax deadline',
        'Ensure your income is within IRA deduction limits',
        'Consider Roth IRA if income exceeds traditional IRA limits'
      ]
    });
  }

  // HSA Contribution
  if (taxReturn.adjustments.hsaContribution === 0 && agi > 40000) {
    const hsaLimit = taxReturn.filingStatus === 'marriedJoint' ? 8300 : 4150;
    const potentialSavings = hsaLimit * 0.22;
    
    optimizations.push({
      id: 'hsa-contribute',
      category: 'deduction',
      title: 'Health Savings Account (HSA)',
      description: `With a high-deductible health plan, you could contribute up to $${hsaLimit.toLocaleString()} to an HSA.`,
      potentialSavings: Math.round(potentialSavings),
      confidence: 'medium',
      actionItems: [
        'Verify you have a qualifying high-deductible health plan',
        'Open an HSA account if you don\'t have one',
        'Contribute pre-tax dollars to reduce taxable income'
      ]
    });
  }

  // Itemized vs Standard Deduction
  const itemizedTotal = calculateItemizedDeductions(taxReturn.deductions);
  const standardDeduction = STANDARD_DEDUCTIONS[taxReturn.filingStatus];
  
  if (taxReturn.deductions.method === 'standard' && itemizedTotal > standardDeduction * 0.8) {
    optimizations.push({
      id: 'itemize-review',
      category: 'deduction',
      title: 'Consider Itemizing Deductions',
      description: `Your itemized deductions ($${Math.round(itemizedTotal).toLocaleString()}) are close to the standard deduction. Review potential missed deductions.`,
      potentialSavings: Math.round((itemizedTotal - standardDeduction) * 0.22),
      confidence: 'medium',
      actionItems: [
        'Gather receipts for charitable donations',
        'Calculate state and local taxes paid',
        'Review medical expenses (must exceed 7.5% of AGI)',
        'Check mortgage interest statements'
      ]
    });
  }

  // Tax Bracket Management
  const brackets = taxReturn.filingStatus === 'marriedJoint' 
    ? FEDERAL_TAX_BRACKETS_JOINT 
    : FEDERAL_TAX_BRACKETS_SINGLE;
  
  const currentBracket = brackets.find(b => taxableIncome >= b.min && taxableIncome < b.max);
  if (currentBracket && taxableIncome > currentBracket.max - 5000) {
    const nextBracket = brackets[brackets.indexOf(currentBracket) + 1];
    if (nextBracket) {
      const amountToNextBracket = currentBracket.max - taxableIncome;
      optimizations.push({
        id: 'bracket-management',
        category: 'timing',
        title: 'Tax Bracket Threshold Alert',
        description: `You're $${Math.round(amountToNextBracket).toLocaleString()} away from the next tax bracket (${(nextBracket.rate * 100).toFixed(0)}%). Consider deferring income or increasing deductions.`,
        potentialSavings: Math.round(amountToNextBracket * (nextBracket.rate - currentBracket.rate)),
        confidence: 'high',
        actionItems: [
          'Defer year-end bonus to next year if possible',
          'Accelerate deductible expenses into this year',
          'Make additional retirement contributions',
          'Consider tax-loss harvesting for investments'
        ]
      });
    }
  }

  return optimizations;
}

/**
 * Calculate estimated quarterly tax payments
 */
export function calculateQuarterlyPayments(estimatedAnnualTax: number): {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
} {
  const quarterlyAmount = estimatedAnnualTax / 4;
  return {
    q1: quarterlyAmount,
    q2: quarterlyAmount,
    q3: quarterlyAmount,
    q4: quarterlyAmount
  };
}

/**
 * Simplified tax calculation for real-time refund tracking
 * Used by RealtimeRefundTracker component
 */
export function calculateTaxReturn(simpleData: {
  filingStatus: string;
  income: number;
  federalWithholding: number;
  stateWithholding: number;
  deductions?: any;
  credits?: any;
}): { federalRefund: number; stateRefund: number } {
  // Handle zero/missing income
  if (!simpleData.income || simpleData.income <= 0) {
    return {
      federalRefund: simpleData.federalWithholding || 0,
      stateRefund: simpleData.stateWithholding || 0,
    };
  }

  // Build a full TaxReturn object from simplified data
  const taxReturn: TaxReturn = {
    filingStatus: (simpleData.filingStatus || 'single') as any,
    income: {
      wages: simpleData.income,
      selfEmployment: 0,
      interest: 0,
      dividends: { qualified: 0, ordinary: 0 },
      capitalGains: { shortTerm: 0, longTerm: 0 },
      rentalIncome: 0,
      retirement: 0,
      other: 0,
    },
    adjustments: {
      traditionalIRA: 0,
      studentLoanInterest: simpleData.deductions?.studentLoanInterest || 0,
      hsaContribution: 0,
      selfEmploymentTax: 0,
      other: 0,
    },
    deductions: {
      method: (simpleData.deductions?.standard !== false ? 'standard' : 'itemized') as any,
      propertyTax: 0,
      stateLocalTax: simpleData.deductions?.stateLocalTaxes || 0,
      mortgageInterest: 0,
      charitableCash: simpleData.deductions?.charitableContributions || 0,
      charitableNonCash: 0,
      medicalExpenses: simpleData.deductions?.medicalExpenses || 0,
      other: simpleData.deductions?.itemized || 0,
    },
    credits: {
      childTaxCredit: simpleData.credits?.childTaxCredit || 0,
      earnedIncomeCredit: simpleData.credits?.earnedIncomeCredit || 0,
      educationCredit: simpleData.credits?.educationCredits || 0,
      other: 0,
    },
    dependents: 0,
    age: 35,
    state: 'CA', // Default to California
  };

  // Calculate full tax return
  const result = calculateTax(
    taxReturn, 
    simpleData.federalWithholding || 0,
    simpleData.stateWithholding || 0
  );

  // Return simplified result
  return {
    federalRefund: result.federalRefund,
    stateRefund: result.stateRefund,
  };
}
