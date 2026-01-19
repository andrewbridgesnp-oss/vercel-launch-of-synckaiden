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
    // Men's Mental Health Awareness Collection
    { id: 1, name: "Strength in Vulnerability", category: "Hoodie", design: "Bold typography with shield emblem", image: "/BOUGIE.png", available: true },
    { id: 2, name: "Real Men Talk", category: "T-Shirt", design: "Conversation bubble design", image: "/BOUGIE.png", available: true },
    { id: 3, name: "Break the Stigma", category: "Hoodie", design: "Shattered chains graphic", image: "/BOUGIE.png", available: true },
    { id: 4, name: "Mental Warrior", category: "T-Shirt", design: "Warrior helmet with mental health ribbon", image: "/BOUGIE.png", available: true },
    { id: 5, name: "It's Okay Not to Be Okay", category: "Long Sleeve", design: "Minimalist text design", image: "/BOUGIE.png", available: true },
    { id: 6, name: "Therapy is Strength", category: "Hoodie", design: "Dumbbell with brain icon", image: "/BOUGIE.png", available: true },
    { id: 7, name: "Mind Over Matter", category: "T-Shirt", design: "Brain with lightning bolts", image: "/BOUGIE.png", available: true },
    { id: 8, name: "Brotherhood Heals", category: "Hoodie", design: "Interlocking hands graphic", image: "/BOUGIE.png", available: true },
    { id: 9, name: "Normalize Asking for Help", category: "T-Shirt", design: "Raised hand solidarity", image: "/BOUGIE2.png", available: true },
    { id: 10, name: "Healing is Not Linear", category: "Long Sleeve", design: "Winding path graphic", image: "/BOUGIE2.png", available: true },
    { id: 11, name: "Check on Your Strong Friend", category: "Hoodie", design: "Checkmark with heart", image: "/BOUGIE2.png", available: true },
    { id: 12, name: "Mental Health Matters", category: "T-Shirt", design: "Bold statement typography", image: "/BOUGIE2.png", available: true },
    { id: 13, name: "Vulnerability is Courage", category: "Hoodie", design: "Lion with open heart", image: "/BOUGIE2.png", available: true },
    { id: 14, name: "Man Up = Speak Up", category: "T-Shirt", design: "Megaphone graphic", image: "/BOUGIE2.png", available: true },
    { id: 15, name: "Progress Not Perfection", category: "Long Sleeve", design: "Upward arrow with steps", image: "/BOUGIE2.png", available: true },
    { id: 16, name: "Emotional Intelligence", category: "Hoodie", design: "Brain with heart fusion", image: "/BOUGIE2.png", available: true },
    { id: 17, name: "Self-Care is Masculine", category: "T-Shirt", design: "Grooming tools with strength icon", image: "/BOUGIE2.png", available: true },
    { id: 18, name: "You Are Not Alone", category: "Hoodie", design: "Connected figures silhouette", image: "/BOUGIE2.png", available: true },
    { id: 19, name: "Feelings Are Valid", category: "T-Shirt", design: "Emotional spectrum design", image: "/BOUGIE2.png", available: true },
    { id: 20, name: "Suicide Prevention Advocate", category: "Long Sleeve", design: "Semicolon with lifeline", image: "/BOUGIE2.png", available: true },
    { id: 21, name: "Depression Warrior", category: "Hoodie", design: "Sword breaking through darkness", image: "/BOUGIE2.png", available: true },
    { id: 22, name: "Anxiety Doesn't Define Me", category: "T-Shirt", design: "Calm waves over storm", image: "/BOUGIE2.png", available: true },
    { id: 23, name: "PTSD Survivor", category: "Hoodie", design: "Phoenix rising design", image: "/BOUGIE2.png", available: true },
    { id: 24, name: "Men's Mental Health Month", category: "T-Shirt", design: "June awareness ribbon", image: "/BOUGIE2.png", available: true },
    { id: 25, name: "Sigma Strength Founder Edition", category: "Hoodie", design: "Premium embroidered logo", image: "/BOUGIE2.png", available: true },
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

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    toast.success(`Checkout initiated! Total: $${total.toFixed(2)}`);
  };

  const pricing = selectedProduct ? PRODUCT_PRICING[selectedProduct.category as keyof typeof PRODUCT_PRICING] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-800/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-cyan-500" />
              <span className="text-2xl font-bold text-white">Sigma Strength Co.</span>
            </div>
            <Button 
              onClick={handleCheckout}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cart.length})
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Hero Banner */}
        <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-2xl mb-12">
          <img
            src="/sigma-hero.jpg"
            alt="Sigma Strength Co. - Men's Mental Health Awareness Apparel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-12">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-4 drop-shadow-2xl">Sigma Strength Co.</h1>
              <p className="text-2xl drop-shadow-lg">Real Men Talk About Mental Health</p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="p-8 bg-cyan-950/30 backdrop-blur-sm border-cyan-800/30 shadow-xl mb-12">
          <div className="flex items-start gap-4">
            <Shield className="w-12 h-12 text-cyan-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">Our Mission</h2>
              <p className="text-cyan-100 text-lg leading-relaxed">
                Sigma Strength Co. breaks the silence around men's mental health. Every purchase supports 
                mental health programs specifically designed for men, funding therapy access, support groups, 
                and suicide prevention initiatives. We believe vulnerability is strength, and asking for help 
                is the most masculine thing a man can do.
              </p>
            </div>
          </div>
        </Card>

        {/* Products Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Shop With Purpose</h2>
            <p className="text-cyan-200">
              Premium apparel that starts conversations and saves lives
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="p-4 bg-slate-900/80 backdrop-blur-sm border-cyan-800/30 transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-xs bg-cyan-950/80 px-2 py-1 rounded text-cyan-300 font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-cyan-300 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-cyan-400">
                    ${PRODUCT_PRICING[product.category as keyof typeof PRODUCT_PRICING].retail}
                  </span>
                  <ShoppingBag className="w-4 h-4 text-cyan-500" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-cyan-950/30 backdrop-blur-sm border-cyan-800/30 shadow-xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Where Your Money Goes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-cyan-300 mb-2">Sigma Strength Sales:</h3>
                <ul className="space-y-2 text-cyan-200 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-cyan-900/50 text-cyan-400 font-bold px-2 py-0.5 rounded">10%</span>
                    <span>Men's Mental Health Programs & Suicide Prevention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-900/50 text-blue-400 font-bold px-2 py-0.5 rounded">90%</span>
                    <span>Operations & Product Development</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Quarterly Impact</h2>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2">
                ${animatedTotal.toFixed(2)}
              </div>
              <p className="text-white/80">Raised for Men's Mental Health</p>
              <p className="text-sm text-white/60 mt-2">Q4 2024 • Updates quarterly</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-white/80 text-center">
                Supporting men's therapy access, support groups, and suicide prevention hotlines nationwide
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-slate-900 border-cyan-800/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-cyan-400">{selectedProduct?.name}</DialogTitle>
            <DialogDescription className="text-cyan-200">
              {selectedProduct?.design}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-cyan-300 mb-2 block">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="bg-slate-800 border-cyan-800/30 text-white">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-cyan-800/30">
                      {pricing?.sizes.map((size) => (
                        <SelectItem key={size} value={size} className="text-white">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-cyan-300 mb-2 block">Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedColor === color.name
                            ? "border-cyan-500 bg-cyan-950/30"
                            : "border-slate-700 bg-slate-800 hover:border-cyan-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white/20" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-sm text-white">{color.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-cyan-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-cyan-300">Price:</span>
                    <span className="text-2xl font-bold text-cyan-400">${pricing?.retail}</span>
                  </div>
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    size="lg"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
