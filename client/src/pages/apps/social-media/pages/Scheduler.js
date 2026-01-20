import React from 'react';

export default function Scheduler() {
  return (
    <div className="p-6 space-y-6" data-testid="scheduler-page">
      <h1 className="text-4xl font-black tracking-tighter uppercase font-mono">SCHEDULER</h1>
      <p className="text-muted-foreground font-mono text-sm">Manage posting schedule and best times</p>
      <div className="text-center p-12 border border-border rounded-sm bg-card">
        <p className="text-muted-foreground font-mono">No scheduled posts yet.</p>
      </div>
    </div>
  );
}