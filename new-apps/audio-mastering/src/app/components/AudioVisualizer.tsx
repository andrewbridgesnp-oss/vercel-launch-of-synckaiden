import { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  color?: string;
}

export function AudioVisualizer({ isActive, color = '#D4AF37' }: AudioVisualizerProps) {
  const [bars, setBars] = useState<number[]>(Array(40).fill(0.1));

  useEffect(() => {
    if (!isActive) {
      setBars(Array(40).fill(0.1));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 0.9 + 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="relative flex items-end justify-center gap-[3px] h-24 bg-gradient-to-br from-[#1A1A24]/60 via-[#1C1626]/40 to-transparent rounded-xl px-6 border border-[#D4AF37]/20 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 to-transparent opacity-50"></div>
      
      {bars.map((height, index) => (
        <div
          key={index}
          className="relative flex-1 rounded-t-lg transition-all duration-100 ease-out shadow-lg"
          style={{
            height: `${height * 100}%`,
            backgroundColor: isActive ? color : 'rgba(229, 228, 226, 0.1)',
            opacity: isActive ? 0.9 : 0.2,
            boxShadow: isActive ? `0 0 ${height * 20}px ${color}80` : 'none',
          }}
        />
      ))}
    </div>
  );
}