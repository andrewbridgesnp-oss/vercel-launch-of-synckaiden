import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Package } from "lucide-react";
import { Link } from "wouter";

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      processing: "default",
      shipped: "default",
      delivered: "default",
      canceled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your orders.
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
              ← Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg glass border border-border/30">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold cyan-shimmer">
              My Orders
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track your Bougie Boutique orders
          </p>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <Card className="glass premium-card border-border/50 p-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          </Card>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="glass premium-card border-border/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        Order #{order.orderNumber}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      via {order.paymentProvider}
                    </p>
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-sm font-medium mb-1">Shipping Address:</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof order.shippingAddress === 'string' 
                        ? order.shippingAddress 
                        : JSON.stringify(order.shippingAddress)}
                    </p>
                  </div>
                )}

                {order.printfulOrderId && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Printful Order: {order.printfulOrderId}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass premium-card border-border/50 p-12">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-6">
                Visit Bougie Boutique to place your first order
              </p>
              <Button asChild>
                <Link href="/boutique">
                  <a>Shop Now</a>
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
