import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  MessageSquare,
  CheckSquare,
  Clock,
  CheckCircle2,
  Users,
  Send,
  Plus,
} from "lucide-react";

export default function TeamHub() {
  const [activeTab, setActiveTab] = useState<"messages" | "tasks" | "time" | "approvals">("messages");
  const [workspaceId] = useState(1); // TODO: Get from workspace context

  // Messages state
  const [messageContent, setMessageContent] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<number | undefined>();

  // Tasks state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // Queries
  const messages = trpc.collaboration.getMessages.useQuery({ workspaceId });
  const tasks = trpc.collaboration.listTasks.useQuery({ workspaceId });
  const timeEntries = trpc.collaboration.listTimeEntries.useQuery({ workspaceId });
  const approvals = trpc.collaboration.listApprovals.useQuery({ workspaceId });

  // Mutations
  const sendMessage = trpc.collaboration.sendMessage.useMutation({
    onSuccess: () => {
      setMessageContent("");
      messages.refetch();
    },
  });

  const createTask = trpc.collaboration.createTask.useMutation({
    onSuccess: () => {
      setTaskTitle("");
      setTaskDescription("");
      tasks.refetch();
    },
  });

  const updateTask = trpc.collaboration.updateTask.useMutation({
    onSuccess: () => tasks.refetch(),
  });

  const startTimer = trpc.collaboration.startTimer.useMutation({
    onSuccess: () => timeEntries.refetch(),
  });

  const stopTimer = trpc.collaboration.stopTimer.useMutation({
    onSuccess: () => timeEntries.refetch(),
  });

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    sendMessage.mutate({
      workspaceId,
      content: messageContent,
      recipientId: selectedRecipient,
    });
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;
    createTask.mutate({
      workspaceId,
      title: taskTitle,
      description: taskDescription,
      priority: "medium",
    });
  };

  const handleToggleTask = (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "todo" : "completed";
    updateTask.mutate({ id: taskId, status: newStatus as any });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Team Collaboration Hub</h1>
        <p className="text-muted-foreground">
          Communicate, assign tasks, track time, and manage approvals with your team
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === "messages" ? "default" : "ghost"}
          onClick={() => setActiveTab("messages")}
          className="gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Messages
        </Button>
        <Button
          variant={activeTab === "tasks" ? "default" : "ghost"}
          onClick={() => setActiveTab("tasks")}
          className="gap-2"
        >
          <CheckSquare className="w-4 h-4" />
          Tasks
        </Button>
        <Button
          variant={activeTab === "time" ? "default" : "ghost"}
          onClick={() => setActiveTab("time")}
          className="gap-2"
        >
          <Clock className="w-4 h-4" />
          Time Tracking
        </Button>
        <Button
          variant={activeTab === "approvals" ? "default" : "ghost"}
          onClick={() => setActiveTab("approvals")}
          className="gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Approvals
        </Button>
      </div>

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Team Messages
            </h2>

            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.data?.map((msg) => (
                <div key={msg.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                  <Users className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">Team Member #{msg.senderId}</div>
                    <p className="text-sm text-muted-foreground">{msg.content}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              {messages.data?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No messages yet. Start a conversation!
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={sendMessage.isPending}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckSquare className="w-6 h-6" />
              Team Tasks
            </h2>

            <div className="space-y-2 mb-4">
              <Input
                placeholder="Task title..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <Textarea
                placeholder="Task description (optional)..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows={2}
              />
              <Button onClick={handleCreateTask} disabled={createTask.isPending} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            </div>

            <div className="space-y-2">
              {tasks.data?.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleToggleTask(task.id, task.status)}
                    className="mt-1 w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {task.priority}
                      </span>
                      <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.data?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No tasks yet. Create your first task!
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Time Tracking Tab */}
      {activeTab === "time" && (
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Time Tracking
            </h2>

            <div className="mb-4">
              <Button
                onClick={() => startTimer.mutate({ workspaceId, billable: true })}
                disabled={startTimer.isPending}
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                Start Timer
              </Button>
            </div>

            <div className="space-y-2">
              {timeEntries.data?.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{entry.description || "Time Entry"}</div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.startTime).toLocaleString()}
                      {entry.endTime && ` - ${new Date(entry.endTime).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.duration ? (
                      <span className="font-mono text-lg">
                        {Math.floor(entry.duration / 3600)}h {Math.floor((entry.duration % 3600) / 60)}m
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => stopTimer.mutate({ id: entry.id })}
                        disabled={stopTimer.isPending}
                      >
                        Stop
                      </Button>
                    )}
                    {entry.billable && (
                      <span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded">
                        Billable
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {timeEntries.data?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No time entries yet. Start tracking your time!
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Approvals Tab */}
      {activeTab === "approvals" && (
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Approval Requests
            </h2>

            <div className="space-y-2">
              {approvals.data?.map((approval) => (
                <div key={approval.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium capitalize">{approval.type.replace("_", " ")}</div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        approval.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : approval.status === "approved"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {approval.status}
                    </span>
                  </div>
                  {approval.notes && (
                    <p className="text-sm text-muted-foreground mb-2">{approval.notes}</p>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Requested: {new Date(approval.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
              {approvals.data?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No approval requests. All clear!
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
