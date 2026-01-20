# V0 App Integration Guide for GATE 8 Platforms

## 🎉 Subscription System is LIVE!

The complete subscription system with Stripe integration is now deployed to **kaidensync.com**. Users can subscribe to any of the 8 platforms and the system will automatically manage access control.

## System Overview

### What's Already Built

✅ **Database Schema** - All 8 platforms with app mappings
✅ **Backend API** - Complete Stripe integration and subscription management
✅ **Frontend UI** - Gate8 page, subscription dashboard, access control gates
✅ **Stripe Integration** - Checkout, webhooks, subscription lifecycle
✅ **Access Control Framework** - Ready for your apps

### The 8 Platforms

1. **AI Intelligence Suite** ($39.99/mo) - 5 apps
2. **Sales & Marketing Command Center** ($49.99/mo) - 13 apps
3. **Financial Command Center** ($49.99/mo) - 8 apps
4. **Business Operations Hub** ($49.99/mo) - 10 apps
5. **HR & People Management** ($39.99/mo) - 2 apps
6. **E-Commerce & Marketplace** ($49.99/mo) - 7 apps
7. **Customer Experience Suite** ($39.99/mo) - 4 apps
8. **Professional Services Suite** ($49.99/mo) - 13 apps
9. **Security & Infrastructure** (FREE with any platform)

**Enterprise Tier:** $99.99/mo for any platform (unlimited API calls)

## How to Integrate Your V0 Apps

### Step 1: Build Your App in V0

Create your app in v0.dev with all the features you need. The app will have full access to:
- **Manus LLM APIs** (GPT-4.1, Gemini, etc.)
- **Image generation**
- **Speech-to-text**
- **File uploads to S3**
- **All Manus utilities**

### Step 2: Export and Add to Repository

1. Export your v0 app code
2. Create a new page file in `/client/src/pages/YourApp.tsx`
3. Add any components to `/client/src/components/`

### Step 3: Add Route

Edit `/client/src/App.tsx` and add your route:

```typescript
import YourApp from "./pages/YourApp";

// In the Router component:
<Route path="/your-app" component={YourApp} />
```

### Step 4: Add Access Control (Optional but Recommended)

Wrap your app with the `PlatformAccessGate` component to require a subscription:

```typescript
import PlatformAccessGate from '@/components/PlatformAccessGate';

export default function YourApp() {
  return (
    <PlatformAccessGate platformSlug="ai-intelligence-suite">
      {/* Your app content here */}
      <div>
        <h1>Your Amazing App</h1>
        {/* ... */}
      </div>
    </PlatformAccessGate>
  );
}
```

**Platform Slugs:**
- `ai-intelligence-suite`
- `sales-marketing-command`
- `financial-command`
- `business-operations`
- `hr-people-management`
- `ecommerce-marketplace`
- `customer-experience`
- `professional-services`
- `security-infrastructure` (free, no gate needed)

### Step 5: Update Platform Mapping (Optional)

If you want to officially list your app in a platform, update the database or add it to the platform's app list in the Gate8 page.

### Step 6: Push and Deploy

```bash
git add .
git commit -m "Add [Your App Name]"
git push origin main
```

Vercel will automatically deploy your changes!

## Access Control Behavior

### With PlatformAccessGate

**If user has subscription:**
- App loads normally
- Full access to all features

**If user doesn't have subscription:**
- Shows beautiful subscription prompt
- Displays platform pricing
- "Subscribe Now" button redirects to Stripe checkout
- "View All Platforms" button goes to Gate8 page

### Without PlatformAccessGate

- App is accessible to all logged-in users
- No subscription required
- Good for free apps or demos

## Using Manus Capabilities in Your Apps

### LLM API Calls

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  // API key and base URL are pre-configured via environment variables
});

async function generateContent() {
  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini', // or 'gemini-2.5-flash'
    messages: [{ role: 'user', content: 'Your prompt here' }],
  });
  
  return response.choices[0].message.content;
}
```

### Image Generation

```typescript
const response = await client.images.generate({
  model: 'dall-e-3',
  prompt: 'Your image description',
  n: 1,
  size: '1024x1024',
});

const imageUrl = response.data[0].url;
```

### File Upload to S3

```bash
# Use the manus-upload-file utility
manus-upload-file /path/to/file.png
# Returns: https://public-url-to-file.png
```

### Speech-to-Text

```bash
# Use the manus-speech-to-text utility
manus-speech-to-text /path/to/audio.mp3
# Returns: Transcribed text
```

## API Endpoints Available

### Platform Management

- `GET /api/platforms` - List all platforms
- `GET /api/platforms/subscriptions` - Get user's subscriptions
- `GET /api/platforms/:slug/access` - Check if user has access
- `POST /api/platforms/:slug/subscribe` - Create Stripe checkout
- `POST /api/platforms/subscriptions/:id/cancel` - Cancel subscription

### Usage in Your Apps

```typescript
// Check if user has access
const response = await fetch('/api/platforms/ai-intelligence-suite/access', {
  credentials: 'include',
});
const { hasAccess } = await response.json();

if (hasAccess) {
  // User can use the app
} else {
  // Redirect to subscription page
}
```

## Database Schema

### Platforms Table

- `id` - Platform ID
- `slug` - URL-friendly identifier
- `name` - Display name
- `description` - Platform description
- `price_pro` - Pro tier price
- `price_enterprise` - Enterprise tier price
- `app_count` - Number of apps
- `is_free` - Whether platform is free

### User Platform Subscriptions Table

- `user_id` - User ID
- `platform_id` - Platform ID
- `tier` - 'pro' or 'enterprise'
- `status` - 'active', 'cancelled', 'expired', 'trial'
- `stripe_subscription_id` - Stripe subscription ID
- `current_period_end` - When subscription renews

## Testing Your Integration

1. **Local Testing:**
   ```bash
   cd /home/ubuntu/vercel-launch-of-synckaiden
   pnpm dev
   ```
   Access at http://localhost:3001

2. **Test Subscription Flow:**
   - Go to /gate-8
   - Click "Subscribe Now" on a platform
   - Complete Stripe checkout (use test card: 4242 4242 4242 4242)
   - Verify access to gated apps

3. **Test Access Control:**
   - Try accessing a gated app without subscription
   - Should see subscription prompt
   - Subscribe and verify access granted

## Important Notes

### Stripe Configuration

You need to set these environment variables in Vercel:

```
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Database Migration

Run the migration to set up the platform tables:

```sql
-- Run migrations/002_platforms_and_subscriptions.sql in Supabase
```

### Webhook Setup

Configure Stripe webhook to point to:
```
https://kaidensync.com/api/platforms/webhook
```

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Example: Complete App Integration

```typescript
// /client/src/pages/AIChat.tsx
import { useState } from 'react';
import PlatformAccessGate from '@/components/PlatformAccessGate';
import OpenAI from 'openai';

const client = new OpenAI();

export default function AIChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: message }],
      });
      setResponse(completion.choices[0].message.content || '');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PlatformAccessGate platformSlug="ai-intelligence-suite">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 p-6">
        <h1 className="text-4xl font-bold text-white mb-8">AI Chat</h1>
        
        <div className="max-w-2xl mx-auto">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/10 text-white"
            rows={4}
            placeholder="Ask me anything..."
          />
          
          <button
            onClick={handleSend}
            disabled={loading}
            className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl"
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
          
          {response && (
            <div className="mt-6 p-4 rounded-xl bg-white/10 text-white">
              {response}
            </div>
          )}
        </div>
      </div>
    </PlatformAccessGate>
  );
}
```

Then add to App.tsx:
```typescript
import AIChat from "./pages/AIChat";

<Route path="/ai-chat" component={AIChat} />
```

## Next Steps

1. **Build your apps in v0**
2. **Export and integrate following this guide**
3. **Test locally**
4. **Push to GitHub**
5. **Vercel auto-deploys**
6. **Users can subscribe and access!**

## Support

If you need help:
- Check the existing app implementations in `/client/src/pages/`
- Review the PlatformAccessGate component
- Test the subscription flow on kaidensync.com/gate-8

---

**The platform is ready for your apps! Happy building! 🚀**
