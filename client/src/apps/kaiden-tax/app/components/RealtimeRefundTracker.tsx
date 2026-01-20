import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Zap, Target, Award, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { calculateTaxReturn } from '@/lib/taxEngine';

interface RefundTrackerProps {
  formData: any;
  onSuggestionClick?: (suggestion: string) => void;
}

export function RealtimeRefundTracker({ formData, onSuggestionClick }: RefundTrackerProps) {
  const [currentRefund, setCurrentRefund] = useState(0);
  const [previousRefund, setPreviousRefund] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [suggestions, setSuggestions] = useState<Array<{
    title: string;
    impact: number;
    description: string;
    action: string;
  }>>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Calculate refund in real-time
  useEffect(() => {
    if (!formData.income) return;

    try {
      const result = calculateTaxReturn({
        filingStatus: formData.filingStatus || 'single',
        income: parseFloat(formData.income) || 0,
        federalWithholding: parseFloat(formData.federalWithholding) || 0,
        stateWithholding: parseFloat(formData.stateWithholding) || 0,
        deductions: {
          standard: true,
          itemized: parseFloat(formData.itemizedDeductions) || 0,
          studentLoanInterest: parseFloat(formData.studentLoanInterest) || 0,
          irargeCharitableContributions: parseFloat(formData.charitableContributions) || 0,
          medicalExpenses: parseFloat(formData.medicalExpenses) || 0,
          stateLocalTaxes: parseFloat(formData.stateLocalTaxes) || 0,
        },
        credits: {
          childTaxCredit: parseFloat(formData.childTaxCredit) || 0,
          earnedIncomeCredit: parseFloat(formData.earnedIncomeCredit) || 0,
          educationCredits: parseFloat(formData.educationCredits) || 0,
        },
      });

      const refund = result.federalRefund + result.stateRefund;
      
      setPreviousRefund(currentRefund);
      setCurrentRefund(refund);
      setChangeAmount(refund - currentRefund);

      // Show celebration for big positive changes
      if (refund - currentRefund > 100) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }

      // Generate AI suggestions
      generateSuggestions(formData, result);
    } catch (error) {
      console.error('Tax calculation error:', error);
    }
  }, [formData]);

  const generateSuggestions = (data: any, result: any) => {
    const newSuggestions = [];
    const income = parseFloat(data.income) || 0;

    // IRA contribution suggestion
    const iraContribution = parseFloat(data.iraContribution) || 0;
    if (iraContribution < 7000 && income > 30000) {
      const potentialSavings = Math.min(7000 - iraContribution, income * 0.22); // Assume 22% bracket
      newSuggestions.push({
        title: '🎯 Maximize IRA Contribution',
        impact: Math.round(potentialSavings),
        description: `You can contribute $${(7000 - iraContribution).toLocaleString()} more to your IRA`,
        action: 'Add IRA contribution'
      });
    }

    // Charitable contribution suggestion
    const charity = parseFloat(data.charitableContributions) || 0;
    if (charity < 500 && income > 50000) {
      newSuggestions.push({
        title: '❤️ Charitable Donations',
        impact: 110,
        description: 'Donating $500 to charity could increase your refund',
        action: 'Add charitable donation'
      });
    }

    // Student loan interest
    if (!data.studentLoanInterest && income < 85000) {
      newSuggestions.push({
        title: '🎓 Student Loan Interest',
        impact: 550,
        description: 'You can deduct up to $2,500 in student loan interest',
        action: 'Add student loan interest'
      });
    }

    // Home office deduction
    if (!data.homeOfficeDeduction && data.selfEmployed) {
      newSuggestions.push({
        title: '🏠 Home Office Deduction',
        impact: 1200,
        description: 'Self-employed? You might qualify for home office deduction',
        action: 'Calculate home office'
      });
    }

    // Next tax bracket warning
    const nextBracket = getNextTaxBracket(income, data.filingStatus);
    if (nextBracket && income > nextBracket - 5000) {
      newSuggestions.push({
        title: '⚠️ Tax Bracket Alert',
        impact: 0,
        description: `You're $${(nextBracket - income).toLocaleString()} away from next bracket. Consider deferring income.`,
        action: 'View strategies'
      });
    }

    setSuggestions(newSuggestions.slice(0, 3)); // Show top 3
  };

  const getNextTaxBracket = (income: number, filingStatus: string) => {
    const brackets = [11000, 44725, 95375, 182100, 231250, 578125];
    return brackets.find(bracket => bracket > income);
  };

  const refundDiff = currentRefund - previousRefund;
  const isPositive = refundDiff > 0;

  return (
    <div className="sticky top-24 space-y-4">
      {/* Main Refund Display */}
      <motion.div
        className="relative p-8 rounded-3xl overflow-hidden"
        style={{
          background: currentRefund >= 0
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
          border: currentRefund >= 0
            ? '2px solid rgba(16, 185, 129, 0.3)'
            : '2px solid rgba(239, 68, 68, 0.3)',
        }}
        animate={showCelebration ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {showCelebration && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-green-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, -100],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-400">
              {currentRefund >= 0 ? 'Estimated Refund' : 'Amount Owed'}
            </span>
            {changeAmount !== 0 && previousRefund !== 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-1 text-sm font-semibold ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isPositive ? '+' : ''}${Math.abs(changeAmount).toLocaleString()}
              </motion.div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentRefund}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`text-6xl font-bold mb-4 ${
                currentRefund >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              ${Math.abs(currentRefund).toLocaleString()}
            </motion.div>
          </AnimatePresence>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-slate-400">Updates in real-time</span>
          </div>
        </div>
      </motion.div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
          </div>

          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4, scale: 1.02 }}
              onClick={() => onSuggestionClick?.(suggestion.action)}
              className="w-full p-4 rounded-2xl text-left group"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {suggestion.title}
                </h4>
                {suggestion.impact > 0 && (
                  <span className="text-sm font-bold text-green-400">
                    +${suggestion.impact}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-2">
                {suggestion.description}
              </p>
              <div className="flex items-center gap-1 text-xs text-purple-400 group-hover:gap-2 transition-all">
                <span>{suggestion.action}</span>
                <span>→</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Progress to next milestone */}
      {currentRefund < 5000 && currentRefund >= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-400">Next Milestone</span>
            <span className="text-sm text-slate-400">
              ${(5000 - currentRefund).toLocaleString()} to go
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentRefund / 5000) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Reach $5,000 refund to unlock "Tax Optimizer" achievement 🏆
          </p>
        </motion.div>
      )}

      {/* Celebration Achievement */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.1))',
              border: '2px solid rgba(234, 179, 8, 0.4)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-500/20">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-yellow-400">Nice work!</h4>
                <p className="text-xs text-slate-300">
                  You just increased your refund by ${Math.abs(changeAmount).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}