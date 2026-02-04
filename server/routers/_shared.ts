/**
 * Shared exports for router files to reduce boilerplate imports
 * Use: import { z, router, publicProcedure, protectedProcedure, getDb } from './_shared';
 */

// Re-export commonly used zod
export { z } from 'zod';

// Re-export router and procedure builders
export { router, publicProcedure, protectedProcedure, adminProcedure } from '../_core/trpc';

// Re-export database helpers
export { 
  getDb, 
  withTransaction,
  getPaginationParams,
  type PaginationParams,
  type PaginationMeta
} from '../db';

// Re-export common drizzle operators
export { eq, and, or, desc, asc } from 'drizzle-orm';
