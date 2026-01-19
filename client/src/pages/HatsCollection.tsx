import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";
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
  "Baseball Cap": { base: 14.50, retail: 24.99, sizes: ["One Size"] },
  "Beanie": { base: 12.50, retail: 19.99, sizes: ["One Size"] },
  "Trucker Hat": { base: 13.50, retail: 22.99, sizes: ["One Size"] },
  "Dad Hat": { base: 14.50, retail: 24.99, sizes: ["One Size"] },
};

const COLORS = [
  { name: "Black", hex: "#000000", available: true },
  { name: "Navy", hex: "#001f3f", available: true },
  { name: "Gray", hex: "#808080", available: true },
  { name: "White", hex: "#FFFFFF", available: true },
  { name: "Pink", hex: "#FF69B4", available: true },
  { name: "Olive", hex: "#556B2F", available: true },
];

export default function HatsCollection() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Hats Collection - Mental Health Awareness | Synckaiden";
  }, []);

  const products = [
    // Baseball Caps
    { id: 1, name: "Mental Health Matters Cap", category: "Baseball Cap", design: "Embroidered front logo", image: "/BOUGIE.png", available: true },
    { id: 2, name: "Therapy is Cool Cap", category: "Baseball Cap", design: "Side embroidery", image: "/BOUGIE.png", available: true },
    { id: 3, name: "Break the Stigma Cap", category: "Dad Hat", design: "Distressed dad hat style", image: "/BOUGIE.png", available: true },
    { id: 4, name: "Self-Care Club Cap", category: "Baseball Cap", design: "Curved brim classic", image: "/BOUGIE.png", available: true },
    
    // Beanies
    { id: 5, name: "Mental Warrior Beanie", category: "Beanie", design: "Cuffed beanie with patch", image: "/BOUGIE2.png", available: true },
    { id: 6, name: "You Are Not Alone Beanie", category: "Beanie", design: "Embroidered message", image: "/BOUGIE2.png", available: true },
    { id: 7, name: "Healing Journey Beanie", category: "Beanie", design: "Slouchy fit beanie", image: "/BOUGIE2.png", available: true },
    { id: 8, name: "Mental Health Advocate Beanie", category: "Beanie", design: "Ribbed knit beanie", image: "/BOUGIE2.png", available: true },
    
    // Trucker Hats
    { id: 9, name: "Normalize Therapy Trucker", category: "Trucker Hat", design: "Mesh back trucker", image: "/BOUGIE.png", available: true },
    { id: 10, name: "It's Okay Trucker", category: "Trucker Hat", design: "Foam front trucker", image: "/BOUGIE.png", available: true },
    { id: 11, name: "Mental Health Month Trucker", category: "Trucker Hat", design: "Awareness ribbon design", image: "/BOUGIE.png", available: true },
    { id: 12, name: "Strength in Vulnerability Trucker", category: "Trucker Hat", design: "Bold typography", image: "/BOUGIE.png", available: true },
    
    // More Baseball Caps
    { id: 13, name: "Anxiety Warrior Cap", category: "Baseball Cap", design: "Minimal embroidery", image: "/BOUGIE2.png", available: true },
    { id: 14, name: "Depression Fighter Cap", category: "Dad Hat", design: "Vintage wash dad hat", image: "/BOUGIE2.png", available: true },
    { id: 15, name: "PTSD Survivor Cap", category: "Baseball Cap", design: "Semicolon embroidery", image: "/BOUGIE2.png", available: true },
    { id: 16, name: "Suicide Prevention Cap", category: "Baseball Cap", design: "Lifeline ribbon design", image: "/BOUGIE2.png", available: true },
    
    // More Beanies
    { id: 17, name: "Self-Love Beanie", category: "Beanie", design: "Heart patch beanie", image: "/BOUGIE2.png", available: true },
    { id: 18, name: "Mindfulness Beanie", category: "Beanie", design: "Meditation symbol", image: "/BOUGIE2.png", available: true },
    { id: 19, name: "Feelings Are Valid Beanie", category: "Beanie", design: "Woven label beanie", image: "/BOUGIE2.png", available: true },
    { id: 20, name: "Progress Not Perfection Beanie", category: "Beanie", design: "Pom-pom beanie", image: "/BOUGIE2.png", available: true },
  ];

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const pricing = PRODUCT_PRICING[selectedProduct.category as keyof typeof PRODUCT_PRICING];
    const cartItem = {
      ...selectedProduct,
      size: "One Size",
      color: selectedColor,
      price: pricing.retail,
    };

    setCart([...cart, cartItem]);
    toast.success("Added to cart!");
    setSelectedProduct(null);
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
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-yellow-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-950/80 backdrop-blur-md border-b border-amber-800/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-amber-400 hover:text-amber-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-amber-500" />
              <span className="text-2xl font-bold text-white">Hats Collection</span>
            </div>
            <Button 
              onClick={handleCheckout}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
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
          <h1 className="text-6xl font-bold text-amber-400 mb-4">Hats Collection</h1>
          <p className="text-2xl text-amber-200">Wear Your Support with Pride</p>
          <p className="text-amber-300 mt-4 max-w-2xl mx-auto">
            From baseball caps to beanies, every hat spreads mental health awareness and supports vital programs.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="p-4 bg-amber-900/80 backdrop-blur-sm border-amber-800/30 transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-xs bg-amber-950/80 px-2 py-1 rounded text-amber-300 font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-amber-300 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-amber-400">
                    ${PRODUCT_PRICING[product.category as keyof typeof PRODUCT_PRICING].retail}
                  </span>
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <Card className="p-8 bg-amber-950/30 backdrop-blur-sm border-amber-800/30 shadow-xl">
          <div className="flex items-start gap-4">
            <Crown className="w-12 h-12 text-amber-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold text-amber-400 mb-4">Quality & Impact</h2>
              <p className="text-amber-100 text-lg leading-relaxed mb-4">
                Every hat is made with premium materials and embroidered with care. 10% of proceeds support 
                mental health awareness programs, therapy access, and suicide prevention initiatives.
              </p>
              <ul className="space-y-2 text-amber-200">
                <li>✓ High-quality embroidery that lasts</li>
                <li>✓ Adjustable sizing for perfect fit</li>
                <li>✓ Comfortable all-day wear</li>
                <li>✓ Supports mental health programs</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-amber-900 border-amber-800/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-400">{selectedProduct?.name}</DialogTitle>
            <DialogDescription className="text-amber-200">
              {selectedProduct?.design}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-amber-300 mb-2 block">Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedColor === color.name
                            ? "border-amber-500 bg-amber-950/30"
                            : "border-amber-700 bg-amber-800 hover:border-amber-700"
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

                <div className="pt-4 border-t border-amber-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-amber-300">Price:</span>
                    <span className="text-2xl font-bold text-amber-400">${pricing?.retail}</span>
                  </div>
                  <p className="text-sm text-amber-200 mb-4">One Size Fits Most (Adjustable)</p>
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
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
