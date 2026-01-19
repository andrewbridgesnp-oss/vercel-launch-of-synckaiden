import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, DollarSign, Calendar, Building2, Users, Sparkles, FileText, ExternalLink, Filter } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { FeatureGate } from "@/components/FeatureGate";

interface Grant {
  id: number;
  name: string;
  amount: string;
  deadline: string;
  category: string;
  eligibility: string[];
  description: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function Grants() {
  return (
    <FeatureGate feature="grant_writing">
      <GrantsContent />
    </FeatureGate>
  );
}

function GrantsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEligibility, setSelectedEligibility] = useState("all");
  const [proposalTopic, setProposalTopic] = useState("");
  const [generatingProposal, setGeneratingProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState("");

  const sendMessage = trpc.chat.sendMessage.useMutation();

  // Comprehensive grant database - real grants updated for 2025-2026
  const grants: Grant[] = [
    // Federal Grants
    { id: 1, name: "SBA Small Business Innovation Research (SBIR)", amount: "$50,000 - $1,500,000", deadline: "Rolling", category: "Federal", eligibility: ["Small Business", "Tech/Innovation"], description: "Federal funding for small businesses engaged in R&D with commercialization potential.", url: "https://www.sbir.gov", difficulty: "Hard" },
    { id: 2, name: "USDA Rural Business Development Grant", amount: "$10,000 - $500,000", deadline: "March 31, 2026", category: "Federal", eligibility: ["Rural Business", "Small Business"], description: "Supports rural small businesses and entrepreneurs in communities under 50,000 population.", url: "https://www.rd.usda.gov/programs-services/business-programs", difficulty: "Medium" },
    { id: 3, name: "Economic Development Administration (EDA) Grants", amount: "$100,000 - $3,000,000", deadline: "Rolling", category: "Federal", eligibility: ["Economic Development", "Job Creation"], description: "Supports economic development and job creation in distressed communities.", url: "https://www.eda.gov", difficulty: "Hard" },
    
    // Minority-Focused
    { id: 4, name: "Minority Business Development Agency (MBDA) Grants", amount: "$25,000 - $300,000", deadline: "Quarterly", category: "Minority", eligibility: ["Minority-Owned", "Small Business"], description: "Supports minority-owned businesses through technical assistance and capital access.", url: "https://www.mbda.gov", difficulty: "Medium" },
    { id: 5, name: "National Black MBA Association Scale-Up Pitch Challenge", amount: "$50,000", deadline: "September 2026", category: "Minority", eligibility: ["Black-Owned", "Revenue $500K+"], description: "For Black-owned businesses ready to scale with proven revenue.", url: "https://nbmbaa.org", difficulty: "Medium" },
    { id: 6, name: "Hello Alice Black-Owned Business Grant", amount: "$10,000 - $25,000", deadline: "Rolling", category: "Minority", eligibility: ["Black-Owned", "Small Business"], description: "Recurring grants for Black-owned small businesses across all industries.", url: "https://helloalice.com", difficulty: "Easy" },
    
    // Women-Focused
    { id: 7, name: "Amber Grant for Women", amount: "$10,000 - $25,000", deadline: "Monthly", category: "Women", eligibility: ["Women-Owned"], description: "Monthly grants for women-owned businesses. One winner per month, annual grand prize.", url: "https://ambergrantsforwomen.com", difficulty: "Easy" },
    { id: 8, name: "IFundWomen Universal Grant", amount: "$500 - $10,000", deadline: "Rolling", category: "Women", eligibility: ["Women-Owned", "Small Business"], description: "Grants for women entrepreneurs at various stages of business development.", url: "https://ifundwomen.com", difficulty: "Easy" },
    { id: 9, name: "Cartier Women's Initiative", amount: "$100,000", deadline: "June 2026", category: "Women", eligibility: ["Women-Owned", "Social Impact"], description: "For women entrepreneurs running impact-driven businesses.", url: "https://www.cartierwomensinitiative.com", difficulty: "Hard" },
    
    // Veteran-Focused
    { id: 10, name: "StreetShares Foundation Veteran Business Grant", amount: "$15,000", deadline: "Quarterly", category: "Veteran", eligibility: ["Veteran-Owned"], description: "Quarterly grants for veteran entrepreneurs and military spouse business owners.", url: "https://streetsharesfoundation.org", difficulty: "Easy" },
    { id: 11, name: "Hivers and Strivers Angel Investment", amount: "$250,000 - $1,000,000", deadline: "Rolling", category: "Veteran", eligibility: ["Veteran-Owned", "Service Academy Graduate"], description: "Angel investment for veteran-owned startups led by service academy graduates.", url: "https://www.hiversandstrivers.com", difficulty: "Hard" },
    
    // Industry-Specific
    { id: 12, name: "FedEx Small Business Grant", amount: "$50,000", deadline: "February 2026", category: "Industry", eligibility: ["Small Business", "E-commerce"], description: "Annual grant program for innovative small businesses.", url: "https://www.fedex.com/en-us/small-business/grant-contest.html", difficulty: "Medium" },
    { id: 13, name: "National Restaurant Association Educational Foundation", amount: "$2,500 - $10,000", deadline: "Rolling", category: "Industry", eligibility: ["Restaurant", "Hospitality"], description: "Scholarships and grants for restaurant industry professionals.", url: "https://chooserestaurants.org", difficulty: "Easy" },
    { id: 14, name: "Patagonia Environmental Grants", amount: "$5,000 - $20,000", deadline: "April/August", category: "Industry", eligibility: ["Environmental", "Nonprofit"], description: "For grassroots environmental organizations and sustainable businesses.", url: "https://www.patagonia.com/how-we-fund", difficulty: "Medium" },
    
    // State/Local
    { id: 15, name: "California Small Business COVID-19 Relief Grant", amount: "$5,000 - $25,000", deadline: "Rolling", category: "State", eligibility: ["California", "Small Business"], description: "Relief grants for California small businesses affected by economic conditions.", url: "https://careliefgrant.com", difficulty: "Easy" },
    { id: 16, name: "New York Forward Loan Fund", amount: "$25,000 - $100,000", deadline: "Rolling", category: "State", eligibility: ["New York", "Small Business"], description: "Low-interest loans and grants for NY small businesses.", url: "https://esd.ny.gov", difficulty: "Medium" },
    { id: 17, name: "Texas Enterprise Fund", amount: "$50,000 - $5,000,000", deadline: "Rolling", category: "State", eligibility: ["Texas", "Job Creation"], description: "Deal-closing fund for businesses creating jobs in Texas.", url: "https://gov.texas.gov/business/page/texas-enterprise-fund", difficulty: "Hard" },
    
    // Tech/Startup
    { id: 18, name: "Google for Startups Black Founders Fund", amount: "$100,000", deadline: "Annual", category: "Tech", eligibility: ["Black-Owned", "Tech Startup"], description: "Non-dilutive funding for Black-led startups in the US.", url: "https://startup.google.com/blackfoundersfund", difficulty: "Medium" },
    { id: 19, name: "AWS Activate", amount: "$100,000 in credits", deadline: "Rolling", category: "Tech", eligibility: ["Tech Startup"], description: "Cloud credits and support for startups building on AWS.", url: "https://aws.amazon.com/activate", difficulty: "Easy" },
    { id: 20, name: "Microsoft for Startups", amount: "$150,000 in credits", deadline: "Rolling", category: "Tech", eligibility: ["Tech Startup", "B2B"], description: "Azure credits, technical support, and go-to-market resources.", url: "https://startups.microsoft.com", difficulty: "Easy" },
    
    // Nonprofit/Social Impact
    { id: 21, name: "Pollination Project Seed Grants", amount: "$1,000", deadline: "Rolling", category: "Nonprofit", eligibility: ["Social Impact", "Grassroots"], description: "Daily seed grants for social change projects worldwide.", url: "https://thepollinationproject.org", difficulty: "Easy" },
    { id: 22, name: "Ben & Jerry's Foundation Grants", amount: "$1,000 - $25,000", deadline: "Rolling", category: "Nonprofit", eligibility: ["Social Justice", "Nonprofit"], description: "Supports grassroots organizing for social and environmental justice.", url: "https://benandjerrysfoundation.org", difficulty: "Easy" },
    { id: 23, name: "Echoing Green Fellowship", amount: "$80,000", deadline: "Annual", category: "Nonprofit", eligibility: ["Social Entrepreneur"], description: "Two-year fellowship for emerging social entrepreneurs.", url: "https://echoinggreen.org", difficulty: "Hard" },
    
    // Creative/Arts
    { id: 24, name: "National Endowment for the Arts Grants", amount: "$10,000 - $100,000", deadline: "Varies", category: "Creative", eligibility: ["Arts Organization", "Nonprofit"], description: "Federal funding for arts projects and organizations.", url: "https://www.arts.gov/grants", difficulty: "Medium" },
    { id: 25, name: "Awesome Foundation Grants", amount: "$1,000", deadline: "Monthly", category: "Creative", eligibility: ["Creative Project"], description: "Monthly micro-grants for awesome ideas and projects.", url: "https://www.awesomefoundation.org", difficulty: "Easy" },
  ];

  const categories = ["all", "Federal", "Minority", "Women", "Veteran", "Industry", "State", "Tech", "Nonprofit", "Creative"];
  const eligibilities = ["all", "Small Business", "Minority-Owned", "Women-Owned", "Veteran-Owned", "Tech Startup", "Nonprofit", "Rural Business"];

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || grant.category === selectedCategory;
    const matchesEligibility = selectedEligibility === "all" || grant.eligibility.some(e => e.includes(selectedEligibility));
    return matchesSearch && matchesCategory && matchesEligibility;
  });

  const handleGenerateProposal = async () => {
    if (!proposalTopic.trim()) {
      toast.error("Please describe your project or business idea");
      return;
    }

    setGeneratingProposal(true);
    try {
      const result = await sendMessage.mutateAsync({
        conversationId: 0,
        content: `You are a grant writing expert. Generate a professional grant proposal outline for the following project/business:

"${proposalTopic}"

Include:
1. Executive Summary (2-3 sentences)
2. Statement of Need (why this matters)
3. Project Description (what you'll do)
4. Goals and Objectives (measurable outcomes)
5. Methods/Timeline (how you'll achieve it)
6. Budget Overview (general categories)
7. Evaluation Plan (how you'll measure success)
8. Organizational Capacity (why you're qualified)

Keep it concise but compelling. Use professional grant writing language.`
      });
      
      setGeneratedProposal(result.assistantMessage.content);
      toast.success("Proposal outline generated!");
    } catch (error) {
      toast.error("Failed to generate proposal. Please try again.");
    } finally {
      setGeneratingProposal(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Grant Finder & Proposal Assistant
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Search 25+ active grants worth over $10 million. Generate professional proposal outlines instantly.
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Find Grants
            </TabsTrigger>
            <TabsTrigger value="proposal">
              <FileText className="w-4 h-4 mr-2" />
              Write Proposal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search grants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-background/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedEligibility} onValueChange={setSelectedEligibility}>
                <SelectTrigger className="w-full md:w-48 bg-background/50">
                  <SelectValue placeholder="Eligibility" />
                </SelectTrigger>
                <SelectContent>
                  {eligibilities.map(elig => (
                    <SelectItem key={elig} value={elig}>{elig === "all" ? "All Eligibility" : elig}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-400 mb-4 text-center">
              Showing {filteredGrants.length} grants
            </p>

            {/* Grants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGrants.map((grant) => (
                <Card key={grant.id} className="glass border-border/50 hover:border-green-500/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-xs">{grant.category}</Badge>
                      <Badge className={`text-xs ${getDifficultyColor(grant.difficulty)}`}>
                        {grant.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{grant.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{grant.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="font-semibold text-green-400">{grant.amount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Deadline: {grant.deadline}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {grant.eligibility.map((elig, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{elig}</Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-2 bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(grant.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proposal">
            <div className="max-w-3xl mx-auto">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    AI Proposal Generator
                  </CardTitle>
                  <CardDescription>
                    Describe your project or business idea, and we'll generate a professional grant proposal outline.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Describe Your Project</label>
                    <textarea
                      className="w-full h-32 p-3 rounded-lg bg-background/50 border border-border/50 focus:border-green-500/50 focus:outline-none resize-none"
                      placeholder="Example: I'm starting a mobile food truck business that serves healthy, affordable meals in food deserts. We plan to hire locally and donate 10% of profits to community nutrition programs..."
                      value={proposalTopic}
                      onChange={(e) => setProposalTopic(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleGenerateProposal}
                    disabled={generatingProposal}
                  >
                    {generatingProposal ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Proposal Outline
                      </>
                    )}
                  </Button>

                  {generatedProposal && (
                    <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <h3 className="font-semibold text-green-400 mb-3">Your Proposal Outline</h3>
                      <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                        {generatedProposal}
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedProposal);
                          toast.success("Copied to clipboard!");
                        }}
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="glass border-border/50 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Grant Writing Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>✓ Start applications early - most take 20-40 hours to complete properly</li>
                    <li>✓ Match your project to the funder's priorities exactly</li>
                    <li>✓ Use specific, measurable outcomes (numbers, percentages, timelines)</li>
                    <li>✓ Include letters of support from partners and community members</li>
                    <li>✓ Have someone else proofread before submitting</li>
                    <li>✓ Follow formatting requirements precisely - funders reject for small errors</li>
                    <li>✓ Apply to multiple grants - success rate is typically 10-20%</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
