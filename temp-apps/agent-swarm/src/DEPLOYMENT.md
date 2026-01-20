# 🚀 Deployment Guide - Agentic AI Business Swarm

## Quick Deploy to GitHub Pages

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Agentic AI Business Swarm 2026"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/agentic-ai-swarm.git

# Push to GitHub
git push -u origin main
```

### 2. Build for Production

```bash
# Install dependencies
npm install

# Create production build
npm run build
```

### 3. Deploy to GitHub Pages

#### Option A: Using gh-pages package

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

#### Option B: Manual Deployment

1. Go to your GitHub repository settings
2. Navigate to Pages section
3. Select source: GitHub Actions
4. Use the following workflow file

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Deploy to Netlify

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Deploy to AWS Amplify

### Using AWS Console

1. Go to AWS Amplify Console
2. Click "New App" → "Host Web App"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy

### Build Settings

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Deploy to Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build and Run

```bash
# Build Docker image
docker build -t agentic-ai-swarm .

# Run container
docker run -p 8080:80 agentic-ai-swarm

# Access at http://localhost:8080
```

### Docker Compose

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
```

## Environment Variables

Set these environment variables for your deployment:

```bash
# Kayden AI Integration
VITE_KAYDEN_AI_URL=https://synckaiden.com
VITE_KAYDEN_API_KEY=your_api_key_here

# n8n Integration
VITE_N8N_API_URL=https://n8n.io/api
VITE_N8N_API_KEY=your_n8n_key_here

# Application Settings
VITE_APP_VERSION=2026.1.0
VITE_APP_NAME=Agentic AI Business Swarm
```

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --mode analyze

# Generate source maps
npm run build -- --sourcemap
```

### CDN Configuration

For optimal performance, configure your CDN:

1. **CloudFlare**: Enable auto-minification and Brotli compression
2. **AWS CloudFront**: Set up distribution with origin as S3 bucket
3. **Fastly**: Configure VCL for optimal caching

## SSL/TLS Configuration

### Let's Encrypt (Free)

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring & Analytics

### Setup Google Analytics

Add to your `.env`:

```bash
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Setup Sentry (Error Tracking)

```bash
npm install @sentry/react

# Add to .env
VITE_SENTRY_DSN=https://your-sentry-dsn
```

## Post-Deployment Checklist

- [ ] Test all functionality in production
- [ ] Verify API integrations (Kayden AI, n8n)
- [ ] Check performance metrics (Lighthouse score)
- [ ] Verify responsive design on mobile devices
- [ ] Test voice commands functionality
- [ ] Verify export functionality
- [ ] Check all navigation tabs
- [ ] Test workflow builder drag-and-drop
- [ ] Verify analytics charts render correctly
- [ ] Test real-time features
- [ ] Check console for errors
- [ ] Verify SSL certificate
- [ ] Test load times
- [ ] Verify SEO meta tags

## Rollback Procedure

If issues occur after deployment:

```bash
# GitHub Pages
git revert HEAD
git push origin main

# Vercel
vercel rollback

# Netlify
netlify rollback

# Docker
docker run -p 8080:80 agentic-ai-swarm:previous-tag
```

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/yourusername/agentic-ai-swarm/issues)
- Join our [Discord Community](https://discord.gg/agenticaiswarm)
- Email: devops@agenticaiswarm.com

---

**Happy Deploying! 🚀**
