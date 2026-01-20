import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PricingModal } from "@/components/PricingModal";
import { isProUnlocked, getProMeta, clearPro } from "@/lib/pro";

export default function AppLayout() {
  const location = useLocation();
  const [pricingOpen, setPricingOpen] = React.useState(false);
  const [pro, setPro] = React.useState(isProUnlocked());
  const meta = getProMeta();

  React.useEffect(() => {
    setPro(isProUnlocked());
  }, [pricingOpen, location.key]);

  React.useEffect(() => {
    function handleExternalPricing() {
      setPricingOpen(true);
    }

    window.addEventListener("synckaiden:openPricing", handleExternalPricing);
    return () => window.removeEventListener("synckaiden:openPricing", handleExternalPricing);
  }, []);

  const openPricing = React.useCallback(() => setPricingOpen(true), []);
  const closePricing = React.useCallback(() => setPricingOpen(false), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-bold">synckaiden.com</Link>
            <Badge variant="secondary">Academy MVP</Badge>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <Button variant={location.pathname === "/academy" ? "secondary" : "outline"} asChild>
              <Link to="/academy">Academy</Link>
            </Button>
            <Button variant={location.pathname === "/store" ? "secondary" : "outline"} asChild>
              <Link to="/store">Store</Link>
            </Button>

            <Button variant={location.pathname === "/admin" ? "secondary" : "outline"} asChild>
              <Link to="/admin">Admin</Link>
            </Button>
            <Button variant="secondary" onClick={() => setPricingOpen(true)}>
              Pricing
            </Button>
            {pro ? (
              <Button
                variant="outline"
                onClick={() => {
                  clearPro();
                  setPro(false);
                }}
              >
                Pro: ON{meta?.expISO ? ` (expires ${new Date(meta.expISO).toLocaleDateString()})` : ""}
              </Button>
            ) : (
              <Badge variant="outline">Pro: OFF</Badge>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet context={{ openPricing, closePricing }} />
      </main>

      <PricingModal open={pricingOpen} onOpenChange={setPricingOpen} />

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-muted-foreground">
        Deployed as a static SPA. For real licensing, add a backend verification API.
      </footer>
    </div>
  );
}
