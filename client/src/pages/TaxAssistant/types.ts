
export type ConnectionStatus = 'checking' | 'connected' | 'error' | 'offline';

export interface KVRecord {
  key: string;
  value: any;
  updated_at: string;
}

export interface ServiceStatus {
  database: ConnectionStatus;
  auth: ConnectionStatus;
  functions: ConnectionStatus;
}

export interface TaxEntry {
  id: string;
  type: 'income' | 'expense' | 'crypto';
  amount: number;
  description: string;
  date: string;
}
