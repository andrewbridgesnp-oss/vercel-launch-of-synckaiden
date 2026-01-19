import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Plus, Mail, Trash2, Shield, Crown, Briefcase, Scale, Phone } from "lucide-react";

export default function WorkspaceManagement() {
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceSlug, setNewWorkspaceSlug] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "cpa" | "lawyer" | "receptionist" | "member">("member");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: workspaces, isLoading } = trpc.workspaces.list.useQuery();
  const { data: members } = trpc.workspaces.getMembers.useQuery(
    { workspaceId: selectedWorkspace! },
    { enabled: !!selectedWorkspace }
  );

  const createWorkspace = trpc.workspaces.create.useMutation({
    onSuccess: () => {
      utils.workspaces.list.invalidate();
      setCreateDialogOpen(false);
      setNewWorkspaceName("");
      setNewWorkspaceSlug("");
    },
  });

  const inviteMember = trpc.workspaces.inviteMember.useMutation({
    onSuccess: () => {
      utils.workspaces.getMembers.invalidate();
      setInviteDialogOpen(false);
      setInviteEmail("");
      setInviteRole("member");
      alert("Invitation sent successfully!");
    },
  });

  const removeMember = trpc.workspaces.removeMember.useMutation({
    onSuccess: () => {
      utils.workspaces.getMembers.invalidate();
    },
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName || !newWorkspaceSlug) return;
    createWorkspace.mutate({
      name: newWorkspaceName,
      slug: newWorkspaceSlug,
    });
  };

  const handleInviteMember = () => {
    if (!selectedWorkspace || !inviteEmail) return;
    inviteMember.mutate({
      workspaceId: selectedWorkspace,
      email: inviteEmail,
      role: inviteRole,
    });
  };

  const handleRemoveMember = (memberId: number) => {
    if (!selectedWorkspace) return;
    if (confirm("Are you sure you want to remove this team member?")) {
      removeMember.mutate({
        workspaceId: selectedWorkspace,
        memberId,
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "cpa":
        return <Briefcase className="h-4 w-4" />;
      case "lawyer":
        return <Scale className="h-4 w-4" />;
      case "receptionist":
        return <Phone className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      case "cpa":
      case "lawyer":
        return "outline";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading workspaces...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspace Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your business workspaces and team members
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
              <DialogDescription>
                Create a new workspace for your business or client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  placeholder="Acme Inc."
                  value={newWorkspaceName}
                  onChange={(e) => {
                    setNewWorkspaceName(e.target.value);
                    setNewWorkspaceSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    );
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Workspace Slug</Label>
                <Input
                  id="slug"
                  placeholder="acme-inc"
                  value={newWorkspaceSlug}
                  onChange={(e) => setNewWorkspaceSlug(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Used in URLs: kayden.app/{newWorkspaceSlug || "your-slug"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateWorkspace}
                disabled={!newWorkspaceName || !newWorkspaceSlug || createWorkspace.isPending}
              >
                {createWorkspace.isPending ? "Creating..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workspaces Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workspaces?.map((workspace) => (
          <Card
            key={workspace.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedWorkspace === workspace.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedWorkspace(workspace.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{workspace.name}</CardTitle>
                    <CardDescription className="text-xs">
                      /{workspace.slug}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={getRoleBadgeVariant(workspace.role)}>
                  <span className="flex items-center gap-1">
                    {getRoleIcon(workspace.role)}
                    {workspace.role}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium capitalize">{workspace.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={workspace.subscriptionStatus === "active" ? "default" : "secondary"}>
                    {workspace.subscriptionStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Members Section */}
      {selectedWorkspace && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Manage your in-house experts and team members
                </CardDescription>
              </div>
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Invite your CPA, lawyer, receptionist, or other team members
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="cpa">CPA (Accountant)</SelectItem>
                          <SelectItem value="lawyer">Lawyer</SelectItem>
                          <SelectItem value="receptionist">Receptionist</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {inviteRole === "cpa" && "Can approve tax filings and financial reports"}
                        {inviteRole === "lawyer" && "Can review and approve contracts"}
                        {inviteRole === "receptionist" && "Can manage calls and appointments"}
                        {inviteRole === "admin" && "Full access to workspace settings"}
                        {inviteRole === "member" && "Basic access to workspace features"}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleInviteMember}
                      disabled={!inviteEmail || inviteMember.isPending}
                    >
                      {inviteMember.isPending ? "Sending..." : "Send Invitation"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="font-medium">User #{member.userId}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        <span className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          {member.role}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === "active" ? "default" : "secondary"}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString()
                        : "Pending"}
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removeMember.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
