import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Loader2, CreditCard, Calendar, TrendingUp, Download } from "lucide-react";
import { analytics } from "@/lib/analytics";

export default function SubscriptionManagement() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  if (!user) {
    return <div className="container py-8">Please log in to manage your subscription.</div>;
  }

  const tierFeatures: Record<string, string[]> = {
    free_trial: ["1-day trial", "All features unlocked", "No credit card required"],
    starter: ["Basic features", "5 AI generations/day", "Email support"],
    professional: ["All features", "Unlimited AI generations", "Priority support", "Advanced analytics"],
    enterprise: ["Everything in Professional", "Custom integrations", "Dedicated account manager", "SLA guarantee"],
  };

  const tierPrices: Record<string, number> = {
    free_trial: 0,
    starter: 29,
    professional: 99,
    enterprise: 299,
  };

  const handleUpgrade = (tier: string) => {
    analytics.events.upgradeView(user.subscriptionTier, tier);
    // Redirect to pricing page or Stripe checkout
    window.location.href = "/pricing";
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features.")) {
      analytics.events.cancel();
      // Implement cancellation logic
      alert("Cancellation flow coming soon. Please contact support.");
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">Manage your plan, billing, and payment methods</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </div>
            <Badge variant={user.subscriptionStatus === "active" ? "default" : "destructive"}>
              {user.subscriptionStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold capitalize">{user.subscriptionTier.replace("_", " ")}</p>
              <p className="text-muted-foreground">${tierPrices[user.subscriptionTier]}/month</p>
            </div>
            {user.subscriptionTier !== "enterprise" && (
              <Button onClick={() => handleUpgrade("professional")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold mb-2">Included Features:</p>
            <ul className="space-y-1">
              {tierFeatures[user.subscriptionTier].map((feature, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center">
                  <span className="mr-2">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          {user.trialEndsAt && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <Calendar className="w-4 h-4 inline mr-2" />
                Trial ends: {new Date(user.trialEndsAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No billing history yet</p>
            <p className="text-sm">Invoices will appear here after your first payment</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payment method on file</p>
              <Button className="mt-4" variant="outline">Add Payment Method</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
      {user.subscriptionTier !== "free_trial" && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Cancel Subscription</CardTitle>
            <CardDescription>End your subscription and lose access to premium features</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
