import React from "react";
export function Progress({ value = 0 }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div className="h-full bg-foreground" style={{ width: `${v}%` }} />
    </div>
  );
}
