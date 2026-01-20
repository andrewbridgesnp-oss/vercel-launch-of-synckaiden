# 🔌 HealthSync Scribe - Integration Examples

## Real-World Integration Scenarios

This guide provides practical examples for integrating HealthSync Scribe with various EHR systems and custom APIs.

---

## 📋 Table of Contents

1. [Epic Integration](#epic-integration)
2. [Cerner Integration](#cerner-integration)
3. [athenahealth Integration](#athenahealth-integration)
4. [Custom REST API](#custom-rest-api)
5. [SMART on FHIR](#smart-on-fhir)
6. [Webhook Integration](#webhook-integration)
7. [Troubleshooting](#troubleshooting)

---

## 🏥 Epic Integration

### Prerequisites

1. Register your application in [Epic App Orchard](https://appmarket.epic.com/)
2. Obtain production FHIR base URL from Epic
3. Get OAuth 2.0 credentials (Client ID, Client Secret)

### Configuration

```typescript
{
  integration: {
    ehrSystem: "epic",
    apiEndpoint: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
    authType: "oauth2",
    fhirEnabled: true,
    fhirVersion: "R4",
    cdsHooksEnabled: true,
    clientId: "your-client-id-from-epic",
    clientSecret: "your-client-secret"
  }
}
```

### OAuth 2.0 Flow

```typescript
// 1. Get authorization URL
const authUrl = `https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?` +
  `response_type=code&` +
  `client_id=${clientId}&` +
  `redirect_uri=${redirectUri}&` +
  `scope=patient/*.read%20launch`;

// 2. User authorizes in Epic MyChart

// 3. Exchange code for token
const tokenResponse = await fetch(
  'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri,
      client_id: clientId
    })
  }
);

const { access_token } = await tokenResponse.json();
```

### FHIR Queries

```typescript
// Get patient by ID
const patient = await adapter.fhirRead('Patient', 'eM08FBQTn5bXCH0DtlJh7wB');

// Search for appointments
const appointments = await adapter.fhirSearch('Appointment', {
  patient: 'eM08FBQTn5bXCH0DtlJh7wB',
  date: 'ge2024-01-01'
});

// Create a clinical note (DocumentReference)
const note = await adapter.fhirCreate('DocumentReference', {
  resourceType: 'DocumentReference',
  status: 'current',
  type: {
    coding: [{
      system: 'http://loinc.org',
      code: '34133-9',
      display: 'Summary of episode note'
    }]
  },
  subject: { reference: 'Patient/eM08FBQTn5bXCH0DtlJh7wB' },
  date: new Date().toISOString(),
  content: [{
    attachment: {
      contentType: 'text/plain',
      data: btoa('Clinical note content here')
    }
  }]
});
```

### CDS Hooks Integration

```typescript
// Invoke CDS Hooks service
const cdsResponse = await adapter.invokeCdsHook('patient-view', {
  hookInstance: 'uuid-1234',
  hook: 'patient-view',
  context: {
    userId: 'Practitioner/123',
    patientId: 'Patient/456',
    encounterId: 'Encounter/789'
  }
});

// Process cards returned by CDS service
cdsResponse.cards.forEach(card => {
  console.log(`Suggestion: ${card.summary}`);
  console.log(`Detail: ${card.detail}`);
});
```

---

## 🏥 Cerner Integration

### Prerequisites

1. Register app in [Cerner Code Console](https://code.cerner.com/)
2. Get FHIR endpoint for your organization
3. Obtain OAuth credentials

### Configuration

```typescript
{
  integration: {
    ehrSystem: "cerner",
    apiEndpoint: "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
    authType: "oauth2",
    fhirEnabled: true,
    fhirVersion: "R4",
    clientId: "your-client-id",
    clientSecret: "your-client-secret"
  }
}
```

### Authorization

```typescript
// Cerner uses standard OAuth 2.0
const authUrl = `https://authorization.cerner.com/tenants/${tenantId}/protocols/oauth2/profiles/smart-v1/personas/provider/authorize?` +
  `response_type=code&` +
  `client_id=${clientId}&` +
  `redirect_uri=${redirectUri}&` +
  `scope=user/Patient.read user/Appointment.read launch/patient`;

// Token exchange
const tokenResponse = await fetch(
  `https://authorization.cerner.com/tenants/${tenantId}/protocols/oauth2/profiles/smart-v1/token`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri
    })
  }
);
```

### Sample Queries

```typescript
// Get patient vitals
const vitals = await adapter.fhirSearch('Observation', {
  patient: '12724066',
  category: 'vital-signs',
  _sort: '-date'
});

// Get medications
const meds = await adapter.fhirSearch('MedicationRequest', {
  patient: '12724066',
  status: 'active'
});

// Get conditions
const conditions = await adapter.fhirSearch('Condition', {
  patient: '12724066',
  clinical-status: 'active'
});
```

---

## 🏥 athenahealth Integration

### Prerequisites

1. athenaNet practice credentials
2. API key from athenahealth developer portal
3. Practice ID

### Configuration

```typescript
{
  integration: {
    ehrSystem: "athenahealth",
    apiEndpoint: "https://api.preview.platform.athenahealth.com",
    authType: "oauth2",
    fhirEnabled: false,  // athenahealth uses proprietary API
    practiceId: "195900"
  }
}
```

### Custom Adapter Implementation

```typescript
import { CustomApiAdapter } from './services/integration-adapter';

class AthenaAdapter extends CustomApiAdapter {
  private practiceId: string;
  private accessToken: string;

  constructor(config: any) {
    super(config);
    this.practiceId = config.practiceId;
  }

  async authenticate() {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const { access_token } = await response.json();
    this.accessToken = access_token;
  }

  async getPatient(patientId: string) {
    return this.makeRequest(`/${this.practiceId}/patients/${patientId}`);
  }

  async getAppointments(date: string) {
    return this.makeRequest(
      `/${this.practiceId}/appointments/open?` +
      `departmentid=1&` +
      `startdate=${date}&` +
      `enddate=${date}`
    );
  }
}
```

---

## 🔧 Custom REST API

### For any custom or proprietary EHR system

### Configuration

```typescript
{
  integration: {
    ehrSystem: "custom",
    apiEndpoint: "https://your-ehr.example.com/api/v1",
    authType: "apikey",
    fhirEnabled: false,
    apiKey: "your-api-key-here",
    customHeaders: {
      "X-API-Key": "your-api-key",
      "X-Tenant-ID": "your-tenant-id",
      "X-App-Version": "1.0.0"
    }
  }
}
```

### Implementation Example

```typescript
import { CustomApiAdapter } from './services/integration-adapter';

const adapter = new CustomApiAdapter({
  baseUrl: "https://your-ehr.example.com/api/v1",
  apiKey: "your-api-key",
  headers: {
    "X-Custom-Header": "value"
  }
});

// Map your API to HealthSync interfaces
class YourEhrAdapter extends CustomApiAdapter {
  async getPatient(patientId: string) {
    const response = await this.makeRequest(`/patients/${patientId}`);
    
    // Transform your API response to HealthSync format
    return {
      id: response.patient_id,
      mrn: response.medical_record_number,
      name: `${response.first_name} ${response.last_name}`,
      dateOfBirth: response.dob,
      gender: response.sex,
      allergies: response.allergies.map((a: any) => a.name),
      medications: response.medications.map((m: any) => m.name),
      problems: response.problems.map((p: any) => p.description)
    };
  }

  async getAppointmentsByDate(date: string) {
    const response = await this.makeRequest(
      `/appointments?date=${date}&status=scheduled`
    );
    
    return response.appointments.map((apt: any) => ({
      id: apt.appointment_id,
      patientId: apt.patient_id,
      providerId: apt.provider_id,
      startTime: apt.start_datetime,
      endTime: apt.end_datetime,
      type: apt.appointment_type,
      status: this.mapStatus(apt.status),
      reasonForVisit: apt.chief_complaint
    }));
  }

  private mapStatus(status: string): 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' {
    const statusMap: Record<string, any> = {
      'SCHEDULED': 'scheduled',
      'ARRIVED': 'checked-in',
      'IN_ROOM': 'in-progress',
      'COMPLETE': 'completed',
      'CANCELLED': 'cancelled'
    };
    return statusMap[status] || 'scheduled';
  }
}
```

---

## 🔐 SMART on FHIR

### Universal FHIR Integration

SMART on FHIR works with any FHIR-compliant EHR.

### Launch Sequence

```typescript
// 1. EHR launches your app with 'iss' and 'launch' parameters
const iss = searchParams.get('iss');  // FHIR server URL
const launch = searchParams.get('launch');  // Launch token

// 2. Retrieve conformance statement
const conformance = await fetch(`${iss}/metadata`).then(r => r.json());

// 3. Extract authorization endpoints
const security = conformance.rest[0].security;
const authUrl = security.extension[0].extension.find(
  (e: any) => e.url === 'authorize'
).valueUri;
const tokenUrl = security.extension[0].extension.find(
  (e: any) => e.url === 'token'
).valueUri;

// 4. Redirect to authorization
const authRedirect = `${authUrl}?` +
  `response_type=code&` +
  `client_id=${clientId}&` +
  `redirect_uri=${redirectUri}&` +
  `scope=launch patient/*.read user/*.read openid fhirUser&` +
  `state=${state}&` +
  `aud=${iss}&` +
  `launch=${launch}`;

window.location.href = authRedirect;

// 5. Handle callback and exchange code for token
const tokenResponse = await fetch(tokenUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: redirectUri,
    client_id: clientId
  })
});

const { access_token, patient } = await tokenResponse.json();

// 6. Now you can make FHIR requests
const patientData = await fetch(`${iss}/Patient/${patient}`, {
  headers: { 'Authorization': `Bearer ${access_token}` }
}).then(r => r.json());
```

---

## 📡 Webhook Integration

### Receive Real-Time Updates

Configure webhooks to receive notifications when data changes in your EHR.

### Setup Webhook Endpoint

```typescript
// Express.js example
app.post('/webhooks/ehr', async (req, res) => {
  const { event, data } = req.body;

  switch (event) {
    case 'patient.updated':
      await handlePatientUpdate(data);
      break;
    
    case 'appointment.created':
      await handleNewAppointment(data);
      break;
    
    case 'appointment.cancelled':
      await handleCancelledAppointment(data);
      break;
    
    case 'order.resulted':
      await handleLabResult(data);
      break;
  }

  res.status(200).json({ received: true });
});

async function handlePatientUpdate(data: any) {
  // Sync patient data
  const patient = await adapter.getPatient(data.patient_id);
  // Update local cache or trigger UI refresh
}

async function handleNewAppointment(data: any) {
  // Refresh today's queue
  const appointments = await adapter.getAppointmentsByDate(
    new Date().toISOString().split('T')[0]
  );
  // Notify relevant users
}
```

### Security

```typescript
// Verify webhook signature
function verifyWebhookSignature(req: Request): boolean {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');
  
  return signature === expectedSignature;
}

app.post('/webhooks/ehr', (req, res) => {
  if (!verifyWebhookSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook...
});
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem:** Browser blocks requests to EHR API

**Solution:**
```typescript
// Use a backend proxy
const proxyUrl = '/api/proxy/fhir';

async function makeRequest(path: string) {
  return fetch(`${proxyUrl}?url=${encodeURIComponent(fhirUrl + path)}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

#### 2. Token Expiration

**Problem:** Access token expires during session

**Solution:**
```typescript
class TokenManager {
  private token: string;
  private refreshToken: string;
  private expiresAt: number;

  async getValidToken(): Promise<string> {
    if (Date.now() >= this.expiresAt - 60000) {
      await this.refresh();
    }
    return this.token;
  }

  async refresh() {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: clientId
      })
    });
    
    const { access_token, expires_in } = await response.json();
    this.token = access_token;
    this.expiresAt = Date.now() + (expires_in * 1000);
  }
}
```

#### 3. Rate Limiting

**Problem:** Too many API requests

**Solution:**
```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerSecond = 10;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
      await this.delay(1000 / this.requestsPerSecond);
    }
    
    this.processing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

#### 4. Data Mapping Issues

**Problem:** EHR data structure doesn't match HealthSync format

**Solution:**
```typescript
class DataTransformer {
  transformPatient(ehrPatient: any): Patient {
    return {
      id: ehrPatient.id || ehrPatient.patientId,
      mrn: ehrPatient.mrn || ehrPatient.medicalRecordNumber,
      name: this.formatName(ehrPatient.name),
      dateOfBirth: this.formatDate(ehrPatient.birthDate || ehrPatient.dob),
      gender: this.normalizeGender(ehrPatient.gender || ehrPatient.sex),
      allergies: this.extractAllergies(ehrPatient),
      medications: this.extractMedications(ehrPatient),
      problems: this.extractProblems(ehrPatient)
    };
  }

  private formatName(name: any): string {
    if (typeof name === 'string') return name;
    if (Array.isArray(name)) {
      const official = name.find((n: any) => n.use === 'official') || name[0];
      return `${official.given.join(' ')} ${official.family}`;
    }
    return `${name.first} ${name.last}`;
  }

  private normalizeGender(gender: string): string {
    const map: Record<string, string> = {
      'M': 'male',
      'F': 'female',
      'MALE': 'male',
      'FEMALE': 'female'
    };
    return map[gender?.toUpperCase()] || gender;
  }
}
```

---

## 📚 Additional Resources

### Official Documentation

- **Epic FHIR:** https://fhir.epic.com/
- **Cerner FHIR:** https://fhir.cerner.com/
- **SMART on FHIR:** https://docs.smarthealthit.org/
- **HL7 FHIR:** https://www.hl7.org/fhir/

### Code Examples

See `/src/services/integration-adapter.ts` for complete adapter implementations.

### Testing

Use these sandbox environments:
- **Epic Sandbox:** https://fhir.epic.com/Sandbox/
- **Cerner Sandbox:** https://code.cerner.com/
- **SMART Launcher:** https://launch.smarthealthit.org/

---

## 🎯 Best Practices

1. **Always use HTTPS** for API communications
2. **Implement retry logic** for failed requests
3. **Cache frequently accessed data** (with proper invalidation)
4. **Log all API interactions** for debugging
5. **Handle errors gracefully** with user-friendly messages
6. **Respect rate limits** to avoid blocking
7. **Use refresh tokens** for long sessions
8. **Validate incoming data** before processing
9. **Monitor API health** and uptime
10. **Keep credentials secure** (never commit to git)

---

**Need help?** Check the integration adapter source code in `/src/services/integration-adapter.ts` for complete working examples.
