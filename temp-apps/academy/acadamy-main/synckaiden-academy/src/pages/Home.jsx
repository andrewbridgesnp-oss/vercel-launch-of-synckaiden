import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Rocket, Brain, Workflow, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            <CardTitle>Synckaiden Academy (MVP)</CardTitle>
            <Badge variant="secondary">Offline-first</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            A self-contained interactive trainer to keep you ahead: agentic AI, software engineering, multimodal systems,
            RAG, compliance, and automation engineering.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/academy">Open the Academy</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/embed">Embed view</Link>
            </Button>
          </div>
          <Separator />
          <div className="grid gap-2 md:grid-cols-5">
            <Pill icon={Brain} title="Agents" />
            <Pill icon={Workflow} title="Automations" />
            <Pill icon={Shield} title="Compliance" />
            <Pill icon={TrendingUp} title="25 money paths" />
            <Pill icon={Rocket} title="Daily shipping" />
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Tip: deploy this on Cloudflare Pages as a SPA, then embed the /embed route inside synckaiden.com.
      </div>
    </div>
  );
}

function Pill({ icon: Icon, title }) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-3 text-center">
      <Icon className="mx-auto mb-2 h-4 w-4" />
      <div className="text-xs font-semibold">{title}</div>
    </div>
  );
}
