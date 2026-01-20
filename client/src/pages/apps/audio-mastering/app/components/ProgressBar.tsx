interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  estimatedTime?: string;
  className?: string;
}

export function ProgressBar({ 
  progress, 
  label, 
  showPercentage = true,
  estimatedTime,
  className = '' 
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || estimatedTime) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-[#E5E4E2]/80">{label}</span>}
          {estimatedTime && (
            <span className="text-[#D4AF37]/80 text-xs">
              Est. {estimatedTime}
            </span>
          )}
        </div>
      )}
      
      <div className="relative w-full h-3 bg-gradient-to-r from-[#1A1A24] to-[#1C1626] border border-[#D4AF37]/20 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1] shadow-lg shadow-[#D4AF37]/50 transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
        
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-[#0A0A0F] drop-shadow-lg mix-blend-difference">
              {Math.round(clampedProgress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
