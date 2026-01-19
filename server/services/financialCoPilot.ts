import { getDb } from '../db';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { invokeLLM } from '../_core/llm';

export interface FinancialAccount {
  id: number;
  userId: number;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan' | 'mortgage';
  balance: number;
  currency: string;
  institution: string;
  lastSynced: Date;
  isActive: boolean;
}

export interface Transaction {
  id: number;
  userId: number;
  accountId: number;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense' | 'transfer';
  merchant: string | null;
  tags: string[];
  notes: string | null;
}

export interface Budget {
  id: number;
  userId: number;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  spent: number;
  remaining: number;
  startDate: Date;
  endDate: Date;
}

export interface FinancialGoal {
  id: number;
  userId: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'emergency_fund';
  status: 'active' | 'completed' | 'paused';
  progress: number; // percentage
}

export interface FinancialInsight {
  type: 'spending_alert' | 'savings_opportunity' | 'bill_reminder' | 'investment_tip' | 'debt_warning';
  title: string;
  description: string;
  amount?: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface CashFlowAnalysis {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  savingsRate: number;
  topExpenseCategories: Array<{ category: string; amount: number; percentage: number }>;
  incomeStreams: Array<{ source: string; amount: number; percentage: number }>;
}

/**
 * Get all financial accounts for a user
 */
export async function getUserAccounts(userId: number): Promise<FinancialAccount[]> {
  // In production, this would fetch from database
  return [
    {
      id: 1,
      userId,
      name: 'Primary Checking',
      type: 'checking',
      balance: 5420.50,
      currency: 'USD',
      institution: 'Chase Bank',
      lastSynced: new Date(),
      isActive: true,
    },
    {
      id: 2,
      userId,
      name: 'High-Yield Savings',
      type: 'savings',
      balance: 15000.00,
      currency: 'USD',
      institution: 'Ally Bank',
      lastSynced: new Date(),
      isActive: true,
    },
    {
      id: 3,
      userId,
      name: 'Chase Freedom Credit Card',
      type: 'credit_card',
      balance: -1250.75,
      currency: 'USD',
      institution: 'Chase',
      lastSynced: new Date(),
      isActive: true,
    },
  ];
}

/**
 * Get recent transactions
 */
export async function getRecentTransactions(
  userId: number,
  limit: number = 50
): Promise<Transaction[]> {
  // In production, fetch from database
  return [
    {
      id: 1,
      userId,
      accountId: 1,
      date: new Date('2026-01-18'),
      description: 'Grocery Store',
      amount: -125.50,
      category: 'Groceries',
      type: 'expense',
      merchant: 'Whole Foods',
      tags: ['food', 'essentials'],
      notes: null,
    },
    {
      id: 2,
      userId,
      accountId: 1,
      date: new Date('2026-01-17'),
      description: 'Salary Deposit',
      amount: 4500.00,
      category: 'Salary',
      type: 'income',
      merchant: null,
      tags: ['income', 'salary'],
      notes: 'Biweekly paycheck',
    },
  ];
}

/**
 * Get user budgets
 */
export async function getUserBudgets(userId: number): Promise<Budget[]> {
  return [
    {
      id: 1,
      userId,
      category: 'Groceries',
      amount: 600,
      period: 'monthly',
      spent: 425.50,
      remaining: 174.50,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    },
    {
      id: 2,
      userId,
      category: 'Entertainment',
      amount: 200,
      period: 'monthly',
      spent: 150.00,
      remaining: 50.00,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
    },
  ];
}

/**
 * Create a new budget
 */
export async function createBudget(params: {
  userId: number;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
}): Promise<Budget> {
  const now = new Date();
  const endDate = new Date(now);
  
  if (params.period === 'weekly') {
    endDate.setDate(endDate.getDate() + 7);
  } else if (params.period === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  return {
    id: Date.now(),
    userId: params.userId,
    category: params.category,
    amount: params.amount,
    period: params.period,
    spent: 0,
    remaining: params.amount,
    startDate: now,
    endDate,
  };
}

/**
 * Get financial goals
 */
export async function getUserGoals(userId: number): Promise<FinancialGoal[]> {
  return [
    {
      id: 1,
      userId,
      name: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 5000,
      deadline: new Date('2026-12-31'),
      category: 'emergency_fund',
      status: 'active',
      progress: 50,
    },
    {
      id: 2,
      userId,
      name: 'Down Payment for House',
      targetAmount: 50000,
      currentAmount: 15000,
      deadline: new Date('2028-06-30'),
      category: 'purchase',
      status: 'active',
      progress: 30,
    },
  ];
}

/**
 * Create a financial goal
 */
export async function createGoal(params: {
  userId: number;
  name: string;
  targetAmount: number;
  deadline: Date;
  category: 'savings' | 'debt_payoff' | 'investment' | 'purchase' | 'emergency_fund';
}): Promise<FinancialGoal> {
  return {
    id: Date.now(),
    userId: params.userId,
    name: params.name,
    targetAmount: params.targetAmount,
    currentAmount: 0,
    deadline: params.deadline,
    category: params.category,
    status: 'active',
    progress: 0,
  };
}

/**
 * Analyze cash flow for a period
 */
export async function analyzeCashFlow(
  userId: number,
  startDate: Date,
  endDate: Date
): Promise<CashFlowAnalysis> {
  // In production, aggregate from transactions
  return {
    period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    totalIncome: 9000,
    totalExpenses: 6500,
    netCashFlow: 2500,
    savingsRate: 27.78,
    topExpenseCategories: [
      { category: 'Housing', amount: 2000, percentage: 30.77 },
      { category: 'Transportation', amount: 800, percentage: 12.31 },
      { category: 'Groceries', amount: 600, percentage: 9.23 },
      { category: 'Utilities', amount: 300, percentage: 4.62 },
      { category: 'Entertainment', amount: 250, percentage: 3.85 },
    ],
    incomeStreams: [
      { source: 'Salary', amount: 8000, percentage: 88.89 },
      { source: 'Freelance', amount: 1000, percentage: 11.11 },
    ],
  };
}

/**
 * Get AI-powered financial insights
 */
export async function getFinancialInsights(userId: number): Promise<FinancialInsight[]> {
  const accounts = await getUserAccounts(userId);
  const budgets = await getUserBudgets(userId);
  const transactions = await getRecentTransactions(userId, 100);

  // Calculate insights
  const insights: FinancialInsight[] = [];

  // Check for overspending
  for (const budget of budgets) {
    if (budget.spent / budget.amount > 0.9) {
      insights.push({
        type: 'spending_alert',
        title: `${budget.category} budget almost exceeded`,
        description: `You've spent ${((budget.spent / budget.amount) * 100).toFixed(0)}% of your ${budget.category} budget this month.`,
        amount: budget.remaining,
        actionable: true,
        priority: 'high',
        createdAt: new Date(),
      });
    }
  }

  // Check for savings opportunities
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  if (totalBalance > 10000) {
    insights.push({
      type: 'savings_opportunity',
      title: 'High cash balance detected',
      description: 'You have a high balance in checking. Consider moving funds to a high-yield savings account or investment.',
      amount: totalBalance,
      actionable: true,
      priority: 'medium',
      createdAt: new Date(),
    });
  }

  return insights;
}

/**
 * Generate AI financial advice
 */
export async function generateFinancialAdvice(params: {
  userId: number;
  question: string;
  context?: {
    income?: number;
    expenses?: number;
    goals?: string[];
  };
}): Promise<{ advice: string; actionItems: string[] }> {
  const accounts = await getUserAccounts(params.userId);
  const goals = await getUserGoals(params.userId);
  const cashFlow = await analyzeCashFlow(
    params.userId,
    new Date(new Date().setDate(1)), // First day of month
    new Date() // Today
  );

  const contextStr = `
User Financial Context:
- Total Balance: $${accounts.reduce((sum, acc) => sum + acc.balance, 0).toFixed(2)}
- Monthly Income: $${cashFlow.totalIncome}
- Monthly Expenses: $${cashFlow.totalExpenses}
- Savings Rate: ${cashFlow.savingsRate.toFixed(1)}%
- Active Goals: ${goals.map(g => `${g.name} (${g.progress}% complete)`).join(', ')}

User Question: ${params.question}
`;

  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: 'You are an expert financial advisor. Provide practical, actionable advice tailored to the user\'s financial situation.',
      },
      {
        role: 'user',
        content: contextStr,
      },
    ],
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const advice = typeof rawContent === 'string' ? rawContent : '';

  // Extract action items (simple parsing)
  const actionItems = advice
    .split('\n')
    .filter((line: string) => line.trim().match(/^[-*\d.]/))
    .map((line: string) => line.trim())
    .slice(0, 5);

  return {
    advice,
    actionItems: actionItems.length > 0 ? actionItems : [
      'Review your spending patterns',
      'Set up automatic savings',
      'Track your expenses daily',
    ],
  };
}

/**
 * Calculate net worth
 */
export async function calculateNetWorth(userId: number): Promise<{
  assets: number;
  liabilities: number;
  netWorth: number;
  breakdown: Array<{ type: string; amount: number }>;
}> {
  const accounts = await getUserAccounts(userId);

  const assets = accounts
    .filter(acc => acc.balance > 0)
    .reduce((sum, acc) => sum + acc.balance, 0);

  const liabilities = accounts
    .filter(acc => acc.balance < 0)
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  return {
    assets,
    liabilities,
    netWorth: assets - liabilities,
    breakdown: accounts.map(acc => ({
      type: `${acc.name} (${acc.type})`,
      amount: acc.balance,
    })),
  };
}

/**
 * Categorize transaction automatically using AI
 */
export async function categorizeTransaction(description: string, amount: number): Promise<string> {
  const prompt = `Categorize this financial transaction:
Description: ${description}
Amount: $${Math.abs(amount)}

Choose the most appropriate category from:
- Groceries
- Dining
- Transportation
- Utilities
- Entertainment
- Shopping
- Healthcare
- Housing
- Income
- Transfer
- Other

Respond with just the category name.`;

  const response = await invokeLLM({
    messages: [
      { role: 'system', content: 'You are a financial transaction categorization expert.' },
      { role: 'user', content: prompt },
    ],
  });

  const rawContent = response.choices[0]?.message?.content || '';
  const category = typeof rawContent === 'string' ? rawContent.trim() : 'Other';

  return category;
}

/**
 * Get spending trends
 */
export async function getSpendingTrends(userId: number, months: number = 6): Promise<{
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
  categoryTrends: Array<{
    category: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercent: number;
  }>;
}> {
  // In production, aggregate from transactions
  return {
    monthlyData: [
      { month: '2025-08', income: 9000, expenses: 6800, savings: 2200 },
      { month: '2025-09', income: 9000, expenses: 6500, savings: 2500 },
      { month: '2025-10', income: 9500, expenses: 6700, savings: 2800 },
      { month: '2025-11', income: 9000, expenses: 7200, savings: 1800 },
      { month: '2025-12', income: 10000, expenses: 8500, savings: 1500 },
      { month: '2026-01', income: 9000, expenses: 6500, savings: 2500 },
    ],
    categoryTrends: [
      { category: 'Groceries', trend: 'stable', changePercent: 2.5 },
      { category: 'Entertainment', trend: 'decreasing', changePercent: -15.0 },
      { category: 'Transportation', trend: 'increasing', changePercent: 12.0 },
    ],
  };
}
