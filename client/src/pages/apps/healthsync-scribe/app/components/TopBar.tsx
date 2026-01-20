import { ChevronDown, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';
import { UserRole } from '../App';

interface TopBarProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  patientName?: string;
  onLogout?: () => void;
}

export function TopBar({ userRole, onRoleChange, patientName, onLogout }: TopBarProps) {
  return (
    <div className="h-16 bg-white border-b border-silver-300 flex items-center justify-between px-6 luxury-shadow">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-navy rounded-lg flex items-center justify-center luxury-shadow">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-navy-900">Kaiden Scribe</div>
              <div className="text-xs text-silver-600">AI Clinical Platform</div>
            </div>
          </div>
        </div>
        
        {patientName && (
          <div className="flex items-center gap-2 px-4 py-2 bg-navy-50 border border-navy-200 rounded-lg luxury-shadow">
            <div className="w-2 h-2 bg-navy-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-navy-900">{patientName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-silver-100 rounded-lg relative transition-all">
          <Bell className="w-5 h-5 text-silver-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full ring-2 ring-white"></span>
        </button>
        
        <button className="p-2 hover:bg-silver-100 rounded-lg transition-all">
          <HelpCircle className="w-5 h-5 text-silver-700" />
        </button>
        
        <button className="p-2 hover:bg-silver-100 rounded-lg transition-all">
          <Settings className="w-5 h-5 text-silver-700" />
        </button>

        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 bg-silver-100 hover:bg-silver-200 rounded-lg transition-all luxury-shadow">
            <div className="w-8 h-8 gradient-navy rounded-full flex items-center justify-center luxury-shadow">
              <span className="text-white text-sm font-semibold">
                {userRole === 'Front Desk' ? 'FD' : userRole[0]}
              </span>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-navy-900">{userRole}</div>
              <div className="text-xs text-silver-600">Dr. Sarah Chen</div>
            </div>
            <ChevronDown className="w-4 h-4 text-silver-600" />
          </button>

          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg luxury-shadow-lg border border-silver-300 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="px-4 py-2 border-b border-silver-200">
              <div className="text-xs font-semibold text-silver-600 uppercase tracking-wider mb-2">Switch Role</div>
            </div>
            {(['Provider', 'MA', 'Front Desk', 'Pharmacy', 'Lab', 'Admin', 'Patient'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`w-full px-4 py-2 text-left text-sm transition-all ${
                  role === userRole ? 'bg-navy-50 text-navy-900 font-semibold border-l-2 border-navy-600' : 'text-silver-700 hover:bg-silver-50'
                }`}
              >
                {role}
              </button>
            ))}
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full px-4 py-2 text-left text-sm transition-all text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 inline-block mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}