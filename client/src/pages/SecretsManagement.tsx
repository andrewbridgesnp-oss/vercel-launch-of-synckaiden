import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Key, Eye, EyeOff, Trash2, Plus, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function SecretsManagement() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const { data: secrets, refetch } = trpc.admin.listSecrets.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const addMutation = trpc.admin.addSecret.useMutation({
    onSuccess: () => {
      toast({ title: "Secret added successfully" });
      setNewKey("");
      setNewValue("");
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = trpc.admin.deleteSecret.useMutation({
    onSuccess: () => {
      toast({ title: "Secret deleted successfully" });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleVisibility = (key: string) => {
    setShowValues((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAdd = () => {
    if (!newKey || !newValue) {
      toast({
        title: "Error",
        description: "Both key and value are required",
        variant: "destructive",
      });
      return;
    }
    addMutation.mutate({ key: newKey, value: newValue });
  };

  const handleDelete = (key: string) => {
    if (confirm(`Are you sure you want to delete ${key}?`)) {
      deleteMutation.mutate({ key });
    }
  };

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Secrets Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage environment variables and API keys securely
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="border-destructive/50 bg-destructive/5 mb-6">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Caution: Sensitive Data</p>
              <p className="text-sm text-muted-foreground">
                These secrets control critical system functionality. Changes may affect platform operation.
                Never share these values publicly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add New Secret */}
        <Card className="glass border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Secret
            </CardTitle>
            <CardDescription>
              Add a new environment variable or API key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="KEY_NAME"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
                className="font-mono"
              />
              <Input
                type="password"
                placeholder="secret value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="font-mono"
              />
              <Button
                onClick={handleAdd}
                disabled={addMutation.isPending}
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Secrets List */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              {secrets?.length || 0} secrets configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {secrets?.map((secret) => (
                <div
                  key={secret.key}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-medium text-sm mb-1">{secret.key}</p>
                    <p className="font-mono text-sm text-muted-foreground truncate">
                      {showValues[secret.key] ? secret.value : "••••••••••••••••"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(secret.key)}
                    >
                      {showValues[secret.key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(secret.key)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
