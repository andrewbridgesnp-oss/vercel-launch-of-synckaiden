import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Store, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function ShopifySettings() {
  const [shopDomain, setShopDomain] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const syncProducts = trpc.shopify.syncProducts.useMutation();
  const [storeInfo, setStoreInfo] = useState<any>(null);

  const handleTestConnection = async () => {
    if (!shopDomain || !accessToken) {
      toast.error("Please enter both store domain and access token");
      return;
    }

    try {
      const response = await fetch(`/api/trpc/shopify.getStoreInfo?input=${encodeURIComponent(JSON.stringify({ shopDomain, accessToken }))}`);      
      if (response.ok) {
        const data = await response.json();
        setStoreInfo(data.result.data);
        toast.success(`Connected to store!`);
      } else {
        throw new Error("Connection failed");
      }
    } catch (error) {
      toast.error("Failed to connect. Check your credentials.");
    }
  };

  const handleSyncProducts = async () => {
    if (!shopDomain || !accessToken) {
      toast.error("Please enter both store domain and access token");
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncProducts.mutateAsync({
        shopDomain,
        accessToken,
      });
      toast.success(`Synced ${result.count} products successfully!`);
    } catch (error) {
      toast.error("Failed to sync products. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Store className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-gray-200">Shopify Integration</h1>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-2">
                Connect Your Shopify Store
              </h2>
              <p className="text-gray-400">
                Sync your products and inventory with Kaiden AI for seamless management
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="shopDomain" className="text-gray-300">
                  Store Domain
                </Label>
                <Input
                  id="shopDomain"
                  placeholder="your-store.myshopify.com"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your Shopify store domain (e.g., mystore.myshopify.com)
                </p>
              </div>

              <div>
                <Label htmlFor="accessToken" className="text-gray-300">
                  Admin API Access Token
                </Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="shpat_xxxxxxxxxxxxx"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Get this from your Shopify Admin → Apps → Develop apps
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleTestConnection}
                variant="outline"
                disabled={false}
                className="flex items-center gap-2"
              >
                {false ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Test Connection
              </Button>

              <Button
                onClick={handleSyncProducts}
                disabled={isSyncing || syncProducts.isPending}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                {isSyncing || syncProducts.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Sync Products
              </Button>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-1">
                    How to get your API credentials
                  </h3>
                  <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Go to your Shopify Admin panel</li>
                    <li>Navigate to Settings → Apps and sales channels</li>
                    <li>Click "Develop apps" → "Create an app"</li>
                    <li>Configure Admin API scopes (read_products, write_inventory)</li>
                    <li>Install the app and copy the Admin API access token</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
