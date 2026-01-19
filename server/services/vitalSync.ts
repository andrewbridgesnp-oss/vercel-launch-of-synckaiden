import { invokeLLM } from '../_core/llm';

export interface HealthMetric {
  id: number;
  userId: number;
  type: 'blood_pressure' | 'heart_rate' | 'weight' | 'blood_glucose' | 'temperature' | 'oxygen_saturation';
  value: number;
  unit: string;
  recordedAt: Date;
  notes?: string;
}

export interface Appointment {
  id: number;
  userId: number;
  providerId: number;
  type: 'video' | 'phone' | 'in_person';
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledAt: Date;
  duration: number;
  notes?: string;
}

export async function getHealthMetrics(userId: number, type?: string): Promise<HealthMetric[]> {
  return [
    { id: 1, userId, type: 'blood_pressure', value: 120, unit: 'mmHg', recordedAt: new Date(), notes: 'Systolic' },
    { id: 2, userId, type: 'heart_rate', value: 72, unit: 'bpm', recordedAt: new Date() },
    { id: 3, userId, type: 'weight', value: 165, unit: 'lbs', recordedAt: new Date() },
  ];
}

export async function recordHealthMetric(params: {
  userId: number;
  type: string;
  value: number;
  unit: string;
  notes?: string;
}): Promise<HealthMetric> {
  return {
    id: Date.now(),
    userId: params.userId,
    type: params.type as any,
    value: params.value,
    unit: params.unit,
    recordedAt: new Date(),
    notes: params.notes,
  };
}

export async function getAppointments(userId: number): Promise<Appointment[]> {
  return [
    {
      id: 1,
      userId,
      providerId: 1,
      type: 'video',
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 86400000),
      duration: 30,
    },
  ];
}

export async function scheduleAppointment(params: {
  userId: number;
  providerId: number;
  type: string;
  scheduledAt: Date;
  duration: number;
}): Promise<Appointment> {
  return {
    id: Date.now(),
    userId: params.userId,
    providerId: params.providerId,
    type: params.type as any,
    status: 'scheduled',
    scheduledAt: params.scheduledAt,
    duration: params.duration,
  };
}

export async function getHealthInsights(userId: number): Promise<{ insights: string[]; recommendations: string[] }> {
  const response = await invokeLLM({
    messages: [
      { role: 'system', content: 'You are a health advisor. Provide brief, actionable health insights.' },
      { role: 'user', content: `Analyze health metrics for user ${userId} and provide 3 key insights and 3 recommendations.` },
    ],
  });

  const content = response.choices[0]?.message?.content || '';
  const text = typeof content === 'string' ? content : '';

  return {
    insights: ['Your blood pressure is in the healthy range', 'Heart rate is normal', 'Weight is stable'],
    recommendations: ['Continue regular exercise', 'Maintain balanced diet', 'Stay hydrated'],
  };
}
