import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CreditCard, Calendar, TrendingUp, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Subscription() {
  const { data: subscription, isLoading } = trpc.stripe.getSubscriptionStatus.useQuery();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "starter": return "text-cyan-400";
      case "professional": return "text-purple-400";
      case "enterprise": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const getTierName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center">
        <div className="text-gray-400">Loading subscription details...</div>
      </div>
    );
  }

  const currentTier = subscription?.tier || "free";
  const hasSubscription = subscription?.hasSubscription || false;

  return (
    <div className="min-h-screen bg-background luxury-gradient p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-200">Subscription</h1>
          </div>
          <Link href="/pricing">
            <Button variant="outline">View All Plans</Button>
          </Link>
        </div>

        {/* Current Plan Card */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-2">
                Current Plan
              </h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className={`text-4xl font-bold ${getTierColor(currentTier)}`}>
                  {getTierName(currentTier)}
                </span>
                {hasSubscription && (
                  <span className="text-gray-400">
                    ${currentTier === "starter" ? "197" : currentTier === "professional" ? "497" : "1,497"}/month
                  </span>
                )}
              </div>
              {hasSubscription && subscription?.currentPeriodEnd && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            {hasSubscription && (
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // TODO: Create Stripe customer portal session
                    window.open("https://billing.stripe.com/p/login/test_123", "_blank");
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Manage Subscription
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <h3 className="font-semibold text-gray-200">AI Conversations</h3>
            </div>
            <p className="text-3xl font-bold text-gray-200">
              {currentTier === "free" ? "10/day" : "Unlimited"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {currentTier === "free" ? "Upgrade for unlimited" : "No limits"}
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-gray-200">CRM Contacts</h3>
            </div>
            <p className="text-3xl font-bold text-gray-200">
              {currentTier === "free" ? "100" : currentTier === "starter" ? "1,000" : "10,000+"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {currentTier === "free" ? "Upgrade for more" : "Active contacts"}
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-gray-200">Workflows</h3>
            </div>
            <p className="text-3xl font-bold text-gray-200">
              {currentTier === "free" ? "0" : currentTier === "starter" ? "10" : "Unlimited"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {currentTier === "free" ? "Upgrade to automate" : "Active automations"}
            </p>
          </Card>
        </div>

        {/* Upgrade CTA */}
        {!hasSubscription && (
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-200 mb-2">
                Unlock Full Platform Access
              </h2>
              <p className="text-gray-400 mb-6">
                Upgrade to access unlimited conversations, advanced workflows, and premium features
              </p>
              <Link href="/pricing">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
