import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Mic, 
  Upload, 
  Play, 
  Pause, 
  CheckCircle2, 
  Waveform,
  Sparkles,
  Volume2,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { GlassmorphismCard } from '../components/avery/glassmorphism-card';

export default function VoiceCloning() {
  const [step, setStep] = useState<'upload' | 'processing' | 'preview' | 'complete'>('upload');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        setStep('processing');
        simulateProcessing();
      }, 3000);
    }
  };

  const simulateProcessing = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep('preview'), 500);
      }
    }, 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStep('processing');
      simulateProcessing();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1433] to-[#0a0e27] text-gray-100">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f1433]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Voice Cloning</h1>
              <p className="text-sm text-gray-400">Make Avery sound exactly like you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-semibold">Elite Feature</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Your Voice. Your Brand. Your AI.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Clone your voice in 30 seconds. Customers will think they're talking to you personally, 
            not a generic AI bot.
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {['Record/Upload', 'AI Processing', 'Preview', 'Deploy'].map((label, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'upload' && index === 0 ? 'bg-purple-500' :
                  step === 'processing' && index === 1 ? 'bg-purple-500' :
                  step === 'preview' && index === 2 ? 'bg-purple-500' :
                  step === 'complete' && index === 3 ? 'bg-purple-500' :
                  'bg-white/10'
                }`}>
                  {index + 1}
                </div>
                <span className="text-xs text-gray-400 mt-2">{label}</span>
              </div>
              {index < 3 && (
                <div className={`w-12 h-0.5 ${
                  (step === 'processing' && index < 1) ||
                  (step === 'preview' && index < 2) ||
                  (step === 'complete' && index < 3)
                    ? 'bg-purple-500'
                    : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Instructions/Controls */}
          <div>
            {step === 'upload' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassmorphismCard className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Step 1: Record Your Voice</h3>
                  <p className="text-gray-400 mb-6">
                    Read the script below clearly. The AI needs 30 seconds to capture your unique voice patterns.
                  </p>

                  {/* Sample Script */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Read This Script:</h4>
                    <p className="text-sm leading-relaxed text-gray-400">
                      "Hi, thank you for calling [Your Business Name]. This is [Your Name]. 
                      I'm here to help you today. How can I assist you? We offer a variety of services 
                      including appointments, consultations, and support. I'd be happy to book 
                      something for you or answer any questions you might have. Let me know 
                      what works best for your schedule."
                    </p>
                  </div>

                  {/* Recording Controls */}
                  <div className="space-y-4">
                    <Button
                      onClick={handleRecord}
                      className={`w-full ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-purple-500 hover:bg-purple-600'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Stop Recording ({Math.floor(Math.random() * 30)}s)
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-[#0f1433] px-3 text-gray-400">or</span>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Audio File
                    </Button>
                  </div>

                  {/* Tips */}
                  <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Pro Tips
                    </h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Record in a quiet environment</li>
                      <li>• Speak naturally and clearly</li>
                      <li>• Read the entire script without pausing</li>
                      <li>• Higher quality = better cloning results</li>
                    </ul>
                  </div>
                </GlassmorphismCard>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassmorphismCard className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Step 2: AI Processing</h3>
                  <p className="text-gray-400 mb-6">
                    Our AI is analyzing your voice patterns, tone, pace, and unique characteristics...
                  </p>

                  {/* Processing Animation */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                      />
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${processingProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">
                      {processingProgress}% complete
                    </p>
                  </div>

                  {/* Processing Steps */}
                  <div className="space-y-3">
                    {[
                      { label: 'Analyzing voice patterns', done: processingProgress > 20 },
                      { label: 'Extracting tone characteristics', done: processingProgress > 40 },
                      { label: 'Training AI model', done: processingProgress > 60 },
                      { label: 'Optimizing speech patterns', done: processingProgress > 80 },
                      { label: 'Finalizing voice clone', done: processingProgress > 95 },
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {step.done ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-white/20 rounded-full" />
                        )}
                        <span className={`text-sm ${step.done ? 'text-white' : 'text-gray-500'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassmorphismCard>
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassmorphismCard className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Step 3: Preview Your Clone</h3>
                  <p className="text-gray-400 mb-6">
                    Listen to how Avery sounds with your voice. You can regenerate if needed.
                  </p>

                  {/* Voice Comparison */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold">Original Recording</span>
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </Button>
                      </div>
                      <div className="flex gap-1 h-12">
                        {[...Array(40)].map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-purple-500/30 rounded-sm"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold">AI Cloned Voice</span>
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </Button>
                      </div>
                      <div className="flex gap-1 h-12">
                        {[...Array(40)].map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-purple-500 rounded-sm"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sample Phrases */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold mb-3">Test with sample phrases:</h4>
                    <div className="space-y-2">
                      {[
                        "Hi, thank you for calling!",
                        "I'd be happy to book that for you.",
                        "What time works best for your schedule?"
                      ].map((phrase, index) => (
                        <button
                          key={index}
                          className="w-full text-left text-sm bg-white/5 hover:bg-white/10 rounded p-3 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">"{phrase}"</span>
                            <Volume2 className="w-4 h-4 text-purple-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep('upload')}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      className="flex-1 bg-purple-500 hover:bg-purple-600"
                      onClick={() => setStep('complete')}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Deploy
                    </Button>
                  </div>
                </GlassmorphismCard>
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <GlassmorphismCard className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Voice Clone Deployed!</h3>
                  <p className="text-gray-400 mb-6">
                    Avery now sounds exactly like you. Every customer will think they're talking to you personally.
                  </p>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-300">
                      Your voice clone is now active on all incoming calls. You can update or change it anytime.
                    </p>
                  </div>
                  <Button
                    className="bg-purple-500 hover:bg-purple-600"
                    onClick={() => window.location.href = '#dashboard'}
                  >
                    Go to Dashboard
                  </Button>
                </GlassmorphismCard>
              </motion.div>
            )}
          </div>

          {/* Right: Benefits & Stats */}
          <div className="space-y-6">
            <GlassmorphismCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Why Voice Cloning Matters</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Personal Connection",
                    description: "Customers feel like they're talking to you, not a robot",
                    stat: "+47% satisfaction"
                  },
                  {
                    title: "Brand Consistency",
                    description: "Your voice, your brand, every single call",
                    stat: "+32% trust"
                  },
                  {
                    title: "Higher Conversion",
                    description: "Personal touch leads to more bookings and sales",
                    stat: "+28% conversion"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{benefit.title}</h4>
                      <span className="text-xs text-purple-400 font-semibold">{benefit.stat}</span>
                    </div>
                    <p className="text-sm text-gray-400">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </GlassmorphismCard>

            <GlassmorphismCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Technical Specs</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Model</span>
                  <span>ElevenLabs v3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voice Accuracy</span>
                  <span className="text-green-500">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Time</span>
                  <span>~30 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Languages Supported</span>
                  <span>50+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Audio Quality</span>
                  <span>Studio Grade</span>
                </div>
              </div>
            </GlassmorphismCard>

            <GlassmorphismCard className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <h3 className="text-lg font-semibold mb-2">Elite Feature</h3>
              <p className="text-sm text-gray-400 mb-4">
                Voice Cloning is only available on the Elite plan ($49.99/month)
              </p>
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => window.location.href = '#pricing'}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Elite
              </Button>
            </GlassmorphismCard>
          </div>
        </div>
      </div>
    </div>
  );
}
