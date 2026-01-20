/**
 * PantryIQ Database Schema
 * Compatible with Drizzle ORM for MySQL
 */

import { mysqlTable, int, varchar, timestamp, json, boolean, text } from 'drizzle-orm/mysql-core';

// ============================================================================
// USER APP INSTALL TRACKING
// ============================================================================

export const userAppInstalls = mysqlTable('userAppInstalls', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull(),
  appId: varchar('appId', { length: 255 }).notNull(), // 'pantryiq'
  config: json('config'), // App-specific configuration
  status: varchar('status', { length: 50 }).notNull().default('active'), // 'installed' | 'active' | 'paused' | 'uninstalled'
  installedAt: timestamp('installedAt').defaultNow(),
  lastUsed: timestamp('lastUsed'),
});

// ============================================================================
// PANTRY ITEMS
// ============================================================================

export const pantryItems = mysqlTable('pantryItems', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  addedDate: timestamp('addedDate').notNull(),
  expiryDays: int('expiryDays').notNull(), // Days until expiry from addedDate
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});

// ============================================================================
// SHOPPING LIST
// ============================================================================

export const shoppingListItems = mysqlTable('shoppingListItems', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});

// ============================================================================
// USER STATISTICS
// ============================================================================

export const userStats = mysqlTable('userStats', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().unique(),
  totalItemsAdded: int('totalItemsAdded').default(0),
  itemsExpired: int('itemsExpired').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});

// ============================================================================
// AUDIT LOG
// ============================================================================

export const auditLogs = mysqlTable('auditLogs', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull(),
  appId: varchar('appId', { length: 255 }).notNull(), // 'pantryiq'
  action: varchar('action', { length: 255 }).notNull(), // 'item_created', 'item_deleted', etc.
  resource: varchar('resource', { length: 255 }), // 'pantryItem', 'shoppingListItem'
  resourceId: int('resourceId'), // ID of the affected resource
  changes: json('changes'), // Before/after data
  timestamp: timestamp('timestamp').defaultNow(),
});

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

export const notificationPreferences = mysqlTable('notificationPreferences', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().unique(),
  browserNotifications: boolean('browserNotifications').default(false),
  emailNotifications: boolean('emailNotifications').default(false),
  smsNotifications: boolean('smsNotifications').default(false),
  expiryAlertDays: int('expiryAlertDays').default(1), // Alert when items expire in X days
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').onUpdateNow(),
});

// ============================================================================
// INDEXES (for query optimization)
// ============================================================================

/*
CREATE INDEX idx_pantryItems_userId ON pantryItems(userId);
CREATE INDEX idx_pantryItems_userId_addedDate ON pantryItems(userId, addedDate);
CREATE INDEX idx_pantryItems_userId_category ON pantryItems(userId, category);

CREATE INDEX idx_shoppingListItems_userId ON shoppingListItems(userId);
CREATE INDEX idx_shoppingListItems_userId_completed ON shoppingListItems(userId, completed);

CREATE INDEX idx_auditLogs_userId ON auditLogs(userId);
CREATE INDEX idx_auditLogs_timestamp ON auditLogs(timestamp);
CREATE INDEX idx_auditLogs_userId_action ON auditLogs(userId, action);

CREATE INDEX idx_userAppInstalls_userId_appId ON userAppInstalls(userId, appId);
*/
