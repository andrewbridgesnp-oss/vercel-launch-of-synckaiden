import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface LuxuryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "premium" | "signin" | "getstarted" | "business" | "brand";
  children: React.ReactNode;
}

const LuxuryButton = forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant = "premium", children, ...props }, ref) => {
    const variantStyles = {
      premium: "bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:from-purple-700 hover:via-purple-600 hover:to-blue-700",
      signin: "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 hover:from-blue-950 hover:via-blue-900 hover:to-blue-950",
      getstarted: "bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 hover:from-orange-700 hover:via-orange-600 hover:to-orange-700",
      business: "bg-gradient-to-r from-green-800 via-green-700 to-green-800 hover:from-green-900 hover:via-green-800 hover:to-green-900",
      brand: "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 hover:from-purple-700 hover:via-pink-600 hover:to-purple-700"
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center",
          "px-8 py-3 rounded-full",
          "font-semibold text-lg text-white",
          "transition-all duration-300 ease-out",
          "overflow-hidden",
          
          // Glass morphism effect
          "backdrop-blur-xl bg-opacity-20",
          
          // Metallic border
          "border-2 border-white/30",
          "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
          
          // Transparent gradient overlay (only shows on hover)
          "bg-white/10",
          
          // Glow effect
          "before:absolute before:inset-0 before:rounded-full",
          "before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-white/20",
          "before:opacity-0 hover:before:opacity-100",
          "before:transition-opacity before:duration-300",
          
          // Outer glow on hover (variant-specific)
          variant === "premium" && "hover:shadow-[0_0_30px_rgba(168,85,247,0.6),0_0_60px_rgba(59,130,246,0.4)]",
          variant === "signin" && "hover:shadow-[0_0_30px_rgba(30,64,175,0.6),0_0_60px_rgba(30,58,138,0.4)]",
          variant === "getstarted" && "hover:shadow-[0_0_30px_rgba(249,115,22,0.6),0_0_60px_rgba(234,88,12,0.4)]",
          variant === "business" && "hover:shadow-[0_0_30px_rgba(22,163,74,0.6),0_0_60px_rgba(21,128,61,0.4)]",
          variant === "brand" && "hover:shadow-[0_0_30px_rgba(168,85,247,0.6),0_0_60px_rgba(236,72,153,0.4)]",
          
          // Scale on hover
          "hover:scale-105",
          
          // Active state
          "active:scale-95",
          
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          
          className
        )}
        {...props}
      >
        {/* Inner shine effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-50" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        {/* Bottom shadow */}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/30 blur-md rounded-full" />
      </button>
    );
  }
);

LuxuryButton.displayName = "LuxuryButton";

export { LuxuryButton };
