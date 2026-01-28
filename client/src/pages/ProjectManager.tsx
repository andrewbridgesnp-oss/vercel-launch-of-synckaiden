import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Users,
  Calendar,
  CheckSquare,
  TrendingUp,
  Clock,
  Target,
  FileText,
  MessageSquare,
  GitBranch,
  BarChart3,
  Zap
} from "lucide-react";

export default function ProjectManager() {

  const projectStats = [
    { label: "Active Projects", value: "12", icon: FolderKanban, color: "text-blue-500" },
    { label: "Tasks Completed", value: "247", icon: CheckSquare, color: "text-green-500" },
    { label: "Team Members", value: "18", icon: Users, color: "text-purple-500" },
    { label: "On Track", value: "92%", icon: TrendingUp, color: "text-cyan-500" },
  ];

  const capabilities = [
    {
      category: "Project Planning",
      icon: Target,
      features: [
        "Create projects with goals, timelines, and budgets",
        "Break down projects into phases and milestones",
        "Set dependencies between tasks",
        "Assign team members and define roles",
        "Resource allocation and capacity planning",
        "Risk assessment and mitigation planning",
        "Generate Gantt charts and timelines",
        "Budget tracking and forecasting",
        "Define project scope and requirements",
        "Create project templates for recurring work"
      ]
    },
    {
      category: "Task Management",
      icon: CheckSquare,
      features: [
        "Create and assign tasks with priorities",
        "Set due dates and reminders",
        "Track task status (To-Do, In Progress, Done)",
        "Add subtasks and checklists",
        "Attach files, links, and documentation",
        "Tag tasks by category or department",
        "Track time spent on each task",
        "Set recurring tasks and templates",
        "Bulk task operations and updates",
        "Task dependencies and blocking issues"
      ]
    },
    {
      category: "Team Collaboration",
      icon: Users,
      features: [
        "Team member directory with roles",
        "Real-time collaboration on tasks",
        "Comment threads and @mentions",
        "File sharing and version control",
        "Team calendar and availability",
        "Video conferencing integration",
        "Shared workspaces and boards",
        "Activity feeds and notifications",
        "Permission levels and access control",
        "Team performance metrics"
      ]
    },
    {
      category: "Workflow Automation",
      icon: Zap,
      features: [
        "Automated task assignments based on rules",
        "Status change notifications",
        "Recurring task creation",
        "Deadline reminders and escalations",
        "Integration with email and calendars",
        "Custom workflow templates",
        "Automated reporting and updates",
        "Trigger actions based on events",
        "Bulk operations and batch processing",
        "Integration with third-party tools"
      ]
    },
    {
      category: "Progress Tracking",
      icon: BarChart3,
      features: [
        "Real-time project status dashboards",
        "Track progress against milestones",
        "Burndown and burnup charts",
        "Time tracking and timesheets",
        "Budget vs. actual cost analysis",
        "Resource utilization reports",
        "Velocity and productivity metrics",
        "Custom KPI dashboards",
        "Project health scores",
        "Identify bottlenecks and delays"
      ]
    },
    {
      category: "Reporting & Analytics",
      icon: FileText,
      features: [
        "Generate project status reports",
        "Export data to Excel, PDF, CSV",
        "Custom report builder",
        "Executive summaries and highlights",
        "Team performance reports",
        "Time and expense reports",
        "Portfolio-level analytics",
        "Trend analysis and forecasting",
        "Automated report scheduling",
        "Shareable report links"
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
            Project Manager
          </h1>
          <p className="text-[oklch(0.78_0.08_240)]">
            Plan, execute, and track projects with precision
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {projectStats.map((stat, index) => (
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
                      <CheckSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
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
                Ready to Master Project Management?
              </h3>
              <p className="text-white/80 mb-4">
                Kaiden helps you plan, execute, and deliver projects on time and within budget.
              </p>
              <Button size="lg" variant="outline" className="bg-white text-[oklch(0.72_0.18_200)] hover:bg-white/90">
                Start Managing Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
