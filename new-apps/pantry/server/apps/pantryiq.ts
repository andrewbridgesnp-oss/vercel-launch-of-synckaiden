/**
 * PantryIQ Backend API
 * Express router for all PantryIQ endpoints
 */

import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../_core/db';
import { authMiddleware } from '../_core/auth';
import { validateRequest } from '../_core/validation';
import { createAuditLog } from '../_core/audit';
import {
  pantryItems,
  shoppingListItems,
  userStats,
  notificationPreferences,
} from '../../drizzle/pantryiq-schema';
import {
  CreatePantryItemSchema,
  UpdatePantryItemSchema,
  CreateShoppingListItemSchema,
} from '../../src/apps/pantryiq/types';

const router = Router();
const APP_ID = 'pantryiq';

// Apply authentication middleware to all routes
router.use(authMiddleware);

// ============================================================================
// PANTRY ITEMS ENDPOINTS
// ============================================================================

/**
 * GET /api/apps/pantryiq/items
 * Get all pantry items for authenticated user
 */
router.get('/items', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const items = await db
      .select()
      .from(pantryItems)
      .where(eq(pantryItems.userId, userId))
      .orderBy(desc(pantryItems.createdAt));
    
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('[PantryIQ] Error fetching items:', error);
    res.status(500).json({
      success: false,
      error: 'fetch_items_failed',
      message: 'Failed to fetch pantry items',
    });
  }
});

/**
 * GET /api/apps/pantryiq/items/:id
 * Get a specific pantry item
 */
router.get('/items/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const itemId = parseInt(req.params.id);
    
    const [item] = await db
      .select()
      .from(pantryItems)
      .where(
        and(
          eq(pantryItems.id, itemId),
          eq(pantryItems.userId, userId)
        )
      );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'item_not_found',
        message: 'Pantry item not found',
      });
    }
    
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('[PantryIQ] Error fetching item:', error);
    res.status(500).json({
      success: false,
      error: 'fetch_item_failed',
      message: 'Failed to fetch pantry item',
    });
  }
});

/**
 * POST /api/apps/pantryiq/items
 * Create a new pantry item
 */
router.post('/items', validateRequest(CreatePantryItemSchema), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, category, expiryDays } = req.body;
    
    const [newItem] = await db
      .insert(pantryItems)
      .values({
        userId,
        name,
        category,
        expiryDays,
        addedDate: new Date(),
      })
      .$returningId();
    
    const [item] = await db
      .select()
      .from(pantryItems)
      .where(eq(pantryItems.id, newItem.id));
    
    // Update user stats
    await db
      .insert(userStats)
      .values({
        userId,
        totalItemsAdded: 1,
      })
      .onDuplicateKeyUpdate({
        totalItemsAdded: sql`totalItemsAdded + 1`,
      });
    
    // Create audit log
    await createAuditLog({
      userId,
      appId: APP_ID,
      action: 'item_created',
      resource: 'pantryItem',
      resourceId: item.id,
      changes: { created: item },
    });
    
    res.status(201).json({
      success: true,
      data: item,
      message: 'Item added to pantry',
    });
  } catch (error) {
    console.error('[PantryIQ] Error creating item:', error);
    res.status(500).json({
      success: false,
      error: 'create_item_failed',
      message: 'Failed to create pantry item',
    });
  }
});

/**
 * PUT /api/apps/pantryiq/items/:id
 * Update a pantry item
 */
router.put('/items/:id', validateRequest(UpdatePantryItemSchema), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const itemId = parseInt(req.params.id);
    
    // Get current item
    const [currentItem] = await db
      .select()
      .from(pantryItems)
      .where(
        and(
          eq(pantryItems.id, itemId),
          eq(pantryItems.userId, userId)
        )
      );
    
    if (!currentItem) {
      return res.status(404).json({
        success: false,
        error: 'item_not_found',
        message: 'Pantry item not found',
      });
    }
    
    // Update item
    await db
      .update(pantryItems)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(eq(pantryItems.id, itemId));
    
    const [updatedItem] = await db
      .select()
      .from(pantryItems)
      .where(eq(pantryItems.id, itemId));
    
    // Create audit log
    await createAuditLog({
      userId,
      appId: APP_ID,
      action: 'item_updated',
      resource: 'pantryItem',
      resourceId: itemId,
      changes: {
        before: currentItem,
        after: updatedItem,
      },
    });
    
    res.json({
      success: true,
      data: updatedItem,
      message: 'Item updated',
    });
  } catch (error) {
    console.error('[PantryIQ] Error updating item:', error);
    res.status(500).json({
      success: false,
      error: 'update_item_failed',
      message: 'Failed to update pantry item',
    });
  }
});

/**
 * DELETE /api/apps/pantryiq/items/:id
 * Delete a pantry item
 */
router.delete('/items/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const itemId = parseInt(req.params.id);
    
    // Get item before deleting
    const [item] = await db
      .select()
      .from(pantryItems)
      .where(
        and(
          eq(pantryItems.id, itemId),
          eq(pantryItems.userId, userId)
        )
      );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'item_not_found',
        message: 'Pantry item not found',
      });
    }
    
    await db
      .delete(pantryItems)
      .where(eq(pantryItems.id, itemId));
    
    // Create audit log
    await createAuditLog({
      userId,
      appId: APP_ID,
      action: 'item_deleted',
      resource: 'pantryItem',
      resourceId: itemId,
      changes: { deleted: item },
    });
    
    res.json({
      success: true,
      message: 'Item deleted from pantry',
    });
  } catch (error) {
    console.error('[PantryIQ] Error deleting item:', error);
    res.status(500).json({
      success: false,
      error: 'delete_item_failed',
      message: 'Failed to delete pantry item',
    });
  }
});

// ============================================================================
// SHOPPING LIST ENDPOINTS
// ============================================================================

/**
 * GET /api/apps/pantryiq/shopping-list
 * Get shopping list items
 */
router.get('/shopping-list', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const items = await db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.userId, userId))
      .orderBy(desc(shoppingListItems.createdAt));
    
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('[PantryIQ] Error fetching shopping list:', error);
    res.status(500).json({
      success: false,
      error: 'fetch_shopping_list_failed',
      message: 'Failed to fetch shopping list',
    });
  }
});

/**
 * POST /api/apps/pantryiq/shopping-list
 * Add item to shopping list
 */
router.post('/shopping-list', validateRequest(CreateShoppingListItemSchema), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name } = req.body;
    
    const [newItem] = await db
      .insert(shoppingListItems)
      .values({
        userId,
        name,
        completed: false,
      })
      .$returningId();
    
    const [item] = await db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.id, newItem.id));
    
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('[PantryIQ] Error creating shopping item:', error);
    res.status(500).json({
      success: false,
      error: 'create_shopping_item_failed',
      message: 'Failed to add item to shopping list',
    });
  }
});

/**
 * PUT /api/apps/pantryiq/shopping-list/:id/toggle
 * Toggle shopping list item completion
 */
router.put('/shopping-list/:id/toggle', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const itemId = parseInt(req.params.id);
    
    const [item] = await db
      .select()
      .from(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.id, itemId),
          eq(shoppingListItems.userId, userId)
        )
      );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'item_not_found',
        message: 'Shopping list item not found',
      });
    }
    
    await db
      .update(shoppingListItems)
      .set({
        completed: !item.completed,
        updatedAt: new Date(),
      })
      .where(eq(shoppingListItems.id, itemId));
    
    const [updatedItem] = await db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.id, itemId));
    
    res.json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    console.error('[PantryIQ] Error toggling shopping item:', error);
    res.status(500).json({
      success: false,
      error: 'toggle_shopping_item_failed',
      message: 'Failed to toggle shopping item',
    });
  }
});

/**
 * DELETE /api/apps/pantryiq/shopping-list/:id
 * Delete shopping list item
 */
router.delete('/shopping-list/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const itemId = parseInt(req.params.id);
    
    await db
      .delete(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.id, itemId),
          eq(shoppingListItems.userId, userId)
        )
      );
    
    res.json({
      success: true,
      message: 'Item removed from shopping list',
    });
  } catch (error) {
    console.error('[PantryIQ] Error deleting shopping item:', error);
    res.status(500).json({
      success: false,
      error: 'delete_shopping_item_failed',
      message: 'Failed to delete shopping item',
    });
  }
});

/**
 * DELETE /api/apps/pantryiq/shopping-list/clear-completed
 * Clear completed shopping list items
 */
router.delete('/shopping-list/clear-completed', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    await db
      .delete(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.userId, userId),
          eq(shoppingListItems.completed, true)
        )
      );
    
    res.json({
      success: true,
      message: 'Completed items cleared',
    });
  } catch (error) {
    console.error('[PantryIQ] Error clearing completed items:', error);
    res.status(500).json({
      success: false,
      error: 'clear_completed_failed',
      message: 'Failed to clear completed items',
    });
  }
});

// ============================================================================
// STATS ENDPOINTS
// ============================================================================

/**
 * GET /api/apps/pantryiq/stats
 * Get user statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));
    
    if (!stats) {
      // Create default stats if they don't exist
      await db.insert(userStats).values({ userId });
      
      return res.json({
        success: true,
        data: {
          totalItemsAdded: 0,
          itemsExpired: 0,
          wasteReduction: 0,
          activePantryValue: 0,
        },
      });
    }
    
    // Calculate waste reduction and active pantry value
    const itemCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(pantryItems)
      .where(eq(pantryItems.userId, userId));
    
    const wasteReduction = stats.totalItemsAdded > 0
      ? Math.round(((stats.totalItemsAdded - stats.itemsExpired) / stats.totalItemsAdded) * 100)
      : 0;
    
    const activePantryValue = (itemCount[0]?.count || 0) * 4.5;
    
    res.json({
      success: true,
      data: {
        totalItemsAdded: stats.totalItemsAdded,
        itemsExpired: stats.itemsExpired,
        wasteReduction,
        activePantryValue,
      },
    });
  } catch (error) {
    console.error('[PantryIQ] Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'fetch_stats_failed',
      message: 'Failed to fetch statistics',
    });
  }
});

/**
 * POST /api/apps/pantryiq/stats/expired
 * Record an item as expired
 */
router.post('/stats/expired', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    await db
      .insert(userStats)
      .values({
        userId,
        itemsExpired: 1,
      })
      .onDuplicateKeyUpdate({
        itemsExpired: sql`itemsExpired + 1`,
      });
    
    res.json({
      success: true,
      message: 'Expired item recorded',
    });
  } catch (error) {
    console.error('[PantryIQ] Error recording expired item:', error);
    res.status(500).json({
      success: false,
      error: 'record_expired_failed',
      message: 'Failed to record expired item',
    });
  }
});

export default router;
