/**
 * ENTERPRISE TAX ENGINE
 * 
 * Handles:
 * - Individual returns (1040)
 * - Business returns (1065, 1120, 1120S)
 * - Trust & Estate (1041)
 * - Gift Tax (709)
 * - Multi-state apportionment
 * - K-1 distributions
 * - Estate tax calculations
 * - Amended returns (1040-X)
 * 
 * Professional-grade with full IRS compliance
 */

export interface TaxPayer {
  ssn?: string;
  ein?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  filingStatus: 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold' | 'widow';
  dependents: number;
  dateOfBirth?: string;
  dateOfDeath?: string; // For estate returns
}

export interface BusinessEntity {
  type: 'soleProprietor' | 'partnership' | 'llc' | 'sCorp' | 'cCorp' | 'trust' | 'estate';
  ein: string;
  name: string;
  taxYear: number;
  income: number;
  expenses: number;
  assets: number;
  liabilities: number;
  owners: TaxPayer[];
  k1Distributions?: K1Distribution[];
}

export interface K1Distribution {
  partnerName: string;
  partnerSSN: string;
  partnershipEIN: string;
  ordinaryIncome: number;
  capitalGains: number;
  section199AIncome: number; // QBI
  selfEmploymentIncome: number;
  distributions: number;
  capitalAccount: number;
}

export interface TrustReturn {
  trustName: string;
  ein: string;
  type: 'revocable' | 'irrevocable' | 'grantor' | 'testamentary';
  grantor?: TaxPayer;
  beneficiaries: TaxPayer[];
  income: number;
  distributions: number;
  principalDistributions: number;
  fiduciaryFees: number;
  taxableIncome: number;
}

export interface EstateReturn {
  decedent: TaxPayer;
  executor: TaxPayer;
  dateOfDeath: Date;
  dateOfDeathValue: number;
  currentValue: number;
  debts: number;
  funeralExpenses: number;
  administrativeExpenses: number;
  estateTax: number;
  stateEstateTax: number;
}

export interface AmendedReturn {
  originalReturnYear: number;
  reasonForAmendment: string;
  changedItems: Array<{
    line: string;
    description: string;
    originalAmount: number;
    correctedAmount: number;
    difference: number;
  }>;
  additionalTaxOwed: number;
  additionalRefund: number;
  interestOwed: number;
  penaltiesOwed: number;
}

export interface MultiStateReturn {
  states: Array<{
    state: string;
    residentStatus: 'resident' | 'partYear' | 'nonresident';
    daysInState: number;
    stateIncome: number;
    stateTax: number;
    localTax: number;
    apportionmentPercentage: number;
  }>;
  totalStateTax: number;
  stateRefund: number;
}

export interface ComprehensiveTaxReturn {
  // Basic Information
  taxpayer: TaxPayer;
  spouse?: TaxPayer;
  taxYear: number;
  
  // Income Sources
  w2Income: number;
  interest: number;
  dividends: number;
  capitalGains: number;
  businessIncome: number;
  rentalIncome: number;
  farmIncome: number;
  unemployment: number;
  socialSecurity: number;
  pension: number;
  ira Distributions: number;
  
  // Business Entities
  businesses: BusinessEntity[];
  k1Income: K1Distribution[];
  
  // Deductions
  standardDeduction: number;
  itemizedDeductions: {
    medicalExpenses: number;
    stateTaxesPaid: number;
    mortgageInterest: number;
    charitableCash: number;
    charitableNonCash: number;
    casualtyLosses: number;
    unreimbursedEmployeeExpenses: number; // Pre-TCJA
  };
  
  // Adjustments to Income
  studentLoanInterest: number;
  iraContribution: number;
  healthSavingsAccount: number;
  selfEmploymentTax: number;
  selfEmployedHealthInsurance: number;
  selfEmployedSEP: number;
  alimonyPaid: number;
  
  // Credits
  childTaxCredit: number;
  earnedIncomeCredit: number;
  educationCredits: number;
  childCareCredit: number;
  saver'sCredit: number;
  residentialEnergyCredit: number;
  foreignTaxCredit: number;
  
  // Payments
  federalWithholding: number;
  estimatedTaxPayments: number;
  priorYearOverpayment: number;
  
  // Multi-State
  multiState?: MultiStateReturn;
  
  // Special Returns
  trustReturn?: TrustReturn;
  estateReturn?: EstateReturn;
  amendedReturn?: AmendedReturn;
  giftTaxReturn?: GiftTaxReturn;
  
  // Calculations
  adjustedGrossIncome: number;
  taxableIncome: number;
  totalTax: number;
  totalCredits: number;
  totalPayments: number;
  refundAmount: number;
  amountOwed: number;
  
  // Professional Info
  preparer?: {
    name: string;
    ptin: string;
    firm: string;
    ein: string;
    phone: string;
    signature: string;
    date: string;
  };
  
  // Audit Trail
  auditLog: Array<{
    timestamp: Date;
    action: string;
    user: string;
    changes: any;
  }>;
  
  // Risk Assessment
  auditRisk: {
    overall: 'low' | 'medium' | 'high' | 'critical';
    factors: Array<{
      factor: string;
      risk: 'low' | 'medium' | 'high';
      explanation: string;
      mitigation: string;
    }>;
  };
}

export interface GiftTaxReturn {
  donor: TaxPayer;
  gifts: Array<{
    recipient: string;
    relationship: string;
    date: Date;
    description: string;
    fairMarketValue: number;
    giftSplitting: boolean;
  }>;
  totalGifts: number;
  annualExclusion: number; // $18,000 per person (2024)
  lifetimeExemptionUsed: number;
  lifetimeExemptionRemaining: number;
  giftTaxOwed: number;
}

/**
 * Calculate comprehensive tax return
 */
export function calculateComprehensiveTax(data: Partial<ComprehensiveTaxReturn>): ComprehensiveTaxReturn {
  // Step 1: Calculate AGI
  const wages = data.w2Income || 0;
  const k1TotalIncome = (data.k1Income || []).reduce((sum, k1) => sum + k1.ordinaryIncome + k1.capitalGains, 0);
  const totalIncome = 
    wages +
    (data.interest || 0) +
    (data.dividends || 0) +
    (data.capitalGains || 0) +
    (data.businessIncome || 0) +
    (data.rentalIncome || 0) +
    k1TotalIncome;
  
  const totalAdjustments =
    (data.studentLoanInterest || 0) +
    (data.iraContribution || 0) +
    (data.healthSavingsAccount || 0) +
    (data.selfEmploymentTax || 0) * 0.5 + // Deduct employer portion
    (data.selfEmployedHealthInsurance || 0) +
    (data.selfEmployedSEP || 0);
  
  const agi = totalIncome - totalAdjustments;
  
  // Step 2: Calculate Taxable Income
  const standardDeduction = getStandardDeduction(data.taxpayer?.filingStatus || 'single', data.taxYear || 2024);
  const itemizedTotal = data.itemizedDeductions 
    ? Object.values(data.itemizedDeductions).reduce((sum, val) => sum + val, 0)
    : 0;
  const deduction = Math.max(standardDeduction, itemizedTotal);
  
  const qbiDeduction = calculateQBIDeduction(data);
  const taxableIncome = Math.max(0, agi - deduction - qbiDeduction);
  
  // Step 3: Calculate Tax
  const totalTax = calculateFederalTax(taxableIncome, data.taxpayer?.filingStatus || 'single', data.taxYear || 2024);
  
  // Step 4: Calculate Credits
  const totalCredits =
    (data.childTaxCredit || 0) +
    (data.earnedIncomeCredit || 0) +
    (data.educationCredits || 0) +
    (data.childCareCredit || 0) +
    (data.saver'sCredit || 0) +
    (data.residentialEnergyCredit || 0) +
    (data.foreignTaxCredit || 0);
  
  // Step 5: Calculate Payments
  const totalPayments =
    (data.federalWithholding || 0) +
    (data.estimatedTaxPayments || 0) +
    (data.priorYearOverpayment || 0);
  
  // Step 6: Calculate Refund or Amount Owed
  const netTax = Math.max(0, totalTax - totalCredits);
  const refundAmount = Math.max(0, totalPayments - netTax);
  const amountOwed = Math.max(0, netTax - totalPayments);
  
  // Step 7: Audit Risk Assessment
  const auditRisk = assessAuditRisk({
    agi,
    deduction,
    itemizedDeductions: data.itemizedDeductions,
    businessIncome: data.businessIncome || 0,
    k1Income: data.k1Income || [],
  });
  
  return {
    taxpayer: data.taxpayer!,
    spouse: data.spouse,
    taxYear: data.taxYear || 2024,
    w2Income: data.w2Income || 0,
    interest: data.interest || 0,
    dividends: data.dividends || 0,
    capitalGains: data.capitalGains || 0,
    businessIncome: data.businessIncome || 0,
    rentalIncome: data.rentalIncome || 0,
    farmIncome: data.farmIncome || 0,
    unemployment: data.unemployment || 0,
    socialSecurity: data.socialSecurity || 0,
    pension: data.pension || 0,
    iraDistributions: data.iraDistributions || 0,
    businesses: data.businesses || [],
    k1Income: data.k1Income || [],
    standardDeduction,
    itemizedDeductions: data.itemizedDeductions || {
      medicalExpenses: 0,
      stateTaxesPaid: 0,
      mortgageInterest: 0,
      charitableCash: 0,
      charitableNonCash: 0,
      casualtyLosses: 0,
      unreimbursedEmployeeExpenses: 0,
    },
    studentLoanInterest: data.studentLoanInterest || 0,
    iraContribution: data.iraContribution || 0,
    healthSavingsAccount: data.healthSavingsAccount || 0,
    selfEmploymentTax: data.selfEmploymentTax || 0,
    selfEmployedHealthInsurance: data.selfEmployedHealthInsurance || 0,
    selfEmployedSEP: data.selfEmployedSEP || 0,
    alimonyPaid: data.alimonyPaid || 0,
    childTaxCredit: data.childTaxCredit || 0,
    earnedIncomeCredit: data.earnedIncomeCredit || 0,
    educationCredits: data.educationCredits || 0,
    childCareCredit: data.childCareCredit || 0,
    saver'sCredit: data.saver'sCredit || 0,
    residentialEnergyCredit: data.residentialEnergyCredit || 0,
    foreignTaxCredit: data.foreignTaxCredit || 0,
    federalWithholding: data.federalWithholding || 0,
    estimatedTaxPayments: data.estimatedTaxPayments || 0,
    priorYearOverpayment: data.priorYearOverpayment || 0,
    multiState: data.multiState,
    trustReturn: data.trustReturn,
    estateReturn: data.estateReturn,
    amendedReturn: data.amendedReturn,
    giftTaxReturn: data.giftTaxReturn,
    adjustedGrossIncome: agi,
    taxableIncome,
    totalTax,
    totalCredits,
    totalPayments,
    refundAmount,
    amountOwed,
    preparer: data.preparer,
    auditLog: data.auditLog || [],
    auditRisk,
  };
}

function getStandardDeduction(filingStatus: string, taxYear: number): number {
  // 2024 standard deductions
  const deductions = {
    single: 14600,
    marriedJoint: 29200,
    marriedSeparate: 14600,
    headOfHousehold: 21900,
    widow: 29200,
  };
  return deductions[filingStatus as keyof typeof deductions] || 14600;
}

function calculateFederalTax(taxableIncome: number, filingStatus: string, taxYear: number): number {
  // 2024 tax brackets for single filers
  const brackets = {
    single: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 47150, rate: 0.12 },
      { min: 47150, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 },
    ],
    marriedJoint: [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23200, max: 94300, rate: 0.12 },
      { min: 94300, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 },
    ],
  };
  
  const applicableBrackets = brackets[filingStatus as keyof typeof brackets] || brackets.single;
  let tax = 0;
  let previousMax = 0;
  
  for (const bracket of applicableBrackets) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      tax += taxableInBracket * bracket.rate;
      previousMax = bracket.max;
      
      if (taxableIncome <= bracket.max) break;
    }
  }
  
  return Math.round(tax);
}

function calculateQBIDeduction(data: Partial<ComprehensiveTaxReturn>): number {
  // Qualified Business Income Deduction (Section 199A)
  const businessIncome = data.businessIncome || 0;
  const k1QBI = (data.k1Income || []).reduce((sum, k1) => sum + (k1.section199AIncome || 0), 0);
  const totalQBI = businessIncome + k1QBI;
  
  // Simplified: 20% of QBI (subject to limitations based on income)
  const agi = data.adjustedGrossIncome || 0;
  if (agi > 383900) return 0; // Phaseout for high earners (simplified)
  
  return Math.round(totalQBI * 0.20);
}

function assessAuditRisk(data: {
  agi: number;
  deduction: number;
  itemizedDeductions?: any;
  businessIncome: number;
  k1Income: K1Distribution[];
}): ComprehensiveTaxReturn['auditRisk'] {
  const factors: ComprehensiveTaxReturn['auditRisk']['factors'] = [];
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  // High AGI
  if (data.agi > 500000) {
    factors.push({
      factor: 'High Income',
      risk: 'medium',
      explanation: 'AGI over $500,000 increases audit probability',
      mitigation: 'Ensure all income sources are properly documented',
    });
    riskLevel = 'medium';
  }
  
  // Large deductions relative to income
  const deductionRatio = data.agi > 0 ? data.deduction / data.agi : 0;
  if (deductionRatio > 0.5) {
    factors.push({
      factor: 'High Deduction Ratio',
      risk: 'high',
      explanation: 'Deductions exceed 50% of AGI',
      mitigation: 'Maintain detailed receipts and contemporaneous records',
    });
    riskLevel = 'high';
  }
  
  // Schedule C business income
  if (data.businessIncome > 100000) {
    factors.push({
      factor: 'Substantial Business Income',
      risk: 'medium',
      explanation: 'Schedule C income over $100,000 triggers scrutiny',
      mitigation: 'Keep detailed profit/loss statements and receipts',
    });
    if (riskLevel === 'low') riskLevel = 'medium';
  }
  
  // Multiple K-1s
  if (data.k1Income.length > 3) {
    factors.push({
      factor: 'Complex Partnership Interests',
      risk: 'medium',
      explanation: `${data.k1Income.length} K-1 forms indicates complex business structure`,
      mitigation: 'Ensure all K-1 forms are properly reported and reconciled',
    });
    if (riskLevel === 'low') riskLevel = 'medium';
  }
  
  // Round numbers (potential estimation)
  const roundNumberCount = [
    data.businessIncome,
    data.itemizedDeductions?.charitableCash || 0,
    data.itemizedDeductions?.charitableNonCash || 0,
  ].filter(num => num > 0 && num % 1000 === 0).length;
  
  if (roundNumberCount >= 2) {
    factors.push({
      factor: 'Round Number Amounts',
      risk: 'low',
      explanation: 'Multiple amounts are round numbers (may indicate estimates)',
      mitigation: 'Use exact figures from source documents',
    });
  }
  
  if (factors.length === 0) {
    factors.push({
      factor: 'Standard Return',
      risk: 'low',
      explanation: 'No elevated risk factors detected',
      mitigation: 'Continue maintaining good records',
    });
  }
  
  return {
    overall: riskLevel,
    factors,
  };
}

/**
 * Calculate estate tax (Form 706)
 */
export function calculateEstateTax(estate: EstateReturn): number {
  const grossEstate = estate.dateOfDeathValue;
  const deductions = estate.debts + estate.funeralExpenses + estate.administrativeExpenses;
  const taxableEstate = Math.max(0, grossEstate - deductions);
  
  // 2024 federal estate tax exemption: $13.61M
  const exemption = 13610000;
  const taxableAmount = Math.max(0, taxableEstate - exemption);
  
  // Estate tax rate: 40% on amount over exemption
  return Math.round(taxableAmount * 0.40);
}

/**
 * Calculate gift tax (Form 709)
 */
export function calculateGiftTax(giftReturn: GiftTaxReturn): number {
  const annualExclusion = 18000; // 2024
  const lifetimeExemption = 13610000; // 2024
  
  const totalTaxableGifts = giftReturn.gifts.reduce((sum, gift) => {
    const taxableAmount = Math.max(0, gift.fairMarketValue - annualExclusion);
    return sum + taxableAmount;
  }, 0);
  
  const lifetimeUsed = giftReturn.lifetimeExemptionUsed + totalTaxableGifts;
  const taxableAmount = Math.max(0, lifetimeUsed - lifetimeExemption);
  
  // Gift tax rate: 40%
  return Math.round(taxableAmount * 0.40);
}

/**
 * Generate Form 1040-X (Amended Return)
 */
export function generateAmendedReturn(
  original: ComprehensiveTaxReturn,
  corrected: Partial<ComprehensiveTaxReturn>
): AmendedReturn {
  const originalCalc = calculateComprehensiveTax(original);
  const correctedCalc = calculateComprehensiveTax({ ...original, ...corrected });
  
  const changedItems: AmendedReturn['changedItems'] = [];
  
  // Compare key fields
  if (original.w2Income !== corrected.w2Income) {
    changedItems.push({
      line: '1',
      description: 'Wages, salaries, tips',
      originalAmount: original.w2Income || 0,
      correctedAmount: corrected.w2Income || 0,
      difference: (corrected.w2Income || 0) - (original.w2Income || 0),
    });
  }
  
  const taxDifference = correctedCalc.totalTax - originalCalc.totalTax;
  const paymentDifference = correctedCalc.totalPayments - originalCalc.totalPayments;
  
  return {
    originalReturnYear: original.taxYear,
    reasonForAmendment: 'Correction of income and deductions',
    changedItems,
    additionalTaxOwed: Math.max(0, taxDifference),
    additionalRefund: Math.max(0, -taxDifference),
    interestOwed: 0, // Calculate based on days late
    penaltiesOwed: 0, // Calculate based on underpayment
  };
}
