/**
 * Rate limiting middleware for Express
 * Simple in-memory rate limiter - for production with multiple instances, use Redis
 */

import { Request, Response, NextFunction } from 'express';
import { getRateLimitConfig } from './config';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(key);
        }
      }
    }, 60000);
    
    if (process.env.NODE_ENV === 'production') {
      console.warn('[RateLimit] Using in-memory rate limiter in production. Rate limits will not be shared across instances. Consider using Redis for production deployments.');
    }
  }

  check(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New window
      this.store.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string, maxRequests: number): number {
    const entry = this.store.get(identifier);
    if (!entry) return maxRequests;
    return Math.max(0, maxRequests - entry.count);
  }

  getResetTime(identifier: string): number | null {
    const entry = this.store.get(identifier);
    return entry ? entry.resetTime : null;
  }

  cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

const rateLimiter = new RateLimiter();

/**
 * Rate limiting middleware factory
 * @param options Configuration options
 */
export function createRateLimiter(options?: {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
  skip?: (req: Request) => boolean;
  handler?: (req: Request, res: Response) => void;
}) {
  const config = getRateLimitConfig();
  const windowMs = options?.windowMs || config.windowMs;
  const maxRequests = options?.maxRequests || config.maxRequests;
  
  const keyGenerator = options?.keyGenerator || ((req: Request) => {
    // Try to get real IP from proxy headers first
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
      return ips[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  });

  const skip = options?.skip || (() => false);
  
  const handler = options?.handler || ((req: Request, res: Response) => {
    const resetTime = rateLimiter.getResetTime(keyGenerator(req));
    const retryAfter = resetTime ? Math.ceil(Math.max(0, resetTime - Date.now()) / 1000) : 60;
    
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter,
    });
  });

  return (req: Request, res: Response, next: NextFunction) => {
    if (skip(req)) {
      return next();
    }

    const identifier = keyGenerator(req);
    const allowed = rateLimiter.check(identifier, maxRequests, windowMs);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', rateLimiter.getRemainingRequests(identifier, maxRequests));
    
    const resetTime = rateLimiter.getResetTime(identifier);
    if (resetTime) {
      res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));
    }

    if (!allowed) {
      return handler(req, res);
    }

    next();
  };
}

/**
 * Stricter rate limiter for sensitive endpoints (e.g., login, registration)
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

/**
 * Standard rate limiter for API endpoints
 */
export const standardRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

/**
 * Relaxed rate limiter for general requests
 */
export const relaxedRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 300,
});

/**
 * Cleanup rate limiter on shutdown
 */
export function cleanupRateLimiter() {
  rateLimiter.cleanup();
}
