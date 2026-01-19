import mixpanel from "mixpanel-browser";

// Initialize Mixpanel (use your project token from Mixpanel dashboard)
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || "demo-token";
const isProduction = import.meta.env.PROD;

if (isProduction && MIXPANEL_TOKEN !== "demo-token") {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: !isProduction,
    track_pageview: true,
    persistence: "localStorage",
  });
}

export const analytics = {
  // Track events
  track: (eventName: string, properties?: Record<string, any>) => {
    if (isProduction && MIXPANEL_TOKEN !== "demo-token") {
      mixpanel.track(eventName, properties);
    } else {
      console.log("[Analytics]", eventName, properties);
    }
  },

  // Identify user
  identify: (userId: string | number) => {
    if (isProduction && MIXPANEL_TOKEN !== "demo-token") {
      mixpanel.identify(userId.toString());
    } else {
      console.log("[Analytics] Identify:", userId);
    }
  },

  // Set user properties
  setUser: (properties: Record<string, any>) => {
    if (isProduction && MIXPANEL_TOKEN !== "demo-token") {
      mixpanel.people.set(properties);
    } else {
      console.log("[Analytics] Set User:", properties);
    }
  },

  // Track page view
  pageView: (pageName: string) => {
    if (isProduction && MIXPANEL_TOKEN !== "demo-token") {
      mixpanel.track_pageview({ page: pageName });
    } else {
      console.log("[Analytics] Page View:", pageName);
    }
  },

  // Predefined events
  events: {
    // Auth events
    signup: (method: string) => analytics.track("Signup", { method }),
    login: (method: string) => analytics.track("Login", { method }),
    logout: () => analytics.track("Logout"),

    // Trial events
    trialStart: (tier: string) => analytics.track("Trial Started", { tier }),
    trialEnd: (converted: boolean) => analytics.track("Trial Ended", { converted }),

    // Subscription events
    upgradeView: (from: string, to: string) => analytics.track("Upgrade Viewed", { from, to }),
    upgradeComplete: (tier: string, amount: number) => analytics.track("Upgrade Completed", { tier, amount }),
    downgrade: (from: string, to: string) => analytics.track("Downgraded", { from, to }),
    cancel: (reason?: string) => analytics.track("Subscription Canceled", { reason }),

    // Payment events
    paymentSuccess: (amount: number, currency: string) => analytics.track("Payment Success", { amount, currency }),
    paymentFailed: (reason: string) => analytics.track("Payment Failed", { reason }),

    // Feature usage
    featureUsed: (feature: string, details?: Record<string, any>) => analytics.track("Feature Used", { feature, ...details }),
    
    // E-commerce events
    productViewed: (productId: number, productName: string) => analytics.track("Product Viewed", { productId, productName }),
    addToCart: (productId: number, price: number) => analytics.track("Added to Cart", { productId, price }),
    checkout: (total: number, itemCount: number) => analytics.track("Checkout Started", { total, itemCount }),
    orderComplete: (orderId: number, total: number) => analytics.track("Order Completed", { orderId, total }),

    // Engagement events
    chatMessage: (messageLength: number) => analytics.track("Chat Message Sent", { messageLength }),
    voiceCommand: (command: string) => analytics.track("Voice Command", { command }),
    aiGeneration: (type: string) => analytics.track("AI Generation", { type }),
  },
};
