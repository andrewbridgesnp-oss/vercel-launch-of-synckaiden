import { useState } from "react";
import { CheckCircle2, Circle, Phone, Pause, Play, AlertTriangle } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { StatusBadge } from "../components/avery/status-badge";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Progress } from "../components/ui/progress";

export function QAControlPage() {
  const [trialMode, setTrialMode] = useState(true);
  const [averyPaused, setAveryPaused] = useState(false);

  const qaChecklist = [
    { id: 1, task: "Create account", status: "completed", critical: true },
    { id: 2, task: "Complete onboarding", status: "completed", critical: true },
    { id: 3, task: "Add business phone", status: "completed", critical: true },
    { id: 4, task: "Configure services", status: "completed", critical: true },
    { id: 5, task: "Place test call", status: "completed", critical: true },
    { id: 6, task: "Book appointment via call", status: "completed", critical: true },
    { id: 7, task: "Send payment link", status: "completed", critical: true },
    { id: 8, task: "Process test payment", status: "pending", critical: true },
    { id: 9, task: "View call logs", status: "completed", critical: false },
    { id: 10, task: "Listen to recording", status: "completed", critical: false },
    { id: 11, task: "Review transcript", status: "completed", critical: false },
    { id: 12, task: "Resend confirmation", status: "pending", critical: false },
    { id: 13, task: "Handle failed payment", status: "pending", critical: false },
    { id: 14, task: "Export data", status: "not-started", critical: false }
  ];

  const completedTasks = qaChecklist.filter(t => t.status === "completed").length;
  const completionPercentage = (completedTasks / qaChecklist.length) * 100;

  const criticalIssues = [
    {
      severity: "high",
      issue: "Payment processing integration not fully tested",
      status: "pending",
      action: "Complete test payment flow"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">QA & Launch Control Center</h1>
        <p className="text-muted-foreground">Pre-launch testing and operational controls</p>
      </div>

      {/* Overall Progress */}
      <GlassmorphismCard className="p-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Launch Readiness</h2>
            <span className="text-3xl font-bold text-accent">{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedTasks} of {qaChecklist.length} checks complete</span>
            <span>{qaChecklist.filter(t => t.status === "pending").length} pending</span>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Critical Issues */}
      {criticalIssues.length > 0 && (
        <GlassmorphismCard className="p-6 border-2 border-yellow-500/50 bg-yellow-500/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-4">Critical Issues</h3>
              <div className="space-y-3">
                {criticalIssues.map((issue, i) => (
                  <div key={i} className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="font-medium">{issue.issue}</p>
                      <StatusBadge status={issue.status as any} />
                    </div>
                    <p className="text-sm text-muted-foreground">Action: {issue.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassmorphismCard>
      )}

      {/* Launch Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trial Mode */}
        <GlassmorphismCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Trial Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Safe testing environment with limited functionality
                </p>
              </div>
              <Switch checked={trialMode} onCheckedChange={setTrialMode} />
            </div>
            {trialMode && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <StatusBadge status="trial" />
                <p className="text-xs text-muted-foreground mt-2">
                  14 days remaining • Payments limited to $1 test transactions
                </p>
              </div>
            )}
          </div>
        </GlassmorphismCard>

        {/* Pause Avery */}
        <GlassmorphismCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Pause Avery</h3>
                <p className="text-sm text-muted-foreground">
                  Temporarily stop call handling
                </p>
              </div>
              <Switch checked={averyPaused} onCheckedChange={setAveryPaused} />
            </div>
            {averyPaused && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <Pause className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-500">Avery is currently paused</p>
              </div>
            )}
          </div>
        </GlassmorphismCard>
      </div>

      {/* Emergency Fallback */}
      <GlassmorphismCard className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Emergency Fallback Number</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If Avery encounters an issue, calls will be forwarded to this number
          </p>
          <div className="flex gap-3">
            <input
              type="tel"
              className="flex-1 px-4 py-2 bg-muted/30 border border-border rounded-lg"
              placeholder="+1 (555) 999-9999"
              defaultValue="+1 (555) 100-2000"
            />
            <Button variant="outline">Update</Button>
          </div>
        </div>
      </GlassmorphismCard>

      {/* QA Checklist */}
      <GlassmorphismCard className="p-6">
        <h2 className="text-2xl font-bold mb-6">Pre-Launch Checklist</h2>
        
        {/* Critical Tasks */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Critical Tasks
          </h3>
          <div className="space-y-2">
            {qaChecklist.filter(t => t.critical).map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-4 rounded-lg border ${
                  task.status === "completed"
                    ? "bg-green-500/5 border-green-500/20"
                    : task.status === "pending"
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : "bg-muted/30 border-border"
                }`}
              >
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <span className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                  {task.task}
                </span>
                {task.status === "pending" && (
                  <Button size="sm" variant="outline" className="ml-auto">
                    Test Now
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Optional Tasks */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Optional Tasks</h3>
          <div className="space-y-2">
            {qaChecklist.filter(t => !t.critical).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/20"
              >
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <span className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                  {task.task}
                </span>
              </div>
            ))}
          </div>
        </div>
      </GlassmorphismCard>

      {/* Launch Button */}
      <div className="text-center">
        <GlassmorphismCard className="p-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Go Live?</h2>
          <p className="text-muted-foreground mb-6">
            {completionPercentage === 100
              ? "All critical checks are complete. You're ready to launch!"
              : `Complete ${qaChecklist.filter(t => t.critical && t.status !== "completed").length} more critical tasks before launching.`}
          </p>
          <Button
            size="lg"
            disabled={completionPercentage !== 100}
            className="text-lg px-8 py-6"
          >
            {completionPercentage === 100 ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Launch Avery
              </>
            ) : (
              "Complete Critical Tasks First"
            )}
          </Button>
        </GlassmorphismCard>
      </div>
    </div>
  );
}
