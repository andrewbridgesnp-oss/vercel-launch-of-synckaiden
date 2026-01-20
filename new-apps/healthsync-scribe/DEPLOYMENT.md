# Deployment Guide - Manus AI Platform

Complete guide for deploying your unified apps platform to Manus AI.

---

## 🎯 Overview

This unified platform is optimized for **single deployment** to Manus AI, hosting all your Figma-created apps in one web application.

**Benefits:**
- ✅ Single URL for all apps
- ✅ Shared resources and caching
- ✅ Seamless navigation between modules
- ✅ Optimized bundle size
- ✅ Faster load times

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Build

```bash
npm run build
```

Output: `dist/` folder with optimized production files

### Step 2: Test Build Locally

```bash
npm run preview
```

Opens at `http://localhost:4173` - test everything works

### Step 3: Deploy to Manus AI

Upload the `dist/` folder to Manus AI platform

---

## 📦 Build Process

### What Happens During Build

```bash
npm run build
```

**Build Steps:**
1. ✅ Compiles TypeScript → JavaScript
2. ✅ Processes Tailwind CSS
3. ✅ Bundles React components
4. ✅ Code splitting (vendor chunks)
5. ✅ Minifies JavaScript (Terser)
6. ✅ Optimizes assets (images, fonts)
7. ✅ Generates hash-named files
8. ✅ Creates production `dist/` folder

### Build Output Structure

```
dist/
├── index.html                       # Entry point
├── assets/
│   ├── js/
│   │   ├── index-[hash].js         # Main app code
│   │   ├── vendor-react-[hash].js  # React core
│   │   ├── vendor-ui-[hash].js     # UI components
│   │   ├── vendor-mui-[hash].js    # Material UI
│   │   ├── vendor-charts-[hash].js # Charts
│   │   └── vendor-utils-[hash].js  # Utilities
│   ├── css/
│   │   └── index-[hash].css        # Compiled styles
│   └── [other assets]
└── [any public files]
```

### Build Optimization Features

| Feature | Benefit |
|---------|---------|
| **Code Splitting** | Smaller initial load |
| **Tree Shaking** | Remove unused code |
| **Minification** | Smaller file sizes |
| **Hash Names** | Cache busting |
| **Vendor Chunks** | Better caching |
| **Console Removal** | Clean production |

---

## 🔧 Build Configuration

### Environment Variables

Create `.env.production`:

```env
# App Configuration
VITE_APP_NAME=Unified Apps Platform
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# API Configuration (if needed)
VITE_API_URL=https://api.yourdomain.com
VITE_API_KEY=your-api-key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

Access in code:

```tsx
const apiUrl = import.meta.env.VITE_API_URL;
const appVersion = import.meta.env.VITE_APP_VERSION;
```

### Build Customization

Edit `vite.config.ts` if needed:

```typescript
export default defineConfig({
  build: {
    // Change output directory
    outDir: 'dist',
    
    // Enable/disable source maps
    sourcemap: false,
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Target browsers
    target: 'es2015',
  }
});
```

---

## 🚢 Deployment Methods

### Method 1: GitHub Actions (Automated)

**Setup:**

1. Add secrets to GitHub repository:
   - `MANUS_API_KEY` - Your Manus AI API key

2. Push to `main` branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

3. GitHub Actions automatically:
   - Builds the app
   - Optimizes assets
   - Deploys to Manus AI

**Workflow File:** `.github/workflows/deploy.yml`

### Method 2: Manual Deployment

**Step-by-step:**

```bash
# 1. Clean previous builds
npm run clean

# 2. Install dependencies
npm install

# 3. Build for production
npm run build

# 4. Test the build
npm run preview

# 5. Deploy dist/ folder to Manus AI
# (Use Manus AI dashboard or CLI)
```

### Method 3: Manus AI CLI (if available)

```bash
# Install Manus CLI (example)
npm install -g @manus/cli

# Login
manus login

# Deploy
manus deploy dist/
```

---

## 📊 Pre-Deployment Checklist

### Build Quality

- [ ] `npm run build` succeeds without errors
- [ ] No TypeScript errors
- [ ] No console warnings in build output
- [ ] Bundle size is acceptable (< 1MB recommended)

### Testing

- [ ] All features work in `npm run preview`
- [ ] Mobile responsive (test at 375px, 768px, 1024px)
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] No browser console errors
- [ ] Performance is good (Lighthouse score > 90)

### Content

- [ ] All text is correct (no "lorem ipsum")
- [ ] All images load
- [ ] All icons display
- [ ] Branding is correct

### Configuration

- [ ] Environment variables set
- [ ] API endpoints correct
- [ ] Feature flags configured
- [ ] Analytics configured (if using)

### Security

- [ ] No API keys in code
- [ ] No sensitive data exposed
- [ ] HTTPS will be enforced (Manus AI handles)
- [ ] CSP headers configured (if needed)

---

## 🎨 Manus AI Platform Setup

### Initial Setup

1. **Create Manus AI Account**
   - Sign up at Manus AI platform
   - Verify email
   - Set up organization

2. **Create New Project**
   - Project name: "Unified Apps Platform"
   - Type: Single Page Application (SPA)
   - Framework: React + Vite

3. **Configure Domain** (Optional)
   - Custom domain: `apps.yourdomain.com`
   - SSL: Auto-enabled by Manus AI
   - CDN: Auto-enabled

### Deployment Settings

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Node Version:**
```
18
```

**Environment Variables:**
Add your `.env.production` variables in Manus AI dashboard

---

## 🔄 Continuous Deployment

### Automated Workflow

```
Code Change → Push to GitHub → GitHub Actions → Build → Deploy to Manus AI
```

**Triggers:**
- Push to `main` branch
- Changes to `src/**` files
- Manual workflow trigger

**Build Time:**
~2-5 minutes (depending on project size)

**Rollback:**
Manus AI keeps previous deployments for easy rollback

---

## 📈 Performance Optimization

### Bundle Size Optimization

**Current Strategy:**
```javascript
// Vendor chunks reduce main bundle size
vendor-react:  ~140KB (React core)
vendor-ui:     ~180KB (UI components)
vendor-mui:    ~200KB (Material UI)
vendor-charts: ~100KB (Recharts)
vendor-forms:  ~50KB  (Form libraries)
vendor-utils:  ~30KB  (Utilities)
main app:      ~150KB (Your code)

Total: ~850KB (gzipped: ~250KB)
```

**Optimization Tips:**

1. **Lazy Load Heavy Components:**
```tsx
const HeavyComponent = lazy(() => import('./Heavy'));
```

2. **Analyze Bundle:**
```bash
npm run build
# Check dist/assets/js/ folder sizes
```

3. **Remove Unused Dependencies:**
```bash
npm uninstall unused-package
```

### Runtime Performance

**Best Practices:**

```tsx
// ✅ Memoize expensive calculations
const sortedData = useMemo(() => sort(data), [data]);

// ✅ Memoize callbacks
const handleClick = useCallback(() => {}, []);

// ✅ Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

// ✅ Debounce search inputs
import { debounce } from 'lodash';
```

---

## 🌐 CDN and Caching

### Manus AI CDN

Manus AI automatically:
- ✅ Serves assets via global CDN
- ✅ Enables gzip/brotli compression
- ✅ Sets optimal cache headers
- ✅ Handles SSL certificates

### Cache Strategy

**Hashed Files:**
```
index-abc123.js  → Cache: 1 year
vendor-xyz789.js → Cache: 1 year
styles-def456.css → Cache: 1 year
```

**HTML File:**
```
index.html → Cache: No cache (always fresh)
```

When you redeploy:
- New hash = new file name = cache bypass
- Users get latest version automatically

---

## 🔍 Monitoring

### Post-Deployment Checks

**Immediately After Deploy:**

```bash
# 1. Check site loads
curl -I https://your-app.manus.app

# 2. Test main pages
# Visit each module/screen

# 3. Check console
# Browser DevTools → Console (should be clean)

# 4. Check network
# DevTools → Network (all assets load)

# 5. Test mobile
# DevTools → Device mode
```

### Performance Testing

**Lighthouse Audit:**

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-app.manus.app --view

# Aim for:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

### Monitoring Tools (Optional)

- **Sentry** - Error tracking
- **Google Analytics** - Usage tracking
- **LogRocket** - Session replay
- **Hotjar** - User behavior

---

## 🐛 Troubleshooting

### Build Fails

**Issue: TypeScript errors**
```bash
# Fix TypeScript errors in code
# Then rebuild
npm run build
```

**Issue: Out of memory**
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

**Issue: Missing dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Issues

**Issue: Site shows 404**
- Check output directory is `dist/`
- Verify `index.html` exists in `dist/`
- Check Manus AI build logs

**Issue: Assets don't load**
- Check base path in `vite.config.ts`
- Verify asset paths are relative
- Check CORS settings

**Issue: Environment variables not working**
- Prefix with `VITE_`
- Add to Manus AI dashboard
- Rebuild and redeploy

### Runtime Errors

**Issue: White screen**
```bash
# Check browser console
# Look for JavaScript errors
# Fix errors and redeploy
```

**Issue: Slow performance**
```bash
# Run Lighthouse audit
# Check Network tab for large assets
# Optimize images and code
```

---

## 🔄 Update Workflow

### Making Updates

```bash
# 1. Make changes locally
# Edit files in src/

# 2. Test locally
npm run dev

# 3. Build and test production
npm run build
npm run preview

# 4. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# 5. GitHub Actions deploys automatically
# Or manually deploy dist/ folder
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-bug

# 2. Fix the issue
# Edit files

# 3. Test thoroughly
npm run dev
npm run build
npm run preview

# 4. Merge to main
git checkout main
git merge hotfix/critical-bug

# 5. Push (triggers auto-deploy)
git push origin main
```

---

## 📋 Deployment Checklist

**Before Every Deployment:**

- [ ] Code reviewed
- [ ] Tests passing (if applicable)
- [ ] Build succeeds locally
- [ ] Preview tested
- [ ] No console errors
- [ ] Mobile tested
- [ ] Performance acceptable
- [ ] Environment variables correct
- [ ] Changelog updated
- [ ] Team notified

**After Deployment:**

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] No 404 errors
- [ ] Forms work
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Performance good
- [ ] No console errors
- [ ] Monitoring active

---

## 🎉 You're Deployed!

Your unified apps platform is now live on Manus AI! 🚀

**Next Steps:**

1. ✅ Share URL with team
2. ✅ Monitor performance
3. ✅ Gather user feedback
4. ✅ Plan next features
5. ✅ Add more Figma apps

**Support:**
- Manus AI documentation
- GitHub Issues
- Community forums

---

**Platform:** Manus AI  
**Architecture:** Unified Single Deployment  
**All Figma Apps:** One Web Application  
**Status:** Production Ready ✅
