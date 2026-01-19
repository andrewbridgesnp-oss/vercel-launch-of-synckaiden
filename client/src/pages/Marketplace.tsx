import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, TrendingUp, Youtube, Plus, DollarSign, Download, Eye } from "lucide-react";

export default function Marketplace() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState<"ebook" | "crypto_stack" | "youtube_automation" | "template" | "course">("ebook");

  // Mock data - replace with actual tRPC queries
  const products = [
    {
      id: 1,
      name: "Complete Crypto Trading Stack 2024",
      description: "Proven strategies for bull and bear markets with risk management templates",
      category: "crypto_stack",
      price: 9900, // $99.00
      sales: 127,
      revenue: 1257300,
      coverImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400",
    },
    {
      id: 2,
      name: "YouTube Automation Masterclass",
      description: "Complete system for building automated YouTube channels with AI",
      category: "youtube_automation",
      price: 14900,
      sales: 89,
      revenue: 1326100,
      coverImage: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400",
    },
    {
      id: 3,
      name: "The Digital Business Blueprint",
      description: "Step-by-step guide to building a 6-figure online business",
      category: "ebook",
      price: 4900,
      sales: 234,
      revenue: 1146600,
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ebook":
        return <BookOpen className="h-5 w-5" />;
      case "crypto_stack":
        return <TrendingUp className="h-5 w-5" />;
      case "youtube_automation":
        return <Youtube className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ebook":
        return "bg-blue-500/10 text-blue-500";
      case "crypto_stack":
        return "bg-green-500/10 text-green-500";
      case "youtube_automation":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digital Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Sell your eBooks, crypto stacks, and YouTube automation products
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Upload your digital product to start selling
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Product Category</Label>
                <Select value={productCategory} onValueChange={(v: any) => setProductCategory(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ebook">eBook</SelectItem>
                    <SelectItem value="crypto_stack">Crypto Trading Stack</SelectItem>
                    <SelectItem value="youtube_automation">YouTube Automation</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="course">Online Course</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Complete Crypto Trading Stack 2024"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what customers will get..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="99.00"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Product File</Label>
                <Input id="file" type="file" />
                <p className="text-xs text-muted-foreground">
                  Upload PDF, ZIP, or other digital files (max 100MB)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image</Label>
                <Input id="cover" type="file" accept="image/*" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setCreateDialogOpen(false)}>
                Create Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {totalSales} sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Active listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length))}
            </div>
            <p className="text-xs text-muted-foreground">
              Per product
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="ebook">eBooks</TabsTrigger>
          <TabsTrigger value="crypto_stack">Crypto Stacks</TabsTrigger>
          <TabsTrigger value="youtube_automation">YouTube Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  <div className={`absolute top-3 right-3 p-2 rounded-lg ${getCategoryColor(product.category)}`}>
                    {getCategoryIcon(product.category)}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {formatPrice(product.price)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <span>{product.sales} sales</span>
                    </div>
                    <div className="font-medium text-green-600">
                      {formatPrice(product.revenue)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ebook">
          <div className="text-center py-12 text-muted-foreground">
            Filter by eBooks - Coming soon
          </div>
        </TabsContent>

        <TabsContent value="crypto_stack">
          <div className="text-center py-12 text-muted-foreground">
            Filter by Crypto Stacks - Coming soon
          </div>
        </TabsContent>

        <TabsContent value="youtube_automation">
          <div className="text-center py-12 text-muted-foreground">
            Filter by YouTube Automation - Coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
