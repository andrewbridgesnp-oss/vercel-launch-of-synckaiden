import { Play, Phone, Calendar, DollarSign, CheckCircle, Video } from "lucide-react";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { CallTimeline } from "../components/avery/call-timeline";
import { Button } from "../components/ui/button";

export function DemoPage() {
  const demoScript = [
    {
      speaker: "Avery",
      text: '"Hi, this is Avery with Acme Services. How can I help you today?"'
    },
    {
      speaker: "Customer",
      text: '"Hi, I\'d like to schedule a consultation."'
    },
    {
      speaker: "Avery",
      text: '"Perfect! I can help you book that. I have availability on January 15th at 2:00 PM, January 16th at 10:00 AM, or January 17th at 3:00 PM. Which works best for you?"'
    },
    {
      speaker: "Customer",
      text: '"January 15th at 2 PM sounds good."'
    },
    {
      speaker: "Avery",
      text: '"Great! I\'ve got you scheduled for a consultation on January 15th at 2:00 PM. The session is 60 minutes and costs $150. A deposit is required to confirm. I\'ll send you a secure payment link via text right now. Can I confirm your phone number is +1 (555) 123-4567?"'
    },
    {
      speaker: "Customer",
      text: '"Yes, that\'s correct."'
    },
    {
      speaker: "Avery",
      text: '"Perfect! I\'ve sent the payment link to your phone. Once you complete the payment, you\'ll receive a confirmation with all the details. Is there anything else I can help you with?"'
    },
    {
      speaker: "Customer",
      text: '"No, that\'s all. Thank you!"'
    },
    {
      speaker: "Avery",
      text: '"You\'re welcome! We look forward to seeing you on January 15th. Have a great day!"'
    }
  ];

  const timelineSteps = [
    {
      icon: "phone" as const,
      label: "Customer calls",
      time: "0:00",
      status: "completed" as const
    },
    {
      icon: "calendar" as const,
      label: "Appointment booked for Jan 15, 2 PM",
      time: "1:30",
      status: "completed" as const
    },
    {
      icon: "payment" as const,
      label: "Payment link sent via SMS",
      time: "2:15",
      status: "completed" as const
    },
    {
      icon: "complete" as const,
      label: "Confirmation email sent",
      time: "2:45",
      status: "completed" as const
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">See Avery in Action</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Watch how Avery handles a typical customer interaction from start to finish
        </p>
        
        {/* Interactive Demo CTA */}
        <div className="bg-gradient-to-r from-[#00d9ff]/20 to-[#0099ff]/20 border border-[#00d9ff]/30 rounded-2xl p-8 max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#00d9ff]/20 rounded-full flex items-center justify-center">
              <Video className="w-6 h-6 text-[#00d9ff]" />
            </div>
            <h2 className="text-2xl font-bold">Interactive Demo Available</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Experience a fully interactive demo with animations, real-time updates, and step-by-step walkthrough of Avery's capabilities
          </p>
          <Button 
            onClick={() => window.location.href = '#interactive-demo'}
            className="bg-[#00d9ff] hover:bg-[#00b8e6] text-[#0a0e27] font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            Launch Interactive Demo
          </Button>
        </div>
      </div>

      {/* Demo Video Placeholder */}
      <GlassmorphismCard className="p-12">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
          <Button size="lg" className="h-20 w-20 rounded-full">
            <Play className="w-8 h-8 fill-current" />
          </Button>
        </div>
      </GlassmorphismCard>

      {/* Demo Script */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Conversation Transcript</h2>
          <GlassmorphismCard className="p-6">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {demoScript.map((line, i) => (
                <div key={i} className={`${line.speaker === "Avery" ? "text-left" : "text-right"}`}>
                  <div className={`inline-block max-w-[85%] ${
                    line.speaker === "Avery"
                      ? "bg-accent/10 border-l-2 border-accent"
                      : "bg-muted/50 border-r-2 border-primary"
                  } p-4 rounded-lg`}>
                    <p className="text-xs font-semibold mb-1 text-muted-foreground">{line.speaker}</p>
                    <p className="text-sm">{line.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassmorphismCard>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">What Happened</h2>
          <GlassmorphismCard className="p-6">
            <CallTimeline steps={timelineSteps} />

            <div className="mt-8 pt-6 border-t space-y-4">
              <h3 className="font-semibold">Outcome Summary</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Call Duration: 2:45</p>
                    <p className="text-sm text-muted-foreground">Efficient and professional</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Appointment Confirmed</p>
                    <p className="text-sm text-muted-foreground">January 15, 2026 at 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">$150 Deposit Secured</p>
                    <p className="text-sm text-muted-foreground">Payment link sent and processed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Confirmations Sent</p>
                    <p className="text-sm text-muted-foreground">SMS and email delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </div>
      </div>

      {/* Key Features Highlighted */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Key Capabilities Demonstrated</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: Phone, title: "Natural Conversation", desc: "Professional, human-like interaction" },
            { icon: Calendar, title: "Smart Scheduling", desc: "Real-time calendar availability" },
            { icon: DollarSign, title: "Payment Collection", desc: "Secure deposit processing" },
            { icon: CheckCircle, title: "Automated Follow-ups", desc: "Instant confirmations" }
          ].map((feature, i) => (
            <GlassmorphismCard key={i} className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </GlassmorphismCard>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <GlassmorphismCard className="p-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Set up Avery for your business in under 5 minutes
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Start Free Trial
          </Button>
        </GlassmorphismCard>
      </div>
    </div>
  );
}
