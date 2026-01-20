
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'tax', label: 'Tax Tools', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { id: 'ai', label: 'AI Assistant', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'database', label: 'Database', icon: 'M4 7v10c0 2 1.5 3 3.5 3s3.5-1 3.5-3V7c0-2-1.5-3-3.5-3S4 5 4 7zm0 0c0 2 1.5 3 3.5 3S11 9 11 7m-7 5c0 2 1.5 3 3.5 3S11 14 11 12m7-5v10c0 2 1.5 3 3.5 3s3.5-1 3.5-3V7c0-2-1.5-3-3.5-3S18 5 18 7zm0 0c0 2 1.5 3 3.5 3S25 9 25 7m-7 5c0 2 1.5 3 3.5 3S25 14 25 12' },
  ];

  return (
    <div className="flex h-screen overflow-hidden luxury-gradient">
      {/* Sidebar Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-kaiden-gold rounded-full shadow-lg"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-kaiden-black border-r border-kaiden-gold/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-24 border-b border-kaiden-gold/10">
            <span className="text-3xl font-serif font-bold tracking-widest gold-text">KAIDEN</span>
          </div>
          
          <nav className="flex-1 px-4 mt-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                  ? 'bg-kaiden-gold/10 text-kaiden-gold shadow-[0_0_15px_rgba(183,110,121,0.1)] border border-kaiden-gold/20' 
                  : 'text-kaiden-silver hover:bg-white/5 hover:text-kaiden-gold'
                }`}
              >
                <svg className={`w-5 h-5 mr-4 transition-colors ${activeTab === item.id ? 'text-kaiden-gold' : 'group-hover:text-kaiden-gold'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-kaiden-gold/10">
            <div className="flex items-center p-3 rounded-2xl bg-kaiden-charcoal border border-kaiden-gold/10">
              <div className="w-10 h-10 rounded-full bg-kaiden-gold flex items-center justify-center text-white font-serif">K</div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold truncate">Elite User</p>
                <p className="text-xs text-kaiden-silver truncate">Platinum Access</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        {children}
      </main>
    </div>
  );
};
