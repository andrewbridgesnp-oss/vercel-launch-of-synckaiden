import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Loader2, Plus, Trash2, User, Mail, Phone, MapPin, Video, Check, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Scheduler() {
  const { user } = useAuth();
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [location, setLocation] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  const { data: appointments = [], isLoading, refetch } = trpc.scheduledAppointments.list.useQuery();
  
  const createMutation = trpc.scheduledAppointments.create.useMutation({
    onSuccess: () => {
      toast.success("Appointment scheduled!");
      refetch();
      setShowNewAppointment(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create appointment"),
  });

  const updateMutation = trpc.scheduledAppointments.update.useMutation({
    onSuccess: () => {
      toast.success("Appointment updated");
      refetch();
    },
  });

  const deleteMutation = trpc.scheduledAppointments.delete.useMutation({
    onSuccess: () => {
      toast.success("Appointment deleted");
      refetch();
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("");
    setEndTime("");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setLocation("");
    setMeetingUrl("");
  };

  const handleCreate = () => {
    if (!title || !startDate || !startTime || !endTime) {
      toast.error("Please fill in title, date, start time, and end time");
      return;
    }
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${startDate}T${endTime}`);
    
    createMutation.mutate({
      title,
      description: description || undefined,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      clientName: clientName || undefined,
      clientEmail: clientEmail || undefined,
      clientPhone: clientPhone || undefined,
      location: location || undefined,
      meetingUrl: meetingUrl || undefined,
    });
  };

  const upcomingAppointments = appointments.filter(a => new Date(a.startTime) >= new Date() && a.status !== 'cancelled');
  const thisWeekAppointments = appointments.filter(a => {
    const apptDate = new Date(a.startTime);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return apptDate >= now && apptDate <= weekFromNow && a.status !== 'cancelled';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      case 'no_show': return 'text-orange-400';
      default: return 'text-yellow-400';
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
              Scheduler & Appointments
            </h1>
            <p className="text-[oklch(0.78_0.08_240)] mt-2">
              Manage your appointments and client meetings
            </p>
          </div>
          <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)]">
                <Plus className="mr-2 h-4 w-4" /> New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white">Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-[oklch(0.78_0.08_240)]">Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meeting with client" className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                </div>
                <div>
                  <Label className="text-[oklch(0.78_0.08_240)]">Description</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Meeting details..." className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Date *</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Start *</Label>
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">End *</Label>
                    <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Client Name</Label>
                    <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="John Doe" className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Client Email</Label>
                    <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="john@example.com" className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Phone</Label>
                    <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="(555) 123-4567" className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Location</Label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Office / Address" className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                </div>
                <div>
                  <Label className="text-[oklch(0.78_0.08_240)]">Meeting URL (Zoom/Meet)</Label>
                  <Input value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} placeholder="https://zoom.us/j/..." className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                </div>
                <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                  {createMutation.isPending ? "Scheduling..." : "Schedule Appointment"}
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
                  <p className="text-sm text-[oklch(0.78_0.08_240)]">Total Appointments</p>
                  <p className="text-3xl font-bold text-white mt-1">{appointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-[oklch(0.72_0.18_200)] opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[oklch(0.78_0.08_240)]">This Week</p>
                  <p className="text-3xl font-bold text-white mt-1">{thisWeekAppointments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-[oklch(0.68_0.15_280)] opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[oklch(0.78_0.08_240)]">Upcoming</p>
                  <p className="text-3xl font-bold text-white mt-1">{upcomingAppointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.72_0.18_200)]" />
          </div>
        ) : appointments.length === 0 ? (
          <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20 p-12 text-center">
            <Calendar className="h-16 w-16 text-[oklch(0.72_0.18_200)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No Appointments Yet</h3>
            <p className="text-[oklch(0.78_0.08_240)] mb-6">
              Click "New Appointment" to schedule your first appointment
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <Card key={appt.id} className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{appt.title}</h3>
                        <span className={`text-xs uppercase font-medium ${getStatusColor(appt.status)}`}>
                          {appt.status}
                        </span>
                      </div>
                      {appt.description && (
                        <p className="text-sm text-[oklch(0.78_0.08_240)] mb-2">{appt.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-[oklch(0.78_0.08_240)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(appt.startTime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(appt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {appt.clientName && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {appt.clientName}
                          </span>
                        )}
                        {appt.clientEmail && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {appt.clientEmail}
                          </span>
                        )}
                        {appt.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {appt.location}
                          </span>
                        )}
                        {appt.meetingUrl && (
                          <a href={appt.meetingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[oklch(0.72_0.18_200)] hover:underline">
                            <Video className="w-4 h-4" />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appt.status === 'scheduled' && (
                        <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: appt.id, status: 'confirmed' })} className="border-green-500/30 text-green-400">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: appt.id, status: 'cancelled' })} className="border-red-500/30 text-red-400">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate({ id: appt.id })}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
