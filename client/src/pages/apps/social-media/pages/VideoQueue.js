import React from 'react';

export default function VideoQueue() {
  return (
    <div className="p-6 space-y-6" data-testid="video-queue-page">
      <h1 className="text-4xl font-black tracking-tighter uppercase font-mono">VIDEO QUEUE</h1>
      <p className="text-muted-foreground font-mono text-sm">Approve or reject daily video generation</p>
      <div className="text-center p-12 border border-border rounded-sm bg-card">
        <p className="text-muted-foreground font-mono">No videos in queue. Trigger video generation from Dashboard.</p>
      </div>
    </div>
  );
}