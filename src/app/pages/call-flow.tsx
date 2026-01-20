import { Phone, MessageCircle, Calendar, DollarSign, CheckCircle, XCircle, User, ArrowRight, GitBranch } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";

export function CallFlowPage() {
  const flowSteps = [
    {
      id: 1,
      title: "Incoming Call",
      icon: Phone,
      description: "Customer dials business number",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Avery Greeting",
      icon: MessageCircle,
      description: '"Hi, this is Avery with {{Business Name}}. How can I help you today?"',
      color: "bg-accent"
    },
    {
      id: 3,
      title: "Intent Detection",
      icon: GitBranch,
      description: "Avery analyzes customer request",
      color: "bg-purple-500",
      branches: [
        { label: "Book Appointment", path: "booking" },
        { label: "General Inquiry", path: "info" },
        { label: "Complex Request", path: "escalate" }
      ]
    }
  ];

  const bookingFlow = [
    { title: "Check Availability", icon: Calendar, description: "Query calendar for open slots" },
    { title: "Confirm Details", icon: CheckCircle, description: "Verify date, time, and service" },
    { title: "Send Payment Link", icon: DollarSign, description: "SMS secure payment link if deposit required" },
    { title: "Confirmation", icon: MessageCircle, description: "Send booking confirmation via SMS/Email" }
  ];

  const infoFlow = [
    { title: "Provide Information", icon: MessageCircle, description: "Answer customer questions" },
    { title: "Follow-up Offer", icon: Calendar, description: "Offer to book appointment if relevant" }
  ];

  const escalateFlow = [
    { title: "Collect Details", icon: User, description: "Gather customer information" },
    { title: "Transfer/Message", icon: Phone, description: "Connect to team or schedule callback" }
  ];

  const fallbackFlow = [
    { title: "No Answer", icon: XCircle, description: "Call goes to voicemail" },
    { title: "Voicemail", icon: MessageCircle, description: "Leave professional message" },
    { title: "SMS Follow-up", icon: MessageCircle, description: "Automated text with callback link" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Call Flow Map</h1>
        <p className="text-muted-foreground">Visual representation of Avery's call handling logic</p>
      </div>

      {/* Main Flow */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Main Call Flow</h2>
        <div className="flex flex-col gap-4">
          {flowSteps.map((step, index) => (
            <div key={step.id}>
              <GlassmorphismCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center shrink-0`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </GlassmorphismCard>

              {step.branches && (
                <div className="flex justify-center my-6">
                  <GitBranch className="w-8 h-8 text-accent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Branch Flows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Path */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Booking Path</h3>
          </div>
          {bookingFlow.map((step, i) => (
            <GlassmorphismCard key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                  <step.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            </GlassmorphismCard>
          ))}
        </div>

        {/* Info Path */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Information Path</h3>
          </div>
          {infoFlow.map((step, i) => (
            <GlassmorphismCard key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <step.icon className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            </GlassmorphismCard>
          ))}
        </div>

        {/* Escalation Path */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Escalation Path</h3>
          </div>
          {escalateFlow.map((step, i) => (
            <GlassmorphismCard key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <step.icon className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            </GlassmorphismCard>
          ))}
        </div>
      </div>

      {/* Fallback Flow */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Fallback: No Answer Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fallbackFlow.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <GlassmorphismCard className="p-4 flex-1">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <step.icon className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              </GlassmorphismCard>
              {i < fallbackFlow.length - 1 && (
                <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical Notes */}
      <GlassmorphismCard className="p-6">
        <h3 className="font-semibold mb-4">Integration Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="text-muted-foreground w-32">Phone Provider:</span>
            <span>Twilio (SIP/PSTN)</span>
          </div>
          <div className="flex gap-3">
            <span className="text-muted-foreground w-32">Calendar:</span>
            <span>Google Calendar API / CalDAV</span>
          </div>
          <div className="flex gap-3">
            <span className="text-muted-foreground w-32">Payments:</span>
            <span>Stripe Payment Links</span>
          </div>
          <div className="flex gap-3">
            <span className="text-muted-foreground w-32">SMS:</span>
            <span>Twilio Messaging</span>
          </div>
          <div className="flex gap-3">
            <span className="text-muted-foreground w-32">Voice:</span>
            <span>Text-to-Speech (TTS) + Speech-to-Text (STT)</span>
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
}
