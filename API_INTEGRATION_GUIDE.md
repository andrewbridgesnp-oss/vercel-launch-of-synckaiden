# 🔌 External Service Integration Guide

Complete guide for integrating Stripe, PayPal, Twilio, ElevenLabs, Kling, and OpenAI with your Synckaiden platform.

---

## 1️⃣ STRIPE (Payment Processing)

### What It Does
- Process credit card payments
- Manage recurring subscriptions
- Handle refunds and disputes
- Customer billing portal

### How to Get API Keys

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Click "Start now" and sign up
   - Complete business verification (required for live mode)

2. **Get Test Mode Keys** (Start Here)
   - Log in to Stripe Dashboard: https://dashboard.stripe.com
   - Toggle "Test mode" switch (top right)
   - Go to "Developers" → "API keys"
   - Copy **Publishable key** (starts with `pk_test_`)
   - Click "Reveal test key" for **Secret key** (starts with `sk_test_`)

3. **Get Webhook Secret**
   - Go to "Developers" → "Webhooks"
   - Click "Add endpoint"
   - Enter URL: `https://your-domain.manus.space/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`
   - Click "Add endpoint"
   - Copy **Signing secret** (starts with `whsec_`)

4. **Add to Manus Secrets**
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

5. **Go Live** (When Ready)
   - Toggle "Test mode" OFF
   - Get live keys (starts with `pk_live_` and `sk_live_`)
   - Update webhook endpoint with live URL
   - Replace test keys with live keys in Manus Secrets

### Integration Status
✅ Already integrated in codebase
- Checkout session creation
- Subscription management
- Webhook handlers
- Customer portal

**Just needs your API keys to activate!**

---

## 2️⃣ PAYPAL (Alternative Payment Method)

### What It Does
- Accept PayPal payments
- Process PayPal subscriptions
- Handle PayPal refunds

### How to Get API Keys

1. **Create PayPal Business Account**
   - Go to https://www.paypal.com/bizsignup
   - Sign up for Business account
   - Complete business verification

2. **Get Sandbox Credentials** (Start Here)
   - Log in to PayPal Developer Dashboard: https://developer.paypal.com
   - Go to "Apps & Credentials"
   - Switch to "Sandbox" tab
   - Click "Create App"
   - Enter app name (e.g., "Synckaiden Platform")
   - Copy **Client ID** (starts with `AY...`)
   - Click "Show" for **Secret** (starts with `E...`)

3. **Get Live Credentials** (When Ready)
   - Switch to "Live" tab in Developer Dashboard
   - Click "Create App"
   - Copy **Client ID** and **Secret**

4. **Add to Manus Secrets**
   ```
   PAYPAL_CLIENT_ID=AYxxxxxxxxxxxxx
   PAYPAL_CLIENT_SECRET=Exxxxxxxxxxxxx
   PAYPAL_MODE=sandbox  (or "live" for production)
   ```

### Integration Status
⏳ Ready to integrate using PayPal MCP server
- PayPal MCP server already configured in your Manus environment
- Can create orders, capture payments, process refunds via MCP commands

**Needs implementation in codebase + your API keys**

---

## 3️⃣ TWILIO (SMS & Voice)

### What It Does
- Send SMS notifications
- Send verification codes
- Make voice calls
- Send WhatsApp messages

### How to Get API Keys

1. **Create Twilio Account**
   - Go to https://www.twilio.com/try-twilio
   - Sign up for free trial ($15 credit)
   - Verify your phone number

2. **Get API Credentials**
   - Log in to Twilio Console: https://console.twilio.com
   - Find **Account SID** and **Auth Token** on dashboard
   - Click "Show" to reveal Auth Token

3. **Get Phone Number**
   - Go to "Phone Numbers" → "Manage" → "Buy a number"
   - Select country (USA)
   - Choose capabilities: SMS, Voice
   - Purchase number (free with trial credit)
   - Copy your **Twilio Phone Number** (e.g., +1234567890)

4. **Add to Manus Secrets**
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

5. **Upgrade Account** (When Ready)
   - Go to "Billing" → "Upgrade"
   - Add payment method
   - Remove trial restrictions (can send to any phone number)

### Integration Status
⏳ Needs implementation
- SMS notification service
- Verification code system
- Voice call integration

**Needs implementation in codebase + your API keys**

---

## 4️⃣ ELEVENLABS (AI Voice Generation)

### What It Does
- Generate realistic AI voices
- Text-to-speech conversion
- Voice cloning
- Multi-language support

### How to Get API Key

1. **Create ElevenLabs Account**
   - Go to https://elevenlabs.io
   - Click "Get Started" and sign up
   - Free tier: 10,000 characters/month

2. **Get API Key**
   - Log in to ElevenLabs: https://elevenlabs.io/app
   - Click profile icon (top right)
   - Go to "Profile + API key"
   - Copy your **API Key**

3. **Add to Manus Secrets**
   ```
   ELEVENLABS_API_KEY=xxxxxxxxxxxxx
   ```

4. **Choose Voices**
   - Go to "Voices" in dashboard
   - Browse pre-made voices or clone your own
   - Copy **Voice ID** for voices you want to use
   - Add to secrets: `ELEVENLABS_VOICE_ID=xxxxxxxxxxxxx`

5. **Upgrade** (When Ready)
   - Go to "Subscription"
   - Choose plan based on usage:
     - Starter: $5/mo (30,000 characters)
     - Creator: $22/mo (100,000 characters)
     - Pro: $99/mo (500,000 characters)

### Integration Status
⏳ Needs implementation
- Voice generation service
- Text-to-speech API integration
- Voice selection UI

**Needs implementation in codebase + your API key**

---

## 5️⃣ KLING AI (AI Video Generation)

### What It Does
- Generate AI videos from text
- Create video content
- Video editing and effects

### How to Get API Key

1. **Create Kling Account**
   - Go to https://pro.klingai.com
   - Sign up for account
   - Use referral code for bonus credits: **7BE5X8CQJEVA**

2. **Get API Key**
   - Log in to Kling dashboard
   - Go to "Settings" or "API"
   - Generate new API key
   - Copy **API Key**

3. **Add to Manus Secrets**
   ```
   KLING_API_KEY=xxxxxxxxxxxxx
   ```

4. **Purchase Credits** (When Ready)
   - Go to "Billing" or "Credits"
   - Purchase credit package based on usage
   - Video generation costs vary by length and quality

### Integration Status
✅ Referral link already integrated on Premium Apps page
⏳ Needs API implementation
- Video generation service
- Video management system

**Needs implementation in codebase + your API key**

---

## 6️⃣ OPENAI (Additional AI Features)

### What It Does
- GPT-4 text generation
- DALL-E image generation
- Whisper speech-to-text
- Embeddings for semantic search

### How to Get API Key

1. **Create OpenAI Account**
   - Go to https://platform.openai.com/signup
   - Sign up with email
   - Verify email address

2. **Add Payment Method**
   - Go to https://platform.openai.com/account/billing
   - Click "Add payment method"
   - Add credit card (required even for testing)
   - Set usage limits to prevent overspending

3. **Get API Key**
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it (e.g., "Synckaiden Platform")
   - Copy **API Key** (starts with `sk-`)
   - ⚠️ **Save immediately** - you can't view it again!

4. **Add to Manus Secrets**
   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxx
   ```

5. **Set Usage Limits** (Recommended)
   - Go to "Billing" → "Usage limits"
   - Set monthly budget (e.g., $50)
   - Set email alerts at 50%, 75%, 90%

### Integration Status
✅ Platform already uses Manus built-in LLM (no OpenAI key needed for core features)
⏳ Optional for additional features
- Direct GPT-4 access
- DALL-E image generation
- Whisper transcription

**Optional - only needed if you want features beyond Manus built-in AI**

---

## 🚀 QUICK START CHECKLIST

### Phase 1: Payment Processing (Essential)
1. [ ] Get Stripe test keys
2. [ ] Add Stripe keys to Manus Secrets (Settings → Secrets)
3. [ ] Test subscription checkout
4. [ ] Set up Stripe webhook
5. [ ] Verify payments work end-to-end

### Phase 2: Alternative Payments (Optional)
1. [ ] Get PayPal sandbox credentials
2. [ ] Implement PayPal integration using MCP
3. [ ] Test PayPal checkout flow

### Phase 3: Communications (Optional)
1. [ ] Get Twilio credentials
2. [ ] Implement SMS notification system
3. [ ] Test verification codes

### Phase 4: AI Enhancements (Optional)
1. [ ] Get ElevenLabs API key
2. [ ] Implement voice generation features
3. [ ] Get Kling API key
4. [ ] Implement video generation features
5. [ ] (Optional) Get OpenAI key for additional AI features

---

## 📝 HOW TO ADD SECRETS IN MANUS

1. Open your Synckaiden project
2. Click "Management UI" icon (top right)
3. Go to "Settings" → "Secrets"
4. Click "Add Secret"
5. Enter key name (e.g., `STRIPE_SECRET_KEY`)
6. Enter key value
7. Click "Save"
8. Repeat for all keys

**⚠️ Important:** After adding secrets, restart your dev server for changes to take effect.

---

## 💡 COST ESTIMATES

### Stripe
- **Free** for test mode
- **2.9% + $0.30** per transaction (live mode)
- No monthly fees

### PayPal
- **Free** for sandbox
- **2.9% + $0.30** per transaction (live mode)
- No monthly fees

### Twilio
- **$15 free credit** on signup
- **$0.0079/SMS** (USA)
- **$1/month** per phone number
- **~$20/month** for moderate usage

### ElevenLabs
- **10,000 characters/month free**
- **$5/month** for 30,000 characters (Starter)
- **$22/month** for 100,000 characters (Creator)

### Kling AI
- **Pay-per-use** (credit-based)
- Varies by video length and quality
- Estimate **$10-50/month** for moderate usage

### OpenAI
- **Pay-per-use** (no monthly fee)
- **GPT-4**: ~$0.03 per 1K tokens
- **DALL-E**: ~$0.02 per image
- Estimate **$20-100/month** depending on usage

---

## 🔒 SECURITY BEST PRACTICES

1. **Never commit API keys to Git**
2. **Use test/sandbox mode first**
3. **Set usage limits on all services**
4. **Rotate keys periodically**
5. **Use separate keys for dev/staging/production**
6. **Monitor usage dashboards regularly**
7. **Enable 2FA on all accounts**
8. **Keep keys in Manus Secrets only**

---

## 🆘 NEED HELP?

- **Stripe**: https://support.stripe.com
- **PayPal**: https://developer.paypal.com/support
- **Twilio**: https://support.twilio.com
- **ElevenLabs**: https://elevenlabs.io/docs
- **Kling**: https://pro.klingai.com/support
- **OpenAI**: https://help.openai.com

---

**Ready to integrate? Start with Stripe (essential for payments), then add others as needed!**
