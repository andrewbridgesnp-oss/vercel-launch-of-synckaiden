import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe, Plus, ExternalLink, Loader2, ShoppingCart, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Websites() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const utils = trpc.useUtils();
  const { data: websites, isLoading } = trpc.websites.list.useQuery();
  const { data: products } = trpc.payments.getProducts.useQuery();

  const createWebsite = trpc.websites.create.useMutation({
    onSuccess: () => {
      toast.success("Website created successfully!");
      utils.websites.list.invalidate();
      setIsDialogOpen(false);
      setName("");
      setDescription("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createCheckout = trpc.payments.createWebsiteCheckout.useMutation({
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter a website name");
      return;
    }

    createWebsite.mutate({
      name,
      description,
      config: {
        theme: "modern",
        features: ["payments", "contact-form"],
      },
    });
  };

  const handlePurchase = (product: any) => {
    setSelectedProduct(product);
    setIsPurchaseDialogOpen(true);
  };

  const handleCheckout = () => {
    if (!selectedProduct) return;

    createCheckout.mutate({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      priceInCents: selectedProduct.price,
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
            Website Builder
          </h1>
          <p className="text-muted-foreground">
            Generate professional websites with embedded Stripe payments
          </p>
        </div>

        <Tabs defaultValue="my-websites" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="my-websites">My Websites</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Website</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          {/* My Websites Tab */}
          <TabsContent value="my-websites" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="elegant-button bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Website
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-2 border-primary/30">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold cyan-text">Create New Website</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="name">Website Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Business Website"
                        className="mt-1 bg-background/50 border-border/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A professional website for my business..."
                        className="mt-1 bg-background/50 border-border/50"
                        rows={4}
                      />
                    </div>
                    <Button
                      onClick={handleCreate}
                      disabled={createWebsite.isPending}
                      className="w-full elegant-button bg-primary hover:bg-primary/90"
                    >
                      {createWebsite.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Website"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : websites && websites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {websites.map((website) => (
                  <Card key={website.id} className="glass premium-card border-border/50 p-6 hover-lift">
                    <div className="flex items-start justify-between mb-4">
                      <Globe className="h-8 w-8 text-primary" />
                      <Badge variant={website.status === "published" ? "default" : "secondary"}>
                        {website.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{website.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {website.description || "No description provided"}
                    </p>
                    {website.url && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={website.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Website
                        </a>
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass premium-card border-border/50 p-12 text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No websites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first professional website with integrated payments
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="elegant-button bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Website
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Purchase Website Tab */}
          <TabsContent value="purchase" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 cyan-text">Website Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products?.websites.map((product: any) => (
                  <Card key={product.id} className="glass premium-card border-border/50 p-6 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                      <div className="text-3xl font-bold cyan-text mb-4">
                        ${(product.price / 100).toFixed(2)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                    </div>
                    <div className="space-y-2 mb-6 flex-1">
                      {product.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => handlePurchase(product)}
                      className="w-full elegant-button bg-primary hover:bg-primary/90"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Purchase Now
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 cyan-text">Subscription Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products?.subscriptions.map((product: any) => (
                  <Card key={product.id} className="glass premium-card border-border/50 p-6 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                      <div className="text-3xl font-bold cyan-text mb-1">
                        ${(product.price / 100).toFixed(2)}
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                    </div>
                    <div className="space-y-2 mb-6 flex-1">
                      {product.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => handlePurchase(product)}
                      className="w-full elegant-button bg-primary hover:bg-primary/90"
                    >
                      Subscribe
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-bold mb-4">Order History</h3>
              <div className="space-y-3">
                <div className="p-4 bg-background/30 rounded-lg border border-border/30 flex items-center justify-between">
                  <div>
                    <p className="font-medium">No orders yet</p>
                    <p className="text-sm text-muted-foreground">Your purchases will appear here</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.info('Purchase a website package to see orders here!')}>View Packages</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Purchase Confirmation Dialog */}
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogContent className="glass border-2 border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold cyan-text">Confirm Purchase</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4 mt-4">
                <div className="p-4 glass border border-border/50 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedProduct.description}</p>
                  <div className="text-2xl font-bold cyan-text">
                    ${(selectedProduct.price / 100).toFixed(2)}
                    {selectedProduct.interval && <span className="text-sm text-muted-foreground">/{selectedProduct.interval}</span>}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  You'll be redirected to Stripe Checkout to complete your purchase securely.
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsPurchaseDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    disabled={createCheckout.isPending}
                    className="flex-1 elegant-button bg-primary hover:bg-primary/90"
                  >
                    {createCheckout.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Proceed to Checkout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
