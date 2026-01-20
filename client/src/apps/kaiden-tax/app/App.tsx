import { useState, useEffect } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { KaidenInterface } from '@/app/components/KaidenInterface';
import { LuxuryKaidenInterface } from '@/app/components/LuxuryKaidenInterface';
import { TaxDashboard } from '@/app/components/TaxDashboard';
import { TaxInputForm } from '@/app/components/TaxInputForm';
import { CryptoTaxCalculator } from '@/app/components/CryptoTaxCalculator';
import { CPAPortal } from '@/app/components/CPAPortal';
import { SecureUpload } from '@/app/components/SecureUpload';
import { LoadingScreen } from '@/app/components/LoadingScreen';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { FileManager } from '@/app/components/FileManager';
import { TermsAcceptance } from '@/app/components/TermsAcceptance';
import { TermsOfService } from '@/app/components/TermsOfService';
import { PrivacyPolicy } from '@/app/components/PrivacyPolicy';
import { AuthModal } from '@/app/components/AuthModal';
import { PricingModal } from '@/app/components/PricingModal';
import { TaxScoreDashboard } from '@/app/components/TaxScoreDashboard';
import { DeductionFinderAI } from '@/app/components/DeductionFinderAI';
import { ScenarioSimulator } from '@/app/components/ScenarioSimulator';
import { Toaster } from 'sonner';
import { TaxReturn } from '@/lib/taxEngine';
import { CryptoTransaction } from '@/lib/cryptoTaxEngine';
import { supabase } from '@/lib/supabase';
import { PremiumHero } from '@/app/components/PremiumHero';
import { motion } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('home');
  const [showFileManager, setShowFileManager] = useState(false);
  const [taxReturn, setTaxReturn] = useState<Partial<TaxReturn>>({});
  const [cryptoTransactions, setCryptoTransactions] = useState<CryptoTransaction[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check for upload token in URL
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'upload' && pathParts[2]) {
      const token = pathParts[2];
      setCurrentView('secure-upload');
      // Store token for SecureUpload component
      sessionStorage.setItem('upload_token', token);
    }
  }, []);

  const navigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImportTaxReturn = (data: Partial<TaxReturn>) => {
    setTaxReturn(data);
    navigate('tax-dashboard');
  };

  const handleImportCrypto = (transactions: CryptoTransaction[]) => {
    setCryptoTransactions(transactions);
    navigate('crypto-calculator');
  };

  const handleTaxCalculate = (data: Partial<TaxReturn>) => {
    setTaxReturn(data);
    navigate('tax-dashboard');
  };

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {isLoading ? (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        ) : (
          <>
            {/* Navigation - Hide on secure upload page */}
            {currentView !== 'secure-upload' && (
              <Navigation
                currentView={currentView}
                onNavigate={navigate}
                user={user}
                onPricingClick={() => setPricingOpen(true)}
              />
            )}

            {/* Main Content Area */}
            <div className={currentView !== 'secure-upload' ? 'md:ml-64 min-h-screen pt-20 md:pt-0' : 'min-h-screen'}>
              {/* View Rendering */}
              {currentView === 'home' && (
                <div className="relative overflow-hidden">
                  {/* Premium Hero Section */}
                  <PremiumHero />

                  {/* Quick Start Section */}
                  <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="text-center mb-12"
                    >
                      <h2 className="text-4xl font-bold text-white mb-4">
                        Get Started in 3 Steps
                      </h2>
                      <p className="text-slate-400 text-lg">
                        The smartest way to handle your taxes
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        {
                          number: '01',
                          title: 'Enter Your Data',
                          description: 'Manually input or import from CSV. Your data stays secure.',
                          icon: '📊',
                          action: () => navigate('tax-input'),
                          color: 'from-blue-500 to-cyan-500'
                        },
                        {
                          number: '02',
                          title: 'Get AI Insights',
                          description: 'KAIDEN analyzes your situation and finds opportunities.',
                          icon: '🤖',
                          action: () => navigate('chat'),
                          color: 'from-purple-500 to-pink-500'
                        },
                        {
                          number: '03',
                          title: 'Export Results',
                          description: 'Download CSV for your CPA or import to TurboTax.',
                          icon: '⬇️',
                          action: () => navigate('tax-dashboard'),
                          color: 'from-green-500 to-emerald-500'
                        },
                      ].map((step, index) => (
                        <motion.button
                          key={step.number}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          onClick={step.action}
                          className="group relative p-8 rounded-3xl text-left overflow-hidden"
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {/* Gradient Overlay on Hover */}
                          <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${step.color}`}
                          />

                          {/* Number Badge */}
                          <div className="relative mb-6">
                            <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br opacity-20">
                              {step.number}
                            </span>
                            <div className="text-5xl absolute top-0 left-16">
                              {step.icon}
                            </div>
                          </div>

                          {/* Content */}
                          <h3 className="text-2xl font-bold text-white mb-3 relative">
                            {step.title}
                          </h3>
                          <p className="text-slate-400 relative">
                            {step.description}
                          </p>

                          {/* Arrow */}
                          <div className="mt-6 flex items-center gap-2 text-blue-400 group-hover:gap-4 transition-all">
                            <span className="text-sm font-semibold">Get Started</span>
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              →
                            </motion.div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* CPA Section */}
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="relative max-w-7xl mx-auto px-6 py-16"
                    >
                      <div
                        className="relative p-12 rounded-3xl overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        {/* Animated Background */}
                        <motion.div
                          className="absolute inset-0 opacity-10"
                          animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                          style={{
                            backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
                            backgroundSize: '50px 50px',
                          }}
                        />

                        <div className="relative z-10 text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <span className="text-sm font-semibold text-green-400">
                              🏆 CPA Features
                            </span>
                          </div>

                          <h2 className="text-4xl font-bold text-white mb-4">
                            Secure Client Portal
                          </h2>
                          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                            Generate secure, password-protected upload links for your clients. 
                            All data auto-deletes after 12 hours.
                          </p>

                          <motion.button
                            onClick={() => navigate('cpa-portal')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-2xl font-semibold text-lg"
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                            }}
                          >
                            Open CPA Portal →
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Trust Section */}
                  <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    >
                      {[
                        { number: '10K+', label: 'Tax Returns Filed' },
                        { number: '$2.5M', label: 'Refunds Maximized' },
                        { number: '99.9%', label: 'Accuracy Rate' },
                        { number: '4.9★', label: 'CPA Rating' },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                            {stat.number}
                          </div>
                          <div className="text-slate-400">{stat.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}

              {currentView === 'chat' && <KaidenInterface userMode="filer" taxData={taxReturn} />}
              {currentView === 'tax-input' && <TaxInputForm onCalculate={handleTaxCalculate} initialData={taxReturn} />}
              {currentView === 'tax-dashboard' && <TaxDashboard importedData={taxReturn} />}
              {currentView === 'crypto-calculator' && <CryptoTaxCalculator importedTransactions={cryptoTransactions} />}
              {currentView === 'cpa-portal' && <CPAPortal />}
              {currentView === 'secure-upload' && <SecureUpload token={sessionStorage.getItem('upload_token') || ''} />}
              {currentView === 'import' && (
                <div className="p-6">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-100 mb-6">Import Your Data</h2>
                    <button
                      onClick={() => setShowFileManager(true)}
                      className="px-6 py-4 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(168, 182, 216, 0.9), rgba(147, 158, 187, 0.9))',
                        color: '#0f172a'
                      }}
                    >
                      Open File Manager
                    </button>
                  </div>
                </div>
              )}
              {currentView === 'terms' && <TermsOfService />}
              {currentView === 'privacy' && <PrivacyPolicy />}
              {currentView === 'signup' && (
                <>
                  {setAuthMode('signup')}
                  {setAuthOpen(true)}
                  {navigate('home')}
                </>
              )}
            </div>

            {/* Terms Acceptance Modal - Shows on first visit */}
            {!termsAccepted && currentView !== 'secure-upload' && (
              <TermsAcceptance onAccept={() => setTermsAccepted(true)} />
            )}

            {/* File Manager Modal */}
            <FileManager
              isOpen={showFileManager}
              onClose={() => setShowFileManager(false)}
              onImportTaxReturn={handleImportTaxReturn}
              onImportCrypto={handleImportCrypto}
              currentTaxReturn={taxReturn as TaxReturn}
              currentCryptoTransactions={cryptoTransactions}
            />

            {/* Pricing Modal */}
            <PricingModal
              open={pricingOpen}
              onOpenChange={setPricingOpen}
            />

            {/* Auth Modal */}
            <AuthModal
              open={authOpen}
              onOpenChange={setAuthOpen}
              mode={authMode}
              onSuccess={() => {}}
            />
          </>
        )}
        
        <Toaster 
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(168, 182, 216, 0.2)',
              color: '#e2e8f0',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}