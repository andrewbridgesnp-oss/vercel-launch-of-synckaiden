import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-7054278a`;

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Helper to get auth header
const getAuthHeader = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token 
    ? { 'Authorization': `Bearer ${session.access_token}` }
    : {};
};

// API functions
export const api = {
  // Auth
  auth: {
    signUp: async (email: string, password: string, name: string, role: string = 'borrower') => {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name, role })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }
      
      return response.json();
    },

    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },

    getSession: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },

    getMe: async () => {
      const authHeader = await getAuthHeader();
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get user');
      }
      
      return response.json();
    }
  },

  // Rules
  rules: {
    getCurrent: async () => {
      const response = await fetch(`${API_BASE}/rules/current`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get rules');
      }
      
      return response.json();
    }
  },

  // Deals
  deals: {
    getAll: async () => {
      const authHeader = await getAuthHeader();
      const response = await fetch(`${API_BASE}/deals`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get deals');
      }
      
      return response.json();
    },

    getOne: async (dealId: string) => {
      const authHeader = await getAuthHeader();
      const response = await fetch(`${API_BASE}/deals/${dealId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get deal');
      }
      
      return response.json();
    },

    create: async (dealData: any) => {
      const authHeader = await getAuthHeader();
      const response = await fetch(`${API_BASE}/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(dealData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create deal');
      }
      
      return response.json();
    },

    update: async (dealId: string, updates: any) => {
      const authHeader = await getAuthHeader();
      const response = await fetch(`${API_BASE}/deals/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update deal');
      }
      
      return response.json();
    },

    invite: async (dealId: string, email: string, role: string) => {
      const authHeader = await getAuthHeader();
      const response = await fetch(`${API_BASE}/deals/${dealId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({ email, role })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invitation');
      }
      
      return response.json();
    }
  },

  // Subscriptions
  subscriptions: {
    createCheckout: async (plan: string) => {
      const authHeader = await getAuthHeader();
      const response = await fetch(`${API_BASE}/subscriptions/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({ 
          plan,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout');
      }
      
      return response.json();
    },

    createPortalSession: async () => {
      const authHeader = await getAuthHeader();
      const response = await fetch(`${API_BASE}/subscriptions/portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({ 
          returnUrl: `${window.location.origin}/dashboard`
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create portal session');
      }
      
      return response.json();
    }
  },

  // Partners
  partners: {
    getAll: async (filters?: { role?: string; state?: string }) => {
      const authHeader = await getAuthHeader();
      const params = new URLSearchParams();
      if (filters?.role) params.append('role', filters.role);
      if (filters?.state) params.append('state', filters.state);
      
      const response = await fetch(`${API_BASE}/partners?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get partners');
      }
      
      return response.json();
    }
  }
};