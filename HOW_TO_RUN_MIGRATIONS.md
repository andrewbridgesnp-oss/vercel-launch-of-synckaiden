# How to Run Database Migrations

This guide explains how to apply the database schema changes, particularly the new composite indexes.

## Quick Start

### 🪟 Windows

#### Option 1: PowerShell (Recommended)

```powershell
# 1. Set your database URL
$env:DATABASE_URL="mysql://user:password@host:port/database"

# 2. Run the migration script
.\migrate.ps1
```

#### Option 2: Command Prompt

```cmd
# 1. Set your database URL
set DATABASE_URL=mysql://user:password@host:port/database

# 2. Run the migration script
migrate.bat
```

#### Option 3: Direct Command (PowerShell)

```powershell
# Set database URL and run migration
$env:DATABASE_URL="mysql://user:password@host:port/database"
pnpm run db:push
```

#### Option 4: Direct Command (CMD)

```cmd
set DATABASE_URL=mysql://user:password@host:port/database
pnpm run db:push
```

#### Option 5: Using .env File (Windows)

```cmd
# 1. Create .env file (in PowerShell)
@"
DATABASE_URL=mysql://user:password@host:port/database
"@ | Out-File -FilePath .env -Encoding utf8

# Or in CMD, create .env manually with notepad
notepad .env
# Then add: DATABASE_URL=mysql://user:password@host:port/database

# 2. Run migration
pnpm run db:push
```

### 🐧 Linux / Mac

#### Option 1: Using the Migration Script (Recommended)

```bash
# 1. Set your database URL
export DATABASE_URL="mysql://user:password@host:port/database"

# 2. Run the migration script
./migrate.sh
```

#### Option 2: Direct Command

```bash
# Set database URL and run migration
export DATABASE_URL="mysql://user:password@host:port/database"
pnpm run db:push
```

#### Option 3: Using .env File

```bash
# 1. Create .env file
cat > .env << EOF
DATABASE_URL=mysql://user:password@host:port/database
EOF

# 2. Run migration
pnpm run db:push
```

## What Gets Applied

When you run `pnpm run db:push`, it will:

1. **Generate migration files** from `drizzle/schema.ts`
2. **Apply migrations** to your database
3. **Create 4 new composite indexes** for performance optimization

### New Indexes

| Table | Index Name | Columns | Purpose |
|-------|-----------|---------|---------|
| `subscriptions` | `subscription_userId_status_idx` | (userId, status) | Faster subscription lookups by user and status |
| `entitlements` | `entitlement_userId_productId_status_idx` | (userId, productId, status) | Faster entitlement checks |
| `auditLogs` | `audit_userId_createdAt_idx` | (userId, createdAt) | Faster paginated audit queries |
| `userApiKeys` | `apikey_userId_service_active_idx` | (userId, service, active) | Faster API key lookups |

## Database Connection Strings

### Local Development (MySQL)

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL="mysql://root:password@localhost:3306/synckaiden"
```

**Windows (CMD):**
```cmd
set DATABASE_URL=mysql://root:password@localhost:3306/synckaiden
```

**Linux/Mac:**
```bash
export DATABASE_URL="mysql://root:password@localhost:3306/synckaiden"
```

### Docker MySQL

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL="mysql://root:password@db:3306/synckaiden"
```

**Windows (CMD):**
```cmd
set DATABASE_URL=mysql://root:password@db:3306/synckaiden
```

**Linux/Mac:**
```bash
export DATABASE_URL="mysql://root:password@db:3306/synckaiden"
```

### PlanetScale
```bash
export DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/synckaiden?ssl={'rejectUnauthorized':true}"
```

### Railway
```bash
export DATABASE_URL="mysql://root:password@containers-us-west-123.railway.app:1234/railway"
```

### Vercel (using environment variables)
In Vercel dashboard, set:
```
DATABASE_URL=mysql://user:password@host:port/database
```

Then deploy - migrations will run automatically.

## Troubleshooting

### Error: DATABASE_URL is required

**Problem:** The environment variable is not set.

**Solution (Windows PowerShell):**
```powershell
$env:DATABASE_URL="your-database-url"
```

**Solution (Windows CMD):**
```cmd
set DATABASE_URL=your-database-url
```

**Solution (Linux/Mac):**
```bash
export DATABASE_URL="your-database-url"
```

Or create a `.env` file in the project root with:
```
DATABASE_URL=your-database-url
```

### Error: Connection refused

**Problem:** Database server is not running or not accessible.

**Solution:**
- Check if MySQL/database server is running
- Verify host and port in connection string
- Check firewall rules

### Error: Access denied

**Problem:** Invalid credentials in DATABASE_URL.

**Solution:**
- Verify username and password
- Ensure user has CREATE INDEX permission

### Error: Table doesn't exist

**Problem:** Database tables haven't been created yet.

**Solution:**
Run initial migration first to create tables, then run index migration.

## Verifying Migrations

After running migrations, verify indexes were created:

```sql
-- Check indexes on subscriptions
SHOW INDEX FROM subscriptions;

-- Check indexes on entitlements
SHOW INDEX FROM entitlements;

-- Check indexes on auditLogs
SHOW INDEX FROM auditLogs;

-- Check indexes on userApiKeys
SHOW INDEX FROM userApiKeys;
```

Expected output should include the new composite indexes.

## Performance Testing

Before and after migration, compare query performance:

```sql
-- Test subscription query
EXPLAIN SELECT * FROM subscriptions 
WHERE userId = 1 AND status = 'active';

-- Should show "Using index" in Extra column after migration
```

## Rollback

If you need to remove the indexes:

```sql
DROP INDEX subscription_userId_status_idx ON subscriptions;
DROP INDEX entitlement_userId_productId_status_idx ON entitlements;
DROP INDEX audit_userId_createdAt_idx ON auditLogs;
DROP INDEX apikey_userId_service_active_idx ON userApiKeys;
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: pnpm run db:push
```

### Vercel

Migrations run automatically on deployment when `DATABASE_URL` is set in environment variables.

## Safety Notes

- ✅ Indexes are created non-blocking (MySQL 5.6+)
- ✅ Tables remain accessible during index creation
- ✅ No data is modified, only indexes added
- ⚠️  Backup your database before running in production
- ⚠️  Index creation may take time on large tables (10K+ rows)

## Getting Help

- See `DATABASE_MIGRATION_GUIDE.md` for detailed index information
- See `OPTIMIZATION_SUMMARY.md` for performance impact
- Check drizzle-kit documentation: https://orm.drizzle.team/kit-docs/overview
