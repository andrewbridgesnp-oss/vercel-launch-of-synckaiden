import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Lightbulb, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RequestApp() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appName, setAppName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState("");
  const [priority, setPriority] = useState("medium");

  const requestMutation = trpc.appRequests.submit.useMutation({
    onSuccess: () => {
      toast({
        title: "Request submitted!",
        description: "We'll review your suggestion and notify you of updates.",
      });
      setAppName("");
      setCategory("");
      setDescription("");
      setUseCase("");
      setPriority("medium");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestMutation.mutate({
      appName,
      category,
      description,
      useCase,
      priority,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
              <Lightbulb className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Request a New App
            </h1>
            <p className="text-xl text-muted-foreground">
              Help us build the perfect tool for your business. Share your idea and we'll bring it to life.
            </p>
          </div>

          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Tell us about your ideal app
              </CardTitle>
              <CardDescription>
                The more details you provide, the better we can tailor the app to your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">App Name</label>
                  <Input
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g., Social Media Scheduler Pro"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="ai">AI & Automation</SelectItem>
                      <SelectItem value="crm">CRM & Sales</SelectItem>
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What should this app do? What problem does it solve?"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Use Case</label>
                  <Textarea
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    placeholder="How would you use this app in your business? Give us a specific example."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Nice to have</SelectItem>
                      <SelectItem value="medium">Would be helpful</SelectItem>
                      <SelectItem value="high">Really need this</SelectItem>
                      <SelectItem value="critical">Critical for my business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={requestMutation.isPending}
                >
                  {requestMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>1. Our team reviews your request</p>
                <p>2. We assess feasibility and demand</p>
                <p>3. You get notified when development starts</p>
                <p>4. Early access when the app launches</p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Popular Requests</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Advanced analytics dashboard</p>
                <p>• Multi-channel customer support</p>
                <p>• Automated bookkeeping</p>
                <p>• Social proof widgets</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
