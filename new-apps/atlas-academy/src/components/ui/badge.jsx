import React from "react";
const variants = {
  default: "bg-foreground text-background",
  secondary: "bg-muted text-foreground",
  outline: "border bg-background text-foreground",
};
export function Badge({ className = "", variant = "secondary", ...props }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant] || variants.secondary} ${className}`} {...props} />;
}
