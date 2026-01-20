import { useState } from "react";
import { GlassCard } from "../components/glass-card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import {
  Sparkles,
  FileText,
  Mail,
  MessageSquare,
  Film,
  Calendar,
  Copy,
  Download,
  Share2,
  CheckCircle2,
} from "lucide-react";

interface ContentItem {
  id: string;
  type: "ad" | "email" | "social" | "landing" | "video";
  title: string;
  content: string;
  tone: string;
  status: "draft" | "approved" | "scheduled";
  scheduledDate?: string;
  performance?: {
    views: number;
    clicks: number;
    conversions: number;
  };
}

const contentItems: ContentItem[] = [
  {
    id: "1",
    type: "ad",
    title: "Summer Sale Facebook Ad",
    content: "🌞 Summer Sale! Save up to 40% on premium products. Limited time offer. Shop now and transform your business.",
    tone: "Aggressive",
    status: "approved",
    performance: { views: 12400, clicks: 892, conversions: 124 },
  },
  {
    id: "2",
    type: "email",
    title: "Welcome Email Sequence - Day 1",
    content: "Welcome to our community! We're thrilled to have you here. Let's get you started with these helpful resources...",
    tone: "Professional",
    status: "scheduled",
    scheduledDate: "Tomorrow, 9:00 AM",
  },
  {
    id: "3",
    type: "social",
    title: "LinkedIn Thought Leadership",
    content: "5 strategies that doubled our conversion rate in Q2. Thread 🧵",
    tone: "Professional",
    status: "draft",
  },
];

const contentTypes = [
  { value: "ad", label: "Advertisement", icon: Sparkles },
  { value: "email", label: "Email", icon: Mail },
  { value: "social", label: "Social Post", icon: MessageSquare },
  { value: "landing", label: "Landing Page", icon: FileText },
  { value: "video", label: "Video Script", icon: Film },
];

const tones = ["Professional", "Aggressive", "Luxury", "Local", "Friendly", "Technical"];

export function ContentEngine() {
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">AI Content Engine</h2>
          <p className="text-muted-foreground mt-1">Generate high-converting content instantly</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
          <Calendar className="h-4 w-4" />
          Content Calendar
        </Button>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <GlassCard className="p-6">
            <div className="space-y-6">
              {/* Content Type Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Select Content Type</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        className="p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all bg-accent/30 hover:bg-accent/50"
                      >
                        <Icon className="h-6 w-6 text-primary mb-2 mx-auto" />
                        <p className="text-sm font-medium text-center">{type.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone Selector */}
              <div>
                <label className="text-sm font-medium mb-3 block">Brand Tone</label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="text-sm font-medium mb-3 block">What do you want to create?</label>
                <Textarea
                  placeholder="E.g., Create a Facebook ad for our summer sale offering 40% off premium products..."
                  className="min-h-32 resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary/80 gap-2"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Content with AI
                  </>
                )}
              </Button>

              {/* Preview Section */}
              {isGenerating && (
                <div className="p-6 rounded-lg border border-border bg-accent/20 animate-pulse">
                  <div className="h-4 bg-accent rounded w-3/4 mb-3" />
                  <div className="h-4 bg-accent rounded w-full mb-3" />
                  <div className="h-4 bg-accent rounded w-5/6" />
                </div>
              )}
            </div>
          </GlassCard>

          {/* AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Brand Voice Lock</h4>
                  <p className="text-sm text-muted-foreground">Consistent tone across all content</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Approval Workflow</h4>
                  <p className="text-sm text-muted-foreground">Review before publishing</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Auto-Schedule</h4>
                  <p className="text-sm text-muted-foreground">Optimal posting times</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-4">
          {contentItems.map((item) => {
            const TypeIcon = contentTypes.find((t) => t.value === item.type)?.icon || FileText;
            return (
              <GlassCard key={item.id} className="p-6" hover>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">Tone: {item.tone}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "approved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : item.status === "scheduled"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-muted/50 text-muted-foreground"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 p-4 rounded-lg bg-accent/30">
                      {item.content}
                    </p>

                    {item.performance && (
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Views: </span>
                          <span className="font-semibold">{item.performance.views.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clicks: </span>
                          <span className="font-semibold">{item.performance.clicks.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conversions: </span>
                          <span className="font-semibold text-emerald-400">{item.performance.conversions}</span>
                        </div>
                      </div>
                    )}

                    {item.scheduledDate && (
                      <p className="text-sm text-blue-400 mt-2">📅 Scheduled: {item.scheduledDate}</p>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
