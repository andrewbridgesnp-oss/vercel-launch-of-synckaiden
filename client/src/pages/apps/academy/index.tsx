import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import the actual Academy page content
import AcademyPage from './pages/Academy.jsx';
import AdminPage from './pages/Admin.jsx';
import StorePage from './pages/Store.jsx';

type PageView = 'academy' | 'store' | 'admin';

export default function AcademyApp() {
  const [currentPage, setCurrentPage] = useState<PageView>('academy');
  const [pro, setPro] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'academy':
        return <AcademyPage />;
      case 'store':
        return <StorePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <AcademyPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="font-bold">SyncKaiden Academy</span>
            <Badge variant="secondary">Professional Services Suite</Badge>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <Button 
              variant={currentPage === 'academy' ? "secondary" : "outline"} 
              onClick={() => setCurrentPage('academy')}
            >
              Academy
            </Button>
            <Button 
              variant={currentPage === 'store' ? "secondary" : "outline"} 
              onClick={() => setCurrentPage('store')}
            >
              Store
            </Button>
            <Button 
              variant={currentPage === 'admin' ? "secondary" : "outline"} 
              onClick={() => setCurrentPage('admin')}
            >
              Admin
            </Button>
            {pro ? (
              <Badge variant="default">Pro: ON</Badge>
            ) : (
              <Badge variant="outline">Pro: OFF</Badge>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {renderPage()}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-muted-foreground">
        SyncKaiden Academy - Professional Services Suite
      </footer>
    </div>
  );
}
