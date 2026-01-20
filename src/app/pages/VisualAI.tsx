import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video,
  User,
  Sparkles,
  Eye,
  Camera,
  Monitor,
  Zap,
  Upload,
  Play,
  CheckCircle2,
  Phone,
  MessageSquare,
  Share2,
  Scan,
  Box
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { GlassmorphismCard } from '../components/avery/glassmorphism-card';

export default function VisualAI() {
  const [activeTab, setActiveTab] = useState<'avatar' | 'video' | 'visual'>('avatar');
  const [avatarDemo, setAvatarDemo] = useState(false);

  const features = [
    {
      id: 'avatar',
      icon: User,
      title: 'Hyper-Realistic Avatar',
      subtitle: 'Your Digital Twin',
      color: 'from-purple-500 to-pink-500',
      tagline: 'Not just your voice - your FACE too',
      capabilities: [
        'AI-generated digital twin from photos/video',
        'Lip-sync perfectly with your cloned voice',
        'Natural facial expressions and micro-movements',
        'Eye contact that follows the camera',
        'Customizable attire and background',
        'Real-time rendering (60fps)',
        'Works on phone, tablet, or computer screen'
      ],
      useCases: [
        {
          title: 'First Impressions',
          description: 'Customer calls, sees YOU on screen. Instant trust and personal connection.',
          impact: '+89% trust score vs audio-only'
        },
        {
          title: 'Premium Services',
          description: 'High-ticket services deserve face-to-face. Your avatar delivers that premium feel.',
          impact: '+67% conversion on $500+ services'
        },
        {
          title: 'Multi-location Consistency',
          description: 'YOU in every location, every call, every time. Perfect brand consistency.',
          impact: '100% brand uniformity'
        }
      ],
      competitors: 'Generic cartoon avatars or no visual at all',
      avery: 'Photo-realistic YOU that customers think is real'
    },
    {
      id: 'video',
      icon: Video,
      title: 'Video Call Intelligence',
      subtitle: 'FaceTime When You Need It',
      color: 'from-blue-500 to-cyan-500',
      tagline: 'Some problems need to be SEEN',
      capabilities: [
        'AI detects when video would help',
        'Seamless audio → video escalation',
        'Screen sharing for visual guidance',
        'AR annotations and highlighting',
        'Record and analyze video calls',
        'Visual sentiment analysis (facial expressions)',
        'Auto-transcribe video with timestamps'
      ],
      useCases: [
        {
          title: 'Visual Troubleshooting',
          description: '"Show me the problem" - Customer shares camera, AI sees issue, guides solution.',
          impact: '-78% service call time'
        },
        {
          title: 'Product Demonstrations',
          description: 'AI shows product features via video. Customers see it, understand it, buy it.',
          impact: '+112% product demo conversions'
        },
        {
          title: 'Virtual Consultations',
          description: 'Healthcare, beauty, design - industries that need visual assessment.',
          impact: '94% satisfaction vs phone-only'
        }
      ],
      competitors: 'Audio-only or manual video scheduling',
      avery: 'AI knows when to switch to video automatically'
    },
    {
      id: 'visual',
      icon: Eye,
      title: 'Visual AI Assistant',
      subtitle: 'Show, Don\'t Tell',
      color: 'from-green-500 to-emerald-500',
      tagline: 'A picture is worth $1,000 in revenue',
      capabilities: [
        'Screen sharing to walk through options',
        'AR product placement ("See it in your space")',
        'Live document collaboration',
        'Visual menu/catalog browsing',
        'Before/after comparisons',
        'Real-time drawing and annotations',
        'Smart image recognition'
      ],
      useCases: [
        {
          title: 'Virtual Showrooms',
          description: 'Customer wants to see options? AI shares screen with products, specs, pricing.',
          impact: '+156% upsell rate with visual aids'
        },
        {
          title: 'AR Try-Before-Buy',
          description: 'Furniture? Glasses? Hair color? Customer sees it on themselves via AR.',
          impact: '87% reduction in returns'
        },
        {
          title: 'Visual Instructions',
          description: 'Instead of "turn left then right," AI shows on screen with arrows.',
          impact: '92% first-time success rate'
        }
      ],
      competitors: 'Send a link, hope they click it',
      avery: 'Show it instantly during the call'
    }
  ];

  const activeFeature = features.find(f => f.id === activeTab)!;

  const videoScenarios = [
    {
      trigger: 'Customer says "I don\'t understand"',
      aiAction: 'Switch to video, show visual explanation',
      result: 'Comprehension ↑ Frustration ↓'
    },
    {
      trigger: 'High-value consultation ($1,000+)',
      aiAction: 'Offer video call with avatar or real person',
      result: 'Trust ↑ Conversion ↑'
    },
    {
      trigger: 'Technical issue reported',
      aiAction: '"Can you show me?" → Camera access',
      result: 'Resolution time -78%'
    },
    {
      trigger: 'Product comparison request',
      aiAction: 'Screen share with side-by-side',
      result: 'Decision time -64%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1433] to-[#0a0e27] text-gray-100">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f1433]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Visual AI - Next Generation</h1>
              <p className="text-sm text-gray-400">Avatar, Video Calls, and Visual Intelligence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-semibold">Revolutionary Feature Set</span>
          </div>
          <h2 className="text-5xl font-bold mb-4">
            Not Just Voice. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Visual Presence.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Competitors offer audio calls. Avery gives you a <strong>hyper-realistic avatar</strong>, 
            <strong> intelligent video switching</strong>, and <strong>visual AI assistance</strong>. 
            This is the future of customer communication.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id as any)}
              className={`flex-1 min-w-[200px] p-6 rounded-xl border transition-all ${
                activeTab === feature.id
                  ? 'bg-white/10 border-blue-500'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <feature.icon className={`w-8 h-8 mb-3 ${
                activeTab === feature.id ? 'text-blue-400' : 'text-gray-400'
              }`} />
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-400">{feature.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Active Feature Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Left: Feature Details */}
              <div>
                <GlassmorphismCard className="p-8">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${activeFeature.color} bg-opacity-20 mb-4`}>
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-semibold">{activeFeature.tagline}</span>
                  </div>

                  <h3 className="text-3xl font-bold mb-4">{activeFeature.title}</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Capabilities:</h4>
                    <ul className="space-y-2">
                      {activeFeature.capabilities.map((cap, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-red-400">❌ Competitors</span>
                    </div>
                    <p className="text-sm text-gray-300">{activeFeature.competitors}</p>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-green-400">✅ Avery</span>
                    </div>
                    <p className="text-sm text-gray-300">{activeFeature.avery}</p>
                  </div>
                </GlassmorphismCard>
              </div>

              {/* Right: Use Cases */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">Real-World Use Cases</h4>
                {activeFeature.useCases.map((useCase, index) => (
                  <GlassmorphismCard key={index} className="p-6">
                    <h5 className="font-semibold mb-2">{useCase.title}</h5>
                    <p className="text-sm text-gray-400 mb-3">{useCase.description}</p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-400 font-semibold">{useCase.impact}</span>
                    </div>
                  </GlassmorphismCard>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Avatar Demo Section */}
        {activeTab === 'avatar' && (
          <div className="mb-12">
            <GlassmorphismCard className="p-8">
              <h3 className="text-2xl font-bold mb-6">See Your Digital Twin in Action</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Avatar Preview */}
                <div>
                  <div className="relative aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl overflow-hidden border border-purple-500/30">
                    {!avatarDemo ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <User className="w-24 h-24 text-purple-400 mb-4" />
                        <p className="text-gray-400 mb-4">Your avatar will appear here</p>
                        <Button
                          onClick={() => setAvatarDemo(true)}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          See Demo Avatar
                        </Button>
                      </div>
                    ) : (
                      <div className="absolute inset-0">
                        {/* Simulated Avatar */}
                        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <motion.div
                            animate={{
                              scale: [1, 1.02, 1],
                              rotate: [-1, 1, -1]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="text-center"
                          >
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 mx-auto" />
                            <p className="text-sm text-gray-300">Your Digital Twin Speaking...</p>
                            <div className="flex gap-1 justify-center mt-2">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ scaleY: [1, 1.5, 1] }}
                                  transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.1
                                  }}
                                  className="w-1 h-4 bg-purple-500 rounded"
                                />
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* How It Works */}
                <div>
                  <h4 className="font-semibold mb-4">How to Create Your Avatar:</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-1">Upload Photos/Video</h5>
                        <p className="text-xs text-gray-400">
                          10-20 photos or 2 minutes of video (talking to camera)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-1">AI Training</h5>
                        <p className="text-xs text-gray-400">
                          Our AI learns your facial features, expressions, and mannerisms (~2 hours)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold">3</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-1">Preview & Refine</h5>
                        <p className="text-xs text-gray-400">
                          Test your avatar, adjust appearance, approve final version
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold">4</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm mb-1">Deploy</h5>
                        <p className="text-xs text-gray-400">
                          Your avatar is now live on all calls with video capability
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500">
                    <Upload className="w-4 h-4 mr-2" />
                    Create My Avatar
                  </Button>
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        )}

        {/* Video Intelligence Scenarios */}
        {activeTab === 'video' && (
          <div className="mb-12">
            <GlassmorphismCard className="p-8">
              <h3 className="text-2xl font-bold mb-6">When AI Switches to Video</h3>
              <p className="text-gray-400 mb-6">
                Avery's AI detects situations where video would dramatically improve the outcome
              </p>
              <div className="space-y-4">
                {videoScenarios.map((scenario, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
                    <div>
                      <span className="text-xs text-gray-400">Trigger</span>
                      <p className="text-sm font-semibold mt-1">{scenario.trigger}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">AI Action</span>
                      <p className="text-sm font-semibold mt-1 text-blue-400">{scenario.aiAction}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Result</span>
                      <p className="text-sm font-semibold mt-1 text-green-400">{scenario.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassmorphismCard>
          </div>
        )}

        {/* Integration Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassmorphismCard className="p-6">
            <Phone className="w-8 h-8 text-blue-400 mb-3" />
            <h4 className="font-semibold mb-2">Works Everywhere</h4>
            <p className="text-sm text-gray-400">
              Phone calls, web chat, mobile app - avatar and video work on any device
            </p>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <Monitor className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className="font-semibold mb-2">Seamless Escalation</h4>
            <p className="text-sm text-gray-400">
              Start with audio, AI switches to video when needed, or escalate to human with full context
            </p>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <Camera className="w-8 h-8 text-green-400 mb-3" />
            <h4 className="font-semibold mb-2">Enterprise Grade</h4>
            <p className="text-sm text-gray-400">
              60fps rendering, HD quality, {"<"}1s latency, 99.9% uptime, fully HIPAA compliant
            </p>
          </GlassmorphismCard>
        </div>

        {/* Impact Stats */}
        <GlassmorphismCard className="p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Visual AI Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Trust Score', value: '+89%', desc: 'vs audio-only' },
              { label: 'Conversion', value: '+112%', desc: 'with video demos' },
              { label: 'Resolution Time', value: '-78%', desc: 'visual troubleshooting' },
              { label: 'Returns', value: '-87%', desc: 'with AR try-on' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.desc}</div>
              </div>
            ))}
          </div>
        </GlassmorphismCard>

        {/* Competitive Advantage */}
        <GlassmorphismCard className="p-8">
          <h3 className="text-2xl font-bold mb-6">Why This Changes Everything</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4 text-red-400">❌ Every Competitor:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Audio-only calls (no visual presence)</li>
                <li>• Generic cartoon avatars (if any)</li>
                <li>• Manual video scheduling (friction)</li>
                <li>• No screen sharing during calls</li>
                <li>• No AR capabilities</li>
                <li>• Customer has to imagine products</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-green-400">✅ Avery Elite:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• <strong>Hyper-realistic avatar</strong> (looks like you)</li>
                <li>• <strong>Intelligent video switching</strong> (AI knows when)</li>
                <li>• <strong>Instant visual assistance</strong> (no friction)</li>
                <li>• <strong>Screen sharing built-in</strong> (show products)</li>
                <li>• <strong>AR product visualization</strong> (see before buying)</li>
                <li>• <strong>Visual troubleshooting</strong> (solve problems faster)</li>
              </ul>
            </div>
          </div>
        </GlassmorphismCard>

        {/* CTA */}
        <div className="text-center mt-12">
          <GlassmorphismCard className="p-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
            <h3 className="text-3xl font-bold mb-4">Ready to Add Visual Superpowers?</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Avatar, Video Intelligence, and Visual AI are included in the <strong>Avery Elite</strong> plan at $49.99/month.
              No other AI receptionist even comes close.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={() => (window.location.href = '#pricing')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Upgrade to Elite
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = '#demo')}
              >
                <Play className="w-5 h-5 mr-2" />
                See Demo
              </Button>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
}
