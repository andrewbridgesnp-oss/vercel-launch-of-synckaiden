import { getDb } from '../db';
import { invokeLLM } from '../_core/llm';

export interface TaxReturn {
  id: number;
  userId: number;
  taxYear: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
  status: 'draft' | 'in_progress' | 'review' | 'filed' | 'accepted' | 'rejected';
  federalRefund: number;
  stateRefund: number;
  filedDate: Date | null;
  dueDate: Date;
}

export interface TaxDocument {
  id: number;
  userId: number;
  taxYear: number;
  type: 'W2' | '1099' | '1098' | 'K1' | 'other';
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  processed: boolean;
}

export interface TaxDeduction {
  category: string;
  amount: number;
  description: string;
  eligible: boolean;
}

export interface TaxEstimate {
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  estimatedRefund: number;
  deductions: TaxDeduction[];
}

/**
 * Get user's tax returns
 */
export async function getUserTaxReturns(userId: number): Promise<TaxReturn[]> {
  return [
    {
      id: 1,
      userId,
      taxYear: 2025,
      filingStatus: 'single',
      status: 'filed',
      federalRefund: 1250.00,
      stateRefund: 350.00,
      filedDate: new Date('2026-03-15'),
      dueDate: new Date('2026-04-15'),
    },
    {
      id: 2,
      userId,
      taxYear: 2026,
      filingStatus: 'single',
      status: 'in_progress',
      federalRefund: 0,
      stateRefund: 0,
      filedDate: null,
      dueDate: new Date('2027-04-15'),
    },
  ];
}

/**
 * Create a new tax return
 */
export async function createTaxReturn(params: {
  userId: number;
  taxYear: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
}): Promise<TaxReturn> {
  const dueDate = new Date(`${params.taxYear + 1}-04-15`);
  
  return {
    id: Date.now(),
    userId: params.userId,
    taxYear: params.taxYear,
    filingStatus: params.filingStatus,
    status: 'draft',
    federalRefund: 0,
    stateRefund: 0,
    filedDate: null,
    dueDate,
  };
}

/**
 * Get uploaded tax documents
 */
export async function getTaxDocuments(userId: number, taxYear?: number): Promise<TaxDocument[]> {
  const docs = [
    {
      id: 1,
      userId,
      taxYear: 2025,
      type: 'W2' as const,
      fileName: 'W2-2025.pdf',
      fileUrl: '/uploads/w2-2025.pdf',
      uploadedAt: new Date('2026-01-15'),
      processed: true,
    },
    {
      id: 2,
      userId,
      taxYear: 2025,
      type: '1099' as const,
      fileName: '1099-MISC-2025.pdf',
      fileUrl: '/uploads/1099-2025.pdf',
      uploadedAt: new Date('2026-01-20'),
      processed: true,
    },
  ];

  return taxYear ? docs.filter(d => d.taxYear === taxYear) : docs;
}

/**
 * Calculate tax estimate
 */
export async function calculateTaxEstimate(params: {
  userId: number;
  income: number;
  filingStatus: string;
  deductions?: Array<{ category: string; amount: number }>;
  state?: string;
}): Promise<TaxEstimate> {
  const { income, filingStatus, deductions = [], state = 'CA' } = params;

  // Standard deduction amounts for 2026 (simplified)
  const standardDeductions: Record<string, number> = {
    single: 14600,
    married_joint: 29200,
    married_separate: 14600,
    head_of_household: 21900,
  };

  const standardDeduction = standardDeductions[filingStatus] || 14600;
  const itemizedDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const totalDeductions = Math.max(standardDeduction, itemizedDeductions);
  const taxableIncome = Math.max(0, income - totalDeductions);

  // Simplified federal tax brackets for 2026 (single filer)
  let federalTax = 0;
  if (taxableIncome <= 11600) {
    federalTax = taxableIncome * 0.10;
  } else if (taxableIncome <= 47150) {
    federalTax = 1160 + (taxableIncome - 11600) * 0.12;
  } else if (taxableIncome <= 100525) {
    federalTax = 5426 + (taxableIncome - 47150) * 0.22;
  } else if (taxableIncome <= 191950) {
    federalTax = 17168.50 + (taxableIncome - 100525) * 0.24;
  } else {
    federalTax = 39110.50 + (taxableIncome - 191950) * 0.32;
  }

  // Simplified state tax (CA example: ~9.3% top rate)
  const stateTax = taxableIncome * 0.05; // Simplified average

  const totalTax = federalTax + stateTax;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  // Estimate refund (assuming withholding was 110% of tax)
  const estimatedWithholding = totalTax * 1.10;
  const estimatedRefund = estimatedWithholding - totalTax;

  return {
    taxableIncome,
    federalTax,
    stateTax,
    totalTax,
    effectiveRate,
    estimatedRefund,
    deductions: deductions.map(d => ({
      ...d,
      description: d.category,
      eligible: true,
    })),
  };
}

/**
 * Get AI tax advice
 */
export async function getTaxAdvice(params: {
  userId: number;
  question: string;
  context?: {
    income?: number;
    filingStatus?: string;
    state?: string;
  };
}): Promise<{ advice: string; references: string[] }> {
  const contextStr = params.context
    ? `\nUser Context:\n- Income: $${params.context.income}\n- Filing Status: ${params.context.filingStatus}\n- State: ${params.context.state}`
    : '';

  const prompt = `${params.question}${contextStr}

Provide accurate tax advice based on current IRS regulations. Include relevant tax code references.`;

  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: 'You are a certified tax professional. Provide accurate, helpful tax advice. Always remind users to consult with a licensed tax professional for their specific situation.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const advice = typeof rawContent === 'string' ? rawContent : '';

  return {
    advice,
    references: [
      'IRS Publication 17 (Your Federal Income Tax)',
      'IRS Publication 501 (Dependents, Standard Deduction, and Filing Information)',
      'IRS Tax Code Section 162 (Trade or Business Expenses)',
    ],
  };
}

/**
 * Find eligible deductions
 */
export async function findEligibleDeductions(params: {
  userId: number;
  income: number;
  expenses: Array<{ category: string; amount: number; description: string }>;
}): Promise<TaxDeduction[]> {
  const { expenses } = params;

  // Common deductible categories
  const deductibleCategories = [
    'Home Office',
    'Business Travel',
    'Professional Development',
    'Charitable Donations',
    'Medical Expenses',
    'State and Local Taxes',
    'Mortgage Interest',
    'Student Loan Interest',
  ];

  return expenses
    .filter(exp => deductibleCategories.some(cat => exp.category.includes(cat)))
    .map(exp => ({
      category: exp.category,
      amount: exp.amount,
      description: exp.description,
      eligible: true,
    }));
}

/**
 * Generate tax filing checklist
 */
export async function getTaxFilingChecklist(userId: number, taxYear: number): Promise<{
  items: Array<{
    category: string;
    description: string;
    completed: boolean;
    required: boolean;
  }>;
  completionPercentage: number;
}> {
  const items = [
    {
      category: 'Income Documents',
      description: 'Upload W-2 forms from all employers',
      completed: true,
      required: true,
    },
    {
      category: 'Income Documents',
      description: 'Upload 1099 forms (if applicable)',
      completed: true,
      required: false,
    },
    {
      category: 'Deductions',
      description: 'Gather receipts for charitable donations',
      completed: false,
      required: false,
    },
    {
      category: 'Deductions',
      description: 'Collect mortgage interest statements (1098)',
      completed: false,
      required: false,
    },
    {
      category: 'Filing',
      description: 'Review and confirm personal information',
      completed: false,
      required: true,
    },
    {
      category: 'Filing',
      description: 'Choose filing status',
      completed: true,
      required: true,
    },
    {
      category: 'Payment',
      description: 'Set up direct deposit for refund',
      completed: false,
      required: false,
    },
  ];

  const completed = items.filter(i => i.completed).length;
  const completionPercentage = (completed / items.length) * 100;

  return {
    items,
    completionPercentage,
  };
}

/**
 * Estimate quarterly tax payments (for self-employed)
 */
export async function calculateQuarterlyTaxes(params: {
  userId: number;
  estimatedAnnualIncome: number;
  filingStatus: string;
}): Promise<{
  quarterlyPayment: number;
  dueDates: Array<{ quarter: string; dueDate: string; amount: number }>;
  totalAnnualTax: number;
}> {
  const estimate = await calculateTaxEstimate({
    userId: params.userId,
    income: params.estimatedAnnualIncome,
    filingStatus: params.filingStatus,
  });

  // Add self-employment tax (15.3% of 92.35% of net earnings)
  const selfEmploymentTax = params.estimatedAnnualIncome * 0.9235 * 0.153;
  const totalAnnualTax = estimate.totalTax + selfEmploymentTax;
  const quarterlyPayment = totalAnnualTax / 4;

  const currentYear = new Date().getFullYear();
  const dueDates = [
    { quarter: 'Q1', dueDate: `${currentYear}-04-15`, amount: quarterlyPayment },
    { quarter: 'Q2', dueDate: `${currentYear}-06-15`, amount: quarterlyPayment },
    { quarter: 'Q3', dueDate: `${currentYear}-09-15`, amount: quarterlyPayment },
    { quarter: 'Q4', dueDate: `${currentYear + 1}-01-15`, amount: quarterlyPayment },
  ];

  return {
    quarterlyPayment,
    dueDates,
    totalAnnualTax,
  };
}

/**
 * Analyze tax-saving opportunities
 */
export async function analyzeTaxSavings(params: {
  userId: number;
  income: number;
  currentDeductions: number;
}): Promise<{
  potentialSavings: number;
  recommendations: Array<{
    strategy: string;
    estimatedSavings: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}> {
  const recommendations = [
    {
      strategy: 'Max out 401(k) contributions',
      estimatedSavings: 5000,
      difficulty: 'easy' as const,
    },
    {
      strategy: 'Open and fund an HSA',
      estimatedSavings: 1200,
      difficulty: 'easy' as const,
    },
    {
      strategy: 'Increase charitable donations',
      estimatedSavings: 800,
      difficulty: 'medium' as const,
    },
    {
      strategy: 'Establish a home office deduction',
      estimatedSavings: 1500,
      difficulty: 'medium' as const,
    },
  ];

  const potentialSavings = recommendations.reduce((sum, r) => sum + r.estimatedSavings, 0);

  return {
    potentialSavings,
    recommendations,
  };
}
