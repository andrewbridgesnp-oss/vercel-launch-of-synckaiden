import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await dashboardAPI.getStatus();
      setStatus(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="dashboard">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase font-mono text-foreground">COMMAND CENTER</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">System status and operations overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-6 rounded-sm hover:border-primary/30 transition-all" data-testid="pending-videos-card">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Pending Videos</div>
          <div className="text-3xl font-black font-mono text-primary">{status?.pending_videos || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-sm hover:border-primary/30 transition-all" data-testid="scheduled-posts-card">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Scheduled</div>
          <div className="text-3xl font-black font-mono text-success">{status?.scheduled_posts || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Ready to publish</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-sm hover:border-primary/30 transition-all" data-testid="trends-card">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Trends</div>
          <div className="text-3xl font-black font-mono text-info">{status?.trends_count || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Daily insights</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-sm hover:border-primary/30 transition-all" data-testid="recent-posts-card">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Published</div>
          <div className="text-3xl font-black font-mono text-foreground">{status?.recent_posts?.length || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Recent activity</p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-sm">
        <h2 className="text-xl font-mono uppercase tracking-tight mb-4">System Status</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-background rounded-sm border border-border">
            <span className="text-sm font-mono">Content Generation</span>
            <span className="px-3 py-1 bg-success/20 text-success text-xs font-mono uppercase rounded-sm">ONLINE</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-background rounded-sm border border-border">
            <span className="text-sm font-mono">Trend Scanner</span>
            <span className="px-3 py-1 bg-success/20 text-success text-xs font-mono uppercase rounded-sm">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-background rounded-sm border border-border">
            <span className="text-sm font-mono">Publishing Queue</span>
            <span className="px-3 py-1 bg-success/20 text-success text-xs font-mono uppercase rounded-sm">READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}