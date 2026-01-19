import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Users, Receipt, MessageSquare, Search, TrendingUp, Link2, DollarSign,
  AlertTriangle, ExternalLink, Shield, Zap
} from "lucide-react";
import { Link } from "wouter";

export default function BusinessHub() {
  const features = [
    {
      icon: Phone,
      title: "Virtual Receptionist",
      description: "AI-powered phone answering and call management",
      status: "active",
      color: "text-blue-500",
      href: "/business/receptionist",
      features: ["24/7 AI answering", "Call routing", "Voicemail transcription", "Call history"],
    },
    {
      icon: Users,
      title: "HR Management",
      description: "Employee records, payroll, and compliance tracking",
      status: "active",
      color: "text-purple-500",
      href: "/business/hr",
      disclaimer: "hr",
      features: ["Employee database", "Payroll calculations", "Time tracking", "Compliance alerts"],
    },
    {
      icon: Receipt,
      title: "Tax Management",
      description: "Expense tracking and tax deduction suggestions",
      status: "active",
      color: "text-yellow-500",
      href: "/business/tax",
      disclaimer: "tax",
      features: ["Expense tracking", "IRS deduction finder", "Tax calculator", "Professional referrals"],
    },
    {
      icon: MessageSquare,
      title: "Social Media Auto-Reply",
      description: "Automated responses across all social platforms",
      status: "active",
      color: "text-pink-500",
      href: "/business/social",
      features: ["Facebook/Instagram/Twitter/LinkedIn", "AI responses", "Sentiment analysis", "Engagement tracking"],
    },
    {
      icon: Search,
      title: "SEO Optimizer",
      description: "Keyword research and content optimization",
      status: "active",
      color: "text-green-500",
      href: "/business/seo",
      features: ["Keyword research", "Content analyzer", "Backlink tracking", "Site health score"],
    },
    {
      icon: TrendingUp,
      title: "Daily Trend Analyzer",
      description: "Market trends and competitor intelligence",
      status: "active",
      color: "text-orange-500",
      href: "/business/trends",
      features: ["Google Trends integration", "Competitor analysis", "Opportunity alerts", "Daily digest"],
    },
    {
      icon: Link2,
      title: "Affiliate Marketing",
      description: "Link tracking and commission management",
      status: "active",
      color: "text-cyan-500",
      href: "/business/affiliate",
      features: ["Link generator", "Click tracking", "Commission calculator", "Affiliate dashboard"],
    },
    {
      icon: DollarSign,
      title: "Passive Income Generator",
      description: "Automated sales funnels and digital products",
      status: "active",
      color: "text-emerald-500",
      href: "/business/passive-income",
      features: ["Sales funnel builder", "Digital product marketplace", "Email automation", "Revenue tracking"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_240)] via-[oklch(0.14_0.03_260)] to-[oklch(0.12_0.02_240)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-2">
            Business Hub
          </h1>
          <p className="text-[oklch(0.78_0.08_240)]">
            Complete business operating system - All tools in one place
          </p>
        </div>

        {/* Legal Notice */}
        <Card className="mb-8 border-2 border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[oklch(0.95_0_0)] mb-2">Important Legal Notice</h3>
                <p className="text-sm text-[oklch(0.78_0.08_240)] mb-3">
                  Features marked with ⚠️ provide <strong>educational information only</strong> and do not constitute professional advice.
                  Kaiden suggests possible benefits with citations, but YOU must verify each suggestion applies to your specific situation
                  and consult licensed professionals before making decisions.
                </p>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-500/30"
                    onClick={() => window.open('/chat?mode=accountant', '_blank')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    AI Accountant
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-500/30"
                    onClick={() => window.open('/chat?mode=lawyer', '_blank')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    AI Lawyer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-500/30"
                    onClick={() => window.open('https://www.irs.gov/tax-professionals/choosing-a-tax-professional', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Find Local Professionals
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link key={idx} href={feature.href}>
                <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20 hover:border-[oklch(0.72_0.18_200)]/40 transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-lg bg-[oklch(0.20_0.03_240)] border border-[oklch(0.78_0.08_240)]/10 group-hover:border-[oklch(0.72_0.18_200)]/30 transition-colors`}>
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div className="flex gap-2">
                        {feature.disclaimer && (
                          <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 text-xs">
                            ⚠️
                          </Badge>
                        )}
                        {feature.status === "active" && (
                          <Badge variant="default" className="bg-green-500/20 text-green-400 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-[oklch(0.95_0_0)] group-hover:text-[oklch(0.72_0.18_200)] transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-[oklch(0.78_0.08_240)]">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[oklch(0.78_0.08_240)] mb-2">KEY FEATURES:</div>
                      <ul className="space-y-1">
                        {feature.features.map((f, i) => (
                          <li key={i} className="text-sm text-[oklch(0.78_0.08_240)] flex items-center gap-2">
                            <Zap className="w-3 h-3 text-[oklch(0.72_0.18_200)]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[oklch(0.95_0_0)]">8</div>
              <div className="text-sm text-[oklch(0.78_0.08_240)]">Business Tools</div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[oklch(0.95_0_0)]">24/7</div>
              <div className="text-sm text-[oklch(0.78_0.08_240)]">AI Automation</div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[oklch(0.95_0_0)]">100%</div>
              <div className="text-sm text-[oklch(0.78_0.08_240)]">Source Citations</div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[oklch(0.95_0_0)]">∞</div>
              <div className="text-sm text-[oklch(0.78_0.08_240)]">Growth Potential</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
