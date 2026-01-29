import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
  FileText,
  Target,
  GitBranch
} from "lucide-react";

export default function ProjectManager() {
  const projectStats = [
    { label: "Active Projects", value: "12", icon: FolderKanban, color: "text-blue-500" },
    { label: "Completed Tasks", value: "87", icon: CheckCircle2, color: "text-green-500" },
    { label: "In Progress", value: "24", icon: Clock, color: "text-orange-500" },
    { label: "Overdue", value: "3", icon: AlertCircle, color: "text-red-500" },
  ];

  const capabilities = [
    {
      category: "Project Planning",
      icon: Target,
      features: [
        "Create and manage multiple projects",
        "Set project milestones and deadlines",
        "Define project scope and objectives",
        "Create project roadmaps and timelines",
        "Allocate resources and budget",
        "Set up project templates for recurring work",
        "Track project dependencies",
        "Manage project risks and issues",
        "Create work breakdown structures (WBS)",
        "Set up project approval workflows"
      ]
    },
    {
      category: "Task Management",
      icon: CheckCircle2,
      features: [
        "Create and assign tasks to team members",
        "Set task priorities and due dates",
        "Track task progress and status",
        "Create subtasks and checklists",
        "Set task dependencies and blockers",
        "Add tags and labels for organization",
        "Attach files and documents to tasks",
        "Set recurring tasks and reminders",
        "Track time spent on each task",
        "Comment and collaborate on tasks"
      ]
    },
    {
      category: "Team Collaboration",
      icon: Users,
      features: [
        "Invite team members and assign roles",
        "Set permissions and access levels",
        "Share project updates and announcements",
        "Real-time chat and messaging",
        "Video conferencing integration",
        "Document sharing and collaboration",
        "Team calendar and scheduling",
        "Mention team members in comments",
        "Create team workspaces",
        "Track team availability and workload"
      ]
    },
    {
      category: "Reporting & Analytics",
      icon: TrendingUp,
      features: [
        "Generate project status reports",
        "Track time and budget utilization",
        "Monitor team productivity metrics",
        "View project timeline and Gantt charts",
        "Create custom dashboards",
        "Export reports in multiple formats",
        "Track milestone completion rates",
        "Analyze resource allocation",
        "Monitor project health indicators",
        "Generate burndown and burnup charts"
      ]
    },
    {
      category: "Integrations",
      icon: GitBranch,
      features: [
        "Connect with GitHub and GitLab",
        "Integrate with Slack and Microsoft Teams",
        "Sync with Google Calendar and Outlook",
        "Connect with Jira and Trello",
        "Integrate with time tracking tools",
        "Connect with file storage (Dropbox, Google Drive)",
        "Integrate with email clients",
        "Connect with CRM systems",
        "API access for custom integrations",
        "Zapier and automation support"
      ]
    },
    {
      category: "Document Management",
      icon: FileText,
      features: [
        "Centralized document repository",
        "Version control for documents",
        "Document templates and libraries",
        "Collaborative document editing",
        "File sharing and permissions",
        "Document approval workflows",
        "Full-text search across documents",
        "Document tagging and categorization",
        "Automatic file organization",
        "Document retention policies"
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
            Plan, track, and deliver projects with complete visibility
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
                Ready to Streamline Your Project Management?
              </h3>
              <p className="text-white/80 mb-4">
                Keep your projects on track with powerful planning, collaboration, and reporting tools.
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
