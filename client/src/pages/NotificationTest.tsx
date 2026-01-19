import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bell, Send, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function NotificationTest() {
  const [type, setType] = useState<"security" | "appointment" | "lead" | "campaign" | "system">("system");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const createNotification = trpc.notifications.create.useMutation({
    onSuccess: () => {
      toast.success("Notification sent!");
      setTitle("");
      setMessage("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    createNotification.mutate({ type, title, message });
  };

  const sendQuickTest = (preset: "order" | "form" | "workflow") => {
    const presets = {
      order: {
        type: "system" as const,
        title: "New Order Received",
        message: "Order #12345 for $99.99 has been received.",
      },
      form: {
        type: "lead" as const,
        title: "New Form Submission",
        message: "Someone submitted the Contact Form.",
      },
      workflow: {
        type: "system" as const,
        title: "Workflow Completed",
        message: "Your workflow 'Email Campaign' has completed successfully.",
      },
    };

    const preset_data = presets[preset];
    createNotification.mutate(preset_data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Notification Test Center</h1>
          </div>
          <p className="text-muted-foreground">
            Test your custom notification system. Send notifications to yourself and see them appear in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Notification Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Create Custom Notification
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value: any) => setType(value)}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Notification title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Notification message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={createNotification.isPending}>
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </form>
          </Card>

          {/* Quick Test Buttons */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Test Scenarios</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Click these buttons to send pre-configured test notifications instantly.
            </p>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => sendQuickTest("order")}
                disabled={createNotification.isPending}
              >
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                  <span className="text-green-500">💰</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">New Order</p>
                  <p className="text-xs text-muted-foreground">Simulate order notification</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => sendQuickTest("form")}
                disabled={createNotification.isPending}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                  <span className="text-blue-500">📝</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Form Submission</p>
                  <p className="text-xs text-muted-foreground">Simulate form submission</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => sendQuickTest("workflow")}
                disabled={createNotification.isPending}
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                  <span className="text-purple-500">⚡</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Workflow Complete</p>
                  <p className="text-xs text-muted-foreground">Simulate workflow completion</p>
                </div>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-sm mb-2">💡 How It Works</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Notifications are saved to database</li>
                <li>• Real-time delivery via WebSocket</li>
                <li>• Toast notification appears instantly</li>
                <li>• Check the bell icon in the top nav</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Integration Examples */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Integration Examples</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Use these helper functions in your backend code to trigger notifications:
          </p>

          <div className="space-y-4">
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="text-green-400">// Import the helper</div>
              <div>import {"{ notifyNewOrder }"} from "@/server/helpers/notificationHelper";</div>
              <div className="mt-2 text-green-400">// In your order creation logic</div>
              <div>await notifyNewOrder(userId, orderId, amount);</div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="text-green-400">// Form submission</div>
              <div>await notifyFormSubmission(userId, "Contact Form");</div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="text-green-400">// Workflow completion</div>
              <div>await notifyWorkflowComplete(userId, "Email Campaign", workflowId);</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
