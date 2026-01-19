import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  BarChart3,
  Zap,
  Calendar,
  MessageSquare
} from "lucide-react";

export default function Sales() {
  const salesStats = [
    { label: "Pipeline Value", value: "$1.2M", icon: DollarSign, color: "text-green-500" },
    { label: "Active Leads", value: "234", icon: Users, color: "text-blue-500" },
    { label: "Conversion Rate", value: "32%", icon: TrendingUp, color: "text-purple-500" },
    { label: "Deals Closed (30d)", value: "18", icon: Target, color: "text-cyan-500" },
  ];

  const capabilities = [
    {
      category: "Lead Management",
      icon: Users,
      features: [
        "Capture leads from website forms, emails, and calls",
        "Automatically score and prioritize leads",
        "Enrich lead data with company and contact info",
        "Assign leads to sales reps based on territory/rules",
        "Track lead source and attribution",
        "Nurture leads with automated email sequences",
        "Identify hot leads ready to buy",
        "Prevent lead duplication and conflicts",
        "Import leads from LinkedIn, trade shows, ads",
        "Send lead alerts and notifications to reps"
      ]
    },
    {
      category: "Pipeline & Opportunity Management",
      icon: BarChart3,
      features: [
        "Visualize sales pipeline with drag-and-drop stages",
        "Track deal progress and next steps",
        "Set close dates and probability scores",
        "Forecast revenue based on pipeline",
        "Identify stuck deals and bottlenecks",
        "Manage multiple products and pricing tiers",
        "Track competitors and win/loss reasons",
        "Create custom sales stages and workflows",
        "Monitor deal velocity and cycle time",
        "Generate pipeline reports and dashboards"
      ]
    },
    {
      category: "Contact & Account Management",
      icon: Phone,
      features: [
        "Store unlimited contacts with full history",
        "Link contacts to accounts and opportunities",
        "Track all interactions (calls, emails, meetings)",
        "Set reminders for follow-ups and tasks",
        "Segment contacts by industry, size, location",
        "Manage buying committees and decision makers",
        "Track relationships and org charts",
        "Sync contacts with email and calendar",
        "Identify upsell and cross-sell opportunities",
        "Monitor account health and engagement"
      ]
    },
    {
      category: "Proposals & Quotes",
      icon: FileText,
      features: [
        "Generate professional proposals in minutes",
        "Create custom quote templates with branding",
        "Add products, pricing, and discounts",
        "Include terms, conditions, and legal language",
        "Send proposals via email with tracking",
        "Track when proposals are opened and viewed",
        "Enable e-signatures for instant acceptance",
        "Configure approval workflows for discounts",
        "Version control and proposal history",
        "Convert accepted proposals to orders"
      ]
    },
    {
      category: "Email & Communication",
      icon: Mail,
      features: [
        "Send personalized emails at scale",
        "Create email templates and sequences",
        "Track email opens, clicks, and replies",
        "Schedule emails for optimal send times",
        "Automate follow-up emails based on behavior",
        "Integrate with Gmail, Outlook, and SMTP",
        "Log all emails automatically in CRM",
        "Use merge fields for personalization",
        "A/B test subject lines and content",
        "Manage email unsubscribes and compliance"
      ]
    },
    {
      category: "Calling & Meetings",
      icon: Phone,
      features: [
        "Make calls directly from CRM with click-to-dial",
        "Record and transcribe sales calls",
        "Log call notes and outcomes automatically",
        "Schedule meetings with calendar integration",
        "Send meeting invites and reminders",
        "Conduct video calls with screen sharing",
        "Track call duration and frequency",
        "Create call scripts and talk tracks",
        "Analyze call sentiment and keywords",
        "Generate call reports and coaching insights"
      ]
    },
    {
      category: "Sales Automation",
      icon: Zap,
      features: [
        "Automate lead assignment and routing",
        "Trigger actions based on lead behavior",
        "Send automated email sequences (drip campaigns)",
        "Create workflows for deal progression",
        "Auto-update fields based on rules",
        "Schedule tasks and reminders automatically",
        "Sync data between CRM and other tools",
        "Automate data entry and enrichment",
        "Set up escalation rules for stalled deals",
        "Build custom automation with no code"
      ]
    },
    {
      category: "Reporting & Analytics",
      icon: BarChart3,
      features: [
        "Track sales performance by rep and team",
        "Monitor key metrics (win rate, deal size, velocity)",
        "Forecast revenue with AI-powered predictions",
        "Analyze sales trends and patterns",
        "Identify top-performing products and regions",
        "Create custom reports and dashboards",
        "Export data to Excel, PDF, or BI tools",
        "Schedule automated report delivery",
        "Track activity metrics (calls, emails, meetings)",
        "Benchmark performance against goals"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_240)] via-[oklch(0.14_0.03_260)] to-[oklch(0.12_0.02_240)] p-8 relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity: 0.3,
          filter: 'blur(4px)',
          zIndex: 0
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/grok-video-8a01fda2-d9ef-4065-a2f7-104de5fe0d0c.mp4" type="video/mp4" />
      </video>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-2">
            Sales & CRM
          </h1>
          <p className="text-[oklch(0.78_0.08_240)]">
            Complete sales solution from lead to close
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {salesStats.map((stat, index) => (
            <Card key={index} className="bg-[oklch(0.16_0.02_240)]/50 border-[oklch(0.78_0.08_240)]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[oklch(0.78_0.08_240)] mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[oklch(0.95_0_0)]">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Capabilities Sections */}
        <div className="space-y-6">
          {capabilities.map((section, index) => (
            <Card key={index} className="bg-[oklch(0.16_0.02_240)]/50 border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] rounded-lg">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-[oklch(0.95_0_0)]">{section.category}</CardTitle>
                    <CardDescription className="text-[oklch(0.78_0.08_240)]">
                      {section.features.length} capabilities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[oklch(0.85_0.05_240)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to Close More Deals?
              </h3>
              <p className="text-white/80 mb-4">
                Kaiden automates your entire sales process from first contact to signed contract.
              </p>
              <Button size="lg" variant="outline" className="bg-white text-[oklch(0.72_0.18_200)] hover:bg-white/90">
                Start Selling with Kaiden
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
