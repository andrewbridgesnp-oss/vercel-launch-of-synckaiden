import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Download, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

export default function OrderSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get("session_id");
  
  const { data: session, isLoading, error } = trpc.stripe.getCheckoutSession.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId }
  );

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Invalid Order</h1>
          <p className="text-muted-foreground mb-6">No order session found.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find your order. Please contact support.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isDigital = session.metadata?.isDigital === "true";
  const amount = ((session.amountTotal || 0) / 100).toFixed(2);

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
              Thank you for your purchase. A confirmation email has been sent to {session.customerEmail}.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {isDigital ? <Download className="w-5 h-5" /> : <Package className="w-5 h-5" />}
              Order Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-sm">{session.id.slice(0, 20)}...</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-500 font-medium capitalize">{session.paymentStatus}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-lg">${amount}</span>
              </div>

              {session.lineItems && session.lineItems.length > 0 && (
                <div className="pt-2">
                  <h3 className="font-medium mb-2">Items</h3>
                  {session.lineItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm py-1">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${((item.amount || 0) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Shipping Info (for physical products) */}
          {!isDigital && session.shippingDetails && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipping Information
              </h2>
              <p className="text-muted-foreground">
                Your order will be shipped to the address provided. You'll receive tracking information via email once your order ships.
              </p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">{(session.shippingDetails as any)?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(session.shippingDetails as any)?.address?.line1}<br />
                  {(session.shippingDetails as any)?.address?.city}, {(session.shippingDetails as any)?.address?.state} {(session.shippingDetails as any)?.address?.postal_code}
                </p>
              </div>
            </Card>
          )}

          {/* Digital Download (for digital products) */}
          {isDigital && (
            <Card className="p-6 mb-6 border-primary/50">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Your Download
              </h2>
              <p className="text-muted-foreground mb-4">
                Your digital product is ready! Click the button below to download.
              </p>
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Now
              </Button>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="p-6 bg-muted/30">
            <h2 className="text-lg font-semibold mb-3">What's Next?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Confirmation email sent to {session.customerEmail}</li>
              {isDigital ? (
                <>
                  <li>✓ Your download is available immediately</li>
                  <li>✓ Check your email for the download link</li>
                </>
              ) : (
                <>
                  <li>✓ Your order is being prepared for shipment</li>
                  <li>✓ You'll receive tracking info via email</li>
                  <li>✓ Estimated delivery: 5-10 business days</li>
                </>
              )}
            </ul>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 mt-8 justify-center">
            <Link href="/dashboard">
              <Button variant="outline">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/shop">
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
