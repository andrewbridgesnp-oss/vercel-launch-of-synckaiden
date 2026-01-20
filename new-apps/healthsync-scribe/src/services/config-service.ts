/**
 * Configuration Service
 * Manages clinic configuration and provides runtime access to settings
 */

import { ClinicConfig, DEFAULT_CONFIG } from '../config/default-config';

class ConfigService {
  private config: ClinicConfig;
  private listeners: Array<(config: ClinicConfig) => void> = [];

  constructor() {
    // Load config from localStorage or use defaults
    const savedConfig = this.loadFromStorage();
    this.config = savedConfig || DEFAULT_CONFIG;
  }

  /**
   * Get the current configuration
   */
  getConfig(): ClinicConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<ClinicConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
      branding: { ...this.config.branding, ...updates.branding },
      integration: { ...this.config.integration, ...updates.integration },
      workflow: { ...this.config.workflow, ...updates.workflow },
      roles: { ...this.config.roles, ...updates.roles },
      features: { ...this.config.features, ...updates.features },
      compliance: { ...this.config.compliance, ...updates.compliance },
      notifications: { ...this.config.notifications, ...updates.notifications },
    };
    
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Reset to default configuration
   */
  resetToDefaults(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Subscribe to configuration changes
   */
  subscribe(listener: (config: ClinicConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Export configuration as JSON
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  importConfig(jsonConfig: string): boolean {
    try {
      const imported = JSON.parse(jsonConfig);
      this.config = { ...DEFAULT_CONFIG, ...imported };
      this.saveToStorage();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  }

  /**
   * Get specific configuration section
   */
  getBranding() {
    return this.config.branding;
  }

  getIntegration() {
    return this.config.integration;
  }

  getWorkflow() {
    return this.config.workflow;
  }

  getRoles() {
    return this.config.roles;
  }

  getFeatures() {
    return this.config.features;
  }

  getCompliance() {
    return this.config.compliance;
  }

  getNotifications() {
    return this.config.notifications;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof ClinicConfig['features']): boolean {
    return this.config.features[feature] ?? false;
  }

  /**
   * Private methods
   */
  private loadFromStorage(): ClinicConfig | null {
    try {
      const stored = localStorage.getItem('clinic-config');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      return null;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('clinic-config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }
}

// Singleton instance
export const configService = new ConfigService();
