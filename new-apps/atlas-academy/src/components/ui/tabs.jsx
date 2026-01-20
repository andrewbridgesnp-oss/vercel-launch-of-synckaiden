import React, { createContext, useContext, useMemo, useState } from "react";
const TabsCtx = createContext(null);

export function Tabs({ defaultValue, value, onValueChange, children, className = "" }) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const set = onValueChange ?? setInternal;
  const ctx = useMemo(() => ({ value: current, setValue: set }), [current, set]);
  return <TabsCtx.Provider value={ctx}><div className={className}>{children}</div></TabsCtx.Provider>;
}
export function TabsList({ className = "", ...props }) {
  return <div className={`rounded-xl border bg-background p-1 ${className}`} {...props} />;
}
export function TabsTrigger({ value, className = "", children }) {
  const ctx = useContext(TabsCtx);
  const active = ctx?.value === value;
  return (
    <button type="button" onClick={() => ctx?.setValue?.(value)} className={`rounded-lg px-3 py-2 text-sm ${active ? "bg-muted font-semibold" : "hover:bg-muted"} ${className}`}>
      {children}
    </button>
  );
}
export function TabsContent({ value, className = "", children }) {
  const ctx = useContext(TabsCtx);
  if (ctx?.value !== value) return null;
  return <div className={className}>{children}</div>;
}
