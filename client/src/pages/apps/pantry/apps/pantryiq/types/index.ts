import { z } from 'zod';

// ============================================================================
// PANTRY ITEM TYPES
// ============================================================================

export const PantryItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string().min(1, 'Item name is required'),
  category: z.enum([
    'Dairy',
    'Produce',
    'Meat',
    'Bakery',
    'Canned Goods',
    'Frozen',
    'Beverages',
    'Snacks',
    'Other'
  ]),
  addedDate: z.date(),
  expiryDays: z.number().min(1).max(365),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePantryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(255),
  category: z.enum([
    'Dairy',
    'Produce',
    'Meat',
    'Bakery',
    'Canned Goods',
    'Frozen',
    'Beverages',
    'Snacks',
    'Other'
  ]),
  expiryDays: z.number().min(1).max(365),
});

export const UpdatePantryItemSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  category: z.enum([
    'Dairy',
    'Produce',
    'Meat',
    'Bakery',
    'Canned Goods',
    'Frozen',
    'Beverages',
    'Snacks',
    'Other'
  ]).optional(),
  expiryDays: z.number().min(1).max(365).optional(),
});

export type PantryItem = z.infer<typeof PantryItemSchema>;
export type CreatePantryItemInput = z.infer<typeof CreatePantryItemSchema>;
export type UpdatePantryItemInput = z.infer<typeof UpdatePantryItemSchema>;

// ============================================================================
// SHOPPING LIST TYPES
// ============================================================================

export const ShoppingListItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateShoppingListItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(255),
});

export type ShoppingListItem = z.infer<typeof ShoppingListItemSchema>;
export type CreateShoppingListItemInput = z.infer<typeof CreateShoppingListItemSchema>;

// ============================================================================
// USER STATS TYPES
// ============================================================================

export interface UserStats {
  totalItemsAdded: number;
  itemsExpired: number;
  wasteReduction: number;
  activePantryValue: number;
}

// ============================================================================
// FILTER & SORT TYPES
// ============================================================================

export type FilterOption = 'all' | 'expiring';
export type SortOption = 'date' | 'name' | 'expiry';
export type ViewMode = 'inventory' | 'stats' | 'shopping';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
