import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { api } from '../lib/api';
import { Toaster } from './components/ui/sonner';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingWizard from './pages/OnboardingWizard';
import Dashboard from './pages/Dashboard';
import DealRoom from './pages/DealRoom';
import Marketplace from './pages/Marketplace';
import PricingPage from './pages/PricingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LoanComparison from './pages/LoanComparison';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, setUser, setLoading } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Try to get session, but don't fail if Supabase isn't configured
      try {
        const session = await api.auth.getSession();
        
        if (session) {
          try {
            const { user: userData } = await api.auth.getMe();
            setUser(userData);
          } catch (error) {
            console.error('Failed to get user data:', error);
            // Continue anyway - user can still use the app
          }
        }
      } catch (error) {
        console.error('Session check failed (Supabase may not be configured):', error);
        // Continue - allow viewing landing page and public pages
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a1128] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c0c5ce] mx-auto mb-4"></div>
          <p className="text-[#c0c5ce]">Loading KAIDEN HouseHack 203K...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deal/:dealId" element={<DealRoom />} />
        <Route path="/partners" element={<Marketplace />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/loan-comparison" element={<LoanComparison />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;