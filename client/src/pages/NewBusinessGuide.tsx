import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, CheckCircle2, Lightbulb, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function NewBusinessGuide() {
  // Top 3 mistakes new business owners make (researched)
  const topMistakes = [
    {
      rank: 1,
      title: "Mixing Personal and Business Finances",
      description: "Using personal accounts for business, paying personal expenses from business accounts, or not tracking expenses properly.",
      consequences: [
        "Pierces the corporate veil - lose LLC protection",
        "IRS audit red flag",
        "Can't prove business expenses for deductions",
        "Impossible to get business credit"
      ],
      solutions: [
        "Open a dedicated business bank account DAY ONE",
        "Get a business credit card (even if secured)",
        "Use accounting software (Wave is free)",
        "Pay yourself a salary, don't just take money"
      ],
      cost: "Can cost $10,000+ in lost deductions and legal fees"
    },
    {
      rank: 2,
      title: "Not Understanding Their Numbers",
      description: "Not knowing profit margins, cash flow, break-even point, or customer acquisition cost.",
      consequences: [
        "Running out of cash (even while 'profitable')",
        "Pricing too low and losing money on every sale",
        "Spending too much to acquire customers",
        "Can't make informed decisions"
      ],
      solutions: [
        "Know your gross margin (revenue - direct costs)",
        "Track cash flow weekly, not monthly",
        "Calculate your break-even point",
        "Know your CAC (customer acquisition cost) vs LTV (lifetime value)"
      ],
      cost: "82% of businesses fail due to cash flow problems"
    },
    {
      rank: 3,
      title: "Trying to Do Everything Themselves",
      description: "Not delegating, not hiring help, spending $50/hour time on $15/hour tasks.",
      consequences: [
        "Burnout and health problems",
        "Business can't grow beyond your capacity",
        "Poor quality in areas outside expertise",
        "No time for high-value activities"
      ],
      solutions: [
        "Calculate your hourly rate (desired income ÷ 2000 hours)",
        "Outsource anything below your rate",
        "Start with virtual assistants ($5-15/hour overseas)",
        "Use automation tools (Zapier, Make.com)"
      ],
      cost: "Opportunity cost of $50,000-200,000/year in lost growth"
    }
  ];

  // Additional common mistakes
  const otherMistakes = [
    { title: "No written contracts", tip: "Always get it in writing. Verbal agreements are worthless in court." },
    { title: "Ignoring taxes", tip: "Set aside 25-30% of revenue for taxes. Pay quarterly to avoid penalties." },
    { title: "No business plan", tip: "Even a one-page plan forces you to think through your model." },
    { title: "Wrong business structure", tip: "LLC is usually best for liability protection and tax flexibility." },
    { title: "Underpricing", tip: "Price based on value, not cost. You can always discount, never raise easily." },
    { title: "No emergency fund", tip: "Keep 3-6 months of expenses in reserve before taking profits." },
    { title: "Ignoring marketing", tip: "If you're not marketing, you're dying. Allocate 10-20% of revenue." },
    { title: "Not getting insurance", tip: "General liability is cheap. One lawsuit can end your business." }
  ];

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            New Business Guide
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn from others' mistakes. These 3 errors kill 80% of new businesses.
          </p>
        </div>

        {/* Top 3 Mistakes */}
        <div className="space-y-8 mb-12">
          {topMistakes.map((mistake) => (
            <Card key={mistake.rank} className="glass border-border/50 border-red-500/30">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-red-400">#{mistake.rank}</span>
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-red-400">{mistake.title}</CardTitle>
                    <CardDescription className="text-base mt-1">{mistake.description}</CardDescription>
                    <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30">
                      {mistake.cost}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-400 flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4" />
                      What Goes Wrong
                    </h4>
                    <ul className="space-y-2">
                      {mistake.consequences.map((consequence, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-red-400">✗</span>
                          {consequence}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4" />
                      How to Avoid It
                    </h4>
                    <ul className="space-y-2">
                      {mistake.solutions.map((solution, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other Common Mistakes */}
        <h2 className="text-2xl font-bold mb-6 text-center">Other Common Mistakes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {otherMistakes.map((mistake, index) => (
            <Card key={index} className="glass border-border/50 hover:border-amber-500/50 transition-all">
              <CardContent className="p-4">
                <h4 className="font-semibold text-amber-400 text-sm mb-2">{mistake.title}</h4>
                <p className="text-xs text-gray-400">{mistake.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Checklist */}
        <Card className="glass border-border/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-green-400">New Business Quick Start Checklist</CardTitle>
            <CardDescription>Do these in order before you start selling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Choose business structure (LLC recommended)",
                "Register with your state",
                "Get your EIN from IRS (free, instant online)",
                "Open business bank account",
                "Get business credit card",
                "Set up accounting (Wave, QuickBooks)",
                "Get general liability insurance",
                "Create contracts/terms of service",
                "Set up separate business phone number",
                "Register for state sales tax (if applicable)",
                "Get business licenses/permits",
                "Set aside tax reserve (25-30%)"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10">
                  <div className="w-6 h-6 rounded-full border-2 border-green-500/50 flex items-center justify-center text-xs text-green-400">
                    {index + 1}
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Ready to start your business the right way?</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/business-tools">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                Start LLC Formation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/business-credit">
              <Button variant="outline">
                Build Business Credit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
