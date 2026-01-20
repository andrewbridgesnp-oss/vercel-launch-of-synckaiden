# 🎨 HealthSync Scribe - Complete Customization Guide

## 🌟 **Make It Yours: Fully Customizable Platform**

HealthSync Scribe is now a **white-label, fully customizable healthcare companion platform** that any clinic, provider, or healthcare organization can configure to match their needs and integrate with their existing systems.

---

## 🚀 Quick Start

### First-Time Setup

When you launch the application for the first time, you'll see an **interactive Setup Wizard** that guides you through:

1. **Welcome** - Introduction to the platform
2. **Branding** - Customize your clinic's identity
3. **Integration** - Connect to your EHR system
4. **Features** - Enable the modules you need
5. **Complete** - Launch your customized platform!

### Skip Setup (Demo Mode)

If you want to skip the setup wizard:
1. Enter any clinic name when prompted
2. You can reconfigure everything later in **Admin → Configuration**

---

## 🎯 Configuration Options

### Access Configuration Settings

**For Admin Users:**
1. Switch to **Admin** role (top-right dropdown)
2. Navigate to **Configuration** in the left sidebar
3. All settings are organized into 6 tabs

**Via Setup Wizard:**
- Available on first launch
- Can be re-run by resetting configuration

---

## 🏢 1. Branding Configuration

### Clinic Identity

Configure your organization's branding:

```typescript
{
  clinicName: "Your Clinic Name",
  platformName: "HealthSync Scribe", // Can be changed
  tagline: "Document. Decide. Deliver.", // Your custom tagline
  logoUrl: "https://example.com/logo.png",
  faviconUrl: "https://example.com/favicon.ico"
}
```

### Color Themes

Choose from pre-built themes or create custom colors:

**Pre-built Themes:**
- **Navy & Silver** (Default) - Professional, trustworthy
- **Medical Blue** - Traditional medical feel
- **Nature Green** - Wellness-focused
- **Warm Orange** - Friendly, approachable
- **Custom** - Define your own palette

**Custom Colors:**
```typescript
{
  primaryColor: "#1d3660",   // Main brand color
  secondaryColor: "#757c88",  // Secondary/neutral
  accentColor: "#d4af37"      // Highlights/CTAs
}
```

### How to Apply

1. Go to **Configuration → Branding**
2. Fill in your clinic details
3. Choose a theme or set custom colors
4. Upload logos (optional)
5. Click **Save Changes**

---

## 🔌 2. EHR Integration

### Supported Systems

HealthSync Scribe integrates with:

| EHR System | Integration Type | FHIR Support |
|------------|-----------------|--------------|
| **Epic** | FHIR R4 | ✅ Yes |
| **Cerner (Oracle Health)** | FHIR R4 | ✅ Yes |
| **athenahealth** | REST API | ⚠️ Limited |
| **Allscripts** | REST API | ⚠️ Limited |
| **eClinicalWorks** | REST API | ⚠️ Limited |
| **NextGen Healthcare** | REST API | ⚠️ Limited |
| **Custom API** | Your own | 🔧 Configurable |
| **None (Standalone)** | Mock data | ❌ No |

### Configuration Steps

#### Option 1: Epic Integration

```typescript
{
  ehrSystem: "epic",
  apiEndpoint: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
  authType: "oauth2",
  fhirEnabled: true,
  fhirVersion: "R4",
  cdsHooksEnabled: true
}
```

**Required Credentials:**
- Client ID from Epic App Orchard
- OAuth 2.0 redirect URI
- FHIR endpoint URL

#### Option 2: Cerner Integration

```typescript
{
  ehrSystem: "cerner",
  apiEndpoint: "https://fhir-ehr-code.cerner.com/r4/[tenant-id]",
  authType: "oauth2",
  fhirEnabled: true,
  fhirVersion: "R4"
}
```

#### Option 3: Custom API

```typescript
{
  ehrSystem: "custom",
  apiEndpoint: "https://your-ehr-api.com/v1",
  authType: "apikey" | "oauth2" | "saml" | "basic",
  fhirEnabled: false,
  customHeaders: {
    "X-API-Key": "your-api-key",
    "X-Tenant-ID": "your-tenant"
  }
}
```

#### Option 4: Standalone Mode

```typescript
{
  ehrSystem: "none",
  // No external integration
  // Uses mock data for demo/testing
}
```

### FHIR Configuration

If your EHR supports FHIR:

```typescript
{
  fhirEnabled: true,
  fhirVersion: "R4",      // or "STU3", "DSTU2"
  cdsHooksEnabled: true,  // Clinical Decision Support
}
```

### Single Sign-On (SSO)

Enable SSO for seamless authentication:

```typescript
{
  ssoEnabled: true,
  ssoProvider: "okta" | "azure" | "google" | "custom"
}
```

---

## 🔧 3. Workflow Configuration

### Specialties

Add or remove clinical specialties:

**Pre-configured:**
- Primary Care
- Urgent Care
- Pediatrics
- Internal Medicine

**Add Custom Specialties:**
1. Go to **Configuration → Workflow**
2. Type specialty name (e.g., "Cardiology")
3. Click **Add**
4. Remove with the ✕ button

### Visit Types

Customize appointment types and their settings:

```typescript
{
  id: "new-patient",
  name: "New Patient Visit",
  duration: 45,              // minutes
  requiresConsent: true,
  requiresPayment: true
}
```

**Default Visit Types:**
- New Patient Visit (45 min)
- Follow-up Visit (20 min)
- Acute Care Visit (30 min)
- Annual Wellness (45 min)
- Telehealth Visit (20 min)

### Document Templates

Configure clinical note templates per specialty (Advanced).

### Order Sets

Create pre-defined order sets for common scenarios (Advanced).

---

## ✨ 4. Feature Toggles

Enable or disable platform features based on your needs:

| Feature | Description | Default |
|---------|-------------|---------|
| **AI Scribe** | Ambient documentation during visits | ✅ On |
| **Coding Assistant** | ICD-10 & CPT code suggestions | ✅ On |
| **Care Gaps** | Quality measure tracking | ✅ On |
| **Patient Portal** | Patient-facing mobile app | ✅ On |
| **Telemedicine** | Video visit capabilities | ✅ On |
| **E-Prescribing** | Electronic prescriptions | ✅ On |
| **Lab Integration** | Lab orders and results | ✅ On |
| **Imaging Integration** | Imaging orders and PACS | ❌ Off |
| **Billing Integration** | Revenue cycle management | ✅ On |
| **Analytics** | Dashboard and insights | ✅ On |
| **Audit Log** | Comprehensive activity logs | ✅ On |
| **Multi-Location** | Support multiple clinics | ❌ Off |

### How to Toggle

1. Go to **Configuration → Features**
2. Check/uncheck desired features
3. Click **Save Changes**
4. Features will be immediately enabled/disabled

---

## 🔒 5. Compliance & Security

### HIPAA Compliance

```typescript
{
  hipaaMode: true,              // Enhanced security
  auditLoggingLevel: "comprehensive",
  dataRetentionDays: 2555,      // 7 years (HIPAA requirement)
  requireMFA: true              // Mandatory 2FA
}
```

**Audit Logging Levels:**
- **Minimal** - Critical actions only
- **Standard** - Most user actions
- **Comprehensive** - Every action logged (HIPAA recommended)

### Session Management

```typescript
{
  sessionTimeoutMinutes: 30,    // Auto-logout after inactivity
}
```

### Password Policy

```typescript
{
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90            // Force password change
  }
}
```

---

## 📧 6. Notifications

### Communication Providers

**Email:**
- SendGrid (Default)
- Amazon SES
- Custom SMTP
- Custom Provider

**SMS:**
- None
- Twilio
- Nexmo (Vonage)
- Custom Provider

### Notification Types

```typescript
{
  enableAppointmentReminders: true,  // Patient appointment notifications
  enableTaskNotifications: true,     // Staff task/message alerts
  enableCriticalAlerts: true         // Urgent clinical notifications
}
```

---

## 👥 7. Custom Roles & Permissions

### Pre-defined Roles

- **Provider** - Physicians, NPs, PAs
- **MA** - Medical Assistants
- **Front Desk** - Reception, scheduling
- **Pharmacy** - Pharmacy staff
- **Lab** - Lab technicians
- **Admin** - System administrators
- **Patient** - Patient portal users

### Custom Roles (Advanced)

Create custom roles with specific permissions:

```typescript
{
  customRoles: [
    {
      id: "care-coordinator",
      name: "Care Coordinator",
      permissions: ["view-patients", "manage-referrals"],
      accessibleSections: ["today", "messages", "records"]
    }
  ]
}
```

---

## 💾 Import/Export Configuration

### Export Configuration

1. Go to **Configuration** (any tab)
2. Click **Export Config**
3. Saves as JSON file: `clinic-config-YYYY-MM-DD.json`

### Import Configuration

1. Click **Import Config**
2. Select your JSON file
3. Configuration is applied immediately

### Use Cases

- **Backup** - Save your settings before changes
- **Clone** - Apply same config to multiple instances
- **Version Control** - Track configuration changes
- **Migration** - Move settings between environments

---

## 🔧 Integration Adapters

### How Integration Works

HealthSync Scribe uses an **adapter pattern** to support different EHR systems:

```typescript
interface IIntegrationAdapter {
  // Patient operations
  getPatient(patientId: string): Promise<Patient>;
  searchPatients(query: string): Promise<Patient[]>;
  
  // Appointment operations
  getAppointment(appointmentId: string): Promise<Appointment>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  
  // Clinical documentation
  createClinicalNote(note: ClinicalNote): Promise<ClinicalNote>;
  
  // Orders
  createOrder(order: Order): Promise<Order>;
  
  // FHIR (if enabled)
  fhirSearch?(resource: string, params: any): Promise<any>;
}
```

### Creating Custom Adapter

```typescript
import { CustomApiAdapter } from './services/integration-adapter';

const adapter = new CustomApiAdapter({
  baseUrl: "https://your-api.com",
  apiKey: "your-api-key",
  headers: {
    "X-Custom-Header": "value"
  }
});
```

### Mock Adapter (Standalone)

For testing or standalone use:

```typescript
import { MockAdapter } from './services/integration-adapter';

const adapter = new MockAdapter();
// Uses local mock data, no external calls
```

---

## 🎨 Theming & White-Labeling

### Complete White-Label

To fully white-label the platform:

1. **Branding**
   - Set your clinic name
   - Upload your logo
   - Configure your color palette

2. **Remove/Replace Text**
   - Update "HealthSync Scribe" to your product name
   - Change tagline to your value proposition

3. **Custom Domain**
   - Host on your own domain
   - Configure SSL certificate

4. **Favicon & Meta**
   - Upload custom favicon
   - Update meta tags for SEO

### CSS Variables

All colors use CSS variables for easy customization:

```css
:root {
  --navy-900: #0f1d35;
  --silver-600: #757c88;
  --gold-accent: #d4af37;
  /* ... etc */
}
```

---

## 📊 Multi-Clinic Support

Enable support for multiple locations:

```typescript
{
  features: {
    enableMultiLocation: true
  }
}
```

**Capabilities:**
- Separate patient lists per location
- Location-specific scheduling
- Cross-location patient lookup
- Centralized reporting

---

## 🔐 Security Best Practices

### Recommended Settings

```typescript
{
  compliance: {
    hipaaMode: true,
    auditLoggingLevel: "comprehensive",
    requireMFA: true,
    sessionTimeoutMinutes: 30,
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    }
  }
}
```

### Data Storage

- **Configuration** - Stored in localStorage (browser)
- **Patient Data** - Never stored locally in production
- **Integration** - All PHI retrieved from your EHR system

### HIPAA Compliance Notes

> ⚠️ **Important:** HealthSync Scribe provides tools for HIPAA compliance, but you are responsible for:
> - Executing a Business Associate Agreement (BAA)
> - Conducting risk assessments
> - Training staff on HIPAA policies
> - Maintaining audit logs
> - Encrypting data in transit and at rest

---

## 🚦 Deployment Scenarios

### Scenario 1: Small Independent Practice

```typescript
{
  branding: { clinicName: "Smith Family Medicine" },
  integration: { ehrSystem: "none" },  // Standalone
  features: {
    enableAIScribe: true,
    enablePatientPortal: true,
    enableTelemedicine: true,
    enableMultiLocation: false
  }
}
```

### Scenario 2: Multi-Location Group

```typescript
{
  branding: { clinicName: "Acme Medical Group" },
  integration: { ehrSystem: "epic", fhirEnabled: true },
  features: {
    enableMultiLocation: true,
    enableBillingIntegration: true,
    enableAnalytics: true
  }
}
```

### Scenario 3: Specialty Clinic

```typescript
{
  branding: { clinicName: "Heart & Vascular Center" },
  workflow: {
    enabledSpecialties: ["Cardiology", "Vascular Surgery"],
    customSpecialties: [
      { id: "echo", name: "Echocardiography", color: "#4169a8" }
    ]
  },
  features: {
    enableImagingIntegration: true
  }
}
```

### Scenario 4: Telehealth-Only

```typescript
{
  branding: { clinicName: "Virtual Health Now" },
  features: {
    enableTelemedicine: true,
    enablePatientPortal: true,
    enableEPrescribing: true,
    enableLabIntegration: false,
    enableImagingIntegration: false
  }
}
```

---

## 🛠️ Programmatic Configuration

### Via Code

```typescript
import { configService } from './services/config-service';

// Update specific settings
configService.updateConfig({
  branding: {
    clinicName: "My Clinic",
    primaryColor: "#1d3660"
  }
});

// Get current config
const config = configService.getConfig();

// Subscribe to changes
configService.subscribe((newConfig) => {
  console.log('Config updated:', newConfig);
});

// Reset to defaults
configService.resetToDefaults();
```

### Via JSON File

Create `clinic-config.json`:

```json
{
  "branding": {
    "clinicName": "My Clinic",
    "platformName": "My EHR",
    "theme": "medical-blue"
  },
  "integration": {
    "ehrSystem": "epic",
    "apiEndpoint": "https://fhir.epic.com/...",
    "fhirEnabled": true
  }
}
```

Import via UI or programmatically.

---

## 📝 Configuration Reference

### Complete Config Structure

```typescript
interface ClinicConfig {
  branding: BrandingConfig;
  integration: IntegrationConfig;
  workflow: WorkflowConfig;
  roles: RoleConfig;
  features: FeatureFlags;
  compliance: ComplianceConfig;
  notifications: NotificationConfig;
  customFields: Record<string, any>;
}
```

See `/src/config/default-config.ts` for full TypeScript definitions.

---

## 🎯 Common Customization Tasks

### Change Platform Name

1. **Configuration → Branding**
2. Update "Platform Name" field
3. Save changes
4. Appears in sidebar and browser title

### Add New Specialty

1. **Configuration → Workflow**
2. Type specialty name
3. Click "Add"
4. Now available in visit workflows

### Disable Unwanted Features

1. **Configuration → Features**
2. Uncheck features you don't need
3. Save changes
4. UI elements hidden immediately

### Connect to Your EHR

1. **Configuration → Integration**
2. Select your EHR system
3. Enter API endpoint
4. Configure auth settings
5. Test connection
6. Save changes

### Apply Custom Colors

1. **Configuration → Branding**
2. Use color pickers or enter hex codes
3. Preview changes in real-time
4. Save to apply globally

---

## 🆘 Support & Resources

### Documentation

- `/CUSTOMIZATION-GUIDE.md` (this file)
- `/LUXURY-THEME-GUIDE.md` - Styling guide
- `/README.md` - General documentation

### Configuration Files

- `/src/config/default-config.ts` - Default settings
- `/src/services/config-service.ts` - Configuration service
- `/src/services/integration-adapter.ts` - EHR adapters

### Components

- `/src/app/components/setup/SetupWizard.tsx` - Setup wizard
- `/src/app/components/admin/ConfigurationSettings.tsx` - Admin UI

---

## ✅ Checklist for New Deployment

- [ ] Complete setup wizard
- [ ] Configure clinic branding
- [ ] Set up EHR integration (if applicable)
- [ ] Enable needed features
- [ ] Configure HIPAA/compliance settings
- [ ] Set password policies
- [ ] Configure notification providers
- [ ] Add custom specialties
- [ ] Define visit types
- [ ] Test integration with sample data
- [ ] Train staff on customized workflows
- [ ] Export configuration backup

---

## 🎉 You're Ready!

Your HealthSync Scribe platform is now **fully customized** to your clinic's needs. The platform adapts to YOUR workflow, integrates with YOUR systems, and represents YOUR brand.

**Questions or need help?** All configuration options are self-documented in the UI with helpful tooltips and descriptions.

---

**Made for clinics of all sizes** • **Fully customizable** • **White-label ready** • **Integration-friendly**
