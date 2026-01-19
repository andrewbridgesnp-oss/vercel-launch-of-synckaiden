import { getDb } from '../db';

export interface AppAuditStatus {
  name: string;
  slug: string;
  category: string;
  price: number;
  roiTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  hasBackend: boolean;
  hasFrontend: boolean;
  hasDatabase: boolean;
  completionStatus: 'Complete' | 'Partial' | 'Missing';
  completionPercentage: number;
  missingComponents: string[];
}

// Map of apps with backend routers
const appsWithBackend = new Set([
  'ai-funding-brokerage',
  'avery-ai-receptionist',
  'atlas-academy',
  'build-wealth-pro',
  'contract-generator',
  'creative-clash-live',
  'dynasty-trust',
  'email-marketing',
  'employee-os',
  'expense-tracker',
  'financial-co-pilot',
  'help-desk',
  'inventory-manager',
  'invoice-generator',
  'lead-management',
  'llc-formation',
  'marketing-os',
  'order-management',
  'project-nexus',
  'sales-crm',
  'social-media-autopilot',
  'comprehensive-tax-app',
  'time-tracker',
  'vital-sync',
  'youtube-automation',
]);

// Map of apps with frontend pages
const appsWithFrontend = new Set([
  'ai-funding-brokerage',
  'agent-swarm',
  'atlas-academy',
  'audio-mastering',
  'avery-ai-receptionist',
  'creative-clash-live',
  'health-sync-scribe',
  'marketing-os',
  'pantry-inventory',
  'social-media-autopilot',
  'spam-slayer',
  'comprehensive-tax-app',
  'vital-sync',
  'youtube-automation',
]);

// ROI Tier mapping
const roiTierMap: Record<string, 'Tier 1' | 'Tier 2' | 'Tier 3'> = {
  'comprehensive-tax-app': 'Tier 1',
  'avery-ai-receptionist': 'Tier 1',
  'social-media-autopilot': 'Tier 1',
  'youtube-automation': 'Tier 1',
  'marketing-os': 'Tier 1',
  'llc-formation': 'Tier 1',
  'dynasty-trust': 'Tier 1',
  'employee-os': 'Tier 1',
  'sales-crm': 'Tier 1',
  'build-wealth-pro': 'Tier 1',
  
  'ai-funding-brokerage': 'Tier 2',
  'financial-co-pilot': 'Tier 2',
  'vital-sync': 'Tier 2',
  'atlas-academy': 'Tier 2',
  'agent-swarm': 'Tier 2',
  'creative-clash-live': 'Tier 2',
  'pantry-inventory': 'Tier 2',
  'audio-mastering': 'Tier 2',
  'health-sync-scribe': 'Tier 2',
  'spam-slayer': 'Tier 2',
};

function getCompletionStatus(hasBackend: boolean, hasFrontend: boolean, hasDatabase: boolean): {
  status: 'Complete' | 'Partial' | 'Missing';
  percentage: number;
  missing: string[];
} {
  const missing: string[] = [];
  if (!hasBackend) missing.push('Backend');
  if (!hasFrontend) missing.push('Frontend');
  if (!hasDatabase) missing.push('Database');
  
  const completedComponents = [hasBackend, hasFrontend, hasDatabase].filter(Boolean).length;
  const percentage = Math.round((completedComponents / 3) * 100);
  
  let status: 'Complete' | 'Partial' | 'Missing';
  if (percentage === 100) status = 'Complete';
  else if (percentage > 0) status = 'Partial';
  else status = 'Missing';
  
  return { status, percentage, missing };
}

export async function getAllAppsAudit(): Promise<AppAuditStatus[]> {
  // Fetch all apps from database
  const { getAllApps } = await import('../db');
  const apps = await getAllApps();
  
  return apps.map(app => {
    const hasBackend = appsWithBackend.has(app.slug);
    const hasFrontend = appsWithFrontend.has(app.slug);
    const hasDatabase = true; // All apps are seeded in database
    
    const { status, percentage, missing } = getCompletionStatus(hasBackend, hasFrontend, hasDatabase);
    
    return {
      name: app.name,
      slug: app.slug,
      category: app.category,
      price: app.price,
      roiTier: roiTierMap[app.slug] || 'Tier 3',
      hasBackend,
      hasFrontend,
      hasDatabase,
      completionStatus: status,
      completionPercentage: percentage,
      missingComponents: missing,
    };
  });
}

export async function getAuditSummary() {
  const apps = await getAllAppsAudit();
  
  const total = apps.length;
  const complete = apps.filter(a => a.completionStatus === 'Complete').length;
  const partial = apps.filter(a => a.completionStatus === 'Partial').length;
  const missing = apps.filter(a => a.completionStatus === 'Missing').length;
  
  const tier1Complete = apps.filter(a => a.roiTier === 'Tier 1' && a.completionStatus === 'Complete').length;
  const tier1Total = apps.filter(a => a.roiTier === 'Tier 1').length;
  
  const tier2Complete = apps.filter(a => a.roiTier === 'Tier 2' && a.completionStatus === 'Complete').length;
  const tier2Total = apps.filter(a => a.roiTier === 'Tier 2').length;
  
  const tier3Complete = apps.filter(a => a.roiTier === 'Tier 3' && a.completionStatus === 'Complete').length;
  const tier3Total = apps.filter(a => a.roiTier === 'Tier 3').length;
  
  return {
    total,
    complete,
    partial,
    missing,
    overallPercentage: Math.round((complete / total) * 100),
    tier1: { complete: tier1Complete, total: tier1Total, percentage: Math.round((tier1Complete / tier1Total) * 100) },
    tier2: { complete: tier2Complete, total: tier2Total, percentage: Math.round((tier2Complete / tier2Total) * 100) },
    tier3: { complete: tier3Complete, total: tier3Total, percentage: Math.round((tier3Complete / tier3Total) * 100) },
  };
}
