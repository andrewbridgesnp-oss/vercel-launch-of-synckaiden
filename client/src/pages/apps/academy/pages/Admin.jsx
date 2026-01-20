import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateAccessKey } from "@/lib/accessKeys";

export default function Admin() {
  const expected = import.meta.env.VITE_ADMIN_PASSPHRASE || "";
  const [pass, setPass] = React.useState("");
  const [ok, setOk] = React.useState(false);
  const [days, setDays] = React.useState(365);
  const [keyOut, setKeyOut] = React.useState("");

  function check() {
    if (!expected) {
      alert("Set VITE_ADMIN_PASSPHRASE to use Admin.");
      return;
    }
    setOk(pass === expected);
  }

  async function gen() {
    if (!expected) return;
    const key = await generateAccessKey({ secret: expected, daysValid: days });
    setKeyOut(key);
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Admin – Access Key Issuer</CardTitle>
            <Badge variant="secondary">Client-only</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This MVP generates Pro keys in the browser. It’s good enough to start selling, but it’s not a secure licensing
            system. When you’re ready, move key issuance + validation to a backend.
          </div>

          <div className="rounded-2xl border border-border p-4">
            <div className="text-sm font-semibold">Admin passphrase</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter VITE_ADMIN_PASSPHRASE"
                className="max-w-md"
              />
              <Button onClick={check}>Unlock</Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Set <code>VITE_ADMIN_PASSPHRASE</code> and reuse the same value as <code>VITE_PRO_KEY_SECRET</code>.
            </div>
          </div>

          {!ok ? (
            <div className="text-sm text-muted-foreground">Locked.</div>
          ) : (
            <>
              <Separator />
              <div className="rounded-2xl border border-border p-4">
                <div className="text-sm font-semibold">Generate a Pro key</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value || 365))}
                    className="w-28"
                  />
                  <span className="text-sm text-muted-foreground">days valid</span>
                  <Button onClick={gen}>Generate</Button>
                  {keyOut ? (
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(keyOut)}>
                      Copy
                    </Button>
                  ) : null}
                </div>

                {keyOut ? (
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground">Send this key to the buyer:</div>
                    <Textarea value={keyOut} readOnly className="mt-2 min-h-[120px]" />
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl bg-muted p-4 text-xs text-muted-foreground">
                Recommended flow: buyer purchases → you issue key → buyer pastes key in app → unlock stored locally.
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
