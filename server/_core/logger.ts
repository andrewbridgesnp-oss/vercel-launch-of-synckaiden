/**
 * Centralized logging utility
 * TODO: Integrate with external service (e.g., Sentry, LogRocket, DataDog)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogContext {
  userId?: number;
  requestId?: string;
  action?: string;
  resource?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context ? JSON.stringify(context, null, 2) : '');
    }
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext) {
    console.log(`[INFO] ${message}`, context || '');
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context || '');
    // TODO: Send to monitoring service in production
  }

  /**
   * Log an error
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    console.error(`[ERROR] ${message}`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
      ...context,
    });
    // TODO: Send to error tracking service (e.g., Sentry)
  }

  /**
   * Log a critical error that requires immediate attention
   */
  critical(message: string, error?: Error | unknown, context?: LogContext) {
    console.error(`[CRITICAL] ${message}`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
      ...context,
    });
    // TODO: Send alert to monitoring service
  }

  /**
   * Log a performance metric
   */
  metric(name: string, value: number, unit: string = 'ms', context?: LogContext) {
    if (this.isDevelopment) {
      console.log(`[METRIC] ${name}: ${value}${unit}`, context || '');
    }
    // TODO: Send to metrics service (e.g., DataDog, Prometheus)
  }

  /**
   * Start a performance timer
   */
  startTimer(label: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.metric(label, duration);
    };
  }

  /**
   * Log a database query for debugging
   */
  query(query: string, params?: any, duration?: number) {
    if (this.isDevelopment) {
      console.log(`[QUERY]${duration ? ` (${duration}ms)` : ''} ${query}`, params || '');
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Decorator/wrapper to log function execution time
 */
export function withTiming<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  label?: string
): T {
  const fnLabel = label || fn.name || 'anonymous';
  
  return (async (...args: any[]) => {
    const endTimer = logger.startTimer(fnLabel);
    try {
      const result = await fn(...args);
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  }) as T;
}

/**
 * Create a scoped logger with default context
 */
export function createScopedLogger(defaultContext: LogContext) {
  return {
    debug: (message: string, context?: LogContext) => 
      logger.debug(message, { ...defaultContext, ...context }),
    info: (message: string, context?: LogContext) => 
      logger.info(message, { ...defaultContext, ...context }),
    warn: (message: string, context?: LogContext) => 
      logger.warn(message, { ...defaultContext, ...context }),
    error: (message: string, error?: Error | unknown, context?: LogContext) => 
      logger.error(message, error, { ...defaultContext, ...context }),
    critical: (message: string, error?: Error | unknown, context?: LogContext) => 
      logger.critical(message, error, { ...defaultContext, ...context }),
  };
}
