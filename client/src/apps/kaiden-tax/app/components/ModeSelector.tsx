import { motion } from 'motion/react';
import { UserCheck, Users, Briefcase, FileSpreadsheet } from 'lucide-react';

export type UserMode = 'filer' | 'preparer';

interface ModeSelectorProps {
  currentMode: UserMode;
  onModeChange: (mode: UserMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex gap-3">
      <ModeButton
        mode="filer"
        currentMode={currentMode}
        onClick={() => onModeChange('filer')}
        icon={UserCheck}
        label="Individual Filer"
      />
      <ModeButton
        mode="preparer"
        currentMode={currentMode}
        onClick={() => onModeChange('preparer')}
        icon={Briefcase}
        label="Tax Preparer"
      />
    </div>
  );
}

function ModeButton({ mode, currentMode, onClick, icon: Icon, label }: any) {
  const isActive = mode === currentMode;
  
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl backdrop-blur-md border transition-all flex items-center gap-2 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400/50 text-white shadow-lg' 
          : 'bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}

/**
 * Top 10 Things Individual Filers Want to See
 */
export const FILER_PRIORITIES = [
  {
    id: 'filer-1',
    title: 'Am I getting a refund or do I owe?',
    description: 'Instant calculation of refund/owed amount',
    icon: '💰',
    priority: 1
  },
  {
    id: 'filer-2',
    title: 'How much can I save with tax strategies?',
    description: 'AI-powered optimization recommendations',
    icon: '🎯',
    priority: 2
  },
  {
    id: 'filer-3',
    title: 'What\'s my effective tax rate?',
    description: 'Real percentage of income paid in taxes',
    icon: '📊',
    priority: 3
  },
  {
    id: 'filer-4',
    title: 'Should I itemize or take standard deduction?',
    description: 'Automatic optimization between methods',
    icon: '📋',
    priority: 4
  },
  {
    id: 'filer-5',
    title: 'How much do I owe in crypto taxes?',
    description: 'Complete crypto tax calculation with wash sales',
    icon: '₿',
    priority: 5
  },
  {
    id: 'filer-6',
    title: 'What retirement contributions can I make?',
    description: 'IRA, 401k, HSA optimization strategies',
    icon: '🏦',
    priority: 6
  },
  {
    id: 'filer-7',
    title: 'When are my quarterly payments due?',
    description: 'Estimated tax payment calculator & deadlines',
    icon: '📅',
    priority: 7
  },
  {
    id: 'filer-8',
    title: 'What tax bracket am I in?',
    description: 'Marginal vs effective rate visualization',
    icon: '📈',
    priority: 8
  },
  {
    id: 'filer-9',
    title: 'Can I deduct my home office?',
    description: 'Home office, mileage, and business deduction calculator',
    icon: '🏠',
    priority: 9
  },
  {
    id: 'filer-10',
    title: 'What documents do I need?',
    description: 'Personalized checklist based on your income sources',
    icon: '📄',
    priority: 10
  }
];

/**
 * Top 10 Things Tax Preparers Want to See
 */
export const PREPARER_PRIORITIES = [
  {
    id: 'preparer-1',
    title: 'Client data import from QuickBooks/Xero',
    description: 'One-click import of P&L, expenses, and transactions',
    icon: '📥',
    priority: 1
  },
  {
    id: 'preparer-2',
    title: 'Multi-client management dashboard',
    description: 'Track status of all returns in progress',
    icon: '👥',
    priority: 2
  },
  {
    id: 'preparer-3',
    title: 'Audit risk assessment',
    description: 'Automatic red flag detection and risk scoring',
    icon: '⚠️',
    priority: 3
  },
  {
    id: 'preparer-4',
    title: 'Tax law reference library',
    description: 'Instant access to IRS publications and CPA best practices',
    icon: '📚',
    priority: 4
  },
  {
    id: 'preparer-5',
    title: 'Client organizer & document checklist',
    description: 'Auto-generated based on client profile',
    icon: '✅',
    priority: 5
  },
  {
    id: 'preparer-6',
    title: 'Side-by-side prior year comparison',
    description: 'Compare current vs prior year with variance analysis',
    icon: '🔄',
    priority: 6
  },
  {
    id: 'preparer-7',
    title: 'CSV export for client review',
    description: 'Share calculations via CSV for transparency',
    icon: '📤',
    priority: 7
  },
  {
    id: 'preparer-8',
    title: 'Tax planning scenarios',
    description: 'What-if analysis for different strategies',
    icon: '🎲',
    priority: 8
  },
  {
    id: 'preparer-9',
    title: 'Depreciation schedule builder',
    description: 'Asset tracking with Section 179, MACRS, Bonus',
    icon: '🏗️',
    priority: 9
  },
  {
    id: 'preparer-10',
    title: 'Quality control checklist',
    description: 'Pre-filing review with diagnostic checks',
    icon: '🔍',
    priority: 10
  }
];

/**
 * Benefits for Each Mode
 */
export const MODE_BENEFITS = {
  filer: {
    title: 'Individual Filer Mode',
    subtitle: 'Maximize your refund and minimize your taxes',
    benefits: [
      'Instant refund/owed calculation',
      'AI finds thousands in tax savings',
      'Crypto tax automation (FIFO/LIFO/HIFO)',
      'Retirement contribution optimizer',
      'Simple, guided interface',
      'Mobile-friendly for on-the-go filing'
    ],
    cta: 'Start Your Return'
  },
  preparer: {
    title: 'Tax Preparer Mode',
    subtitle: 'Manage hundreds of clients with ease',
    benefits: [
      'QuickBooks & Xero integration',
      'Multi-client dashboard',
      'Audit risk assessment',
      'Built-in tax law reference',
      'CSV import/export for collaboration',
      'Quality control automation'
    ],
    cta: 'Access Preparer Tools'
  }
};