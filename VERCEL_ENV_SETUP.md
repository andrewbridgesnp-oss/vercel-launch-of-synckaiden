# Vercel Environment Variables Setup Guide

## Required Environment Variables

To fully enable authentication and API features, add these environment variables in your Vercel project settings:

### 1. Navigate to Vercel Dashboard
- Go to https://vercel.com/dashboard
- Select your project: `vercel-launch-of-synckaiden`
- Click **Settings** → **Environment Variables**

### 2. Add Required Variables

#### OAuth Configuration (Required for Login)
```
VITE_OAUTH_PORTAL_URL=https://api.manus.im
VITE_APP_ID=your-app-id-here
```

#### API Configuration (Required for App Functionality)
```
VITE_FRONTEND_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

#### Optional: Analytics & Payments
```
VITE_MIXPANEL_TOKEN=your-mixpanel-token (optional)
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key (optional)
```

### 3. Apply to All Environments
When adding each variable, make sure to check:
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**

## Current Status

The app now has graceful fallbacks for missing environment variables and won't crash. However, full functionality requires the variables above to be configured.

### What Works Without Env Vars:
- ✅ Homepage loads
- ✅ App browsing
- ✅ UI navigation

### What Needs Env Vars:
- ❌ User authentication/login
- ❌ App purchases
- ❌ API integrations

## Getting Your Values

Contact the Manus team or check your Manus dashboard for:
- `VITE_APP_ID` - Your application ID
- `VITE_FRONTEND_FORGE_API_KEY` - Your API key

For Stripe and Mixpanel, use your own account credentials if you want to enable those features.
