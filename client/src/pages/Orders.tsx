import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Receipt, RotateCcw, Download, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Orders() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [refundReason, setRefundReason] = useState("");

  const { data: orders, isLoading } = trpc.orders.list.useQuery();
  const utils = trpc.useUtils();

  const processRefund = trpc.orders.processRefund.useMutation({
    onSuccess: () => {
      toast.success("Refund processed successfully");
      setRefundDialogOpen(false);
      setRefundReason("");
      setSelectedOrder(null);
      utils.orders.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Refund failed: ${error.message}`);
    },
  });

  const handleRefund = () => {
    if (!selectedOrder || !refundReason.trim()) {
      toast.error("Please provide a refund reason");
      return;
    }

    processRefund.mutate({
      orderId: selectedOrder.id,
      reason: refundReason,
    });
  };

  const filteredOrders = orders?.filter((order) =>
    order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      paid: "default",
      pending: "secondary",
      failed: "destructive",
      refunded: "secondary",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tools">
            <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
              ← Back to Tools
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg glass border border-border/30">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold cyan-shimmer">
              Order Management
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track payments, view receipts, and process refunds
          </p>
        </div>

        {/* Search */}
        <Card className="glass premium-card border-border/50 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, customer email, or name..."
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="glass premium-card border-border/50 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-border/50 hover:bg-muted/5">
                    <TableCell className="font-mono text-sm">
                      #{order.id.toString().padStart(6, "0")}
                    </TableCell>
                    <TableCell className="font-medium">{order.productName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail || "N/A"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(order.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.receiptUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => order.receiptUrl && window.open(order.receiptUrl, "_blank")}
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === "paid" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setRefundDialogOpen(true);
                            }}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search" : "Orders will appear here once customers make purchases"}
              </p>
            </div>
          )}
        </Card>

        {/* Refund Dialog */}
        <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
          <DialogContent className="glass border-border/50">
            <DialogHeader>
              <DialogTitle>Process Refund</DialogTitle>
              <DialogDescription>
                Refund {selectedOrder && formatCurrency(selectedOrder.amount)} for order #{selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="refund-reason">Refund Reason</Label>
                <Textarea
                  id="refund-reason"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Explain why this refund is being processed..."
                  className="mt-1 bg-background/50 border-border/50"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  setRefundDialogOpen(false);
                  setRefundReason("");
                  setSelectedOrder(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRefund}
                disabled={processRefund.isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {processRefund.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process Refund"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
