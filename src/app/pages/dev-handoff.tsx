import { Code, Layers, Database, Zap, GitBranch, Server } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { Badge } from "../components/ui/badge";

export function DevHandoffPage() {
  const components = [
    {
      name: "KPICard",
      path: "/src/app/components/avery/kpi-card.tsx",
      states: ["default", "loading", "error"],
      props: ["title", "value", "change", "icon", "trend"]
    },
    {
      name: "StatusBadge",
      path: "/src/app/components/avery/status-badge.tsx",
      states: ["active", "pending", "trial", "vip", "compliance", "paid", "failed", "expired"],
      props: ["status", "className"]
    },
    {
      name: "AudioPlayer",
      path: "/src/app/components/avery/audio-player.tsx",
      states: ["playing", "paused", "loading"],
      props: ["duration", "fileName"]
    },
    {
      name: "CallTimeline",
      path: "/src/app/components/avery/call-timeline.tsx",
      states: ["completed", "current", "pending"],
      props: ["steps"]
    },
    {
      name: "GlassmorphismCard",
      path: "/src/app/components/avery/glassmorphism-card.tsx",
      states: ["default", "hover"],
      props: ["children", "className", "hover"]
    }
  ];

  const pages = [
    {
      name: "Marketing",
      path: "/src/app/pages/marketing.tsx",
      states: ["default"],
      apis: ["None - Static content"]
    },
    {
      name: "Pricing",
      path: "/src/app/pages/pricing.tsx",
      states: ["default", "stripe-success", "stripe-failure"],
      apis: ["Stripe Checkout API"]
    },
    {
      name: "Auth",
      path: "/src/app/pages/auth.tsx",
      states: ["signin", "signup", "forgot", "invite", "loading", "error"],
      apis: ["POST /auth/signin", "POST /auth/signup", "POST /auth/forgot-password"]
    },
    {
      name: "Onboarding",
      path: "/src/app/pages/onboarding.tsx",
      states: ["step-1", "step-2", "step-3", "step-4", "step-5", "validation-error"],
      apis: ["POST /businesses", "POST /services", "POST /integrations"]
    },
    {
      name: "Dashboard",
      path: "/src/app/pages/dashboard.tsx",
      states: ["loading", "loaded", "empty"],
      apis: ["GET /dashboard/stats", "GET /activity/recent"]
    },
    {
      name: "Calls",
      path: "/src/app/pages/calls.tsx",
      states: ["loading", "loaded", "empty", "detail-modal"],
      apis: ["GET /calls", "GET /calls/:id", "GET /calls/:id/recording"]
    },
    {
      name: "Bookings",
      path: "/src/app/pages/bookings.tsx",
      states: ["loading", "loaded", "empty", "detail-modal"],
      apis: ["GET /bookings", "POST /bookings/:id/payment-link", "POST /bookings/:id/confirmation"]
    }
  ];

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/auth/signin",
      body: "{ email, password }",
      response: "{ token, user }"
    },
    {
      method: "POST",
      endpoint: "/api/auth/signup",
      body: "{ email, password, businessName }",
      response: "{ token, user }"
    },
    {
      method: "GET",
      endpoint: "/api/dashboard/stats",
      params: "?timeRange=week",
      response: "{ kpis, recentActivity }"
    },
    {
      method: "GET",
      endpoint: "/api/calls",
      params: "?page=1&limit=50&outcome=all",
      response: "{ calls[], total, page }"
    },
    {
      method: "GET",
      endpoint: "/api/calls/:id",
      params: "",
      response: "{ call, transcript, recording }"
    },
    {
      method: "GET",
      endpoint: "/api/bookings",
      params: "?status=all",
      response: "{ bookings[], total }"
    },
    {
      method: "POST",
      endpoint: "/api/bookings/:id/payment-link",
      body: "{ email, phone }",
      response: "{ success, linkId }"
    },
    {
      method: "POST",
      endpoint: "/api/integrations/phone",
      body: "{ phoneNumber, provider }",
      response: "{ success, integrationId }"
    },
    {
      method: "POST",
      endpoint: "/api/integrations/calendar",
      body: "{ calendarType, credentials }",
      response: "{ success, integrationId }"
    },
    {
      method: "POST",
      endpoint: "/api/integrations/payments",
      body: "{ provider, apiKey }",
      response: "{ success, integrationId }"
    }
  ];

  const validations = [
    { field: "email", rule: "Valid email format, required" },
    { field: "phone", rule: "E.164 format (+1XXXXXXXXXX), required" },
    { field: "password", rule: "Min 8 chars, 1 uppercase, 1 number" },
    { field: "businessName", rule: "1-100 chars, required" },
    { field: "service.price", rule: "Positive number, max 2 decimals" },
    { field: "service.duration", rule: "Positive integer (minutes)" },
    { field: "hours", rule: "HH:MM format, start < end" }
  ];

  const loadingStates = [
    { component: "Page Load", state: "Show skeleton loaders for cards and tables" },
    { component: "Form Submit", state: "Disable button, show loading spinner" },
    { component: "Data Fetch", state: "Show loading state in tables/lists" },
    { component: "Payment Link", state: "Show 'Sending...' toast notification" },
    { component: "Integration Connect", state: "Show modal with progress indicator" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Developer Handoff</h1>
        <p className="text-muted-foreground">
          Complete technical documentation for implementation
        </p>
      </div>

      {/* Tech Stack */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent" />
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Frontend", value: "React 18.3.1 + TypeScript" },
            { label: "Styling", value: "Tailwind CSS v4" },
            { label: "Components", value: "Radix UI + shadcn/ui" },
            { label: "State", value: "React Hooks" },
            { label: "Forms", value: "react-hook-form" },
            { label: "Icons", value: "Lucide React" },
            { label: "Charts", value: "Recharts" },
            { label: "Notifications", value: "Sonner" }
          ].map((tech, i) => (
            <div key={i} className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">{tech.label}</p>
              <p className="text-sm font-medium">{tech.value}</p>
            </div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* Component Reference */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-accent" />
          Component Reference
        </h2>
        <div className="space-y-4">
          {components.map((comp, i) => (
            <div key={i} className="p-4 bg-muted/20 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-sm font-semibold">{comp.name}</h3>
                <Badge variant="outline">{comp.path}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">States:</p>
                  <div className="flex flex-wrap gap-1">
                    {comp.states.map((state, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Props:</p>
                  <code className="text-xs">{comp.props.join(", ")}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* Page Specifications */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-accent" />
          Page Specifications
        </h2>
        <div className="space-y-4">
          {pages.map((page, i) => (
            <div key={i} className="p-4 bg-muted/20 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{page.name}</h3>
                <Badge variant="outline">{page.path}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">UI States:</p>
                  <div className="flex flex-wrap gap-1">
                    {page.states.map((state, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">API Dependencies:</p>
                  <code className="text-xs">{page.apis.join(", ")}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* API Endpoints */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-accent" />
          API Endpoints
        </h2>
        <div className="space-y-3">
          {apiEndpoints.map((api, i) => (
            <div key={i} className="p-4 bg-muted/20 rounded-lg border-l-4 border-accent">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-accent text-accent-foreground">{api.method}</Badge>
                <code className="text-sm font-mono">{api.endpoint}</code>
              </div>
              {api.params && (
                <p className="text-xs text-muted-foreground mb-1">Params: <code>{api.params}</code></p>
              )}
              {api.body && (
                <p className="text-xs text-muted-foreground mb-1">Body: <code>{api.body}</code></p>
              )}
              <p className="text-xs text-muted-foreground">Response: <code>{api.response}</code></p>
            </div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* Validations */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-accent" />
          Required Validations
        </h2>
        <div className="space-y-2">
          {validations.map((val, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
              <code className="text-sm font-mono font-semibold min-w-[150px]">{val.field}</code>
              <span className="text-sm text-muted-foreground">{val.rule}</span>
            </div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* Loading States */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Loading State Rules
        </h2>
        <div className="space-y-3">
          {loadingStates.map((loading, i) => (
            <div key={i} className="p-4 bg-muted/20 rounded-lg">
              <p className="font-semibold mb-1">{loading.component}</p>
              <p className="text-sm text-muted-foreground">{loading.state}</p>
            </div>
          ))}
        </div>
      </GlassmorphismCard>

      {/* External Integrations */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">External Service Integrations</h2>
        <div className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-lg">
            <h3 className="font-semibold mb-2">Phone Provider (Twilio)</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Voice API for call handling</li>
              <li>• Programmable Messaging for SMS</li>
              <li>• TwiML for call flow logic</li>
              <li>• Recording storage and retrieval</li>
            </ul>
          </div>
          <div className="p-4 bg-muted/20 rounded-lg">
            <h3 className="font-semibold mb-2">Calendar Integration</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Google Calendar API for availability</li>
              <li>• CalDAV for universal calendar support</li>
              <li>• Event creation and updates</li>
              <li>• Conflict detection</li>
            </ul>
          </div>
          <div className="p-4 bg-muted/20 rounded-lg">
            <h3 className="font-semibold mb-2">Payment Processing (Stripe)</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Payment Links API for deposits</li>
              <li>• Webhooks for payment status</li>
              <li>• Customer portal for receipts</li>
              <li>• Refund handling</li>
            </ul>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Environment Variables */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="p-4 bg-muted/30 rounded-lg font-mono text-sm space-y-1">
          <p>VITE_API_BASE_URL=https://api.avery.ai</p>
          <p>VITE_TWILIO_ACCOUNT_SID=YOUR_TWILIO_SID</p>
          <p>VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...</p>
          <p>VITE_GOOGLE_CALENDAR_CLIENT_ID=YOUR_CLIENT_ID</p>
        </div>
      </GlassmorphismCard>
    </div>
  );
}
