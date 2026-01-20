import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@20";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Stripe
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as any });

// Health check endpoint
app.get("/make-server-7054278a/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================================================
// AUTH ROUTES
// ============================================================================

// Sign up endpoint
app.post("/make-server-7054278a/auth/signup", async (c) => {
  try {
    const { email, password, name, role = 'borrower', agentReferralCode } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, agentReferralCode },
      // Auto-confirm email since email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.log(`Auth error during signup for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Check if referred by an agent
    let referredByAgentId = null;
    if (agentReferralCode) {
      const agentData = await kv.get(`agent:code:${agentReferralCode}`);
      if (agentData) {
        referredByAgentId = agentData;
      }
    }

    // Create user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      plan: 'free',
      organizationId: null,
      referredByAgentId,
      agentReferralCode: agentReferralCode || null
    });

    // Create default organization for borrower or agent
    if (role === 'borrower' || role === 'realtor') {
      const orgId = `org_${data.user.id}_${Date.now()}`;
      await kv.set(`org:${orgId}`, {
        id: orgId,
        name: role === 'realtor' ? `${name}'s Agency` : `${name}'s Organization`,
        ownerId: data.user.id,
        type: role === 'realtor' ? 'agent' : 'borrower',
        createdAt: new Date().toISOString()
      });

      // Update user with organization
      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        plan: 'free',
        organizationId: orgId,
        referredByAgentId,
        agentReferralCode: agentReferralCode || null
      });

      // If agent, create referral code
      if (role === 'realtor') {
        const referralCode = `AGENT${Date.now().toString(36).toUpperCase()}`;
        await kv.set(`agent:${data.user.id}`, {
          userId: data.user.id,
          referralCode,
          totalReferrals: 0,
          totalCommissionsEarned: 0,
          commissionRate: 0.20, // 20%
          createdAt: new Date().toISOString()
        });
        await kv.set(`agent:code:${referralCode}`, data.user.id);
      }
    }

    // If referred by agent, track the referral
    if (referredByAgentId) {
      const agentProfile = await kv.get(`agent:${referredByAgentId}`);
      if (agentProfile) {
        await kv.set(`agent:${referredByAgentId}`, {
          ...agentProfile,
          totalReferrals: (agentProfile.totalReferrals || 0) + 1
        });
        
        await kv.set(`referral:${data.user.id}`, {
          userId: data.user.id,
          agentId: referredByAgentId,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    }

    return c.json({ 
      user: { id: data.user.id, email, name, role },
      message: 'User created successfully'
    });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get current user profile
app.get("/make-server-7054278a/auth/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - no token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized - invalid token' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ user: userProfile });
  } catch (error) {
    console.log(`Get user error: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================================================
// RULES ENGINE (Date-versioned FHA/HUD limits)
// ============================================================================

app.get("/make-server-7054278a/rules/current", async (c) => {
  try {
    // Get current rules - in production these would be versioned by effective date
    const rules = await kv.get('rules:current') || {
      effectiveDate: '2024-11-04',
      limited203kMaxRehab: 75000,
      limited203kMaxRehabPre20241104: 35000,
      limited203kMaxRehabQOZ: 50000,
      limited203kTimeframe: 9, // months
      standard203kTimeframe: 12, // months
      fhaSellerContributionCap: 0.06, // 6% of sales price
      mortgagePaymentReserveMaxMonths: 12,
      version: '1.0.0'
    };

    return c.json({ rules });
  } catch (error) {
    console.log(`Get rules error: ${error}`);
    return c.json({ error: 'Error fetching rules' }, 500);
  }
});

// ============================================================================
// DEAL ROOM ROUTES
// ============================================================================

// Create deal room
app.post("/make-server-7054278a/deals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Check plan limits
    if (userProfile.plan === 'free') {
      const userDeals = await kv.getByPrefix(`deal:user:${user.id}:`);
      if (userDeals && userDeals.length >= 1) {
        return c.json({ error: 'Free plan limited to 1 Deal Room. Upgrade to create more.' }, 403);
      }
    }

    const dealData = await c.req.json();
    const dealId = `deal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const deal = {
      id: dealId,
      ownerId: user.id,
      organizationId: userProfile.organizationId,
      status: 'active',
      propertyAddress: dealData.propertyAddress || '',
      propertyUnits: dealData.propertyUnits || 1,
      purchasePrice: dealData.purchasePrice || 0,
      rehabCosts: dealData.rehabCosts || 0,
      programType: dealData.programType || 'limited', // limited or standard
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teamMembers: [{ userId: user.id, role: 'owner' }],
      stage: 'pre-qual',
      fitScore: 0
    };

    await kv.set(`deal:${dealId}`, deal);
    await kv.set(`deal:user:${user.id}:${dealId}`, dealId);

    // Log audit event
    await kv.set(`audit:${dealId}:${Date.now()}`, {
      dealId,
      userId: user.id,
      action: 'deal_created',
      timestamp: new Date().toISOString()
    });

    return c.json({ deal });
  } catch (error) {
    console.log(`Create deal error: ${error}`);
    return c.json({ error: 'Error creating deal room' }, 500);
  }
});

// Get all deals for user
app.get("/make-server-7054278a/deals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dealIds = await kv.getByPrefix(`deal:user:${user.id}:`);
    const deals = [];
    
    for (const dealIdEntry of dealIds || []) {
      const deal = await kv.get(`deal:${dealIdEntry}`);
      if (deal) {
        deals.push(deal);
      }
    }

    return c.json({ deals });
  } catch (error) {
    console.log(`Get deals error: ${error}`);
    return c.json({ error: 'Error fetching deals' }, 500);
  }
});

// Get single deal
app.get("/make-server-7054278a/deals/:dealId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dealId = c.req.param('dealId');
    const deal = await kv.get(`deal:${dealId}`);

    if (!deal) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    // Check access
    const isTeamMember = deal.teamMembers?.some((m: any) => m.userId === user.id);
    if (!isTeamMember && deal.ownerId !== user.id) {
      return c.json({ error: 'Access denied' }, 403);
    }

    return c.json({ deal });
  } catch (error) {
    console.log(`Get deal error: ${error}`);
    return c.json({ error: 'Error fetching deal' }, 500);
  }
});

// Update deal
app.put("/make-server-7054278a/deals/:dealId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dealId = c.req.param('dealId');
    const deal = await kv.get(`deal:${dealId}`);

    if (!deal) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    // Check access
    const isTeamMember = deal.teamMembers?.some((m: any) => m.userId === user.id);
    if (!isTeamMember && deal.ownerId !== user.id) {
      return c.json({ error: 'Access denied' }, 403);
    }

    const updates = await c.req.json();
    const updatedDeal = {
      ...deal,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`deal:${dealId}`, updatedDeal);

    // Log audit event
    await kv.set(`audit:${dealId}:${Date.now()}`, {
      dealId,
      userId: user.id,
      action: 'deal_updated',
      changes: Object.keys(updates),
      timestamp: new Date().toISOString()
    });

    return c.json({ deal: updatedDeal });
  } catch (error) {
    console.log(`Update deal error: ${error}`);
    return c.json({ error: 'Error updating deal' }, 500);
  }
});

// ============================================================================
// STRIPE SUBSCRIPTION ROUTES
// ============================================================================

// Create checkout session
app.post("/make-server-7054278a/subscriptions/checkout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { plan, successUrl, cancelUrl } = await c.req.json();

    const priceMap: any = {
      'pro': 'price_pro_monthly',
      'team': 'price_team_monthly',
      'enterprise': 'price_enterprise_monthly'
    };

    if (!priceMap[plan]) {
      return c.json({ error: 'Invalid plan' }, 400);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceMap[plan],
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl || 'http://localhost:3000/success',
      cancel_url: cancelUrl || 'http://localhost:3000/cancel',
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        plan: plan
      }
    });

    return c.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.log(`Checkout session error: ${error}`);
    return c.json({ error: 'Error creating checkout session' }, 500);
  }
});

// Stripe webhook handler
app.post("/make-server-7054278a/webhooks/stripe", async (c) => {
  try {
    const sig = c.req.header('stripe-signature');
    const body = await c.req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed: ${err}`);
      return c.json({ error: 'Webhook signature verification failed' }, 400);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.client_reference_id;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          const user = await kv.get(`user:${userId}`);
          if (user) {
            await kv.set(`user:${userId}`, {
              ...user,
              plan,
              subscriptionId: session.subscription,
              subscriptionStatus: 'active'
            });
          }
        }
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        // Find user by subscription ID and downgrade to free
        const users = await kv.getByPrefix('user:');
        for (const userData of users || []) {
          const u = await kv.get(userData);
          if (u?.subscriptionId === subscription.id) {
            await kv.set(`user:${u.id}`, {
              ...u,
              plan: 'free',
              subscriptionStatus: 'canceled'
            });
          }
        }
        break;
    }

    return c.json({ received: true });
  } catch (error) {
    console.log(`Webhook error: ${error}`);
    return c.json({ error: 'Webhook processing error' }, 500);
  }
});

// Create billing portal session
app.post("/make-server-7054278a/subscriptions/portal", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile?.subscriptionId) {
      return c.json({ error: 'No active subscription' }, 400);
    }

    const { returnUrl } = await c.req.json();

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userProfile.customerId,
      return_url: returnUrl || 'http://localhost:3000/dashboard',
    });

    return c.json({ url: portalSession.url });
  } catch (error) {
    console.log(`Billing portal error: ${error}`);
    return c.json({ error: 'Error creating billing portal session' }, 500);
  }
});

// ============================================================================
// PARTNER MARKETPLACE ROUTES
// ============================================================================

// Get partners
app.get("/make-server-7054278a/partners", async (c) => {
  try {
    const role = c.req.query('role');
    const state = c.req.query('state');
    
    let partners = await kv.getByPrefix('partner:');
    partners = partners || [];

    // Filter by role and state if provided
    const filteredPartners = [];
    for (const partnerId of partners) {
      const partner = await kv.get(partnerId);
      if (partner) {
        if (role && partner.role !== role) continue;
        if (state && !partner.serviceAreas?.includes(state)) continue;
        filteredPartners.push(partner);
      }
    }

    return c.json({ partners: filteredPartners });
  } catch (error) {
    console.log(`Get partners error: ${error}`);
    return c.json({ error: 'Error fetching partners' }, 500);
  }
});

// Invite partner to deal
app.post("/make-server-7054278a/deals/:dealId/invite", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const dealId = c.req.param('dealId');
    const deal = await kv.get(`deal:${dealId}`);

    if (!deal) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    if (deal.ownerId !== user.id) {
      return c.json({ error: 'Only deal owner can invite partners' }, 403);
    }

    const { email, role } = await c.req.json();

    // Create invitation
    const inviteId = `invite_${Date.now()}`;
    await kv.set(`invite:${inviteId}`, {
      id: inviteId,
      dealId,
      email,
      role,
      invitedBy: user.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // In production, send email here

    return c.json({ 
      message: 'Invitation sent',
      inviteId
    });
  } catch (error) {
    console.log(`Invite partner error: ${error}`);
    return c.json({ error: 'Error sending invitation' }, 500);
  }
});

// ============================================================================
// AGENT REFERRAL & COMMISSION ROUTES
// ============================================================================

// Get agent dashboard data
app.get("/make-server-7054278a/agent/dashboard", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile?.role !== 'realtor') {
      return c.json({ error: 'Only agents can access this endpoint' }, 403);
    }

    const agentProfile = await kv.get(`agent:${user.id}`);
    if (!agentProfile) {
      return c.json({ error: 'Agent profile not found' }, 404);
    }

    // Get all referrals
    const allReferrals = await kv.getByPrefix('referral:');
    const myReferrals = [];
    for (const refKey of allReferrals || []) {
      const referral = await kv.get(refKey);
      if (referral && referral.agentId === user.id) {
        const referredUser = await kv.get(`user:${referral.userId}`);
        myReferrals.push({
          ...referral,
          user: referredUser
        });
      }
    }

    return c.json({
      agent: agentProfile,
      referrals: myReferrals,
      stats: {
        totalReferrals: agentProfile.totalReferrals || 0,
        activeSubscriptions: myReferrals.filter((r: any) => r.user?.plan !== 'free').length,
        totalCommissionsEarned: agentProfile.totalCommissionsEarned || 0,
        pendingCommissions: myReferrals.filter((r: any) => r.status === 'pending').length
      }
    });
  } catch (error) {
    console.log(`Get agent dashboard error: ${error}`);
    return c.json({ error: 'Error fetching agent dashboard' }, 500);
  }
});

// Verify agent referral code
app.get("/make-server-7054278a/agent/verify/:code", async (c) => {
  try {
    const code = c.req.param('code');
    const agentId = await kv.get(`agent:code:${code}`);
    
    if (!agentId) {
      return c.json({ valid: false, message: 'Invalid referral code' });
    }

    const agent = await kv.get(`agent:${agentId}`);
    const agentUser = await kv.get(`user:${agentId}`);

    if (!agent || !agentUser) {
      return c.json({ valid: false, message: 'Agent not found' });
    }

    return c.json({
      valid: true,
      agent: {
        name: agentUser.name,
        email: agentUser.email,
        referralCode: agent.referralCode
      }
    });
  } catch (error) {
    console.log(`Verify referral code error: ${error}`);
    return c.json({ error: 'Error verifying referral code' }, 500);
  }
});

Deno.serve(app.fetch);