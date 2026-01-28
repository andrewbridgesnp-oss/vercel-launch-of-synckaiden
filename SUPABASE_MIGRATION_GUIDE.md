# Supabase Database Migration Guide

## Your Supabase Project
Project ID: `awshrwknsvbfiuziwvpi`
Dashboard: https://supabase.com/dashboard/project/awshrwknsvbfiuziwvpi

## Step 1: Get Your Database Connection String

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/awshrwknsvbfiuziwvpi
2. Click on **"Project Settings"** (gear icon in the left sidebar)
3. Click on **"Database"** in the settings menu
4. Scroll down to **"Connection string"** section
5. Select **"URI"** tab
6. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres
   ```
7. Replace `[YOUR-PASSWORD]` with your actual database password

> **Note:** Supabase uses PostgreSQL, not MySQL!

## Step 2: Update the Database Dialect

Since Supabase uses PostgreSQL, we need to check if the drizzle config needs updating.

### Check Current Config
The project currently uses MySQL dialect. For Supabase (PostgreSQL), you may need to adjust.

**Current config (drizzle.config.ts):**
```typescript
dialect: "mysql"
```

**For Supabase (PostgreSQL), it should be:**
```typescript
dialect: "postgresql"
```

## Step 3: Run the Migration

### On Windows (PowerShell):
```powershell
# Set your Supabase connection string
$env:DATABASE_URL="postgresql://postgres:your-password@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres"

# Run migration
pnpm run db:push
```

### On Windows (CMD):
```cmd
set DATABASE_URL=postgresql://postgres:your-password@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres
pnpm run db:push
```

## Common Supabase Connection Strings

### Direct Connection (Transaction Mode)
```
postgresql://postgres:[YOUR-PASSWORD]@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres
```

### Connection Pooling (Session Mode)
```
postgresql://postgres:[YOUR-PASSWORD]@db.awshrwknsvbfiuziwvpi.supabase.co:6543/postgres?pgbouncer=true
```

### With SSL (Recommended for Production)
```
postgresql://postgres:[YOUR-PASSWORD]@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres?sslmode=require
```

## Where to Find Your Password

If you don't remember your database password:

1. Go to: https://supabase.com/dashboard/project/awshrwknsvbfiuziwvpi/settings/database
2. Look for **"Database password"** section
3. If you need to reset it, click **"Reset Database Password"**
   - ⚠️ Warning: This will break existing connections using the old password
   - Update your `.env` file after resetting

## Alternative: Use .env File

Create a `.env` file in your project root:

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres:your-password@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres
```

Then just run:
```powershell
pnpm run db:push
```

## Verifying the Connection

Test your connection string:

### PowerShell:
```powershell
$env:DATABASE_URL="postgresql://postgres:your-password@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres"
pnpm run check
```

## What Will Be Migrated

4 new composite indexes for better performance:
1. `subscriptions` - userId + status index
2. `entitlements` - userId + productId + status index
3. `auditLogs` - userId + createdAt index
4. `userApiKeys` - userId + service + active index

## After Migration

You can verify the indexes in Supabase:

1. Go to: https://supabase.com/dashboard/project/awshrwknsvbfiuziwvpi/editor
2. Click on **"SQL Editor"**
3. Run this query:
```sql
-- Check indexes on subscriptions
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'subscriptions';

-- Check indexes on entitlements
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'entitlements';

-- Check indexes on auditLogs
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'auditLogs';

-- Check indexes on userApiKeys
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'userApiKeys';
```

## Troubleshooting

### Error: "relation does not exist"
**Problem:** Tables haven't been created yet in Supabase.

**Solution:** Run the initial migration to create all tables first.

### Error: "password authentication failed"
**Problem:** Incorrect password in connection string.

**Solution:** 
1. Go to Database settings
2. Reset your database password
3. Update the DATABASE_URL with new password

### Error: "SSL connection required"
**Problem:** Supabase requires SSL for connections.

**Solution:** Add `?sslmode=require` to your connection string:
```
postgresql://postgres:password@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres?sslmode=require
```

## Security Best Practices

1. **Never commit** your database password to git
2. Use `.env` file (already in `.gitignore`)
3. For production, use Supabase's connection pooler (port 6543)
4. Enable Row Level Security (RLS) in Supabase for your tables

## Quick Command Reference

```powershell
# Set connection (PowerShell)
$env:DATABASE_URL="postgresql://postgres:password@db.awshrwknsvbfiuziwvpi.supabase.co:5432/postgres"

# Run migration
pnpm run db:push

# Check for errors
pnpm run check
```

## Need Your Password?

→ Go to: https://supabase.com/dashboard/project/awshrwknsvbfiuziwvpi/settings/database

Look for the **"Connection string"** or **"Database password"** section.
