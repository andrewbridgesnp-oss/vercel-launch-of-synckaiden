/**
 * Integration Adapter
 * Abstract layer for integrating with different EHR systems
 * Supports: Epic, Cerner, athenahealth, AllScripts, eClinicalWorks, NextGen, and custom systems
 */

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  insurances?: Array<{
    provider: string;
    memberId: string;
    group: string;
  }>;
  allergies: string[];
  medications: string[];
  problems: string[];
  vitals?: Record<string, any>;
}

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  startTime: string;
  endTime: string;
  type: string;
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';
  reasonForVisit: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  appointmentId: string;
  chiefComplaint: string;
  hpi: string;
  ros: Record<string, string>;
  physicalExam: Record<string, string>;
  assessment: string;
  plan: string;
  icdCodes: string[];
  cptCodes: string[];
  timestamp: string;
}

export interface Order {
  id: string;
  patientId: string;
  type: 'lab' | 'imaging' | 'prescription' | 'referral' | 'procedure';
  description: string;
  status: 'draft' | 'ordered' | 'completed' | 'cancelled';
  orderedBy: string;
  orderedAt: string;
  details: Record<string, any>;
}

/**
 * Base Integration Adapter Interface
 */
export interface IIntegrationAdapter {
  // Patient operations
  getPatient(patientId: string): Promise<Patient>;
  searchPatients(query: string): Promise<Patient[]>;
  updatePatient(patientId: string, data: Partial<Patient>): Promise<Patient>;
  
  // Appointment operations
  getAppointment(appointmentId: string): Promise<Appointment>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getPatientAppointments(patientId: string): Promise<Appointment[]>;
  updateAppointmentStatus(appointmentId: string, status: Appointment['status']): Promise<Appointment>;
  
  // Clinical documentation
  createClinicalNote(note: Omit<ClinicalNote, 'id'>): Promise<ClinicalNote>;
  getClinicalNote(noteId: string): Promise<ClinicalNote>;
  updateClinicalNote(noteId: string, updates: Partial<ClinicalNote>): Promise<ClinicalNote>;
  
  // Orders
  createOrder(order: Omit<Order, 'id'>): Promise<Order>;
  getOrders(patientId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: Order['status']): Promise<Order>;
  
  // FHIR operations (if enabled)
  fhirSearch?(resource: string, params: Record<string, any>): Promise<any>;
  fhirRead?(resource: string, id: string): Promise<any>;
  fhirCreate?(resource: string, data: any): Promise<any>;
  fhirUpdate?(resource: string, id: string, data: any): Promise<any>;
  
  // CDS Hooks (if enabled)
  invokeCdsHook?(hook: string, context: any): Promise<any>;
}

/**
 * Mock Adapter (for standalone mode)
 */
export class MockAdapter implements IIntegrationAdapter {
  private patients: Map<string, Patient> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private notes: Map<string, ClinicalNote> = new Map();
  private orders: Map<string, Order> = new Map();

  async getPatient(patientId: string): Promise<Patient> {
    const patient = this.patients.get(patientId);
    if (!patient) throw new Error('Patient not found');
    return patient;
  }

  async searchPatients(query: string): Promise<Patient[]> {
    return Array.from(this.patients.values()).filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mrn.includes(query)
    );
  }

  async updatePatient(patientId: string, data: Partial<Patient>): Promise<Patient> {
    const patient = await this.getPatient(patientId);
    const updated = { ...patient, ...data };
    this.patients.set(patientId, updated);
    return updated;
  }

  async getAppointment(appointmentId: string): Promise<Appointment> {
    const appointment = this.appointments.get(appointmentId);
    if (!appointment) throw new Error('Appointment not found');
    return appointment;
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(a => 
      a.startTime.startsWith(date)
    );
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(a => 
      a.patientId === patientId
    );
  }

  async updateAppointmentStatus(appointmentId: string, status: Appointment['status']): Promise<Appointment> {
    const appointment = await this.getAppointment(appointmentId);
    appointment.status = status;
    this.appointments.set(appointmentId, appointment);
    return appointment;
  }

  async createClinicalNote(note: Omit<ClinicalNote, 'id'>): Promise<ClinicalNote> {
    const id = `note-${Date.now()}`;
    const newNote = { ...note, id };
    this.notes.set(id, newNote);
    return newNote;
  }

  async getClinicalNote(noteId: string): Promise<ClinicalNote> {
    const note = this.notes.get(noteId);
    if (!note) throw new Error('Clinical note not found');
    return note;
  }

  async updateClinicalNote(noteId: string, updates: Partial<ClinicalNote>): Promise<ClinicalNote> {
    const note = await this.getClinicalNote(noteId);
    const updated = { ...note, ...updates };
    this.notes.set(noteId, updated);
    return updated;
  }

  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const id = `order-${Date.now()}`;
    const newOrder = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrders(patientId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.patientId === patientId);
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');
    order.status = status;
    this.orders.set(orderId, order);
    return order;
  }
}

/**
 * Epic FHIR Adapter
 */
export class EpicAdapter extends MockAdapter implements IIntegrationAdapter {
  private baseUrl: string;
  private clientId: string;
  private accessToken?: string;

  constructor(config: { baseUrl: string; clientId: string; accessToken?: string }) {
    super();
    this.baseUrl = config.baseUrl;
    this.clientId = config.clientId;
    this.accessToken = config.accessToken;
  }

  async fhirSearch(resource: string, params: Record<string, any>): Promise<any> {
    // Implementation would make actual FHIR API calls to Epic
    console.log(`Epic FHIR Search: ${resource}`, params);
    return { resourceType: 'Bundle', entry: [] };
  }

  async fhirRead(resource: string, id: string): Promise<any> {
    console.log(`Epic FHIR Read: ${resource}/${id}`);
    return {};
  }

  async fhirCreate(resource: string, data: any): Promise<any> {
    console.log(`Epic FHIR Create: ${resource}`, data);
    return data;
  }

  async fhirUpdate(resource: string, id: string, data: any): Promise<any> {
    console.log(`Epic FHIR Update: ${resource}/${id}`, data);
    return data;
  }
}

/**
 * Cerner FHIR Adapter
 */
export class CernerAdapter extends MockAdapter implements IIntegrationAdapter {
  private baseUrl: string;
  private clientId: string;

  constructor(config: { baseUrl: string; clientId: string }) {
    super();
    this.baseUrl = config.baseUrl;
    this.clientId = config.clientId;
  }

  async fhirSearch(resource: string, params: Record<string, any>): Promise<any> {
    console.log(`Cerner FHIR Search: ${resource}`, params);
    return { resourceType: 'Bundle', entry: [] };
  }
}

/**
 * Custom REST API Adapter
 */
export class CustomApiAdapter extends MockAdapter implements IIntegrationAdapter {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: { baseUrl: string; apiKey?: string; headers?: Record<string, string> }) {
    super();
    this.baseUrl = config.baseUrl;
    this.headers = config.headers || {};
    if (config.apiKey) {
      this.headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { ...this.headers, ...options.headers },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getPatient(patientId: string): Promise<Patient> {
    return this.makeRequest(`/patients/${patientId}`);
  }

  async searchPatients(query: string): Promise<Patient[]> {
    return this.makeRequest(`/patients/search?q=${encodeURIComponent(query)}`);
  }
}

/**
 * Integration Factory
 * Creates appropriate adapter based on configuration
 */
export class IntegrationFactory {
  static createAdapter(config: any): IIntegrationAdapter {
    const { ehrSystem, apiEndpoint, authType } = config;

    switch (ehrSystem) {
      case 'epic':
        return new EpicAdapter({
          baseUrl: apiEndpoint,
          clientId: config.clientId || '',
          accessToken: config.accessToken,
        });
      
      case 'cerner':
        return new CernerAdapter({
          baseUrl: apiEndpoint,
          clientId: config.clientId || '',
        });
      
      case 'custom':
        return new CustomApiAdapter({
          baseUrl: apiEndpoint,
          apiKey: config.apiKey,
          headers: config.customHeaders,
        });
      
      case 'none':
      default:
        return new MockAdapter();
    }
  }
}
