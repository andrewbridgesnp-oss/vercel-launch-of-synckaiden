import React from "react";
import { cn } from "@/lib/utils";

export function Modal({ open, onOpenChange, title, children, className }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={cn("w-full max-w-lg rounded-2xl border border-border bg-background shadow-soft", className)}>
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <div className="font-semibold">{title}</div>
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-sm hover:bg-muted"
              onClick={() => onOpenChange?.(false)}
            >
              ✕
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
