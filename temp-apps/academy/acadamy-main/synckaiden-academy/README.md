# Synckaiden Academy (Atlas Academy 2026) — offline-first interactive trainer

This repo is a **plug-and-play** React app you can deploy as an interactive section of **synckaiden.com**.

## What’s inside
- **Academy**: learning modules + streaks + notes + daily plan generator
- **Workflow Builder**: generates automation blueprints you can paste into n8n/Make/Zapier
- **25 AI money paths**: curated “not-obvious yet” offers w/ risk notes
- **Social Autopilot**: content generator (hooks/scripts/offers)
- **Intel Packs**: import/export JSON trend cards (offline-first)
- **Pro Vault + Store**: simple gating + purchase links (no backend required for MVP)

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Environment variables
Create a `.env` file at repo root:
```
# Optional: where your Stripe Payment Link lives
VITE_STRIPE_PAYMENT_LINK="https://..."

# Optional but recommended: unlock-key signing secret for Pro keys
# NOTE: this is a client-side MVP (not truly secret). Move to a backend for production.
VITE_ADMIN_PASSPHRASE="change-me"

# Optional: client-side encryption salt for local data
VITE_CLIENT_ENCRYPTION_KEY="set-a-unique-non-secret-string"
```

## Deploy (free)
### Option A: Cloudflare Pages
- Build command: `npm run build`
- Build output directory: `dist`

### Option B: Any static host
Upload the `dist/` folder.

## Embed on synckaiden.com
Use an iframe:
```html
<iframe
  src="https://YOUR-DEPLOYED-URL/embed"
  style="width: 100%; height: 90vh; border: 0; border-radius: 16px;"
  loading="lazy"
></iframe>
```

## Issue Pro keys (MVP)
1. Set `VITE_ADMIN_PASSPHRASE` in `.env`
2. Run the app and go to `/admin`
3. Enter the passphrase, generate a key, and send it to the customer
4. Customer pastes the key in the Pro unlock modal

> For a real business: move key generation + validation to a backend and store entitlements server-side.
