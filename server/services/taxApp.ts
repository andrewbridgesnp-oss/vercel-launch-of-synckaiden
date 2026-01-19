import { getDb } from '../db';
import { taxReturns, taxDocuments, taxDeductions, taxEstimates } from '../../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
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
  const db = getDb();
  const returns = await db
    .select()
    .from(taxReturns)
    .where(eq(taxReturns.userId, userId))
    .orderBy(desc(taxReturns.taxYear));
  
  return returns.map(r => ({
    ...r,
    federalRefund: r.federalRefund || 0,
    stateRefund: r.stateRefund || 0,
  }));
}

/**
 * Create a new tax return
 */
export async function createTaxReturn(params: {
  userId: number;
  taxYear: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
}): Promise<TaxReturn> {
  const db = getDb();
  const dueDate = new Date(`${params.taxYear + 1}-04-15`);
  
  const [newReturn] = await db.insert(taxReturns).values({
    userId: params.userId,
    taxYear: params.taxYear,
    filingStatus: params.filingStatus,
    status: 'draft',
    federalRefund: 0,
    stateRefund: 0,
    filedDate: null,
    dueDate,
  });
  
  const [created] = await db
    .select()
    .from(taxReturns)
    .where(eq(taxReturns.id, newReturn.insertId))
    .limit(1);
  
  return {
    ...created,
    federalRefund: created.federalRefund || 0,
    stateRefund: created.stateRefund || 0,
  };
}

/**
 * Get uploaded tax documents
 */
export async function getTaxDocuments(userId: number, taxYear?: number): Promise<TaxDocument[]> {
  const db = getDb();
  
  let query = db
    .select()
    .from(taxDocuments)
    .where(eq(taxDocuments.userId, userId));
  
  if (taxYear) {
    query = query.where(and(
      eq(taxDocuments.userId, userId),
      eq(taxDocuments.taxYear, taxYear)
    ));
  }
  
  const docs = await query.orderBy(desc(taxDocuments.uploadedAt));
  
  return docs.map(doc => ({
    id: doc.id,
    userId: doc.userId,
    taxYear: doc.taxYear,
    type: doc.type as 'W2' | '1099' | '1098' | 'K1' | 'other',
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    uploadedAt: doc.uploadedAt,
    processed: doc.processed || false,
  }));
}

/**
 * Calculate tax estimate using AI and tax brackets
 */
export async function calculateTaxEstimate(params: {
  userId: number;
  income: number;
  filingStatus: string;
  deductions?: Array<{ category: string; amount: number }>;
  state?: string;
}): Promise<TaxEstimate> {
  const db = getDb();
  
  // Calculate standard deduction based on filing status
  const standardDeductions: Record<string, number> = {
    single: 14600,
    married_joint: 29200,
    married_separate: 14600,
    head_of_household: 21900,
  };
  
  const standardDeduction = standardDeductions[params.filingStatus] || 14600;
  const totalItemizedDeductions = params.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const deductionAmount = Math.max(standardDeduction, totalItemizedDeductions);
  
  const taxableIncome = Math.max(0, params.income - deductionAmount);
  
  // 2026 Federal Tax Brackets (simplified)
  let federalTax = 0;
  if (taxableIncome > 0) {
    if (taxableIncome <= 11600) {
      federalTax = taxableIncome * 0.10;
    } else if (taxableIncome <= 47150) {
      federalTax = 1160 + (taxableIncome - 11600) * 0.12;
    } else if (taxableIncome <= 100525) {
      federalTax = 5426 + (taxableIncome - 47150) * 0.22;
    } else if (taxableIncome <= 191950) {
      federalTax = 17168.50 + (taxableIncome - 100525) * 0.24;
    } else if (taxableIncome <= 243725) {
      federalTax = 39110.50 + (taxableIncome - 191950) * 0.32;
    } else if (taxableIncome <= 609350) {
      federalTax = 55678.50 + (taxableIncome - 243725) * 0.35;
    } else {
      federalTax = 183647.25 + (taxableIncome - 609350) * 0.37;
    }
  }
  
  // Estimate state tax (simplified - 5% flat rate if state provided)
  const stateTax = params.state ? taxableIncome * 0.05 : 0;
  
  const totalTax = federalTax + stateTax;
  const effectiveRate = params.income > 0 ? (totalTax / params.income) * 100 : 0;
  
  // Save estimate to database
  await db.insert(taxEstimates).values({
    userId: params.userId,
    taxYear: new Date().getFullYear(),
    income: Math.round(params.income * 100), // Convert to cents
    filingStatus: params.filingStatus,
    state: params.state || null,
    taxableIncome: Math.round(taxableIncome * 100),
    federalTax: Math.round(federalTax * 100),
    stateTax: Math.round(stateTax * 100),
    totalTax: Math.round(totalTax * 100),
    effectiveRate: Math.round(effectiveRate * 100), // basis points
    estimatedRefund: 0,
  });
  
  return {
    taxableIncome,
    federalTax,
    stateTax,
    totalTax,
    effectiveRate,
    estimatedRefund: 0,
    deductions: params.deductions?.map(d => ({
      ...d,
      eligible: true,
    })) || [],
  };
}

/**
 * Calculate quarterly estimated taxes
 */
export async function calculateQuarterlyTaxes(params: {
  userId: number;
  estimatedAnnualIncome: number;
  filingStatus: string;
}): Promise<{
  annualTax: number;
  quarterlyPayment: number;
  dueDates: string[];
}> {
  const estimate = await calculateTaxEstimate({
    userId: params.userId,
    income: params.estimatedAnnualIncome,
    filingStatus: params.filingStatus,
  });
  
  const quarterlyPayment = estimate.totalTax / 4;
  const currentYear = new Date().getFullYear();
  
  return {
    annualTax: estimate.totalTax,
    quarterlyPayment,
    dueDates: [
      `${currentYear}-04-15`,
      `${currentYear}-06-15`,
      `${currentYear}-09-15`,
      `${currentYear + 1}-01-15`,
    ],
  };
}

/**
 * Find eligible deductions using AI
 */
export async function findEligibleDeductions(params: {
  userId: number;
  income: number;
  expenses: Array<{ category: string; amount: number; description: string }>;
}): Promise<TaxDeduction[]> {
  const db = getDb();
  
  // Use AI to analyze expenses and find eligible deductions
  const prompt = `Analyze these expenses and determine which are eligible as tax deductions:

Income: $${params.income.toLocaleString()}

Expenses:
${params.expenses.map(e => `- ${e.category}: $${e.amount} (${e.description})`).join('\n')}

For each expense, determine if it's eligible as a tax deduction and provide reasoning. Return a JSON array with this structure:
[
  {
    "category": "expense category",
    "amount": amount in dollars,
    "description": "brief explanation of why it's eligible or not",
    "eligible": true/false
  }
]`;

  const response = await invokeLLM({
    messages: [
      { role: 'system', content: 'You are a tax expert helping identify eligible deductions. Always return valid JSON.' },
      { role: 'user', content: prompt },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'deductions',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            deductions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  amount: { type: 'number' },
                  description: { type: 'string' },
                  eligible: { type: 'boolean' },
                },
                required: ['category', 'amount', 'description', 'eligible'],
                additionalProperties: false,
              },
            },
          },
          required: ['deductions'],
          additionalProperties: false,
        },
      },
    },
  });
  
  const result = JSON.parse(response.choices[0].message.content);
  const deductions = result.deductions;
  
  // Save eligible deductions to database
  for (const deduction of deductions.filter((d: TaxDeduction) => d.eligible)) {
    await db.insert(taxDeductions).values({
      userId: params.userId,
      taxReturnId: null,
      category: deduction.category,
      amount: Math.round(deduction.amount * 100), // Convert to cents
      description: deduction.description,
      eligible: deduction.eligible,
      claimed: false,
    });
  }
  
  return deductions;
}

/**
 * Get AI-powered tax advice
 */
export async function getTaxAdvice(params: {
  userId: number;
  question: string;
  context?: {
    income?: number;
    filingStatus?: string;
    state?: string;
  };
}): Promise<{ advice: string }> {
  const contextStr = params.context
    ? `\n\nContext:\n- Income: $${params.context.income?.toLocaleString() || 'Not provided'}\n- Filing Status: ${params.context.filingStatus || 'Not provided'}\n- State: ${params.context.state || 'Not provided'}`
    : '';
  
  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: 'You are a knowledgeable tax advisor. Provide clear, accurate tax advice. Always include disclaimers that this is general information and users should consult a licensed tax professional for specific situations.',
      },
      {
        role: 'user',
        content: `${params.question}${contextStr}`,
      },
    ],
  });
  
  return {
    advice: response.choices[0].message.content,
  };
}

/**
 * Get tax filing checklist
 */
export async function getTaxFilingChecklist(userId: number, taxYear: number): Promise<{
  items: Array<{ task: string; completed: boolean; description: string }>;
}> {
  const db = getDb();
  
  // Get user's documents for the tax year
  const docs = await getTaxDocuments(userId, taxYear);
  
  const hasW2 = docs.some(d => d.type === 'W2');
  const has1099 = docs.some(d => d.type === '1099');
  
  return {
    items: [
      {
        task: 'Gather W-2 forms',
        completed: hasW2,
        description: 'Collect W-2 forms from all employers',
      },
      {
        task: 'Collect 1099 forms',
        completed: has1099,
        description: 'Gather 1099 forms for freelance/contract work, interest, dividends',
      },
      {
        task: 'Organize deduction receipts',
        completed: false,
        description: 'Compile receipts for charitable donations, medical expenses, business expenses',
      },
      {
        task: 'Review last year\'s return',
        completed: false,
        description: 'Check previous return for carryover items or missed deductions',
      },
      {
        task: 'Determine filing status',
        completed: false,
        description: 'Choose appropriate filing status (single, married filing jointly, etc.)',
      },
      {
        task: 'Calculate estimated tax',
        completed: false,
        description: 'Use tax calculator to estimate refund or amount owed',
      },
      {
        task: 'File tax return',
        completed: false,
        description: 'Submit federal and state tax returns by April 15th',
      },
    ],
  };
}

/**
 * Analyze potential tax savings
 */
export async function analyzeTaxSavings(params: {
  userId: number;
  income: number;
  currentDeductions: number;
}): Promise<{
  currentTax: number;
  potentialSavings: number;
  recommendations: string[];
}> {
  // Calculate current tax
  const currentEstimate = await calculateTaxEstimate({
    userId: params.userId,
    income: params.income,
    filingStatus: 'single',
    deductions: [{ category: 'Current', amount: params.currentDeductions }],
  });
  
  // Use AI to generate savings recommendations
  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: 'You are a tax optimization expert. Provide actionable recommendations to reduce tax liability.',
      },
      {
        role: 'user',
        content: `Income: $${params.income.toLocaleString()}\nCurrent Deductions: $${params.currentDeductions.toLocaleString()}\n\nProvide 5 specific recommendations to reduce tax liability. Return as JSON array of strings.`,
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'recommendations',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: ['recommendations'],
          additionalProperties: false,
        },
      },
    },
  });
  
  const result = JSON.parse(response.choices[0].message.content);
  
  // Estimate potential savings (conservative 10-15% reduction)
  const potentialSavings = currentEstimate.totalTax * 0.125;
  
  return {
    currentTax: currentEstimate.totalTax,
    potentialSavings,
    recommendations: result.recommendations,
  };
}
