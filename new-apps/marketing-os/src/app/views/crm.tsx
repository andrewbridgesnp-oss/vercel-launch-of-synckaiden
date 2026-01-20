import { GlassCard } from "../components/glass-card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building2,
  Calendar,
  Tag,
  MoreVertical,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: "lead" | "qualified" | "customer" | "inactive";
  tags: string[];
  lastContact: string;
  notes: number;
  nextTask?: string;
  value?: number;
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Innovations Inc",
    status: "customer",
    tags: ["vip", "enterprise"],
    lastContact: "2 hours ago",
    notes: 8,
    value: 24500,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@startup.io",
    phone: "+1 (555) 234-5678",
    company: "StartupXYZ",
    status: "qualified",
    tags: ["hot-lead", "tech"],
    lastContact: "1 day ago",
    notes: 5,
    nextTask: "Follow-up call scheduled",
    value: 18200,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@enterprise.com",
    company: "Enterprise Solutions",
    status: "lead",
    tags: ["new", "b2b"],
    lastContact: "3 days ago",
    notes: 2,
    nextTask: "Send proposal",
  },
  {
    id: "4",
    name: "David Park",
    email: "david@agency.com",
    phone: "+1 (555) 456-7890",
    company: "Creative Agency",
    status: "customer",
    tags: ["returning"],
    lastContact: "1 week ago",
    notes: 12,
    value: 31200,
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    lead: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    customer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-muted/50 text-muted-foreground border-border",
  };
  return colors[status as keyof typeof colors];
};

export function CRM() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">CRM</h2>
          <p className="text-muted-foreground mt-1">Fast, lightweight contact management</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search contacts..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <Tag className="h-4 w-4" />
          Tags
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Contacts ({contacts.length})</TabsTrigger>
          <TabsTrigger value="customers">
            Customers ({contacts.filter((c) => c.status === "customer").length})
          </TabsTrigger>
          <TabsTrigger value="leads">
            Leads ({contacts.filter((c) => c.status === "lead" || c.status === "qualified").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {contacts.map((contact) => (
            <GlassCard key={contact.id} className="p-6" hover>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Contact Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {contact.name}
                        {contact.status === "customer" && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                      </h3>
                      {contact.company && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Building2 className="h-3 w-3" />
                          {contact.company}
                        </p>
                      )}
                    </div>
                    <Badge className={getStatusColor(contact.status)} variant="outline">
                      {contact.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last contact: {contact.lastContact}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Next Task */}
                  {contact.nextTask && (
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-sm text-blue-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {contact.nextTask}
                      </p>
                    </div>
                  )}
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-col gap-4 lg:w-48">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    {contact.value && (
                      <div className="p-3 rounded-lg bg-accent/30 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                        <p className="text-lg font-semibold text-primary">${contact.value.toLocaleString()}</p>
                      </div>
                    )}
                    <div className="p-3 rounded-lg bg-accent/30 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-lg font-semibold">{contact.notes}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="w-full">
                          <MoreVertical className="h-4 w-4 mr-2" />
                          More
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuItem>Add Task</DropdownMenuItem>
                        <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                        <DropdownMenuItem>View Timeline</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          {contacts
            .filter((c) => c.status === "customer")
            .map((contact) => (
              <GlassCard key={contact.id} className="p-6">
                <p className="text-sm text-muted-foreground">Customer view - Same card design as above</p>
              </GlassCard>
            ))}
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          {contacts
            .filter((c) => c.status === "lead" || c.status === "qualified")
            .map((contact) => (
              <GlassCard key={contact.id} className="p-6">
                <p className="text-sm text-muted-foreground">Lead view - Same card design as above</p>
              </GlassCard>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
