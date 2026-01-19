import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target
} from "lucide-react";

export default function Employees() {
  const [activeTab, setActiveTab] = useState("overview");

  const employeeStats = [
    { label: "Total Employees", value: "47", icon: Users, color: "text-blue-500" },
    { label: "New Hires (30d)", value: "5", icon: UserPlus, color: "text-green-500" },
    { label: "Avg Performance", value: "4.2/5", icon: TrendingUp, color: "text-purple-500" },
    { label: "Payroll This Month", value: "$127K", icon: DollarSign, color: "text-cyan-500" },
  ];

  const capabilities = [
    {
      category: "Hiring & Onboarding",
      icon: UserPlus,
      features: [
        "Post job listings to multiple platforms automatically",
        "Screen resumes with AI-powered keyword matching",
        "Schedule interviews and send calendar invites",
        "Conduct video interviews with recording",
        "Automated background checks and reference verification",
        "Generate offer letters and employment contracts",
        "Digital onboarding workflows with e-signatures",
        "Assign training modules and track completion",
        "Setup payroll, benefits, and system access",
        "Send welcome packages and company swag"
      ]
    },
    {
      category: "Scheduling & Time Tracking",
      icon: Calendar,
      features: [
        "Create and manage employee schedules",
        "Handle shift swaps and time-off requests",
        "Track clock-in/clock-out times automatically",
        "Monitor overtime and break compliance",
        "Integrate with calendar apps (Google, Outlook)",
        "Send shift reminders and notifications",
        "Manage PTO balances and accruals",
        "Generate timesheets for payroll",
        "Track remote work hours",
        "Handle multi-location scheduling"
      ]
    },
    {
      category: "Payroll & Benefits",
      icon: DollarSign,
      features: [
        "Process payroll automatically (weekly, bi-weekly, monthly)",
        "Calculate taxes, deductions, and withholdings",
        "Direct deposit and pay stub generation",
        "Manage benefits enrollment and changes",
        "Track 401(k) contributions and matching",
        "Handle health insurance, dental, vision",
        "Manage HSA/FSA accounts",
        "Process bonuses and commissions",
        "Generate W-2s and 1099s",
        "Compliance with labor laws and regulations"
      ]
    },
    {
      category: "Performance Management",
      icon: Award,
      features: [
        "Set goals and track OKRs (Objectives & Key Results)",
        "Conduct 360-degree performance reviews",
        "Schedule and document 1-on-1 meetings",
        "Track KPIs and productivity metrics",
        "Identify top performers and growth opportunities",
        "Create performance improvement plans (PIPs)",
        "Manage promotions and salary adjustments",
        "Recognize achievements and milestones",
        "Collect peer feedback and testimonials",
        "Generate performance reports and analytics"
      ]
    },
    {
      category: "Training & Development",
      icon: Target,
      features: [
        "Create custom training programs and courses",
        "Assign mandatory compliance training",
        "Track certifications and renewals",
        "Provide skill development recommendations",
        "Manage tuition reimbursement programs",
        "Host webinars and workshops",
        "Create knowledge bases and documentation",
        "Track training completion and scores",
        "Identify skill gaps across teams",
        "Build career development paths"
      ]
    },
    {
      category: "HR Administration",
      icon: FileText,
      features: [
        "Maintain digital employee records",
        "Manage employee handbooks and policies",
        "Handle disciplinary actions and documentation",
        "Process terminations and exit interviews",
        "Manage COBRA and unemployment claims",
        "Track employee demographics and diversity",
        "Handle workplace injury reports (OSHA)",
        "Manage employee complaints and grievances",
        "Conduct employee surveys and pulse checks",
        "Generate HR compliance reports"
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
            Employee Management
          </h1>
          <p className="text-[oklch(0.78_0.08_240)]">
            Complete HR solution from hiring to retirement
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {employeeStats.map((stat, index) => (
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
                Ready to Transform Your HR Operations?
              </h3>
              <p className="text-white/80 mb-4">
                Kaiden handles everything from hiring to payroll, so you can focus on growing your team.
              </p>
              <Button size="lg" variant="outline" className="bg-white text-[oklch(0.72_0.18_200)] hover:bg-white/90">
                Start Managing Employees
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
