/**
 * Authentication & Authorization Service
 * Enterprise-grade user management with JWT tokens
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Provider' | 'MA' | 'Front Desk' | 'Pharmacy' | 'Lab' | 'Admin' | 'Patient';
  organizationId: string;
  permissions: string[];
  avatar?: string;
  mfaEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  subscriptionTier: 'free' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: string;
  settings: Record<string, any>;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

class AuthService {
  private state: AuthState = {
    user: null,
    organization: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Initialize authentication (check for existing session)
   */
  async initialize(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await this.validateToken(token);
      } catch (error) {
        this.logout();
      }
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    // In production, this would call your backend API
    // For now, we'll simulate authentication
    
    try {
      // Simulated API call
      const response = await this.mockApiCall('/auth/login', {
        email,
        password,
      });

      this.state = {
        user: response.user,
        organization: response.organization,
        token: response.token,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
      };

      this.saveToStorage();
      this.notifyListeners();

      return response.user;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }

  /**
   * Login with SSO (OAuth 2.0)
   */
  async loginWithSSO(provider: 'okta' | 'azure' | 'google'): Promise<void> {
    // Redirect to SSO provider
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = this.generateState();
    
    const ssoUrls = {
      okta: `https://your-org.okta.com/oauth2/v1/authorize?client_id=YOUR_CLIENT_ID&response_type=code&scope=openid%20profile%20email&redirect_uri=${redirectUri}&state=${state}`,
      azure: `https://login.microsoftonline.com/YOUR_TENANT/oauth2/v2.0/authorize?client_id=YOUR_CLIENT_ID&response_type=code&scope=openid%20profile%20email&redirect_uri=${redirectUri}&state=${state}`,
      google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&response_type=code&scope=openid%20profile%20email&redirect_uri=${redirectUri}&state=${state}`,
    };

    localStorage.setItem('sso_state', state);
    window.location.href = ssoUrls[provider];
  }

  /**
   * Handle SSO callback
   */
  async handleSSOCallback(code: string, state: string): Promise<void> {
    const savedState = localStorage.getItem('sso_state');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for token
    const response = await this.mockApiCall('/auth/sso/callback', { code });
    
    this.state = {
      user: response.user,
      organization: response.organization,
      token: response.token,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
    };

    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Logout
   */
  logout(): void {
    this.state = {
      user: null,
      organization: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    };

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    
    this.notifyListeners();
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.state.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.mockApiCall('/auth/refresh', {
      refreshToken: this.state.refreshToken,
    });

    this.state.token = response.token;
    this.saveToStorage();
    this.notifyListeners();

    return response.token;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.state.user;
  }

  /**
   * Get current organization
   */
  getCurrentOrganization(): Organization | null {
    return this.state.organization;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return this.state.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.state.isAuthenticated && this.state.user !== null;
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    return this.state.user?.permissions.includes(permission) ?? false;
  }

  /**
   * Check if user has role
   */
  hasRole(role: User['role']): boolean {
    return this.state.user?.role === role;
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Invite user to organization
   */
  async inviteUser(email: string, role: User['role']): Promise<void> {
    await this.mockApiCall('/users/invite', {
      email,
      role,
      organizationId: this.state.organization?.id,
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await this.mockApiCall('/users/profile', updates);
    
    if (this.state.user) {
      this.state.user = { ...this.state.user, ...response };
      this.saveToStorage();
      this.notifyListeners();
    }

    return response;
  }

  /**
   * Enable MFA
   */
  async enableMFA(): Promise<{ qrCode: string; secret: string }> {
    const response = await this.mockApiCall('/auth/mfa/enable', {});
    return response;
  }

  /**
   * Verify MFA code
   */
  async verifyMFA(code: string): Promise<boolean> {
    const response = await this.mockApiCall('/auth/mfa/verify', { code });
    return response.valid;
  }

  /**
   * Private methods
   */
  private async validateToken(token: string): Promise<void> {
    // In production, verify token with backend
    const response = await this.mockApiCall('/auth/validate', { token });
    
    if (response.valid) {
      this.state = {
        user: response.user,
        organization: response.organization,
        token: token,
        refreshToken: localStorage.getItem('refresh_token'),
        isAuthenticated: true,
      };
      this.notifyListeners();
    } else {
      throw new Error('Invalid token');
    }
  }

  private loadFromStorage(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const userJson = localStorage.getItem('auth_user');
      
      if (token && userJson) {
        const user = JSON.parse(userJson);
        this.state = {
          user,
          organization: null, // Load from API on validate
          token,
          refreshToken: localStorage.getItem('refresh_token'),
          isAuthenticated: true,
        };
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
    }
  }

  private saveToStorage(): void {
    if (this.state.token) {
      localStorage.setItem('auth_token', this.state.token);
    }
    if (this.state.refreshToken) {
      localStorage.setItem('refresh_token', this.state.refreshToken);
    }
    if (this.state.user) {
      localStorage.setItem('auth_user', JSON.stringify(this.state.user));
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private async mockApiCall(endpoint: string, data: any): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock responses for demo
    if (endpoint === '/auth/login') {
      // Demo user
      return {
        user: {
          id: 'user-123',
          email: data.email,
          name: 'Dr. Sarah Smith',
          role: 'Provider',
          organizationId: 'org-456',
          permissions: ['*'],
          mfaEnabled: false,
          createdAt: new Date().toISOString(),
        },
        organization: {
          id: 'org-456',
          name: 'Demo Clinic',
          subscriptionTier: 'professional',
          subscriptionStatus: 'active',
          settings: {},
          createdAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token-' + Math.random(),
        refreshToken: 'mock-refresh-token-' + Math.random(),
      };
    }

    if (endpoint === '/auth/validate') {
      return {
        valid: true,
        user: {
          id: 'user-123',
          email: 'demo@example.com',
          name: 'Dr. Sarah Smith',
          role: 'Provider',
          organizationId: 'org-456',
          permissions: ['*'],
          mfaEnabled: false,
          createdAt: new Date().toISOString(),
        },
        organization: {
          id: 'org-456',
          name: 'Demo Clinic',
          subscriptionTier: 'professional',
          subscriptionStatus: 'active',
          settings: {},
          createdAt: new Date().toISOString(),
        },
      };
    }

    return {};
  }
}

// Singleton instance
export const authService = new AuthService();
