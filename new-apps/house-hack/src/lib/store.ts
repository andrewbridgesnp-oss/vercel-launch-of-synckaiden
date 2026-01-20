import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'borrower' | 'realtor' | 'loan_officer' | 'consultant' | 'contractor' | 'appraiser' | 'admin';
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  organizationId: string | null;
  subscriptionId?: string;
  subscriptionStatus?: string;
}

export interface Deal {
  id: string;
  ownerId: string;
  organizationId: string;
  status: 'active' | 'closed' | 'archived';
  propertyAddress: string;
  propertyUnits: number;
  purchasePrice: number;
  rehabCosts: number;
  programType: 'limited' | 'standard';
  createdAt: string;
  updatedAt: string;
  teamMembers: Array<{ userId: string; role: string }>;
  stage: string;
  fitScore: number;
}

interface AppState {
  user: User | null;
  deals: Deal[];
  currentDeal: Deal | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setDeals: (deals: Deal[]) => void;
  setCurrentDeal: (deal: Deal | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  deals: [],
  currentDeal: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setDeals: (deals) => set({ deals }),
  setCurrentDeal: (deal) => set({ currentDeal: deal }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  addDeal: (deal) => set((state) => ({ 
    deals: [...state.deals, deal] 
  })),
  
  updateDeal: (dealId, updates) => set((state) => ({
    deals: state.deals.map(d => 
      d.id === dealId ? { ...d, ...updates } : d
    ),
    currentDeal: state.currentDeal?.id === dealId 
      ? { ...state.currentDeal, ...updates }
      : state.currentDeal
  })),
  
  reset: () => set({
    user: null,
    deals: [],
    currentDeal: null,
    isLoading: false,
    error: null
  })
}));
