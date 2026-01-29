import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  BarChart3,
  Target,
  Timer
} from "lucide-react";

export default function TimeTracker() {
  const timeStats = [
    { label: "Hours Today", value: "6.5h", icon: Clock, color: "text-blue-500" },
    { label: "This Week", value: "32h", icon: Calendar, color: "text-green-500" },
    { label: "Billable Hours", value: "24h", icon: DollarSign, color: "text-purple-500" },
    { label: "Active Tasks", value: "8", icon: Target, color: "text-orange-500" },
  ];

  const capabilities = [
    {
      category: "Time Tracking",
      icon: Timer,
      features: [
        "Start and stop timers with one click",
        "Manual time entry for past work",
        "Track time across multiple projects",
        "Categorize time by task or activity",
        "Set up favorite tasks for quick access",
        "Track billable vs non-billable hours",
        "Add notes and descriptions to time entries",
        "Edit and adjust time entries",
        "Track time offline with auto-sync",
        "Set up time rounding rules"
      ]
    },
    {
      category: "Project & Task Management",
      icon: Target,
      features: [
        "Organize time by projects and clients",
        "Create and assign tasks",
        "Set project budgets and time estimates",
        "Track time against estimates",
        "Set up recurring tasks",
        "Tag and categorize time entries",
        "Create project templates",
        "Track project profitability",
        "Set up project milestones",
        "Monitor project progress"
      ]
    },
    {
      category: "Reporting & Analytics",
      icon: BarChart3,
      features: [
        "Generate detailed time reports",
        "View time summaries by project, client, or task",
        "Track productivity trends over time",
        "Analyze billable vs non-billable ratios",
        "Export reports to PDF, CSV, or Excel",
        "Create custom report templates",
        "View daily, weekly, and monthly summaries",
        "Track team time and productivity",
        "Compare actual vs estimated time",
        "Generate visual charts and graphs"
      ]
    },
    {
      category: "Invoicing & Billing",
      icon: DollarSign,
      features: [
        "Convert tracked time to invoices",
        "Set hourly rates per project or task",
        "Calculate invoice totals automatically",
        "Add expenses to invoices",
        "Generate professional invoices",
        "Track invoice status (sent, paid, overdue)",
        "Send invoice reminders",
        "Accept online payments",
        "Track payment history",
        "Generate billing reports"
      ]
    },
    {
      category: "Team Management",
      icon: CheckCircle2,
      features: [
        "Track team member time and attendance",
        "Set up team schedules and shifts",
        "Monitor team productivity",
        "Approve or reject timesheets",
        "Set up overtime tracking",
        "Track PTO and leave balances",
        "View team availability",
        "Set up time tracking policies",
        "Generate team performance reports",
        "Track labor costs per project"
      ]
    },
    {
      category: "Integrations & Automation",
      icon: TrendingUp,
      features: [
        "Integrate with project management tools",
        "Connect with accounting software (QuickBooks, Xero)",
        "Sync with calendar apps",
        "Integrate with payroll systems",
        "Connect with invoicing platforms",
        "API access for custom integrations",
        "Automatic time entry from calendar events",
        "Slack and email notifications",
        "Browser extensions for time tracking",
        "Mobile apps for iOS and Android"
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
        <source src="/grok-video-b0edb8c7-fea2-41fb-aacd-a0bd3c14f30f.mp4" type="video/mp4" />
      </video>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-2">
            Time Tracker
          </h1>
          <p className="text-[oklch(0.78_0.08_240)]">
            Track time, boost productivity, and bill accurately
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {timeStats.map((stat, index) => (
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
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
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
                Ready to Take Control of Your Time?
              </h3>
              <p className="text-white/80 mb-4">
                Track every minute, maximize billable hours, and get insights into your productivity.
              </p>
              <Button size="lg" variant="outline" className="bg-white text-[oklch(0.72_0.18_200)] hover:bg-white/90">
                Start Tracking Time
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
