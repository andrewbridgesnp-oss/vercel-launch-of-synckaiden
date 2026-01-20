/**
 * Default Configuration for HealthSync Scribe
 * This file contains all customizable settings that clinics can modify
 */

export interface BrandingConfig {
  clinicName: string;
  platformName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: 'navy-silver' | 'medical-blue' | 'nature-green' | 'warm-orange' | 'custom';
}

export interface IntegrationConfig {
  ehrSystem: 'epic' | 'cerner' | 'athenahealth' | 'allscripts' | 'eclinicalworks' | 'nextgen' | 'custom' | 'none';
  apiEndpoint: string;
  authType: 'oauth2' | 'apikey' | 'saml' | 'basic' | 'custom';
  fhirEnabled: boolean;
  fhirVersion?: 'R4' | 'STU3' | 'DSTU2';
  cdsHooksEnabled: boolean;
  ssoEnabled: boolean;
  ssoProvider?: 'okta' | 'azure' | 'google' | 'custom';
}

export interface WorkflowConfig {
  enabledSpecialties: string[];
  customSpecialties: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
  }>;
  visitTypes: Array<{
    id: string;
    name: string;
    duration: number;
    requiresConsent: boolean;
    requiresPayment: boolean;
  }>;
  documentTemplates: Record<string, string>;
  orderSets: Array<{
    id: string;
    name: string;
    specialty: string;
    items: string[];
  }>;
}

export interface RoleConfig {
  customRoles: Array<{
    id: string;
    name: string;
    permissions: string[];
    accessibleSections: string[];
  }>;
  defaultRole: string;
}

export interface FeatureFlags {
  enableAIScribe: boolean;
  enableCodingAssist: boolean;
  enableCareGaps: boolean;
  enablePatientPortal: boolean;
  enableTelemedicine: boolean;
  enableEPrescribing: boolean;
  enableLabIntegration: boolean;
  enableImagingIntegration: boolean;
  enableBillingIntegration: boolean;
  enableAnalytics: boolean;
  enableAuditLog: boolean;
  enableMultiLocation: boolean;
}

export interface ComplianceConfig {
  hipaaMode: boolean;
  auditLoggingLevel: 'minimal' | 'standard' | 'comprehensive';
  dataRetentionDays: number;
  requireMFA: boolean;
  sessionTimeoutMinutes: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
}

export interface NotificationConfig {
  emailProvider: 'sendgrid' | 'ses' | 'smtp' | 'custom';
  smsProvider: 'twilio' | 'nexmo' | 'custom' | 'none';
  enableAppointmentReminders: boolean;
  enableTaskNotifications: boolean;
  enableCriticalAlerts: boolean;
}

export interface ClinicConfig {
  branding: BrandingConfig;
  integration: IntegrationConfig;
  workflow: WorkflowConfig;
  roles: RoleConfig;
  features: FeatureFlags;
  compliance: ComplianceConfig;
  notifications: NotificationConfig;
  customFields: Record<string, any>;
}

export const DEFAULT_CONFIG: ClinicConfig = {
  branding: {
    clinicName: 'Your Clinic Name',
    platformName: 'HealthSync Scribe',
    tagline: 'Document. Decide. Deliver.',
    primaryColor: '#1d3660',
    secondaryColor: '#757c88',
    accentColor: '#d4af37',
    theme: 'navy-silver',
  },
  integration: {
    ehrSystem: 'none',
    apiEndpoint: '',
    authType: 'oauth2',
    fhirEnabled: true,
    fhirVersion: 'R4',
    cdsHooksEnabled: true,
    ssoEnabled: false,
  },
  workflow: {
    enabledSpecialties: ['Primary Care', 'Urgent Care', 'Pediatrics', 'Internal Medicine'],
    customSpecialties: [],
    visitTypes: [
      { id: 'new-patient', name: 'New Patient Visit', duration: 45, requiresConsent: true, requiresPayment: true },
      { id: 'follow-up', name: 'Follow-up Visit', duration: 20, requiresConsent: false, requiresPayment: true },
      { id: 'acute', name: 'Acute Care Visit', duration: 30, requiresConsent: false, requiresPayment: true },
      { id: 'annual', name: 'Annual Wellness', duration: 45, requiresConsent: true, requiresPayment: true },
      { id: 'telehealth', name: 'Telehealth Visit', duration: 20, requiresConsent: true, requiresPayment: true },
    ],
    documentTemplates: {},
    orderSets: [],
  },
  roles: {
    customRoles: [],
    defaultRole: 'Provider',
  },
  features: {
    enableAIScribe: true,
    enableCodingAssist: true,
    enableCareGaps: true,
    enablePatientPortal: true,
    enableTelemedicine: true,
    enableEPrescribing: true,
    enableLabIntegration: true,
    enableImagingIntegration: false,
    enableBillingIntegration: true,
    enableAnalytics: true,
    enableAuditLog: true,
    enableMultiLocation: false,
  },
  compliance: {
    hipaaMode: true,
    auditLoggingLevel: 'comprehensive',
    dataRetentionDays: 2555, // 7 years
    requireMFA: true,
    sessionTimeoutMinutes: 30,
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90,
    },
  },
  notifications: {
    emailProvider: 'sendgrid',
    smsProvider: 'twilio',
    enableAppointmentReminders: true,
    enableTaskNotifications: true,
    enableCriticalAlerts: true,
  },
  customFields: {},
};
