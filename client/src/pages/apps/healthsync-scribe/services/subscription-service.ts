/**
 * Subscription & Billing Service
 * Manage subscriptions, payments, and usage tracking
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    users: number;
    patientsPerMonth: number;
    storage: number; // GB
    aiScribeMinutes: number;
    locations: number;
  };
  popular?: boolean;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
  paymentMethod?: PaymentMethod;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'ach' | 'wire';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface UsageMetrics {
  users: number;
  patientsThisMonth: number;
  storageUsed: number; // GB
  aiScribeMinutesUsed: number;
  locations: number;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  dueDate: string;
  paidAt?: string;
  invoiceUrl: string;
}

class SubscriptionService {
  private plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free Trial',
      description: 'Perfect for trying out HealthSync Scribe',
      price: 0,
      interval: 'month',
      features: [
        '1 user',
        '50 patients/month',
        '1 GB storage',
        '30 AI scribe minutes/month',
        'Basic support',
      ],
      limits: {
        users: 1,
        patientsPerMonth: 50,
        storage: 1,
        aiScribeMinutes: 30,
        locations: 1,
      },
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'For small to medium practices',
      price: 299,
      interval: 'month',
      features: [
        'Up to 10 users',
        'Unlimited patients',
        '50 GB storage',
        '500 AI scribe minutes/month',
        'All integrations',
        'Priority support',
        'Custom branding',
      ],
      limits: {
        users: 10,
        patientsPerMonth: -1, // unlimited
        storage: 50,
        aiScribeMinutes: 500,
        locations: 3,
      },
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: 999,
      interval: 'month',
      features: [
        'Unlimited users',
        'Unlimited patients',
        'Unlimited storage',
        'Unlimited AI scribe',
        'All integrations',
        'Dedicated support',
        'Custom branding',
        'SLA guarantee',
        'Custom contracts',
        'On-premise option',
      ],
      limits: {
        users: -1,
        patientsPerMonth: -1,
        storage: -1,
        aiScribeMinutes: -1,
        locations: -1,
      },
    },
  ];

  /**
   * Get all available plans
   */
  getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  /**
   * Get specific plan
   */
  getPlan(planId: string): SubscriptionPlan | undefined {
    return this.plans.find(p => p.id === planId);
  }

  /**
   * Get current subscription
   */
  async getCurrentSubscription(organizationId: string): Promise<Subscription | null> {
    // In production, fetch from backend
    const mockSubscription: Subscription = {
      id: 'sub_123',
      organizationId,
      planId: 'professional',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      paymentMethod: {
        id: 'pm_123',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
      },
    };

    return mockSubscription;
  }

  /**
   * Get usage metrics
   */
  async getUsageMetrics(organizationId: string): Promise<UsageMetrics> {
    // In production, fetch from backend
    return {
      users: 5,
      patientsThisMonth: 127,
      storageUsed: 12.5,
      aiScribeMinutesUsed: 234,
      locations: 2,
    };
  }

  /**
   * Check if feature is available in current plan
   */
  async canUseFeature(feature: string): Promise<boolean> {
    const subscription = await this.getCurrentSubscription('current-org-id');
    if (!subscription) return false;

    const plan = this.getPlan(subscription.planId);
    if (!plan) return false;

    return plan.features.includes(feature);
  }

  /**
   * Check if limit is exceeded
   */
  async checkLimit(limit: keyof SubscriptionPlan['limits'], currentValue: number): Promise<boolean> {
    const subscription = await this.getCurrentSubscription('current-org-id');
    if (!subscription) return false;

    const plan = this.getPlan(subscription.planId);
    if (!plan) return false;

    const limitValue = plan.limits[limit];
    if (limitValue === -1) return true; // unlimited

    return currentValue < limitValue;
  }

  /**
   * Subscribe to a plan
   */
  async subscribe(planId: string, paymentMethodId: string): Promise<Subscription> {
    // In production, call Stripe/payment processor
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      organizationId: 'current-org-id',
      planId,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    };

    return subscription;
  }

  /**
   * Update subscription plan
   */
  async updatePlan(newPlanId: string): Promise<Subscription> {
    // In production, call backend/Stripe
    const subscription = await this.getCurrentSubscription('current-org-id');
    if (!subscription) throw new Error('No active subscription');

    subscription.planId = newPlanId;
    return subscription;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(cancelImmediately: boolean = false): Promise<Subscription> {
    const subscription = await this.getCurrentSubscription('current-org-id');
    if (!subscription) throw new Error('No active subscription');

    if (cancelImmediately) {
      subscription.status = 'cancelled';
    } else {
      subscription.cancelAtPeriodEnd = true;
    }

    return subscription;
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(paymentMethodData: {
    type: 'card' | 'ach';
    cardNumber?: string;
    expiryMonth?: number;
    expiryYear?: number;
    cvc?: string;
    accountNumber?: string;
    routingNumber?: string;
  }): Promise<PaymentMethod> {
    // In production, tokenize with Stripe and save
    const paymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: paymentMethodData.type,
      last4: paymentMethodData.cardNumber?.slice(-4) || paymentMethodData.accountNumber?.slice(-4) || '****',
      brand: 'Visa',
      expiryMonth: paymentMethodData.expiryMonth,
      expiryYear: paymentMethodData.expiryYear,
    };

    return paymentMethod;
  }

  /**
   * Get invoices
   */
  async getInvoices(organizationId: string): Promise<Invoice[]> {
    // In production, fetch from backend/Stripe
    return [
      {
        id: 'inv_123',
        amount: 299,
        status: 'paid',
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        invoiceUrl: 'https://invoice.example.com/inv_123',
      },
      {
        id: 'inv_124',
        amount: 299,
        status: 'pending',
        dueDate: new Date().toISOString(),
        invoiceUrl: 'https://invoice.example.com/inv_124',
      },
    ];
  }

  /**
   * Start free trial
   */
  async startTrial(): Promise<Subscription> {
    const subscription: Subscription = {
      id: `sub_trial_${Date.now()}`,
      organizationId: 'current-org-id',
      planId: 'professional', // Trial of professional plan
      status: 'trial',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    };

    return subscription;
  }

  /**
   * Calculate prorated amount for plan change
   */
  calculateProration(currentPlanId: string, newPlanId: string, daysRemaining: number): number {
    const currentPlan = this.getPlan(currentPlanId);
    const newPlan = this.getPlan(newPlanId);

    if (!currentPlan || !newPlan) return 0;

    const dailyRate = newPlan.price / 30;
    const unusedCredit = (currentPlan.price / 30) * daysRemaining;
    const newCharge = dailyRate * daysRemaining;

    return Math.max(0, newCharge - unusedCredit);
  }

  /**
   * Get pricing for annual vs monthly
   */
  getAnnualDiscount(planId: string): { monthly: number; annual: number; savings: number } {
    const plan = this.getPlan(planId);
    if (!plan) return { monthly: 0, annual: 0, savings: 0 };

    const monthly = plan.price;
    const annual = monthly * 10; // 2 months free
    const savings = monthly * 2;

    return { monthly, annual, savings };
  }
}

// Singleton instance
export const subscriptionService = new SubscriptionService();
