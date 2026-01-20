import React from "react";
import Academy from "@/pages/Academy";

export default function Embed() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Academy embed />
      </div>
    </div>
  );
}
