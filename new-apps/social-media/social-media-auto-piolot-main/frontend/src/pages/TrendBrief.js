import React, { useEffect, useState } from 'react';
import { trendsAPI } from '../utils/api';
import { Button } from '../components/ui/button';
import { Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function TrendBrief() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await trendsAPI.getDailyTrends();
      setTrends(response.data);
    } catch (error) {
      toast.error('Failed to load trends');
    } finally {
      setLoading(false);
    }
  };

  const triggerScan = async () => {
    setScanning(true);
    try {
      await trendsAPI.triggerScan();
      toast.success('Trend scan initiated');
      setTimeout(fetchTrends, 3000);
    } catch (error) {
      toast.error('Failed to trigger scan');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="trend-brief-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase font-mono">TREND BRIEF</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">Daily trend analysis and insights</p>
        </div>
        <Button
          onClick={triggerScan}
          disabled={scanning}
          data-testid="scan-trends-button"
          className="bg-primary hover:bg-primary/90"
        >
          {scanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
          SCAN TRENDS
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : trends.length === 0 ? (
        <div className="text-center p-12 border border-border rounded-sm bg-card">
          <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-mono">No trends available. Click SCAN TRENDS to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {trends.map((trend) => (
            <div key={trend.id} className="bg-card border border-border p-6 rounded-sm hover:border-primary/30 transition-all" data-testid="trend-item">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold font-mono">{trend.title}</h3>
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono uppercase rounded-sm">
                  {trend.source}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{trend.summary}</p>
              
              {trend.suggested_angles && trend.suggested_angles.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-mono uppercase text-muted-foreground mb-2">Suggested Angles:</div>
                  <ul className="space-y-1">
                    {trend.suggested_angles.map((angle, idx) => (
                      <li key={idx} className="text-sm text-foreground pl-4 border-l-2 border-primary">{angle}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4 mt-4">
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">FIT SCORE:</span>
                  <span className="ml-2 font-bold text-primary">{trend.audience_fit_score || 'N/A'}</span>
                </div>
                {trend.risk_flags && trend.risk_flags.length > 0 && (
                  <div className="flex items-center gap-1 text-warning">
                    <AlertTriangle size={14} />
                    <span className="text-xs font-mono">{trend.risk_flags.length} Risk(s)</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}