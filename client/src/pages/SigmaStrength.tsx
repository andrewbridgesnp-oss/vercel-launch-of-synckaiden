import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PRODUCT_PRICING = {
  "T-Shirt": { base: 18.50, retail: 29.99, sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
  "Hoodie": { base: 34.50, retail: 49.99, sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
  "Tank Top": { base: 16.50, retail: 24.99, sizes: ["S", "M", "L", "XL", "2XL"] },
  "Long Sleeve": { base: 22.50, retail: 34.99, sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
};

const COLORS = [
  { name: "Black", hex: "#000000", available: true },
  { name: "Charcoal", hex: "#36454F", available: true },
  { name: "Navy", hex: "#001f3f", available: true },
  { name: "Olive", hex: "#556B2F", available: true },
  { name: "Burgundy", hex: "#800020", available: true },
  { name: "Steel Gray", hex: "#71797E", available: true },
];

export default function SigmaStrength() {
  const [donationTotal, setDonationTotal] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Sigma Strength Co. - Men's Mental Health Apparel | Synckaiden";
    const targetTotal = 1847.50;
    setDonationTotal(targetTotal);
    
    let current = 0;
    const increment = targetTotal / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetTotal) {
        setAnimatedTotal(targetTotal);
        clearInterval(timer);
      } else {
        setAnimatedTotal(current);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, []);

  const products = [
    { id: 1, name: "Sigma Kindness Grindset", category: "T-Shirt", design: "Lion with heart emblem", image: "/apparel-designs-1.png", available: true },
    { id: 2, name: "NPC Energy? I Think Not", category: "Hoodie", design: "Character level up design", image: "/apparel-designs-1.png", available: true },
    { id: 3, name: "Lowkey Struggling, Highkey Surviving", category: "Hoodie", design: "Mountain peak resilience", image: "/apparel-designs-1.png", available: true },
    { id: 4, name: "Fanum Tax The Negativity", category: "T-Shirt", design: "Trash negativity design", image: "/apparel-designs-1.png", available: true },
    { id: 5, name: "Bussin' Boundaries", category: "Tank Top", design: "Shield protection icon", image: "/apparel-designs-1.png", available: true },
    { id: 6, name: "Understood The Assignment (Self-Care)", category: "Long Sleeve", design: "Checkmark with stars", image: "/apparel-designs-1.png", available: true },
    { id: 7, name: "Main Character Energy", category: "T-Shirt", design: "Star burst confidence", image: "/apparel-designs-1.png", available: true },
    { id: 8, name: "Caught in 4K Being Kind", category: "Hoodie", design: "Camera with heart lens", image: "/apparel-designs-1.png", available: true },
    { id: 9, name: "Ate & Left No Crumbs (Self-Worth)", category: "T-Shirt", design: "Crown and confidence", image: "/apparel-designs-2.png", available: true },
    { id: 10, name: "Unalive The Stigma", category: "Hoodie", design: "Breaking mental health chains", image: "/apparel-designs-2.png", available: true },
    { id: 11, name: "Mental Health Check", category: "T-Shirt", design: "Checklist with strength", image: "/apparel-designs-2.png", available: true },
    { id: 12, name: "Delulu? Nah, Hopeful", category: "Long Sleeve", design: "Optimistic mindset", image: "/apparel-designs-2.png", available: true },
    { id: 13, name: "Hits Different When You're Kind", category: "T-Shirt", design: "Music note compassion", image: "/apparel-designs-2.png", available: true },
    { id: 14, name: "Era: Healing", category: "Hoodie", design: "Transformation journey", image: "/apparel-designs-3.png", available: true },
    { id: 15, name: "Rent Free: Self-Love", category: "T-Shirt", design: "House with heart foundation", image: "/apparel-designs-1.png", available: true },
    { id: 16, name: "W Friend, L Bully", category: "Tank Top", design: "Gaming scoreboard style", image: "/apparel-designs-1.png", available: true },
  ];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }

    const pricing = PRODUCT_PRICING[selectedProduct.category as keyof typeof PRODUCT_PRICING];
    const cartItem = {
      ...selectedProduct,
      size: selectedSize,
      color: selectedColor,
      price: pricing.retail,
    };

    setCart([...cart, cartItem]);
    toast.success("Added to cart!");
    setSelectedProduct(null);
    setSelectedSize("");
    setSelectedColor("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Sigma Strength Co.</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10 relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920')] bg-cover bg-center opacity-5" />
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 rounded-full px-6 py-2 mb-8">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Men's Mental Health Apparel</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Sigma Strength Co.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Premium men's mental health apparel. Strength through vulnerability. Every purchase supports men's mental wellness initiatives.
            </p>

            {/* Donation Counter */}
            <Card className="inline-block p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500/30">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-2">Total Raised for Men's Mental Health</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  ${animatedTotal.toFixed(2)}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Breaking The Silence</h2>
            <p className="text-slate-300 text-lg text-center mb-6">
              Men's mental health matters. Sigma Strength Co. creates bold, unapologetic apparel that normalizes conversations about mental wellness, vulnerability, and emotional strength.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">15%</div>
                <div className="text-slate-400 text-sm">of profits to men's mental health organizations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-500 mb-2">100%</div>
                <div className="text-slate-400 text-sm">premium quality materials and construction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
                <div className="text-slate-400 text-sm">crisis helpline info on every tag</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Shop The Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-square bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.available && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      IN STOCK
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs text-blue-500 font-semibold mb-2">{product.category}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{product.design}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-500">
                      ${PRODUCT_PRICING[product.category as keyof typeof PRODUCT_PRICING].retail}
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">{selectedProduct.name}</DialogTitle>
                <DialogDescription className="text-slate-400">
                  {selectedProduct.design}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-blue-500 mb-2">
                      ${PRODUCT_PRICING[selectedProduct.category as keyof typeof PRODUCT_PRICING].retail}
                    </div>
                    <div className="text-sm text-slate-400">
                      Category: {selectedProduct.category}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Size</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_PRICING[selectedProduct.category as keyof typeof PRODUCT_PRICING].sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            selectedColor === color.name
                              ? 'border-blue-500 scale-110'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-slate-500 text-sm">
            <p>© 2026 Sigma Strength Co. by Synckaiden. All rights reserved.</p>
            <p className="mt-2">Part of the Synckaiden Digital Empire - Empowering Men's Mental Wellness</p>
            <p className="mt-4 text-slate-400">
              Crisis Support: <span className="text-blue-500 font-semibold">988 Suicide & Crisis Lifeline</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
