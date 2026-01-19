import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, FileText, CheckCircle2, AlertCircle, Loader2, Download, Plus, Users, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function LLCFormation() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("formations");
  const [showNewFormation, setShowNewFormation] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<number | null>(null);
  const [newFormation, setNewFormation] = useState({
    companyName: "",
    state: "",
    businessType: "",
    businessPurpose: "",
    managementStructure: "member_managed" as "member_managed" | "manager_managed",
  });

  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "llc-formation" },
    { enabled: isAuthenticated }
  );

  const { data: formations = [], refetch: refetchFormations } = trpc.llcFormation.list.useQuery(
    undefined,
    { enabled: isAuthenticated && entitlement?.hasAccess }
  );

  const { data: states = [] } = trpc.llcFormation.listStates.useQuery(
    undefined,
    { enabled: isAuthenticated && entitlement?.hasAccess }
  );

  const { data: selectedFormationData } = trpc.llcFormation.getById.useQuery(
    { id: selectedFormation! },
    { enabled: !!selectedFormation }
  );

  const { data: documents = [] } = trpc.llcFormation.getDocuments.useQuery(
    { llcFormationId: selectedFormation! },
    { enabled: !!selectedFormation }
  );

  const createMutation = trpc.llcFormation.create.useMutation({
    onSuccess: () => {
      toast.success("LLC formation created successfully");
      setShowNewFormation(false);
      setNewFormation({
        companyName: "",
        state: "",
        businessType: "",
        businessPurpose: "",
        managementStructure: "member_managed",
      });
      refetchFormations();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create LLC formation");
    },
  });

  const generateArticlesMutation = trpc.llcFormation.generateArticles.useMutation({
    onSuccess: () => {
      toast.success("Articles of Organization generated successfully");
      refetchFormations();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate articles");
    },
  });

  const generateOperatingAgreementMutation = trpc.llcFormation.generateOperatingAgreement.useMutation({
    onSuccess: () => {
      toast.success("Operating Agreement generated successfully");
      refetchFormations();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate operating agreement");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please sign in to access LLC Formation Wizard.
          </p>
          <Button asChild className="w-full">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </Card>
      </div>
    );
  }

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!entitlement?.hasAccess) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription Required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Subscribe to LLC Formation Wizard ($19.99/mo) or get the Sync Bundle for all apps.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                <a>View Plans</a>
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/app/sync-bundle">
                <a>Get Bundle</a>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleCreateFormation = () => {
    if (!newFormation.companyName || !newFormation.state) {
      toast.error("Company name and state are required");
      return;
    }
    createMutation.mutate(newFormation);
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    in_progress: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    filed: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-500 border-green-500/30",
    rejected: "bg-red-500/20 text-red-500 border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      {/* Hero */}
      <div className="border-b border-border/50 glass">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/30">
              <Building2 className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">LLC Formation Wizard</h1>
              <p className="text-muted-foreground text-lg">
                Form your LLC with state-specific guidance and AI-powered document generation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="glass border border-border/50">
              <TabsTrigger value="formations">My LLCs</TabsTrigger>
              <TabsTrigger value="states">State Guide</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowNewFormation(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New LLC Formation
            </Button>
          </div>

          {/* My Formations */}
          <TabsContent value="formations" className="space-y-6">
            {formations.length === 0 ? (
              <Card className="glass premium-card border-border/50">
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No LLC Formations Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your first LLC formation with our guided wizard
                  </p>
                  <Button onClick={() => setShowNewFormation(true)}>
                    Create Your First LLC
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {formations.map((formation: any) => (
                  <Card key={formation.id} className="glass premium-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold">{formation.companyName}</h3>
                            <Badge className={statusColors[formation.status]}>
                              {formation.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formation.state}</span>
                            <span>•</span>
                            <span>{formation.managementStructure?.replace("_", " ")}</span>
                            {formation.filingFee && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {formation.filingFee} filing fee
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedFormation(formation.id)}
                        >
                          View Details
                        </Button>
                      </div>

                      {formation.businessPurpose && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {formation.businessPurpose}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateArticlesMutation.mutate({ llcFormationId: formation.id })}
                          disabled={generateArticlesMutation.isPending}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Articles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateOperatingAgreementMutation.mutate({ llcFormationId: formation.id })}
                          disabled={generateOperatingAgreementMutation.isPending}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Operating Agreement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* State Guide */}
          <TabsContent value="states" className="space-y-6">
            <Card className="glass premium-card border-border/50">
              <CardHeader>
                <CardTitle>State Requirements Guide</CardTitle>
                <CardDescription>
                  Filing fees and requirements vary by state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {states.map((state: any) => (
                    <div
                      key={state.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold">{state.stateName} ({state.stateCode})</h4>
                        <p className="text-sm text-muted-foreground">
                          Processing time: {state.processingTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${state.filingFee}</div>
                        <div className="text-sm text-muted-foreground">Filing Fee</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Formation Dialog */}
      <Dialog open={showNewFormation} onOpenChange={setShowNewFormation}>
        <DialogContent className="glass border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New LLC Formation</DialogTitle>
            <DialogDescription>
              Enter your company information to begin the LLC formation process
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Your Company LLC"
                value={newFormation.companyName}
                onChange={(e) => setNewFormation({ ...newFormation, companyName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Select
                value={newFormation.state}
                onValueChange={(value) => setNewFormation({ ...newFormation, state: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state: any) => (
                    <SelectItem key={state.stateCode} value={state.stateCode}>
                      {state.stateName} - ${state.filingFee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                placeholder="e.g., Technology, Consulting, Retail"
                value={newFormation.businessType}
                onChange={(e) => setNewFormation({ ...newFormation, businessType: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="businessPurpose">Business Purpose</Label>
              <Textarea
                id="businessPurpose"
                placeholder="Describe your business activities..."
                value={newFormation.businessPurpose}
                onChange={(e) => setNewFormation({ ...newFormation, businessPurpose: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="managementStructure">Management Structure</Label>
              <Select
                value={newFormation.managementStructure}
                onValueChange={(value: any) => setNewFormation({ ...newFormation, managementStructure: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member_managed">Member-Managed</SelectItem>
                  <SelectItem value="manager_managed">Manager-Managed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFormation(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateFormation}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Formation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
