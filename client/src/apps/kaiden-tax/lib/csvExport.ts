import { TaxReturn } from './taxEngine';

export function exportTaxReturnAsCSV(taxReturn: Partial<TaxReturn>): void {
  // Flatten the tax return data
  const flatData: Record<string, any> = {
    // Personal Information
    'Filing Status': taxReturn.filingStatus,
    'State': taxReturn.state,
    
    // Income
    'W-2 Wages': taxReturn.w2Income,
    'Self Employment Income': taxReturn.selfEmploymentIncome,
    'Interest Income': taxReturn.interestIncome,
    'Dividend Income (Qualified)': taxReturn.qualifiedDividends,
    'Dividend Income (Ordinary)': taxReturn.ordinaryDividends,
    'Capital Gains (Short-term)': taxReturn.shortTermCapitalGains,
    'Capital Gains (Long-term)': taxReturn.longTermCapitalGains,
    'Rental Income': taxReturn.rentalIncome,
    'Retirement Distributions': taxReturn.retirementDistributions,
    'Crypto Income': taxReturn.cryptoIncome,
    
    // Deductions
    'Standard Deduction': taxReturn.standardDeduction,
    'Itemized Deductions': taxReturn.itemizedDeductions,
    'IRA Contributions': taxReturn.iraContributions,
    'HSA Contributions': taxReturn.hsaContributions,
    'Student Loan Interest': taxReturn.studentLoanInterest,
    'Charitable Contributions': taxReturn.charitableContributions,
    'State Local Tax (SALT)': taxReturn.saltDeduction,
    'Mortgage Interest': taxReturn.mortgageInterest,
    'Medical Expenses': taxReturn.medicalExpenses,
    'Business Expenses': taxReturn.businessExpenses,
    
    // Credits
    'Child Tax Credit': taxReturn.childTaxCredit,
    'Education Credits': taxReturn.educationCredits,
    'Earned Income Credit': taxReturn.earnedIncomeCredit,
    
    // Calculated Values
    'Adjusted Gross Income (AGI)': taxReturn.adjustedGrossIncome,
    'Taxable Income': taxReturn.taxableIncome,
    'Federal Tax': taxReturn.federalTax,
    'State Tax': taxReturn.stateTax,
    'Self Employment Tax': taxReturn.selfEmploymentTax,
    'Total Tax Owed': taxReturn.totalTax,
    'Refund/Owed': taxReturn.refundOrOwed,
    'Effective Tax Rate': taxReturn.effectiveTaxRate ? `${(taxReturn.effectiveTaxRate * 100).toFixed(2)}%` : '',
  };

  // Create CSV content
  let csvContent = 'Field,Value\n';
  
  for (const [field, value] of Object.entries(flatData)) {
    if (value !== undefined && value !== null && value !== '') {
      const escapedValue = typeof value === 'string' 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
      csvContent += `"${field}",${escapedValue}\n`;
    }
  }

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `KAIDEN_Tax_Return_${new Date().getFullYear()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportCryptoTransactionsAsCSV(transactions: any[]): void {
  if (!transactions || transactions.length === 0) {
    return;
  }

  // Create CSV header
  let csvContent = 'Date,Type,Asset,Amount,Price,Total,Fee,Gain/Loss\n';
  
  // Add rows
  transactions.forEach(tx => {
    const row = [
      tx.date,
      tx.type,
      tx.asset,
      tx.amount,
      tx.price,
      tx.total,
      tx.fee || 0,
      tx.gainLoss || ''
    ].map(val => {
      const str = String(val);
      return str.includes(',') ? `"${str}"` : str;
    }).join(',');
    
    csvContent += row + '\n';
  });

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `KAIDEN_Crypto_Transactions_${new Date().getFullYear()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
