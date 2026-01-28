# Vercel Deployment Guide

## Important: Architecture Note

This application is a **full-stack Node.js application** with an Express backend and React frontend. Vercel is primarily designed for serverless/JAMstack applications, which creates deployment challenges.

## Deployment Options

### Option 1: Deploy to a Node.js Platform (Recommended)

Deploy the entire application to a platform that supports traditional Node.js servers:

- **Railway** (https://railway.app/) - Recommended, easy deployment
- **Render** (https://render.com/) - Good free tier
- **Heroku** (https://heroku.com/) - Established platform
- **Fly.io** (https://fly.io/) - Modern platform with good pricing

**Steps:**
1. Push your code to GitHub
2. Connect your repository to the platform
3. Set build command: `pnpm run build`
4. Set start command: `pnpm start`
5. Add environment variables (database, API keys, etc.)
6. Deploy!

### Option 2: Split Deployment (Advanced)

Deploy frontend on Vercel and backend elsewhere:

1. **Backend**: Deploy to Railway/Render/Heroku
   - Use the same build/start commands
   - Note the backend URL (e.g., `https://your-app.railway.app`)

2. **Frontend**: Deploy to Vercel
   - Update `client/src/main.tsx` to use backend URL:
     ```typescript
     httpBatchLink({
       url: process.env.VITE_API_URL || "/api/trpc",
       // ...
     })
     ```
   - Set `VITE_API_URL` environment variable in Vercel to your backend URL

### Option 3: Vercel with External Database (Experimental)

Vercel CAN host Node.js servers, but requires specific configuration:

1. The application would need to be refactored to work with Vercel's serverless model
2. Database connections need to be serverless-compatible
3. File uploads need to use cloud storage (S3, etc.)
4. OAuth callbacks need special handling

This requires significant code changes and is not recommended unless necessary.

## Current Vercel Configuration

The current `vercel.json` is configured for **static hosting only**:
- Builds the frontend React app
- Outputs to `dist/public`
- Does NOT include the backend server

To deploy just the frontend (API calls will fail):
```bash
vercel --prod
```

## Environment Variables Needed

Regardless of deployment platform, you'll need:

```
# Database
DATABASE_URL=your_database_url

# Authentication
JWT_SECRET=your_jwt_secret

# OAuth (if used)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Stripe (if used)
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...

# Email (if used)  
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

# Other APIs
OPENAI_API_KEY=...
# etc.
```

## Troubleshooting

**Error: Cannot find module 'express'**
- The platform needs to install dependencies
- Ensure `pnpm install` or `npm install` runs before build

**Error: Port already in use**
- The server tries to bind to a specific port
- Use `PORT` environment variable (most platforms provide this automatically)

**Error: Database connection failed**
- Check your `DATABASE_URL` environment variable
- Ensure database is accessible from the hosting platform
- Check firewall rules

**Error: Static files not found**
- Ensure `pnpm run build` completes successfully
- Check that `dist/public` directory is created
- Verify the build output includes both `dist/index.js` and `dist/public/`

## Recommended: Deploy to Railway

Railway is the easiest option:

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Select this repository
5. Railway auto-detects Node.js and uses package.json scripts
6. Add environment variables in the Variables tab
7. Deploy!

Your app will be live at `https://your-app.up.railway.app`
