import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Mail, MessageSquare, Share2, DollarSign, Users, Target, Loader2, Send, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Analytics() {
  const { user } = useAuth();
  const { data: campaigns, isLoading } = trpc.campaigns.list.useQuery();
  const { data: templates = [] } = trpc.templates.list.useQuery();
  
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [recipients, setRecipients] = useState("");
  const [campaignName, setCampaignName] = useState("");

  const executeCampaign = trpc.campaigns.execute.useMutation({
    onSuccess: () => {
      toast.success("Campaign sent successfully!");
      setShowSendDialog(false);
      setSelectedTemplate("");
      setRecipients("");
      setCampaignName("");
    },
    onError: (error) => {
      toast.error(`Failed to send campaign: ${error.message}`);
    },
  });

  const totalSent = campaigns?.reduce((sum, c) => sum + c.sentCount, 0) || 0;
  const totalOpens = campaigns?.reduce((sum, c) => sum + c.openCount, 0) || 0;
  const totalClicks = campaigns?.reduce((sum, c) => sum + c.clickCount, 0) || 0;
  const totalConversions = campaigns?.reduce((sum, c) => sum + c.conversionCount, 0) || 0;
  const totalRevenue = campaigns?.reduce((sum, c) => sum + c.revenue, 0) || 0;

  const openRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : "0.0";
  const clickRate = totalSent > 0 ? ((totalClicks / totalSent) * 100).toFixed(1) : "0.0";
  const conversionRate = totalSent > 0 ? ((totalConversions / totalSent) * 100).toFixed(1) : "0.0";
  const roi = totalRevenue > 0 ? ((totalRevenue / 100) * 3).toFixed(0) : "0"; // Simplified ROI calculation

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gold-text">
                MARKETING ANALYTICS
              </h1>
              <p className="text-muted-foreground mt-2">
                Track email, SMS, and social campaigns with conversion and ROI metrics
              </p>
            </div>
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Send Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-border/50 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Send New Campaign</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <input
                      id="campaign-name"
                      className="w-full mt-1 px-3 py-2 bg-background/50 border border-border/50 rounded"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Summer Sale 2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="template">Select Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template: any) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name} ({template.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="recipients">Recipients (one email/phone per line)</Label>
                    <Textarea
                      id="recipients"
                      className="mt-1 bg-background/50 border-border/50 font-mono text-sm"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                      placeholder="user@example.com\n+1234567890"
                      rows={8}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        if (!campaignName.trim()) {
                          toast.error("Please enter a campaign name");
                          return;
                        }
                        if (!selectedTemplate) {
                          toast.error("Please select a template");
                          return;
                        }
                        if (!recipients.trim()) {
                          toast.error("Please enter at least one recipient");
                          return;
                        }
                        const recipientList = recipients.split("\n").filter((r: string) => r.trim());
                        executeCampaign.mutate({
                          campaignId: parseInt(selectedTemplate),
                          recipients: recipientList,
                        });
                      }}
                      disabled={executeCampaign.isPending}
                    >
                      {executeCampaign.isPending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="h-4 w-4 mr-2" /> Send Campaign</>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 silver-text" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground uppercase">Total Sent</p>
                <p className="text-3xl font-bold silver-text">{totalSent.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Across all campaigns
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-secondary/30">
            <div className="flex items-center justify-between mb-4">
              <Mail className="h-8 w-8 gold-text" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground uppercase">Open Rate</p>
                <p className="text-3xl font-bold gold-text">{openRate}%</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {totalOpens.toLocaleString()} opens
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-accent/30">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-accent" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground uppercase">Click Rate</p>
                <p className="text-3xl font-bold text-accent">{clickRate}%</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {totalClicks.toLocaleString()} clicks
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 silver-text" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground uppercase">Revenue</p>
                <p className="text-3xl font-bold silver-text">
                  ${(totalRevenue / 100).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {totalConversions} conversions
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <h3 className="text-xl font-bold mb-4 gold-text">CONVERSION METRICS</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded">
                <span className="text-sm uppercase">Conversion Rate</span>
                <span className="text-2xl font-bold silver-text">{conversionRate}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded">
                <span className="text-sm uppercase">Total Conversions</span>
                <span className="text-2xl font-bold gold-text">{totalConversions}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded">
                <span className="text-sm uppercase">Avg. Order Value</span>
                <span className="text-2xl font-bold text-accent">
                  ${totalConversions > 0 ? ((totalRevenue / 100) / totalConversions).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <h3 className="text-xl font-bold mb-4 gold-text">ROI ANALYSIS</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/50 rounded">
                <span className="text-sm uppercase">Return on Investment</span>
                <span className="text-2xl font-bold silver-text">{roi}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded">
                <span className="text-sm uppercase">Cost Per Acquisition</span>
                <span className="text-2xl font-bold gold-text">
                  ${totalConversions > 0 ? ((totalRevenue / 100) / totalConversions / 10).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-background/50 rounded">
                <span className="text-sm uppercase">Revenue Per Send</span>
                <span className="text-2xl font-bold text-accent">
                  ${totalSent > 0 ? ((totalRevenue / 100) / totalSent).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-bold gold-text">CAMPAIGNS</h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin gold-text" />
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="bg-card/30">
                    <th className="text-left p-4 text-sm font-bold uppercase">Campaign</th>
                    <th className="text-center p-4 text-sm font-bold uppercase">Type</th>
                    <th className="text-right p-4 text-sm font-bold uppercase">Sent</th>
                    <th className="text-right p-4 text-sm font-bold uppercase">Opens</th>
                    <th className="text-right p-4 text-sm font-bold uppercase">Clicks</th>
                    <th className="text-right p-4 text-sm font-bold uppercase">Conversions</th>
                    <th className="text-right p-4 text-sm font-bold uppercase">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-border hover:bg-card/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.status.toUpperCase()}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1">
                          {campaign.type === "email" && <Mail className="h-4 w-4" />}
                          {campaign.type === "sms" && <MessageSquare className="h-4 w-4" />}
                          {campaign.type === "social" && <Share2 className="h-4 w-4" />}
                          <span className="text-xs uppercase">{campaign.type}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">{campaign.sentCount.toLocaleString()}</td>
                      <td className="p-4 text-right gold-text">{campaign.openCount.toLocaleString()}</td>
                      <td className="p-4 text-right text-accent">{campaign.clickCount.toLocaleString()}</td>
                      <td className="p-4 text-right silver-text">{campaign.conversionCount.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold silver-text">
                        ${(campaign.revenue / 100).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <TrendingUp className="h-16 w-16 gold-text mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">NO CAMPAIGNS YET</h3>
              <p className="text-muted-foreground mb-6">
                Create your first marketing campaign to start tracking analytics
              </p>
              <Button className="silver-text font-bold">
                CREATE CAMPAIGN
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
