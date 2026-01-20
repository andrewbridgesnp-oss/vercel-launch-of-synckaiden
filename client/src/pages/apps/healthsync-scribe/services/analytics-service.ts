/**
 * Analytics & Monitoring Service
 * Track usage, performance, and errors for business insights
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
  timestamp: string;
  context?: Record<string, any>;
}

export interface ErrorEvent {
  error: Error;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  userId?: string;
}

class AnalyticsService {
  private sessionId: string;
  private userId: string | null = null;
  private buffer: AnalyticsEvent[] = [];
  private flushInterval: number = 30000; // 30 seconds

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
    this.setupPerformanceMonitoring();
    this.setupErrorTracking();
  }

  /**
   * Track a user event
   */
  track(event: string, properties?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.userId || undefined,
      sessionId: this.sessionId,
    };

    this.buffer.push(analyticsEvent);

    // Send to analytics platforms
    this.sendToAnalytics(analyticsEvent);

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }
  }

  /**
   * Track page view
   */
  page(pageName: string, properties?: Record<string, any>): void {
    this.track('Page Viewed', {
      page: pageName,
      ...properties,
    });
  }

  /**
   * Identify user
   */
  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;
    this.track('User Identified', {
      userId,
      ...traits,
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: string, value: number, context?: Record<string, any>): void {
    const performanceMetric: PerformanceMetric = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      context,
    };

    this.sendPerformanceMetric(performanceMetric);
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>, severity: ErrorEvent['severity'] = 'medium'): void {
    const errorEvent: ErrorEvent = {
      error,
      context,
      severity,
      timestamp: new Date().toISOString(),
      userId: this.userId || undefined,
    };

    this.sendError(errorEvent);

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Tracked]', error, context);
    }
  }

  /**
   * Track feature usage
   */
  trackFeature(featureName: string, action: string, metadata?: Record<string, any>): void {
    this.track('Feature Used', {
      feature: featureName,
      action,
      ...metadata,
    });
  }

  /**
   * Track timing (how long something took)
   */
  trackTiming(category: string, variable: string, time: number): void {
    this.track('Timing', {
      category,
      variable,
      time,
    });
  }

  /**
   * Start timing an operation
   */
  startTimer(name: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.trackTiming('operation', name, duration);
    };
  }

  /**
   * Track conversion/goal
   */
  trackConversion(goal: string, value?: number): void {
    this.track('Conversion', {
      goal,
      value,
    });
  }

  /**
   * Track A/B test variant
   */
  trackExperiment(experimentName: string, variant: string): void {
    this.track('Experiment Viewed', {
      experiment: experimentName,
      variant,
    });
  }

  /**
   * Private methods
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private startFlushTimer(): void {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private flush(): void {
    if (this.buffer.length === 0) return;

    // In production, send batch to backend
    const events = [...this.buffer];
    this.buffer = [];

    // Mock API call
    this.sendBatch(events);
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    // Integration points for analytics platforms:
    
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event.event, event.properties);
    }

    // Mixpanel
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track(event.event, event.properties);
    }

    // Amplitude
    if (typeof amplitude !== 'undefined') {
      amplitude.track(event.event, event.properties);
    }

    // Segment
    if (typeof analytics !== 'undefined') {
      analytics.track(event.event, event.properties);
    }

    // Custom backend
    this.sendToBackend('/analytics/events', event);
  }

  private sendPerformanceMetric(metric: PerformanceMetric): void {
    // Send to performance monitoring (e.g., New Relic, Datadog)
    this.sendToBackend('/analytics/performance', metric);
  }

  private sendError(error: ErrorEvent): void {
    // Send to error tracking (e.g., Sentry, Rollbar)
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(error.error, {
        level: error.severity,
        extra: error.context,
      });
    }

    this.sendToBackend('/analytics/errors', {
      message: error.error.message,
      stack: error.error.stack,
      severity: error.severity,
      context: error.context,
      timestamp: error.timestamp,
      userId: error.userId,
    });
  }

  private sendBatch(events: AnalyticsEvent[]): void {
    this.sendToBackend('/analytics/batch', { events });
  }

  private async sendToBackend(endpoint: string, data: any): Promise<void> {
    try {
      // In production, this would send to your backend
      // For now, we'll just log it
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics API] ${endpoint}`, data);
      }

      // Actual implementation:
      // await fetch(`${API_BASE_URL}${endpoint}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authService.getToken()}`,
      //   },
      //   body: JSON.stringify(data),
      // });
    } catch (error) {
      // Silently fail - don't break the app if analytics fails
      console.error('Analytics error:', error);
    }
  }

  private setupPerformanceMonitoring(): void {
    // Monitor page load performance
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const connectTime = perfData.responseEnd - perfData.requestStart;
          const renderTime = perfData.domComplete - perfData.domLoading;

          this.trackPerformance('page_load_time', pageLoadTime);
          this.trackPerformance('connect_time', connectTime);
          this.trackPerformance('render_time', renderTime);
        }, 0);
      });
    }

    // Monitor Core Web Vitals
    if (typeof PerformanceObserver !== 'undefined') {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformance('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const fid = (entry as any).processingStart - entry.startTime;
          this.trackPerformance('fid', fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.trackPerformance('cls', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private setupErrorTracking(): void {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.trackError(
        new Error(event.message),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        'high'
      );
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        new Error(event.reason),
        { type: 'unhandled_promise' },
        'high'
      );
    });
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();

// Convenience functions
export const track = (event: string, properties?: Record<string, any>) => 
  analyticsService.track(event, properties);

export const trackPage = (pageName: string, properties?: Record<string, any>) => 
  analyticsService.page(pageName, properties);

export const trackFeature = (featureName: string, action: string, metadata?: Record<string, any>) => 
  analyticsService.trackFeature(featureName, action, metadata);

export const trackError = (error: Error, context?: Record<string, any>, severity?: ErrorEvent['severity']) => 
  analyticsService.trackError(error, context, severity);

export const trackTiming = (category: string, variable: string, time: number) => 
  analyticsService.trackTiming(category, variable, time);

export const startTimer = (name: string) => 
  analyticsService.startTimer(name);
