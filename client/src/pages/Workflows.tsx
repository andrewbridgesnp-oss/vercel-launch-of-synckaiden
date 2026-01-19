import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Zap, 
  Mail, 
  MessageSquare, 
  Bell, 
  UserCheck, 
  Webhook,
  CheckCircle2,
  XCircle,
  Clock,
  Activity
} from "lucide-react";
import { VisualWorkflowCanvas } from "@/components/VisualWorkflowCanvas";


export default function Workflows() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  const { data: workflows = [], refetch } = trpc.workflows.list.useQuery();
  const { data: templates = [] } = trpc.workflows.getTemplates.useQuery();
  const { data: logs = [] } = trpc.workflows.getAllLogs.useQuery();

  const createMutation = trpc.workflows.create.useMutation({
    onSuccess: () => {
      alert("Workflow created successfully!");
      setIsCreateOpen(false);
      refetch();
    },
    onError: (error) => {
      alert(`Failed to create workflow: ${error.message}`);
    },
  });

  const toggleMutation = trpc.workflows.toggle.useMutation({
    onSuccess: () => {
      // Workflow status updated
      refetch();
    },
  });

  const deleteMutation = trpc.workflows.delete.useMutation({
    onSuccess: () => {
      alert("Workflow deleted");
      refetch();
    },
  });

  const executeMutation = trpc.workflows.execute.useMutation({
    onSuccess: (result) => {
      alert(`Workflow executed: ${result.status}, Time: ${result.executionTime}ms`);
      refetch();
    },
    onError: (error) => {
      alert(`Execution failed: ${error.message}`);
    },
  });

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "lead_captured": return <UserCheck className="w-4 h-4" />;
      case "appointment_scheduled": return <Clock className="w-4 h-4" />;
      case "order_placed": return <CheckCircle2 className="w-4 h-4" />;
      case "payment_received": return <CheckCircle2 className="w-4 h-4" />;
      case "email_opened": return <Mail className="w-4 h-4" />;
      case "campaign_sent": return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "send_email": return <Mail className="w-4 h-4" />;
      case "send_sms": return <MessageSquare className="w-4 h-4" />;
      case "create_notification": return <Bell className="w-4 h-4" />;
      case "update_lead": return <UserCheck className="w-4 h-4" />;
      case "call_webhook": return <Webhook className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

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
        <source src="/grok-video-47371d5d-4a3e-4405-b1b2-aac866691a85.mp4" type="video/mp4" />
      </video>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-2">
              Workflow Automation
            </h1>
            <p className="text-[oklch(0.78_0.08_240)] mb-3">
              Automate your business processes with intelligent workflows
            </p>
            <div className="bg-[oklch(0.16_0.02_240)]/50 border border-[oklch(0.78_0.08_240)]/20 rounded-lg p-4 max-w-3xl">
              <p className="text-sm text-[oklch(0.85_0.05_240)] mb-2">
                <strong className="text-[oklch(0.95_0_0)]">How workflows operate:</strong>
              </p>
              <ul className="text-sm text-[oklch(0.78_0.08_240)] space-y-1.5 ml-4">
                <li>• <strong className="text-[oklch(0.90_0.05_240)]">Runs automatically</strong> when trigger conditions are met (e.g., lead captured, order placed)</li>
                <li>• <strong className="text-[oklch(0.90_0.05_240)]">Prepared for approval</strong> when actions require owner review (e.g., high-value transactions)</li>
                <li>• <strong className="text-[oklch(0.90_0.05_240)]">Never runs without confirmation</strong> for sensitive operations (e.g., financial transfers, legal documents)</li>
              </ul>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <DialogHeader>
                <DialogTitle className="text-[oklch(0.95_0_0)]">Create New Workflow</DialogTitle>
                <DialogDescription className="text-[oklch(0.78_0.08_240)]">
                  Build an automated workflow from scratch or use a template
                </DialogDescription>
              </DialogHeader>
              <VisualWorkflowCanvas 
                onSave={(workflow) => {
                  // Add name and description to the workflow
                  const workflowName = prompt("Enter workflow name:");
                  if (!workflowName) return;
                  const workflowDesc = prompt("Enter workflow description (optional):") || "";
                  createMutation.mutate({
                    name: workflowName,
                    description: workflowDesc,
                    trigger: workflow.trigger as "lead_captured" | "appointment_scheduled" | "order_placed" | "payment_received" | "email_opened" | "campaign_sent",
                    actions: workflow.actions,
                    enabled: true
                  });
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList className="bg-[oklch(0.16_0.02_240)] border border-[oklch(0.78_0.08_240)]/20">
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          </TabsList>

          {/* Active Workflows Tab */}
          <TabsContent value="workflows" className="space-y-4">
            {workflows.length === 0 ? (
              <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Zap className="w-16 h-16 text-[oklch(0.78_0.08_240)] mb-4" />
                  <h3 className="text-xl font-semibold text-[oklch(0.95_0_0)] mb-2">No workflows yet</h3>
                  <p className="text-[oklch(0.78_0.08_240)] mb-4">Create your first workflow to automate your business</p>
                  <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workflow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {workflows.map((workflow: any) => (
                  <Card key={workflow.id} className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20 hover:border-[oklch(0.72_0.18_200)]/40 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-[oklch(0.95_0_0)]">{workflow.name}</CardTitle>
                            <Badge variant={workflow.enabled ? "default" : "secondary"} className={workflow.enabled ? "bg-green-500/20 text-green-400" : ""}>
                              {workflow.enabled ? "Active" : "Paused"}
                            </Badge>
                          </div>
                          <CardDescription className="text-[oklch(0.78_0.08_240)]">
                            {workflow.description || "No description"}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleMutation.mutate({ id: workflow.id, enabled: !workflow.enabled })}
                          >
                            {workflow.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => executeMutation.mutate({ workflowId: workflow.id, triggerData: {} })}
                          >
                            <Zap className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate({ id: workflow.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Trigger */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[oklch(0.20_0.03_240)] border border-[oklch(0.78_0.08_240)]/10">
                          <div className="p-2 rounded-lg bg-[oklch(0.72_0.18_200)]/20">
                            {getTriggerIcon(workflow.trigger)}
                          </div>
                          <div>
                            <div className="text-xs text-[oklch(0.78_0.08_240)]">TRIGGER</div>
                            <div className="text-sm font-medium text-[oklch(0.95_0_0)]">
                              {workflow.trigger.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <div className="text-xs text-[oklch(0.78_0.08_240)] font-medium">ACTIONS ({workflow.actions?.length || 0})</div>
                          <div className="grid gap-2">
                            {workflow.actions?.map((action: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[oklch(0.18_0.02_240)] border border-[oklch(0.78_0.08_240)]/10">
                                <div className="p-2 rounded-lg bg-[oklch(0.68_0.15_280)]/20">
                                  {getActionIcon(action.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-[oklch(0.95_0_0)]">
                                    {action.type.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </div>
                                  <div className="text-xs text-[oklch(0.78_0.08_240)]">
                                    {action.config.subject || action.config.title || action.config.url || "Configured"}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 pt-4 border-t border-[oklch(0.78_0.08_240)]/10">
                          <div>
                            <div className="text-xs text-[oklch(0.78_0.08_240)]">Executions</div>
                            <div className="text-lg font-semibold text-[oklch(0.95_0_0)]">{workflow.executionCount || 0}</div>
                          </div>
                          {workflow.lastExecutedAt && (
                            <div>
                              <div className="text-xs text-[oklch(0.78_0.08_240)]">Last Run</div>
                              <div className="text-sm text-[oklch(0.95_0_0)]">
                                {new Date(workflow.lastExecutedAt).toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((template: any) => (
                <Card key={template.id} className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20 hover:border-[oklch(0.72_0.18_200)]/40 transition-all cursor-pointer"
                  onClick={() => {
                    createMutation.mutate({
                      name: template.name,
                      description: template.description,
                      trigger: template.trigger,
                      actions: template.actions,
                      enabled: true,
                    });
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-[oklch(0.95_0_0)] flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[oklch(0.72_0.18_200)]" />
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-[oklch(0.78_0.08_240)]">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-[oklch(0.78_0.08_240)]">
                      <Badge variant="outline" className="border-[oklch(0.72_0.18_200)]/40">
                        {template.trigger.replace(/_/g, " ")}
                      </Badge>
                      <span>→</span>
                      <span>{template.actions.length} actions</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <CardTitle className="text-[oklch(0.95_0_0)]">Recent Executions</CardTitle>
                <CardDescription className="text-[oklch(0.78_0.08_240)]">
                  Last 100 workflow executions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {logs.length === 0 ? (
                    <div className="text-center py-8 text-[oklch(0.78_0.08_240)]">
                      No execution logs yet
                    </div>
                  ) : (
                    logs.map((log: any) => (
                      <div key={log.id} className="flex items-center gap-4 p-3 rounded-lg bg-[oklch(0.18_0.02_240)] border border-[oklch(0.78_0.08_240)]/10">
                        <div className={`p-2 rounded-full ${
                          log.status === "success" ? "bg-green-500/20" :
                          log.status === "failed" ? "bg-red-500/20" :
                          "bg-yellow-500/20"
                        }`}>
                          {log.status === "success" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                           log.status === "failed" ? <XCircle className="w-4 h-4 text-red-400" /> :
                           <Activity className="w-4 h-4 text-yellow-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[oklch(0.95_0_0)]">
                            Workflow #{log.workflowId}
                          </div>
                          <div className="text-xs text-[oklch(0.78_0.08_240)]">
                            {new Date(log.createdAt).toLocaleString()} • {log.executionTime}ms
                          </div>
                        </div>
                        <Badge variant={log.status === "success" ? "default" : "destructive"} className={
                          log.status === "success" ? "bg-green-500/20 text-green-400" :
                          log.status === "failed" ? "bg-red-500/20 text-red-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }>
                          {log.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Workflow Builder Component
function WorkflowBuilder({ onSave, templates }: { onSave: (workflow: any) => void; templates: any[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trigger, setTrigger] = useState<string>("");
  const [actions, setActions] = useState<any[]>([]);
  const [currentAction, setCurrentAction] = useState<any>({ type: "", config: {} });

  const handleAddAction = () => {
    if (currentAction.type) {
      setActions([...actions, currentAction]);
      setCurrentAction({ type: "", config: {} });
    }
  };

  const handleSave = () => {
    if (!name || !trigger || actions.length === 0) {
      return;
    }
    onSave({ name, description, trigger, actions, enabled: true });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-[oklch(0.95_0_0)]">Workflow Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Automation Workflow"
            className="bg-[oklch(0.18_0.02_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]"
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-[oklch(0.95_0_0)]">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this workflow do?"
            className="bg-[oklch(0.18_0.02_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]"
          />
        </div>
      </div>

      {/* Trigger Selection */}
      <div>
        <Label className="text-[oklch(0.95_0_0)]">Trigger Event</Label>
        <Select value={trigger} onValueChange={setTrigger}>
          <SelectTrigger className="bg-[oklch(0.18_0.02_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]">
            <SelectValue placeholder="Select a trigger..." />
          </SelectTrigger>
          <SelectContent className="bg-[oklch(0.18_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <SelectItem value="lead_captured">Lead Captured</SelectItem>
            <SelectItem value="appointment_scheduled">Appointment Scheduled</SelectItem>
            <SelectItem value="order_placed">Order Placed</SelectItem>
            <SelectItem value="payment_received">Payment Received</SelectItem>
            <SelectItem value="email_opened">Email Opened</SelectItem>
            <SelectItem value="campaign_sent">Campaign Sent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <Label className="text-[oklch(0.95_0_0)]">Actions</Label>
        
        {/* Current Actions List */}
        {actions.length > 0 && (
          <div className="space-y-2">
            {actions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[oklch(0.18_0.02_240)] border border-[oklch(0.78_0.08_240)]/10">
                <span className="text-sm font-medium text-[oklch(0.95_0_0)]">
                  {idx + 1}. {action.type.replace(/_/g, " ").toUpperCase()}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActions(actions.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Action */}
        <div className="space-y-3 p-4 rounded-lg bg-[oklch(0.18_0.02_240)] border border-[oklch(0.78_0.08_240)]/10">
          <Select value={currentAction.type} onValueChange={(type) => setCurrentAction({ type, config: {} })}>
            <SelectTrigger className="bg-[oklch(0.20_0.03_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]">
              <SelectValue placeholder="Select action type..." />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.18_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <SelectItem value="send_email">Send Email</SelectItem>
              <SelectItem value="send_sms">Send SMS</SelectItem>
              <SelectItem value="create_notification">Create Notification</SelectItem>
              <SelectItem value="update_lead">Update Lead</SelectItem>
              <SelectItem value="call_webhook">Call Webhook</SelectItem>
            </SelectContent>
          </Select>

          {currentAction.type === "send_email" && (
            <div className="space-y-2">
              <Input
                placeholder="Subject"
                value={currentAction.config.subject || ""}
                onChange={(e) => setCurrentAction({ ...currentAction, config: { ...currentAction.config, subject: e.target.value } })}
                className="bg-[oklch(0.20_0.03_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]"
              />
              <Textarea
                placeholder="Email content (use {{variables}})"
                value={currentAction.config.content || ""}
                onChange={(e) => setCurrentAction({ ...currentAction, config: { ...currentAction.config, content: e.target.value } })}
                className="bg-[oklch(0.20_0.03_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]"
              />
            </div>
          )}

          {currentAction.type === "send_sms" && (
            <Textarea
              placeholder="SMS message (use {{variables}})"
              value={currentAction.config.content || ""}
              onChange={(e) => setCurrentAction({ ...currentAction, config: { ...currentAction.config, content: e.target.value } })}
              className="bg-[oklch(0.20_0.03_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]"
            />
          )}

          {currentAction.type === "create_notification" && (
            <div className="space-y-2">
              <Input
                placeholder="Notification title"
                value={currentAction.config.title || ""}
                onChange={(e) => setCurrentAction({ ...currentAction, config: { ...currentAction.config, title: e.target.value } })}
                className="bg-[oklch(0.20_0.03_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]"
              />
              <Input
                placeholder="Message"
                value={currentAction.config.message || ""}
                onChange={(e) => setCurrentAction({ ...currentAction, config: { ...currentAction.config, message: e.target.value } })}
                className="bg-[oklch(0.20_0.03_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]"
              />
            </div>
          )}

          {currentAction.type === "call_webhook" && (
            <Input
              placeholder="Webhook URL"
              value={currentAction.config.url || ""}
              onChange={(e) => setCurrentAction({ ...currentAction, config: { ...currentAction.config, url: e.target.value } })}
              className="bg-[oklch(0.20_0.03_240)] border-[oklch(0.78_0.08_240)]/20 text-[oklch(0.95_0_0)]"
            />
          )}

          <Button onClick={handleAddAction} variant="outline" className="w-full border-[oklch(0.72_0.18_200)]/40">
            <Plus className="w-4 h-4 mr-2" />
            Add Action
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <Button 
        onClick={handleSave} 
        className="w-full bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] hover:opacity-90"
        disabled={!name || !trigger || actions.length === 0}
      >
        Create Workflow
      </Button>
    </div>
  );
}
