import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, CheckCircle, Zap, Target, Award, Shield, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TaxScoreProps {
  taxData: any;
  calculationResult: any;
}

interface ScoreFactor {
  category: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
}

export function TaxScoreDashboard({ taxData, calculationResult }: TaxScoreProps) {
  const [overallScore, setOverallScore] = useState(0);
  const [scoreFactors, setScoreFactors] = useState<ScoreFactor[]>([]);
  const [grade, setGrade] = useState('');
  const [potentialSavings, setPotentialSavings] = useState(0);

  useEffect(() => {
    calculateTaxScore();
  }, [taxData, calculationResult]);

  const calculateTaxScore = () => {
    const factors: ScoreFactor[] = [];
    let totalScore = 0;
    let totalPossible = 0;
    let savings = 0;

    // 1. DEDUCTION OPTIMIZATION (25 points)
    const deductionScore = analyzeDeductions();
    factors.push(deductionScore);
    totalScore += deductionScore.score;
    totalPossible += deductionScore.maxScore;

    // 2. TAX WITHHOLDING (20 points)
    const withholdingScore = analyzeWithholding();
    factors.push(withholdingScore);
    totalScore += withholdingScore.score;
    totalPossible += withholdingScore.maxScore;

    // 3. RETIREMENT CONTRIBUTIONS (20 points)
    const retirementScore = analyzeRetirement();
    factors.push(retirementScore);
    totalScore += retirementScore.score;
    totalPossible += retirementScore.maxScore;
    savings += (20 - retirementScore.score) * 250; // Estimate $250 per point

    // 4. ENTITY OPTIMIZATION (15 points)
    const entityScore = analyzeEntityStructure();
    factors.push(entityScore);
    totalScore += entityScore.score;
    totalPossible += entityScore.maxScore;
    savings += (15 - entityScore.score) * 400;

    // 5. TIMING & PLANNING (10 points)
    const timingScore = analyzeTiming();
    factors.push(timingScore);
    totalScore += timingScore.score;
    totalPossible += timingScore.maxScore;

    // 6. AUDIT RISK (10 points)
    const auditScore = analyzeAuditRisk();
    factors.push(auditScore);
    totalScore += auditScore.score;
    totalPossible += auditScore.maxScore;

    const finalScore = Math.round((totalScore / totalPossible) * 100);
    setOverallScore(finalScore);
    setScoreFactors(factors);
    setPotentialSavings(savings);

    // Assign letter grade
    if (finalScore >= 90) setGrade('A+');
    else if (finalScore >= 85) setGrade('A');
    else if (finalScore >= 80) setGrade('B+');
    else if (finalScore >= 75) setGrade('B');
    else if (finalScore >= 70) setGrade('C+');
    else if (finalScore >= 65) setGrade('C');
    else setGrade('D');
  };

  const analyzeDeductions = (): ScoreFactor => {
    const income = parseFloat(taxData.income) || 0;
    const deductions = parseFloat(taxData.itemizedDeductions) || 0;
    const standardDeduction = 14600; // 2024 single
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 25;

    // Check if using standard when should itemize
    if (deductions < standardDeduction * 0.8 && income > 75000) {
      score -= 8;
      issues.push('Using standard deduction - may be missing itemized opportunities');
      recommendations.push('Review charitable donations, state taxes, and medical expenses');
    }

    // Check for common missed deductions
    if (!taxData.homeOfficeDeduction && taxData.selfEmployed) {
      score -= 5;
      issues.push('No home office deduction claimed');
      recommendations.push('Calculate home office deduction if you work from home');
    }

    if (!taxData.studentLoanInterest && income < 85000) {
      score -= 4;
      issues.push('No student loan interest reported');
      recommendations.push('You can deduct up to $2,500 in student loan interest');
    }

    if (!taxData.charitableContributions && income > 50000) {
      score -= 3;
      issues.push('No charitable contributions reported');
      recommendations.push('Donate to qualified charities for tax deduction');
    }

    if (score >= 22) return { category: 'Deduction Optimization', score, maxScore: 25, status: 'excellent', issues, recommendations };
    if (score >= 18) return { category: 'Deduction Optimization', score, maxScore: 25, status: 'good', issues, recommendations };
    if (score >= 12) return { category: 'Deduction Optimization', score, maxScore: 25, status: 'warning', issues, recommendations };
    return { category: 'Deduction Optimization', score, maxScore: 25, status: 'critical', issues, recommendations };
  };

  const analyzeWithholding = (): ScoreFactor => {
    const income = parseFloat(taxData.income) || 0;
    const withholding = parseFloat(taxData.federalWithholding) || 0;
    const estimatedTax = income * 0.15; // Rough estimate
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 20;

    const refund = withholding - estimatedTax;
    
    // Large refund = gave government interest-free loan
    if (refund > 3000) {
      score -= 8;
      issues.push(`Large refund expected ($${Math.round(refund).toLocaleString()}) - you overpaid`);
      recommendations.push('Adjust W-4 withholding to keep more money throughout the year');
    } else if (refund > 1500) {
      score -= 4;
      issues.push('Moderate overpayment throughout the year');
      recommendations.push('Consider reducing withholding slightly');
    }

    // Owing too much = potential penalties
    if (refund < -1000) {
      score -= 10;
      issues.push('Significant underpayment - may trigger penalties');
      recommendations.push('Increase withholding or make quarterly estimated payments');
    }

    if (score >= 18) return { category: 'Tax Withholding', score, maxScore: 20, status: 'excellent', issues, recommendations };
    if (score >= 14) return { category: 'Tax Withholding', score, maxScore: 20, status: 'good', issues, recommendations };
    if (score >= 10) return { category: 'Tax Withholding', score, maxScore: 20, status: 'warning', issues, recommendations };
    return { category: 'Tax Withholding', score, maxScore: 20, status: 'critical', issues, recommendations };
  };

  const analyzeRetirement = (): ScoreFactor => {
    const income = parseFloat(taxData.income) || 0;
    const iraContribution = parseFloat(taxData.iraContribution) || 0;
    const k401Contribution = parseFloat(taxData.retirement401k) || 0;
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 20;

    if (income > 40000) {
      // IRA not maxed
      if (iraContribution < 7000) {
        score -= 8;
        const remaining = 7000 - iraContribution;
        issues.push(`IRA not maxed out ($${remaining.toLocaleString()} remaining)`);
        recommendations.push(`Contribute $${remaining.toLocaleString()} more to IRA to save ~$${Math.round(remaining * 0.22).toLocaleString()}`);
      }

      // 401k not maxed
      if (k401Contribution < 23000 && income > 70000) {
        score -= 6;
        issues.push('401(k) contributions could be higher');
        recommendations.push('Consider increasing 401(k) to reduce taxable income');
      }

      // No HSA
      if (!taxData.hsaContribution && income > 50000) {
        score -= 4;
        issues.push('No HSA contributions detected');
        recommendations.push('If eligible, HSA provides triple tax advantage');
      }
    }

    if (score >= 18) return { category: 'Retirement Planning', score, maxScore: 20, status: 'excellent', issues, recommendations };
    if (score >= 14) return { category: 'Retirement Planning', score, maxScore: 20, status: 'good', issues, recommendations };
    if (score >= 10) return { category: 'Retirement Planning', score, maxScore: 20, status: 'warning', issues, recommendations };
    return { category: 'Retirement Planning', score, maxScore: 20, status: 'critical', issues, recommendations };
  };

  const analyzeEntityStructure = (): ScoreFactor => {
    const selfEmploymentIncome = parseFloat(taxData.selfEmploymentIncome) || 0;
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 15;

    if (selfEmploymentIncome > 50000 && !taxData.sCorpElection) {
      score -= 10;
      const seTax = selfEmploymentIncome * 0.153;
      const potentialSavings = seTax * 0.4; // ~40% reduction with S-corp
      issues.push('High self-employment income without S-Corp election');
      recommendations.push(`Consider S-Corp election to save ~$${Math.round(potentialSavings).toLocaleString()} in SE tax`);
    }

    if (selfEmploymentIncome > 100000 && !taxData.qbiDeduction) {
      score -= 5;
      issues.push('Missing QBI (Qualified Business Income) deduction');
      recommendations.push('Claim 20% QBI deduction on pass-through income');
    }

    if (score >= 13) return { category: 'Entity Optimization', score, maxScore: 15, status: 'excellent', issues, recommendations };
    if (score >= 10) return { category: 'Entity Optimization', score, maxScore: 15, status: 'good', issues, recommendations };
    if (score >= 6) return { category: 'Entity Optimization', score, maxScore: 15, status: 'warning', issues, recommendations };
    return { category: 'Entity Optimization', score, maxScore: 15, status: 'critical', issues, recommendations };
  };

  const analyzeTiming = (): ScoreFactor => {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 10;

    const today = new Date();
    const taxDeadline = new Date(today.getFullYear(), 3, 15); // April 15

    // Filing early
    if (today < new Date(today.getFullYear(), 1, 15)) {
      // Before Feb 15 = excellent
      recommendations.push('Great job filing early! You can get your refund sooner.');
    } else if (today > new Date(today.getFullYear(), 3, 10)) {
      // After April 10 = cutting it close
      score -= 3;
      issues.push('Filing close to deadline');
      recommendations.push('File earlier next year to avoid stress and potential errors');
    }

    // Tax planning throughout year
    if (!taxData.quarterlyPaymentsMade && taxData.selfEmployed) {
      score -= 4;
      issues.push('No quarterly estimated payments tracked');
      recommendations.push('Make quarterly payments to avoid penalties');
    }

    if (score >= 8) return { category: 'Timing & Planning', score, maxScore: 10, status: 'excellent', issues, recommendations };
    if (score >= 6) return { category: 'Timing & Planning', score, maxScore: 10, status: 'good', issues, recommendations };
    if (score >= 4) return { category: 'Timing & Planning', score, maxScore: 10, status: 'warning', issues, recommendations };
    return { category: 'Timing & Planning', score, maxScore: 10, status: 'critical', issues, recommendations };
  };

  const analyzeAuditRisk = (): ScoreFactor => {
    const income = parseFloat(taxData.income) || 0;
    const deductions = parseFloat(taxData.itemizedDeductions) || 0;
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 10;

    // High deduction to income ratio
    const deductionRatio = income > 0 ? deductions / income : 0;
    if (deductionRatio > 0.5) {
      score -= 5;
      issues.push('⚠️ Very high deduction-to-income ratio (>50%)');
      recommendations.push('Ensure you have receipts and documentation for all deductions');
    } else if (deductionRatio > 0.35) {
      score -= 2;
      issues.push('Elevated deduction ratio - ensure documentation');
    }

    // Home office on W-2
    if (taxData.homeOfficeDeduction && !taxData.selfEmployed) {
      score -= 3;
      issues.push('⚠️ Home office deduction as W-2 employee (high audit risk)');
      recommendations.push('Remove unless you have documentation of employer requirement');
    }

    // Round numbers
    const hasRoundNumbers = deductions % 1000 === 0 && deductions > 0;
    if (hasRoundNumbers) {
      score -= 2;
      issues.push('Round number deductions may trigger review');
      recommendations.push('Use exact amounts from receipts');
    }

    if (score >= 9) return { category: 'Audit Risk Management', score, maxScore: 10, status: 'excellent', issues, recommendations };
    if (score >= 7) return { category: 'Audit Risk Management', score, maxScore: 10, status: 'good', issues, recommendations };
    if (score >= 5) return { category: 'Audit Risk Management', score, maxScore: 10, status: 'warning', issues, recommendations };
    return { category: 'Audit Risk Management', score, maxScore: 10, status: 'critical', issues, recommendations };
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return { bg: 'from-green-500 to-emerald-600', text: 'text-green-400', border: 'border-green-500/30' };
    if (score >= 70) return { bg: 'from-blue-500 to-blue-600', text: 'text-blue-400', border: 'border-blue-500/30' };
    if (score >= 50) return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    return { bg: 'from-red-500 to-red-600', text: 'text-red-400', border: 'border-red-500/30' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'good': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-400" />;
    }
  };

  const colors = getScoreColor(overallScore);

  return (
    <div className="space-y-6">
      {/* Overall Tax Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative p-8 rounded-3xl overflow-hidden border-2 ${colors.border}`}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
        }}
      >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${colors.bg}`} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-1">Your Tax Intelligence Score</h3>
              <p className="text-xs text-slate-500">Like a credit score, but for your taxes</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/20">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          <div className="flex items-end gap-6 mb-6">
            {/* Score */}
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className={`text-7xl font-bold ${colors.text}`}
              >
                {overallScore}
              </motion.div>
              <div className="text-xs text-slate-400">out of 100</div>
            </div>

            {/* Grade */}
            <div className="mb-2">
              <div className={`text-4xl font-bold ${colors.text}`}>{grade}</div>
              <div className="text-xs text-slate-400">Grade</div>
            </div>

            {/* Potential Savings */}
            {potentialSavings > 0 && (
              <div className="mb-2 ml-auto text-right">
                <div className="text-2xl font-bold text-green-400">
                  ${potentialSavings.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Potential Savings</div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${colors.bg}`}
            />
          </div>

          {/* Quick Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-slate-300"
          >
            {overallScore >= 85 && '🏆 Excellent! Your tax strategy is highly optimized.'}
            {overallScore >= 70 && overallScore < 85 && '✅ Good job! A few improvements could save you more.'}
            {overallScore >= 50 && overallScore < 70 && '⚠️ You\'re leaving money on the table. See recommendations below.'}
            {overallScore < 50 && '🚨 Critical issues detected. Let\'s fix your tax strategy.'}
          </motion.p>
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Score Breakdown
        </h4>

        {scoreFactors.map((factor, index) => (
          <motion.div
            key={factor.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-2xl border"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderColor: 'rgba(168, 182, 216, 0.2)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(factor.status)}
                <div>
                  <h5 className="text-sm font-semibold text-white">{factor.category}</h5>
                  <p className="text-xs text-slate-400">
                    {factor.score} / {factor.maxScore} points
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {Math.round((factor.score / factor.maxScore) * 100)}%
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full bg-gradient-to-r ${getScoreColor((factor.score / factor.maxScore) * 100).bg}`}
                style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
              />
            </div>

            {/* Issues */}
            {factor.issues.length > 0 && (
              <div className="mb-3">
                {factor.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-yellow-400 mb-1">
                    <span>•</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {factor.recommendations.length > 0 && (
              <div>
                {factor.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-green-400 mb-1">
                    <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Achievement Unlock */}
      {overallScore >= 90 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl border-2 border-yellow-500/30"
          style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(202, 138, 4, 0.05))',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-500/20">
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-yellow-400 mb-1">
                Achievement Unlocked: Tax Master 🏆
              </h4>
              <p className="text-sm text-slate-300">
                You're in the top 10% of tax optimizers. Share your success!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
