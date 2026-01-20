/**
 * KAIDEN File Integration & Accounting Software Connectors
 * QuickBooks, Xero, CSV Import/Export
 */

import { TaxReturn } from './taxEngine';
import { CryptoTransaction } from './cryptoTaxEngine';

/**
 * CSV Export/Import Interfaces
 */
export interface TaxReturnCSV {
  filing_status: string;
  wages: number;
  self_employment: number;
  interest: number;
  dividends_qualified: number;
  dividends_ordinary: number;
  capital_gains_short: number;
  capital_gains_long: number;
  ira_contribution: number;
  student_loan_interest: number;
  hsa_contribution: number;
  state: string;
  dependents: number;
}

/**
 * QuickBooks Integration
 */
export interface QuickBooksData {
  companyId: string;
  fiscalYear: number;
  income: {
    revenue: number;
    otherIncome: number;
  };
  expenses: {
    costOfGoodsSold: number;
    advertising: number;
    autoExpense: number;
    officeExpense: number;
    rent: number;
    utilities: number;
    insurance: number;
    professionalFees: number;
    supplies: number;
    travel: number;
    meals: number;
    depreciation: number;
    other: number;
  };
  assets: {
    vehicles: Array<{
      description: string;
      datePlaced: string;
      cost: number;
      method: 'Section 179' | 'MACRS' | 'Bonus';
    }>;
    equipment: Array<{
      description: string;
      datePlaced: string;
      cost: number;
    }>;
  };
}

/**
 * Xero Integration
 */
export interface XeroData {
  organisationId: string;
  taxYear: number;
  profitLoss: {
    revenue: number;
    expenses: number;
    netProfit: number;
  };
  balanceSheet: {
    assets: number;
    liabilities: number;
    equity: number;
  };
  transactions: Array<{
    date: string;
    description: string;
    amount: number;
    category: string;
    taxCode: string;
  }>;
}

/**
 * Export Tax Return to CSV
 */
export function exportTaxReturnToCSV(taxReturn: TaxReturn): string {
  const csv: TaxReturnCSV = {
    filing_status: taxReturn.filingStatus,
    wages: taxReturn.income.wages,
    self_employment: taxReturn.income.selfEmployment,
    interest: taxReturn.income.interest,
    dividends_qualified: taxReturn.income.dividends.qualified,
    dividends_ordinary: taxReturn.income.dividends.ordinary,
    capital_gains_short: taxReturn.income.capitalGains.shortTerm,
    capital_gains_long: taxReturn.income.capitalGains.longTerm,
    ira_contribution: taxReturn.adjustments.traditionalIRA,
    student_loan_interest: taxReturn.adjustments.studentLoanInterest,
    hsa_contribution: taxReturn.adjustments.hsaContribution,
    state: taxReturn.state,
    dependents: taxReturn.dependents
  };

  // Create CSV header
  const headers = Object.keys(csv).join(',');
  const values = Object.values(csv).join(',');
  
  return `${headers}\n${values}`;
}

/**
 * Import Tax Return from CSV
 */
export function importTaxReturnFromCSV(csvString: string): Partial<TaxReturn> {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Invalid CSV format');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  const values = lines[1].split(',').map(v => v.trim());
  
  const data: any = {};
  headers.forEach((header, index) => {
    data[header] = values[index];
  });

  return {
    filingStatus: data.filing_status as any,
    income: {
      wages: parseFloat(data.wages) || 0,
      selfEmployment: parseFloat(data.self_employment) || 0,
      interest: parseFloat(data.interest) || 0,
      dividends: {
        qualified: parseFloat(data.dividends_qualified) || 0,
        ordinary: parseFloat(data.dividends_ordinary) || 0
      },
      capitalGains: {
        shortTerm: parseFloat(data.capital_gains_short) || 0,
        longTerm: parseFloat(data.capital_gains_long) || 0
      },
      rentalIncome: 0,
      retirement: 0,
      other: 0
    },
    adjustments: {
      traditionalIRA: parseFloat(data.ira_contribution) || 0,
      studentLoanInterest: parseFloat(data.student_loan_interest) || 0,
      hsaContribution: parseFloat(data.hsa_contribution) || 0,
      selfEmploymentTax: 0,
      other: 0
    },
    state: data.state,
    dependents: parseInt(data.dependents) || 0
  };
}

/**
 * Export Crypto Transactions to CSV
 */
export function exportCryptoTransactionsToCSV(transactions: CryptoTransaction[]): string {
  const headers = 'date,type,asset,amount,cost_basis,fair_market_value,exchange';
  
  const rows = transactions.map(tx => {
    return [
      tx.date.toISOString().split('T')[0],
      tx.type,
      tx.asset,
      tx.amount,
      tx.costBasis,
      tx.fairMarketValue,
      tx.exchange
    ].join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Import Crypto Transactions from CSV
 */
export function importCryptoTransactionsFromCSV(csvString: string): CryptoTransaction[] {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Invalid CSV format');
  }

  const transactions: CryptoTransaction[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length >= 7) {
      transactions.push({
        id: `import-${i}`,
        date: new Date(values[0]),
        type: values[1] as any,
        asset: values[2],
        amount: parseFloat(values[3]),
        costBasis: parseFloat(values[4]),
        fairMarketValue: parseFloat(values[5]),
        exchange: values[6]
      });
    }
  }

  return transactions;
}

/**
 * Convert QuickBooks Data to Tax Return
 */
export function convertQuickBooksToTaxReturn(qbData: QuickBooksData): Partial<TaxReturn> {
  // Calculate net profit
  const totalRevenue = qbData.income.revenue + qbData.income.otherIncome;
  const totalExpenses = Object.values(qbData.expenses).reduce((a, b) => a + b, 0);
  const netProfit = totalRevenue - totalExpenses;

  return {
    income: {
      selfEmployment: netProfit,
      wages: 0,
      interest: 0,
      dividends: { qualified: 0, ordinary: 0 },
      capitalGains: { shortTerm: 0, longTerm: 0 },
      rentalIncome: 0,
      retirement: 0,
      other: 0
    },
    adjustments: {
      traditionalIRA: 0,
      studentLoanInterest: 0,
      hsaContribution: 0,
      selfEmploymentTax: 0,
      other: 0
    }
  };
}

/**
 * Convert Xero Data to Tax Return
 */
export function convertXeroToTaxReturn(xeroData: XeroData): Partial<TaxReturn> {
  return {
    income: {
      selfEmployment: xeroData.profitLoss.netProfit,
      wages: 0,
      interest: 0,
      dividends: { qualified: 0, ordinary: 0 },
      capitalGains: { shortTerm: 0, longTerm: 0 },
      rentalIncome: 0,
      retirement: 0,
      other: 0
    }
  };
}

/**
 * Generate Tax Organizer for Client
 */
export interface TaxOrganizerSection {
  section: string;
  items: Array<{
    item: string;
    description: string;
    required: boolean;
    example?: string;
  }>;
}

export const TAX_ORGANIZER: TaxOrganizerSection[] = [
  {
    section: 'Personal Information',
    items: [
      { item: 'Full legal name', description: 'Exactly as shown on Social Security card', required: true },
      { item: 'Social Security Number', description: 'For taxpayer, spouse, and all dependents', required: true },
      { item: 'Date of birth', description: 'For all individuals on return', required: true },
      { item: 'Address', description: 'Current mailing address', required: true },
      { item: 'Phone and email', description: 'Best contact information', required: true }
    ]
  },
  {
    section: 'Income Documents',
    items: [
      { item: 'W-2 Forms', description: 'From all employers', required: true, example: 'Box 1: Wages, Box 2: Federal tax withheld' },
      { item: '1099-NEC', description: 'Non-employee compensation', required: false, example: 'Self-employment income' },
      { item: '1099-INT', description: 'Interest income', required: false, example: 'Bank account interest' },
      { item: '1099-DIV', description: 'Dividend income', required: false, example: 'Investment dividends' },
      { item: '1099-B', description: 'Stock/crypto sales', required: false, example: 'Brokerage transactions' },
      { item: '1099-R', description: 'Retirement distributions', required: false, example: 'IRA/401k withdrawals' },
      { item: 'K-1 Forms', description: 'Partnership/S-Corp/Trust income', required: false }
    ]
  },
  {
    section: 'Deductions',
    items: [
      { item: 'Mortgage interest (1098)', description: 'From all lenders', required: false },
      { item: 'Property tax receipts', description: 'Real estate taxes paid', required: false },
      { item: 'Charitable donations', description: 'Cash and non-cash contributions', required: false, example: 'Need receipts for donations >$250' },
      { item: 'Medical expenses', description: 'Only if >7.5% of AGI', required: false },
      { item: 'State/local taxes paid', description: 'Income tax, sales tax', required: false }
    ]
  },
  {
    section: 'Business (Self-Employed)',
    items: [
      { item: 'Profit & Loss statement', description: 'Income and expenses for the year', required: true },
      { item: 'Mileage log', description: 'Contemporaneous record of business miles', required: false },
      { item: 'Home office details', description: 'Square footage, percentage business use', required: false },
      { item: 'Equipment purchases', description: 'For Section 179/depreciation', required: false },
      { item: '1099-K forms', description: 'Payment processor income (PayPal, Stripe, etc.)', required: false }
    ]
  },
  {
    section: 'Retirement',
    items: [
      { item: 'IRA contributions', description: 'Traditional or Roth contributions made', required: false },
      { item: '401(k) contributions', description: 'Should be on W-2 box 12', required: false },
      { item: 'HSA contributions', description: 'Health Savings Account', required: false }
    ]
  },
  {
    section: 'Cryptocurrency',
    items: [
      { item: 'Exchange transaction history', description: 'Coinbase, Binance, Kraken, etc.', required: false },
      { item: 'Wallet addresses', description: 'All wallets used during year', required: false },
      { item: 'Staking/mining income', description: 'Rewards received', required: false },
      { item: 'NFT sales', description: 'Purchase and sale details', required: false }
    ]
  }
];

/**
 * Generate Client Checklist
 */
export function generateClientChecklist(taxReturn: Partial<TaxReturn>): string[] {
  const checklist: string[] = [];

  // Based on tax return data, generate personalized checklist
  if (taxReturn.income?.wages) {
    checklist.push('✓ W-2 forms from all employers');
  }

  if (taxReturn.income?.selfEmployment) {
    checklist.push('✓ Profit & Loss statement');
    checklist.push('✓ Business expense receipts');
    checklist.push('✓ Mileage log (if claiming vehicle deduction)');
    checklist.push('✓ Home office measurements (if claiming)');
  }

  if (taxReturn.income?.interest || taxReturn.income?.dividends.qualified) {
    checklist.push('✓ 1099-INT and 1099-DIV forms');
  }

  if (taxReturn.income?.capitalGains?.shortTerm || taxReturn.income?.capitalGains.longTerm) {
    checklist.push('✓ 1099-B forms from brokerages');
    checklist.push('✓ Cryptocurrency transaction records');
  }

  if (taxReturn.adjustments?.traditionalIRA) {
    checklist.push('✓ IRA contribution receipt (5498 form)');
  }

  if (taxReturn.adjustments?.hsaContribution) {
    checklist.push('✓ HSA contribution statement');
  }

  // Always include
  checklist.push('✓ Copy of prior year tax return');
  checklist.push('✓ Estimated tax payment receipts');

  return checklist;
}

/**
 * File Upload Handler
 */
export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string;
  uploadedAt: Date;
}

export function parseUploadedFile(file: File): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        content: e.target?.result as string,
        uploadedAt: new Date()
      });
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.readAsText(file);
  });
}

/**
 * Validate CSV Format
 */
export function validateCSVFormat(csvString: string, expectedHeaders: string[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    errors.push('CSV must contain at least a header row and one data row');
    return { valid: false, errors };
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Check for required headers
  for (const expected of expectedHeaders) {
    if (!headers.includes(expected.toLowerCase())) {
      errors.push(`Missing required column: ${expected}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate Template CSV for Download
 */
export function generateTaxReturnTemplate(): string {
  const headers = [
    'filing_status',
    'wages',
    'self_employment',
    'interest',
    'dividends_qualified',
    'dividends_ordinary',
    'capital_gains_short',
    'capital_gains_long',
    'ira_contribution',
    'student_loan_interest',
    'hsa_contribution',
    'state',
    'dependents'
  ];

  const example = [
    'single',
    '75000',
    '25000',
    '500',
    '1200',
    '300',
    '3000',
    '5000',
    '6500',
    '1500',
    '3850',
    'CA',
    '0'
  ];

  return `${headers.join(',')}\n${example.join(',')}`;
}

export function generateCryptoTemplate(): string {
  const headers = 'date,type,asset,amount,cost_basis,fair_market_value,exchange';
  const example1 = '2024-01-15,buy,BTC,0.5,20000,20000,Coinbase';
  const example2 = '2024-06-20,sell,BTC,0.5,20000,25000,Coinbase';
  
  return `${headers}\n${example1}\n${example2}`;
}
