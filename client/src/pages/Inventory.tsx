import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Loader2, Edit, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Inventory() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.products.list.useQuery();

  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      utils.products.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setSku("");
    setPrice("");
    setStock("");
  };

  const handleCreate = () => {
    if (!name.trim() || !price) {
      toast.error("Please fill in required fields");
      return;
    }

    createProduct.mutate({
      name,
      description,
      sku: sku || undefined,
      price: Math.round(parseFloat(price) * 100), // Convert to cents
      stock: stock ? parseInt(stock) : 0,
    });
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="" />

      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/tools">
              <Button variant="ghost" className="mb-4">
                ← BACK TO TOOLS
              </Button>
            </Link>
            <h1 className="text-4xl font-bold gold-text">
              INVENTORY MANAGER
            </h1>
            <p className="text-muted-foreground mt-2">
              Sync with Shopify/WooCommerce and manage dropshipping
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="silver-text font-bold">
                <Plus className="mr-2 h-4 w-4" />
                ADD PRODUCT
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-2 border-primary">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold gold-text">
                  ADD NEW PRODUCT
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-bold uppercase">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product name"
                    className="mt-2 border-2 border-input"
                  />
                </div>

                <div>
                  <Label htmlFor="sku" className="text-sm font-bold uppercase">
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SKU-001"
                    className="mt-2 border-2 border-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-bold uppercase">
                      Price ($) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="29.99"
                      className="mt-2 border-2 border-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock" className="text-sm font-bold uppercase">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="100"
                      className="mt-2 border-2 border-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-bold uppercase">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product description..."
                    className="mt-2 border-2 border-input"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={createProduct.isPending}
                  className="w-full silver-text font-bold"
                >
                  {createProduct.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      CREATING...
                    </>
                  ) : (
                    "ADD PRODUCT"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Total Products</p>
                <p className="text-3xl font-bold gold-text mt-1">
                  {products?.length || 0}
                </p>
              </div>
              <Package className="h-8 w-8 gold-text opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Total Value</p>
                <p className="text-3xl font-bold silver-text mt-1">
                  {formatPrice(products?.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0) || 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 silver-text opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Low Stock</p>
                <p className="text-3xl font-bold text-accent mt-1">
                  {products?.filter(p => (p.stock || 0) < 10).length || 0}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-accent opacity-50" />
            </div>
          </Card>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin gold-text" />
          </div>
        ) : products && products.length > 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="bg-card/30">
                    <th className="text-left p-4 text-sm font-bold uppercase">Product</th>
                    <th className="text-left p-4 text-sm font-bold uppercase">SKU</th>
                    <th className="text-right p-4 text-sm font-bold uppercase">Price</th>
                    <th className="text-right p-4 text-sm font-bold uppercase">Stock</th>
                    <th className="text-center p-4 text-sm font-bold uppercase">Status</th>
                    <th className="text-right p-4 text-sm font-bold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-card/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {product.sku || "—"}
                      </td>
                      <td className="p-4 text-right font-semibold silver-text">
                        {formatPrice(product.price)}
                      </td>
                      <td className="p-4 text-right">
                        <span className={product.stock < 10 ? "text-destructive font-bold" : ""}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            product.status === "active"
                              ? "bg-secondary/20 text-secondary"
                              : product.status === "out_of_stock"
                              ? "bg-destructive/20 text-destructive"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {product.status.toUpperCase().replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card className="p-12 bg-card/30 backdrop-blur-sm border-2 border-dashed border-border text-center">
            <Package className="h-16 w-16 gold-text mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">NO PRODUCTS YET</h3>
            <p className="text-muted-foreground mb-6">
              Add your first product to start managing inventory
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="silver-text font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              ADD PRODUCT
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
