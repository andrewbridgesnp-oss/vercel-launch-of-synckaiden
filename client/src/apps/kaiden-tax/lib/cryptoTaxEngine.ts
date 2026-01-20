/**
 * KAIDEN Crypto Tax Calculation Engine
 * Professional crypto tax calculations with wash sale detection
 */

export interface CryptoTransaction {
  id: string;
  date: Date;
  type: 'buy' | 'sell' | 'trade' | 'income' | 'gift' | 'stake' | 'airdrop';
  asset: string;
  amount: number;
  costBasis: number;
  fairMarketValue: number;
  exchange: string;
  description?: string;
}

export interface CryptoHolding {
  asset: string;
  quantity: number;
  averageCostBasis: number;
  currentValue: number;
  unrealizedGainLoss: number;
}

export interface CryptoTaxResult {
  shortTermGains: number;
  longTermGains: number;
  ordinaryIncome: number; // Mining, staking, airdrops
  totalTaxableGains: number;
  totalTaxableIncome: number;
  washSales: WashSale[];
  holdings: CryptoHolding[];
  transactions: CryptoTransaction[];
  taxLiability: number;
  recommendations: CryptoTaxOptimization[];
}

export interface WashSale {
  originalSale: CryptoTransaction;
  repurchase: CryptoTransaction;
  disallowedLoss: number;
  daysApart: number;
}

export interface CryptoTaxOptimization {
  id: string;
  type: 'harvest' | 'hold' | 'timing' | 'method';
  title: string;
  description: string;
  potentialSavings: number;
  action: string;
  deadline?: string;
}

/**
 * Calculate capital gains/losses for crypto transactions
 */
export function calculateCryptoGains(
  transactions: CryptoTransaction[],
  method: 'fifo' | 'lifo' | 'hifo' = 'fifo'
): CryptoTaxResult {
  const holdings = new Map<string, CryptoTransaction[]>();
  const shortTermGains: number[] = [];
  const longTermGains: number[] = [];
  const ordinaryIncome: number[] = [];
  const washSales: WashSale[] = [];
  const processedTransactions: CryptoTransaction[] = [];

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const transaction of sortedTransactions) {
    const { asset, type, amount, costBasis, fairMarketValue, date } = transaction;

    if (type === 'buy') {
      // Add to holdings
      if (!holdings.has(asset)) {
        holdings.set(asset, []);
      }
      holdings.get(asset)!.push(transaction);
      processedTransactions.push(transaction);

    } else if (type === 'sell' || type === 'trade') {
      // Calculate gains/losses
      const assetHoldings = holdings.get(asset) || [];
      
      if (assetHoldings.length === 0) {
        // No cost basis (shouldn't happen in real scenario)
        continue;
      }

      // Apply accounting method
      let selectedHoldings: CryptoTransaction[] = [];
      if (method === 'fifo') {
        selectedHoldings = assetHoldings.slice(0);
      } else if (method === 'lifo') {
        selectedHoldings = [...assetHoldings].reverse();
      } else if (method === 'hifo') {
        selectedHoldings = [...assetHoldings].sort((a, b) => b.costBasis - a.costBasis);
      }

      let remainingAmount = amount;
      const gains: number[] = [];

      for (const holding of selectedHoldings) {
        if (remainingAmount <= 0) break;

        const amountToSell = Math.min(remainingAmount, holding.amount);
        const basisForAmount = (holding.costBasis / holding.amount) * amountToSell;
        const proceedsForAmount = (fairMarketValue / amount) * amountToSell;
        const gain = proceedsForAmount - basisForAmount;

        // Determine if short-term or long-term
        const daysHeld = Math.floor((date.getTime() - holding.date.getTime()) / (1000 * 60 * 60 * 24));
        const isLongTerm = daysHeld > 365;

        if (isLongTerm) {
          longTermGains.push(gain);
        } else {
          shortTermGains.push(gain);
        }

        // Check for wash sales (within 30 days)
        if (gain < 0) {
          const washSale = detectWashSale(transaction, sortedTransactions, 30);
          if (washSale) {
            washSales.push(washSale);
          }
        }

        // Update holding
        holding.amount -= amountToSell;
        remainingAmount -= amountToSell;
      }

      // Remove empty holdings
      holdings.set(asset, assetHoldings.filter(h => h.amount > 0));
      processedTransactions.push(transaction);

    } else if (type === 'income' || type === 'stake' || type === 'airdrop') {
      // Ordinary income (taxed at ordinary rates)
      ordinaryIncome.push(fairMarketValue);
      
      // Also adds to holdings at FMV as cost basis
      if (!holdings.has(asset)) {
        holdings.set(asset, []);
      }
      holdings.get(asset)!.push({
        ...transaction,
        costBasis: fairMarketValue
      });
      processedTransactions.push(transaction);
    }
  }

  // Calculate current holdings
  const currentHoldings: CryptoHolding[] = [];
  holdings.forEach((txns, asset) => {
    const totalQuantity = txns.reduce((sum, t) => sum + t.amount, 0);
    const totalCost = txns.reduce((sum, t) => sum + t.costBasis, 0);
    const avgCostBasis = totalQuantity > 0 ? totalCost / totalQuantity : 0;
    
    // Get current price (simplified - would need real price API)
    const currentPrice = txns[txns.length - 1]?.fairMarketValue / txns[txns.length - 1]?.amount || avgCostBasis;
    const currentValue = totalQuantity * currentPrice;
    const unrealizedGainLoss = currentValue - totalCost;

    currentHoldings.push({
      asset,
      quantity: totalQuantity,
      averageCostBasis: avgCostBasis,
      currentValue,
      unrealizedGainLoss
    });
  });

  const totalShortTermGains = shortTermGains.reduce((a, b) => a + b, 0);
  const totalLongTermGains = longTermGains.reduce((a, b) => a + b, 0);
  const totalOrdinaryIncome = ordinaryIncome.reduce((a, b) => a + b, 0);

  // Calculate tax liability (simplified)
  const shortTermTax = totalShortTermGains * 0.24; // Assume 24% bracket
  const longTermTax = totalLongTermGains * 0.15; // Long-term capital gains rate
  const incomeTax = totalOrdinaryIncome * 0.24;
  const totalTaxLiability = shortTermTax + longTermTax + incomeTax;

  // Generate recommendations
  const recommendations = generateCryptoOptimizations(
    currentHoldings,
    totalShortTermGains,
    totalLongTermGains,
    washSales
  );

  return {
    shortTermGains: totalShortTermGains,
    longTermGains: totalLongTermGains,
    ordinaryIncome: totalOrdinaryIncome,
    totalTaxableGains: totalShortTermGains + totalLongTermGains,
    totalTaxableIncome: totalOrdinaryIncome,
    washSales,
    holdings: currentHoldings,
    transactions: processedTransactions,
    taxLiability: totalTaxLiability,
    recommendations
  };
}

/**
 * Detect wash sales (selling at loss and repurchasing within 30 days)
 */
function detectWashSale(
  saleTransaction: CryptoTransaction,
  allTransactions: CryptoTransaction[],
  windowDays: number
): WashSale | null {
  const saleDate = saleTransaction.date.getTime();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;

  // Look for repurchases within 30 days before or after
  const repurchase = allTransactions.find(t => {
    if (t.type !== 'buy') return false;
    if (t.asset !== saleTransaction.asset) return false;
    
    const diff = Math.abs(t.date.getTime() - saleDate);
    return diff <= windowMs && diff > 0;
  });

  if (repurchase) {
    const loss = saleTransaction.costBasis - saleTransaction.fairMarketValue;
    const daysApart = Math.floor(Math.abs(repurchase.date.getTime() - saleDate) / (1000 * 60 * 60 * 24));

    return {
      originalSale: saleTransaction,
      repurchase,
      disallowedLoss: loss,
      daysApart
    };
  }

  return null;
}

/**
 * Generate crypto tax optimization recommendations
 */
function generateCryptoOptimizations(
  holdings: CryptoHolding[],
  shortTermGains: number,
  longTermGains: number,
  washSales: WashSale[]
): CryptoTaxOptimization[] {
  const optimizations: CryptoTaxOptimization[] = [];

  // Tax-loss harvesting opportunities
  const holdingsWithLosses = holdings.filter(h => h.unrealizedGainLoss < -1000);
  if (holdingsWithLosses.length > 0) {
    const totalLosses = holdingsWithLosses.reduce((sum, h) => sum + Math.abs(h.unrealizedGainLoss), 0);
    optimizations.push({
      id: 'crypto-harvest-1',
      type: 'harvest',
      title: 'Harvest Crypto Losses',
      description: `You have $${totalLosses.toLocaleString()} in unrealized losses across ${holdingsWithLosses.length} assets. Harvesting these can offset gains and reduce up to $3,000 of ordinary income.`,
      potentialSavings: Math.min(totalLosses, shortTermGains + longTermGains + 3000) * 0.24,
      action: 'Sell losing positions before year-end',
      deadline: 'December 31, 2024'
    });
  }

  // Hold short-term gains to convert to long-term
  const holdingsNearLongTerm = holdings.filter(h => h.unrealizedGainLoss > 1000);
  if (holdingsNearLongTerm.length > 0 && shortTermGains > 0) {
    optimizations.push({
      id: 'crypto-hold-1',
      type: 'hold',
      title: 'Convert to Long-Term Gains',
      description: 'Consider holding appreciated assets past the one-year mark to benefit from lower long-term capital gains rates (0%, 15%, or 20% vs. ordinary income rates).',
      potentialSavings: shortTermGains * 0.09, // Difference between 24% ordinary and 15% LTCG
      action: 'Review holding periods before selling'
    });
  }

  // Wash sale warnings
  if (washSales.length > 0) {
    const totalDisallowed = washSales.reduce((sum, ws) => sum + ws.disallowedLoss, 0);
    optimizations.push({
      id: 'crypto-wash-1',
      type: 'timing',
      title: 'Avoid Wash Sales',
      description: `${washSales.length} potential wash sales detected. $${totalDisallowed.toLocaleString()} in losses may be disallowed. Wait 31 days after selling at a loss before repurchasing.`,
      potentialSavings: totalDisallowed * 0.24,
      action: 'Review transaction timing to avoid wash sales'
    });
  }

  // FIFO vs HIFO method optimization
  if (holdings.length > 0) {
    optimizations.push({
      id: 'crypto-method-1',
      type: 'method',
      title: 'Optimize Accounting Method',
      description: 'Consider using HIFO (Highest In, First Out) method to minimize gains when selling. This can significantly reduce your tax bill compared to FIFO.',
      potentialSavings: shortTermGains * 0.1, // Estimated savings
      action: 'Specify HIFO method for crypto sales'
    });
  }

  // DeFi staking income optimization
  if (longTermGains > 10000) {
    optimizations.push({
      id: 'crypto-defer-1',
      type: 'timing',
      title: 'Defer Gains to Next Year',
      description: 'If you\'re on the edge of a tax bracket, consider deferring some sales to next year to stay in a lower bracket or qualify for 0% long-term capital gains rate.',
      potentialSavings: 5000,
      action: 'Analyze bracket thresholds and defer sales strategically'
    });
  }

  return optimizations.sort((a, b) => b.potentialSavings - a.potentialSavings);
}

/**
 * Calculate crypto mining income
 */
export function calculateMiningIncome(blocks: {
  date: Date;
  coinsMined: number;
  fmvAtMining: number;
  expenses: number;
}[]): {
  grossIncome: number;
  expenses: number;
  netIncome: number;
  selfEmploymentTax: number;
} {
  const grossIncome = blocks.reduce((sum, b) => sum + (b.coinsMined * b.fmvAtMining), 0);
  const expenses = blocks.reduce((sum, b) => sum + b.expenses, 0);
  const netIncome = grossIncome - expenses;
  
  // Mining is considered self-employment income
  const selfEmploymentTax = netIncome * 0.9235 * 0.153; // SE tax rate

  return {
    grossIncome,
    expenses,
    netIncome,
    selfEmploymentTax
  };
}

/**
 * Calculate NFT sales taxes
 */
export function calculateNFTTax(nftSales: {
  purchaseDate: Date;
  saleDate: Date;
  costBasis: number;
  salePrice: number;
  isCollectible: boolean;
}[]): {
  totalGains: number;
  collectibleGains: number;
  collectibleTax: number;
  regularTax: number;
} {
  let collectibleGains = 0;
  let regularGains = 0;

  for (const sale of nftSales) {
    const gain = sale.salePrice - sale.costBasis;
    const daysHeld = Math.floor((sale.saleDate.getTime() - sale.purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
    const isLongTerm = daysHeld > 365;

    if (sale.isCollectible && isLongTerm) {
      // Collectibles have special 28% max rate
      collectibleGains += gain;
    } else {
      regularGains += gain;
    }
  }

  const collectibleTax = collectibleGains * 0.28;
  const regularTax = regularGains * 0.15; // Assume 15% LTCG rate

  return {
    totalGains: collectibleGains + regularGains,
    collectibleGains,
    collectibleTax,
    regularTax
  };
}

/**
 * Import transactions from exchange CSV
 */
export function parseExchangeCSV(csvData: string, exchange: 'coinbase' | 'binance' | 'kraken'): CryptoTransaction[] {
  // Simplified parser - real implementation would handle different CSV formats
  const lines = csvData.split('\n').slice(1); // Skip header
  const transactions: CryptoTransaction[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',');
    
    // This is simplified - each exchange has different CSV format
    transactions.push({
      id: `${exchange}-${i}`,
      date: new Date(parts[0]),
      type: parts[1].toLowerCase() as any,
      asset: parts[2],
      amount: parseFloat(parts[3]),
      costBasis: parseFloat(parts[4]),
      fairMarketValue: parseFloat(parts[5]),
      exchange,
      description: parts[6]
    });
  }

  return transactions;
}
