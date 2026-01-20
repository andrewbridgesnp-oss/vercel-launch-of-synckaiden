import React from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
  outline: "border border-border bg-background hover:bg-muted",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  ghost: "hover:bg-muted",
};

const SIZES = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-6",
};

export const Button = React.forwardRef(function Button(
  { className, variant = "default", size = "default", type = "button", asChild = false, children, ...props },
  ref
) {
  const buttonClass = cn(
    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-border disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant] || VARIANTS.default,
    SIZES[size] || SIZES.default,
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: cn(buttonClass, children.props?.className),
    });
  }

  return (
    <button ref={ref} type={type} className={buttonClass} {...props}>
      {children}
    </button>
  );
});
