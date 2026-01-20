import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  variant?: 'compact' | 'full';
}

export function VoiceWaveform({ isActive, variant = 'compact' }: VoiceWaveformProps) {
  const [bars] = useState(() => 
    variant === 'compact' ? 24 : 48
  );

  return (
    <div className="flex items-center justify-center gap-[2px] h-full">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 0.05;
        const baseHeight = variant === 'compact' ? 4 : 8;
        
        return (
          <motion.div
            key={i}
            className="bg-gradient-to-t from-slate-400 to-slate-300 rounded-full"
            style={{
              width: variant === 'compact' ? '2px' : '3px',
            }}
            animate={isActive ? {
              height: [
                baseHeight,
                Math.random() * (variant === 'compact' ? 32 : 64) + baseHeight,
                baseHeight
              ],
              opacity: [0.3, 1, 0.3]
            } : {
              height: baseHeight,
              opacity: 0.2
            }}
            transition={{
              duration: 0.8,
              repeat: isActive ? Infinity : 0,
              delay: delay,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
}
