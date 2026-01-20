import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// All 20 designs available
const ALL_DESIGNS = [
  { id: 1, name: "NPC Energy? I Think Not", image: "/boutique-designs/cIZb9ZwmabiXzdGXrtD79I_1768858506130_na1fn_L2hvbWUvdWJ1bnR1L2xvZ29zL25wY19lbmVyZ3lfaV90aGlua19ub3RfbG9nbw-Copy.webp" },
  { id: 2, name: "Ohio? Nah, I Choose Peace", image: "/boutique-designs/ohio-Copy.webp" },
  { id: 3, name: "You're Valid, Bestie", image: "/boutique-designs/youre_valid_bestie_logo.png" },
  { id: 4, name: "Era of Healing", image: "/boutique-designs/era_healing_logo.png" },
  { id: 5, name: "W Friend, L Bully", image: "/boutique-designs/w_friend_l_bully_logo.png" },
  { id: 6, name: "Bussin' Boundaries", image: "/boutique-designs/bussin_boundaries_logo.png" },
  { id: 7, name: "Ate and Left No Crumbs", image: "/boutique-designs/ate_and_left_no_crumbs_logo.png" },
  { id: 8, name: "Be the Reason Someone Smiles", image: "/boutique-designs/be_the_reason_someone_smiles_logo.png" },
  { id: 9, name: "Main Character Energy", image: "/boutique-designs/main_character_energy_logo.png" },
  { id: 10, name: "It's Giving Kindness", image: "/boutique-designs/its_giving_kindness_logo.png" },
  { id: 11, name: "Slay the Hate Away", image: "/boutique-designs/slay_the_hate_away_logo.png" },
  { id: 12, name: "Understood the Assignment", image: "/boutique-designs/understood_the_assignment_logo-Copy.png" },
  { id: 13, name: "Fanum Tax the Negativity", image: "/boutique-designs/fanum_tax_the_negativity_logo-Copy.png" },
  { id: 14, name: "Caught in 4K Being Kind", image: "/boutique-designs/caught_in_4k_being_kind_logo.png" },
  { id: 15, name: "Rizz with Respect", image: "/boutique-designs/rizz_with_respect_logo.png" },
  { id: 16, name: "Delulu? Nah, Hopeful", image: "/boutique-designs/delulu_nah_hopeful_logo.png" },
  { id: 17, name: "Hits Different When You're Kind", image: "/boutique-designs/hits_different_when_youre_kind_logo-Copy.png" },
  { id: 18, name: "Sigma Kindness Grindset", image: "/boutique-designs/sigma_kindness_grindset_logo-Copy.png" },
  { id: 19, name: "Rent Free Self-Love", image: "/boutique-designs/rent_free_self_love_logo.png" },
  { id: 20, name: "Lowkey Struggling, Highkey Surviving", image: "/boutique-designs/lowkey_struggling_highkey_surviving_logo.png" },
];

const PRODUCT_TYPES = [
  { id: "tshirt", name: "T-Shirt", price: 24.99, sizes: ["YS", "YM", "YL", "S", "M", "L", "XL", "2XL"] },
  { id: "hoodie", name: "Hoodie", price: 44.99, sizes: ["YS", "YM", "YL", "S", "M", "L", "XL", "2XL"] },
  { id: "hat", name: "Hat", price: 19.99, sizes: ["Youth", "Adult"] },
  { id: "sticker", name: "Sticker", price: 4.99, sizes: ["3x3 inch"] },
];

const COLORS = [
  { name: "Pink", hex: "#ec4899" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Lavender", hex: "#c4b5fd" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#1f2937" },
  { name: "Gray", hex: "#6b7280" },
];

export default function BougieBoutiqueNew() {
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0);
  const [selectedProductType, setSelectedProductType] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Auto-scroll carousel
  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setCurrentDesignIndex((prev) => (prev + 1) % ALL_DESIGNS.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const currentDesign = ALL_DESIGNS[currentDesignIndex];
  const selectedProduct = PRODUCT_TYPES.find(p => p.id === selectedProductType);

  const handlePrevDesign = () => {
    setIsAutoScrolling(false);
    setCurrentDesignIndex((prev) => (prev - 1 + ALL_DESIGNS.length) % ALL_DESIGNS.length);
  };

  const handleNextDesign = () => {
    setIsAutoScrolling(false);
    setCurrentDesignIndex((prev) => (prev + 1) % ALL_DESIGNS.length);
  };

  const handleAddToCart = () => {
    if (!selectedProductType || !selectedColor || !selectedSize) {
      toast.error("Please select all options", {
        description: "Choose product type, color, and size",
      });
      return;
    }

    const item = {
      id: Date.now(),
      design: currentDesign.name,
      designImage: currentDesign.image,
      productType: selectedProduct?.name,
      color: selectedColor,
      size: selectedSize,
      price: selectedProduct?.price || 0,
    };

    setCart([...cart, item]);
    toast.success("Added to cart!", {
      description: `${currentDesign.name} - ${selectedProduct?.name}`,
    });

    // Reset selections
    setSelectedProductType("");
    setSelectedColor("");
    setSelectedSize("");
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowShippingForm(true);
  };

  const handleSubmitCheckout = async () => {
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) {
      toast.error("Please fill in all shipping information");
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          shippingInfo,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Checkout failed", {
        description: "Please try again or contact support",
      });
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative">
      {/* Sparkles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Sparkles 
            key={i}
            className="absolute text-pink-300/40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${0.5 + Math.random()})`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-purple-700 hover:text-purple-900 hover:bg-purple-100">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-pink-300 text-pink-600 hover:bg-pink-50"
            onClick={handleCheckout}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Cart ({cart.length})
          </Button>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Bougie Boutique
          </h1>
          <p className="text-xl text-purple-700 max-w-2xl mx-auto">
            Children's Apparel for Mental Health Awareness
          </p>
          <p className="text-purple-600/80 max-w-3xl mx-auto mt-4">
            Founded by Emilie, age 10 — 10% of profits support mental health initiatives
          </p>
        </div>

        {/* Design Carousel */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl">
            <div className="relative">
              {/* Carousel Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevDesign}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">
                    Design {currentDesignIndex + 1} of {ALL_DESIGNS.length}
                  </p>
                  <h2 className="text-2xl font-bold text-purple-900">
                    {currentDesign.name}
                  </h2>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextDesign}
                  className="rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              {/* Design Preview */}
              <div className="flex justify-center mb-8">
                <img
                  src={currentDesign.image}
                  alt={currentDesign.name}
                  className="w-80 h-80 object-contain rounded-2xl shadow-lg"
                />
              </div>

              {/* Customization Options */}
              <div className="space-y-6">
                {/* Product Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Product Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {PRODUCT_TYPES.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProductType(product.id);
                          setSelectedSize(""); // Reset size when product changes
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedProductType === product.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-gray-600">${product.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Color
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-16 h-16 rounded-full border-4 transition-all ${
                          selectedColor === color.name
                            ? "border-pink-500 scale-110"
                            : "border-gray-200 hover:border-pink-300"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  {selectedColor && (
                    <p className="text-sm text-gray-600 mt-2">Selected: {selectedColor}</p>
                  )}
                </div>

                {/* Size */}
                {selectedProduct && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Size
                    </label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-6 text-lg font-semibold"
                  disabled={!selectedProductType || !selectedColor || !selectedSize}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart - ${selectedProduct?.price || 0}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Mission Statement */}
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8 bg-white/80 backdrop-blur-sm">
            <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700">
              Every purchase supports mental health awareness and anti-bullying initiatives. 
              Together, we're creating a kinder world for kids everywhere.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
