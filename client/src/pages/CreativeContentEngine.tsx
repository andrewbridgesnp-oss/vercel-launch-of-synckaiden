import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Video, 
  Type, 
  Image as ImageIcon, 
  Share2, 
  Zap,
  Brain,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { FeatureGate } from "@/components/FeatureGate";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ContentRequest {
  topic: string;
  platform: "tiktok" | "instagram" | "youtube" | "twitter" | "linkedin";
  contentType: "video" | "copy" | "graphics" | "carousel";
  tone: "professional" | "casual" | "humorous" | "educational";
  length?: string;
}

interface AgentStatus {
  agent: string;
  status: "idle" | "working" | "completed" | "error";
  progress: number;
  message: string;
}

export default function CreativeContentEngine() {
  const [activeTab, setActiveTab] = useState("overview");
  const [contentRequest, setContentRequest] = useState<ContentRequest>({
    topic: "",
    platform: "tiktok",
    contentType: "video",
    tone: "casual",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
    { agent: "Research Agent", status: "idle", progress: 0, message: "Ready to analyze trends" },
    { agent: "Script Writer", status: "idle", progress: 0, message: "Waiting for research" },
    { agent: "Visual Designer", status: "idle", progress: 0, message: "Ready to create visuals" },
    { agent: "Voice Actor", status: "idle", progress: 0, message: "Ready for narration" },
    { agent: "Editor", status: "idle", progress: 0, message: "Ready to assemble content" },
  ]);

  const generateContent = async () => {
    if (!contentRequest.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    
    // Simulate agent swarm workflow
    const agents = ["Research Agent", "Script Writer", "Visual Designer", "Voice Actor", "Editor"];
    
    for (let i = 0; i < agents.length; i++) {
      // Update current agent to working
      setAgentStatuses(prev => 
        prev.map((agent, idx) => 
          idx === i 
            ? { ...agent, status: "working" as const, progress: 0 }
            : agent
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setAgentStatuses(prev =>
          prev.map((agent, idx) =>
            idx === i
              ? { ...agent, progress }
              : agent
          )
        );
      }

      // Mark as completed
      setAgentStatuses(prev =>
        prev.map((agent, idx) =>
          idx === i
            ? { 
                ...agent, 
                status: "completed" as const, 
                progress: 100,
                message: `Completed ${contentRequest.contentType} generation`
              }
            : agent
        )
      );
    }

    setIsGenerating(false);
    toast.success("Content generated successfully! Ready for review.");
  };

  return (
    <FeatureGate feature="creative_content_engine">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Creative Content Engine</h1>
                <p className="text-gray-400 mt-1">AI-powered agent swarm for multi-platform content creation</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                <Brain className="w-3 h-3 mr-1" />
                Agent Swarm
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                <Zap className="w-3 h-3 mr-1" />
                Real-time Generation
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                <Share2 className="w-3 h-3 mr-1" />
                Multi-Platform
              </Badge>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-border/30">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="create">Create Content</TabsTrigger>
              <TabsTrigger value="agents">Agent Swarm</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Video Creation */}
                <Card className="glass border-border/50 hover:border-purple-500/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-purple-400" />
                      <CardTitle className="text-lg">Video Creation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Generate professional 9:16 vertical videos optimized for TikTok, Instagram Reels, and YouTube Shorts
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>✓ AI script generation</li>
                      <li>✓ Voice synthesis (10+ voices)</li>
                      <li>✓ Auto-captioning</li>
                      <li>✓ Trending effects</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Copy Writing */}
                <Card className="glass border-border/50 hover:border-blue-500/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-5 h-5 text-blue-400" />
                      <CardTitle className="text-lg">Copy Writing</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Craft compelling captions, hooks, and CTAs tailored to each platform and audience
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>✓ Platform-specific optimization</li>
                      <li>✓ Hashtag generation</li>
                      <li>✓ A/B copy variants</li>
                      <li>✓ Engagement optimization</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Graphics Design */}
                <Card className="glass border-border/50 hover:border-pink-500/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-pink-400" />
                      <CardTitle className="text-lg">Graphics Design</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Create stunning graphics, thumbnails, and carousel posts with brand consistency
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>✓ Brand-aware design</li>
                      <li>✓ Template library</li>
                      <li>✓ Auto-sizing for platforms</li>
                      <li>✓ Animation support</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* How It Works */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>How the Agent Swarm Works</CardTitle>
                  <CardDescription>5 specialized AI agents collaborate to create content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-400">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Research Agent</p>
                        <p className="text-sm text-gray-400">Analyzes trends, audience, and competitive landscape</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-400">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Script Writer</p>
                        <p className="text-sm text-gray-400">Creates engaging scripts optimized for platform and tone</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-pink-400">3</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Visual Designer</p>
                        <p className="text-sm text-gray-400">Generates graphics, layouts, and visual elements</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-400">4</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Voice Actor</p>
                        <p className="text-sm text-gray-400">Synthesizes natural-sounding voiceovers with emotion</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-400">5</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Editor</p>
                        <p className="text-sm text-gray-400">Assembles all elements into final, platform-optimized content</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Create Content Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Generate New Content</CardTitle>
                  <CardDescription>Configure your content request and let the agent swarm create it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Topic Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Topic/Idea</label>
                    <input
                      type="text"
                      placeholder="e.g., 'How to start a side hustle in 2025'"
                      value={contentRequest.topic}
                      onChange={(e) => setContentRequest({ ...contentRequest, topic: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-border/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  {/* Platform Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Target Platform</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {["tiktok", "instagram", "youtube", "twitter", "linkedin"].map((platform) => (
                        <button
                          key={platform}
                          onClick={() => setContentRequest({ ...contentRequest, platform: platform as any })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            contentRequest.platform === platform
                              ? "bg-purple-500 text-white"
                              : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50"
                          }`}
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Content Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["video", "copy", "graphics", "carousel"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setContentRequest({ ...contentRequest, contentType: type as any })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            contentRequest.contentType === type
                              ? "bg-purple-500 text-white"
                              : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Tone</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["professional", "casual", "humorous", "educational"].map((tone) => (
                        <button
                          key={tone}
                          onClick={() => setContentRequest({ ...contentRequest, tone: tone as any })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            contentRequest.tone === tone
                              ? "bg-purple-500 text-white"
                              : "bg-slate-800/50 text-gray-400 hover:bg-slate-700/50"
                          }`}
                        >
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={generateContent}
                    disabled={isGenerating || !contentRequest.topic.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Agent Swarm Working...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Agent Swarm Tab */}
            <TabsContent value="agents" className="space-y-6">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Agent Swarm Status</CardTitle>
                  <CardDescription>Real-time monitoring of AI agents during content generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agentStatuses.map((agent, idx) => (
                    <div key={agent.agent} className="space-y-2 p-4 rounded-lg bg-slate-800/50 border border-border/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {agent.status === "completed" && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                          {agent.status === "working" && (
                            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                          )}
                          {agent.status === "idle" && (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          {agent.status === "error" && (
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          )}
                          <div>
                            <p className="font-semibold text-white">{agent.agent}</p>
                            <p className="text-xs text-gray-400">{agent.message}</p>
                          </div>
                        </div>
                        <Badge
                          className={`${
                            agent.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : agent.status === "working"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : agent.status === "error"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>
                      </div>
                      {agent.progress > 0 && (
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Agent Configuration */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Agent Configuration
                  </CardTitle>
                  <CardDescription>Customize agent behavior and capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Research Depth</label>
                      <select className="w-full px-3 py-2 bg-slate-800/50 border border-border/30 rounded-lg text-white text-sm">
                        <option>Basic (5 min)</option>
                        <option>Standard (10 min)</option>
                        <option>Deep (20 min)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Voice Profile</label>
                      <select className="w-full px-3 py-2 bg-slate-800/50 border border-border/30 rounded-lg text-white text-sm">
                        <option>Professional (Male)</option>
                        <option>Professional (Female)</option>
                        <option>Casual (Male)</option>
                        <option>Casual (Female)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Brand Voice</label>
                      <select className="w-full px-3 py-2 bg-slate-800/50 border border-border/30 rounded-lg text-white text-sm">
                        <option>Default</option>
                        <option>Luxury</option>
                        <option>Tech-Savvy</option>
                        <option>Friendly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Quality Level</label>
                      <select className="w-full px-3 py-2 bg-slate-800/50 border border-border/30 rounded-lg text-white text-sm">
                        <option>Standard</option>
                        <option>Premium</option>
                        <option>Ultra HD</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </FeatureGate>
  );
}
