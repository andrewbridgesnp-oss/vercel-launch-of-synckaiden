import React from 'react';
import { Check } from 'lucide-react';

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function PlanCard({
  name,
  price,
  period,
  description,
  features,
  isCurrent = false,
  isPopular = false,
  onSelect,
  disabled = false,
}: PlanCardProps) {
  return (
    <div
      className={`relative bg-white rounded-xl border-2 p-6 transition-all ${
        isPopular
          ? 'border-gold shadow-lg scale-105'
          : isCurrent
          ? 'border-navy-700'
          : 'border-silver-300 hover:border-navy-400'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="bg-gold text-navy-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Most Popular
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrent && (
        <div className="absolute top-4 right-4">
          <div className="bg-navy-100 text-navy-700 px-3 py-1 rounded-full text-xs font-semibold">
            Current Plan
          </div>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-xl font-bold text-navy-900 mb-2">{name}</h3>
      <p className="text-sm text-silver-600 mb-4">{description}</p>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-navy-900">{price}</span>
          <span className="text-silver-600">/ {period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-silver-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        disabled={disabled || isCurrent}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          isCurrent
            ? 'bg-silver-200 text-silver-600 cursor-not-allowed'
            : isPopular
            ? 'bg-gradient-to-r from-navy-800 to-navy-700 hover:from-navy-700 hover:to-navy-600 text-white'
            : 'bg-navy-800 hover:bg-navy-700 text-white'
        }`}
      >
        {isCurrent ? 'Current Plan' : disabled ? 'Coming Soon' : 'Select Plan'}
      </button>
    </div>
  );
}
