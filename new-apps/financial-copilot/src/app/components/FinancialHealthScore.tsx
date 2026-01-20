import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface FinancialHealthScoreProps {
  income: number;
  expenses: number;
  netWorth: number;
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ income, expenses, netWorth }) => {
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Calculate financial health score (0-100)
    let calculatedScore = 50; // Base score

    // Positive net worth adds points
    if (netWorth > 0) {
      calculatedScore += Math.min(netWorth / 1000, 20);
    } else {
      calculatedScore -= Math.min(Math.abs(netWorth) / 1000, 20);
    }

    // Good income/expense ratio adds points
    if (income > expenses && income > 0) {
      const ratio = (income - expenses) / income;
      calculatedScore += ratio * 30;
    } else if (expenses > 0) {
      calculatedScore -= 20;
    }

    // Cap between 0-100
    calculatedScore = Math.max(0, Math.min(100, calculatedScore));
    setScore(calculatedScore);

    // Animate the score
    let startTime: number;
    let animationFrame: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedScore(calculatedScore * easeOutQuart);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [income, expenses, netWorth]);

  const getScoreColor = () => {
    if (score >= 75) return { from: '#10b981', to: '#059669', text: 'text-emerald-400', glow: 'rgba(16,185,129,0.5)' };
    if (score >= 50) return { from: '#3b82f6', to: '#2563eb', text: 'text-blue-400', glow: 'rgba(59,130,246,0.5)' };
    if (score >= 25) return { from: '#f59e0b', to: '#d97706', text: 'text-amber-400', glow: 'rgba(245,158,11,0.5)' };
    return { from: '#ef4444', to: '#dc2626', text: 'text-red-400', glow: 'rgba(239,68,68,0.5)' };
  };

  const getScoreStatus = () => {
    if (score >= 75) return { label: 'Excellent', icon: CheckCircle };
    if (score >= 50) return { label: 'Good', icon: TrendingUp };
    if (score >= 25) return { label: 'Fair', icon: AlertCircle };
    return { label: 'Needs Attention', icon: AlertCircle };
  };

  const colors = getScoreColor();
  const status = getScoreStatus();
  const StatusIcon = status.icon;
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative">
      {/* Circular Progress */}
      <div className="relative w-48 h-48 mx-auto">
        {/* Background glow */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-40"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`
          }}
        ></div>

        {/* SVG Circle */}
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="rgba(71,85,105,0.2)"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="70"
            stroke={`url(#gradient-${score})`}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${colors.glow})`
            }}
          />
          <defs>
            <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <StatusIcon className={`w-6 h-6 mb-2 ${colors.text}`} />
          <div className="text-4xl font-bold text-slate-100" style={{
            textShadow: `0 0 20px ${colors.glow}`
          }}>
            {Math.round(animatedScore)}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Score</div>
        </div>
      </div>

      {/* Status Label */}
      <div className="text-center mt-4">
        <div className={`text-lg font-bold ${colors.text}`}>{status.label}</div>
        <div className="text-xs text-slate-500 mt-1">Financial Health Status</div>
      </div>
    </div>
  );
};

export default FinancialHealthScore;
