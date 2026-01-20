import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PRODUCTS } from "@/config/products";
import { isProUnlocked } from "@/lib/pro";

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Store() {
  const [pro, setPro] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    isProUnlocked().then((val) => {
      if (active) setPro(Boolean(val));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Store</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Simple storefront (static). Each product can point to a Stripe Payment Link. Fulfillment is manual in this MVP.
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold">{p.name}</div>
                  <Badge variant="secondary">{p.price}</Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{p.description}</div>
                <div className="mt-3 text-xs text-muted-foreground">Deliverable: {p.deliverable}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      if (!p.paymentLink || p.paymentLink === "#") {
                        alert("Set a Stripe Payment Link in your .env (see README). ");
                        return;
                      }
                      window.open(p.paymentLink, "_blank", "noopener,noreferrer");
                    }}
                  >
                    Buy
                  </Button>
                  {p.id === "cost-cut-pack" ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        downloadText(
                          "synckaiden-template-pack.txt",
                          "TEMPLATE PACK (MVP)\n\n- Invoice parser → normalize vendors\n- Subscription cleanup checklist\n- Vendor renegotiation call script\n- KPI weekly scorecard\n\nNext: replace this with real downloadable assets in /public."
                        )
                      }
                    >
                      Download sample
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="rounded-2xl bg-muted p-4">
            <div className="font-semibold">Pro Vault quick download</div>
            <div className="mt-1 text-sm text-muted-foreground">
              If Pro is unlocked on this device, download the prompt pack.
            </div>
            <div className="mt-3">
              <Button
                variant={pro ? "default" : "secondary"}
                onClick={() => {
                  if (!pro) {
                    alert("Pro is locked. Go to Academy → Pro Vault to unlock.");
                    return;
                  }
                  downloadText(
                    "synckaiden-pro-prompts.txt",
                    "SYNCKAIDEN PRO PROMPTS (MVP)\n\n1) Academy Builder Prompt\n2) Commerce + Licensing Prompt\n\n(Your live prompt pack is inside the Academy → Pro Vault tab.)"
                  );
                }}
              >
                Download Pro prompts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
