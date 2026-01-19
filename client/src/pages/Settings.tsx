import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, ShoppingBag, RefreshCw, CheckCircle2, XCircle, Loader2, AlertCircle, Shield, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Settings() {
  const { user } = useAuth();
  const [shopifyDomain, setShopifyDomain] = useState("");
  const [shopifyToken, setShopifyToken] = useState("");
  const [wooUrl, setWooUrl] = useState("");
  const [wooKey, setWooKey] = useState("");
  const [wooSecret, setWooSecret] = useState("");
  const [sendgridKey, setSendgridKey] = useState("");
  const [sendgridEmail, setSendgridEmail] = useState("");
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioToken, setTwilioToken] = useState("");
  const [twilioPhone, setTwilioPhone] = useState("");

  const utils = trpc.useUtils();

  const syncShopify = trpc.integrations.syncShopify.useMutation({
    onSuccess: (data) => {
      toast.success(`Shopify sync complete! ${data.synced} products synced.`);
      if (data.errors > 0) {
        toast.warning(`${data.errors} products failed to sync.`);
      }
      utils.products.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Shopify sync failed: ${error.message}`);
    },
  });

  const syncWooCommerce = trpc.integrations.syncWooCommerce.useMutation({
    onSuccess: (data) => {
      toast.success(`WooCommerce sync complete! ${data.synced} products synced.`);
      if (data.errors > 0) {
        toast.warning(`${data.errors} products failed to sync.`);
      }
      utils.products.list.invalidate();
    },
    onError: (error) => {
      toast.error(`WooCommerce sync failed: ${error.message}`);
    },
  });

  const saveSendgrid = trpc.credentials.save.useMutation({
    onSuccess: () => {
      toast.success("SendGrid credentials saved successfully");
    },
    onError: (error) => {
      toast.error(`Failed to save SendGrid credentials: ${error.message}`);
    },
  });

  const saveTwilio = trpc.credentials.save.useMutation({
    onSuccess: () => {
      toast.success("Twilio credentials saved successfully");
    },
    onError: (error) => {
      toast.error(`Failed to save Twilio credentials: ${error.message}`);
    },
  });

  const handleShopifySync = () => {
    if (!shopifyDomain.trim() || !shopifyToken.trim()) {
      toast.error("Please enter both Shopify domain and access token");
      return;
    }

    syncShopify.mutate({
      shopDomain: shopifyDomain,
      accessToken: shopifyToken,
    });
  };

  const handleWooCommerceSync = () => {
    if (!wooUrl.trim() || !wooKey.trim() || !wooSecret.trim()) {
      toast.error("Please enter all WooCommerce credentials");
      return;
    }

    syncWooCommerce.mutate({
      storeUrl: wooUrl,
      consumerKey: wooKey,
      consumerSecret: wooSecret,
    });
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tools">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
              ← Back to Tools
            </Button>
          </Link>
          <h1 className="text-4xl font-bold cyan-shimmer mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage integrations and configure your business tools
          </p>
        </div>

        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign APIs</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Security Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Voice Authentication Toggle */}
                <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/50">
                  <div className="flex items-start gap-3 flex-1">
                    <Lock className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        Voice Authentication Lock
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Require voice verification to access the platform. You must enroll your voiceprint first.
                      </p>
                      {user?.voiceprintEnrolled ? (
                        <p className="text-xs text-green-400 mt-2">
                          ✓ Voiceprint enrolled
                        </p>
                      ) : (
                        <p className="text-xs text-yellow-400 mt-2">
                          ⚠ Voiceprint not enrolled - visit /voice-auth to enroll
                        </p>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={user?.voiceAuthRequired || false}
                    onCheckedChange={(enabled) => {
                      if (enabled && !user?.voiceprintEnrolled) {
                        toast.error("Please enroll your voiceprint first at /voice-auth");
                        return;
                      }
                      trpc.auth.updateVoiceAuthSetting.useMutation({
                        onSuccess: () => {
                          toast.success("Voice authentication settings updated");
                          utils.auth.me.invalidate();
                        },
                        onError: () => toast.error("Failed to update settings"),
                      }).mutate({ enabled });
                    }}
                  />
                </div>

                {/* Voiceprint Status */}
                <div className="p-4 bg-background/30 rounded-lg border border-border/50">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-purple-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        Voiceprint Status
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {user?.voiceprintEnrolled
                          ? "Your voice is enrolled and can be used for authentication"
                          : "No voiceprint enrolled yet"}
                      </p>
                      <Link href="/voice-auth">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-primary/10 hover:bg-primary/20 border-primary/30"
                        >
                          {user?.voiceprintEnrolled ? "Re-enroll Voice" : "Enroll Voice"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            {/* Shopify Integration */}
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg glass border border-border/30">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Shopify</h2>
                    <p className="text-sm text-muted-foreground">
                      Sync products from your Shopify store
                    </p>
                  </div>
                </div>
                {syncShopify.isSuccess && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="shopify-domain">Store Domain</Label>
                  <Input
                    id="shopify-domain"
                    value={shopifyDomain}
                    onChange={(e) => setShopifyDomain(e.target.value)}
                    placeholder="mystore.myshopify.com"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Shopify store domain (without https://)
                  </p>
                </div>

                <div>
                  <Label htmlFor="shopify-token">Access Token</Label>
                  <Input
                    id="shopify-token"
                    type="password"
                    value={shopifyToken}
                    onChange={(e) => setShopifyToken(e.target.value)}
                    placeholder="shpat_••••••••••••••••"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate an access token from your Shopify admin panel
                  </p>
                </div>

                <Button
                  onClick={handleShopifySync}
                  disabled={syncShopify.isPending}
                  className="w-full elegant-button bg-primary hover:bg-primary/90"
                >
                  {syncShopify.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing Products...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Shopify Products
                    </>
                  )}
                </Button>

                {syncShopify.isSuccess && (
                  <div className="p-3 rounded-lg glass border border-primary/30 flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">Sync Successful</p>
                      <p className="text-muted-foreground">
                        {syncShopify.data?.synced} products synced
                        {syncShopify.data?.errors ? `, ${syncShopify.data.errors} errors` : ""}
                      </p>
                    </div>
                  </div>
                )}

                {syncShopify.isError && (
                  <div className="p-3 rounded-lg glass border border-destructive/30 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-destructive">Sync Failed</p>
                      <p className="text-muted-foreground">{syncShopify.error.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* WooCommerce Integration */}
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg glass border border-border/30">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">WooCommerce</h2>
                    <p className="text-sm text-muted-foreground">
                      Sync products from your WooCommerce store
                    </p>
                  </div>
                </div>
                {syncWooCommerce.isSuccess && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="woo-url">Store URL</Label>
                  <Input
                    id="woo-url"
                    value={wooUrl}
                    onChange={(e) => setWooUrl(e.target.value)}
                    placeholder="https://mystore.com"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your WooCommerce store URL (with https://)
                  </p>
                </div>

                <div>
                  <Label htmlFor="woo-key">Consumer Key</Label>
                  <Input
                    id="woo-key"
                    value={wooKey}
                    onChange={(e) => setWooKey(e.target.value)}
                    placeholder="ck_••••••••••••••••"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                </div>

                <div>
                  <Label htmlFor="woo-secret">Consumer Secret</Label>
                  <Input
                    id="woo-secret"
                    type="password"
                    value={wooSecret}
                    onChange={(e) => setWooSecret(e.target.value)}
                    placeholder="cs_••••••••••••••••"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate API keys from WooCommerce → Settings → Advanced → REST API
                  </p>
                </div>

                <Button
                  onClick={handleWooCommerceSync}
                  disabled={syncWooCommerce.isPending}
                  className="w-full elegant-button bg-primary hover:bg-primary/90"
                >
                  {syncWooCommerce.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing Products...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync WooCommerce Products
                    </>
                  )}
                </Button>

                {syncWooCommerce.isSuccess && (
                  <div className="p-3 rounded-lg glass border border-primary/30 flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">Sync Successful</p>
                      <p className="text-muted-foreground">
                        {syncWooCommerce.data?.synced} products synced
                        {syncWooCommerce.data?.errors ? `, ${syncWooCommerce.data.errors} errors` : ""}
                      </p>
                    </div>
                  </div>
                )}

                {syncWooCommerce.isError && (
                  <div className="p-3 rounded-lg glass border border-destructive/30 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-destructive">Sync Failed</p>
                      <p className="text-muted-foreground">{syncWooCommerce.error.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Campaign APIs Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* SendGrid Email */}
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg glass border border-border/30">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">SendGrid</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure email campaign delivery
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="sendgrid-key">API Key</Label>
                  <Input
                    id="sendgrid-key"
                    type="password"
                    value={sendgridKey}
                    onChange={(e) => setSendgridKey(e.target.value)}
                    placeholder="SG.••••••••••••••••"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your API key from <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SendGrid Dashboard</a>
                  </p>
                </div>

                <div>
                  <Label htmlFor="sendgrid-from">From Email</Label>
                  <Input
                    id="sendgrid-from"
                    type="email"
                    value={sendgridEmail}
                    onChange={(e) => setSendgridEmail(e.target.value)}
                    placeholder="noreply@yourdomain.com"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Verified sender email address
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => saveSendgrid.mutate({ 
                      service: "sendgrid", 
                      apiKey: sendgridKey, 
                      fromEmail: sendgridEmail 
                    })}
                    disabled={saveSendgrid.isPending || !sendgridKey.trim() || !sendgridEmail.trim()}
                  >
                    {saveSendgrid.isPending ? "Saving..." : "Save SendGrid Settings"}
                  </Button>
                  <Button variant="outline">
                    Test Connection
                  </Button>
                </div>
              </div>
            </Card>

            {/* Twilio SMS */}
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg glass border border-border/30">
                    <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Twilio</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure SMS campaign delivery
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="twilio-sid">Account SID</Label>
                  <Input
                    id="twilio-sid"
                    value={twilioSid}
                    onChange={(e) => setTwilioSid(e.target.value)}
                    placeholder="AC••••••••••••••••"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                </div>

                <div>
                  <Label htmlFor="twilio-token">Auth Token</Label>
                  <Input
                    id="twilio-token"
                    type="password"
                    value={twilioToken}
                    onChange={(e) => setTwilioToken(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                </div>

                <div>
                  <Label htmlFor="twilio-phone">Phone Number</Label>
                  <Input
                    id="twilio-phone"
                    value={twilioPhone}
                    onChange={(e) => setTwilioPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="mt-1 bg-background/50 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Twilio phone number (with country code)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => saveTwilio.mutate({ 
                      service: "twilio", 
                      apiSecret: twilioSid, 
                      apiKey: twilioToken, 
                      fromPhone: twilioPhone 
                    })}
                    disabled={saveTwilio.isPending || !twilioSid.trim() || !twilioToken.trim() || !twilioPhone.trim()}
                  >
                    {saveTwilio.isPending ? "Saving..." : "Save Twilio Settings"}
                  </Button>
                  <Button variant="outline">
                    Test Connection
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-bold mb-6">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label>Business Name</Label>
                  <Input placeholder="Syndica Solutions" className="mt-1 bg-background/50" />
                </div>
                <div>
                  <Label>Business Email</Label>
                  <Input placeholder="contact@syndicasolutions.com" className="mt-1 bg-background/50" />
                </div>
                <div>
                  <Label>Time Zone</Label>
                  <select className="w-full p-2 rounded border border-border/50 bg-background/50 mt-1">
                    <option>Eastern (ET)</option>
                    <option>Central (CT)</option>
                    <option>Mountain (MT)</option>
                    <option>Pacific (PT)</option>
                  </select>
                </div>
                <div>
                  <Label>Date Format</Label>
                  <select className="w-full p-2 rounded border border-border/50 bg-background/50 mt-1">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <Button onClick={() => toast.success('Settings saved!')}>Save Settings</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-bold mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive urgent alerts via SMS</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                  <div>
                    <p className="font-medium">Daily Sales Report (11:30 PM)</p>
                    <p className="text-sm text-muted-foreground">Get daily gross/net sales summary</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                  <div>
                    <p className="font-medium">New Lead Alerts</p>
                    <p className="text-sm text-muted-foreground">Instant notification for new leads</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">Alert when payment is processed</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button onClick={() => toast.success('Preferences saved!')}>Save Preferences</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
