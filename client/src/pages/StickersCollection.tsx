import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sticker, ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STICKER_PRICING = {
  "Small (3\")": { base: 2.50, retail: 4.99 },
  "Medium (4\")": { base: 3.50, retail: 6.99 },
  "Large (6\")": { base: 5.50, retail: 9.99 },
  "Pack of 5": { base: 12.50, retail: 19.99 },
};

export default function StickersCollection() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Stickers Collection - Mental Health Awareness | Synckaiden";
  }, []);

  const products = [
    // All mental health designs as stickers
    { id: 1, name: "Mental Health Matters", design: "Bold statement sticker", image: "/BOUGIE.png", available: true },
    { id: 2, name: "It's Okay to Not Be Okay", design: "Gentle reminder", image: "/BOUGIE.png", available: true },
    { id: 3, name: "Therapy is Cool", design: "Couch with plants", image: "/BOUGIE.png", available: true },
    { id: 4, name: "Self-Care is Not Selfish", design: "Heart with sparkles", image: "/BOUGIE.png", available: true },
    { id: 5, name: "You Are Not Alone", design: "Connected hands", image: "/BOUGIE.png", available: true },
    { id: 6, name: "Break the Stigma", design: "Shattered chains", image: "/BOUGIE.png", available: true },
    { id: 7, name: "Normalize Therapy", design: "Therapy session icon", image: "/BOUGIE.png", available: true },
    { id: 8, name: "Mental Warrior", design: "Warrior helmet", image: "/BOUGIE.png", available: true },
    { id: 9, name: "Healing is Not Linear", design: "Winding path", image: "/BOUGIE2.png", available: true },
    { id: 10, name: "Progress Not Perfection", design: "Upward arrow", image: "/BOUGIE2.png", available: true },
    { id: 11, name: "Feelings Are Valid", design: "Emotional spectrum", image: "/BOUGIE2.png", available: true },
    { id: 12, name: "Self-Love Club", design: "Heart badge", image: "/BOUGIE2.png", available: true },
    { id: 13, name: "Anxiety Warrior", design: "Calm waves", image: "/BOUGIE2.png", available: true },
    { id: 14, name: "Depression Fighter", design: "Phoenix rising", image: "/BOUGIE2.png", available: true },
    { id: 15, name: "PTSD Survivor", design: "Butterfly transformation", image: "/BOUGIE2.png", available: true },
    { id: 16, name: "Suicide Prevention", design: "Semicolon symbol", image: "/BOUGIE2.png", available: true },
    { id: 17, name: "Mindfulness Matters", design: "Meditation pose", image: "/BOUGIE2.png", available: true },
    { id: 18, name: "Boundaries Are Beautiful", design: "Floral border", image: "/BOUGIE2.png", available: true },
    { id: 19, name: "Strength in Vulnerability", design: "Shield with heart", image: "/BOUGIE2.png", available: true },
    { id: 20, name: "Real Men Talk", design: "Conversation bubbles", image: "/BOUGIE2.png", available: true },
    { id: 21, name: "Strong Women Support Women", design: "Interlocked hands", image: "/BOUGIE2.png", available: true },
    { id: 22, name: "Empowered Women Empower Women", design: "Raised fists", image: "/BOUGIE2.png", available: true },
    { id: 23, name: "Check on Your Strong Friend", design: "Checkmark heart", image: "/BOUGIE2.png", available: true },
    { id: 24, name: "Man Up = Speak Up", design: "Megaphone", image: "/BOUGIE2.png", available: true },
    { id: 25, name: "She Believed She Could", design: "Empowerment typography", image: "/BOUGIE2.png", available: true },
    { id: 26, name: "Brotherhood Heals", design: "Interlocking hands", image: "/BOUGIE.png", available: true },
    { id: 27, name: "Therapy Queen", design: "Crown with ribbon", image: "/BOUGIE.png", available: true },
    { id: 28, name: "Emotional Intelligence", design: "Brain heart fusion", image: "/BOUGIE.png", available: true },
    { id: 29, name: "Normalize Asking for Help", design: "Raised hand", image: "/BOUGIE.png", available: true },
    { id: 30, name: "Mind Over Matter", design: "Brain with lightning", image: "/BOUGIE.png", available: true },
    { id: 31, name: "Mental Health Month", design: "Awareness ribbon", image: "/BOUGIE.png", available: true },
    { id: 32, name: "Postpartum Warrior", design: "Mother baby silhouette", image: "/BOUGIE.png", available: true },
    { id: 33, name: "Self-Compassion First", design: "Hands holding heart", image: "/BOUGIE.png", available: true },
    { id: 34, name: "Mental Wellness Journey", design: "Path with milestones", image: "/BOUGIE.png", available: true },
    { id: 35, name: "Vulnerability is Courage", design: "Lion with open heart", image: "/BOUGIE.png", available: true },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const pricing = STICKER_PRICING[selectedSize as keyof typeof STICKER_PRICING];
    const cartItem = {
      ...selectedProduct,
      size: selectedSize,
      price: pricing.retail,
    };

    setCart([...cart, cartItem]);
    toast.success("Added to cart!");
    setSelectedProduct(null);
    setSelectedSize("");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    toast.success(`Checkout initiated! Total: $${total.toFixed(2)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-950/80 backdrop-blur-md border-b border-purple-800/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-purple-400 hover:text-purple-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Sticker className="w-6 h-6 text-purple-500" />
              <span className="text-2xl font-bold text-white">Stickers Collection</span>
            </div>
            <Button 
              onClick={handleCheckout}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cart.length})
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-purple-400 mb-4">Stickers Collection</h1>
          <p className="text-2xl text-purple-200">Spread Awareness Everywhere</p>
          <p className="text-purple-300 mt-4 max-w-2xl mx-auto">
            High-quality vinyl stickers featuring all our mental health awareness designs. Perfect for laptops, water bottles, journals, and more.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="p-3 bg-indigo-900/80 backdrop-blur-sm border-purple-800/30 transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-purple-300 text-xs mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-purple-400 text-sm">
                    From $4.99
                  </span>
                  <ShoppingBag className="w-3 h-3 text-purple-500" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 bg-purple-950/30 backdrop-blur-sm border-purple-800/30 shadow-xl">
            <div className="flex items-start gap-4">
              <Sticker className="w-12 h-12 text-purple-500 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-purple-400 mb-4">Premium Quality</h2>
                <ul className="space-y-2 text-purple-200">
                  <li>✓ Weather-resistant vinyl material</li>
                  <li>✓ Vibrant, fade-resistant colors</li>
                  <li>✓ Easy peel-and-stick application</li>
                  <li>✓ Dishwasher safe (water bottles)</li>
                  <li>✓ UV protected for outdoor use</li>
                  <li>✓ Die-cut to shape (no background)</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Bulk Discounts</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span>Single Sticker</span>
                <span className="font-bold">$4.99 - $9.99</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <span>Pack of 5</span>
                <span className="font-bold">$19.99</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg border-2 border-white/30">
                <span className="font-semibold">Pack of 10</span>
                <span className="font-bold">$34.99 (30% off!)</span>
              </div>
            </div>
            <p className="text-sm text-white/80 mt-4 text-center">
              Perfect for events, fundraisers, and awareness campaigns
            </p>
          </Card>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-indigo-900 border-purple-800/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-400">{selectedProduct?.name}</DialogTitle>
            <DialogDescription className="text-purple-200">
              {selectedProduct?.design}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-purple-300 mb-2 block">Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STICKER_PRICING).map(([size, pricing]) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedSize === size
                            ? "border-purple-500 bg-purple-950/30"
                            : "border-purple-700 bg-indigo-800 hover:border-purple-700"
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-semibold text-white">{size}</div>
                          <div className="text-2xl font-bold text-purple-400 mt-1">
                            ${pricing.retail}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-800/30">
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                    size="lg"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <p className="text-xs text-purple-300 text-center mt-3">
                    10% of proceeds support mental health awareness programs
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
