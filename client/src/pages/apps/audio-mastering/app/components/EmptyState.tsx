import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }[];
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actions,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#D4AF37] blur-3xl opacity-20 rounded-full"></div>
        <div className="relative bg-gradient-to-br from-[#1A1A24] to-[#1C1626] border-2 border-[#D4AF37]/30 rounded-2xl p-6">
          <Icon className="w-16 h-16 text-[#D4AF37]" />
        </div>
      </div>
      
      <h3 className="text-2xl font-['Cormorant_Garamond'] text-[#E5E4E2] mb-3 tracking-wide">
        {title}
      </h3>
      
      <p className="text-[#E5E4E2]/60 max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className={
                action.variant === 'default'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941C] hover:from-[#F4E4C1] hover:to-[#D4AF37] text-[#0A0A0F] font-semibold shadow-lg shadow-[#D4AF37]/30'
                  : action.variant === 'outline'
                  ? 'border-2 border-[#D4AF37]/40 hover:border-[#D4AF37]/80 text-[#E5E4E2] hover:bg-[#D4AF37]/10'
                  : 'text-[#E5E4E2]/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
              }
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
