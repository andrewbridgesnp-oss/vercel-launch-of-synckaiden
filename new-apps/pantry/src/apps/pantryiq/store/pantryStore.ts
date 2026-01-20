import { create } from 'zustand';
import type { 
  PantryItem, 
  CreatePantryItemInput, 
  UpdatePantryItemInput,
  UserStats,
  FilterOption,
  SortOption,
  ViewMode 
} from '../types';
import { pantryApi, statsApi } from '../lib/api';
import { analytics } from '../lib/analytics';
import {
  sortByExpiry,
  sortByName,
  sortByDate,
  filterByCategory,
  searchItems,
  getExpiringItems,
  isExpired,
} from '../lib/utils';

interface PantryStore {
  // State
  items: PantryItem[];
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  
  // UI State
  filter: FilterOption;
  searchQuery: string;
  categoryFilter: string;
  sortBy: SortOption;
  viewMode: ViewMode;
  selectedItem: PantryItem | null;
  
  // Actions - Data
  fetchItems: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createItem: (input: CreatePantryItemInput) => Promise<void>;
  updateItem: (id: number, input: UpdatePantryItemInput) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  
  // Actions - UI
  setFilter: (filter: FilterOption) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedItem: (item: PantryItem | null) => void;
  
  // Computed
  getFilteredItems: () => PantryItem[];
  getExpiringItems: () => PantryItem[];
}

export const usePantryStore = create<PantryStore>((set, get) => ({
  // Initial State
  items: [],
  stats: null,
  isLoading: false,
  error: null,
  
  // UI State
  filter: 'all',
  searchQuery: '',
  categoryFilter: 'all',
  sortBy: 'expiry',
  viewMode: 'inventory',
  selectedItem: null,

  // ========================================================================
  // DATA ACTIONS
  // ========================================================================

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await pantryApi.getItems();
      set({ items, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch items';
      set({ error: message, isLoading: false });
      analytics.error(error as Error, { action: 'fetchItems' });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await statsApi.getStats();
      set({ stats });
    } catch (error) {
      analytics.error(error as Error, { action: 'fetchStats' });
    }
  },

  createItem: async (input: CreatePantryItemInput) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await pantryApi.createItem(input);
      set(state => ({
        items: [newItem, ...state.items],
        isLoading: false,
      }));
      
      // Update stats
      get().fetchStats();
      
      // Track analytics
      analytics.itemAdded({
        name: input.name,
        category: input.category,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create item';
      set({ error: message, isLoading: false });
      analytics.error(error as Error, { action: 'createItem', input });
      throw error;
    }
  },

  updateItem: async (id: number, input: UpdatePantryItemInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = await pantryApi.updateItem(id, input);
      set(state => ({
        items: state.items.map(item => item.id === id ? updatedItem : item),
        isLoading: false,
      }));
      
      analytics.itemUpdated(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update item';
      set({ error: message, isLoading: false });
      analytics.error(error as Error, { action: 'updateItem', id, input });
      throw error;
    }
  },

  deleteItem: async (id: number) => {
    const item = get().items.find(i => i.id === id);
    
    set({ isLoading: true, error: null });
    try {
      // Check if item is expired before deleting
      if (item && isExpired(item)) {
        await statsApi.recordExpired(id);
        analytics.itemExpired({
          name: item.name,
          category: item.category,
        });
      }
      
      await pantryApi.deleteItem(id);
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        isLoading: false,
      }));
      
      // Update stats
      get().fetchStats();
      
      analytics.itemDeleted(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete item';
      set({ error: message, isLoading: false });
      analytics.error(error as Error, { action: 'deleteItem', id });
      throw error;
    }
  },

  // ========================================================================
  // UI ACTIONS
  // ========================================================================

  setFilter: (filter: FilterOption) => set({ filter }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter: string) => set({ categoryFilter }),
  setSortBy: (sortBy: SortOption) => set({ sortBy }),
  setViewMode: (viewMode: ViewMode) => {
    set({ viewMode });
    
    // Track analytics
    if (viewMode === 'stats') {
      analytics.statsDashboardOpened();
    } else if (viewMode === 'shopping') {
      analytics.shoppingListOpened();
    }
  },
  setSelectedItem: (selectedItem: PantryItem | null) => set({ selectedItem }),

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================

  getFilteredItems: () => {
    const { items, filter, searchQuery, categoryFilter, sortBy } = get();
    
    let filtered = items;
    
    // Apply expiring filter
    if (filter === 'expiring') {
      filtered = getExpiringItems(filtered);
    }
    
    // Apply search
    if (searchQuery) {
      filtered = searchItems(filtered, searchQuery);
    }
    
    // Apply category filter
    filtered = filterByCategory(filtered, categoryFilter);
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered = sortByName(filtered);
        break;
      case 'date':
        filtered = sortByDate(filtered);
        break;
      case 'expiry':
      default:
        filtered = sortByExpiry(filtered);
        break;
    }
    
    return filtered;
  },

  getExpiringItems: () => {
    return getExpiringItems(get().items);
  },
}));
