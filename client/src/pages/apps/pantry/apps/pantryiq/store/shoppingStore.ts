import { create } from 'zustand';
import type { ShoppingListItem, CreateShoppingListItemInput } from '../types';
import { shoppingListApi } from '../lib/api';
import { analytics } from '../lib/analytics';

interface ShoppingStore {
  // State
  items: ShoppingListItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  createItem: (input: CreateShoppingListItemInput) => Promise<void>;
  toggleItem: (id: number) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  clearCompleted: () => Promise<void>;
  
  // Computed
  getCompletedCount: () => number;
}

export const useShoppingStore = create<ShoppingStore>((set, get) => ({
  // Initial State
  items: [],
  isLoading: false,
  error: null,

  // ========================================================================
  // ACTIONS
  // ========================================================================

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await shoppingListApi.getItems();
      set({ items, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch items';
      set({ error: message, isLoading: false });
      analytics.error(error as Error, { action: 'fetchShoppingItems' });
    }
  },

  createItem: async (input: CreateShoppingListItemInput) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await shoppingListApi.createItem(input);
      set(state => ({
        items: [...state.items, newItem],
        isLoading: false,
      }));
      
      analytics.shoppingItemAdded(input.name);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create item';
      set({ error: message, isLoading: false });
      analytics.error(error as Error, { action: 'createShoppingItem', input });
      throw error;
    }
  },

  toggleItem: async (id: number) => {
    try {
      const updatedItem = await shoppingListApi.toggleItem(id);
      set(state => ({
        items: state.items.map(item => item.id === id ? updatedItem : item),
      }));
      
      analytics.shoppingItemToggled(id, updatedItem.completed);
    } catch (error) {
      analytics.error(error as Error, { action: 'toggleShoppingItem', id });
      throw error;
    }
  },

  deleteItem: async (id: number) => {
    try {
      await shoppingListApi.deleteItem(id);
      set(state => ({
        items: state.items.filter(item => item.id !== id),
      }));
    } catch (error) {
      analytics.error(error as Error, { action: 'deleteShoppingItem', id });
      throw error;
    }
  },

  clearCompleted: async () => {
    try {
      await shoppingListApi.clearCompleted();
      set(state => ({
        items: state.items.filter(item => !item.completed),
      }));
    } catch (error) {
      analytics.error(error as Error, { action: 'clearCompleted' });
      throw error;
    }
  },

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  getCompletedCount: () => {
    return get().items.filter(item => item.completed).length;
  },
}));
