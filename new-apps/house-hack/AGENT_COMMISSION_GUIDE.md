# KAIDEN HouseHack 203K - Agent Commission System

## Overview
Real estate agents can earn **20% recurring commission** on subscription revenue from clients they refer to the platform.

## How It Works

### For Real Estate Agents

1. **Sign Up as an Agent**
   - Go to the landing page
   - Click "Sign Up as Agent" button
   - Complete registration with role set to "realtor"
   - System automatically generates unique referral code (format: `AGENT{timestamp}`)

2. **Get Your Referral Code**
   - After signup, access your agent dashboard
   - Your unique referral code will be displayed prominently
   - Share this code with your clients

3. **Refer Clients**
   - Give your referral code to buyers interested in FHA 203(k) financing
   - Clients enter your code during signup
   - System automatically tracks the referral

4. **Earn Commissions**
   - When referred client upgrades to paid plan:
     - Pro Plan ($29/mo) → You earn $5.80/month (20%)
     - Team Plan ($99/mo) → You earn $19.80/month (20%)
   - Commissions are recurring as long as client maintains subscription
   - View earnings in real-time on agent dashboard

### Agent Dashboard Features

Access at: `/agent/dashboard`

**Metrics Displayed:**
- Total referrals count
- Active subscriptions (paying customers)
- Total commissions earned (lifetime)
- Pending commissions
- List of all referred clients with:
  - Client name
  - Current plan
  - Signup date
  - Subscription status

**API Endpoint:** `GET /make-server-7054278a/agent/dashboard`

## Technical Implementation

### Database Schema (KV Store)

**Agent Profile:** `agent:{userId}`
```json
{
  "userId": "user_id",
  "referralCode": "AGENT1234ABCD",
  "totalReferrals": 0,
  "totalCommissionsEarned": 0,
  "commissionRate": 0.20,
  "createdAt": "2026-01-11T..."
}
```

**Referral Tracking:** `referral:{userId}`
```json
{
  "userId": "referred_user_id",
  "agentId": "referring_agent_id",
  "status": "pending|active",
  "createdAt": "2026-01-11T..."
}
```

**Agent Code Lookup:** `agent:code:{referralCode}` → `agentId`

### API Endpoints

#### 1. Verify Referral Code
```
GET /make-server-7054278a/agent/verify/{code}
```
**Response:**
```json
{
  "valid": true,
  "agent": {
    "name": "Agent Name",
    "email": "agent@example.com",
    "referralCode": "AGENT1234ABCD"
  }
}
```

#### 2. Get Agent Dashboard
```
GET /make-server-7054278a/agent/dashboard
Authorization: Bearer {access_token}
```
**Response:**
```json
{
  "agent": {
    "referralCode": "AGENT1234ABCD",
    "totalReferrals": 15,
    "totalCommissionsEarned": 347.50,
    "commissionRate": 0.20
  },
  "referrals": [
    {
      "userId": "user_123",
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "plan": "pro"
      },
      "status": "active",
      "createdAt": "2026-01-11T..."
    }
  ],
  "stats": {
    "totalReferrals": 15,
    "activeSubscriptions": 8,
    "totalCommissionsEarned": 347.50,
    "pendingCommissions": 3
  }
}
```

#### 3. Sign Up with Referral Code
```
POST /make-server-7054278a/auth/signup
{
  "email": "client@example.com",
  "password": "password123",
  "name": "Client Name",
  "role": "borrower",
  "agentReferralCode": "AGENT1234ABCD"
}
```

## Commission Calculation

### Monthly Subscription Revenue Share

| Plan | Monthly Price | Agent Commission (20%) |
|------|--------------|------------------------|
| Free | $0 | $0 |
| Pro | $29 | $5.80 |
| Team | $99 | $19.80 |

### Example Earnings Scenario

**Agent with 20 referred clients:**
- 12 on Free plan: $0/month
- 6 on Pro plan: 6 × $5.80 = $34.80/month
- 2 on Team plan: 2 × $19.80 = $39.60/month

**Total Monthly Income:** $74.40/month  
**Annual Income:** $892.80/year

With just 20 clients, 8 of which upgrade to paid plans!

## Integration with Stripe Webhooks

When Stripe processes a subscription payment:

1. **Webhook receives payment event**
2. **System identifies referred user**
3. **Calculates 20% commission**
4. **Updates agent's `totalCommissionsEarned`**
5. **Logs commission transaction for accounting**

**Note:** In production, integrate with Stripe Connect or similar for automated payouts.

## Marketing Materials for Agents

### Referral Link Format
```
https://kaiden203k.com/auth?ref=AGENT1234ABCD
```

### Sample Agent Pitch
> "I'm partnered with KAIDEN HouseHack 203K, the #1 platform for FHA 203(k) deals. 
> It will guide you step-by-step through your house-hacking journey with calculators, 
> team collaboration, and document management. Use my code **AGENT1234ABCD** when 
> you sign up to get started!"

### Client Benefits
- Free plan to start (1 Deal Room)
- All 50 U.S. states supported
- Mobile-responsive design
- Professional PDF exports
- Expert guidance system

## Compliance & Best Practices

### ✅ Allowed
- Sharing your referral code with clients
- Explaining platform features and benefits
- Providing code when asked for recommendations

### ❌ Not Allowed
- Guaranteeing loan approval based on using the platform
- Making false claims about commission structure
- Sharing client financial data without consent
- Steering clients to specific lenders for kickbacks

## Support

### For Agents
- Email: agent-support@kaiden203k.com
- Dashboard: Access real-time metrics
- Help Center: /agent/help

### Payment Schedule
- Commissions calculated monthly
- Payout within 15 days of month-end
- Minimum payout threshold: $50
- Payment via ACH/bank transfer

## Future Enhancements

### Planned Features
- Automated commission payouts via Stripe Connect
- Referral performance analytics
- Custom landing pages for agents
- Marketing asset library (flyers, email templates)
- Tiered commission structure (more referrals = higher %)
- Agent leaderboard
- White-label options for agencies

---

**Questions?** Contact our agent relations team at agent-relations@kaiden203k.com
