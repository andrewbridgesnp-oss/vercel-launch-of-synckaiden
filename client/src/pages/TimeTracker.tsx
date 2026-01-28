import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  DollarSign,
  Timer,
  FileText,
  Users,
  BarChart3,
  CheckCircle,
  Target
} from "lucide-react";

export default function TimeTracker() {

  const timeStats = [
    { label: "Hours This Week", value: "38.5", icon: Clock, color: "text-blue-500" },
    { label: "Billable Hours", value: "32", icon: DollarSign, color: "text-green-500" },
    { label: "Active Projects", value: "5", icon: Target, color: "text-purple-500" },
    { label: "Team Hours", value: "247", icon: Users, color: "text-cyan-500" },
  ];

  const capabilities = [
    {
      category: "Time Tracking",
      icon: Timer,
      features: [
        "One-click time tracking with play/pause",
        "Manual time entry and adjustments",
        "Track time by project, task, or client",
        "Multiple timers for multitasking",
        "Idle time detection and alerts",
        "Offline time tracking with sync",
        "Time tracking reminders",
        "Browser extension for quick tracking",
        "Mobile app for on-the-go tracking",
        "Automatic time rounding and rules"
      ]
    },
    {
      category: "Timesheets",
      icon: FileText,
      features: [
        "Daily, weekly, and monthly timesheets",
        "Visual timesheet calendar view",
        "Bulk time entry and editing",
        "Timesheet approval workflows",
        "Lock and unlock timesheets",
        "Time entry validation rules",
        "Copy previous week timesheets",
        "Notes and descriptions per entry",
        "Attachment support for receipts",
        "Export timesheets to Excel, PDF"
      ]
    },
    {
      category: "Project & Task Tracking",
      icon: Target,
      features: [
        "Assign time to specific projects",
        "Track time by task and subtask",
        "Project budgets and time limits",
        "Task estimates vs. actual time",
        "Project progress tracking",
        "Client and matter-based tracking",
        "Custom project categories",
        "Project time reports",
        "Budget burn rate alerts",
        "Time allocation across projects"
      ]
    },
    {
      category: "Billing & Invoicing",
      icon: DollarSign,
      features: [
        "Track billable vs. non-billable hours",
        "Set hourly rates by person or project",
        "Generate invoices from tracked time",
        "Automatic invoice creation",
        "Custom invoice templates",
        "Multiple currencies support",
        "Payment tracking and receipts",
        "Client billing reports",
        "Expense tracking and reimbursement",
        "Integration with accounting software"
      ]
    },
    {
      category: "Team Management",
      icon: Users,
      features: [
        "View team member time tracking",
        "Team capacity and utilization",
        "Schedule and availability tracking",
        "Overtime and break monitoring",
        "Timesheet approval for managers",
        "Team performance metrics",
        "Compare planned vs. actual hours",
        "Time-off and PTO tracking",
        "Labor cost calculations",
        "Team productivity insights"
      ]
    },
    {
      category: "Reporting & Analytics",
      icon: BarChart3,
      features: [
        "Detailed time tracking reports",
        "Project profitability analysis",
        "Client and project summaries",
        "Time distribution charts",
        "Productivity and efficiency metrics",
        "Custom report builder",
        "Scheduled automated reports",
        "Export to Excel, CSV, PDF",
        "Dashboard with key metrics",
        "Historical trend analysis"
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
                Ready to Take Control of Your Time?
              </h3>
              <p className="text-white/80 mb-4">
                Kaiden makes time tracking effortless, so you can focus on what matters most.
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
