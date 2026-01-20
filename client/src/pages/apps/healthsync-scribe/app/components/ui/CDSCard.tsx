import { AlertTriangle, FileText, Code, HeartPulse, X } from 'lucide-react';
import { EvidenceChip, Evidence } from './EvidenceChip';
import { useState } from 'react';

export type CDSCardType = 'safety' | 'documentation' | 'coding' | 'care-gap';

interface CDSCardProps {
  type: CDSCardType;
  title: string;
  description: string;
  evidence?: Evidence[];
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  dismissible?: boolean;
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

export function CDSCard({ 
  type, 
  title, 
  description, 
  evidence, 
  actions, 
  dismissible = false,
  priority = 'medium' 
}: CDSCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const typeConfig = {
    safety: { 
      bg: 'bg-red-50', 
      border: 'border-red-300', 
      iconBg: 'bg-red-100',
      icon: <AlertTriangle className="w-5 h-5 text-red-700" />,
      label: 'Safety Alert'
    },
    documentation: { 
      bg: 'bg-blue-50', 
      border: 'border-blue-300', 
      iconBg: 'bg-blue-100',
      icon: <FileText className="w-5 h-5 text-blue-700" />,
      label: 'Documentation'
    },
    coding: { 
      bg: 'bg-purple-50', 
      border: 'border-purple-300', 
      iconBg: 'bg-purple-100',
      icon: <Code className="w-5 h-5 text-purple-700" />,
      label: 'Coding Prompt'
    },
    'care-gap': { 
      bg: 'bg-green-50', 
      border: 'border-green-300', 
      iconBg: 'bg-green-100',
      icon: <HeartPulse className="w-5 h-5 text-green-700" />,
      label: 'Care Gap'
    },
  };

  const config = typeConfig[type];
  const borderWidth = priority === 'critical' ? 'border-2' : 'border';

  return (
    <div className={`${config.bg} ${borderWidth} ${config.border} rounded-lg p-4 relative`}>
      {dismissible && (
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 p-1 hover:bg-white/50 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className={`${config.iconBg} rounded-lg p-2 flex-shrink-0`}>
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {config.label}
            </span>
            {priority === 'critical' && (
              <span className="text-xs font-bold text-red-700 uppercase">CRITICAL</span>
            )}
          </div>

          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-700 mb-3">{description}</p>

          {evidence && evidence.length > 0 && (
            <div className="mb-3">
              <EvidenceChip evidence={evidence} />
            </div>
          )}

          {actions && actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    action.variant === 'primary'
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
