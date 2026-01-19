import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";

// Mock VIP businesses - rotate throughout the day
const VIP_BUSINESSES = [
  {
    id: 1,
    name: "Bougie Boutique",
    category: "Luxury Fashion",
    description: "Premium designer goods and exclusive collections",
    url: "/bougie-boutique",
    logo: "👗",
    featured: true,
  },
  {
    id: 2,
    name: "Tech Innovations Inc",
    category: "Software Development",
    description: "Custom software solutions for enterprises",
    url: "#",
    logo: "💻",
  },
  {
    id: 3,
    name: "Wellness Collective",
    category: "Health & Wellness",
    description: "Holistic health coaching and nutrition planning",
    url: "#",
    logo: "🧘",
  },
  {
    id: 4,
    name: "Creative Studios",
    category: "Design & Branding",
    description: "Brand identity and creative design services",
    url: "#",
    logo: "🎨",
  },
  {
    id: 5,
    name: "Digital Marketing Pro",
    category: "Marketing",
    description: "Full-service digital marketing and growth hacking",
    url: "#",
    logo: "📱",
  },
  {
    id: 6,
    name: "Legal Experts LLC",
    category: "Legal Services",
    description: "Business law and contract services",
    url: "#",
    logo: "⚖️",
  },
];

export default function VipDirectory() {
  const [featured, setFeatured] = useState<typeof VIP_BUSINESSES[0] | null>(null);
  const [others, setOthers] = useState<typeof VIP_BUSINESSES>([]);

  useEffect(() => {
    // Rotate featured business every 10 seconds
    const rotateInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * VIP_BUSINESSES.length);
      setFeatured(VIP_BUSINESSES[randomIndex]);
    }, 10000);

    // Initial featured
    setFeatured(VIP_BUSINESSES[0]);
    setOthers(VIP_BUSINESSES.slice(1));

    return () => clearInterval(rotateInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">VIP Directory</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Hero */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">VIP Marketplace</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover premium businesses and services. Your site rotates throughout the day to reach thousands of KAIDEN users.
          </p>
        </div>

        {/* Featured Business - Rotating */}
        {featured && (
          <div className="mb-16 rounded-xl overflow-hidden border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-8xl">{featured.logo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-purple-400 font-semibold">FEATURED NOW</span>
                </div>
                <h3 className="text-4xl font-bold mb-2">{featured.name}</h3>
                <p className="text-purple-300 text-sm mb-4">{featured.category}</p>
                <p className="text-gray-300 mb-6">{featured.description}</p>
                <a href={featured.url}>
                  <Button className="flex items-center gap-2" style={{
                    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                    color: "#fff",
                  }}>
                    Visit <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-6 text-center">
              Featured business rotates every 10 seconds. Get your business featured by posting to the VIP Directory.
            </p>
          </div>
        )}

        {/* All Businesses Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">All VIP Businesses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VIP_BUSINESSES.map((business) => (
              <a key={business.id} href={business.url} className="group">
                <div className="bg-black/50 border border-gray-700 hover:border-purple-500/50 rounded-lg p-6 transition h-full flex flex-col">
                  <div className="text-6xl mb-4">{business.logo}</div>
                  <h4 className="text-xl font-semibold mb-1 group-hover:text-purple-400 transition">{business.name}</h4>
                  <p className="text-sm text-purple-400 mb-3">{business.category}</p>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{business.description}</p>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Learn More
                  </Button>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA for Businesses */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Want Your Business Featured?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Post your business to the VIP Directory and reach thousands of KAIDEN users. Your site rotates throughout the day for maximum visibility.
          </p>
          <Button size="lg" className="px-12 py-7 text-lg font-semibold rounded-full"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              color: "#fff",
            }}
          >
            Post Your Business
          </Button>
          <p className="text-sm text-gray-500 mt-6">
            KAIDEN users only. Premium placement available.
          </p>
        </div>
      </div>
    </div>
  );
}
