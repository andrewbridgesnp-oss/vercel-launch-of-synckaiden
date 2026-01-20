/**
 * Analytics tracking for PantryIQ
 * Integrates with Kaiden's central analytics system
 */

const APP_ID = 'pantryiq';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
}

/**
 * Track an analytics event
 */
export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  // In production, this would integrate with Kaiden's analytics system
  // For now, we'll use console logging in development
  
  const eventData: AnalyticsEvent = {
    event: `${APP_ID}_${event}`,
    properties: {
      appId: APP_ID,
      timestamp: new Date().toISOString(),
      ...properties,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventData);
  }

  // Send to analytics endpoint
  if (typeof window !== 'undefined' && (window as any).kaiden?.analytics) {
    (window as any).kaiden.analytics.track(eventData);
  }
}

/**
 * Track page view
 */
export function trackPageView(pageName: string): void {
  trackEvent('page_view', { page: pageName });
}

/**
 * Track user action
 */
export function trackAction(action: string, metadata?: Record<string, unknown>): void {
  trackEvent('user_action', { action, ...metadata });
}

/**
 * Track error
 */
export function trackError(error: Error, context?: Record<string, unknown>): void {
  trackEvent('error', {
    error: error.message,
    stack: error.stack,
    ...context,
  });
}

/**
 * Predefined tracking functions for common PantryIQ events
 */
export const analytics = {
  // App lifecycle
  appOpened: () => trackEvent('app_opened'),
  appClosed: () => trackEvent('app_closed'),

  // Item management
  itemAdded: (itemData: { name: string; category: string }) => 
    trackAction('item_added', itemData),
  itemUpdated: (itemId: number) => 
    trackAction('item_updated', { itemId }),
  itemDeleted: (itemId: number) => 
    trackAction('item_deleted', { itemId }),
  itemExpired: (itemData: { name: string; category: string }) => 
    trackAction('item_expired', itemData),

  // Scanner
  scannerOpened: () => trackAction('scanner_opened'),
  scanCompleted: (itemName: string) => 
    trackAction('scan_completed', { itemName }),

  // Shopping list
  shoppingListOpened: () => trackAction('shopping_list_opened'),
  shoppingItemAdded: (itemName: string) => 
    trackAction('shopping_item_added', { itemName }),
  shoppingItemToggled: (itemId: number, completed: boolean) => 
    trackAction('shopping_item_toggled', { itemId, completed }),

  // Stats
  statsDashboardOpened: () => trackAction('stats_dashboard_opened'),

  // Notifications
  notificationEnabled: () => trackAction('notification_enabled'),
  notificationDisabled: () => trackAction('notification_disabled'),
  notificationSent: (itemName: string) => 
    trackAction('notification_sent', { itemName }),

  // Errors
  error: (error: Error, context?: Record<string, unknown>) => 
    trackError(error, context),
};
