import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing');

  const stages = [
    'Initializing Neural Networks',
    'Loading AI Models',
    'Establishing Secure Connection',
    'Calibrating Executive Systems',
    'Ready'
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  useEffect(() => {
    const stageIndex = Math.floor((progress / 100) * stages.length);
    setStage(stages[Math.min(stageIndex, stages.length - 1)]);
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50 flex items-center justify-center">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(168, 182, 216, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 182, 216, 0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Ambient Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: 'radial-gradient(circle, rgba(168, 182, 216, 0.6), transparent)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-12 px-8">
        {/* Logo/Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 
            className="text-7xl font-light mb-4 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #a8b6d8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            KAIDEN
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-[0.3em] uppercase">
            AI Executive Intelligence
          </p>
        </motion.div>

        {/* Progress Circle */}
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="rgba(168, 182, 216, 0.1)"
              strokeWidth="3"
              fill="none"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                strokeDasharray: "1000",
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(168, 182, 216, 1)" />
                <stop offset="100%" stopColor="rgba(147, 158, 187, 1)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl text-slate-200 font-light">
              {progress}%
            </span>
          </div>
        </div>

        {/* Status Text */}
        <motion.div
          className="text-center"
          key={stage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-slate-300 text-sm font-medium tracking-wide">
            {stage}
          </p>
          <div className="flex items-center justify-center gap-1 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom Security Indicators */}
        <div className="flex items-center gap-6 text-xs text-slate-500 tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            <span>SECURE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
            <span>ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
