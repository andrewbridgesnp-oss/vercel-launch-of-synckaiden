import { useState } from "react";
import { Phone, Filter, Search, Download, Play } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { StatusBadge } from "../components/avery/status-badge";
import { AudioPlayer } from "../components/avery/audio-player";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

interface CallsPageProps {
  onNavigate: (page: string) => void;
}

export function CallsPage({ onNavigate }: CallsPageProps) {
  const [filterOutcome, setFilterOutcome] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<any>(null);

  const calls = [
    {
      id: "C-1001",
      caller: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      date: "Jan 11, 2026",
      time: "2:45 PM",
      duration: "3:24",
      outcome: "Appointment Booked",
      outcomeType: "success",
      transcript: "Customer called to schedule a consultation. Avery successfully booked an appointment for January 15th at 2:00 PM and sent confirmation via SMS.",
      recording: true
    },
    {
      id: "C-1002",
      caller: "Michael Chen",
      phone: "+1 (555) 234-5678",
      date: "Jan 11, 2026",
      time: "1:20 PM",
      duration: "2:15",
      outcome: "Payment Collected",
      outcomeType: "success",
      transcript: "Customer inquired about services. Avery provided information and successfully processed a $150 deposit payment.",
      recording: true
    },
    {
      id: "C-1003",
      caller: "Emma Davis",
      phone: "+1 (555) 345-6789",
      date: "Jan 11, 2026",
      time: "11:05 AM",
      duration: "1:48",
      outcome: "Information Provided",
      outcomeType: "info",
      transcript: "Customer asked about business hours and services. Avery provided requested information.",
      recording: true
    },
    {
      id: "C-1004",
      caller: "James Wilson",
      phone: "+1 (555) 456-7890",
      date: "Jan 11, 2026",
      time: "9:30 AM",
      duration: "4:12",
      outcome: "Escalated to Team",
      outcomeType: "escalated",
      transcript: "Customer had a complex inquiry. Avery collected details and successfully transferred to available team member.",
      recording: true
    },
    {
      id: "C-1005",
      caller: "Lisa Anderson",
      phone: "+1 (555) 567-8901",
      date: "Jan 10, 2026",
      time: "4:15 PM",
      duration: "0:45",
      outcome: "Voicemail + Follow-up",
      outcomeType: "voicemail",
      transcript: "No answer. Avery left a professional voicemail and sent an automated SMS follow-up.",
      recording: false
    }
  ];

  const filteredCalls = calls.filter(call => {
    if (filterOutcome !== "all" && call.outcomeType !== filterOutcome) return false;
    if (searchQuery && !call.caller.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !call.phone.includes(searchQuery)) return false;
    return true;
  });

  const outcomeBadges: Record<string, "active" | "pending" | "trial"> = {
    success: "active",
    info: "pending",
    escalated: "trial",
    voicemail: "pending"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Calls & Messages</h1>
        <p className="text-muted-foreground">Review all interactions handled by Avery</p>
      </div>

      {/* Filters */}
      <GlassmorphismCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={filterOutcome} onValueChange={setFilterOutcome}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outcomes</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="info">Information</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="voicemail">Voicemail</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDate} onValueChange={setFilterDate}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </GlassmorphismCard>

      {/* Calls Table */}
      <GlassmorphismCard className="p-6">
        {filteredCalls.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Call ID</TableHead>
                  <TableHead>Caller</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Recording</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call) => (
                  <TableRow
                    key={call.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => setSelectedCall(call)}
                  >
                    <TableCell className="font-mono text-sm">{call.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{call.caller}</p>
                        <p className="text-sm text-muted-foreground">{call.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{call.date}</p>
                        <p className="text-sm text-muted-foreground">{call.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>{call.duration}</TableCell>
                    <TableCell>
                      <StatusBadge status={outcomeBadges[call.outcomeType]} />
                    </TableCell>
                    <TableCell>
                      {call.recording ? (
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCall(call);
                        }}>
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Phone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No calls yet</h3>
            <p className="text-muted-foreground mb-6">
              Avery is standing by and ready to answer calls
            </p>
            <Button onClick={() => onNavigate("dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        )}
      </GlassmorphismCard>

      {/* Call Detail Dialog */}
      <Dialog open={!!selectedCall} onOpenChange={(open) => !open && setSelectedCall(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-6">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Caller</p>
                  <p className="font-medium">{selectedCall.caller}</p>
                  <p className="text-sm text-muted-foreground">{selectedCall.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{selectedCall.date}</p>
                  <p className="text-sm text-muted-foreground">{selectedCall.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedCall.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outcome</p>
                  <StatusBadge status={outcomeBadges[selectedCall.outcomeType]} />
                </div>
              </div>

              {/* Recording */}
              {selectedCall.recording && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Call Recording</p>
                  <AudioPlayer duration={selectedCall.duration} fileName={`${selectedCall.id}.mp3`} />
                </div>
              )}

              {/* Transcript */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Transcript</p>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm leading-relaxed">{selectedCall.transcript}</p>
                </div>
              </div>

              {/* Outcome Details */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">Outcome</p>
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <p className="font-medium text-accent">{selectedCall.outcome}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
