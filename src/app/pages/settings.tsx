import { useState } from "react";
import { Save, Phone, Calendar as CalIcon, CreditCard, MessageSquare, Users, Bell, Shield } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

export function SettingsPage() {
  const [complianceMode, setComplianceMode] = useState(false);

  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure Avery for your business</p>
      </div>

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Business Info */}
        <TabsContent value="business">
          <GlassmorphismCard className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Business Information</h3>
              
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biz-name">Business Name</Label>
                  <Input id="biz-name" defaultValue="Acme Services" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="biz-phone">Business Phone</Label>
                    <Input id="biz-phone" defaultValue="+1 (555) 100-2000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="et">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="et">Eastern (ET)</SelectItem>
                        <SelectItem value="ct">Central (CT)</SelectItem>
                        <SelectItem value="mt">Mountain (MT)</SelectItem>
                        <SelectItem value="pt">Pacific (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Weekday Start</Label>
                      <Input type="time" defaultValue="09:00" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Weekday End</Label>
                      <Input type="time" defaultValue="17:00" />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={saveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </GlassmorphismCard>
        </TabsContent>

        {/* Services */}
        <TabsContent value="services">
          <GlassmorphismCard className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Services & Pricing</h3>
                <Button variant="outline">Add Service</Button>
              </div>

              <div className="space-y-3">
                {["Consultation - $150 (60 min)", "Follow-up - $75 (30 min)", "Assessment - $200 (90 min)"].map((service, i) => (
                  <div key={i} className="p-4 bg-muted/30 rounded-lg flex justify-between items-center">
                    <span>{service}</span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
            </div>
          </GlassmorphismCard>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <GlassmorphismCard className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Integrations</h3>

              <div className="space-y-4">
                {[
                  { icon: Phone, name: "Phone (Twilio)", status: true, required: true },
                  { icon: CalIcon, name: "Calendar (Google)", status: true, required: true },
                  { icon: CreditCard, name: "Payments (Stripe)", status: true, required: false },
                  { icon: MessageSquare, name: "SMS", status: false, required: false }
                ].map((integration, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <integration.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {integration.required ? "Required" : "Optional"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {integration.status ? (
                        <span className="text-sm text-green-500">Connected</span>
                      ) : (
                        <Button variant="outline" size="sm">Connect</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassmorphismCard>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team">
          <GlassmorphismCard className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Team Access</h3>
                <Button variant="outline">Invite Member</Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "You", email: "owner@acme.com", role: "Owner" },
                  { name: "Jane Smith", email: "jane@acme.com", role: "Admin" },
                  { name: "Bob Jones", email: "bob@acme.com", role: "Member" }
                ].map((member, i) => (
                  <div key={i} className="p-4 bg-muted/30 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassmorphismCard>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <GlassmorphismCard className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Notification Preferences</h3>

              <div className="space-y-4">
                {[
                  { label: "New Call Notifications", description: "Get notified when Avery receives a call" },
                  { label: "Booking Confirmations", description: "Receive updates when appointments are booked" },
                  { label: "Payment Alerts", description: "Get notified of successful payments" },
                  { label: "Daily Summary", description: "Receive a daily summary of Avery's activity" }
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-medium">{notif.label}</p>
                      <p className="text-sm text-muted-foreground">{notif.description}</p>
                    </div>
                    <Switch defaultChecked={i < 3} />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between p-4 border-2 border-accent/20 rounded-lg bg-accent/5">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-accent" />
                    <div>
                      <p className="font-medium">Compliance Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Enable additional logging and consent tracking for regulated industries
                      </p>
                    </div>
                  </div>
                  <Switch checked={complianceMode} onCheckedChange={setComplianceMode} />
                </div>
              </div>

              <Button onClick={saveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </GlassmorphismCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
