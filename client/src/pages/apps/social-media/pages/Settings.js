import React from 'react';

export default function Settings() {
  return (
    <div className="p-6 space-y-6" data-testid="settings-page">
      <h1 className="text-4xl font-black tracking-tighter uppercase font-mono">SETTINGS</h1>
      <p className="text-muted-foreground font-mono text-sm">Brand settings and platform credentials</p>
      <div className="text-center p-12 border border-border rounded-sm bg-card">
        <p className="text-muted-foreground font-mono">Settings configuration coming soon.</p>
      </div>
    </div>
  );
}