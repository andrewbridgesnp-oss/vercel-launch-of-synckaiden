import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, User, Loader2, Plus, Trash2, MessageSquare, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Leads() {
  const { user } = useAuth();
  const [showAddLead, setShowAddLead] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("website");
  const [notes, setNotes] = useState("");

  const { data: leads = [], isLoading, refetch } = trpc.leads.list.useQuery();
  
  const createMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Lead added!");
      refetch();
      setShowAddLead(false);
      resetForm();
    },
    onError: () => toast.error("Failed to add lead"),
  });

  const updateMutation = trpc.leads.update.useMutation({
    onSuccess: () => {
      toast.success("Lead updated");
      refetch();
    },
  });

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSource("website");
    setNotes("");
  };

  const handleCreate = () => {
    if (!name) {
      toast.error("Please enter a name");
      return;
    }
    createMutation.mutate({
      name,
      email: email || undefined,
      phone: phone || undefined,
      source,
      notes: notes || undefined,
    });
  };

  const newThisWeek = leads.filter(l => {
    const created = new Date(l.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return created >= weekAgo;
  }).length;

  const contacted = leads.filter(l => l.status === 'contacted' || l.status === 'qualified' || l.status === 'converted').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'contacted': return 'bg-yellow-500/20 text-yellow-400';
      case 'qualified': return 'bg-green-500/20 text-green-400';
      case 'converted': return 'bg-purple-500/20 text-purple-400';
      case 'lost': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_240)] via-[oklch(0.14_0.03_260)] to-[oklch(0.12_0.02_240)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/tools">
              <Button variant="ghost" className="mb-4">← Back to Tools</Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent">
              Receptionist & Leads
            </h1>
            <p className="text-[oklch(0.78_0.08_240)] mt-2">
              Manage your leads and track conversions
            </p>
          </div>
          <Dialog open={showAddLead} onOpenChange={setShowAddLead}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)]">
                <Plus className="mr-2 h-4 w-4" /> Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-[oklch(0.78_0.08_240)]">Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                </div>
                <div>
                  <Label className="text-[oklch(0.78_0.08_240)]">Source</Label>
                  <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full p-2 rounded bg-[oklch(0.12_0.02_240)] border border-[oklch(0.78_0.08_240)]/20 text-white">
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                    <option value="phone">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="event">Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label className="text-[oklch(0.78_0.08_240)]">Notes</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                </div>
                <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                  {createMutation.isPending ? "Adding..." : "Add Lead"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[oklch(0.78_0.08_240)]">Total Leads</p>
                  <p className="text-3xl font-bold text-white mt-1">{leads.length}</p>
                </div>
                <User className="h-8 w-8 text-[oklch(0.72_0.18_200)] opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[oklch(0.78_0.08_240)]">New This Week</p>
                  <p className="text-3xl font-bold text-white mt-1">{newThisWeek}</p>
                </div>
                <Phone className="h-8 w-8 text-[oklch(0.68_0.15_280)] opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[oklch(0.78_0.08_240)]">Contacted</p>
                  <p className="text-3xl font-bold text-white mt-1">{contacted}</p>
                </div>
                <Mail className="h-8 w-8 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leads List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.72_0.18_200)]" />
          </div>
        ) : leads.length === 0 ? (
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20 p-12 text-center">
            <Phone className="h-16 w-16 text-[oklch(0.72_0.18_200)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No Leads Yet</h3>
            <p className="text-[oklch(0.78_0.08_240)] mb-6">
              Click "Add Lead" to start tracking your leads
            </p>
          </Card>
        ) : (
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[oklch(0.78_0.08_240)]/20">
                  <tr className="bg-[oklch(0.12_0.02_240)]">
                    <th className="text-left p-4 text-sm font-bold text-[oklch(0.78_0.08_240)]">Name</th>
                    <th className="text-left p-4 text-sm font-bold text-[oklch(0.78_0.08_240)]">Email</th>
                    <th className="text-left p-4 text-sm font-bold text-[oklch(0.78_0.08_240)]">Phone</th>
                    <th className="text-left p-4 text-sm font-bold text-[oklch(0.78_0.08_240)]">Source</th>
                    <th className="text-center p-4 text-sm font-bold text-[oklch(0.78_0.08_240)]">Status</th>
                    <th className="text-right p-4 text-sm font-bold text-[oklch(0.78_0.08_240)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-[oklch(0.78_0.08_240)]/10 hover:bg-[oklch(0.14_0.02_240)]">
                      <td className="p-4 font-semibold text-white">{lead.name || "—"}</td>
                      <td className="p-4 text-[oklch(0.78_0.08_240)]">{lead.email || "—"}</td>
                      <td className="p-4 text-[oklch(0.78_0.08_240)]">{lead.phone || "—"}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs font-bold rounded bg-[oklch(0.72_0.18_200)]/20 text-[oklch(0.72_0.18_200)]">
                          {lead.source || "DIRECT"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <select 
                          value={lead.status} 
                          onChange={(e) => updateMutation.mutate({ id: lead.id, status: e.target.value as "new" | "contacted" | "qualified" | "converted" | "lost" })}
                          className={`px-2 py-1 text-xs font-bold rounded border-0 cursor-pointer ${getStatusColor(lead.status)}`}
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="qualified">QUALIFIED</option>
                          <option value="converted">CONVERTED</option>
                          <option value="lost">LOST</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {lead.email && (
                            <Button size="sm" variant="ghost" onClick={() => window.open(`mailto:${lead.email}`)}>
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          {lead.phone && (
                            <Button size="sm" variant="ghost" onClick={() => window.open(`tel:${lead.phone}`)}>
                              <Phone className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
