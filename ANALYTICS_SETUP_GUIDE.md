# Analytics Setup Guide

## Overview

The platform supports optional analytics integration using [Umami](https://umami.is/), a privacy-friendly, open-source analytics solution.

**Status:** Analytics is **optional** and disabled by default.

## Why Analytics is Optional

- Not required for core functionality
- Privacy-first approach - you decide if you want tracking
- No warnings or errors if not configured
- Easy to enable when you're ready

## Current Configuration

Analytics is **not configured** by default. The platform will run perfectly without it.

## How to Enable Analytics

### Option 1: Use Umami Cloud

1. **Sign up** at https://cloud.umami.is/
2. **Create a website** in your Umami dashboard
3. **Get your credentials:**
   - Analytics Endpoint: `https://cloud.umami.is` (or your self-hosted URL)
   - Website ID: Found in your Umami dashboard

### Option 2: Self-Host Umami

1. **Deploy Umami** following their [documentation](https://umami.is/docs/getting-started)
2. **Create a website** in your Umami instance
3. **Get your credentials:**
   - Analytics Endpoint: Your Umami instance URL
   - Website ID: From your Umami dashboard

### Configure Environment Variables

Create a `.env` file or add to your Manus environment:

```bash
# Analytics Configuration
VITE_ANALYTICS_ENDPOINT=https://cloud.umami.is
VITE_ANALYTICS_WEBSITE_ID=your-website-id-here
```

**For Manus hosting:**
1. Go to your Manus dashboard
2. Settings → Environment Variables
3. Add the two variables above

### Verify Setup

After deploying with analytics configured:
1. Open your site
2. Check browser console for: `[Analytics] Umami analytics loaded`
3. Visit your Umami dashboard to see tracking data

## What Gets Tracked

When enabled, Umami tracks:
- Page views
- Unique visitors
- Referrers
- Countries (anonymized)
- Devices and browsers

**Privacy:**
- No cookies
- No personal data
- GDPR compliant
- Anonymized IPs

## Development vs Production

**Development (default):**
```bash
# Leave empty or omit - no analytics
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

**Production (when ready):**
```bash
# Add your Umami credentials
VITE_ANALYTICS_ENDPOINT=https://cloud.umami.is
VITE_ANALYTICS_WEBSITE_ID=abc-123-xyz
```

## Troubleshooting

### Analytics Not Loading

**Symptom:** No analytics data in Umami dashboard

**Checks:**
1. Environment variables set correctly
2. Website ID matches Umami dashboard
3. Check browser console for `[Analytics]` messages
4. Verify endpoint URL (no trailing slash)

### Build Warnings

**Before fix:** Build showed warnings about undefined variables
**After fix:** No warnings - analytics is optional

## Technical Implementation

The platform loads analytics dynamically:

```typescript
// client/src/main.tsx
const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

if (analyticsEndpoint && analyticsWebsiteId) {
  // Load Umami script dynamically
  const script = document.createElement('script');
  script.defer = true;
  script.src = `${analyticsEndpoint}/umami`;
  script.setAttribute('data-website-id', analyticsWebsiteId);
  document.head.appendChild(script);
}
```

This approach:
- ✅ No build warnings if not configured
- ✅ Only loads when both variables are set
- ✅ No impact on performance if disabled
- ✅ Easy to enable/disable

## Alternative Analytics

While Umami is configured by default, you can integrate other analytics:

**Google Analytics:**
```typescript
// Add to main.tsx after analytics check
if (import.meta.env.VITE_GA_ID) {
  // Load GA script
}
```

**Plausible:**
```typescript
if (import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
  // Load Plausible script
}
```

**Custom Analytics:**
Add your tracking script in `client/src/main.tsx` following the same pattern.

## See Also

- `.env.example` - All environment variables documented
- `API_INTEGRATION_GUIDE.md` - External integrations
- [Umami Documentation](https://umami.is/docs)
- [Umami Cloud](https://cloud.umami.is/)

## Summary

✅ **Analytics is optional**  
✅ **No configuration needed by default**  
✅ **Easy to enable when ready**  
✅ **Privacy-friendly with Umami**  
✅ **No build warnings**
