import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RefundDisplayProps {
  amount: number;
  isRefund: boolean;
  breakdown?: {
    federal: number;
    state: number;
    selfEmployment?: number;
  };
}

export function AnimatedRefundDisplay({ amount, isRefund, breakdown }: RefundDisplayProps) {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = amount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= amount) {
        setDisplayAmount(amount);
        clearInterval(timer);
      } else {
        setDisplayAmount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [amount]);

  return (
    <div className="relative">
      {/* Main Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="relative p-12 rounded-3xl text-center overflow-hidden"
        style={{
          background: isRefund
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
          border: isRefund
            ? '2px solid rgba(16, 185, 129, 0.3)'
            : '2px solid rgba(239, 68, 68, 0.3)',
        }}
      >
        {/* Animated Background Circles */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full"
            style={{
              background: isRefund
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent)'
                : 'radial-gradient(circle, rgba(239, 68, 68, 0.4), transparent)',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full"
            style={{
              background: isRefund
                ? 'radial-gradient(circle, rgba(5, 150, 105, 0.3), transparent)'
                : 'radial-gradient(circle, rgba(220, 38, 38, 0.3), transparent)',
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            {isRefund ? (
              <>
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span className="text-lg font-semibold text-green-400">
                  Your Estimated Refund
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="w-6 h-6 text-red-400" />
                <span className="text-lg font-semibold text-red-400">
                  Amount You Owe
                </span>
              </>
            )}
          </motion.div>

          {/* Amount */}
          <motion.div
            className="mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 8, delay: 0.3 }}
          >
            <div className={`text-7xl font-bold mb-2 ${
              isRefund ? 'text-green-400' : 'text-red-400'
            }`}>
              ${displayAmount.toLocaleString()}
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, delay: 0.5 }}
              className="h-1 mx-auto max-w-xs rounded-full"
              style={{
                background: isRefund
                  ? 'linear-gradient(90deg, #10b981, #059669)'
                  : 'linear-gradient(90deg, #ef4444, #dc2626)',
              }}
            />
          </motion.div>

          {/* Breakdown */}
          {breakdown && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              <div className="p-4 rounded-xl bg-slate-900/50 backdrop-blur">
                <div className="text-sm text-slate-400 mb-1">Federal</div>
                <div className="text-xl font-semibold text-white">
                  ${Math.abs(breakdown.federal).toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 backdrop-blur">
                <div className="text-sm text-slate-400 mb-1">State</div>
                <div className="text-xl font-semibold text-white">
                  ${Math.abs(breakdown.state).toLocaleString()}
                </div>
              </div>
              {breakdown.selfEmployment !== undefined && (
                <div className="p-4 rounded-xl bg-slate-900/50 backdrop-blur">
                  <div className="text-sm text-slate-400 mb-1">Self-Emp</div>
                  <div className="text-xl font-semibold text-white">
                    ${Math.abs(breakdown.selfEmployment).toLocaleString()}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: isRefund ? '#10b981' : '#ef4444',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -60],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: 2 + i * 0.1,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Animated Donut Chart
interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  centerLabel?: string;
  centerValue?: string;
}

export function AnimatedDonutChart({ data, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background Circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(30, 41, 59, 1)"
          strokeWidth="30"
        />

        {/* Data Segments */}
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle += angle;

          // Calculate arc path
          const startX = 100 + 80 * Math.cos((startAngle - 90) * (Math.PI / 180));
          const startY = 100 + 80 * Math.sin((startAngle - 90) * (Math.PI / 180));
          const endX = 100 + 80 * Math.cos((endAngle - 90) * (Math.PI / 180));
          const endY = 100 + 80 * Math.sin((endAngle - 90) * (Math.PI / 180));
          const largeArc = angle > 180 ? 1 : 0;

          return (
            <motion.path
              key={item.label}
              d={`M ${startX} ${startY} A 80 80 0 ${largeArc} 1 ${endX} ${endY}`}
              fill="none"
              stroke={item.color}
              strokeWidth="30"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.5,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {centerLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center"
          >
            <div className="text-sm text-slate-400 mb-1">{centerLabel}</div>
            <div className="text-3xl font-bold text-white">{centerValue}</div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ background: item.color }}
            />
            <div>
              <div className="text-sm text-slate-400">{item.label}</div>
              <div className="text-lg font-semibold text-white">
                ${item.value.toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Comparison Slider
interface ComparisonSliderProps {
  scenarios: Array<{
    name: string;
    refund: number;
    description: string;
  }>;
}

export function TaxScenarioComparison({ scenarios }: ComparisonSliderProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6">Compare Scenarios</h3>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => {
          const isSelected = selected === index;
          const isBest = scenario.refund === Math.max(...scenarios.map(s => s.refund));

          return (
            <motion.button
              key={scenario.name}
              onClick={() => setSelected(index)}
              className="relative p-6 rounded-2xl text-left overflow-hidden"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.1))'
                  : 'rgba(30, 41, 59, 0.5)',
                border: isSelected
                  ? '2px solid rgba(59, 130, 246, 0.5)'
                  : '1px solid rgba(71, 85, 105, 0.5)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isBest && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900"
                >
                  Best Option
                </motion.div>
              )}

              <div className="mb-4">
                <div className="text-sm text-slate-400 mb-1">{scenario.name}</div>
                <div className="text-3xl font-bold text-white">
                  ${scenario.refund.toLocaleString()}
                </div>
              </div>

              <p className="text-sm text-slate-400">{scenario.description}</p>

              {isSelected && (
                <motion.div
                  layoutId="selectedIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Scenario Details */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl"
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(71, 85, 105, 0.5)',
        }}
      >
        <h4 className="text-lg font-semibold text-white mb-4">
          {scenarios[selected].name} Details
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Estimated Refund', value: `$${scenarios[selected].refund.toLocaleString()}` },
            { label: 'Effective Rate', value: '18.2%' },
            { label: 'Deductions', value: '$24,500' },
            { label: 'Credits', value: '$2,000' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
              <div className="text-xl font-semibold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
