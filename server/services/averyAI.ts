import { invokeLLM } from '../_core/llm';

export interface Conversation {
  id: number;
  userId: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  status: 'active' | 'resolved' | 'escalated';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Message {
  id: number;
  conversationId: number;
  role: 'customer' | 'ai' | 'agent';
  content: string;
  timestamp: Date;
}

export async function getConversations(userId: number): Promise<Conversation[]> {
  return [
    { id: 1, userId, customerName: 'John Doe', customerEmail: 'john@example.com', status: 'resolved', createdAt: new Date(Date.now() - 3600000), resolvedAt: new Date() },
    { id: 2, userId, customerName: 'Jane Smith', customerPhone: '555-0123', status: 'active', createdAt: new Date() },
  ];
}

export async function getMessages(conversationId: number): Promise<Message[]> {
  return [
    { id: 1, conversationId, role: 'customer', content: 'Hi, I need help with my order', timestamp: new Date(Date.now() - 300000) },
    { id: 2, conversationId, role: 'ai', content: 'Hello! I\'d be happy to help. Can you provide your order number?', timestamp: new Date(Date.now() - 240000) },
    { id: 3, conversationId, role: 'customer', content: 'It\'s #12345', timestamp: new Date(Date.now() - 180000) },
  ];
}

export async function sendMessage(params: {
  conversationId: number;
  content: string;
  role: 'customer' | 'ai' | 'agent';
}): Promise<Message> {
  return {
    id: Date.now(),
    conversationId: params.conversationId,
    role: params.role,
    content: params.content,
    timestamp: new Date(),
  };
}

export async function generateAIResponse(params: {
  conversationId: number;
  customerMessage: string;
  conversationHistory: Message[];
}): Promise<string> {
  const historyStr = params.conversationHistory
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  const response = await invokeLLM({
    messages: [
      {
        role: 'system',
        content: 'You are Avery, a professional AI receptionist. Be helpful, friendly, and concise. Handle customer inquiries professionally.',
      },
      {
        role: 'user',
        content: `Conversation history:\n${historyStr}\n\nCustomer: ${params.customerMessage}\n\nProvide a helpful response:`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || '';
  return typeof content === 'string' ? content : 'I apologize, but I\'m having trouble processing your request. Let me connect you with a human agent.';
}

export async function escalateToHuman(conversationId: number): Promise<Conversation> {
  return {
    id: conversationId,
    userId: 1,
    customerName: 'Customer',
    status: 'escalated',
    createdAt: new Date(),
  };
}

export async function getAnalytics(userId: number): Promise<{
  totalConversations: number;
  resolvedByAI: number;
  escalated: number;
  averageResolutionTime: number;
  satisfactionScore: number;
}> {
  return {
    totalConversations: 1250,
    resolvedByAI: 980,
    escalated: 120,
    averageResolutionTime: 4.5,
    satisfactionScore: 4.7,
  };
}
