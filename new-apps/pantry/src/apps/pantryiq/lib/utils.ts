import type { PantryItem } from '../types';

/**
 * Calculate days until expiry for a pantry item
 */
export function calculateDaysUntilExpiry(item: PantryItem): number {
  const daysSinceAdded = Math.floor(
    (Date.now() - new Date(item.addedDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  return item.expiryDays - daysSinceAdded;
}

/**
 * Check if an item is expiring soon (within 3 days)
 */
export function isExpiringSoon(item: PantryItem): boolean {
  const daysUntilExpiry = calculateDaysUntilExpiry(item);
  return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
}

/**
 * Check if an item is expired
 */
export function isExpired(item: PantryItem): boolean {
  return calculateDaysUntilExpiry(item) < 0;
}

/**
 * Get expiring items (within 3 days)
 */
export function getExpiringItems(items: PantryItem[]): PantryItem[] {
  return items.filter(item => {
    const days = calculateDaysUntilExpiry(item);
    return days <= 3 && days >= 0;
  });
}

/**
 * Get expired items
 */
export function getExpiredItems(items: PantryItem[]): PantryItem[] {
  return items.filter(item => calculateDaysUntilExpiry(item) < 0);
}

/**
 * Sort items by expiry date (soonest first)
 */
export function sortByExpiry(items: PantryItem[]): PantryItem[] {
  return [...items].sort((a, b) => {
    const daysA = calculateDaysUntilExpiry(a);
    const daysB = calculateDaysUntilExpiry(b);
    return daysA - daysB;
  });
}

/**
 * Sort items by name (alphabetically)
 */
export function sortByName(items: PantryItem[]): PantryItem[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sort items by date added (newest first)
 */
export function sortByDate(items: PantryItem[]): PantryItem[] {
  return [...items].sort((a, b) => 
    new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
  );
}

/**
 * Filter items by category
 */
export function filterByCategory(items: PantryItem[], category: string): PantryItem[] {
  if (category === 'all') return items;
  return items.filter(item => item.category === category);
}

/**
 * Search items by name or category
 */
export function searchItems(items: PantryItem[], query: string): PantryItem[] {
  if (!query.trim()) return items;
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get unique categories from items
 */
export function getUniqueCategories(items: PantryItem[]): string[] {
  const categories = new Set(items.map(item => item.category));
  return ['all', ...Array.from(categories)];
}

/**
 * Calculate waste reduction percentage
 */
export function calculateWasteReduction(totalAdded: number, expired: number): number {
  if (totalAdded === 0) return 0;
  return Math.round(((totalAdded - expired) / totalAdded) * 100);
}

/**
 * Estimate pantry value (rough estimate at $4.50 per item)
 */
export function estimatePantryValue(itemCount: number): number {
  return itemCount * 4.5;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Get category color (for charts/badges)
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Dairy': '#3b82f6',
    'Produce': '#10b981',
    'Meat': '#ef4444',
    'Bakery': '#f59e0b',
    'Canned Goods': '#8b5cf6',
    'Frozen': '#06b6d4',
    'Beverages': '#ec4899',
    'Snacks': '#84cc16',
    'Other': '#64748b',
  };
  return colors[category] || '#64748b';
}
