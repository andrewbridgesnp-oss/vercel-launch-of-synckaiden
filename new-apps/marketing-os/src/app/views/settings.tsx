import { GlassCard } from "../components/glass-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Building2,
  Globe,
  Users,
  Shield,
  CreditCard,
  Key,
  Bell,
  Palette,
  Save,
} from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="brand" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid lg:grid-cols-6">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        {/* Brand Settings */}
        <TabsContent value="brand" className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Brand Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input id="brand-name" defaultValue="My Brand" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://mybrand.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brand Description</Label>
                <Input
                  id="description"
                  defaultValue="Premium products and services for modern businesses"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" defaultValue="Technology" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-8 (Pacific)" />
                </div>
              </div>

              <div className="pt-4">
                <Button className="bg-gradient-to-r from-primary to-primary/80">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Brand Voice & Tone</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                <div>
                  <p className="font-medium">AI Content Tone</p>
                  <p className="text-sm text-muted-foreground">Default tone for generated content</p>
                </div>
                <Input className="w-48" defaultValue="Professional" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                <div>
                  <p className="font-medium">Brand Keywords</p>
                  <p className="text-sm text-muted-foreground">Words that define your brand</p>
                </div>
                <Input className="w-64" defaultValue="premium, quality, trusted" />
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Domains */}
        <TabsContent value="domains" className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Custom Domains</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-accent/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">marketing.mybrand.com</p>
                    <p className="text-sm text-emerald-400">✓ Verified & Active</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-accent/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">campaigns.mybrand.com</p>
                    <p className="text-sm text-yellow-400">⚠ Pending DNS Verification</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Instructions
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                + Add New Domain
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Team Members</h3>
              </div>
              <Button className="bg-gradient-to-r from-primary to-primary/80">
                + Invite Member
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: "John Doe", email: "john@mybrand.com", role: "Owner" },
                { name: "Jane Smith", email: "jane@mybrand.com", role: "Admin" },
                { name: "Mike Johnson", email: "mike@mybrand.com", role: "Editor" },
              ].map((member) => (
                <div key={member.email} className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{member.role}</span>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Permissions</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: "Create Campaigns", description: "Allow team members to create new campaigns" },
                { label: "Delete Leads", description: "Allow team members to permanently delete leads" },
                { label: "Export Data", description: "Allow team members to export contact data" },
                { label: "Manage Billing", description: "Allow team members to view and edit billing" },
              ].map((perm) => (
                <div key={perm.label} className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                  <div>
                    <p className="font-medium">{perm.label}</p>
                    <p className="text-sm text-muted-foreground">{perm.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Security Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
                <div>
                  <p className="font-medium">Email Notifications for Logins</p>
                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="p-4 rounded-lg bg-accent/30">
                <p className="font-medium mb-2">Change Password</p>
                <div className="space-y-3">
                  <Input type="password" placeholder="Current Password" />
                  <Input type="password" placeholder="New Password" />
                  <Input type="password" placeholder="Confirm New Password" />
                  <Button variant="outline">Update Password</Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Billing & Subscription</h3>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold mb-1">Pro Plan</h4>
                  <p className="text-muted-foreground">Unlimited campaigns, automations, and integrations</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">$99/mo</div>
                  <p className="text-sm text-muted-foreground">Billed monthly</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-accent/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">Visa •••• 4242</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Next Billing Date</p>
                    <p className="text-sm text-muted-foreground">February 12, 2026</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View Billing History
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Key className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">API Access</h3>
              </div>
              <Button className="bg-gradient-to-r from-primary to-primary/80">
                + Generate New Key
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-accent/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">Production API Key</p>
                    <p className="text-sm text-muted-foreground">Created Jan 5, 2026</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
                <div className="p-3 rounded bg-background/50 font-mono text-sm">
                  kms_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxx
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-accent/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">Development API Key</p>
                    <p className="text-sm text-muted-foreground">Created Dec 20, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Revoke
                  </Button>
                </div>
                <div className="p-3 rounded bg-background/50 font-mono text-sm">
                  kms_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxx
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-400">
                  <strong>Documentation:</strong> Learn how to use the Kaiden Marketing OS API in our{" "}
                  <a href="#" className="underline">
                    developer documentation
                  </a>
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
