import { useState, useEffect } from 'react';
import { LeftNav } from './components/LeftNav';
import { TopBar } from './components/TopBar';
import { TodayQueue } from './components/screens/TodayQueue';
import { PreVisitBrief } from './components/screens/PreVisitBrief';
import { ActiveVisit } from './components/screens/ActiveVisit';
import { DraftNote } from './components/screens/DraftNote';
import { CodingMDM } from './components/screens/CodingMDM';
import { OrdersStaging } from './components/screens/OrdersStaging';
import { CareGaps } from './components/screens/CareGaps';
import { Records } from './components/screens/Records';
import { MessagesAndTasks } from './components/screens/MessagesAndTasks';
import { PatientAVS } from './components/screens/PatientAVS';
import { AdminAudit } from './components/screens/AdminAudit';
import { PatientMobileApp } from './components/patient/PatientMobileApp';
import { SetupWizard } from './components/setup/SetupWizard';
import { ConfigurationSettings } from './components/admin/ConfigurationSettings';
import { LoginScreen } from './components/LoginScreen';
import { configService } from '../services/config-service';
import { authService } from '../services/auth-service';
import { analyticsService } from '../services/analytics-service';

export type UserRole = 'Provider' | 'MA' | 'Front Desk' | 'Pharmacy' | 'Lab' | 'Admin' | 'Patient';
export type NavSection = 
  | 'today' 
  | 'pre-visit' 
  | 'active-visit' 
  | 'draft-note' 
  | 'coding' 
  | 'orders' 
  | 'care-gaps' 
  | 'records' 
  | 'messages' 
  | 'avs' 
  | 'admin'
  | 'config';

export type SpecialtyPack = 'Primary' | 'Urgent' | 'Weight Loss' | 'HRT' | 'Holistic';

export interface Patient {
  id: string;
  name: string;
  age: number;
  mrn: string;
  dob: string;
  allergies: string[];
  activeProblems: string[];
  currentMeds: string[];
  riskFlags: string[];
}

export interface Visit {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  reasonForVisit: string;
  visitType: string;
  status: {
    consent: boolean;
    intake: boolean;
    vitals: boolean;
    payment: boolean;
    ready: boolean;
  };
  urgent?: boolean;
  specialtyPack: SpecialtyPack;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Provider');
  const [activeSection, setActiveSection] = useState<NavSection>('today');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  // Initialize app
  useEffect(() => {
    const initialize = async () => {
      await authService.initialize();
      setIsAuthenticated(authService.isAuthenticated());
      
      // Check if setup is needed
      const config = configService.getConfig();
      if (authService.isAuthenticated() && (!config.branding.clinicName || config.branding.clinicName === 'Your Clinic Name')) {
        setShowSetup(true);
      }
      
      setIsInitialized(true);

      // Track page load
      analyticsService.page('App Load');
    };

    initialize();
  }, []);

  // Track section navigation
  useEffect(() => {
    if (isAuthenticated && activeSection) {
      analyticsService.page(activeSection);
    }
  }, [activeSection, isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    analyticsService.identify(authService.getCurrentUser()?.id || '');
    analyticsService.track('User Logged In');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setActiveSection('today');
    analyticsService.track('User Logged Out');
  };

  // Show loading state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading Kaiden Scribe...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Show setup wizard if needed
  if (showSetup) {
    return <SetupWizard onComplete={() => {
      setShowSetup(false);
      analyticsService.track('Setup Wizard Completed');
    }} />;
  }

  // Patient mobile view
  if (userRole === 'Patient') {
    return <PatientMobileApp onBackToProvider={() => setUserRole('Provider')} />;
  }

  // Desktop view for all other roles
  return (
    <div className="flex h-screen bg-silver-50">
      <LeftNav 
        activeSection={activeSection} 
        onNavigate={setActiveSection}
        userRole={userRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          userRole={userRole} 
          onRoleChange={setUserRole}
          patientName={selectedPatient?.name}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-silver-50 to-navy-50/30">
          {activeSection === 'today' && (
            <TodayQueue 
              onSelectVisit={(visit) => {
                setSelectedVisit(visit);
                setActiveSection('pre-visit');
              }}
              onStartVisit={(visit) => {
                setSelectedVisit(visit);
                setActiveSection('active-visit');
              }}
              userRole={userRole}
            />
          )}
          {activeSection === 'pre-visit' && selectedVisit && (
            <PreVisitBrief 
              visit={selectedVisit}
              onStartVisit={() => setActiveSection('active-visit')}
              onBack={() => setActiveSection('today')}
            />
          )}
          {activeSection === 'active-visit' && selectedVisit && (
            <ActiveVisit 
              visit={selectedVisit}
              onComplete={() => setActiveSection('draft-note')}
              onBack={() => setActiveSection('pre-visit')}
            />
          )}
          {activeSection === 'draft-note' && selectedVisit && (
            <DraftNote 
              visit={selectedVisit}
              onNext={() => setActiveSection('coding')}
              onBack={() => setActiveSection('active-visit')}
            />
          )}
          {activeSection === 'coding' && selectedVisit && (
            <CodingMDM 
              visit={selectedVisit}
              onNext={() => setActiveSection('orders')}
              onBack={() => setActiveSection('draft-note')}
            />
          )}
          {activeSection === 'orders' && selectedVisit && (
            <OrdersStaging 
              visit={selectedVisit}
              onSignAndClose={() => setActiveSection('avs')}
              onBack={() => setActiveSection('coding')}
            />
          )}
          {activeSection === 'care-gaps' && (
            <CareGaps userRole={userRole} />
          )}
          {activeSection === 'records' && (
            <Records />
          )}
          {activeSection === 'messages' && (
            <MessagesAndTasks userRole={userRole} />
          )}
          {activeSection === 'avs' && selectedVisit && (
            <PatientAVS 
              visit={selectedVisit}
              onComplete={() => setActiveSection('today')}
            />
          )}
          {activeSection === 'admin' && (
            <AdminAudit />
          )}
          {activeSection === 'config' && (
            <ConfigurationSettings />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;