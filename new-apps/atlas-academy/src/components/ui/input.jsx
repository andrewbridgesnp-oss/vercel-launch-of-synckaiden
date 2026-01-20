import React from "react";
export function Input({ className = "", ...props }) {
  return <input className={`w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-muted ${className}`} {...props} />;
}
