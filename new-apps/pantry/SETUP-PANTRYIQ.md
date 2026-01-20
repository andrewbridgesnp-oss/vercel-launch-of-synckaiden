# PantryIQ Setup Guide

This guide will walk you through setting up PantryIQ in the Kaiden platform.

## Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ database
- Kaiden platform core installed
- Access to Kaiden's auth system

## Installation Steps

### 1. Copy Files to Kaiden Project

Extract the PantryIQ package and copy files to your Kaiden project:

```bash
# Copy frontend files
cp -r src/apps/pantryiq /path/to/kaiden/src/apps/

# Copy backend API
cp server/apps/pantryiq.ts /path/to/kaiden/server/apps/

# Copy database schema
cp drizzle/pantryiq-schema.ts /path/to/kaiden/drizzle/
```

### 2. Install Dependencies

PantryIQ uses the standard Kaiden dependencies. Verify these are installed:

```bash
npm install
```

Required dependencies:
- react
- zustand
- zod
- drizzle-orm
- date-fns
- recharts
- lucide-react
- motion

### 3. Database Setup

Run the database migrations to create PantryIQ tables:

```bash
# Generate migration
npx drizzle-kit generate:mysql

# Run migration
npx drizzle-kit push:mysql
```

This will create the following tables:
- `pantryItems`
- `shoppingListItems`
- `userStats`
- `userAppInstalls`
- `auditLogs`
- `notificationPreferences`

### 4. Register App in Kaiden

Add PantryIQ to Kaiden's app registry:

```typescript
// src/lib/appIntegration.ts

export const AVAILABLE_APPS = {
  // ... existing apps
  
  'pantryiq': {
    id: 'pantryiq',
    name: 'PantryIQ',
    description: 'Smart pantry inventory management and waste reduction',
    icon: 'Package2',
    category: 'Lifestyle',
    version: '1.0.0',
    author: 'Kaiden Team',
    route: '/apps/pantryiq',
    component: lazy(() => import('../apps/pantryiq/App')),
    permissions: ['user'],
    features: [
      'Inventory tracking',
      'Expiry alerts',
      'Recipe suggestions',
      'Shopping list',
      'Analytics dashboard'
    ],
    pricing: {
      free: true,
      premium: false
    }
  }
};
```

### 5. Register API Routes

Add PantryIQ routes to your Express server:

```typescript
// server/routers.ts

import pantryiqRouter from './apps/pantryiq';

// ...

app.use('/api/apps/pantryiq', pantryiqRouter);
```

### 6. Environment Variables

Ensure these environment variables are set:

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/kaiden
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=kaiden_user
DATABASE_PASSWORD=secure_password
DATABASE_NAME=kaiden

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRY=7d

# App Configuration
NODE_ENV=production
PORT=3000
API_BASE_URL=https://your-domain.com/api

# Optional: Analytics
ANALYTICS_ENABLED=true
ANALYTICS_ENDPOINT=https://analytics.your-domain.com
```

### 7. Build and Deploy

Build the application:

```bash
npm run build
```

For development:

```bash
npm run dev
```

### 8. Verify Installation

1. **Check Database Tables:**
```sql
SHOW TABLES LIKE '%pantry%';
SHOW TABLES LIKE '%shopping%';
```

2. **Test API Endpoints:**
```bash
# Get items (requires auth token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/apps/pantryiq/items

# Expected response:
# {"success":true,"data":[]}
```

3. **Access the App:**
   - Navigate to `/apps/pantryiq` in your Kaiden dashboard
   - Verify authentication redirects work
   - Test creating an item

## Database Indexes (Optional Performance Optimization)

For better query performance, add these indexes:

```sql
-- Pantry Items
CREATE INDEX idx_pantryItems_userId ON pantryItems(userId);
CREATE INDEX idx_pantryItems_userId_addedDate ON pantryItems(userId, addedDate);
CREATE INDEX idx_pantryItems_userId_category ON pantryItems(userId, category);

-- Shopping List
CREATE INDEX idx_shoppingListItems_userId ON shoppingListItems(userId);
CREATE INDEX idx_shoppingListItems_userId_completed ON shoppingListItems(userId, completed);

-- Audit Logs
CREATE INDEX idx_auditLogs_userId ON auditLogs(userId);
CREATE INDEX idx_auditLogs_timestamp ON auditLogs(timestamp);
CREATE INDEX idx_auditLogs_userId_action ON auditLogs(userId, action);

-- User App Installs
CREATE INDEX idx_userAppInstalls_userId_appId ON userAppInstalls(userId, appId);
```

## Troubleshooting

### Database Connection Issues

**Error:** `ER_ACCESS_DENIED_ERROR`

**Solution:**
```sql
-- Create user and grant permissions
CREATE USER 'kaiden_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON kaiden.* TO 'kaiden_user'@'localhost';
FLUSH PRIVILEGES;
```

### Authentication Errors

**Error:** `JWT token invalid`

**Solution:**
- Verify `JWT_SECRET` matches between frontend and backend
- Check token is being sent in Authorization header
- Ensure token hasn't expired

### CORS Errors

**Error:** `Access-Control-Allow-Origin blocked`

**Solution:**
```typescript
// server/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Missing Dependencies

**Error:** `Cannot find module 'zustand'`

**Solution:**
```bash
npm install zustand zod drizzle-orm date-fns recharts
```

## Testing

Run tests to verify everything works:

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Monitoring

### Enable Analytics

Analytics are automatically tracked. Verify in your analytics dashboard:

1. Check for `pantryiq_*` events
2. Monitor error rates
3. Track user engagement

### Database Monitoring

Monitor query performance:

```sql
-- Check slow queries
SELECT * FROM mysql.slow_log 
WHERE sql_text LIKE '%pantryItems%' 
ORDER BY query_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'kaiden'
AND table_name LIKE '%pantry%';
```

## Security Checklist

- [ ] JWT_SECRET is secure and unique
- [ ] Database passwords are strong
- [ ] API endpoints require authentication
- [ ] Input validation is enabled
- [ ] Audit logging is active
- [ ] HTTPS is enforced in production
- [ ] Rate limiting is configured
- [ ] CORS origins are restricted

## Backup and Recovery

### Database Backup

```bash
# Backup PantryIQ tables
mysqldump -u root -p kaiden \
  pantryItems \
  shoppingListItems \
  userStats \
  auditLogs \
  > pantryiq_backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u root -p kaiden < pantryiq_backup_20240112.sql
```

### Data Export

Users can export their data via API:

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/apps/pantryiq/export \
  > my_pantry_data.json
```

## Updating

To update PantryIQ:

1. Pull latest version
2. Run database migrations
3. Clear cache
4. Rebuild frontend
5. Restart server

```bash
git pull origin main
npx drizzle-kit push:mysql
npm run build
pm2 restart kaiden-server
```

## Support

For issues or questions:

1. Check [README.md](./README-PANTRYIQ.md)
2. Review error logs: `tail -f logs/pantryiq.log`
3. Contact Kaiden support team

## Next Steps

After successful installation:

1. **Customize Branding** - Update colors/logos in theme
2. **Configure Notifications** - Set up email/SMS alerts
3. **Add Recipe API** - Integrate with real recipe database
4. **Enable Analytics** - Connect to analytics platform
5. **User Onboarding** - Create tutorial flow

---

**Installation complete!** 🎉

Users can now access PantryIQ from their Kaiden dashboard.
