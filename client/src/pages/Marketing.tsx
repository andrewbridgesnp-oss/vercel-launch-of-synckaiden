import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Share2,
  Search,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  CheckCircle,
  Megaphone,
  Globe,
  Smartphone,
  Video
} from "lucide-react";

export default function Marketing() {
  const marketingStats = [
    { label: "Campaign ROI", value: "342%", icon: TrendingUp, color: "text-green-500" },
    { label: "Email Open Rate", value: "28%", icon: Mail, color: "text-blue-500" },
    { label: "Website Visitors", value: "12.4K", icon: Globe, color: "text-purple-500" },
    { label: "Social Reach", value: "47K", icon: Share2, color: "text-cyan-500" },
  ];

  const capabilities = [
    {
      category: "Email Marketing",
      icon: Mail,
      features: [
        "Design beautiful emails with drag-and-drop builder",
        "Create automated email sequences (drip campaigns)",
        "Segment audiences by behavior, demographics, interests",
        "Personalize content with merge tags and dynamic blocks",
        "A/B test subject lines, content, and send times",
        "Track opens, clicks, bounces, and unsubscribes",
        "Automate welcome series, abandoned cart, re-engagement",
        "Manage email lists and subscriber preferences",
        "Ensure CAN-SPAM and GDPR compliance",
        "Integrate with CRM for unified customer view"
      ]
    },
    {
      category: "Social Media Management",
      icon: Share2,
      features: [
        "Schedule posts across all platforms (Facebook, Instagram, Twitter, LinkedIn)",
        "Create content calendar and plan campaigns",
        "Design graphics and videos with built-in tools",
        "Monitor brand mentions and social listening",
        "Respond to comments and messages from one inbox",
        "Track engagement metrics (likes, shares, comments)",
        "Run social media ads and boost posts",
        "Analyze competitor social strategies",
        "Generate hashtag recommendations",
        "Create social media reports and analytics"
      ]
    },
    {
      category: "SEO & Content Marketing",
      icon: Search,
      features: [
        "Research keywords and search volume",
        "Optimize website content for search engines",
        "Generate SEO-friendly blog posts and articles",
        "Track keyword rankings and organic traffic",
        "Audit website for SEO issues and fixes",
        "Build backlinks and monitor link profile",
        "Optimize meta titles, descriptions, and headers",
        "Create XML sitemaps and robots.txt",
        "Monitor Google Search Console and Analytics",
        "Generate content ideas based on trends"
      ]
    },
    {
      category: "Advertising & PPC",
      icon: Target,
      features: [
        "Create and manage Google Ads campaigns",
        "Run Facebook and Instagram ads",
        "Set up LinkedIn sponsored content",
        "Manage display and retargeting ads",
        "Optimize bids and budgets automatically",
        "A/B test ad copy, images, and landing pages",
        "Track conversions and attribution",
        "Generate ad performance reports",
        "Monitor cost per click (CPC) and cost per acquisition (CPA)",
        "Integrate with analytics for full funnel view"
      ]
    },
    {
      category: "Landing Pages & Forms",
      icon: Globe,
      features: [
        "Build landing pages with drag-and-drop editor",
        "Create lead capture forms and pop-ups",
        "A/B test landing page variations",
        "Optimize for mobile and page speed",
        "Integrate with email and CRM",
        "Track form submissions and conversion rates",
        "Add countdown timers and urgency elements",
        "Embed videos and testimonials",
        "Collect payments and donations",
        "Generate landing page analytics"
      ]
    },
    {
      category: "Marketing Automation",
      icon: Megaphone,
      features: [
        "Build multi-channel automation workflows",
        "Trigger actions based on user behavior",
        "Score and qualify leads automatically",
        "Nurture leads through the sales funnel",
        "Send personalized messages at scale",
        "Automate social media posting",
        "Schedule content across channels",
        "Set up abandoned cart recovery",
        "Create win-back campaigns for inactive customers",
        "Integrate with sales and customer success teams"
      ]
    },
    {
      category: "Analytics & Reporting",
      icon: BarChart3,
      features: [
        "Track website traffic and user behavior",
        "Monitor campaign performance across channels",
        "Measure ROI and attribution",
        "Analyze customer journey and touchpoints",
        "Create custom dashboards and reports",
        "Track key metrics (CAC, LTV, conversion rate)",
        "Identify top-performing content and channels",
        "Generate executive summaries and presentations",
        "Export data to Excel, Google Sheets, or BI tools",
        "Set up automated report delivery"
      ]
    },
    {
      category: "Video & Content Creation",
      icon: Video,
      features: [
        "Create videos with AI-powered editing",
        "Generate social media graphics and banners",
        "Design infographics and presentations",
        "Write blog posts and articles with AI",
        "Create product descriptions and ad copy",
        "Generate email templates and newsletters",
        "Design logos and brand assets",
        "Edit and optimize images",
        "Create GIFs and animations",
        "Build interactive content (quizzes, calculators)"
      ]
    },
    {
      category: "Influencer & Affiliate Marketing",
      icon: Users,
      features: [
        "Find and vet influencers in your niche",
        "Manage influencer relationships and contracts",
        "Track influencer campaign performance",
        "Set up affiliate programs and tracking",
        "Generate unique affiliate links and codes",
        "Calculate commissions and payouts",
        "Monitor affiliate sales and conversions",
        "Provide affiliates with marketing materials",
        "Detect fraud and invalid traffic",
        "Create affiliate leaderboards and incentives"
      ]
    },
    {
      category: "SMS & Mobile Marketing",
      icon: Smartphone,
      features: [
        "Send promotional SMS and MMS messages",
        "Create automated text message sequences",
        "Segment mobile subscribers",
        "Track SMS delivery and response rates",
        "Set up keywords and auto-replies",
        "Manage opt-ins and opt-outs (TCPA compliance)",
        "Send appointment reminders and notifications",
        "Run SMS contests and giveaways",
        "Integrate with CRM and email marketing",
        "Generate mobile marketing reports"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_240)] via-[oklch(0.14_0.03_260)] to-[oklch(0.12_0.02_240)] p-8 relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity: 0.3,
          filter: 'blur(4px)',
          zIndex: 0
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/grok-video-1b4ee5bf-8e8c-4914-8a61-1458049a6519.mp4" type="video/mp4" />
      </video>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-2">
            Marketing & Growth
          </h1>
          <p className="text-[oklch(0.78_0.08_240)]">
            Complete marketing suite from email to social to SEO
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketingStats.map((stat, index) => (
            <Card key={index} className="bg-[oklch(0.16_0.02_240)]/50 border-[oklch(0.78_0.08_240)]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[oklch(0.78_0.08_240)] mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[oklch(0.95_0_0)]">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Capabilities Sections */}
        <div className="space-y-6">
          {capabilities.map((section, index) => (
            <Card key={index} className="bg-[oklch(0.16_0.02_240)]/50 border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] rounded-lg">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-[oklch(0.95_0_0)]">{section.category}</CardTitle>
                    <CardDescription className="text-[oklch(0.78_0.08_240)]">
                      {section.features.length} capabilities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[oklch(0.85_0.05_240)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to Grow Your Business?
              </h3>
              <p className="text-white/80 mb-4">
                Kaiden handles all your marketing from email campaigns to social media to SEO.
              </p>
              <Button size="lg" variant="outline" className="bg-white text-[oklch(0.72_0.18_200)] hover:bg-white/90">
                Start Marketing with Kaiden
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
