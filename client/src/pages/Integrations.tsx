import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Key,
  Link2,
  Settings,
  Zap,
  CreditCard,
  Calculator,
  Users,
  FileText,
  Calendar,
  Video,
  Mail,
  MessageSquare,
  BarChart3,
  FolderOpen,
  ShoppingCart,
  Briefcase,
  Music,
  Ghost,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
} from "lucide-react";

// Integration categories and their services
const INTEGRATIONS = {
  accounting: {
    title: "Accounting & Finance",
    icon: Calculator,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    services: [
      { id: "quickbooks", name: "QuickBooks", description: "Accounting, invoicing, payroll", logo: "💼", setupUrl: "https://developer.intuit.com/app/developer/qbo/docs/get-started", fields: ["client_id", "client_secret"] },
      { id: "xero", name: "Xero", description: "Cloud accounting software", logo: "📊", setupUrl: "https://developer.xero.com/", fields: ["client_id", "client_secret"] },
      { id: "freshbooks", name: "FreshBooks", description: "Invoicing & expenses", logo: "📑", setupUrl: "https://www.freshbooks.com/api", fields: ["client_id", "client_secret"] },
      { id: "stripe", name: "Stripe", description: "Payment processing", logo: "💳", setupUrl: "https://dashboard.stripe.com/apikeys", fields: ["secret_key", "publishable_key"], connected: true },
    ]
  },
  payroll: {
    title: "Payroll & HR",
    icon: Users,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    services: [
      { id: "gusto", name: "Gusto", description: "Payroll, benefits, HR", logo: "👥", setupUrl: "https://dev.gusto.com/", fields: ["client_id", "client_secret"], note: "Perfect for Emily's payroll" },
      { id: "adp", name: "ADP", description: "Enterprise payroll", logo: "🏢", setupUrl: "https://developers.adp.com/", fields: ["client_id", "client_secret"] },
    ]
  },
  documents: {
    title: "Document Management",
    icon: FileText,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    services: [
      { id: "docusign", name: "DocuSign", description: "E-signatures & contracts", logo: "✍️", setupUrl: "https://developers.docusign.com/", fields: ["integration_key", "secret_key"] },
      { id: "hellosign", name: "HelloSign", description: "Simple e-signatures", logo: "📝", setupUrl: "https://developers.hellosign.com/", fields: ["api_key"] },
      { id: "pandadoc", name: "PandaDoc", description: "Document automation", logo: "🐼", setupUrl: "https://developers.pandadoc.com/", fields: ["api_key"] },
    ]
  },
  scheduling: {
    title: "Scheduling & Meetings",
    icon: Calendar,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    services: [
      { id: "calendly", name: "Calendly", description: "Appointment scheduling", logo: "📅", setupUrl: "https://developer.calendly.com/", fields: ["api_key"] },
      { id: "zoom", name: "Zoom", description: "Video meetings", logo: "🎥", setupUrl: "https://marketplace.zoom.us/develop/create", fields: ["client_id", "client_secret"] },
      { id: "google_meet", name: "Google Meet", description: "Video conferencing", logo: "🎦", setupUrl: "https://console.cloud.google.com/", fields: ["client_id", "client_secret"] },
      { id: "google_calendar", name: "Google Calendar", description: "Calendar sync", logo: "📆", setupUrl: "https://console.cloud.google.com/", fields: ["client_id", "client_secret"] },
    ]
  },
  marketing: {
    title: "Marketing & Ads",
    icon: BarChart3,
    color: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/30",
    services: [
      { id: "mailchimp", name: "Mailchimp", description: "Email marketing", logo: "🐵", setupUrl: "https://mailchimp.com/developer/", fields: ["api_key"] },
      { id: "sendgrid", name: "SendGrid", description: "Transactional email", logo: "📧", setupUrl: "https://app.sendgrid.com/settings/api_keys", fields: ["api_key"] },
      { id: "twilio", name: "Twilio", description: "SMS & voice", logo: "📱", setupUrl: "https://console.twilio.com/", fields: ["account_sid", "auth_token"] },
      { id: "google_ads", name: "Google Ads", description: "Search & display ads", logo: "🔍", setupUrl: "https://developers.google.com/google-ads/api/docs/get-started", fields: ["developer_token", "client_id", "client_secret"] },
      { id: "meta_ads", name: "Meta Ads", description: "Facebook & Instagram ads", logo: "📢", setupUrl: "https://developers.facebook.com/", fields: ["app_id", "app_secret", "access_token"] },
      { id: "google_analytics", name: "Google Analytics", description: "Website analytics", logo: "📈", setupUrl: "https://analytics.google.com/", fields: ["measurement_id", "api_secret"] },
    ]
  },
  social: {
    title: "Social Media",
    icon: MessageSquare,
    color: "from-indigo-500/20 to-violet-500/20",
    borderColor: "border-indigo-500/30",
    services: [
      { id: "facebook", name: "Facebook", description: "Pages & Messenger", logo: "f", icon: Facebook, setupUrl: "https://developers.facebook.com/", fields: ["app_id", "app_secret", "page_access_token"] },
      { id: "instagram", name: "Instagram", description: "Posts & Stories", logo: "📷", icon: Instagram, setupUrl: "https://developers.facebook.com/docs/instagram-api/", fields: ["app_id", "app_secret", "access_token"] },
      { id: "tiktok", name: "TikTok", description: "Video content", logo: "🎵", icon: Music, setupUrl: "https://developers.tiktok.com/", fields: ["client_key", "client_secret"] },
      { id: "youtube", name: "YouTube", description: "Video platform", logo: "▶️", icon: Youtube, setupUrl: "https://console.cloud.google.com/", fields: ["api_key", "client_id", "client_secret"] },
      { id: "snapchat", name: "Snapchat", description: "Stories & ads", logo: "👻", icon: Ghost, setupUrl: "https://developers.snap.com/", fields: ["client_id", "client_secret"] },
      { id: "twitter", name: "X (Twitter)", description: "Posts & engagement", logo: "𝕏", icon: Twitter, setupUrl: "https://developer.twitter.com/", fields: ["api_key", "api_secret", "bearer_token"] },
      { id: "linkedin", name: "LinkedIn", description: "Professional network", logo: "in", icon: Linkedin, setupUrl: "https://www.linkedin.com/developers/", fields: ["client_id", "client_secret"] },
    ]
  },
  automation: {
    title: "Automation",
    icon: Zap,
    color: "from-yellow-500/20 to-amber-500/20",
    borderColor: "border-yellow-500/30",
    services: [
      { id: "zapier", name: "Zapier", description: "Connect 5000+ apps", logo: "⚡", setupUrl: "https://zapier.com/developer/", fields: ["api_key"] },
      { id: "make", name: "Make (Integromat)", description: "Visual automation", logo: "🔄", setupUrl: "https://www.make.com/en/api-documentation", fields: ["api_key"] },
    ]
  },
  communication: {
    title: "Team Communication",
    icon: MessageSquare,
    color: "from-teal-500/20 to-cyan-500/20",
    borderColor: "border-teal-500/30",
    services: [
      { id: "slack", name: "Slack", description: "Team messaging", logo: "💬", setupUrl: "https://api.slack.com/apps", fields: ["bot_token", "signing_secret"] },
      { id: "discord", name: "Discord", description: "Community chat", logo: "🎮", setupUrl: "https://discord.com/developers/applications", fields: ["bot_token", "client_id", "client_secret"] },
    ]
  },
  projectManagement: {
    title: "Project Management",
    icon: Briefcase,
    color: "from-slate-500/20 to-gray-500/20",
    borderColor: "border-slate-500/30",
    services: [
      { id: "notion", name: "Notion", description: "Docs & databases", logo: "📓", setupUrl: "https://developers.notion.com/", fields: ["api_key"] },
      { id: "asana", name: "Asana", description: "Task management", logo: "✅", setupUrl: "https://developers.asana.com/", fields: ["access_token"] },
      { id: "trello", name: "Trello", description: "Kanban boards", logo: "📋", setupUrl: "https://developer.atlassian.com/cloud/trello/", fields: ["api_key", "token"] },
    ]
  },
  storage: {
    title: "File Storage",
    icon: FolderOpen,
    color: "from-sky-500/20 to-blue-500/20",
    borderColor: "border-sky-500/30",
    services: [
      { id: "google_drive", name: "Google Drive", description: "Cloud storage", logo: "📁", setupUrl: "https://console.cloud.google.com/", fields: ["client_id", "client_secret"] },
      { id: "dropbox", name: "Dropbox", description: "File sync", logo: "📦", setupUrl: "https://www.dropbox.com/developers", fields: ["app_key", "app_secret"] },
    ]
  },
  crm: {
    title: "CRM",
    icon: Users,
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
    services: [
      { id: "hubspot", name: "HubSpot", description: "Marketing & sales CRM", logo: "🧡", setupUrl: "https://developers.hubspot.com/", fields: ["api_key"] },
      { id: "salesforce", name: "Salesforce", description: "Enterprise CRM", logo: "☁️", setupUrl: "https://developer.salesforce.com/", fields: ["client_id", "client_secret"] },
    ]
  },
  ecommerce: {
    title: "E-commerce & Print",
    icon: ShoppingCart,
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
    services: [
      { id: "shopify", name: "Shopify", description: "Online store", logo: "🛒", setupUrl: "https://shopify.dev/", fields: ["api_key", "api_secret", "store_url"] },
      { id: "woocommerce", name: "WooCommerce", description: "WordPress commerce", logo: "🛍️", setupUrl: "https://woocommerce.github.io/woocommerce-rest-api-docs/", fields: ["consumer_key", "consumer_secret", "store_url"] },
      { id: "printful", name: "Printful", description: "Print-on-demand", logo: "👕", setupUrl: "https://developers.printful.com/", fields: ["api_key"], note: "Great for Bougie Boutique merch" },
      { id: "printify", name: "Printify", description: "Print-on-demand", logo: "🎨", setupUrl: "https://developers.printify.com/", fields: ["api_token"] },
      { id: "etsy", name: "Etsy", description: "Handmade marketplace", logo: "🧶", setupUrl: "https://developers.etsy.com/", fields: ["api_key", "shared_secret"] },
      { id: "square", name: "Square", description: "In-person payments", logo: "⬜", setupUrl: "https://developer.squareup.com/", fields: ["access_token", "application_id"] },
    ]
  },
};

// Field labels for better UX
const FIELD_LABELS: Record<string, string> = {
  api_key: "API Key",
  client_id: "Client ID",
  client_secret: "Client Secret",
  secret_key: "Secret Key",
  publishable_key: "Publishable Key",
  access_token: "Access Token",
  refresh_token: "Refresh Token",
  api_secret: "API Secret",
  app_id: "App ID",
  app_secret: "App Secret",
  bot_token: "Bot Token",
  signing_secret: "Signing Secret",
  bearer_token: "Bearer Token",
  account_sid: "Account SID",
  auth_token: "Auth Token",
  developer_token: "Developer Token",
  integration_key: "Integration Key",
  consumer_key: "Consumer Key",
  consumer_secret: "Consumer Secret",
  store_url: "Store URL",
  page_access_token: "Page Access Token",
  measurement_id: "Measurement ID",
  api_token: "API Token",
  shared_secret: "Shared Secret",
  application_id: "Application ID",
  client_key: "Client Key",
  token: "Token",
};

export default function Integrations() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("accounting");
  const [connectingService, setConnectingService] = useState<any>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [connectedServices, setConnectedServices] = useState<string[]>(["stripe"]); // Stripe already connected

  const handleConnect = (service: any) => {
    setConnectingService(service);
    setCredentials({});
  };

  const handleSaveCredentials = () => {
    // In production, this would save to the backend
    setConnectedServices([...connectedServices, connectingService.id]);
    toast.success(`${connectingService.name} connected successfully!`);
    setConnectingService(null);
    setCredentials({});
  };

  const handleDisconnect = (serviceId: string) => {
    setConnectedServices(connectedServices.filter(id => id !== serviceId));
    toast.success("Integration disconnected");
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <Link2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gold-shimmer">Integrations Hub</h1>
              <p className="text-muted-foreground">
                Connect all your business tools in one place • {connectedServices.length} connected
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-green-400">{connectedServices.length}</div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-blue-400">{Object.values(INTEGRATIONS).reduce((acc, cat) => acc + cat.services.length, 0)}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-purple-400">{Object.keys(INTEGRATIONS).length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-amber-400">∞</div>
              <div className="text-sm text-muted-foreground">Possibilities</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-2 h-auto p-2 bg-card/50 backdrop-blur mb-8">
            {Object.entries(INTEGRATIONS).map(([key, category]) => (
              <TabsTrigger key={key} value={key} className="py-2 px-3">
                <category.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(INTEGRATIONS).map(([key, category]) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.services.map((service) => {
                  const isConnected = connectedServices.includes(service.id);
                  return (
                    <Card 
                      key={service.id} 
                      className={`bg-gradient-to-br ${category.color} ${category.borderColor} transition-all hover:scale-[1.02]`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{service.logo}</span>
                            <div>
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <CardDescription className="text-xs">{service.description}</CardDescription>
                            </div>
                          </div>
                          <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-500" : ""}>
                            {isConnected ? <><CheckCircle2 className="h-3 w-3 mr-1" /> Connected</> : "Not Connected"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {(service as any).note && (
                          <p className="text-xs text-muted-foreground mb-3 italic">💡 {(service as any).note}</p>
                        )}
                        <div className="flex gap-2">
                          {isConnected ? (
                            <>
                              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleConnect(service)}>
                                <Settings className="h-4 w-4 mr-1" /> Configure
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDisconnect(service.id)}>
                                Disconnect
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" className="flex-1" onClick={() => handleConnect(service)}>
                                <Key className="h-4 w-4 mr-1" /> Connect
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={service.setupUrl} target="_blank" rel="noopener">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Connection Dialog */}
        <Dialog open={!!connectingService} onOpenChange={() => setConnectingService(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{connectingService?.logo}</span>
                Connect {connectingService?.name}
              </DialogTitle>
              <DialogDescription>
                Enter your API credentials to connect {connectingService?.name}. 
                <a href={connectingService?.setupUrl} target="_blank" rel="noopener" className="text-primary ml-1 inline-flex items-center gap-1">
                  Get credentials <ExternalLink className="h-3 w-3" />
                </a>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {connectingService?.fields?.map((field: string) => (
                <div key={field}>
                  <Label htmlFor={field}>{FIELD_LABELS[field] || field}</Label>
                  <Input
                    id={field}
                    type={field.includes("secret") || field.includes("token") || field.includes("key") ? "password" : "text"}
                    placeholder={`Enter ${FIELD_LABELS[field] || field}`}
                    value={credentials[field] || ""}
                    onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConnectingService(null)}>Cancel</Button>
              <Button onClick={handleSaveCredentials}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save & Connect
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
