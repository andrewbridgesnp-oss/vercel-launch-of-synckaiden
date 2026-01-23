import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  ClipboardList,
  Workflow,
  BarChart3,
  FileText,
  Clock,
  Target,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Settings
} from "lucide-react";

export default function BusinessOperationsHub() {
  const [workspaceId] = useState(1);

  // Fetch aggregated business stats
  const { data: projectStats } = trpc.projectManager.getStats.useQuery({ workspaceId });
  const { data: employeeStats } = trpc.employeeOs.getStats.useQuery({ workspaceId });
  const { data: timeStats } = trpc.timeTracker.getStats.useQuery({ workspaceId });

  const apps = [
    {
      id: "business-hub",
      name: "Business Hub",
      description: "Central operations dashboard",
      icon: Building2,
      href: "/business",
      stats: [],
      color: "bg-blue-500"
    },
    {
      id: "business-command",
      name: "Business Command",
      description: "Strategic planning and execution",
      icon: Target,
      href: "/business-command",
      stats: [],
      color: "bg-purple-500"
    },
    {
      id: "project-manager",
      name: "Project Manager",
      description: "Manage projects and tasks",
      icon: ClipboardList,
      href: "/project-manager",
      stats: projectStats ? [
        { label: "Active Projects", value: projectStats.activeProjects || 0 },
        { label: "Tasks", value: projectStats.totalTasks || 0 },
        { label: "Completion", value: `${(projectStats.completionRate || 0).toFixed(1)}%` }
      ] : [],
      color: "bg-green-500"
    },
    {
      id: "workflows",
      name: "Workflow Automation",
      description: "Automate business processes",
      icon: Workflow,
      href: "/workflows",
      stats: [],
      color: "bg-orange-500"
    },
    {
      id: "employee-os",
      name: "Employee OS",
      description: "HR and team management",
      icon: Users,
      href: "/employees",
      stats: employeeStats ? [
        { label: "Total Employees", value: employeeStats.totalEmployees || 0 },
        { label: "Active", value: employeeStats.activeEmployees || 0 },
        { label: "Departments", value: employeeStats.departmentCount || 0 }
      ] : [],
      color: "bg-cyan-500"
    },
    {
      id: "time-tracker",
      name: "Time Tracker",
      description: "Track time and productivity",
      icon: Clock,
      href: "/time-tracker",
      stats: timeStats ? [
        { label: "This Week", value: `${(timeStats.weeklyHours || 0).toFixed(1)}h` },
        { label: "Billable", value: `${(timeStats.billableHours || 0).toFixed(1)}h` },
        { label: "Rate", value: `$${(timeStats.avgRate || 0).toFixed(0)}/h` }
      ] : [],
      color: "bg-indigo-500"
    },
    {
      id: "analytics",
      name: "Business Analytics",
      description: "Performance metrics and insights",
      icon: BarChart3,
      href: "/analytics",
      stats: [],
      color: "bg-pink-500"
    },
    {
      id: "llc-formation",
      name: "LLC Formation",
      description: "Business entity setup",
      icon: FileText,
      href: "/llc-formation",
      stats: [],
      color: "bg-teal-500"
    },
    {
      id: "business-tools",
      name: "Business Tools",
      description: "Essential business utilities",
      icon: Briefcase,
      href: "/business-tools",
      stats: [],
      color: "bg-red-500"
    },
    {
      id: "cost-reduction",
      name: "Cost Reduction",
      description: "Identify savings opportunities",
      icon: TrendingUp,
      href: "/cost-reduction",
      stats: [],
      color: "bg-emerald-500"
    }
  ];

  // Calculate platform-wide metrics
  const activeProjects = projectStats?.activeProjects || 0;
  const totalEmployees = employeeStats?.totalEmployees || 0;
  const weeklyHours = timeStats?.weeklyHours || 0;
  const completionRate = projectStats?.completionRate || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Business Operations Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete business management and operations platform
          </p>
        </div>

        {/* Operations Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">Total employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyHours.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Project success</p>
            </CardContent>
          </Card>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link key={app.id} href={app.href}>
                <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${app.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                        <Icon className={`h-6 w-6 ${app.color.replace('bg-', 'text-')}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="mt-4">{app.name}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </CardHeader>
                  {app.stats.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        {app.stats.map((stat, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{stat.label}</span>
                            <span className="font-semibold">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common business operations tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/project-manager">
                  <Button variant="outline" className="w-full">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </Link>
                <Link href="/employees">
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </Link>
                <Link href="/workflows">
                  <Button variant="outline" className="w-full">
                    <Workflow className="mr-2 h-4 w-4" />
                    Create Workflow
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
