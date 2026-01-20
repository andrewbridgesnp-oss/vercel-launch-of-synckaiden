// KAIDEN CAPITAL™ - Navigation Sidebar

import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TrustScoreBadge } from './TrustScoreBadge';
import {
  LayoutDashboard,
  Map,
  CheckSquare,
  DollarSign,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Users,
  Shield,
} from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { currentView, setCurrentView, user, logout, dashboardStats } = useApp();

  const navigation = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'funding-map',
      name: 'Funding Map',
      icon: Map,
      badge: dashboardStats?.recommendationsCount || 0,
    },
    {
      id: 'readiness',
      name: 'Readiness Plan',
      icon: CheckSquare,
      badge: null,
    },
    {
      id: 'services',
      name: 'Fast Path Services',
      icon: Sparkles,
      badge: null,
    },
    {
      id: 'engines',
      name: 'Specialized Engines',
      icon: Building2,
      badge: 'New',
    },
  ];

  if (user?.role === 'partner' || user?.role === 'admin') {
    navigation.push({
      id: 'partner-portal',
      name: 'Partner Portal',
      icon: Users,
      badge: null,
    });
  }

  if (user?.role === 'admin') {
    navigation.push({
      id: 'admin-dashboard',
      name: 'Admin',
      icon: Shield,
      badge: null,
    });
  }

  const handleNavigation = (viewId: string) => {
    setCurrentView(viewId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 w-72 bg-gradient-to-b from-[#0a0d1f] to-[#1a2133] text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                KAIDEN <span className="kaiden-gradient-text">CAPITAL</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1">Capital Operating System</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold">
                  {user.profile.firstName} {user.profile.lastName}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <TrustScoreBadge trustScore={user.trustScore} size="sm" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto kaiden-scrollbar">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all',
                currentView === item.id
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 font-medium">{item.name}</span>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => handleNavigation('settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
          <div className="pt-2 text-xs text-gray-500 text-center">
            <p>© 2026 Kaiden Capital™</p>
            <p className="mt-1">All Rights Reserved</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const MobileMenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="lg:hidden fixed top-4 left-4 z-30 bg-white shadow-lg"
      onClick={onClick}
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
};