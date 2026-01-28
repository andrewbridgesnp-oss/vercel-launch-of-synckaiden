# 🚀 Database Migration - Quick Start

## ⚠️ IMPORTANT: Navigate to Project First!

Before running any commands, open PowerShell/CMD and navigate to your project:

```powershell
# Go to your project directory (example)
cd C:\Users\YourName\Documents\vercel-launch-of-synckaiden

# Verify you're in the right place
dir package.json
# Should show package.json file
```

---

## You're on Manus? Start Here! ✅

Your site is hosted on **Manus**, which makes this super easy:

```powershell
pnpm run db:push
```

Done! See `MANUS_HOSTING_GUIDE.md` for details.

---

## Documentation Guide

### 📋 Start Here
1. **`MANUS_HOSTING_GUIDE.md`** ⭐ - For Manus-hosted sites (most users)
2. **`WINDOWS_QUICKSTART.md`** - Windows users (non-Manus)
3. **`HOW_TO_RUN_MIGRATIONS.md`** - Complete cross-platform guide

### 📚 Reference Docs
- **`OPTIMIZATION_SUMMARY.md`** - What these migrations do (performance improvements)
- **`PERFORMANCE_IMPROVEMENTS.md`** - Deep dive into optimizations
- **`DATABASE_MIGRATION_GUIDE.md`** - Technical details about the indexes
- **`APP_INTEGRATION_PATTERNS.md`** - Best practices for adding new apps

### ⚠️ Not Needed (For Reference Only)
- **`DATABASE_COMPATIBILITY_ISSUE.md`** - Resolved (Manus uses MySQL)
- **`SUPABASE_MIGRATION_GUIDE.md`** - Not applicable (site is on Manus)

### 🔧 Migration Scripts
- **`migrate.ps1`** - PowerShell script (Windows)
- **`migrate.bat`** - Batch script (Windows CMD)
- **`migrate.sh`** - Bash script (Linux/Mac)
- **`migrations-preview.sql`** - Preview of SQL to be executed

---

## What These Migrations Do

Creates 4 composite indexes for **2-10x faster performance**:

1. ✅ **subscriptions** - Faster subscription lookups
2. ✅ **entitlements** - Faster access checks
3. ✅ **auditLogs** - Faster pagination
4. ✅ **userApiKeys** - Faster key queries

---

## TL;DR

**Manus users:** Run `pnpm run db:push` and you're done!  
**Others:** See `WINDOWS_QUICKSTART.md` or `HOW_TO_RUN_MIGRATIONS.md`
