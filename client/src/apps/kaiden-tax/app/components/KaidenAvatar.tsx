import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export type AvatarState = 'listening' | 'active' | 'standby' | 'thinking';

interface KaidenAvatarProps {
  state?: AvatarState;
  className?: string;
}

export function KaidenAvatar({ state = 'listening', className = '' }: KaidenAvatarProps) {
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (state === 'active' || state === 'thinking') {
      const interval = setInterval(() => {
        setPulseKey(prev => prev + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [state]);

  const getGlowIntensity = () => {
    switch(state) {
      case 'active': return { opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.15, 0.9] };
      case 'thinking': return { opacity: [0.2, 0.4, 0.2], scale: [0.95, 1.1, 0.95] };
      default: return { opacity: 0, scale: 0.9 };
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Ambient Glow Layer */}
      <AnimatePresence mode="wait">
        {(state === 'active' || state === 'thinking') && (
          <motion.div
            key={`pulse-${pulseKey}`}
            className="absolute inset-0 rounded-full blur-[80px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={getGlowIntensity()}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{
              background: state === 'thinking' 
                ? 'radial-gradient(circle, rgba(147, 158, 187, 0.4) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(168, 182, 216, 0.5) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Outer Ring - Status Indicator */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          opacity: state === 'standby' ? 0.2 : state === 'active' ? 0.8 : state === 'thinking' ? 0.6 : 0.4,
          scale: state === 'active' ? 1.02 : state === 'thinking' ? 1.01 : 1,
          rotate: state === 'thinking' ? 360 : 0,
        }}
        transition={{ 
          duration: state === 'thinking' ? 8 : 0.6,
          rotate: { duration: 8, repeat: state === 'thinking' ? Infinity : 0, ease: "linear" }
        }}
        style={{
          background: 'linear-gradient(135deg, rgba(168, 182, 216, 0.3), rgba(147, 158, 187, 0.15))',
          border: '2px solid rgba(168, 182, 216, 0.4)',
        }}
      />

      {/* Middle Ring - Animated */}
      <motion.div
        className="absolute inset-1 rounded-full"
        animate={{
          opacity: state === 'standby' ? 0.15 : state === 'active' ? 0.6 : state === 'thinking' ? 0.4 : 0.3,
          scale: state === 'active' ? [1, 1.01, 1] : 1,
        }}
        transition={{ 
          duration: 1.5,
          repeat: state === 'active' ? Infinity : 0,
        }}
        style={{
          background: 'linear-gradient(225deg, rgba(168, 182, 216, 0.2), rgba(147, 158, 187, 0.1))',
          border: '1px solid rgba(168, 182, 216, 0.3)',
        }}
      />

      {/* Inner Glow Ring */}
      <motion.div
        className="absolute inset-3 rounded-full"
        animate={{
          opacity: state === 'standby' ? 0.1 : state === 'active' ? 0.5 : 0.3,
          boxShadow: state === 'active' 
            ? '0 0 60px rgba(168, 182, 216, 0.6), inset 0 0 40px rgba(168, 182, 216, 0.3)'
            : state === 'thinking'
            ? '0 0 40px rgba(147, 158, 187, 0.4), inset 0 0 30px rgba(147, 158, 187, 0.2)'
            : '0 0 20px rgba(168, 182, 216, 0.2), inset 0 0 20px rgba(168, 182, 216, 0.1)',
        }}
        transition={{ duration: 0.6 }}
        style={{
          border: '1px solid rgba(168, 182, 216, 0.25)',
        }}
      />

      {/* Avatar Image Container */}
      <motion.div
        className="relative z-10 rounded-full overflow-hidden"
        style={{
          aspectRatio: '1',
          margin: '4px',
        }}
        animate={{
          opacity: state === 'standby' ? 0.5 : 1,
          filter: state === 'standby' 
            ? 'grayscale(0.5) brightness(0.6) contrast(0.9)' 
            : state === 'thinking'
            ? 'grayscale(0.1) brightness(0.95) contrast(1.05)'
            : 'grayscale(0) brightness(1) contrast(1.1)',
        }}
        transition={{ duration: 0.8 }}
      >
        {/* Portrait */}
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1720874129553-1d2e66076b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtaXhlZCUyMHJhY2UlMjB3b21hbiUyMGV4ZWN1dGl2ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc2ODM2NDgzN3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Kaiden AI Executive"
          className="w-full h-full object-cover"
          style={{
            filter: 'contrast(1.15) saturate(0.85)',
          }}
        />

        {/* Cinematic Gradient Overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.4) 100%)',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, rgba(168, 182, 216, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Vignette Effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(15, 23, 42, 0.5) 100%)',
          }}
        />

        {/* Thinking State Scan Line */}
        {state === 'thinking' && (
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-60"
            animate={{
              y: [0, 300, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: 'blur(1px)',
            }}
          />
        )}
      </motion.div>

      {/* Active State Enhanced Particle Effect */}
      {state === 'active' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                background: 'radial-gradient(circle, rgba(168, 182, 216, 1), rgba(168, 182, 216, 0.4))',
                boxShadow: '0 0 8px rgba(168, 182, 216, 0.8)',
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 3) * 120],
                y: [0, Math.sin(i * Math.PI / 3) * 120],
                opacity: [0.8, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}