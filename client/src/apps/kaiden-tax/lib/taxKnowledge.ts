/**
 * KAIDEN Tax Knowledge Base
 * Comprehensive tax law reference and CPA best practices
 */

export interface TaxKnowledgeItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  detail: string;
  irs_reference: string;
  cpa_insight: string;
  common_mistakes: string[];
  pro_tips: string[];
  updated: string;
}

/**
 * IRS Publications & Tax Law References
 */
export const IRS_PUBLICATIONS = {
  'PUB-17': {
    title: 'Your Federal Income Tax',
    year: 2024,
    key_topics: ['Individual tax', 'Filing status', 'Dependents', 'Standard deduction', 'Itemized deductions'],
    url: 'https://www.irs.gov/pub/irs-pdf/p17.pdf'
  },
  'PUB-334': {
    title: 'Tax Guide for Small Business',
    year: 2024,
    key_topics: ['Business income', 'Business expenses', 'Depreciation', 'Self-employment tax'],
    url: 'https://www.irs.gov/pub/irs-pdf/p334.pdf'
  },
  'PUB-463': {
    title: 'Travel, Gift, and Car Expenses',
    year: 2024,
    key_topics: ['Business travel', 'Meal deductions', 'Vehicle expenses', 'Standard mileage rate'],
    url: 'https://www.irs.gov/pub/irs-pdf/p463.pdf'
  },
  'PUB-525': {
    title: 'Taxable and Nontaxable Income',
    year: 2024,
    key_topics: ['Wages', 'Tips', 'Employee benefits', 'Investment income', 'Rental income'],
    url: 'https://www.irs.gov/pub/irs-pdf/p525.pdf'
  },
  'PUB-544': {
    title: 'Sales and Other Dispositions of Assets',
    year: 2024,
    key_topics: ['Capital gains', 'Capital losses', 'Sale of home', 'Installment sales'],
    url: 'https://www.irs.gov/pub/irs-pdf/p544.pdf'
  },
  'PUB-550': {
    title: 'Investment Income and Expenses',
    year: 2024,
    key_topics: ['Interest', 'Dividends', 'Capital gains distributions', 'Bond premiums'],
    url: 'https://www.irs.gov/pub/irs-pdf/p550.pdf'
  },
  'PUB-590-A': {
    title: 'Contributions to Individual Retirement Arrangements',
    year: 2024,
    key_topics: ['Traditional IRA', 'Roth IRA', 'Contribution limits', 'Deduction limits'],
    url: 'https://www.irs.gov/pub/irs-pdf/p590a.pdf'
  },
  'PUB-590-B': {
    title: 'Distributions from Individual Retirement Arrangements',
    year: 2024,
    key_topics: ['Required distributions', 'Early distributions', 'Rollovers', 'Inherited IRAs'],
    url: 'https://www.irs.gov/pub/irs-pdf/p590b.pdf'
  }
};

/**
 * Tax Law Knowledge Base - Quick Reference
 */
export const TAX_KNOWLEDGE: TaxKnowledgeItem[] = [
  {
    id: 'tk-001',
    category: 'Deductions',
    title: 'Home Office Deduction',
    summary: 'Self-employed individuals can deduct expenses for business use of home',
    detail: 'The home office must be used regularly and exclusively for business. Can use simplified method ($5/sq ft, max 300 sq ft) or actual expense method.',
    irs_reference: 'Form 8829, Publication 587',
    cpa_insight: 'Simplified method is audit-safer but actual expense often yields larger deduction. Document with photos, measurements, and business use percentage.',
    common_mistakes: [
      'Claiming office not used exclusively for business',
      'Forgetting to depreciate home (actual method)',
      'Not maintaining proper documentation'
    ],
    pro_tips: [
      'Keep detailed logs of business hours in home office',
      'Take photos annually to document exclusive business use',
      'Consider simplified method if deduction < $1,500'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-002',
    category: 'Deductions',
    title: 'Standard Mileage vs. Actual Expenses',
    summary: '2024 standard mileage rate is 67¢ per mile for business use',
    detail: 'Track all miles driven for business. Can choose standard mileage (67¢/mile) or actual expenses (gas, repairs, insurance, depreciation). Must choose in first year of vehicle use.',
    irs_reference: 'Publication 463',
    cpa_insight: 'Standard mileage usually better for high-mileage, lower-cost vehicles. Actual expenses better for expensive vehicles with lower mileage. Track both methods first year to optimize.',
    common_mistakes: [
      'Not tracking mileage contemporaneously',
      'Including commute miles',
      'Switching methods improperly'
    ],
    pro_tips: [
      'Use MileIQ or similar app for automatic tracking',
      'Calculate both methods annually to optimize',
      'Keep receipts even if using standard mileage (for actual expense comparison)'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-003',
    category: 'Credits',
    title: 'Earned Income Tax Credit (EITC)',
    summary: 'Refundable credit for low-to-moderate income workers, up to $7,430 (2024)',
    detail: 'Based on earned income and number of qualifying children. Income limits: $63,398 (3+ children, joint), $53,057 (single, 3+ children). Must have valid SSN and meet residency requirements.',
    irs_reference: 'Publication 596',
    cpa_insight: 'Most commonly missed credit. Many eligible taxpayers don\'t claim. Check eligibility even if income seems "too high" - limits are generous with multiple children.',
    common_mistakes: [
      'Not claiming when eligible',
      'Incorrect dependent relationships',
      'Investment income over $11,000 disqualifies'
    ],
    pro_tips: [
      'File even if income below filing requirement - EITC is refundable',
      'Prior year credits can be claimed up to 3 years retroactively',
      'Use IRS EITC Assistant tool to verify eligibility'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-004',
    category: 'Retirement',
    title: 'Solo 401(k) Contribution Strategies',
    summary: 'Self-employed can contribute up to $69,000 in 2024 ($76,500 if age 50+)',
    detail: 'Employee deferrals: $23,000 ($30,500 age 50+). Employer profit sharing: up to 25% of compensation. Total cannot exceed $69,000 ($76,500 age 50+). Deadline: December 31 for employee deferrals, tax filing deadline for employer contributions.',
    irs_reference: 'Publication 560',
    cpa_insight: 'Often better than SEP IRA for high earners due to higher contribution limits. Can do Roth employee deferrals. Must establish plan by December 31 but can fund until tax deadline.',
    common_mistakes: [
      'Missing December 31 deadline to establish plan',
      'Calculating employer contribution incorrectly',
      'Not coordinating with W-2 wages from other employers'
    ],
    pro_tips: [
      'Set up plan in December even if contributions made later',
      'Use both employee and employer contributions to maximize',
      'Consider Roth option for employee deferrals if in lower tax year'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-005',
    category: 'Business',
    title: 'Section 179 Depreciation',
    summary: 'Immediate expensing of business equipment up to $1,220,000 in 2024',
    detail: 'Deduct full cost of qualifying equipment in year placed in service. Phase-out begins at $3,050,000. Must be used >50% for business. Can\'t create/increase business loss.',
    irs_reference: 'Section 179, Form 4562',
    cpa_insight: 'Powerful tool for reducing taxable income. Combine with bonus depreciation for maximum benefit. Strategic planning can save significant taxes.',
    common_mistakes: [
      'Exceeding income limitation (can\'t create loss)',
      'Claiming on property not >50% business use',
      'Not considering state conformity issues'
    ],
    pro_tips: [
      'Buy equipment before December 31 to claim full year deduction',
      'Consider timing - might want to spread deduction over years if in lower bracket',
      'Use for vehicles over 6,000 lbs GVW to avoid luxury auto limits'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-006',
    category: 'Capital Gains',
    title: 'Qualified Small Business Stock (QSBS)',
    summary: 'Exclude up to 100% of gains from qualified small business stock',
    detail: 'Must hold stock for more than 5 years. Stock must be from C-Corp with gross assets under $50M. Issued after August 10, 1993. Exclusion: up to $10 million or 10x basis.',
    irs_reference: 'Section 1202',
    cpa_insight: 'Extremely valuable for startup equity. Can result in zero tax on millions in gains. Proper documentation from day one is critical.',
    common_mistakes: [
      'Not tracking holding period precisely',
      'Assuming all startup stock qualifies',
      'Not getting proper documentation from company'
    ],
    pro_tips: [
      'Get Section 1202 representation letter from company at issuance',
      'Track 5-year anniversary dates meticulously',
      'Consider gift strategies to multiply $10M exclusion across family members'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-007',
    category: 'Crypto',
    title: 'Cryptocurrency Wash Sale Rules',
    summary: 'Wash sale rules currently DO NOT apply to cryptocurrency (2024)',
    detail: 'Unlike securities, crypto can be sold at a loss and immediately repurchased to harvest losses. However, proposed legislation may change this. Track carefully as IRS scrutiny increases.',
    irs_reference: 'Notice 2014-21, Revenue Ruling 2019-24',
    cpa_insight: 'Take advantage of this while it lasts. Proposed Infrastructure Bill would apply wash sales to crypto starting 2025. Harvest aggressively in 2024.',
    common_mistakes: [
      'Assuming wash sales apply to crypto',
      'Not tracking cost basis across wallets',
      'Forgetting to report even if no Form 1099'
    ],
    pro_tips: [
      'Harvest losses daily if needed - no 30-day wait',
      'Use specific identification (HIFO) to minimize gains',
      'Document everything - IRS is watching crypto closely'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-008',
    category: 'Deductions',
    title: 'Meals & Entertainment 2024',
    summary: 'Business meals: 50% deductible (100% for 2021-2022 expired)',
    detail: 'Must be ordinary and necessary business expense. Employee present. Not lavish or extravagant. Entertainment is NOT deductible (post-TCJA). Food/beverage at entertainment event may be separately stated and deductible at 50%.',
    irs_reference: 'Publication 463, Notice 2018-76',
    cpa_insight: 'The 100% deduction expired December 31, 2022. Back to 50% in 2023-2024. Separate food charges from entertainment on receipts. Document business purpose.',
    common_mistakes: [
      'Claiming 100% deduction (expired)',
      'Deducting entertainment expenses',
      'Poor documentation of business purpose'
    ],
    pro_tips: [
      'Write business purpose on receipt immediately',
      'Request separate bills for food vs. entertainment',
      'Take photo of receipt + note attendees and topics discussed'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-009',
    category: 'International',
    title: 'Foreign Bank Account Reporting (FBAR)',
    summary: 'Report foreign accounts if aggregate exceeds $10,000 at any time',
    detail: 'FinCEN Form 114 due April 15 (automatic extension to October 15). Separate from tax return. Applies to bank accounts, investment accounts, crypto exchanges. Penalties for non-compliance are severe.',
    irs_reference: 'FinCEN Form 114',
    cpa_insight: 'Criminal penalties possible for willful non-compliance. File even if no income generated. "Aggregate" means total across all accounts at highest point during year.',
    common_mistakes: [
      'Not filing because no income from account',
      'Missing foreign crypto exchange accounts',
      'Not understanding "aggregate" calculation'
    ],
    pro_tips: [
      'Check account balances on last day of each month',
      'Include accounts with signing authority even if not owner',
      'File electronically through FinCEN BSA E-Filing System'
    ],
    updated: '2024-01-01'
  },
  {
    id: 'tk-010',
    category: 'Entity',
    title: 'S-Corp Reasonable Compensation',
    summary: 'S-Corp owners must pay themselves "reasonable" W-2 salary',
    detail: 'IRS requires W-2 wages before taking distributions. "Reasonable" based on industry standards, time spent, qualifications. Underpaying salary to avoid payroll taxes is audit red flag.',
    irs_reference: 'Revenue Ruling 74-44',
    cpa_insight: 'Use industry salary surveys (Bureau of Labor Statistics). Conservative approach: 40-60% of net profit as W-2. Document reasoning. Saves SE tax but creates payroll tax compliance.',
    common_mistakes: [
      'Taking zero or minimal salary',
      'Not running payroll at all',
      'No documentation of compensation decision'
    ],
    pro_tips: [
      'Pay at least 1/3 to 1/2 of net income as W-2',
      'Use salary comparison tools (BLS.gov, Glassdoor)',
      'Document factors in writing annually'
    ],
    updated: '2024-01-01'
  }
];

/**
 * Quick Tax Tips by Category
 */
export const QUICK_TAX_TIPS = {
  deductions: [
    'Max out retirement contributions before year-end (IRA has until April 15)',
    'Bunch itemized deductions every other year to exceed standard deduction',
    'Pay January mortgage payment in December to increase deduction',
    'Contribute to HSA - triple tax advantage (deductible, grows tax-free, withdraws tax-free)',
    'Deduct state estimated tax payments made in current year'
  ],
  credits: [
    'Child Tax Credit: $2,000 per child under 17 (refundable up to $1,600)',
    'Saver\'s Credit: up to $1,000 for retirement contributions if income qualifies',
    'Education credits: American Opportunity ($2,500) vs Lifetime Learning ($2,000)',
    'Energy credits: Heat pumps, solar panels, insulation qualify for 30% credit',
    'EV tax credit: Up to $7,500 for new electric vehicles (income limits apply)'
  ],
  timing: [
    'Harvest capital losses before December 31',
    'Defer income to next year if expecting lower bracket',
    'Accelerate deductions into current year if expecting higher bracket next year',
    'Make estimated tax payments by deadline to avoid penalties',
    'Convert traditional IRA to Roth in low-income years'
  ],
  retirement: [
    '401(k): $23,000 employee deferral ($30,500 if 50+)',
    'IRA: $7,000 ($8,000 if 50+) - deadline is tax filing date',
    'SEP IRA: 25% of compensation, up to $69,000',
    'Backdoor Roth: contribute to traditional IRA, immediately convert if over income limits',
    'Mega backdoor Roth: After-tax 401(k) contributions + in-service conversion'
  ],
  business: [
    'Pay yourself reasonable W-2 salary if S-Corp (40-60% of profit)',
    'Section 179: Deduct equipment purchases up to $1,220,000 immediately',
    'QBI deduction: 20% of qualified business income (income limits apply)',
    'Home office: Simplified method = $5/sq ft (max 300 sq ft)',
    'Vehicle: Standard mileage 67¢/mile or track actual expenses'
  ]
};

/**
 * Tax Law Updates & Changes for 2024
 */
export const TAX_LAW_UPDATES_2024 = [
  {
    date: '2024-01-01',
    title: 'Standard Deduction Increases',
    description: 'Single: $14,600 (+$750), MFJ: $29,200 (+$1,500)',
    impact: 'Fewer taxpayers will itemize deductions'
  },
  {
    date: '2024-01-01',
    title: 'Tax Bracket Inflation Adjustments',
    description: 'All bracket thresholds increased ~5.4% for inflation',
    impact: 'Lower taxes for same nominal income'
  },
  {
    date: '2024-01-01',
    title: 'Retirement Contribution Limits Increase',
    description: '401(k): $23,000 (+$500), IRA: $7,000 (no change)',
    impact: 'Higher tax-deferred savings opportunity'
  },
  {
    date: '2024-01-01',
    title: 'Business Mileage Rate',
    description: 'Increased to 67¢/mile (+1.5¢)',
    impact: 'Slightly higher deduction for business driving'
  },
  {
    date: '2024-01-01',
    title: 'SALT Cap Remains',
    description: '$10,000 cap on state/local tax deduction continues',
    impact: 'High-tax state residents still limited'
  },
  {
    date: '2024-01-01',
    title: 'Estate Tax Exemption',
    description: 'Increased to $13.61M ($27.22M for couples)',
    impact: 'Fewer estates subject to federal estate tax'
  }
];

/**
 * Get tax knowledge by category
 */
export function getTaxKnowledgeByCategory(category: string): TaxKnowledgeItem[] {
  return TAX_KNOWLEDGE.filter(item => 
    item.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Search tax knowledge
 */
export function searchTaxKnowledge(query: string): TaxKnowledgeItem[] {
  const lowerQuery = query.toLowerCase();
  return TAX_KNOWLEDGE.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.summary.toLowerCase().includes(lowerQuery) ||
    item.detail.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get relevant tax knowledge for a tax return
 */
export function getRelevantKnowledge(taxReturn: any): TaxKnowledgeItem[] {
  const relevant: TaxKnowledgeItem[] = [];
  
  // Self-employment
  if (taxReturn.income?.selfEmployment > 0) {
    relevant.push(...getTaxKnowledgeByCategory('Business'));
  }
  
  // Retirement
  if (taxReturn.adjustments?.traditionalIRA > 0) {
    relevant.push(...getTaxKnowledgeByCategory('Retirement'));
  }
  
  // Capital gains
  if (taxReturn.income?.capitalGains?.shortTerm > 0 || 
      taxReturn.income?.capitalGains?.longTerm > 0) {
    relevant.push(...getTaxKnowledgeByCategory('Capital Gains'));
  }
  
  return relevant;
}

/**
 * CPA Best Practices Checklist
 */
export const CPA_CHECKLIST = {
  client_intake: [
    'Verify SSN/ITIN for all taxpayers and dependents',
    'Confirm filing status and any changes from prior year',
    'Obtain signed engagement letter and disclosure forms',
    'Review prior year return for carryovers and recurring items',
    'Discuss major life events (marriage, divorce, birth, death, home purchase)'
  ],
  documentation: [
    'W-2s, 1099s, K-1s, and all income documents',
    'Receipts for deductions over $75 (contemporaneous for all)',
    'Mileage logs (contemporaneous, not reconstructed)',
    'Home office measurements and photos',
    'Cryptocurrency transaction records across all exchanges'
  ],
  review: [
    'Run diagnostic report before filing',
    'Verify all carryforward amounts',
    'Check estimated tax payments and withholding',
    'Review AGI for Roth IRA contribution eligibility',
    'Confirm state return ties to federal'
  ],
  quality_control: [
    'Second preparer review for returns with >$10k refund/owed',
    'Verify math calculations',
    'Check for missing schedules',
    'Confirm e-file rejection issues resolved',
    'Print and save PDF before filing'
  ],
  client_communication: [
    'Explain refund/balance due before filing',
    'Discuss payment options if balance due',
    'Provide tax planning recommendations for next year',
    'Set quarterly estimated payment reminders',
    'Schedule follow-up for implementing tax strategies'
  ]
};

/**
 * Audit Red Flags
 */
export const AUDIT_RED_FLAGS = [
  { flag: 'High charitable deductions relative to income (>30%)', risk: 'High' },
  { flag: 'Schedule C losses year after year (hobby loss rules)', risk: 'High' },
  { flag: 'Round numbers everywhere ($5,000, $10,000)', risk: 'Medium' },
  { flag: 'Home office deduction over $10,000', risk: 'Medium' },
  { flag: 'Claiming 100% business use of vehicle', risk: 'High' },
  { flag: 'Large employee business expenses (Form 2106)', risk: 'High' },
  { flag: 'Cash-intensive business (restaurants, car wash)', risk: 'High' },
  { flag: 'Foreign bank accounts not disclosed (FBAR)', risk: 'Critical' },
  { flag: 'Cryptocurrency transactions not reported', risk: 'High' },
  { flag: 'Early retirement distributions without penalty', risk: 'Medium' }
];
