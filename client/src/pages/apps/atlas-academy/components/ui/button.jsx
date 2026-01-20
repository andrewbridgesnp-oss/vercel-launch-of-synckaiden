import React from "react";

const variants = {
  default: "bg-foreground text-background hover:opacity-90",
  secondary: "bg-muted text-foreground hover:opacity-90",
  outline: "border bg-background hover:bg-muted",
  destructive: "bg-red-600 text-white hover:opacity-90",
};
const sizes = { default: "px-4 py-2 text-sm", sm: "px-3 py-1.5 text-sm" };

export function Button({ className = "", variant = "default", size = "default", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-transparent ${sizes[size] || sizes.default} ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
