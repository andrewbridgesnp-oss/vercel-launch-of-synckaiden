import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Mail, 
  Phone, 
  Building, 
  Tag,
  TrendingUp,
  UserCheck,
  UserPlus,
  Activity
} from "lucide-react";

export default function CRM() {
  const [workspaceId] = useState(1); // TODO: Get from workspace context
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"lead" | "prospect" | "customer" | "inactive" | undefined>();
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Fetch contacts
  const { data: contacts, isLoading, refetch } = trpc.crm.listContacts.useQuery({
    workspaceId,
    search: searchTerm,
    status: statusFilter,
    limit: 100,
    offset: 0,
  });

  // Fetch stats
  const { data: stats } = trpc.crm.getStats.useQuery({ workspaceId });

  // Fetch tags
  const { data: tags } = trpc.crm.listTags.useQuery({ workspaceId });

  // Create contact mutation
  const createContact = trpc.crm.createContact.useMutation({
    onSuccess: () => {
      refetch();
      setShowAddContact(false);
      // Auto-refresh contacts every 30 seconds
      const interval = setInterval(() => refetch(), 30000);
      return () => clearInterval(interval);
    },
  });

  // Auto-refresh contacts on mount
  useEffect(() => {
    const interval = setInterval(() => refetch(), 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Export contacts
  const { data: exportData, refetch: triggerExport } = trpc.crm.exportContacts.useQuery(
    { workspaceId },
    { enabled: false }
  );

  const handleExport = async () => {
    const result = await triggerExport();
    if (result.data) {
      // Convert to CSV
      const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Status"];
      const csv = [
        headers.join(","),
        ...result.data.map(c => [
          c.firstName || "",
          c.lastName || "",
          c.email || "",
          c.phone || "",
          c.company || "",
          c.status,
        ].join(","))
      ].join("\\n");

      // Download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lead": return "bg-blue-500/10 text-blue-500";
      case "prospect": return "bg-purple-500/10 text-purple-500";
      case "customer": return "bg-green-500/10 text-green-500";
      case "inactive": return "bg-gray-500/10 text-gray-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity: 0.3,
          filter: 'blur(4px)',
          zIndex: 0
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/grok-video-8a01fda2-d9ef-4065-a2f7-104de5fe0d0c.mp4" type="video/mp4" />
      </video>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            CRM & Contacts
          </h1>
          <p className="text-slate-400">
            Manage your customer relationships and grow your business
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Total Contacts</CardDescription>
              <CardTitle className="text-3xl text-cyan-400">{stats?.total || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-400">
                <Users className="w-4 h-4 mr-1" />
                All contacts
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Leads</CardDescription>
              <CardTitle className="text-3xl text-blue-400">{stats?.leads || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-400">
                <UserPlus className="w-4 h-4 mr-1" />
                New prospects
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Prospects</CardDescription>
              <CardTitle className="text-3xl text-purple-400">{stats?.prospects || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                In pipeline
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Customers</CardDescription>
              <CardTitle className="text-3xl text-green-400">{stats?.customers || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-400">
                <UserCheck className="w-4 h-4 mr-1" />
                Active customers
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card className="bg-slate-900/50 border-slate-800 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search contacts by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              {/* Filter by status */}
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="lead">Leads</SelectItem>
                  <SelectItem value="prospect">Prospects</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAddContact(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowImport(true)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>

                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Contacts</CardTitle>
            <CardDescription className="text-slate-400">
              {contacts?.length || 0} contacts found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-slate-400">Loading contacts...</div>
            ) : contacts && contacts.length > 0 ? (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {contact.firstName} {contact.lastName}
                          </h3>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                          {contact.leadScore && contact.leadScore > 0 && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                              Score: {contact.leadScore}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-400">
                          {contact.email && (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                              {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-green-400" />
                              {contact.phone}
                            </div>
                          )}
                          {contact.company && (
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-2 text-purple-400" />
                              {contact.company}
                            </div>
                          )}
                        </div>

                        {contact.tags && Array.isArray(contact.tags) && contact.tags.length > 0 ? (
                          <div className="flex gap-2 mt-2">
                            {(contact.tags as string[]).map((tag: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2">No contacts yet</h3>
                <p className="text-slate-500 mb-4">
                  Get started by adding your first contact or importing from CSV
                </p>
                <Button
                  onClick={() => setShowAddContact(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Contact
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Contact Dialog */}
        <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription className="text-slate-400">
                Create a new contact in your CRM
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createContact.mutate({
                  workspaceId,
                  firstName: formData.get("firstName") as string,
                  lastName: formData.get("lastName") as string,
                  email: formData.get("email") as string,
                  phone: formData.get("phone") as string,
                  company: formData.get("company") as string,
                  jobTitle: formData.get("jobTitle") as string,
                  status: (formData.get("status") as any) || "lead",
                  notes: formData.get("notes") as string,
                });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="lead">
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  className="bg-slate-800 border-slate-700"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddContact(false)}
                  className="border-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500"
                  disabled={createContact.isPending}
                >
                  {createContact.isPending ? "Creating..." : "Create Contact"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle>Import Contacts</DialogTitle>
              <DialogDescription className="text-slate-400">
                Upload a CSV file with your contacts (columns: firstName, lastName, email, phone, company, jobTitle)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                <p className="text-slate-400 mb-2">Drag and drop your CSV file here</p>
                <p className="text-sm text-slate-500 mb-4">or</p>
                <Button variant="outline" className="border-slate-700">
                  Choose File
                </Button>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">CSV Format Example:</h4>
                <pre className="text-xs text-slate-400 overflow-x-auto">
                  firstName,lastName,email,phone,company,jobTitle{"\n"}
                  John,Doe,john@example.com,555-1234,Acme Inc,CEO{"\n"}
                  Jane,Smith,jane@example.com,555-5678,Tech Corp,CTO
                </pre>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
