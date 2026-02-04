-- Preview of SQL migrations that will be generated
-- These indexes will be created when you run: pnpm run db:push

-- ========================================
-- Composite Index Migrations
-- ========================================

-- 1. Subscriptions table - Optimize userId + status queries
-- This speeds up queries like: WHERE userId = X AND status = 'active'
CREATE INDEX IF NOT EXISTS `subscription_userId_status_idx` 
ON `subscriptions` (`userId`, `status`);

-- 2. Entitlements table - Optimize entitlement checks
-- This speeds up queries like: WHERE userId = X AND productId = Y AND status = 'active'
CREATE INDEX IF NOT EXISTS `entitlement_userId_productId_status_idx` 
ON `entitlements` (`userId`, `productId`, `status`);

-- 3. Audit Logs table - Optimize pagination
-- This speeds up queries like: WHERE userId = X ORDER BY createdAt DESC
CREATE INDEX IF NOT EXISTS `audit_userId_createdAt_idx` 
ON `auditLogs` (`userId`, `createdAt`);

-- 4. User API Keys table - Optimize key lookups
-- This speeds up queries like: WHERE userId = X AND service = 'stripe' AND active = true
CREATE INDEX IF NOT EXISTS `apikey_userId_service_active_idx` 
ON `userApiKeys` (`userId`, `service`, `active`);

-- ========================================
-- Expected Performance Improvements
-- ========================================

/*
Before indexes:
  - Full table scans on filtered queries
  - 200-500ms for subscription/entitlement lookups
  - 1000ms+ for audit log pagination with 100K records

After indexes:
  - Index-based lookups
  - 30-100ms for subscription/entitlement lookups (5-10x faster)
  - 100ms for audit log pagination (10x faster)
  - Better performance under concurrent load
*/

-- ========================================
-- Verification Queries
-- ========================================

-- After running migrations, verify with:
-- SHOW INDEX FROM subscriptions WHERE Key_name = 'subscription_userId_status_idx';
-- SHOW INDEX FROM entitlements WHERE Key_name = 'entitlement_userId_productId_status_idx';
-- SHOW INDEX FROM auditLogs WHERE Key_name = 'audit_userId_createdAt_idx';
-- SHOW INDEX FROM userApiKeys WHERE Key_name = 'apikey_userId_service_active_idx';

-- Test query performance:
-- EXPLAIN SELECT * FROM subscriptions WHERE userId = 1 AND status = 'active';
-- Look for "Using index" in the Extra column
