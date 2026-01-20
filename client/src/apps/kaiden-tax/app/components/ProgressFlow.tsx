import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface ProgressFlowProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function ProgressFlow({ steps, currentStep, onStepClick }: ProgressFlowProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="relative mb-12">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2" />
        
        {/* Progress Line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2"
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;

            return (
              <motion.button
                key={step.id}
                onClick={() => onStepClick?.(index)}
                className="group relative flex flex-col items-center"
                whileHover={isCompleted || isCurrent ? { scale: 1.1 } : {}}
                whileTap={isCompleted || isCurrent ? { scale: 0.95 } : {}}
              >
                {/* Circle */}
                <motion.div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center mb-3"
                  style={{
                    background: isCompleted || isCurrent
                      ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                      : 'rgba(30, 41, 59, 1)',
                    border: isFuture ? '2px solid rgba(71, 85, 105, 1)' : 'none',
                  }}
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Glow Effect */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        filter: 'blur(20px)',
                        opacity: 0.6,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0.3, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Icon or Check */}
                  <div className="relative z-10">
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Check className="w-8 h-8 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className={isFuture ? 'text-slate-500' : 'text-white'}
                        >
                          {step.icon}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Label */}
                <motion.div
                  className="text-center max-w-[120px]"
                  initial={false}
                  animate={{
                    opacity: isFuture ? 0.5 : 1,
                  }}
                >
                  <div className={`text-sm font-semibold mb-1 ${
                    isCurrent 
                      ? 'text-blue-400' 
                      : isCompleted 
                      ? 'text-green-400' 
                      : 'text-slate-500'
                  }`}>
                    {step.title}
                  </div>
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-slate-400"
                    >
                      {step.description}
                    </motion.div>
                  )}
                </motion.div>

                {/* Active Indicator */}
                {isCurrent && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="p-8 rounded-3xl"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500">
              {steps[currentStep].icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-400">
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Step percentage */}
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Celebration Component (when user completes all steps)
export function CelebrationModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative max-w-md w-full p-8 rounded-3xl text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti Animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i % 4],
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i / 30) * Math.PI * 2) * 150,
                y: Math.sin((i / 30) * Math.PI * 2) * 150,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.02,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
            <Check className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-2"
        >
          🎉 All Done!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-300 mb-6"
        >
          Your tax return is ready! We found{' '}
          <span className="font-bold text-green-400">$2,450</span> in additional deductions.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-8 py-4 rounded-2xl font-semibold"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
          }}
        >
          View Your Results
          <ChevronRight className="inline-block w-5 h-5 ml-2" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
