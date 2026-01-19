/**
 * Products Page
 * Display and manage product offerings with pricing
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  currency: string;
  features?: string[];
  popular?: boolean;
}

const WEBSITE_PRODUCTS: Product[] = [
  {
    id: "website_basic",
    name: "Basic Website",
    description: "Professional single-page website with Stripe integration",
    priceInCents: 29900,
    currency: "usd",
    features: ["Single page", "Stripe payments", "Mobile responsive", "SSL certificate"],
  },
  {
    id: "website_pro",
    name: "Pro Website",
    description: "Multi-page website with advanced features",
    priceInCents: 59900,
    currency: "usd",
    features: ["Multi-page", "Custom domain", "Advanced analytics", "Email forms"],
    popular: true,
  },
  {
    id: "website_enterprise",
    name: "Enterprise Website",
    description: "Full e-commerce platform with inventory management",
    priceInCents: 149900,
    currency: "usd",
    features: ["E-commerce", "Inventory sync", "Advanced analytics", "Priority support"],
  },
];

const SUBSCRIPTION_PRODUCTS: Product[] = [
  {
    id: "subscription_starter",
    name: "Starter Plan",
    description: "Essential AI business tools",
    priceInCents: 4900,
    currency: "usd",
    features: ["AI chat", "Basic automation", "Email support"],
  },
  {
    id: "subscription_growth",
    name: "Growth Plan",
    description: "Advanced features for growing businesses",
    priceInCents: 9900,
    currency: "usd",
    features: ["All Starter features", "Advanced automation", "Priority support", "Custom integrations"],
    popular: true,
  },
  {
    id: "subscription_pro",
    name: "Pro Plan",
    description: "Enterprise-grade features",
    priceInCents: 19900,
    currency: "usd",
    features: ["All Growth features", "Dedicated account manager", "Custom workflows", "API access"],
  },
];

function ProductCard({ product, onSelect }: { product: Product; onSelect: (id: string) => void }) {
  const price = (product.priceInCents / 100).toFixed(2);

  return (
    <div
      className={`relative p-6 rounded-lg border transition ${
        product.popular
          ? "border-blue-500 bg-blue-500 bg-opacity-5 ring-2 ring-blue-500 ring-opacity-30"
          : "border-slate-700 bg-slate-800 hover:border-slate-600"
      }`}
    >
      {product.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
      <p className="text-sm text-slate-400 mb-4">{product.description}</p>

      <div className="mb-6">
        <div className="text-3xl font-bold text-white">
          ${price}
          {product.priceInCents < 100000 && <span className="text-lg text-slate-400">/mo</span>}
        </div>
      </div>

      {product.features && (
        <ul className="space-y-3 mb-6">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
              <Check className="w-4 h-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <Button
        onClick={() => onSelect(product.id)}
        className={`w-full ${
          product.popular
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-slate-700 hover:bg-slate-600"
        }`}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Select Plan
      </Button>
    </div>
  );
}

export function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
    // TODO: Redirect to checkout or show checkout modal
    console.log("Selected product:", productId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-400">
            Choose the perfect plan for your business needs
          </p>
        </div>

        {/* Website Products */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Website Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WEBSITE_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
              />
            ))}
          </div>
        </div>

        {/* Subscription Products */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUBSCRIPTION_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
              />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 p-8 bg-slate-800 rounded-lg border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-white mb-2">Can I change plans?</h4>
              <p className="text-slate-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-slate-400">
                We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Is there a free trial?</h4>
              <p className="text-slate-400">
                Yes, all subscription plans include a 14-day free trial. No credit card required.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Do you offer refunds?</h4>
              <p className="text-slate-400">
                We offer a 30-day money-back guarantee for all subscription plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default ProductsPage;
