import { useState } from 'react';
import { 
  Home, 
  Calculator, 
  Bitcoin, 
  FileText, 
  Upload, 
  Sparkles, 
  CreditCard,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { supabase } from '@/lib/supabase';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: any;
  onPricingClick: () => void;
}

export function Navigation({ currentView, onNavigate, user, onPricingClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: Sparkles },
    { id: 'tax-dashboard', label: 'Tax Calculator', icon: Calculator },
    { id: 'crypto-calculator', label: 'Crypto Tax', icon: Bitcoin },
    { id: 'import', label: 'Import CSV', icon: Upload },
  ];

  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const isActive = currentView === item.id;
    
    return (
      <button
        onClick={() => {
          onNavigate(item.id);
          setMobileMenuOpen(false);
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full"
        style={{
          background: isActive 
            ? 'linear-gradient(135deg, rgba(168, 182, 216, 0.2), rgba(147, 158, 187, 0.15))'
            : 'transparent',
          color: isActive ? '#e2e8f0' : '#94a3b8',
          border: isActive ? '1px solid rgba(168, 182, 216, 0.3)' : '1px solid transparent'
        }}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col p-6 z-50"
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
          borderRight: '1px solid rgba(168, 182, 216, 0.2)',
        }}
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 182, 216, 0.3), rgba(147, 158, 187, 0.2))',
              }}
            >
              <Sparkles className="w-6 h-6 text-slate-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">KAIDEN</h1>
              <p className="text-xs text-slate-400">Tax Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <NavButton key={item.id} item={item} />
          ))}
          
          <div className="pt-4 border-t border-slate-700/50 mt-4">
            <button
              onClick={onPricingClick}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.15))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#a7f3d0'
              }}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Upgrade</span>
            </button>
          </div>
        </nav>

        {/* User Section */}
        <div className="pt-4 border-t border-slate-700/50">
          {user ? (
            <div className="space-y-2">
              <div className="px-4 py-2 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300 truncate">{user.email}</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg w-full text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('signup')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg w-full text-sm"
              style={{
                background: 'rgba(168, 182, 216, 0.1)',
                color: '#e2e8f0'
              }}
            >
              <User className="w-4 h-4" />
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
          borderBottom: '1px solid rgba(168, 182, 216, 0.2)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-slate-200" />
            <span className="text-lg font-bold text-slate-100">KAIDEN</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg"
            style={{ background: 'rgba(168, 182, 216, 0.1)' }}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-200" />
            ) : (
              <Menu className="w-6 h-6 text-slate-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-20"
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
          }}
        >
          <div className="p-6 space-y-2">
            {navItems.map(item => (
              <NavButton key={item.id} item={item} />
            ))}
            
            <div className="pt-4">
              <button
                onClick={() => {
                  onPricingClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.15))',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#a7f3d0'
                }}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Upgrade</span>
              </button>
            </div>

            {user && (
              <div className="pt-4 border-t border-slate-700/50 mt-4">
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg w-full text-sm text-slate-400"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
