// KAIDEN CAPITAL™ - Application Context
// Centralized state management for the application

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type {
  User,
  FundingProfile,
  FundingRecommendation,
  ReadinessScore,
  DashboardStats,
  Service,
  Partner,
} from '../types';
import {
  mockUser,
  mockFundingProfile,
  mockRecommendations,
  mockReadinessScore,
  mockDashboardStats,
  mockServices,
  mockPartners,
  mockFundingSources,
  delay,
} from '../services/mockData';
import { FundingGraphEngine } from '../services/fundingEngine';

interface AppContextType {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Dashboard
  dashboardStats: DashboardStats | null;
  refreshDashboard: () => Promise<void>;
  
  // Funding
  fundingProfile: FundingProfile | null;
  recommendations: FundingRecommendation[];
  readinessScore: ReadinessScore | null;
  generateFundingMap: () => Promise<void>;
  
  // Services
  services: Service[];
  purchaseService: (serviceId: string) => Promise<void>;
  
  // Partners (for partner portal)
  partners: Partner[];
  
  // UI State
  currentView: string;
  setCurrentView: (view: string) => void;
  isLoading: boolean;
  
  // Engine config
  engineMode: 'fastest-money' | 'lowest-cost' | 'balanced';
  setEngineMode: (mode: 'fastest-money' | 'lowest-cost' | 'balanced') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [fundingProfile, setFundingProfile] = useState<FundingProfile | null>(null);
  const [recommendations, setRecommendations] = useState<FundingRecommendation[]>([]);
  const [readinessScore, setReadinessScore] = useState<ReadinessScore | null>(null);
  const [services] = useState<Service[]>(mockServices);
  const [partners] = useState<Partner[]>(mockPartners);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [engineMode, setEngineMode] = useState<'fastest-money' | 'lowest-cost' | 'balanced'>('balanced');

  // Auto-login for demo (in production, this would check for session)
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await delay(800); // Simulate API call
      setUser(mockUser);
      setIsAuthenticated(true);
      setDashboardStats(mockDashboardStats);
      setFundingProfile(mockFundingProfile);
      setRecommendations(mockRecommendations);
      setReadinessScore(mockReadinessScore);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  // Auth functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await delay(1000); // Simulate API call
    setUser(mockUser);
    setIsAuthenticated(true);
    setDashboardStats(mockDashboardStats);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setDashboardStats(null);
    setFundingProfile(null);
    setRecommendations([]);
    setReadinessScore(null);
    setCurrentView('login');
  };

  // Dashboard
  const refreshDashboard = async () => {
    setIsLoading(true);
    await delay(800);
    // In production, this would fetch fresh data
    setDashboardStats(mockDashboardStats);
    setIsLoading(false);
  };

  // Funding Map Generation
  const generateFundingMap = async () => {
    if (!user || !fundingProfile) return;
    
    setIsLoading(true);
    await delay(1500); // Simulate processing time
    
    // Use the funding engine
    const engine = new FundingGraphEngine({ mode: engineMode, riskTolerance: 'moderate' });
    const newRecommendations = engine.generateRecommendations(
      fundingProfile,
      user,
      mockFundingSources
    );
    
    setRecommendations(newRecommendations);
    setIsLoading(false);
  };

  // Service Purchase
  const purchaseService = async (serviceId: string) => {
    setIsLoading(true);
    await delay(1000);
    // In production, this would integrate with Stripe
    console.log('Purchasing service:', serviceId);
    setIsLoading(false);
  };

  const value: AppContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    dashboardStats,
    refreshDashboard,
    fundingProfile,
    recommendations,
    readinessScore,
    generateFundingMap,
    services,
    purchaseService,
    partners,
    currentView,
    setCurrentView,
    isLoading,
    engineMode,
    setEngineMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};