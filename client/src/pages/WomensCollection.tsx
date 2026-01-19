import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ShoppingBag, ArrowLeft, ShoppingCart } from "lucide-react";
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
  "T-Shirt": { base: 18.50, retail: 29.99, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  "Hoodie": { base: 34.50, retail: 49.99, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  "Tank Top": { base: 16.50, retail: 24.99, sizes: ["XS", "S", "M", "L", "XL"] },
  "Long Sleeve": { base: 22.50, retail: 34.99, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  "Crop Top": { base: 17.50, retail: 27.99, sizes: ["XS", "S", "M", "L", "XL"] },
};

const COLORS = [
  { name: "Rose Pink", hex: "#FF69B4", available: true },
  { name: "Lavender", hex: "#E6E6FA", available: true },
  { name: "Sage Green", hex: "#9DC183", available: true },
  { name: "Sky Blue", hex: "#87CEEB", available: true },
  { name: "Coral", hex: "#FF7F50", available: true },
  { name: "Mint", hex: "#98FF98", available: true },
  { name: "Mauve", hex: "#E0B0FF", available: true },
  { name: "Peach", hex: "#FFDAB9", available: true },
];

export default function WomensCollection() {
  const [donationTotal, setDonationTotal] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Women's Mental Health Collection | Synckaiden";
    const targetTotal = 2341.75;
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
    // Women's Mental Health Awareness Collection
    { id: 1, name: "She Believed She Could", category: "T-Shirt", design: "Empowerment typography", image: "/BOUGIE2.png", available: true },
    { id: 2, name: "Healing is Not Linear", category: "Hoodie", design: "Winding path with flowers", image: "/BOUGIE2.png", available: true },
    { id: 3, name: "Strong Women Support Women", category: "T-Shirt", design: "Interlocked hands circle", image: "/BOUGIE2.png", available: true },
    { id: 4, name: "Mental Health Warrior", category: "Crop Top", design: "Sword with butterfly", image: "/BOUGIE2.png", available: true },
    { id: 5, name: "You Are Enough", category: "Long Sleeve", design: "Minimalist affirmation", image: "/BOUGIE2.png", available: true },
    { id: 6, name: "Therapy Queen", category: "Hoodie", design: "Crown with mental health ribbon", image: "/BOUGIE2.png", available: true },
    { id: 7, name: "Self-Love Club", category: "T-Shirt", design: "Heart with sparkles", image: "/BOUGIE2.png", available: true },
    { id: 8, name: "Anxiety Doesn't Define Me", category: "Tank Top", design: "Calm ocean waves", image: "/BOUGIE2.png", available: true },
    { id: 9, name: "Depression Fighter", category: "Hoodie", design: "Phoenix rising from ashes", image: "/BOUGIE2.png", available: true },
    { id: 10, name: "Normalize Therapy", category: "T-Shirt", design: "Couch with plants", image: "/BOUGIE2.png", available: true },
    { id: 11, name: "Boundaries Are Beautiful", category: "Long Sleeve", design: "Floral border design", image: "/BOUGIE2.png", available: true },
    { id: 12, name: "Mental Health Matters", category: "Hoodie", design: "Bold statement with flowers", image: "/BOUGIE2.png", available: true },
    { id: 13, name: "It's Okay to Not Be Okay", category: "T-Shirt", design: "Gentle reminder typography", image: "/BOUGIE2.png", available: true },
    { id: 14, name: "Self-Care is Not Selfish", category: "Crop Top", design: "Spa/wellness icons", image: "/BOUGIE2.png", available: true },
    { id: 15, name: "Postpartum Warrior", category: "Hoodie", design: "Mother and baby silhouette", image: "/BOUGIE2.png", available: true },
    { id: 16, name: "PTSD Survivor", category: "Long Sleeve", design: "Butterfly transformation", image: "/BOUGIE2.png", available: true },
    { id: 17, name: "You Are Not Alone", category: "T-Shirt", design: "Connected hearts", image: "/BOUGIE2.png", available: true },
    { id: 18, name: "Mindfulness Matters", category: "Tank Top", design: "Meditation pose with lotus", image: "/BOUGIE2.png", available: true },
    { id: 19, name: "Empowered Women Empower Women", category: "Hoodie", design: "Raised fists solidarity", image: "/BOUGIE2.png", available: true },
    { id: 20, name: "Mental Wellness Journey", category: "T-Shirt", design: "Path with milestones", image: "/BOUGIE2.png", available: true },
    { id: 21, name: "Feelings Are Valid", category: "Long Sleeve", design: "Emotional spectrum", image: "/BOUGIE2.png", available: true },
    { id: 22, name: "Break the Stigma", category: "Hoodie", design: "Shattered glass effect", image: "/BOUGIE2.png", available: true },
    { id: 23, name: "Self-Compassion First", category: "T-Shirt", design: "Hands holding heart", image: "/BOUGIE2.png", available: true },
    { id: 24, name: "Women's Mental Health Month", category: "Crop Top", design: "May awareness ribbon", image: "/BOUGIE2.png", available: true },
    { id: 25, name: "Founder Edition - Women's", category: "Hoodie", design: "Premium embroidered logo", image: "/BOUGIE2.png", available: true },
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
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-purple-950 to-pink-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-rose-950/80 backdrop-blur-md border-b border-pink-800/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-pink-400 hover:text-pink-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="text-2xl font-bold text-white">Women's Collection</span>
            </div>
            <Button 
              onClick={handleCheckout}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
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
            src="/bougie-hero.jpg"
            alt="Women's Mental Health Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-12">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-4 drop-shadow-2xl">Women's Collection</h1>
              <p className="text-2xl drop-shadow-lg">Empowering Women Through Mental Wellness</p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="p-8 bg-pink-950/30 backdrop-blur-sm border-pink-800/30 shadow-xl mb-12">
          <div className="flex items-start gap-4">
            <Heart className="w-12 h-12 text-pink-500 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold text-pink-400 mb-4">Our Mission</h2>
              <p className="text-pink-100 text-lg leading-relaxed">
                Supporting women's mental health through fashion that speaks truth. Every purchase funds 
                therapy access, postpartum support programs, and women's mental health initiatives. 
                We believe in breaking the silence, supporting each other, and prioritizing self-care 
                without guilt.
              </p>
            </div>
          </div>
        </Card>

        {/* Products Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-pink-400 mb-2">Shop With Purpose</h2>
            <p className="text-pink-200">
              Beautiful apparel that supports women's mental wellness
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="p-4 bg-rose-900/80 backdrop-blur-sm border-pink-800/30 transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-xs bg-pink-950/80 px-2 py-1 rounded text-pink-300 font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-pink-300 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-pink-400">
                    ${PRODUCT_PRICING[product.category as keyof typeof PRODUCT_PRICING].retail}
                  </span>
                  <ShoppingBag className="w-4 h-4 text-pink-500" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-pink-950/30 backdrop-blur-sm border-pink-800/30 shadow-xl">
            <h2 className="text-2xl font-bold text-pink-400 mb-4">Where Your Money Goes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-pink-300 mb-2">Women's Collection Sales:</h3>
                <ul className="space-y-2 text-pink-200 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-pink-900/50 text-pink-400 font-bold px-2 py-0.5 rounded">10%</span>
                    <span>Women's Mental Health Programs & Postpartum Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-900/50 text-purple-400 font-bold px-2 py-0.5 rounded">90%</span>
                    <span>Operations & Product Development</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Quarterly Impact</h2>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2">
                ${animatedTotal.toFixed(2)}
              </div>
              <p className="text-white/80">Raised for Women's Mental Health</p>
              <p className="text-sm text-white/60 mt-2">Q4 2024 • Updates quarterly</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-white/80 text-center">
                Supporting women's therapy access, postpartum programs, and mental wellness initiatives
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-rose-900 border-pink-800/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-pink-400">{selectedProduct?.name}</DialogTitle>
            <DialogDescription className="text-pink-200">
              {selectedProduct?.design}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-pink-300 mb-2 block">Size</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="bg-rose-800 border-pink-800/30 text-white">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent className="bg-rose-800 border-pink-800/30">
                      {pricing?.sizes.map((size) => (
                        <SelectItem key={size} value={size} className="text-white">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-pink-300 mb-2 block">Color</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedColor === color.name
                            ? "border-pink-500 bg-pink-950/30"
                            : "border-rose-700 bg-rose-800 hover:border-pink-700"
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

                <div className="pt-4 border-t border-pink-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-pink-300">Price:</span>
                    <span className="text-2xl font-bold text-pink-400">${pricing?.retail}</span>
                  </div>
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
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
