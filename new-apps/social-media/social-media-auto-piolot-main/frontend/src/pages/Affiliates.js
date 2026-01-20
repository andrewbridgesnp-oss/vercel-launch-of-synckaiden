import React, { useEffect, useState } from 'react';
import { affiliatesAPI } from '../utils/api';
import { Button } from '../components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Affiliates() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await affiliatesAPI.getAll();
      setOffers(response.data);
    } catch (error) {
      toast.error('Failed to load affiliates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="affiliates-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase font-mono">AFFILIATE CATALOG</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">Manage affiliate offers and commissions</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" data-testid="add-affiliate-button">
          <Plus className="w-4 h-4 mr-2" />
          ADD OFFER
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center p-12 border border-border rounded-sm bg-card">
          <p className="text-muted-foreground font-mono">No affiliate offers yet. Click ADD OFFER to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-card border border-border p-6 rounded-sm">
              <h3 className="text-lg font-bold font-mono mb-2">{offer.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{offer.category} • {offer.network}</p>
              <div className="flex items-center gap-4">
                {offer.commission && (
                  <div className="text-xs font-mono">
                    <span className="text-muted-foreground">COMMISSION:</span>
                    <span className="ml-2 text-success">{offer.commission}</span>
                  </div>
                )}
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">REPUTATION:</span>
                  <span className="ml-2">{offer.reputation_score}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}