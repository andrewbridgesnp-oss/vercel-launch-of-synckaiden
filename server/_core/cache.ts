/**
 * Simple in-memory cache for frequently accessed data
 * For production with multiple instances, consider Redis
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class Cache {
  private store = new Map<string, CacheEntry<any>>();
  private hitCount = 0;
  private missCount = 0;

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.missCount++;
      return null;
    }

    this.hitCount++;
    return entry.data as T;
  }

  /**
   * Set value in cache
   * @param key Cache key
   * @param data Data to cache
   * @param ttlSeconds Time to live in seconds (default: 300 = 5 minutes)
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { data, expiresAt });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);
    
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hitCount + this.missCount;
    return {
      size: this.store.size,
      hits: this.hitCount,
      misses: this.missCount,
      hitRate: total > 0 ? (this.hitCount / total * 100).toFixed(2) + '%' : '0%',
    };
  }

  /**
   * Get or set pattern: fetch from cache or compute and cache
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttlSeconds);
    return data;
  }
}

// Export singleton instance
export const cache = new Cache();

// Utility functions for common cache patterns

/**
 * Cache key builder for user-specific data
 */
export function userCacheKey(userId: number, resource: string): string {
  return `user:${userId}:${resource}`;
}

/**
 * Cache key builder for product data
 */
export function productCacheKey(productId: number | string): string {
  return `product:${productId}`;
}

/**
 * Cache key for all products list
 */
export function allProductsCacheKey(): string {
  return 'products:all';
}

/**
 * Invalidate all user-related cache
 */
export function invalidateUserCache(userId: number): number {
  return cache.invalidatePattern(`^user:${userId}:`);
}

/**
 * Invalidate all product-related cache
 */
export function invalidateProductCache(): number {
  return cache.invalidatePattern('^product:');
}
