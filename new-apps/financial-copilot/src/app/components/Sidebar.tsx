import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Receipt, Target, FileText, Settings, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 min-h-screen border-r border-slate-700/50 flex flex-col" style={{
      background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.95) 100%)',
      boxShadow: '4px 0 20px rgba(0,0,0,0.3)'
    }}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative p-2 rounded-xl" style={{
              background: 'linear-gradient(145deg, #cbd5e1, #94a3b8)',
              boxShadow: '6px 6px 12px #0a1628, -6px -6px 12px #1e293b'
            }}>
              <Shield className="w-6 h-6 text-slate-800" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide" style={{
              background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              FinanceCo
            </h1>
            <p className="text-xs text-slate-500 font-medium">PILOT</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive
                  ? 'text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(145deg, rgba(59,130,246,0.15), rgba(37,99,235,0.1))',
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), 2px 2px 8px rgba(59,130,246,0.2)',
              borderLeft: '3px solid #3b82f6'
            } : {}}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 transition-all duration-300 group"
          style={{
            background: 'linear-gradient(145deg, rgba(30,41,59,0.5), rgba(15,23,42,0.5))',
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
