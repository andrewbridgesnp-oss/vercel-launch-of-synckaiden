import Stripe from 'stripe';
import { 
  createSubscription, 
  updateSubscription, 
  getSubscriptionByProviderId,
  createEntitlement,
  revokeEntitlement,
  createPayment,
  getProductById,
  createWebhookEvent,
  markWebhookProcessed,
  createAuditLog
} from '../db';
import { notifyOwner } from '../_core/notification';

// Initialize Stripe with API key from environment
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null;

export { stripe };

/**
 * Create a Stripe checkout session for subscription purchase
 */
export async function createCheckoutSession(params: {
  userId: number;
  priceId: string;
  productId: number;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: {
        userId: params.userId.toString(),
        productId: params.productId.toString(),
      },
      subscription_data: {
        metadata: {
          userId: params.userId.toString(),
          productId: params.productId.toString(),
        },
      },
    });

    await createAuditLog({
      userId: params.userId,
      action: 'checkout_session_created',
      resource: 'stripe',
      resourceId: params.productId,
      details: { sessionId: session.id, priceId: params.priceId },
      severity: 'info',
    });

    return session;
  } catch (error) {
    console.error('[Stripe] Failed to create checkout session:', error);
    throw error;
  }
}

/**
 * Create a Stripe customer portal session for subscription management
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('[Stripe] Failed to create portal session:', error);
    throw error;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  // Store webhook event for idempotency and debugging
  await createWebhookEvent({
    provider: 'stripe',
    eventId: event.id,
    eventType: event.type,
    payload: event,
  });

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }

    await markWebhookProcessed(event.id);
  } catch (error: any) {
    console.error(`[Stripe] Error processing webhook ${event.type}:`, error);
    await markWebhookProcessed(event.id, error.message);
    throw error;
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = parseInt(session.metadata?.userId || '0');
  const productId = parseInt(session.metadata?.productId || '0');

  if (!userId || !productId) {
    console.error('[Stripe] Missing userId or productId in checkout session metadata');
    return;
  }

  // Get the subscription ID from the session
  const subscriptionId = session.subscription as string;

  if (subscriptionId) {
    // Subscription checkout - entitlement will be granted in subscription.created event
    await createAuditLog({
      userId,
      action: 'checkout_completed',
      resource: 'stripe',
      resourceId: productId,
      details: { sessionId: session.id, subscriptionId },
      severity: 'info',
    });

    // Notify owner of new subscription
    await notifyOwner({
      title: 'New Subscription Purchase',
      content: `User ${userId} purchased product ${productId} via Stripe. Subscription: ${subscriptionId}`,
    });
  } else {
    // One-time payment - grant entitlement immediately
    await createEntitlement({
      userId,
      productId,
      grantedBy: 'subscription',
      status: 'active',
    });

    await createPayment({
      userId,
      amount: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || 'USD',
      provider: 'stripe',
      providerPaymentId: session.payment_intent as string,
      status: 'completed',
      productType: 'digital_product',
      productId,
    });

    await createAuditLog({
      userId,
      action: 'one_time_purchase_completed',
      resource: 'stripe',
      resourceId: productId,
      details: { sessionId: session.id },
      severity: 'info',
    });

    await notifyOwner({
      title: 'New One-Time Purchase',
      content: `User ${userId} purchased product ${productId} via Stripe. Amount: ${session.amount_total} ${session.currency}`,
    });
  }
}

/**
 * Handle customer.subscription.created event
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = parseInt(subscription.metadata?.userId || '0');
  const productId = parseInt(subscription.metadata?.productId || '0');

  if (!userId || !productId) {
    console.error('[Stripe] Missing userId or productId in subscription metadata');
    return;
  }

  // Get price information
  const priceId = subscription.items.data[0]?.price.id;
  
  // Create subscription record in database
  const result = await createSubscription({
    userId,
    productId,
    priceId: 0, // We'll need to map Stripe price ID to our price ID
    provider: 'stripe',
    providerSubscriptionId: subscription.id,
    providerCustomerId: subscription.customer as string,
    status: subscription.status as any,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : undefined,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined,
    metadata: subscription.metadata,
  });

  // Grant entitlement
  await createEntitlement({
    userId,
    productId,
    subscriptionId: result[0]?.insertId,
    grantedBy: 'subscription',
    status: 'active',
  });

  // Check if this is a bundle product - if so, grant access to all apps
  const product = await getProductById(productId);
  if (product?.type === 'bundle') {
    // TODO: Grant access to all apps in the bundle
    await createAuditLog({
      userId,
      action: 'bundle_subscription_created',
      resource: 'stripe',
      resourceId: productId,
      details: { subscriptionId: subscription.id },
      severity: 'info',
    });
  }

  await createAuditLog({
    userId,
    action: 'subscription_created',
    resource: 'stripe',
    resourceId: productId,
    details: { subscriptionId: subscription.id, status: subscription.status },
    severity: 'info',
  });
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSubscription = await getSubscriptionByProviderId(subscription.id);
  
  if (!dbSubscription) {
    console.error('[Stripe] Subscription not found in database:', subscription.id);
    return;
  }

  // Update subscription status
  await updateSubscription(dbSubscription.id, {
    status: subscription.status as any,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : undefined,
  });

  // If subscription is no longer active, revoke entitlement
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    await revokeEntitlement(dbSubscription.userId, dbSubscription.productId);
    
    await createAuditLog({
      userId: dbSubscription.userId,
      action: 'entitlement_revoked',
      resource: 'stripe',
      resourceId: dbSubscription.productId,
      details: { subscriptionId: subscription.id, reason: subscription.status },
      severity: 'warning',
    });

    await notifyOwner({
      title: 'Subscription Canceled',
      content: `User ${dbSubscription.userId} subscription for product ${dbSubscription.productId} was ${subscription.status}. Subscription: ${subscription.id}`,
    });
  }

  await createAuditLog({
    userId: dbSubscription.userId,
    action: 'subscription_updated',
    resource: 'stripe',
    resourceId: dbSubscription.productId,
    details: { subscriptionId: subscription.id, status: subscription.status },
    severity: 'info',
  });
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await getSubscriptionByProviderId(subscription.id);
  
  if (!dbSubscription) {
    console.error('[Stripe] Subscription not found in database:', subscription.id);
    return;
  }

  // Update subscription status
  await updateSubscription(dbSubscription.id, {
    status: 'canceled',
    canceledAt: new Date(),
  });

  // Revoke entitlement
  await revokeEntitlement(dbSubscription.userId, dbSubscription.productId);

  await createAuditLog({
    userId: dbSubscription.userId,
    action: 'subscription_deleted',
    resource: 'stripe',
    resourceId: dbSubscription.productId,
    details: { subscriptionId: subscription.id },
    severity: 'warning',
  });

  await notifyOwner({
    title: 'Subscription Deleted',
    content: `User ${dbSubscription.userId} subscription for product ${dbSubscription.productId} was deleted. Subscription: ${subscription.id}`,
  });
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : (invoice as any).subscription?.id;
  
  if (!subscriptionId) {
    return; // Not a subscription invoice
  }

  const dbSubscription = await getSubscriptionByProviderId(subscriptionId);
  
  if (!dbSubscription) {
    console.error('[Stripe] Subscription not found in database:', subscriptionId);
    return;
  }

  // Record payment
  await createPayment({
    userId: dbSubscription.userId,
    amount: invoice.amount_paid,
    currency: invoice.currency.toUpperCase(),
    provider: 'stripe',
    providerPaymentId: typeof (invoice as any).payment_intent === 'string' ? (invoice as any).payment_intent : (invoice as any).payment_intent?.id || '',
    status: 'completed',
    productType: 'subscription',
    productId: dbSubscription.productId,
    subscriptionId: dbSubscription.id,
    metadata: { invoiceId: invoice.id },
  });

  await createAuditLog({
    userId: dbSubscription.userId,
    action: 'payment_succeeded',
    resource: 'stripe',
    resourceId: dbSubscription.productId,
    details: { invoiceId: invoice.id, amount: invoice.amount_paid },
    severity: 'info',
  });
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : (invoice as any).subscription?.id;
  
  if (!subscriptionId) {
    return; // Not a subscription invoice
  }

  const dbSubscription = await getSubscriptionByProviderId(subscriptionId);
  
  if (!dbSubscription) {
    console.error('[Stripe] Subscription not found in database:', subscriptionId);
    return;
  }

  // Record failed payment
  await createPayment({
    userId: dbSubscription.userId,
    amount: invoice.amount_due,
    currency: invoice.currency.toUpperCase(),
    provider: 'stripe',
    providerPaymentId: typeof (invoice as any).payment_intent === 'string' ? (invoice as any).payment_intent : (invoice as any).payment_intent?.id || '',
    status: 'failed',
    productType: 'subscription',
    productId: dbSubscription.productId,
    subscriptionId: dbSubscription.id,
    metadata: { invoiceId: invoice.id },
  });

  await createAuditLog({
    userId: dbSubscription.userId,
    action: 'payment_failed',
    resource: 'stripe',
    resourceId: dbSubscription.productId,
    details: { invoiceId: invoice.id, amount: invoice.amount_due },
    severity: 'critical',
  });

  await notifyOwner({
    title: 'Payment Failed',
    content: `Payment failed for user ${dbSubscription.userId} subscription (product ${dbSubscription.productId}). Amount: ${invoice.amount_due} ${invoice.currency}. Invoice: ${invoice.id}`,
  });
}
