import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { verifyAccessKey } from "@/lib/accessKeys";
import { setProUnlocked } from "@/lib/pro";

export function ProGate({ onOpenPricing, onUnlocked }) {
  const [key, setKey] = React.useState("");
  const [status, setStatus] = React.useState("");
  const secret = import.meta.env.VITE_PRO_KEY_SECRET || import.meta.env.VITE_ADMIN_PASSPHRASE || "";

  async function unlock() {
    setStatus("");
    if (!key.trim()) {
      setStatus("Paste an access key.");
      return;
    }
    if (!secret) {
      setStatus("Missing VITE_PRO_KEY_SECRET (or VITE_ADMIN_PASSPHRASE). Set it in your environment variables.");
      return;
    }
    const res = await verifyAccessKey({ secret, key: key.trim() });
    if (!res.ok) {
      setStatus(`Key rejected: ${res.reason}`);
      return;
    }
    setProUnlocked(res.payload);
    setStatus("Unlocked. Refreshing…");
    onUnlocked?.();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-xl rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Pro content locked</CardTitle>
            <Badge variant="secondary">Synckaiden</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Enter an access key to unlock Pro drops, packs, and future updates. No background actions, no auto-withdrawals.
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-semibold">Access key</div>
            <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="SYNK1...." />
          </div>

          {status ? <div className="text-sm text-muted-foreground">{status}</div> : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={unlock}>Unlock</Button>
            <Button variant="secondary" onClick={onOpenPricing}>
              Pricing / Upgrade
            </Button>
          </div>

          <div className="rounded-2xl bg-muted p-3 text-xs text-muted-foreground">
            MVP security note: this is a client-only unlock. For real licensing, add a backend verification service.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
