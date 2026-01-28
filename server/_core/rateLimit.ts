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
  private cleanupInterval: NodeJS.Timeout;

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
    // Default: use IP address
    return req.ip || req.socket.remoteAddress || 'unknown';
  });

  const skip = options?.skip || (() => false);
  
  const handler = options?.handler || ((req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((rateLimiter.getResetTime(keyGenerator(req)) || Date.now()) - Date.now()) / 1000,
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
