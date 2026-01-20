const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.avery-ai.com/v1';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'wss://ws.avery-ai.com';

// Twilio Configuration (Mock for production readiness)
export const TWILIO_CONFIG = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'AC_YOUR_ACCOUNT_SID',
  apiKey: import.meta.env.VITE_TWILIO_API_KEY || 'YOUR_TWILIO_API_KEY',
  phoneNumber: import.meta.env.VITE_TWILIO_PHONE || '+1-555-AVERY-AI',
};

// Stripe Configuration  
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_YOUR_STRIPE_KEY',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || 'whsec_YOUR_WEBHOOK_SECRET',
};

// Google Voice/Cloud Speech Configuration
export const GOOGLE_VOICE_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_CLOUD_API_KEY || 'YOUR_GOOGLE_CLOUD_API_KEY',
  projectId: import.meta.env.VITE_GOOGLE_PROJECT_ID || 'avery-ai-project',
};

// ElevenLabs for Sol-like Voice (Production Voice Synthesis)
export const ELEVENLABS_CONFIG = {
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || 'YOUR_ELEVENLABS_API_KEY',
  voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'sol_voice_id', // Sol-like voice
};

interface ApiError {
  code: string;
  message: string;
  status: number;
}

class AveryApiClient {
  private baseUrl: string;
  private wsUrl: string;
  private socket: WebSocket | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.wsUrl = WS_BASE_URL;
  }

  /**
   * Generic fetch with error handling and retries
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('avery_auth_token');

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ============================================
  // CALLS API
  // ============================================
  
  async getCalls(filters?: { status?: string; dateFrom?: string; dateTo?: string }) {
    return this.fetch<any>(`/calls?${new URLSearchParams(filters as any)}`);
  }

  async getCallById(callId: string) {
    return this.fetch<any>(`/calls/${callId}`);
  }

  async getCallRecording(callId: string): Promise<string> {
    // Returns pre-signed URL for audio file
    const response = await this.fetch<{ url: string }>(`/calls/${callId}/recording`);
    return response.url;
  }

  async getCallTranscript(callId: string) {
    return this.fetch<any>(`/calls/${callId}/transcript`);
  }

  // ============================================
  // TWILIO INTEGRATION
  // ============================================

  async initiateTwilioCall(to: string, from?: string) {
    return this.fetch<any>('/twilio/calls', {
      method: 'POST',
      body: JSON.stringify({
        to,
        from: from || TWILIO_CONFIG.phoneNumber,
      }),
    });
  }

  async getTwilioCallStatus(callSid: string) {
    return this.fetch<any>(`/twilio/calls/${callSid}/status`);
  }

  // ============================================
  // BOOKINGS & PAYMENTS
  // ============================================

  async getBookings(filters?: { status?: string }) {
    return this.fetch<any>(`/bookings?${new URLSearchParams(filters as any)}`);
  }

  async createPaymentLink(bookingId: string, amount: number) {
    return this.fetch<{ url: string }>('/stripe/payment-links', {
      method: 'POST',
      body: JSON.stringify({ bookingId, amount }),
    });
  }

  async sendPaymentLink(bookingId: string, phone: string) {
    return this.fetch<any>(`/bookings/${bookingId}/payment-link`, {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async processStripePayment(paymentIntentId: string) {
    return this.fetch<any>(`/stripe/payments/${paymentIntentId}/confirm`, {
      method: 'POST',
    });
  }

  // ============================================
  // VOICE SYNTHESIS (ElevenLabs - Sol-like)
  // ============================================

  async synthesizeVoice(text: string, voiceSettings?: any): Promise<Blob> {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_CONFIG.voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_CONFIG.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_settings: voiceSettings || {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      }),
    });

    return await response.blob();
  }

  // ============================================
  // GOOGLE VOICE (Speech-to-Text)
  // ============================================

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    // Convert blob to base64
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        try {
          const response = await fetch(
            `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_VOICE_CONFIG.apiKey}`,
            {
              method: 'POST',
              body: JSON.stringify({
                config: {
                  encoding: 'LINEAR16',
                  sampleRateHertz: 16000,
                  languageCode: 'en-US',
                },
                audio: {
                  content: base64Audio,
                },
              }),
            }
          );

          const data = await response.json();
          const transcript = data.results
            ?.map((result: any) => result.alternatives[0].transcript)
            .join(' ');
          
          resolve(transcript || '');
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(audioBlob);
    });
  }

  // ============================================
  // REAL-TIME WEBSOCKET
  // ============================================

  connectWebSocket(onMessage: (data: any) => void, onError?: (error: any) => void) {
    const token = localStorage.getItem('avery_auth_token');
    this.socket = new WebSocket(`${this.wsUrl}?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        this.connectWebSocket(onMessage, onError);
      }, 5000);
    };
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // ============================================
  // ANALYTICS
  // ============================================

  async trackEvent(event: string, properties?: Record<string, any>) {
    return this.fetch<any>('/analytics/events', {
      method: 'POST',
      body: JSON.stringify({
        event,
        properties,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  // ============================================
  // DASHBOARD STATS
  // ============================================

  async getDashboardStats(timeRange = 'week') {
    return this.fetch<any>(`/dashboard/stats?timeRange=${timeRange}`);
  }
}

// Export singleton instance
export const api = new AveryApiClient();

// Export helper functions
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phone;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
