import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ShoppingCart, DollarSign, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatPrice } from "../../shared/feature-pricing.config";

/**
 * Feature Purchases Analytics Component
 * Displays analytics for single-use feature purchases
 */
export function FeaturePurchasesAnalytics() {
  const { data: analytics, isLoading } = trpc.analytics.getFeaturePurchaseAnalytics.useQuery(
    {},
    { enabled: true }
  );

  const { data: popularFeatures } = trpc.analytics.getPopularFeatures.useQuery({
    limit: 5,
  });

  const { data: trends } = trpc.analytics.getRevenueTrends.useQuery({
    days: 30,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass border-border/50 animate-pulse">
              <CardContent className="pt-6 h-24 bg-slate-700/30 rounded" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="pt-6 text-center text-gray-400">
          No purchase data available yet
        </CardContent>
      </Card>
    );
  }

  const { summary, byFeature } = analytics;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Total Purchases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary.totalPurchases}</div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.completedPurchases} completed
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatPrice(summary.totalRevenue)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Avg: {formatPrice(summary.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{summary.conversionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.pendingPurchases} pending
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Refunds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{summary.refundedPurchases}</div>
            <p className="text-xs text-gray-500 mt-1">
              {((summary.refundedPurchases / summary.totalPurchases) * 100).toFixed(1)}% rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Features */}
      {popularFeatures && popularFeatures.length > 0 && (
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Most Popular Features</CardTitle>
            <CardDescription>Features with the most purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularFeatures.map((feature, idx) => (
                <div key={feature.feature} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-border/30">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                      #{idx + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-white capitalize">
                        {feature.feature.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {feature.purchaseCount} purchases
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      {feature.purchaseCount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue by Feature */}
      {byFeature && byFeature.length > 0 && (
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Revenue by Feature</CardTitle>
            <CardDescription>Breakdown of revenue across all features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {byFeature
                .sort((a, b) => b.revenue - a.revenue)
                .map((feature) => (
                  <div key={feature.feature} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white capitalize">
                        {feature.feature.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm font-bold text-green-400">
                        {formatPrice(feature.revenue)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{feature.completed} completed</span>
                      {feature.refunded > 0 && <span>• {feature.refunded} refunded</span>}
                      {feature.pending > 0 && <span>• {feature.pending} pending</span>}
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${(feature.revenue / Math.max(...byFeature.map((f) => f.revenue))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue Trends */}
      {trends && trends.length > 0 && (
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Revenue Trends (Last 30 Days)</CardTitle>
            <CardDescription>Daily revenue from feature purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {trends
                .filter((t) => t.revenue > 0)
                .map((trend) => (
                  <div key={trend.date} className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50">
                    <p className="text-sm text-gray-400">{trend.date}</p>
                    <p className="text-sm font-semibold text-green-400">{trend.revenueFormatted}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
