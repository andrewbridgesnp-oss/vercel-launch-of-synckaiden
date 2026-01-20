import { 
  Calendar, 
  ClipboardCheck, 
  Video, 
  FileText, 
  Code, 
  Clipboard, 
  HeartPulse, 
  FolderOpen, 
  MessageSquare, 
  FileCheck, 
  Shield,
  Settings
} from 'lucide-react';
import { NavSection, UserRole } from '../App';

interface LeftNavProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  userRole: UserRole;
}

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  badge?: string;
}

export function LeftNav({ activeSection, onNavigate, userRole }: LeftNavProps) {
  const navItems: NavItem[] = [
    { id: 'today', label: 'Today', icon: <Calendar className="w-5 h-5" />, roles: ['Provider', 'MA', 'Front Desk', 'Pharmacy', 'Lab', 'Admin'], badge: '8' },
    { id: 'pre-visit', label: 'Pre-Visit Readiness', icon: <ClipboardCheck className="w-5 h-5" />, roles: ['Provider', 'MA', 'Front Desk'] },
    { id: 'active-visit', label: 'Active Visit', icon: <Video className="w-5 h-5" />, roles: ['Provider', 'MA'] },
    { id: 'draft-note', label: 'Draft Note', icon: <FileText className="w-5 h-5" />, roles: ['Provider'] },
    { id: 'coding', label: 'Coding & MDM', icon: <Code className="w-5 h-5" />, roles: ['Provider', 'Front Desk'] },
    { id: 'orders', label: 'Orders Staging', icon: <Clipboard className="w-5 h-5" />, roles: ['Provider', 'Pharmacy', 'Lab'] },
    { id: 'care-gaps', label: 'Care Gaps', icon: <HeartPulse className="w-5 h-5" />, roles: ['Provider', 'MA'], badge: '3' },
    { id: 'records', label: 'Records', icon: <FolderOpen className="w-5 h-5" />, roles: ['Provider', 'MA', 'Lab'] },
    { id: 'messages', label: 'Messages & Tasks', icon: <MessageSquare className="w-5 h-5" />, roles: ['Provider', 'MA', 'Front Desk', 'Pharmacy', 'Lab'], badge: '12' },
    { id: 'avs', label: 'Patient AVS', icon: <FileCheck className="w-5 h-5" />, roles: ['Provider', 'MA'] },
    { id: 'admin', label: 'Admin & Audit', icon: <Shield className="w-5 h-5" />, roles: ['Admin', 'Provider'] },
    { id: 'config', label: 'Configuration', icon: <Settings className="w-5 h-5" />, roles: ['Admin'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-navy-900 border-r border-navy-700 flex flex-col luxury-shadow-lg">
      <div className="p-6 border-b border-navy-700">
        <div className="text-xs font-semibold text-silver-400 uppercase tracking-wider mb-1">
          HealthSync Scribe
        </div>
        <div className="text-sm text-silver-200 font-light mt-1">
          Document. Decide. Deliver.
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-navy-700 text-white font-semibold shadow-lg shadow-navy-950/50'
                  : 'text-silver-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-navy-300' : 'text-silver-400'}>
                {item.icon}
              </span>
              <span className="flex-1 text-left text-sm">{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                  isActive 
                    ? 'bg-navy-600 text-white' 
                    : 'bg-navy-800 text-silver-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-700 bg-navy-950/50">
        <div className="flex items-center gap-2 text-xs text-silver-400">
          <Shield className="w-3 h-3" />
          <span>HIPAA-Ready • SMART on FHIR</span>
        </div>
      </div>
    </div>
  );
}