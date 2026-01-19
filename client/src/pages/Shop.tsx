import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingCart, Download, Star, Search, Filter, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  bestseller: boolean;
  rating: number;
  downloads: number;
}

export default function Shop() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const createCheckout = trpc.stripe.createDigitalCheckout.useMutation();

  // 25 Digital Products - Top sellers and high-demand items
  const products: Product[] = [
    // Business Formation (High Demand)
    { id: 1, name: "LLC Operating Agreement Template", description: "State-compliant operating agreement with member provisions, profit sharing, and dissolution clauses. Customizable for single or multi-member LLCs.", price: 47, category: "Business", bestseller: true, rating: 4.9, downloads: 2847 },
    { id: 2, name: "Business Plan Template Bundle", description: "Professional business plan with financial projections, market analysis, and pitch deck. Investor-ready format.", price: 67, category: "Business", bestseller: true, rating: 4.8, downloads: 1923 },
    { id: 3, name: "Contractor Agreement Pack", description: "Independent contractor agreements, NDAs, and work-for-hire contracts. Protect your business relationships.", price: 37, category: "Business", bestseller: false, rating: 4.7, downloads: 1456 },
    { id: 4, name: "Employee Handbook Template", description: "Comprehensive employee handbook covering policies, benefits, conduct, and legal compliance.", price: 57, category: "Business", bestseller: false, rating: 4.6, downloads: 892 },
    { id: 5, name: "Invoice & Contract Bundle", description: "Professional invoices, service contracts, and payment terms templates for freelancers and agencies.", price: 27, category: "Business", bestseller: true, rating: 4.9, downloads: 3241 },

    // Credit Repair (High Demand)
    { id: 6, name: "Credit Dispute Letter Pack", description: "15 proven dispute letter templates for all three bureaus. Includes 609 letters, goodwill letters, and debt validation.", price: 47, category: "Credit", bestseller: true, rating: 4.8, downloads: 4521 },
    { id: 7, name: "Credit Repair Action Plan", description: "Step-by-step 90-day credit repair guide with tracking spreadsheet and bureau contact info.", price: 37, category: "Credit", bestseller: false, rating: 4.7, downloads: 2134 },
    { id: 8, name: "Debt Negotiation Scripts", description: "Phone scripts and letter templates for negotiating with creditors and collection agencies.", price: 27, category: "Credit", bestseller: false, rating: 4.6, downloads: 1876 },
    { id: 9, name: "Credit Building Checklist", description: "Comprehensive checklist for building credit from scratch or rebuilding after bankruptcy.", price: 17, category: "Credit", bestseller: false, rating: 4.5, downloads: 1543 },

    // Student Loans (High Demand)
    { id: 10, name: "Brunner Test Calculator & Guide", description: "Excel calculator with legal analysis guide for student loan discharge eligibility assessment.", price: 47, category: "Student Loans", bestseller: true, rating: 4.9, downloads: 1876 },
    { id: 11, name: "IDR Plan Comparison Tool", description: "Compare all income-driven repayment plans with payment projections and forgiveness timelines.", price: 27, category: "Student Loans", bestseller: false, rating: 4.7, downloads: 1234 },
    { id: 12, name: "PSLF Application Bundle", description: "Complete PSLF application package with employer certification forms and tracking spreadsheet.", price: 37, category: "Student Loans", bestseller: false, rating: 4.8, downloads: 987 },
    { id: 13, name: "Student Loan Hardship Letter Pack", description: "Templates for deferment, forbearance, and hardship requests to loan servicers.", price: 17, category: "Student Loans", bestseller: false, rating: 4.5, downloads: 765 },

    // Real Estate & Trusts (Premium)
    { id: 14, name: "Dynasty Trust Formation Guide", description: "Complete guide to establishing a dynasty trust for generational wealth transfer with sample documents.", price: 197, category: "Real Estate", bestseller: true, rating: 4.9, downloads: 543 },
    { id: 15, name: "Rental Property Analysis Spreadsheet", description: "ROI calculator, cash flow projections, and property comparison tool for real estate investors.", price: 47, category: "Real Estate", bestseller: false, rating: 4.8, downloads: 1654 },
    { id: 16, name: "Lease Agreement Bundle", description: "Residential and commercial lease templates with addendums for pets, security deposits, and more.", price: 37, category: "Real Estate", bestseller: false, rating: 4.7, downloads: 2341 },

    // Grants & Proposals (High Demand)
    { id: 17, name: "Grant Proposal Template Pack", description: "10 grant proposal templates for nonprofits, small businesses, and research projects.", price: 67, category: "Grants", bestseller: true, rating: 4.8, downloads: 1432 },
    { id: 18, name: "501(c)(3) Formation Kit", description: "Complete nonprofit formation guide with IRS Form 1023 instructions and bylaws templates.", price: 97, category: "Grants", bestseller: true, rating: 4.9, downloads: 876 },
    { id: 19, name: "Grant Research Database", description: "Curated list of 500+ grants for small businesses, minorities, women, and veterans.", price: 47, category: "Grants", bestseller: false, rating: 4.6, downloads: 1098 },

    // E-commerce & Dropshipping
    { id: 20, name: "Dropshipping Starter Kit", description: "Complete guide with supplier list, product research tools, and store setup checklist.", price: 67, category: "E-commerce", bestseller: true, rating: 4.7, downloads: 2156 },
    { id: 21, name: "Product Description Templates", description: "50 high-converting product description templates for any niche. SEO-optimized.", price: 27, category: "E-commerce", bestseller: false, rating: 4.6, downloads: 1876 },
    { id: 22, name: "E-commerce Legal Bundle", description: "Terms of service, privacy policy, refund policy, and shipping policy templates.", price: 37, category: "E-commerce", bestseller: false, rating: 4.8, downloads: 1543 },

    // Content & Marketing
    { id: 23, name: "Social Media Content Calendar", description: "12-month content calendar with 365 post ideas, hashtag research, and engagement strategies.", price: 37, category: "Marketing", bestseller: true, rating: 4.8, downloads: 3421 },
    { id: 24, name: "Email Marketing Sequence Pack", description: "10 proven email sequences for welcome, sales, abandoned cart, and re-engagement campaigns.", price: 47, category: "Marketing", bestseller: false, rating: 4.7, downloads: 1987 },
    { id: 25, name: "YouTube Channel Launch Kit", description: "Complete guide with thumbnail templates, SEO checklist, and monetization roadmap.", price: 47, category: "Marketing", bestseller: false, rating: 4.6, downloads: 1234 },
  ];

  const categories = ["all", "Business", "Credit", "Student Loans", "Real Estate", "Grants", "E-commerce", "Marketing"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuyNow = async (product: Product) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    try {
      toast.loading(`Processing "${product.name}"...`, { id: "checkout" });
      
      const result = await createCheckout.mutateAsync({
        productName: product.name,
        productDescription: product.description,
        priceInCents: product.price * 100,
        productId: product.id,
      });

      if (result.url) {
        toast.dismiss("checkout");
        window.location.href = result.url;
      } else {
        toast.error("Failed to create checkout session", { id: "checkout" });
      }
    } catch (error) {
      toast.error("Failed to process checkout. Please try again.", { id: "checkout" });
    }
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #e0e0e8 0%, #ffffff 50%, #c0c0d0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Digital Products
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professionally crafted templates, guides, and tools to accelerate your success.
            Instant download after purchase.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-cyan-600" : ""}
              >
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="glass border-border/50 overflow-hidden group hover:border-cyan-500/50 transition-all">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  {product.bestseller && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Bestseller
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{product.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">
                    ${product.price}
                  </div>
                  <Button
                    onClick={() => handleBuyNow(product)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-green-500" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span>4.8 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-cyan-500" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
