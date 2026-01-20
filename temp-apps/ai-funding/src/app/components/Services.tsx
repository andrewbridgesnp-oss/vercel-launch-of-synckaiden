// KAIDEN CAPITAL™ - Services Marketplace

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Shield,
  Sparkles,
  FileText,
  Users,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

export const Services: React.FC = () => {
  const { services, user, purchaseService } = useApp();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  const handlePurchase = async () => {
    if (!selectedService) return;
    
    try {
      await purchaseService(selectedService.id);
      toast.success('Service purchased successfully!', {
        description: 'You will receive delivery details via email shortly.',
      });
      setShowPurchaseDialog(false);
      setSelectedService(null);
    } catch (error) {
      toast.error('Purchase failed', {
        description: 'Please try again or contact support.',
      });
    }
  };

  const canPurchase = (service: any) => {
    if (!user) return false;
    return user.trustScore.score >= service.requiredTrustScore;
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes('Audit')) return <FileText className="w-6 h-6" />;
    if (serviceName.includes('Concierge')) return <Sparkles className="w-6 h-6" />;
    if (serviceName.includes('Credit')) return <TrendingUp className="w-6 h-6" />;
    if (serviceName.includes('Deal')) return <Users className="w-6 h-6" />;
    return <DollarSign className="w-6 h-6" />;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="kaiden-heading-lg mb-2">Fast Path Services</h1>
        <p className="text-muted-foreground">
          Professional services to accelerate your funding journey
        </p>
      </div>

      {/* Disclaimer */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">Transparent & Conservative</p>
              <p className="text-blue-800">
                All services are provided with no guarantees of funding approval. 
                Third-party lenders make independent decisions. Services are designed to 
                improve your readiness and streamline the application process only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            canPurchase={canPurchase(service)}
            onPurchase={() => {
              setSelectedService(service);
              setShowPurchaseDialog(true);
            }}
          />
        ))}
      </div>

      {/* Bundle Offer */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Sparkles className="w-5 h-5" />
                Complete Fast Track Bundle
              </CardTitle>
              <CardDescription className="text-purple-700">
                Save 25% when you purchase all services together
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground line-through">$1,346</p>
              <p className="text-3xl font-bold text-purple-900">$999</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Funding Readiness Audit</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Application Concierge</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Business Credit Build Plan</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Deal Structuring Session</span>
            </div>
          </div>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => toast.info('Bundle purchase coming soon!')}
          >
            Purchase Bundle - Save $347
          </Button>
        </CardContent>
      </Card>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase {selectedService?.name}</DialogTitle>
            <DialogDescription>
              Confirm your purchase and complete payment
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Service Price</span>
                  <span className="text-2xl font-bold">
                    ${selectedService.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery: {selectedService.estimatedDeliveryTime}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">What's included:</h4>
                <ul className="space-y-1">
                  {selectedService.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Deliverables:</h4>
                <ul className="space-y-1">
                  {selectedService.deliverables.map((deliverable: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                <p className="font-semibold mb-1">Important Note:</p>
                <p>
                  This service does not guarantee funding approval. All funding decisions 
                  are made independently by third-party lenders based on their criteria.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase}>
              Complete Purchase - ${selectedService?.price}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ServiceCardProps {
  service: any;
  canPurchase: boolean;
  onPurchase: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, canPurchase, onPurchase }) => {
  const [expanded, setExpanded] = useState(false);

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes('Audit')) return <FileText className="w-6 h-6 text-blue-500" />;
    if (serviceName.includes('Concierge')) return <Sparkles className="w-6 h-6 text-purple-500" />;
    if (serviceName.includes('Credit')) return <TrendingUp className="w-6 h-6 text-green-500" />;
    if (serviceName.includes('Deal')) return <Users className="w-6 h-6 text-orange-500" />;
    return <DollarSign className="w-6 h-6 text-gray-500" />;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
            {getServiceIcon(service.name)}
          </div>
          <div className="flex-1">
            <CardTitle className="mb-2">{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">${service.price}</span>
          <span className="text-sm text-muted-foreground">one-time</span>
        </div>

        {/* Delivery Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Delivery: {service.estimatedDeliveryTime}</span>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Features:</h4>
          <ul className="space-y-1">
            {service.features.slice(0, expanded ? undefined : 3).map((feature: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {service.features.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-700"
            >
              {expanded ? 'Show less' : `Show ${service.features.length - 3} more features`}
            </Button>
          )}
        </div>

        {/* Trust Score Requirement */}
        {!canPurchase && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg text-sm text-orange-900">
            <Lock className="w-4 h-4" />
            <span>
              Trust Score {service.requiredTrustScore}+ required
            </span>
          </div>
        )}

        {/* Purchase Button */}
        <Button
          className="w-full"
          onClick={onPurchase}
          disabled={!canPurchase}
        >
          {canPurchase ? 'Purchase Service' : 'Increase Trust Score to Unlock'}
        </Button>
      </CardContent>
    </Card>
  );
};
