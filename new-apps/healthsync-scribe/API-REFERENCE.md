# 📖 HealthSync Scribe - API Reference

## Configuration Service API

Complete reference for the Configuration Service and Integration Adapters.

---

## 🔧 ConfigService

The central service for managing platform configuration.

### Import

```typescript
import { configService } from './services/config-service';
```

### Methods

#### `getConfig(): ClinicConfig`

Get the complete current configuration.

```typescript
const config = configService.getConfig();
console.log(config.branding.clinicName);
```

**Returns:** `ClinicConfig` object

---

#### `updateConfig(updates: Partial<ClinicConfig>): void`

Update one or more configuration sections.

```typescript
configService.updateConfig({
  branding: {
    clinicName: "New Clinic Name",
    primaryColor: "#1d3660"
  },
  features: {
    enableAIScribe: true
  }
});
```

**Parameters:**
- `updates` - Partial configuration object with sections to update

**Returns:** `void`

**Side effects:**
- Updates localStorage
- Triggers subscribed listeners

---

#### `resetToDefaults(): void`

Reset all configuration to default values.

```typescript
if (confirm('Reset to defaults?')) {
  configService.resetToDefaults();
}
```

**Returns:** `void`

---

#### `subscribe(listener: (config: ClinicConfig) => void): () => void`

Subscribe to configuration changes.

```typescript
const unsubscribe = configService.subscribe((newConfig) => {
  console.log('Config updated:', newConfig);
  updateUI(newConfig);
});

// Later: unsubscribe
unsubscribe();
```

**Parameters:**
- `listener` - Callback function called when config changes

**Returns:** Unsubscribe function

---

#### `exportConfig(): string`

Export configuration as JSON string.

```typescript
const jsonConfig = configService.exportConfig();
console.log(jsonConfig);

// Save to file
const blob = new Blob([jsonConfig], { type: 'application/json' });
const url = URL.createObjectURL(blob);
```

**Returns:** JSON string

---

#### `importConfig(jsonConfig: string): boolean`

Import configuration from JSON string.

```typescript
const success = configService.importConfig(jsonString);
if (success) {
  console.log('Config imported successfully');
} else {
  console.error('Failed to import config');
}
```

**Parameters:**
- `jsonConfig` - JSON string containing valid ClinicConfig

**Returns:** `true` if successful, `false` if failed

---

### Section Getters

#### `getBranding(): BrandingConfig`
#### `getIntegration(): IntegrationConfig`
#### `getWorkflow(): WorkflowConfig`
#### `getRoles(): RoleConfig`
#### `getFeatures(): FeatureFlags`
#### `getCompliance(): ComplianceConfig`
#### `getNotifications(): NotificationConfig`

Get specific configuration sections.

```typescript
const branding = configService.getBranding();
const features = configService.getFeatures();
```

---

#### `isFeatureEnabled(feature: keyof FeatureFlags): boolean`

Check if a specific feature is enabled.

```typescript
if (configService.isFeatureEnabled('enableAIScribe')) {
  // Show AI scribe UI
}
```

**Parameters:**
- `feature` - Feature flag name

**Returns:** `boolean`

---

## 🔌 Integration Adapters

### IIntegrationAdapter Interface

All adapters implement this interface.

```typescript
interface IIntegrationAdapter {
  // Patient operations
  getPatient(patientId: string): Promise<Patient>;
  searchPatients(query: string): Promise<Patient[]>;
  updatePatient(patientId: string, data: Partial<Patient>): Promise<Patient>;
  
  // Appointment operations
  getAppointment(appointmentId: string): Promise<Appointment>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getPatientAppointments(patientId: string): Promise<Appointment[]>;
  updateAppointmentStatus(appointmentId: string, status: string): Promise<Appointment>;
  
  // Clinical documentation
  createClinicalNote(note: Omit<ClinicalNote, 'id'>): Promise<ClinicalNote>;
  getClinicalNote(noteId: string): Promise<ClinicalNote>;
  updateClinicalNote(noteId: string, updates: Partial<ClinicalNote>): Promise<ClinicalNote>;
  
  // Orders
  createOrder(order: Omit<Order, 'id'>): Promise<Order>;
  getOrders(patientId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: string): Promise<Order>;
  
  // FHIR operations (if supported)
  fhirSearch?(resource: string, params: Record<string, any>): Promise<any>;
  fhirRead?(resource: string, id: string): Promise<any>;
  fhirCreate?(resource: string, data: any): Promise<any>;
  fhirUpdate?(resource: string, id: string, data: any): Promise<any>;
  
  // CDS Hooks (if supported)
  invokeCdsHook?(hook: string, context: any): Promise<any>;
}
```

---

### Creating an Adapter

#### Using IntegrationFactory

```typescript
import { IntegrationFactory } from './services/integration-adapter';

const config = configService.getIntegration();
const adapter = IntegrationFactory.createAdapter(config);

// Now use the adapter
const patient = await adapter.getPatient('12345');
```

#### Manual Creation

```typescript
import { MockAdapter, EpicAdapter, CustomApiAdapter } from './services/integration-adapter';

// Mock adapter (standalone)
const mockAdapter = new MockAdapter();

// Epic adapter
const epicAdapter = new EpicAdapter({
  baseUrl: 'https://fhir.epic.com/...',
  clientId: 'your-client-id',
  accessToken: 'your-token'
});

// Custom API adapter
const customAdapter = new CustomApiAdapter({
  baseUrl: 'https://your-api.com',
  apiKey: 'your-key',
  headers: { 'X-Custom': 'value' }
});
```

---

### Patient Operations

#### `getPatient(patientId: string): Promise<Patient>`

Get patient details by ID.

```typescript
const patient = await adapter.getPatient('12345');

console.log(patient.name);
console.log(patient.allergies);
console.log(patient.medications);
```

**Returns:**
```typescript
{
  id: string;
  mrn: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phone?: string;
  address?: Address;
  insurances?: Insurance[];
  allergies: string[];
  medications: string[];
  problems: string[];
  vitals?: Record<string, any>;
}
```

---

#### `searchPatients(query: string): Promise<Patient[]>`

Search for patients by name or MRN.

```typescript
const results = await adapter.searchPatients('Smith');
// or
const results = await adapter.searchPatients('MRN12345');
```

**Parameters:**
- `query` - Search string (name or MRN)

**Returns:** Array of matching patients

---

#### `updatePatient(patientId: string, data: Partial<Patient>): Promise<Patient>`

Update patient information.

```typescript
const updated = await adapter.updatePatient('12345', {
  phone: '555-0123',
  email: 'patient@example.com'
});
```

**Parameters:**
- `patientId` - Patient ID
- `data` - Partial patient object with fields to update

**Returns:** Updated patient object

---

### Appointment Operations

#### `getAppointment(appointmentId: string): Promise<Appointment>`

Get appointment details.

```typescript
const appointment = await adapter.getAppointment('apt-789');
```

**Returns:**
```typescript
{
  id: string;
  patientId: string;
  providerId: string;
  startTime: string;  // ISO 8601
  endTime: string;
  type: string;
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';
  reasonForVisit: string;
}
```

---

#### `getAppointmentsByDate(date: string): Promise<Appointment[]>`

Get all appointments for a specific date.

```typescript
const today = new Date().toISOString().split('T')[0];
const appointments = await adapter.getAppointmentsByDate(today);

appointments.forEach(apt => {
  console.log(`${apt.startTime}: ${apt.patientId}`);
});
```

**Parameters:**
- `date` - Date in YYYY-MM-DD format

**Returns:** Array of appointments

---

#### `getPatientAppointments(patientId: string): Promise<Appointment[]>`

Get all appointments for a specific patient.

```typescript
const appointments = await adapter.getPatientAppointments('12345');
```

**Parameters:**
- `patientId` - Patient ID

**Returns:** Array of patient's appointments

---

#### `updateAppointmentStatus(appointmentId: string, status: Appointment['status']): Promise<Appointment>`

Update appointment status.

```typescript
const updated = await adapter.updateAppointmentStatus('apt-789', 'checked-in');
```

**Parameters:**
- `appointmentId` - Appointment ID
- `status` - New status value

**Returns:** Updated appointment

---

### Clinical Documentation

#### `createClinicalNote(note: Omit<ClinicalNote, 'id'>): Promise<ClinicalNote>`

Create a new clinical note.

```typescript
const note = await adapter.createClinicalNote({
  patientId: '12345',
  appointmentId: 'apt-789',
  chiefComplaint: 'Headache',
  hpi: 'Patient reports severe headaches for 3 days...',
  ros: {
    general: 'No fever, chills, or weight loss',
    cardiovascular: 'No chest pain or palpitations',
    // ... other systems
  },
  physicalExam: {
    vital_signs: 'BP 120/80, HR 72, RR 16, T 98.6F',
    general: 'Alert and oriented x3',
    // ... other exams
  },
  assessment: 'Tension headache',
  plan: 'Ibuprofen 400mg PRN, follow up in 1 week',
  icdCodes: ['R51', 'G44.209'],
  cptCodes: ['99213'],
  timestamp: new Date().toISOString()
});
```

**Returns:** Created note with ID

---

#### `getClinicalNote(noteId: string): Promise<ClinicalNote>`

Retrieve a clinical note.

```typescript
const note = await adapter.getClinicalNote('note-456');
```

---

#### `updateClinicalNote(noteId: string, updates: Partial<ClinicalNote>): Promise<ClinicalNote>`

Update an existing note.

```typescript
const updated = await adapter.updateClinicalNote('note-456', {
  assessment: 'Updated assessment',
  plan: 'Updated plan'
});
```

---

### Orders

#### `createOrder(order: Omit<Order, 'id'>): Promise<Order>`

Create a new order (lab, imaging, prescription, etc.).

```typescript
const labOrder = await adapter.createOrder({
  patientId: '12345',
  type: 'lab',
  description: 'Complete Blood Count',
  status: 'ordered',
  orderedBy: 'Dr. Smith',
  orderedAt: new Date().toISOString(),
  details: {
    tests: ['CBC', 'CMP'],
    priority: 'routine',
    instructions: 'Fasting'
  }
});

const prescription = await adapter.createOrder({
  patientId: '12345',
  type: 'prescription',
  description: 'Lisinopril 10mg',
  status: 'ordered',
  orderedBy: 'Dr. Smith',
  orderedAt: new Date().toISOString(),
  details: {
    medication: 'Lisinopril',
    dose: '10mg',
    frequency: 'once daily',
    duration: '30 days',
    refills: 3
  }
});
```

**Returns:** Created order with ID

---

#### `getOrders(patientId: string): Promise<Order[]>`

Get all orders for a patient.

```typescript
const orders = await adapter.getOrders('12345');

const labOrders = orders.filter(o => o.type === 'lab');
const prescriptions = orders.filter(o => o.type === 'prescription');
```

---

#### `updateOrderStatus(orderId: string, status: Order['status']): Promise<Order>`

Update order status.

```typescript
const updated = await adapter.updateOrderStatus('order-123', 'completed');
```

**Parameters:**
- `orderId` - Order ID
- `status` - One of: `'draft' | 'ordered' | 'completed' | 'cancelled'`

**Returns:** Updated order

---

### FHIR Operations

Available if `fhirEnabled: true` and adapter supports FHIR.

#### `fhirSearch(resource: string, params: Record<string, any>): Promise<Bundle>`

Search for FHIR resources.

```typescript
// Search for active medications
const meds = await adapter.fhirSearch('MedicationRequest', {
  patient: '12345',
  status: 'active',
  _sort: '-_lastUpdated'
});

// Search for recent observations
const obs = await adapter.fhirSearch('Observation', {
  patient: '12345',
  category: 'vital-signs',
  date: 'ge2024-01-01'
});
```

**Parameters:**
- `resource` - FHIR resource type (e.g., 'Patient', 'Observation')
- `params` - Search parameters

**Returns:** FHIR Bundle

---

#### `fhirRead(resource: string, id: string): Promise<Resource>`

Read a specific FHIR resource.

```typescript
const patient = await adapter.fhirRead('Patient', '12345');
const observation = await adapter.fhirRead('Observation', 'obs-789');
```

**Returns:** FHIR Resource

---

#### `fhirCreate(resource: string, data: any): Promise<Resource>`

Create a new FHIR resource.

```typescript
const newObs = await adapter.fhirCreate('Observation', {
  resourceType: 'Observation',
  status: 'final',
  category: [{
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/observation-category',
      code: 'vital-signs'
    }]
  }],
  code: {
    coding: [{
      system: 'http://loinc.org',
      code: '8867-4',
      display: 'Heart rate'
    }]
  },
  subject: { reference: 'Patient/12345' },
  effectiveDateTime: new Date().toISOString(),
  valueQuantity: {
    value: 72,
    unit: 'beats/minute',
    system: 'http://unitsofmeasure.org',
    code: '/min'
  }
});
```

**Returns:** Created FHIR Resource

---

#### `fhirUpdate(resource: string, id: string, data: any): Promise<Resource>`

Update an existing FHIR resource.

```typescript
const updated = await adapter.fhirUpdate('Patient', '12345', {
  resourceType: 'Patient',
  id: '12345',
  // ... updated fields
});
```

**Returns:** Updated FHIR Resource

---

### CDS Hooks

Available if `cdsHooksEnabled: true`.

#### `invokeCdsHook(hook: string, context: any): Promise<CdsResponse>`

Invoke a Clinical Decision Support hook.

```typescript
// Patient view hook
const response = await adapter.invokeCdsHook('patient-view', {
  hookInstance: 'uuid-1234',
  hook: 'patient-view',
  context: {
    userId: 'Practitioner/123',
    patientId: 'Patient/456',
    encounterId: 'Encounter/789'
  }
});

// Process cards
response.cards.forEach(card => {
  console.log(`Alert: ${card.summary}`);
  console.log(`Details: ${card.detail}`);
  console.log(`Indicator: ${card.indicator}`);  // 'info' | 'warning' | 'critical'
  
  // Handle suggestions
  card.suggestions?.forEach(suggestion => {
    console.log(`Suggestion: ${suggestion.label}`);
  });
});

// Order select hook (drug-drug interactions)
const orderResponse = await adapter.invokeCdsHook('order-select', {
  hookInstance: 'uuid-5678',
  hook: 'order-select',
  context: {
    userId: 'Practitioner/123',
    patientId: 'Patient/456',
    selections: ['MedicationRequest/789'],
    draftOrders: {
      resourceType: 'Bundle',
      entry: [
        {
          resource: {
            resourceType: 'MedicationRequest',
            medicationCodeableConcept: {
              coding: [{
                system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                code: '197361',
                display: 'Warfarin'
              }]
            }
          }
        }
      ]
    }
  }
});
```

**Common Hooks:**
- `patient-view` - When viewing patient chart
- `medication-prescribe` - When prescribing medication
- `order-select` - When selecting an order
- `order-sign` - Before signing orders

**Returns:**
```typescript
{
  cards: Array<{
    summary: string;
    detail?: string;
    indicator: 'info' | 'warning' | 'critical';
    source: {
      label: string;
      url?: string;
    };
    suggestions?: Array<{
      label: string;
      actions: any[];
    }>;
    links?: Array<{
      label: string;
      url: string;
      type: string;
    }>;
  }>;
}
```

---

## 📝 Type Definitions

### ClinicConfig

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

### BrandingConfig

```typescript
interface BrandingConfig {
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
```

### IntegrationConfig

```typescript
interface IntegrationConfig {
  ehrSystem: 'epic' | 'cerner' | 'athenahealth' | 'allscripts' | 'eclinicalworks' | 'nextgen' | 'custom' | 'none';
  apiEndpoint: string;
  authType: 'oauth2' | 'apikey' | 'saml' | 'basic' | 'custom';
  fhirEnabled: boolean;
  fhirVersion?: 'R4' | 'STU3' | 'DSTU2';
  cdsHooksEnabled: boolean;
  ssoEnabled: boolean;
  ssoProvider?: 'okta' | 'azure' | 'google' | 'custom';
}
```

### FeatureFlags

```typescript
interface FeatureFlags {
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
```

---

## 🔍 Error Handling

All async methods may throw errors. Always use try-catch:

```typescript
try {
  const patient = await adapter.getPatient('12345');
  console.log(patient);
} catch (error) {
  console.error('Failed to get patient:', error);
  // Handle error appropriately
}
```

Common error scenarios:
- Network failures
- Authentication errors
- Resource not found
- Rate limiting
- Invalid parameters

---

## 📚 Complete Examples

See `/INTEGRATION-EXAMPLES.md` for real-world integration examples with Epic, Cerner, and custom APIs.

---

**For full source code, see:**
- `/src/services/config-service.ts`
- `/src/services/integration-adapter.ts`
- `/src/config/default-config.ts`
