import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Play,
  Volume2,
  Pause,
  SkipForward,
  RefreshCw
} from 'lucide-react';

interface DemoStep {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
  duration: number;
  narration: string;
}

export default function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callProgress, setCallProgress] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: "Customer Calls Your Business",
      description: "A potential client calls at 2:47 AM - outside business hours",
      narration: "It's 2:47 AM. Sarah needs an emergency plumbing service. Your human receptionist is asleep, but Avery AI is wide awake.",
      duration: 3000,
      component: <IncomingCallScene />
    },
    {
      id: 2,
      title: "Avery Answers Instantly",
      description: "AI picks up in under 1 second with natural conversation",
      narration: "Avery answers immediately, sounding completely human. Sarah doesn't even realize she's talking to AI.",
      duration: 5000,
      component: <CallConversationScene 
        transcript={transcript}
        setTranscript={setTranscript}
      />
    },
    {
      id: 3,
      title: "Intelligent Booking",
      description: "AI understands needs and books the appointment",
      narration: "Avery understands Sarah's emergency, checks your calendar, and books an 8 AM appointment - all in real-time.",
      duration: 4000,
      component: <BookingScene onBooked={() => setBookingCreated(true)} />
    },
    {
      id: 4,
      title: "Payment Link Sent",
      description: "Automated SMS with secure payment link",
      narration: "Before hanging up, Avery texts Sarah a secure payment link for the service deposit.",
      duration: 3000,
      component: <PaymentLinkScene onSent={() => setPaymentSent(true)} />
    },
    {
      id: 5,
      title: "Real-Time Dashboard Update",
      description: "You see everything happening live",
      narration: "You wake up to see the booking, payment, and full conversation transcript - all handled automatically.",
      duration: 4000,
      component: <DashboardUpdateScene 
        bookingCreated={bookingCreated}
        paymentReceived={paymentSent}
      />
    },
    {
      id: 6,
      title: "Results: $0 Labor, 100% Revenue",
      description: "No missed calls, no lost revenue, no overhead",
      narration: "That's Avery. Your 24/7 AI receptionist that never sleeps, never takes a break, and converts every call into revenue.",
      duration: 5000,
      component: <ResultsScene />
    }
  ];

  useEffect(() => {
    if (isPlaying && currentStep < demoSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, demoSteps[currentStep].duration);
      return () => clearTimeout(timer);
    } else if (currentStep >= demoSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (currentStep >= demoSteps.length - 1) {
      handleRestart();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setTranscript([]);
    setBookingCreated(false);
    setPaymentSent(false);
    setIsPlaying(true);
  };

  const currentStepData = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1433] to-[#0a0e27] text-gray-100">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f1433]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Interactive Demo</h1>
            <p className="text-sm text-gray-400 mt-1">See Avery AI in action - real scenario, real results</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {demoSteps.length}
            </span>
            <span className="text-sm text-[#00d9ff]">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00d9ff] to-[#0099ff]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-6 gap-3 mb-12">
          {demoSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`p-4 rounded-xl border transition-all ${
                index === currentStep
                  ? 'bg-[#00d9ff]/10 border-[#00d9ff] shadow-lg shadow-[#00d9ff]/20'
                  : index < currentStep
                  ? 'bg-white/5 border-green-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`text-2xl mb-2 ${
                index === currentStep ? 'text-[#00d9ff]' : index < currentStep ? 'text-green-500' : 'text-gray-500'
              }`}>
                {index < currentStep ? <CheckCircle2 className="w-6 h-6 mx-auto" /> : 
                 index === 0 ? <Phone className="w-6 h-6 mx-auto" /> :
                 index === 1 ? <MessageSquare className="w-6 h-6 mx-auto" /> :
                 index === 2 ? <Calendar className="w-6 h-6 mx-auto" /> :
                 index === 3 ? <CreditCard className="w-6 h-6 mx-auto" /> :
                 index === 4 ? <CheckCircle2 className="w-6 h-6 mx-auto" /> :
                 <CheckCircle2 className="w-6 h-6 mx-auto" />
                }
              </div>
              <div className="text-xs text-center">{step.title.split(' ')[0]}</div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Narration */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#00d9ff]/20 rounded-full flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-[#00d9ff]" />
                </div>
                <div>
                  <h3 className="font-semibold">Narration</h3>
                  <p className="text-xs text-gray-400">Listen to the story</p>
                </div>
              </div>
              
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h4 className="text-lg font-semibold text-white mb-2">
                  {currentStepData.title}
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  {currentStepData.description}
                </p>
                <div className="bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-lg p-4">
                  <p className="text-sm leading-relaxed text-gray-300 italic">
                    "{currentStepData.narration}"
                  </p>
                </div>
              </motion.div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                {!isPlaying ? (
                  <button
                    onClick={handlePlay}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#00d9ff] hover:bg-[#00b8e6] text-[#0a0e27] font-semibold py-3 rounded-lg transition-colors"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    <span>Play Demo</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 font-semibold py-3 rounded-lg transition-colors"
                  >
                    <Pause className="w-5 h-5" fill="currentColor" />
                    <span>Pause</span>
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={currentStep >= demoSteps.length - 1}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Visual Demo */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md min-h-[600px] flex items-center justify-center"
              >
                {currentStepData.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEMO SCENE COMPONENTS
// ============================================

function IncomingCallScene() {
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    setRinging(true);
    const timer = setTimeout(() => setRinging(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full text-center">
      <motion.div
        animate={{ scale: ringing ? [1, 1.1, 1] : 1 }}
        transition={{ repeat: ringing ? Infinity : 0, duration: 1 }}
        className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative"
      >
        <Phone className="w-16 h-16 text-green-500" />
        {ringing && (
          <>
            <motion.div
              className="absolute inset-0 border-4 border-green-500 rounded-full"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-green-500 rounded-full"
              animate={{ scale: [1, 1.5], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.5 }}
            />
          </>
        )}
      </motion.div>
      
      <h3 className="text-2xl font-bold mb-2">+1 (555) 234-5678</h3>
      <p className="text-gray-400 mb-4">Incoming call at 2:47 AM</p>
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-yellow-500">⚠️ Outside business hours - Human staff unavailable</p>
      </div>
    </div>
  );
}

function CallConversationScene({ transcript, setTranscript }: any) {
  const conversation = [
    { speaker: 'Avery', text: "Good evening! Thank you for calling Perfect Plumbing. This is Avery. How can I help you today?" },
    { speaker: 'Sarah', text: "Hi, I have a burst pipe in my kitchen! Water is everywhere!" },
    { speaker: 'Avery', text: "I understand this is urgent. Let me get someone out to you right away. What's your address?" },
    { speaker: 'Sarah', text: "742 Evergreen Terrace, Springfield." },
    { speaker: 'Avery', text: "Perfect. I have an emergency technician available at 8 AM this morning. Does that work for you?" },
    { speaker: 'Sarah', text: "Yes, that would be great! Thank you so much!" },
  ];

  useEffect(() => {
    setTranscript([]);
    conversation.forEach((line, index) => {
      setTimeout(() => {
        setTranscript((prev: any[]) => [...prev, line]);
      }, index * 800);
    });
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#00d9ff]/20 rounded-full flex items-center justify-center mb-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Volume2 className="w-8 h-8 text-[#00d9ff]" />
              </motion.div>
            </div>
            <p className="text-xs text-gray-400">Avery AI</p>
          </div>
          <div className="flex flex-col gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-8 bg-[#00d9ff] rounded-full"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
              />
            ))}
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2">
              <Phone className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400">Sarah M.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transcript.map((line: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: line.speaker === 'Avery' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${line.speaker === 'Avery' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-sm p-4 rounded-2xl ${
              line.speaker === 'Avery'
                ? 'bg-[#00d9ff]/20 border border-[#00d9ff]/30'
                : 'bg-white/10 border border-white/20'
            }`}>
              <p className="text-xs text-gray-400 mb-1">{line.speaker}</p>
              <p className="text-sm">{line.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BookingScene({ onBooked }: { onBooked: () => void }) {
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setIsBooked(true);
      onBooked();
    }, 2000);
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#00d9ff]/20 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#00d9ff]" />
            </div>
            <div>
              <h3 className="font-semibold">Emergency Plumbing Service</h3>
              <p className="text-sm text-gray-400">Creating appointment...</p>
            </div>
          </div>

          {isBooking ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-12 h-12 border-4 border-[#00d9ff] border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Customer</span>
                  <span>Sarah Martinez</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Service</span>
                  <span>Emergency Plumbing</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Date & Time</span>
                  <span>Today, 8:00 AM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Address</span>
                  <span>742 Evergreen Terrace</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Estimated Cost</span>
                  <span className="text-[#00d9ff] font-semibold">$150.00</span>
                </div>
              </div>

              <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-500">Appointment confirmed!</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function PaymentLinkScene({ onSent }: { onSent: () => void }) {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      onSent();
    }, 2000);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#00d9ff]/20 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#00d9ff]" />
          </div>
          <div>
            <h3 className="font-semibold">SMS Payment Link</h3>
            <p className="text-xs text-gray-400">Sent to +1 (555) 234-5678</p>
          </div>
        </div>

        {isSending ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 border-4 border-[#00d9ff] border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0e27] rounded-lg p-4 border border-white/10"
          >
            <div className="text-xs text-gray-500 mb-2">SMS from Perfect Plumbing:</div>
            <p className="text-sm mb-3">
              Hi Sarah! Your emergency plumbing appointment is confirmed for today at 8:00 AM. 
              Please pay the $150 deposit securely here: 
            </p>
            <div className="bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded p-2 mb-3">
              <a href="#" className="text-[#00d9ff] text-xs break-all">
                https://pay.avery-ai.com/pl_abc123xyz
              </a>
            </div>
            <p className="text-xs text-gray-400">
              See you soon! - Avery AI 🔧
            </p>
          </motion.div>
        )}
      </div>

      {sent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-500">Payment link sent successfully!</span>
        </motion.div>
      )}
    </div>
  );
}

function DashboardUpdateScene({ bookingCreated, paymentReceived }: any) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6"
        >
          <Phone className="w-8 h-8 text-green-500 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">1</div>
          <div className="text-sm text-gray-300">Call Handled</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#00d9ff]/20 to-[#0099ff]/10 border border-[#00d9ff]/30 rounded-xl p-6"
        >
          <Calendar className="w-8 h-8 text-[#00d9ff] mb-3" />
          <div className="text-3xl font-bold text-white mb-1">1</div>
          <div className="text-sm text-gray-300">Appointment Booked</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6"
        >
          <CreditCard className="w-8 h-8 text-purple-500 mb-3" />
          <div className="text-3xl font-bold text-white mb-1">$150</div>
          <div className="text-sm text-gray-300">Revenue Secured</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="text-sm">Call received from Sarah Martinez</div>
              <div className="text-xs text-gray-400">2:47 AM • Duration: 2m 34s</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-[#00d9ff] rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="text-sm">Appointment created</div>
              <div className="text-xs text-gray-400">2:48 AM • Emergency Plumbing Service</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="text-sm">Payment link sent</div>
              <div className="text-xs text-gray-400">2:49 AM • $150.00 deposit</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ResultsScene() {
  return (
    <div className="w-full text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </motion.div>

      <h2 className="text-3xl font-bold mb-4">Call Converted Successfully</h2>
      <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
        From missed call to confirmed appointment with payment - all handled automatically while you sleep.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-sm text-gray-400 mb-2">Time Saved</div>
          <div className="text-3xl font-bold text-[#00d9ff]">100%</div>
          <div className="text-xs text-gray-500 mt-2">Zero manual work</div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-sm text-gray-400 mb-2">Conversion Rate</div>
          <div className="text-3xl font-bold text-green-500">100%</div>
          <div className="text-xs text-gray-500 mt-2">No missed opportunities</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-sm text-gray-400 mb-2">Labor Cost</div>
          <div className="text-3xl font-bold text-purple-500">$0</div>
          <div className="text-xs text-gray-500 mt-2">Fully automated</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-sm text-gray-400 mb-2">Revenue Secured</div>
          <div className="text-3xl font-bold text-[#00d9ff]">$150</div>
          <div className="text-xs text-gray-500 mt-2">Paid before service</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#00d9ff]/20 to-[#0099ff]/20 border border-[#00d9ff]/30 rounded-xl p-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">That's the Avery Difference</h3>
        <p className="text-sm text-gray-300">
          Your business never sleeps. Every call answered. Every opportunity captured. 
          Every customer delighted. All without lifting a finger.
        </p>
      </div>
    </div>
  );
}
