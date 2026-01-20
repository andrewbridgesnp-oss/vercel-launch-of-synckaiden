import { Router } from 'express';
import { db } from '../db';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

// Get all platforms
router.get('/platforms', async (req, res) => {
  try {
    const platforms = await db.query(`
      SELECT p.*, 
        COALESCE(json_agg(
          json_build_object(
            'slug', pa.app_slug,
            'name', pa.app_name
          )
        ) FILTER (WHERE pa.id IS NOT NULL), '[]') as apps
      FROM platforms p
      LEFT JOIN platform_apps pa ON p.id = pa.platform_id
      GROUP BY p.id
      ORDER BY p.id
    `);
    
    res.json(platforms.rows);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
});

// Get user's active subscriptions
router.get('/platforms/subscriptions', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscriptions = await db.query(`
      SELECT ups.*, p.name, p.slug, p.description
      FROM user_platform_subscriptions ups
      JOIN platforms p ON ups.platform_id = p.id
      WHERE ups.user_id = $1 AND ups.status = 'active'
    `, [userId]);
    
    res.json(subscriptions.rows);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Check if user has access to a specific platform
router.get('/platforms/:slug/access', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { slug } = req.params;
    
    if (!userId) {
      return res.status(401).json({ hasAccess: false });
    }

    // Check if platform is free (Security & Infrastructure)
    const platform = await db.query(`
      SELECT id, is_free FROM platforms WHERE slug = $1
    `, [slug]);

    if (platform.rows[0]?.is_free) {
      return res.json({ hasAccess: true, reason: 'free_platform' });
    }

    // Check if user has active subscription
    const subscription = await db.query(`
      SELECT ups.* FROM user_platform_subscriptions ups
      JOIN platforms p ON ups.platform_id = p.id
      WHERE ups.user_id = $1 AND p.slug = $2 AND ups.status = 'active'
    `, [userId, slug]);
    
    res.json({ 
      hasAccess: subscription.rows.length > 0,
      subscription: subscription.rows[0] || null
    });
  } catch (error) {
    console.error('Error checking platform access:', error);
    res.status(500).json({ error: 'Failed to check access' });
  }
});

// Create Stripe checkout session for platform subscription
router.post('/platforms/:slug/subscribe', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { slug } = req.params;
    const { tier = 'pro' } = req.body; // 'pro' or 'enterprise'
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get platform details
    const platform = await db.query(`
      SELECT * FROM platforms WHERE slug = $1
    `, [slug]);

    if (!platform.rows[0]) {
      return res.status(404).json({ error: 'Platform not found' });
    }

    const platformData = platform.rows[0];
    const price = tier === 'enterprise' ? platformData.price_enterprise : platformData.price_pro;

    // Create or get Stripe customer
    let stripeCustomerId = req.user?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user?.email,
        metadata: {
          userId: userId.toString(),
        },
      });
      stripeCustomerId = customer.id;
      
      // Update user with Stripe customer ID
      await db.query(`
        UPDATE users SET stripe_customer_id = $1 WHERE id = $2
      `, [stripeCustomerId, userId]);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${platformData.name} - ${tier === 'enterprise' ? 'Enterprise' : 'Pro'} Tier`,
              description: platformData.description,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/gate-8`,
      metadata: {
        userId: userId.toString(),
        platformId: platformData.id.toString(),
        platformSlug: slug,
        tier,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook handler
router.post('/platforms/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
      
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;
      
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionDeleted(deletedSubscription);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Helper functions
async function handleCheckoutSessionCompleted(session: any) {
  const { userId, platformId, tier } = session.metadata;
  const subscriptionId = session.subscription;

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Create or update user platform subscription
  await db.query(`
    INSERT INTO user_platform_subscriptions 
    (user_id, platform_id, tier, status, stripe_subscription_id, stripe_customer_id, current_period_start, current_period_end)
    VALUES ($1, $2, $3, 'active', $4, $5, to_timestamp($6), to_timestamp($7))
    ON CONFLICT (user_id, platform_id)
    DO UPDATE SET
      tier = EXCLUDED.tier,
      status = 'active',
      stripe_subscription_id = EXCLUDED.stripe_subscription_id,
      current_period_start = EXCLUDED.current_period_start,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = CURRENT_TIMESTAMP
  `, [
    userId,
    platformId,
    tier,
    subscriptionId,
    session.customer,
    subscription.current_period_start,
    subscription.current_period_end,
  ]);
}

async function handleSubscriptionUpdated(subscription: any) {
  await db.query(`
    UPDATE user_platform_subscriptions
    SET 
      status = $1,
      current_period_start = to_timestamp($2),
      current_period_end = to_timestamp($3),
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = $4
  `, [
    subscription.status === 'active' ? 'active' : 'cancelled',
    subscription.current_period_start,
    subscription.current_period_end,
    subscription.id,
  ]);
}

async function handleSubscriptionDeleted(subscription: any) {
  await db.query(`
    UPDATE user_platform_subscriptions
    SET 
      status = 'cancelled',
      cancelled_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = $1
  `, [subscription.id]);
}

// Cancel subscription
router.post('/platforms/subscriptions/:id/cancel', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get subscription
    const subscription = await db.query(`
      SELECT * FROM user_platform_subscriptions
      WHERE id = $1 AND user_id = $2
    `, [id, userId]);

    if (!subscription.rows[0]) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const sub = subscription.rows[0];

    // Cancel in Stripe
    await stripe.subscriptions.cancel(sub.stripe_subscription_id);

    // Update in database
    await db.query(`
      UPDATE user_platform_subscriptions
      SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [id]);

    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export default router;
