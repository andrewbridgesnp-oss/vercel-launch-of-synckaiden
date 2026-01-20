import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, TrendingUp, Video, Calendar, DollarSign, Database, Settings, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/trends', icon: TrendingUp, label: 'Trends' },
    { path: '/videos', icon: Video, label: 'Videos' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/affiliates', icon: DollarSign, label: 'Affiliates' },
    { path: '/capabilities', icon: Database, label: 'Capabilities' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase font-mono text-primary">SYNDICA</h1>
          <p className="text-xs text-muted-foreground font-mono">FORGE</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all font-mono text-sm ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-primary-glow'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon size={18} />
                <span className="uppercase tracking-wider text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          data-testid="logout-button"
          className="flex items-center gap-3 px-4 py-3 rounded-sm text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all font-mono text-sm"
        >
          <LogOut size={18} />
          <span className="uppercase tracking-wider text-xs">Logout</span>
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}