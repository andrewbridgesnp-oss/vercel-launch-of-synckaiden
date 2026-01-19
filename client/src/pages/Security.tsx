import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Security() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: securityEvents, isLoading: eventsLoading } = trpc.security.getEvents.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const { data: approvals, isLoading: approvalsLoading } = trpc.security.getPendingApprovals.useQuery();

  const reviewApproval = trpc.security.reviewApproval.useMutation({
    onSuccess: () => {
      toast.success("Approval reviewed successfully");
      utils.security.getPendingApprovals.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleApprove = (id: number) => {
    reviewApproval.mutate({ id, action: "approve" });
  };

  const handleReject = (id: number) => {
    reviewApproval.mutate({ id, action: "reject", reason: "Rejected by user" });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/20 text-destructive border-destructive";
      case "warning":
        return "bg-accent/20 text-accent border-accent";
      default:
        return "bg-secondary/20 text-secondary border-secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="" />

      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tools">
            <Button variant="ghost" className="mb-4">
              ← BACK TO TOOLS
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Shield className="h-12 w-12 gold-text pulse-glow" />
            <div>
              <h1 className="text-4xl font-bold gold-text">
                SECURITY CENTER
              </h1>
              <p className="text-muted-foreground mt-2">
                Enterprise security monitoring and approval management
              </p>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-secondary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Status</p>
                <p className="text-2xl font-bold gold-text mt-1">ACTIVE</p>
              </div>
              <Shield className="h-8 w-8 gold-text" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Pending Approvals</p>
                <p className="text-2xl font-bold silver-text mt-1">
                  {approvals?.filter(a => a.status === "pending").length || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 silver-text" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-accent/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Security Events</p>
                <p className="text-2xl font-bold text-accent mt-1">
                  {securityEvents?.length || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Protection Level</p>
                <p className="text-2xl font-bold gold-text mt-1">MAX</p>
              </div>
              <Shield className="h-8 w-8 gold-text" />
            </div>
          </Card>
        </div>

        {/* Security Features */}
        <Card className="mb-8 p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
          <h3 className="text-xl font-bold mb-4 gold-text">ACTIVE SECURITY FEATURES</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-background/50 rounded border border-secondary/30">
              <CheckCircle className="h-6 w-6 gold-text mb-2" />
              <div className="font-bold text-sm">Multi-Stage Prompt Injection Defense</div>
              <div className="text-xs text-muted-foreground mt-1">Active</div>
            </div>
            <div className="p-4 bg-background/50 rounded border border-secondary/30">
              <CheckCircle className="h-6 w-6 gold-text mb-2" />
              <div className="font-bold text-sm">Input Validation & Sanitization</div>
              <div className="text-xs text-muted-foreground mt-1">Active</div>
            </div>
            <div className="p-4 bg-background/50 rounded border border-secondary/30">
              <CheckCircle className="h-6 w-6 gold-text mb-2" />
              <div className="font-bold text-sm">Output Filtering</div>
              <div className="text-xs text-muted-foreground mt-1">Active</div>
            </div>
            <div className="p-4 bg-background/50 rounded border border-secondary/30">
              <CheckCircle className="h-6 w-6 gold-text mb-2" />
              <div className="font-bold text-sm">RAG Fact Verification</div>
              <div className="text-xs text-muted-foreground mt-1">Active</div>
            </div>
            <div className="p-4 bg-background/50 rounded border border-secondary/30">
              <CheckCircle className="h-6 w-6 gold-text mb-2" />
              <div className="font-bold text-sm">Dynamic Authorization (ABAC/PBAC)</div>
              <div className="text-xs text-muted-foreground mt-1">Active</div>
            </div>
            <div className="p-4 bg-background/50 rounded border border-secondary/30">
              <CheckCircle className="h-6 w-6 gold-text mb-2" />
              <div className="font-bold text-sm">Anomaly Detection Monitoring</div>
              <div className="text-xs text-muted-foreground mt-1">Active</div>
            </div>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-2 border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-bold gold-text">PENDING APPROVALS</h3>
          </div>

          {approvalsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin gold-text" />
            </div>
          ) : approvals && approvals.length > 0 ? (
            <div className="divide-y divide-border">
              {approvals.map((approval) => (
                <div key={approval.id} className="p-6 hover:bg-card/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary/20 text-primary border-primary">
                          {approval.action.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(approval.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-semibold mb-1">{approval.description}</p>
                      {approval.requestData ? (
                        <pre className="text-xs text-muted-foreground bg-background/50 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(approval.requestData, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(approval.id)}
                        disabled={reviewApproval.isPending}
                        className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        APPROVE
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(approval.id)}
                        disabled={reviewApproval.isPending}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        REJECT
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <CheckCircle className="h-16 w-16 gold-text mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">NO PENDING APPROVALS</h3>
              <p className="text-muted-foreground">
                All high-risk actions have been reviewed
              </p>
            </div>
          )}
        </Card>

        {/* Security Events (Admin Only) */}
        {user?.role === "admin" && (
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-border">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold gold-text">SECURITY EVENTS</h3>
            </div>

            {eventsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin gold-text" />
              </div>
            ) : securityEvents && securityEvents.length > 0 ? (
              <div className="divide-y divide-border">
                {securityEvents.map((event) => (
                  <div key={event.id} className="p-6 hover:bg-card/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs font-bold uppercase">{event.eventType}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{event.description}</p>
                      </div>
                      <AlertTriangle className={`h-5 w-5 ${
                        event.severity === "critical" ? "silver-text" : 
                        event.severity === "warning" ? "text-accent" : "gold-text"
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Shield className="h-16 w-16 gold-text mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">NO SECURITY EVENTS</h3>
                <p className="text-muted-foreground">
                  All systems operating normally
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
