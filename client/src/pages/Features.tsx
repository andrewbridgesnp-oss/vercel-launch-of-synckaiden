import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Wrench, 
  Globe, 
  Package, 
  Calendar, 
  Users, 
  Video, 
  BarChart3,
  Shield,
  ArrowRight,
  Zap,
  Briefcase,
  Building2,
  Store,
  FileText,
  Workflow,
  Mail,
  Phone,
  DollarSign,
  TrendingUp,
  Search,
  Share2,
  Link as LinkIcon,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Features() {
  const { isAuthenticated } = useAuth();

  const featureCategories = [
    {
      category: "Core AI & Automation",
      description: "Intelligent systems that work 24/7 for your business",
      features: [
        {
          icon: MessageSquare,
          title: "AI Chat Consultant",
          description: "Converse with Kaiden for business insights, strategy, and guidance with streaming responses and voice interaction",
          href: "/chat",
          color: "text-cyan-400",
        },
        {
          icon: Zap,
          title: "Workflow Automation",
          description: "Build intelligent workflows with 6 triggers and 5 actions. Automate lead follow-ups, appointment reminders, order confirmations, and more",
          href: "/workflows",
          color: "text-purple-400",
        },
        {
          icon: Phone,
          title: "Virtual Receptionist",
          description: "AI-powered 24/7 phone answering, call routing, voicemail transcription, and intelligent response generation",
          href: "/business/receptionist",
          color: "text-blue-400",
        },
      ]
    },
    {
      category: "Business Management",
      description: "Complete toolkit for running your business operations",
      features: [
        {
          icon: Users,
          title: "CRM & Contacts",
          description: "Comprehensive contact management with CSV import/export, tags, segmentation, activity timeline, and lead scoring",
          href: "/crm",
          color: "text-green-400",
        },
        {
          icon: Globe,
          title: "Website Builder",
          description: "Create and manage professional websites with static site generation and deployment",
          href: "/websites",
          color: "text-indigo-400",
        },
        {
          icon: Package,
          title: "Inventory Management",
          description: "Track products, manage stock levels, and sync with Shopify/WooCommerce integrations",
          href: "/inventory",
          color: "text-orange-400",
        },
        {
          icon: Calendar,
          title: "Scheduler & Appointments",
          description: "Book appointments, manage your calendar, and send automated reminders",
          href: "/scheduler",
          color: "text-pink-400",
        },
        {
          icon: FileText,
          title: "Contracts & Invoices",
          description: "AI-powered contract generation with lawyer review and professional invoice management",
          href: "/contracts",
          color: "text-yellow-400",
        },
      ]
    },
    {
      category: "Marketing & Growth",
      description: "Tools to attract, engage, and convert customers",
      features: [
        {
          icon: Mail,
          title: "Email & SMS Campaigns",
          description: "SendGrid and Twilio integration for bulk campaigns, template management, and delivery tracking",
          href: "/analytics",
          color: "text-blue-400",
        },
        {
          icon: Video,
          title: "Video Creator",
          description: "Generate marketing videos for social media with AI-powered content creation",
          href: "/videos",
          color: "text-red-400",
        },
        {
          icon: BarChart3,
          title: "Analytics Dashboard",
          description: "Monitor campaigns, track business metrics, and visualize performance with interactive charts",
          href: "/analytics",
          color: "text-cyan-400",
        },
        {
          icon: Search,
          title: "SEO Optimizer",
          description: "Keyword research, content optimization, backlink tracking, and site health monitoring",
          href: "/business/seo",
          color: "text-green-400",
        },
        {
          icon: Share2,
          title: "Social Media Auto-Reply",
          description: "Multi-platform AI responses for Facebook, Instagram, Twitter, LinkedIn with sentiment analysis",
          href: "/business/social",
          color: "text-purple-400",
        },
        {
          icon: TrendingUp,
          title: "Daily Trend Analyzer",
          description: "Google Trends integration, competitor analysis, market sentiment, and opportunity alerts",
          href: "/business/trends",
          color: "text-orange-400",
        },
      ]
    },
    {
      category: "Revenue & Commerce",
      description: "Monetization tools and payment systems",
      features: [
        {
          icon: Store,
          title: "Digital Marketplace",
          description: "Sell eBooks, crypto trading stacks, YouTube automation courses with S3 storage and license keys",
          href: "/marketplace",
          color: "text-indigo-400",
        },
        {
          icon: DollarSign,
          title: "Payment Processing",
          description: "Stripe integration with 33% platform fee enforcement, checkout sessions, and webhook handling",
          href: "/settings",
          color: "text-green-400",
        },
        {
          icon: LinkIcon,
          title: "Affiliate Marketing",
          description: "Affiliate program management, link generation, click tracking, and commission calculation",
          href: "/business/affiliate",
          color: "text-pink-400",
        },
        {
          icon: Sparkles,
          title: "Passive Income Generator",
          description: "Digital product marketplace, automated sales funnels, membership sites, and drip content delivery",
          href: "/business/passive-income",
          color: "text-yellow-400",
        },
      ]
    },
    {
      category: "Team & Compliance",
      description: "Collaboration and legal protection systems",
      features: [
        {
          icon: Building2,
          title: "Workspace Management",
          description: "Multi-tenant workspaces with team roles (Owner, Admin, CPA, Lawyer, Receptionist, Member)",
          href: "/workspaces",
          color: "text-blue-400",
        },
        {
          icon: Users,
          title: "Team Collaboration",
          description: "Internal messaging, task management, time tracking, and approval workflows",
          href: "/team",
          color: "text-purple-400",
        },
        {
          icon: Briefcase,
          title: "HR Management",
          description: "Employee database, payroll calculations, time tracking, leave management, and compliance alerts",
          href: "/business/hr",
          color: "text-cyan-400",
        },
        {
          icon: Shield,
          title: "Enterprise Security",
          description: "Prompt injection defense, audit logging, anomaly detection, and real-time security monitoring",
          href: "/security",
          color: "text-red-400",
        },
        {
          icon: FileText,
          title: "Tax Management",
          description: "Tax deduction suggestions with IRS citations, expense tracking, income tracking, and professional referrals (educational only)",
          href: "/business/tax",
          color: "text-green-400",
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background luxury-gradient relative overflow-hidden">
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
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 fade-in">
          <h1 className="text-5xl font-bold mb-6"
              style={{
                background: "linear-gradient(135deg, #e0e0e8 0%, #ffffff 50%, #c0c0d0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 40px rgba(255,255,255,0.3)",
              }}>
            Complete Business Operating System
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Everything you need to run, grow, and scale your business—all in one platform
          </p>
          
          {!isAuthenticated && (
            <a href={getLoginUrl()}>
              <Button 
                size="lg"
                className="elegant-button bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg glow-primary"
                style={{
                  background: "linear-gradient(135deg, rgba(200,200,220,0.2) 0%, rgba(240,240,255,0.3) 100%)",
                  border: "1px solid rgba(200,200,220,0.3)",
                  boxShadow: "0 8px 32px rgba(200,200,220,0.2)"
                }}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          )}
        </div>

        {/* Feature Categories */}
        <div className="space-y-16 max-w-7xl mx-auto">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="fade-in" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-gray-200">{category.category}</h2>
                <p className="text-gray-400">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <Link key={featureIndex} href={feature.href}>
                    <Card className="glass premium-card border-border/50 p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-lg glass border border-border/30 group-hover:border-primary/50 transition-colors">
                            <feature.icon className={`h-6 w-6 ${feature.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                              {feature.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground flex-1">
                          {feature.description}
                        </p>
                        <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Learn more
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {!isAuthenticated && (
          <div className="mt-20 text-center">
            <Card className="glass premium-card border-primary/30 p-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4"
                  style={{
                    background: "linear-gradient(135deg, #e0e0e8 0%, #ffffff 50%, #c0c0d0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                Ready to Transform Your Business?
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Join Kaiden today and experience the future of AI-powered business management.
              </p>
              <a href={getLoginUrl()}>
                <Button 
                  size="lg"
                  className="elegant-button bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg glow-primary"
                  style={{
                    background: "linear-gradient(135deg, rgba(200,200,220,0.2) 0%, rgba(240,240,255,0.3) 100%)",
                    border: "1px solid rgba(200,200,220,0.3)",
                    boxShadow: "0 8px 32px rgba(200,200,220,0.2)"
                  }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
