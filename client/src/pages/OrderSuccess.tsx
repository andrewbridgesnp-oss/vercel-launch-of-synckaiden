import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowLeft } from "lucide-react";
import { Link, useSearch } from "wouter";

export default function OrderSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. A confirmation email has been sent.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="glass premium-card border-border/50 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </h2>
            
            <div className="space-y-4">
              {sessionId && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-sm">{sessionId.slice(0, 20)}...</span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-500 font-medium">Confirmed</span>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="glass premium-card border-border/50 p-6 bg-muted/30">
            <h2 className="text-lg font-semibold mb-3">What's Next?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Confirmation email sent</li>
              <li>✓ Your order is being prepared for shipment</li>
              <li>✓ You'll receive tracking info via email</li>
              <li>✓ Estimated delivery: 5-10 business days</li>
            </ul>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 mt-8 justify-center">
            <Link href="/dashboard">
              <Button variant="outline">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/boutique">
              <Button>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
