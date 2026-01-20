import { useState } from "react";
import { Calendar, DollarSign, Send, Clock, User, AlertCircle } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { StatusBadge } from "../components/avery/status-badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";

interface BookingsPageProps {
  onNavigate: (page: string) => void;
}

export function BookingsPage({ onNavigate }: BookingsPageProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");

  const bookings = [
    {
      id: "B-2001",
      customer: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      email: "sarah.j@example.com",
      service: "Consultation",
      date: "Jan 15, 2026",
      time: "2:00 PM",
      duration: "60 min",
      price: "$150",
      status: "paid",
      paymentId: "PAY-5678",
      notes: "First-time client, confirmed via SMS"
    },
    {
      id: "B-2002",
      customer: "Michael Chen",
      phone: "+1 (555) 234-5678",
      email: "m.chen@example.com",
      service: "Follow-up Session",
      date: "Jan 16, 2026",
      time: "10:00 AM",
      duration: "30 min",
      price: "$75",
      status: "pending",
      paymentId: null,
      notes: "Awaiting deposit payment"
    },
    {
      id: "B-2003",
      customer: "Emma Davis",
      phone: "+1 (555) 345-6789",
      email: "emma.davis@example.com",
      service: "Initial Assessment",
      date: "Jan 17, 2026",
      time: "3:00 PM",
      duration: "90 min",
      price: "$200",
      status: "paid",
      paymentId: "PAY-5679",
      notes: "Paid in full"
    },
    {
      id: "B-2004",
      customer: "James Wilson",
      phone: "+1 (555) 456-7890",
      email: "j.wilson@example.com",
      service: "Consultation",
      date: "Jan 18, 2026",
      time: "11:00 AM",
      duration: "60 min",
      price: "$150",
      status: "failed",
      paymentId: "PAY-5680",
      notes: "Payment declined - retry required"
    },
    {
      id: "B-2005",
      customer: "Lisa Anderson",
      phone: "+1 (555) 567-8901",
      email: "lisa.a@example.com",
      service: "Consultation",
      date: "Jan 12, 2026",
      time: "1:00 PM",
      duration: "60 min",
      price: "$150",
      status: "expired",
      paymentId: null,
      notes: "Payment link expired - not confirmed"
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  const sendPaymentLink = (booking: any) => {
    toast.success(`Payment link sent to ${booking.customer}`);
    setSelectedBooking(null);
  };

  const resendConfirmation = (booking: any) => {
    toast.success(`Confirmation resent to ${booking.customer}`);
    setSelectedBooking(null);
  };

  const statusConfig: Record<string, "paid" | "pending" | "failed" | "expired"> = {
    paid: "paid",
    pending: "pending",
    failed: "failed",
    expired: "expired"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Bookings & Payments</h1>
        <p className="text-muted-foreground">Manage appointments and collect payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold mt-1">{bookings.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-accent" />
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold mt-1 text-green-500">
                {bookings.filter(b => b.status === "paid").length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-1 text-yellow-500">
                {bookings.filter(b => b.status === "pending").length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </GlassmorphismCard>

        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold mt-1 text-red-500">
                {bookings.filter(b => b.status === "failed").length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </GlassmorphismCard>
      </div>

      {/* Bookings Table with Tabs */}
      <GlassmorphismCard className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
            <TabsTrigger value="paid">
              Paid ({bookings.filter(b => b.status === "paid").length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({bookings.filter(b => b.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({bookings.filter(b => b.status === "failed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        className="cursor-pointer hover:bg-muted/30"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customer}</p>
                            <p className="text-sm text-muted-foreground">{booking.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{booking.service}</p>
                            <p className="text-sm text-muted-foreground">{booking.duration}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{booking.date}</p>
                            <p className="text-sm text-muted-foreground">{booking.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{booking.price}</TableCell>
                        <TableCell>
                          <StatusBadge status={statusConfig[booking.status]} />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooking(booking);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings</h3>
                <p className="text-muted-foreground">
                  Bookings will appear here once Avery starts scheduling appointments
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </GlassmorphismCard>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Status Banner */}
              {selectedBooking.status === "failed" && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-500">Payment Failed</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      The payment was declined. Send a new payment link to retry.
                    </p>
                  </div>
                </div>
              )}

              {selectedBooking.status === "expired" && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-500">Payment Link Expired</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      The payment link has expired. Send a new link to complete booking.
                    </p>
                  </div>
                </div>
              )}

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono">{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={statusConfig[selectedBooking.status]} />
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Customer</p>
                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <p className="font-medium">{selectedBooking.customer}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedBooking.phone}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.email}</p>
                </div>
              </div>

              {/* Service Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{selectedBooking.service}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="font-medium">{selectedBooking.date}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.time}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Payment</p>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span>Amount</span>
                    <span className="text-xl font-bold">{selectedBooking.price}</span>
                  </div>
                  {selectedBooking.paymentId && (
                    <p className="text-sm text-muted-foreground">
                      Payment ID: {selectedBooking.paymentId}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Notes</p>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <div className="flex gap-2 w-full">
              {selectedBooking?.status === "pending" && (
                <Button onClick={() => sendPaymentLink(selectedBooking)} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send Payment Link
                </Button>
              )}
              {selectedBooking?.status === "failed" && (
                <Button onClick={() => sendPaymentLink(selectedBooking)} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Resend Payment Link
                </Button>
              )}
              {selectedBooking?.status === "expired" && (
                <Button onClick={() => sendPaymentLink(selectedBooking)} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send New Payment Link
                </Button>
              )}
              {selectedBooking?.status === "paid" && (
                <Button onClick={() => resendConfirmation(selectedBooking)} variant="outline" className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Resend Confirmation
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
