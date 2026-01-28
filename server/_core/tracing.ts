/**
 * Request tracing middleware for better observability
 * Adds correlation IDs to requests and logs request/response details
 */

import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { logger } from './logger';

/**
 * Add request ID to all requests for tracing
 */
export function requestId() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Use existing ID from header or generate new one
    const id = (req.headers['x-request-id'] as string) || nanoid(16);
    
    // Store in request for later use
    (req as any).requestId = id;
    
    // Add to response headers
    res.setHeader('X-Request-ID', id);
    
    next();
  };
}

/**
 * Log all requests with timing information
 */
export function requestLogger(options?: {
  skipPaths?: string[];
  logBody?: boolean;
}) {
  const skipPaths = options?.skipPaths || [];
  const logBody = options?.logBody ?? false;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip certain paths (e.g., health checks, static assets)
    if (skipPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    const requestId = (req as any).requestId || 'unknown';
    const startTime = Date.now();

    // Log request
    logger.info(`${req.method} ${req.path}`, {
      requestId,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      ...(logBody && req.body ? { body: req.body } : {}),
    });

    // Log response when finished
    const originalSend = res.send;
    res.send = function(data) {
      const duration = Date.now() - startTime;
      
      logger.info(`${req.method} ${req.path} - ${res.statusCode}`, {
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
      });

      // Log slow requests as warnings
      if (duration > 1000) {
        logger.warn(`Slow request detected: ${req.method} ${req.path}`, {
          requestId,
          duration,
          statusCode: res.statusCode,
        });
      }

      return originalSend.call(this, data);
    };

    next();
  };
}

/**
 * Error tracking middleware
 * Should be added after all other middleware/routes
 */
export function errorTracker() {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const requestId = (req as any).requestId || 'unknown';

    logger.error('Request error', err, {
      requestId,
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      statusCode: res.statusCode,
    });

    // If headers already sent, delegate to default error handler
    if (res.headersSent) {
      return next(err);
    }

    // Send error response
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
      requestId,
    });
  };
}

/**
 * Get request ID from request object
 */
export function getRequestId(req: Request): string {
  return (req as any).requestId || 'unknown';
}
