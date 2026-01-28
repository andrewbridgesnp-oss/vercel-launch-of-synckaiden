import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  PiggyBank,
  Target,
  BarChart3,
  Wallet,
  Shield,
  BookOpen
} from "lucide-react";

export default function BuildWealth() {
  const features = [
    {
      icon: TrendingUp,
      title: "Investment Strategies",
      description: "Learn proven wealth-building strategies from successful investors"
    },
    {
      icon: PiggyBank,
      title: "Savings Plans",
      description: "Automated savings and emergency fund building"
    },
    {
      icon: Target,
      title: "Financial Goals",
      description: "Set and track your financial milestones"
    },
    {
      icon: BarChart3,
      title: "Portfolio Management",
      description: "Track and optimize your investment portfolio"
    },
    {
      icon: Wallet,
      title: "Budget Optimization",
      description: "Smart budgeting tools to maximize your savings"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Protect your wealth with proper insurance and diversification"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_240)] via-[oklch(0.14_0.03_260)] to-[oklch(0.12_0.02_240)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-2">
            BuildWealth Pro
          </h1>
          <p className="text-[oklch(0.78_0.08_240)] text-lg">
            Your comprehensive wealth-building companion
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-[oklch(0.16_0.02_240)]/50 border-[oklch(0.78_0.08_240)]/20 mb-8">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-[oklch(0.72_0.18_200)] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[oklch(0.95_0_0)] mb-2">
              Coming Soon
            </h2>
            <p className="text-[oklch(0.78_0.08_240)]">
              BuildWealth Pro is currently in development. Check back soon for the full experience!
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[oklch(0.16_0.02_240)]/50 border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <div className="p-3 bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] rounded-lg w-fit mb-2">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-[oklch(0.95_0_0)]">{feature.title}</CardTitle>
                <CardDescription className="text-[oklch(0.78_0.08_240)]">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to Build Your Wealth?
              </h3>
              <p className="text-white/80 mb-4">
                Join the waitlist to be notified when BuildWealth Pro launches
              </p>
              <Button size="lg" variant="outline" className="bg-white text-[oklch(0.72_0.18_200)] hover:bg-white/90">
                Join Waitlist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
