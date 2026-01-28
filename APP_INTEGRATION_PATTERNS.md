# App Integration Guide - Performance & Best Practices

This guide outlines the recommended patterns for integrating new apps into the Synckaiden unified platform with optimal performance.

## 🚀 Quick Start

### 1. App Structure

Create your app in the `/new-apps/{app-name}` directory with this structure:

```
new-apps/
└── your-app/
    ├── package.json          # App dependencies (isolated)
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/           # Page components
    │   └── lib/             # Utility functions
    └── README.md
```

### 2. Create tRPC Router

Create a router file at `/server/routers/{appName}.ts`:

```typescript
// Use the shared imports to reduce boilerplate
import { z, router, protectedProcedure, getDb, withTransaction, eq, and } from './_shared';
import { yourTable } from '../../drizzle/schema';

export const yourAppRouter = router({
  // Use protectedProcedure for authenticated endpoints
  getData: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      
      // Use existing helper functions when possible
      const data = await db.select()
        .from(yourTable)
        .where(and(
          eq(yourTable.userId, ctx.user.id),
          eq(yourTable.id, input.id)
        ))
        .limit(1);
      
      return data[0];
    }),

  // Use transactions for multi-step operations
  createWithRelation: protectedProcedure
    .input(z.object({
      name: z.string(),
      relatedData: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return withTransaction(async (tx) => {
        // Both operations succeed or both fail
        const [mainRecord] = await tx.insert(yourTable).values({
          userId: ctx.user.id,
          name: input.name,
        });
        
        await tx.insert(relatedTable).values({
          mainId: mainRecord.id,
          data: input.relatedData,
        });
        
        return { success: true, id: mainRecord.id };
      });
    }),
});
```

### 3. Register Router

Add your router to `/server/routers.ts`:

```typescript
import { yourAppRouter } from './routers/yourApp';

export const appRouter = router({
  // ... existing routers
  yourApp: yourAppRouter,
});
```

### 4. Add Database Schema

Add your tables to `/drizzle/schema.ts`:

```typescript
export const yourAppTable = mysqlTable("yourAppTable", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  // Always add indexes for foreign keys and frequently queried columns
  userIdIdx: index("yourApp_userId_idx").on(table.userId),
  statusIdx: index("yourApp_status_idx").on(table.status),
  // Composite index for common query patterns
  userStatusIdx: index("yourApp_userId_status_idx").on(table.userId, table.status),
}));
```

## ⚡ Performance Best Practices

### 1. Database Queries

**❌ Bad - No pagination:**
```typescript
const allRecords = await db.select().from(records);
```

**✅ Good - With pagination:**
```typescript
import { getPaginationParams } from './_shared';

const { limit, offset } = getPaginationParams({ page: input.page, limit: input.limit });
const records = await db.select()
  .from(records)
  .limit(limit)
  .offset(offset);
```

### 2. Caching Static Data

**❌ Bad - Hits DB every time:**
```typescript
const products = await db.select().from(products);
```

**✅ Good - Uses cache:**
```typescript
import { cache, allProductsCacheKey } from '../_core/cache';

const products = await cache.getOrSet(
  allProductsCacheKey(),
  async () => await db.select().from(products),
  300 // 5 minutes TTL
);
```

### 3. Database Transactions

**❌ Bad - No transaction (can leave inconsistent state):**
```typescript
await db.insert(subscriptions).values(subData);
await db.insert(entitlements).values(entData); // If this fails, subscription exists but no entitlement!
```

**✅ Good - With transaction:**
```typescript
import { withTransaction } from './_shared';

await withTransaction(async (tx) => {
  await tx.insert(subscriptions).values(subData);
  await tx.insert(entitlements).values(entData);
});
```

### 4. Composite Indexes

Always add composite indexes for common query patterns:

```typescript
// If you frequently query by userId AND status
userStatusIdx: index("table_userId_status_idx").on(table.userId, table.status),

// If you frequently query by userId AND sort by createdAt
userCreatedIdx: index("table_userId_createdAt_idx").on(table.userId, table.createdAt),
```

### 5. Input Validation

Always validate and sanitize inputs:

```typescript
.input(z.object({
  page: z.number().min(1).max(1000).default(1),
  limit: z.number().min(1).max(100).default(30),
  search: z.string().max(200).optional(),
}))
```

## 🔧 Common Patterns

### List Endpoint with Pagination
```typescript
listItems: protectedProcedure
  .input(z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(30),
  }))
  .query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return { items: [], meta: { page: 1, limit: 30, hasMore: false } };
    
    const { limit, offset } = getPaginationParams(input);
    
    const items = await db.select()
      .from(yourTable)
      .where(eq(yourTable.userId, ctx.user.id))
      .limit(limit + 1) // Fetch one extra to check if there are more
      .offset(offset);
    
    const hasMore = items.length > limit;
    if (hasMore) items.pop(); // Remove extra item
    
    return {
      items,
      meta: {
        page: input.page,
        limit: input.limit,
        hasMore,
      },
    };
  }),
```

### Bulk Operations
```typescript
bulkCreate: protectedProcedure
  .input(z.object({
    items: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })).max(100), // Limit bulk operations
  }))
  .mutation(async ({ ctx, input }) => {
    return withTransaction(async (tx) => {
      const results = await tx.insert(yourTable).values(
        input.items.map(item => ({
          ...item,
          userId: ctx.user.id,
        }))
      );
      return { count: results.rowsAffected };
    });
  }),
```

## 📝 Checklist

Before submitting your new app integration:

- [ ] Router uses shared imports from `./_shared`
- [ ] All list endpoints have pagination
- [ ] Database schema includes appropriate indexes (especially composite ones)
- [ ] Multi-step operations use `withTransaction()`
- [ ] Static/frequently-accessed data uses caching
- [ ] Input validation with zod schemas
- [ ] All user-specific queries filter by `userId`
- [ ] Error handling for database unavailability
- [ ] No hardcoded magic numbers (use constants)
- [ ] Documented any complex business logic

## 🎯 Performance Targets

- **List queries**: < 100ms with proper indexes
- **Single record queries**: < 50ms
- **Mutations**: < 200ms
- **Cache hit rate**: > 80% for static data
- **Max pagination size**: 100 items

## 🔍 Monitoring

Check cache performance:
```typescript
import { cache } from '../_core/cache';
console.log(cache.getStats());
// { size: 42, hits: 150, misses: 10, hitRate: '93.75%' }
```

## 📚 Additional Resources

- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Database Indexing Best Practices](https://use-the-index-luke.com/)
