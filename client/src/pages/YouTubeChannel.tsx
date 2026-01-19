import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Youtube, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Video,
  BarChart3,
  Zap,
  Check,
  Clock,
  DollarSign
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function YouTubeChannel() {
  const [formData, setFormData] = useState({
    channelName: "",
    niche: "",
    targetAudience: "",
    contentStyle: "",
    email: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Channel Starter",
      setupFee: 997,
      monthly: 297,
      revenueShare: "15%",
      features: [
        "AI-generated video scripts",
        "4 videos per month",
        "Thumbnail design",
        "SEO optimization",
        "Basic analytics report",
        "Channel branding setup",
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Growth Engine",
      setupFee: 1997,
      monthly: 597,
      revenueShare: "15%",
      features: [
        "Everything in Starter",
        "8 videos per month",
        "AI voiceover option",
        "Community management",
        "Trend analysis & content calendar",
        "Weekly strategy calls",
        "Monetization optimization",
      ],
      popular: true,
    },
    {
      id: "empire",
      name: "Content Empire",
      setupFee: 4997,
      monthly: 1497,
      revenueShare: "15%",
      features: [
        "Everything in Growth",
        "16+ videos per month",
        "Multi-platform distribution",
        "Shorts/Reels strategy",
        "Brand deal negotiation",
        "Dedicated account manager",
        "24/7 priority support",
        "Revenue maximization",
      ],
      popular: false,
    },
  ];

  const handleSubmit = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }
    if (!formData.channelName || !formData.niche || !formData.email) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("Application submitted!", {
      description: "We'll contact you within 24 hours to discuss your AI YouTube channel.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <Badge variant="outline" className="border-red-500 text-red-500">
            <Youtube className="w-3 h-3 mr-1" /> AI-Powered
          </Badge>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
            <Youtube className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered YouTube Channel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            We build, manage, and grow your YouTube channel using AI. 
            You provide the vision — we handle everything else.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" />
              <span>AI-Generated Content</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Growth Optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              <span>Monetization Focus</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <Card className="mb-12 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Strategy", desc: "We analyze your niche and create a content strategy" },
                { step: 2, title: "Creation", desc: "AI generates scripts, voiceovers, and edits videos" },
                { step: 3, title: "Optimization", desc: "SEO, thumbnails, and posting schedule optimized" },
                { step: 4, title: "Growth", desc: "We monitor, adjust, and scale your channel" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-500 font-bold">{item.step}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? "border-red-500 ring-2 ring-red-500/20" 
                    : "hover:border-red-500/50"
                } ${plan.popular ? "border-red-500" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-red-500">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-2">
                      <div className="text-3xl font-bold text-foreground">
                        ${plan.setupFee}
                        <span className="text-sm font-normal text-muted-foreground"> setup</span>
                      </div>
                      <div className="text-lg">
                        ${plan.monthly}/mo
                        <span className="text-sm text-muted-foreground"> or {plan.revenueShare} revenue</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        (whichever is greater)
                      </p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.id && (
                    <div className="mt-4 p-2 bg-red-500/10 rounded text-center text-sm text-red-500">
                      ✓ Selected
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Start Your AI YouTube Channel</CardTitle>
            <CardDescription>
              Fill out the form below and we'll contact you within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Channel Name *</label>
                <Input 
                  placeholder="Your desired channel name"
                  value={formData.channelName}
                  onChange={(e) => setFormData({...formData, channelName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email *</label>
                <Input 
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Niche/Topic *</label>
              <Input 
                placeholder="e.g., Personal Finance, Tech Reviews, Cooking"
                value={formData.niche}
                onChange={(e) => setFormData({...formData, niche: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Target Audience</label>
              <Input 
                placeholder="e.g., Young professionals, Parents, Entrepreneurs"
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Content Style Preferences</label>
              <Textarea 
                placeholder="Describe the style, tone, and type of content you envision..."
                value={formData.contentStyle}
                onChange={(e) => setFormData({...formData, contentStyle: e.target.value})}
                rows={3}
              />
            </div>
            <Button 
              className="w-full bg-red-500 hover:bg-red-600"
              size="lg"
              onClick={handleSubmit}
            >
              <Youtube className="mr-2 h-4 w-4" />
              Submit Application
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to our Terms of Service and Satisfaction Guarantee
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How does the revenue share work?",
                a: "You pay either the monthly fee OR 15% of your channel revenue - whichever is greater. This ensures we're incentivized to grow your channel."
              },
              {
                q: "Do I own the channel?",
                a: "Yes, 100%. The channel is yours. We simply manage and grow it for you."
              },
              {
                q: "What if I'm not satisfied?",
                a: "We offer a Satisfaction Guarantee. If you're not happy within the first 30 days, we'll work with you to make it right."
              },
              {
                q: "How long until I see results?",
                a: "Most channels see meaningful growth within 60-90 days. Monetization typically follows YouTube's standard requirements (1,000 subscribers, 4,000 watch hours)."
              },
            ].map((faq, i) => (
              <Card key={i} className="bg-card/50">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
