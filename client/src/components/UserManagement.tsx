import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Crown } from "lucide-react";
import { toast } from "sonner";

export function UserManagement() {
  const [limit] = useState(50);
  const { data, refetch } = trpc.users.list.useQuery({ limit });
  const updateRole = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success("User role updated");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const users = data?.users || [];

  const handleRoleToggle = (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    updateRole.mutate({ userId, role: newRole as "user" | "admin" });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium">{user.name || "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{user.email || "No email"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role === "admin" ? <Crown className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                {user.role}
              </Badge>
              <Badge variant="outline">{user.subscriptionTier}</Badge>
              <Button
                size="sm"
                variant={user.role === "admin" ? "destructive" : "default"}
                onClick={() => handleRoleToggle(user.id, user.role)}
                disabled={updateRole.isPending}
              >
                <Shield className="w-4 h-4 mr-1" />
                {user.role === "admin" ? "Demote" : "Promote"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
