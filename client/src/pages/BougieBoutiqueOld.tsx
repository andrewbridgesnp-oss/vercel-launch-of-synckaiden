import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, ShoppingBag, Users, ArrowLeft, Check, X, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
// Guest checkout - no auth required
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

// Printful base costs + 30% markup for quality products
const PRODUCT_PRICING = {
  "T-Shirt": { base: 18.50, retail: 24.99, sizes: ["YS", "YM", "YL", "S", "M", "L", "XL", "2XL"] },
  "Hoodie": { base: 34.50, retail: 44.99, sizes: ["YS", "YM", "YL", "S", "M", "L", "XL", "2XL"] },
  "Sweatshirt": { base: 26.50, retail: 34.99, sizes: ["YS", "YM", "YL", "S", "M", "L", "XL", "2XL"] },
  "Hat": { base: 15.50, retail: 19.99, sizes: ["Youth", "Adult"] },
  "Trucker Hat": { base: 12.50, retail: 16.99, sizes: ["One Size"] },
  "Sticker": { base: 2.50, retail: 4.99, sizes: ["3x3 inch"] },
};

const COLORS = [
  { name: "Pink", hex: "#ec4899", available: true },
  { name: "Purple", hex: "#a855f7", available: true },
  { name: "Lavender", hex: "#c4b5fd", available: true },
  { name: "White", hex: "#ffffff", available: true },
  { name: "Black", hex: "#1f2937", available: true },
  { name: "Gray", hex: "#6b7280", available: true },
];

export default function BougieBoutique() {
  
  const [donationTotal, setDonationTotal] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  // Animate the counter on load
  useEffect(() => {
    const targetTotal = 247.50;
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

  // ALL DESIGNS - Daily rotation system picks 12 products per day
  const allDesigns = [
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

  // Daily rotation: picks 12 designs based on today's date
  const getDailyProducts = () => {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    
    const shuffled = [...allDesigns].sort((a, b) => {
      const hashA = (a.id + today).split('').reduce((acc, char) => acc + char.charCodeAt(0), seed);
      const hashB = (b.id + today).split('').reduce((acc, char) => acc + char.charCodeAt(0), seed);
      return hashA - hashB;
    });
    
    const selected = shuffled.slice(0, 12);
    const categories = ["T-Shirt", "T-Shirt", "T-Shirt", "Hoodie", "Hoodie", "Hoodie", "Hat", "Hat", "Hat", "Sticker", "Sticker", "Sticker"];
    
    return selected.map((design, i) => ({
      id: design.id * 100 + i,
      name: design.name,
      category: categories[i],
      design: design.name,
      image: design.image,
      available: true,
      price: PRODUCT_PRICING[categories[i] as keyof typeof PRODUCT_PRICING]?.retail || 24.99,
      sizes: PRODUCT_PRICING[categories[i] as keyof typeof PRODUCT_PRICING]?.sizes || ["S", "M", "L", "XL"],
    }));
  };

  const products = getDailyProducts();

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select options", {
        description: "Choose a size and color before adding to cart",
      });
      return;
    }

    const cartItem = {
      ...selectedProduct,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    };

    setCart([...cart, cartItem]);
    toast.success("Added to cart!", {
      description: `${selectedProduct.name} (${selectedSize}, ${selectedColor})`,
    });
    setSelectedProduct(null);
    setSelectedSize("");
    setSelectedColor("");
  };

  const createGuestCheckout = trpc.stripe.createGuestCheckout.useMutation();
  const createPrintfulOrder = trpc.printful.createDropshipOrder.useMutation();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty", {
        description: "Add some items before checking out",
      });
      return;
    }

    try {
      toast.loading("Creating checkout...", { id: "checkout" });

      // Calculate total
      const cartTotal = cart.reduce((sum, item) => {
        const pricing = PRODUCT_PRICING[item.category as keyof typeof PRODUCT_PRICING];
        return sum + (pricing?.retail || 24.99) * 100;
      }, 0);

      // Create product description
      const productNames = cart.map(item => `${item.name} (${item.size}, ${item.color})`).join(", ");

      // Use guest checkout - no login required!
      const result = await createGuestCheckout.mutateAsync({
        productName: `Bougie Boutique Order (${cart.length} items)`,
        productDescription: productNames,
        priceInCents: Math.round(cartTotal),
        tenant: "emilie",
        cartItems: cart.map(item => ({
          name: item.name,
          category: item.category,
          size: item.size,
          color: item.color,
          price: PRODUCT_PRICING[item.category as keyof typeof PRODUCT_PRICING]?.retail || 24.99,
        })),
      });

      if (result.url) {
        toast.dismiss("checkout");
        window.location.href = result.url;
      } else {
        toast.error("Failed to create checkout", { id: "checkout" });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.", { id: "checkout" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#f5d0fe] relative overflow-hidden">
      {/* Sparkle decorations */}
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
        {/* Header with cart */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-purple-700 hover:text-purple-900 hover:bg-purple-100">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Kaiden
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

        {/* Hero Video Banner */}
        <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-2xl mb-12">
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={(e) => {
              const videoElement = e.currentTarget;
              videoElement.playbackRate = 0.30;
            }}
            className="w-full h-full object-cover"
          >
            <source src="/bougie-hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-12">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-4 drop-shadow-2xl">Bougie Boutique</h1>
              <p className="text-2xl drop-shadow-lg">Empowering Kids Through Fashion</p>
            </div>
          </div>
        </div>

        {/* Bougie Boutique Logo Video */}
        <div className="text-center mb-12">
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={(e) => {
              const videoElement = e.currentTarget;
              videoElement.playbackRate = 0.25;
            }}
            className="w-72 h-72 mx-auto rounded-3xl shadow-2xl shadow-pink-500/50 object-cover"
          >
            <source src="/bougie-logo.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Section with NEW logo */}
        <div className="text-center mb-12">
          <img 
            src="/bougie-boutique-logo-final7.png" 
            alt="Bougie Boutique" 
            className="w-72 h-72 mx-auto mb-6 rounded-3xl shadow-2xl shadow-pink-300/50 object-cover"
          />
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Bougie Boutique
          </h1>
          <p className="text-xl text-purple-700 max-w-2xl mx-auto mb-4">
            Children's Apparel for Mental Health Awareness
          </p>
          <p className="text-purple-600/80 max-w-3xl mx-auto">
            Founded by Emilie, age 10 — a young advocate who stands against bullying 
            and understands how overwhelming emotions can be. 
            <strong> This is to help those like her be heard.</strong>
          </p>
        </div>

        {/* Mission & Donation Counter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Mission Card - Updated donation breakdown */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-pink-500" />
              <h2 className="text-2xl font-bold text-purple-800">Where Your Purchase Goes</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-800 mb-2">Bougie Boutique Sales:</h3>
                <ul className="space-y-2 text-purple-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-600 font-bold px-2 py-0.5 rounded">10%</span>
                    <span>Children's Mental Health Programs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-600 font-bold px-2 py-0.5 rounded">90%</span>
                    <span>Operations & Product Development</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-pink-200">
                <h3 className="font-semibold text-purple-800 mb-2">Kaiden AI Sales:</h3>
                <ul className="space-y-2 text-purple-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-pink-100 text-pink-600 font-bold px-2 py-0.5 rounded">10%</span>
                    <span>Bougie Boutique for Mental Health Awareness & College Funds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-600 font-bold px-2 py-0.5 rounded">90%</span>
                    <span>Kaiden AI Operations & Development</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Donation Counter */}
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Quarterly Impact</h2>
            </div>
            <div className="text-center py-4">
              <div className="text-5xl font-bold mb-2">
                ${animatedTotal.toFixed(2)}
              </div>
              <p className="text-white/80">Raised for Children's Mental Health</p>
              <p className="text-sm text-white/60 mt-2">Q4 2024 • Updates quarterly</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm text-white/80 text-center">
                Supporting our local YMCA after-school programs, 
                with hopes of nationwide expansion
              </p>
            </div>
          </Card>
        </div>

        {/* Product Showcase Video */}
        <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-2xl mb-12 max-w-6xl mx-auto">
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={(e) => {
              const videoElement = e.currentTarget;
              videoElement.playbackRate = 0.30;
            }}
            className="w-full h-full object-cover"
          >
            <source src="/bougie-products-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/40 to-purple-900/40 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <h2 className="text-5xl font-bold mb-4 drop-shadow-2xl">Premium Quality Apparel</h2>
              <p className="text-xl drop-shadow-lg">Soft, comfortable, and built to last</p>
            </div>
          </div>
        </div>

        {/* Emilie's Story */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-800 mb-4 text-center">Emilie's Story</h2>
          <div className="prose prose-purple max-w-none text-purple-700">
            <p>
              Emilie is 10 years old and knows firsthand how overwhelming emotions can be. 
              She stands firmly against bullying and believes every kid deserves to feel 
              safe, supported, and heard.
            </p>
            <p>
              Her dream is to become a special education teacher so she can help other kids 
              who feel different, misunderstood, or alone. Emilie wants to be a good human being.
            </p>
            <p>
              <strong>Bougie Boutique</strong> is Emilie's way of spreading that message. 
              Every piece of clothing says: <em>You matter. You're not alone. 
              Your feelings are valid.</em>
            </p>
            <p className="text-center font-semibold text-lg mt-6">
              "Every child deserves to be heard."
            </p>
          </div>
        </Card>

        {/* Products Section */}
        <div className="mb-12">
          {/* Impact Story Video */}
          <div className="relative h-[400px] overflow-hidden rounded-3xl shadow-2xl mb-12 max-w-6xl mx-auto">
            <video
              autoPlay
              loop
              muted
              playsInline
              onLoadedMetadata={(e) => {
                const videoElement = e.currentTarget;
                videoElement.playbackRate = 0.275;
              }}
              className="w-full h-full object-cover"
            >
              <source src="/bougie-impact-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent flex items-end justify-center pb-12">
              <div className="text-center text-white px-6">
                <h2 className="text-4xl font-bold mb-3 drop-shadow-2xl">Making a Real Difference</h2>
                <p className="text-lg drop-shadow-lg">Every purchase supports children's mental health programs</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-2">Shop With Purpose</h2>
            <p className="text-purple-600">
              T-Shirts & Hoodies with messages kids actually understand — 
              because mental health awareness should speak their language
            </p>
            <p className="text-sm text-green-600 mt-2 bg-green-100 inline-block px-4 py-2 rounded-full">
              ✓ All designs approved by Emilie • Quality guaranteed
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className={`p-4 backdrop-blur-sm border-pink-200 transition-all ${product.available ? 'bg-white/80 hover:shadow-lg hover:scale-105 cursor-pointer' : 'bg-gray-100/80 opacity-75'}`}
                onClick={() => product.available && setSelectedProduct(product)}
              >
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className={`w-full h-full object-cover ${!product.available ? 'grayscale opacity-60' : ''}`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">
                        {product.category === "Hoodie" ? "🧥" : "👕"}
                      </span>
                    </div>
                  )}
                  {!product.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full transform -rotate-12">
                        🔜 COMING SOON
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-xs bg-white/80 px-2 py-1 rounded text-purple-600 font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-purple-800 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-pink-600">${product.price}</span>
                  {product.available ? (
                    <Button size="sm" variant="outline" className="text-xs border-pink-300 text-pink-600 hover:bg-pink-50">
                      Select
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-500 font-medium">Soon!</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Selection Dialog */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-purple-800">{selectedProduct?.name}</DialogTitle>
              <DialogDescription>
                {selectedProduct?.category} • ${selectedProduct?.price}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Size Selection */}
              <div>
                <label className="text-sm font-medium text-purple-700 mb-2 block">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="border-pink-200">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct?.sizes?.map((size: string) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color Selection */}
              <div>
                <label className="text-sm font-medium text-purple-700 mb-2 block">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name 
                          ? "border-purple-500 ring-2 ring-purple-300" 
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className={`w-5 h-5 mx-auto ${color.hex === "#ffffff" ? "text-purple-500" : "text-white"}`} />
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-purple-600 mt-1">Selected: {selectedColor}</p>
                )}
              </div>

              {/* Design Preview */}
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-purple-600">
                  <strong>Design:</strong> {selectedProduct?.design}
                </p>
              </div>

              {/* Donation Impact */}
              <div className="bg-pink-50 p-3 rounded-lg">
                <p className="text-xs text-pink-600">
                  <strong>Your Impact:</strong> 20% of this purchase supports mental health awareness, 
                  Emilie's school, and local YMCA programs.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Satisfaction Guarantee */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl mb-12 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-bold text-purple-800 mb-2">Satisfaction Guarantee</h3>
          <p className="text-purple-600">
            We stand behind every product. If you're not completely happy with your purchase, 
            we'll make it right. Your satisfaction matters as much as our mission.
          </p>
        </Card>

        {/* Call to Action */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center shadow-xl max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
          <p className="mb-6 text-white/90">
            Every purchase supports children's mental health programs. 
            Together, we can ensure every child knows they deserve to be heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-white/90"
              onClick={() => window.open('https://www.tiktok.com/@projectblacklight', '_blank')}
            >
              Follow Our Journey
            </Button>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                Support Through Kaiden
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-purple-600/60 text-sm">
          <p>Bougie Boutique is a division of Syndica Solutions</p>
          <p className="mt-1">A portion of all proceeds supports our local YMCA after-school programs</p>
        </div>
      </div>
    </div>
  );
}
