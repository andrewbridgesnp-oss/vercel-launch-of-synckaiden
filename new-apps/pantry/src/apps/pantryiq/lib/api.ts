import type { 
  PantryItem, 
  CreatePantryItemInput, 
  UpdatePantryItemInput,
  ShoppingListItem,
  CreateShoppingListItemInput,
  UserStats,
  ApiResponse 
} from '../types';

const APP_ID = 'pantryiq';
const API_BASE = '/api/apps';

/**
 * Get authorization header with JWT token
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('kaiden_auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Handle API errors consistently
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
}

// ============================================================================
// PANTRY ITEMS API
// ============================================================================

export const pantryApi = {
  /**
   * Get all pantry items for authenticated user
   */
  async getItems(): Promise<PantryItem[]> {
    const response = await fetch(`${API_BASE}/${APP_ID}/items`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<PantryItem[]>(response);
    return result.data || [];
  },

  /**
   * Get a specific pantry item
   */
  async getItem(id: number): Promise<PantryItem> {
    const response = await fetch(`${API_BASE}/${APP_ID}/items/${id}`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<PantryItem>(response);
    if (!result.data) throw new Error('Item not found');
    return result.data;
  },

  /**
   * Create a new pantry item
   */
  async createItem(input: CreatePantryItemInput): Promise<PantryItem> {
    const response = await fetch(`${API_BASE}/${APP_ID}/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    const result = await handleResponse<PantryItem>(response);
    if (!result.data) throw new Error('Failed to create item');
    return result.data;
  },

  /**
   * Update a pantry item
   */
  async updateItem(id: number, input: UpdatePantryItemInput): Promise<PantryItem> {
    const response = await fetch(`${API_BASE}/${APP_ID}/items/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    const result = await handleResponse<PantryItem>(response);
    if (!result.data) throw new Error('Failed to update item');
    return result.data;
  },

  /**
   * Delete a pantry item
   */
  async deleteItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${APP_ID}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(response);
  },
};

// ============================================================================
// SHOPPING LIST API
// ============================================================================

export const shoppingListApi = {
  /**
   * Get shopping list items
   */
  async getItems(): Promise<ShoppingListItem[]> {
    const response = await fetch(`${API_BASE}/${APP_ID}/shopping-list`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<ShoppingListItem[]>(response);
    return result.data || [];
  },

  /**
   * Create shopping list item
   */
  async createItem(input: CreateShoppingListItemInput): Promise<ShoppingListItem> {
    const response = await fetch(`${API_BASE}/${APP_ID}/shopping-list`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });
    const result = await handleResponse<ShoppingListItem>(response);
    if (!result.data) throw new Error('Failed to create item');
    return result.data;
  },

  /**
   * Toggle shopping list item completion
   */
  async toggleItem(id: number): Promise<ShoppingListItem> {
    const response = await fetch(`${API_BASE}/${APP_ID}/shopping-list/${id}/toggle`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<ShoppingListItem>(response);
    if (!result.data) throw new Error('Failed to toggle item');
    return result.data;
  },

  /**
   * Delete shopping list item
   */
  async deleteItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${APP_ID}/shopping-list/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(response);
  },

  /**
   * Clear completed items
   */
  async clearCompleted(): Promise<void> {
    const response = await fetch(`${API_BASE}/${APP_ID}/shopping-list/clear-completed`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse(response);
  },
};

// ============================================================================
// STATS API
// ============================================================================

export const statsApi = {
  /**
   * Get user statistics
   */
  async getStats(): Promise<UserStats> {
    const response = await fetch(`${API_BASE}/${APP_ID}/stats`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<UserStats>(response);
    if (!result.data) throw new Error('Failed to fetch stats');
    return result.data;
  },

  /**
   * Record an item as expired
   */
  async recordExpired(itemId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${APP_ID}/stats/expired`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ itemId }),
    });
    await handleResponse(response);
  },
};
