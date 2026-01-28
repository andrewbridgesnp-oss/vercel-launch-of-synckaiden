import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  MessageSquare,
  Sparkles,
  Zap,
  Brain,
  Mic,
  Image,
  FileText,
  ArrowRight,
  Activity,
  Users,
  TrendingUp
} from "lucide-react";

export default function AIIntelligenceSuite() {
  const [workspaceId] = useState(1);

  const apps = [
    {
      id: "ai-chat",
      name: "AI Chat Assistant",
      description: "Intelligent conversational AI",
      icon: MessageSquare,
      href: "/chat",
      stats: [],
      color: "bg-blue-500"
    },
    {
      id: "agent-swarm",
      name: "Agent Swarm",
      description: "Multi-agent AI coordination",
      icon: Users,
      href: "/apps/agent-swarm",
      stats: [],
      color: "bg-purple-500"
    },
    {
      id: "creative-engine",
      name: "Creative Content Engine",
      description: "AI-powered content creation",
      icon: Sparkles,
      href: "/creative-engine",
      stats: [],
      color: "bg-pink-500"
    },
    {
      id: "ai-arena",
      name: "AI Arena",
      description: "Test and compare AI models",
      icon: Bot,
      href: "/ai-arena",
      stats: [],
      color: "bg-orange-500"
    },
    {
      id: "voice-auth",
      name: "Voice Authentication",
      description: "Secure voice-based authentication",
      icon: Mic,
      href: "/voice-auth",
      stats: [],
      color: "bg-green-500"
    },
    {
      id: "image-gen",
      name: "AI Image Generation",
      description: "Create images with AI",
      icon: Image,
      href: "/free-image-gen",
      stats: [],
      color: "bg-cyan-500"
    },
    {
      id: "doc-converter",
      name: "Document AI",
      description: "AI-powered document processing",
      icon: FileText,
      href: "/free-doc-converter",
      stats: [],
      color: "bg-indigo-500"
    },
    {
      id: "video-ai",
      name: "AI Video Generation",
      description: "Create videos with AI",
      icon: Zap,
      href: "/free-kling-video",
      stats: [],
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-950">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Intelligence Suite
          </h1>
          <p className="text-muted-foreground text-lg">
            Advanced AI tools and automation platform
          </p>
        </div>

        {/* AI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">AI Models</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Available tools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Automations</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">Workflows</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground mt-1">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link key={app.id} href={app.href}>
                <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${app.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                        <Icon className={`h-6 w-6 ${app.color.replace('bg-', 'text-')}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="mt-4">{app.name}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </CardHeader>
                  {app.stats.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        {app.stats.map((stat, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{stat.label}</span>
                            <span className="font-semibold">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start using AI tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/chat">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                </Link>
                <Link href="/free-image-gen">
                  <Button variant="outline" className="w-full">
                    <Image className="mr-2 h-4 w-4" />
                    Generate Image
                  </Button>
                </Link>
                <Link href="/apps/agent-swarm">
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Launch Agents
                  </Button>
                </Link>
                <Link href="/ai-arena">
                  <Button variant="outline" className="w-full">
                    <Bot className="mr-2 h-4 w-4" />
                    Compare Models
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlight */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Powered by Advanced AI
              </CardTitle>
              <CardDescription>
                Access state-of-the-art AI models for chat, image generation, document processing, and more
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
