import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function PricingModal({ open, onOpenChange }) {
  const stripeLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Synckaiden Academy – Pricing">
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          MVP monetization is Stripe Payment Link + local Pro unlock key. Real auth comes later.
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Free</div>
              <Badge variant="secondary">$0</Badge>
            </div>
            <Separator className="my-3" />
            <ul className="space-y-1 text-sm">
              <li>• Full learning OS (offline-first)</li>
              <li>• Daily planning + streak tracking</li>
              <li>• Blueprint generator + exports</li>
              <li>• Intel pack import/export</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Pro</div>
              <Badge>Unlock</Badge>
            </div>
            <Separator className="my-3" />
            <ul className="space-y-1 text-sm">
              <li>• Pro templates & packs (in-app)</li>
              <li>• Future: updates, member drops, “intel briefs”</li>
              <li>• Priority roadmap access</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-muted p-4 text-sm">
          <div className="font-semibold">Upgrade</div>
          <div className="mt-1 text-muted-foreground">
            Clicking Upgrade opens your Stripe Payment Link (set VITE_STRIPE_PAYMENT_LINK). After purchase, paste your Access Key inside the app to unlock.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              if (!stripeLink) {
                alert("Set VITE_STRIPE_PAYMENT_LINK in your environment variables.");
                return;
              }
              window.open(stripeLink, "_blank", "noopener,noreferrer");
            }}
          >
            Upgrade (Stripe)
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
