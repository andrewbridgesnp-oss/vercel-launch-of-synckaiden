import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  shortcut?: string;
  delay?: number;
}

export function Tooltip({ 
  content, 
  children, 
  side = 'top',
  shortcut,
  delay = 500 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#1A1A24] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1A1A24] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#1A1A24] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#1A1A24] border-y-transparent border-l-transparent',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute ${positionClasses[side]} z-50 pointer-events-none`}>
          <div className="bg-[#1A1A24] border border-[#D4AF37]/30 rounded-lg px-3 py-2 shadow-2xl shadow-[#D4AF37]/20 backdrop-blur-xl">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[#E5E4E2] text-sm">{content}</span>
              {shortcut && (
                <kbd className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-xs text-[#D4AF37] font-mono">
                  {shortcut}
                </kbd>
              )}
            </div>
          </div>
          <div className={`absolute ${arrowClasses[side]} w-0 h-0 border-4`}></div>
        </div>
      )}
    </div>
  );
}
