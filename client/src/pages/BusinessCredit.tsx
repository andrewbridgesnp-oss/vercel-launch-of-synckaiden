import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CreditCard, Building2, DollarSign, TrendingUp, Lightbulb, ExternalLink, CheckCircle2, AlertTriangle, Car, Home, Receipt } from "lucide-react";
import { Link } from "wouter";
import { FeatureGate } from "@/components/FeatureGate";

export default function BusinessCredit() {
  return (
    <FeatureGate feature="llc_formation">
      <BusinessCreditContent />
    </FeatureGate>
  );
}

function BusinessCreditContent() {
  const [creditScore, setCreditScore] = useState<number | null>(null);

  // Top tradelines for new LLCs
  const tradelines = [
    {
      name: "Uline",
      category: "Office/Shipping Supplies",
      creditLimit: "$1,000 - $5,000",
      reports: ["Dun & Bradstreet"],
      requirements: "Net 30, no PG required after established",
      difficulty: "Easy",
      link: "https://www.uline.com"
    },
    {
      name: "Grainger",
      category: "Industrial Supplies",
      creditLimit: "$1,000 - $10,000",
      reports: ["Dun & Bradstreet", "Experian Business"],
      requirements: "Net 30, EIN required",
      difficulty: "Easy",
      link: "https://www.grainger.com"
    },
    {
      name: "Quill",
      category: "Office Supplies",
      creditLimit: "$500 - $2,500",
      reports: ["Dun & Bradstreet"],
      requirements: "Net 30, easy approval",
      difficulty: "Easy",
      link: "https://www.quill.com"
    },
    {
      name: "Summa Office Supplies",
      category: "Office Supplies",
      creditLimit: "$500 - $1,500",
      reports: ["Dun & Bradstreet", "Experian", "Equifax"],
      requirements: "Net 30, reports to all 3 bureaus",
      difficulty: "Easy",
      link: "https://www.summaofficesupplies.com"
    },
    {
      name: "Strategic Network Solutions",
      category: "IT/Tech Supplies",
      creditLimit: "$1,000 - $5,000",
      reports: ["Dun & Bradstreet", "Experian"],
      requirements: "Net 30, tech-focused",
      difficulty: "Easy",
      link: "https://www.snsoffice.com"
    },
    {
      name: "Crown Office Supplies",
      category: "Office Supplies",
      creditLimit: "$500 - $2,000",
      reports: ["Dun & Bradstreet", "Experian", "Equifax"],
      requirements: "Net 30, reports to all bureaus",
      difficulty: "Easy",
      link: "https://www.crownofficesupplies.com"
    }
  ];

  // Top business credit cards for new LLCs
  const creditCards = [
    {
      name: "Chase Ink Business Unlimited",
      rewards: "1.5% unlimited cash back",
      creditLimit: "$5,000 - $50,000",
      apr: "18.49% - 24.49%",
      annualFee: "$0",
      bonus: "$750 after $6K spend in 3 months",
      requirements: "Good personal credit (670+)",
      link: "https://creditcards.chase.com/business-credit-cards/ink/unlimited"
    },
    {
      name: "American Express Blue Business Cash",
      rewards: "2% on first $50K, then 1%",
      creditLimit: "$2,000 - $25,000",
      apr: "18.49% - 26.49%",
      annualFee: "$0",
      bonus: "$250 after $3K spend in 3 months",
      requirements: "Good personal credit (670+)",
      link: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-blue-business-cash-credit-card-amex"
    },
    {
      name: "Capital One Spark Cash Plus",
      rewards: "2% unlimited cash back",
      creditLimit: "$10,000 - $100,000+",
      apr: "Pay in full monthly",
      annualFee: "$150",
      bonus: "$1,200 after $30K spend in 3 months",
      requirements: "Excellent credit, established business",
      link: "https://www.capitalone.com/small-business/credit-cards/spark-cash-plus"
    },
    {
      name: "Brex Card (No PG)",
      rewards: "1-8x points on categories",
      creditLimit: "Based on cash balance",
      apr: "Pay in full",
      annualFee: "$0",
      bonus: "50,000 points",
      requirements: "No personal guarantee, $50K+ in bank",
      link: "https://www.brex.com"
    }
  ];

  // Creative funding ideas
  const creativeFunding = [
    {
      title: "Revenue-Based Financing",
      description: "Get funding based on your monthly revenue. Pay back as a percentage of sales.",
      pros: ["No equity dilution", "Flexible payments", "Fast approval"],
      providers: ["Clearco", "Pipe", "Capchase"]
    },
    {
      title: "Equipment Financing",
      description: "Finance equipment purchases with the equipment as collateral.",
      pros: ["100% financing available", "Tax deductions (Section 179)", "Preserve cash"],
      providers: ["Balboa Capital", "Currency", "Crest Capital"]
    },
    {
      title: "Invoice Factoring",
      description: "Sell your unpaid invoices for immediate cash (80-90% of value).",
      pros: ["Same-day funding", "No debt on books", "Based on customer credit"],
      providers: ["BlueVine", "Fundbox", "altLINE"]
    },
    {
      title: "Microloans",
      description: "Small loans ($500 - $50K) for startups and small businesses.",
      pros: ["Lower requirements", "Build credit history", "Mentorship included"],
      providers: ["Kiva", "Grameen America", "Accion"]
    },
    {
      title: "Crowdfunding",
      description: "Raise money from the public through platforms.",
      pros: ["Validate your idea", "Marketing exposure", "No debt or equity (rewards)"],
      providers: ["Kickstarter", "Indiegogo", "Wefunder (equity)"]
    },
    {
      title: "CDFI Loans",
      description: "Community Development Financial Institutions offer favorable terms to underserved businesses.",
      pros: ["Lower rates", "Flexible terms", "Technical assistance"],
      providers: ["Opportunity Finance Network", "Local CDFIs"]
    }
  ];

  // Tax tips people don't know
  const taxTips = [
    {
      title: "Put Your Car in the Business",
      icon: Car,
      description: "If you use your car for business, you can deduct expenses. Two methods:",
      details: [
        "Standard Mileage: 67 cents/mile (2024) - simpler, good for high mileage",
        "Actual Expenses: Gas, insurance, repairs, depreciation - better for expensive cars",
        "Must document business use percentage (keep a mileage log!)",
        "Can deduct parking and tolls on top of either method"
      ],
      savings: "Average savings: $5,000 - $15,000/year"
    },
    {
      title: "Home Office Deduction",
      icon: Home,
      description: "Deduct a portion of rent/mortgage, utilities, insurance, and repairs.",
      details: [
        "Simplified method: $5/sq ft up to 300 sq ft ($1,500 max)",
        "Regular method: Calculate actual expenses × business use %",
        "Space must be used REGULARLY and EXCLUSIVELY for business",
        "Can deduct even if you rent (portion of rent)"
      ],
      savings: "Average savings: $1,500 - $5,000/year"
    },
    {
      title: "Utilities in Business Name",
      icon: Receipt,
      description: "Business utilities can be fully deductible business expenses.",
      details: [
        "Internet: Deduct business use percentage (often 50-100%)",
        "Phone: Separate business line is 100% deductible",
        "Cell phone: Deduct business use percentage",
        "Software subscriptions: 100% deductible if for business"
      ],
      savings: "Average savings: $1,000 - $3,000/year"
    },
    {
      title: "Section 179 Deduction",
      icon: Building2,
      description: "Deduct the FULL cost of equipment in the year you buy it (up to $1.16M in 2024).",
      details: [
        "Computers, furniture, machinery, vehicles (with limits)",
        "Must be used >50% for business",
        "Can create a loss to offset other income",
        "Bonus depreciation: Additional 60% in 2024"
      ],
      savings: "Potential savings: $10,000 - $100,000+"
    },
    {
      title: "Hire Your Kids",
      icon: DollarSign,
      description: "Pay your children (under 18) for legitimate work - they pay little to no tax.",
      details: [
        "Standard deduction: First $14,600 (2024) is tax-free to them",
        "No FICA taxes if sole proprietor/single-member LLC",
        "Must be legitimate work at reasonable wages",
        "Great way to fund their Roth IRA"
      ],
      savings: "Average savings: $3,000 - $8,000/year"
    },
    {
      title: "Augusta Rule (Section 280A)",
      icon: Home,
      description: "Rent your home to your business for up to 14 days/year TAX-FREE.",
      details: [
        "Business deducts rental expense",
        "You receive rental income tax-free (no reporting required)",
        "Must charge fair market rate",
        "Document with meeting minutes and rental agreement"
      ],
      savings: "Potential savings: $2,000 - $10,000/year"
    }
  ];

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
            <CreditCard className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Business Credit Builder
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Build business credit, get funding, and learn tax strategies the wealthy use.
          </p>
        </div>

        <Tabs defaultValue="tradelines" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="tradelines">Tradelines</TabsTrigger>
            <TabsTrigger value="cards">Credit Cards</TabsTrigger>
            <TabsTrigger value="funding">Creative Funding</TabsTrigger>
            <TabsTrigger value="tax">Tax Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="tradelines">
            <div className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <h3 className="font-semibold text-purple-400 mb-2">Building Business Credit 101</h3>
              <ol className="text-sm text-gray-400 space-y-1">
                <li>1. Get your EIN and D-U-N-S number (free from Dun & Bradstreet)</li>
                <li>2. Open a business bank account and business address</li>
                <li>3. Start with 3-5 Net 30 vendor accounts (below)</li>
                <li>4. Pay early or on time - this builds your Paydex score</li>
                <li>5. After 3-6 months, apply for business credit cards</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tradelines.map((tradeline, index) => (
                <Card key={index} className="glass border-border/50 hover:border-purple-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tradeline.name}</CardTitle>
                      <Badge className="bg-green-500/20 text-green-400">{tradeline.difficulty}</Badge>
                    </div>
                    <CardDescription>{tradeline.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-400">Credit Limit:</span>
                      <span className="ml-2 text-purple-400 font-semibold">{tradeline.creditLimit}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Reports to:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tradeline.reports.map((bureau, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{bureau}</Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{tradeline.requirements}</p>
                    <Button 
                      className="w-full mt-2"
                      variant="outline"
                      onClick={() => window.open(tradeline.link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creditCards.map((card, index) => (
                <Card key={index} className="glass border-border/50 hover:border-purple-500/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                    <CardDescription>{card.rewards}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Credit Limit:</span>
                        <p className="text-purple-400 font-semibold">{card.creditLimit}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Annual Fee:</span>
                        <p className="font-semibold">{card.annualFee}</p>
                      </div>
                    </div>
                    <div className="p-2 rounded bg-green-500/10 border border-green-500/30">
                      <span className="text-xs text-green-400">Sign-up Bonus:</span>
                      <p className="text-sm font-semibold">{card.bonus}</p>
                    </div>
                    <p className="text-xs text-gray-500">{card.requirements}</p>
                    <Button 
                      className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
                      onClick={() => window.open(card.link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="funding">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creativeFunding.map((funding, index) => (
                <Card key={index} className="glass border-border/50 hover:border-green-500/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">{funding.title}</CardTitle>
                    <CardDescription>{funding.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Advantages:</h4>
                    <ul className="space-y-1 mb-4">
                      {funding.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Providers:</h4>
                    <div className="flex flex-wrap gap-1">
                      {funding.providers.map((provider, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{provider}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tax">
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-500">Disclaimer</h3>
                  <p className="text-sm text-gray-400">These are general tax strategies. Consult a licensed CPA or tax attorney for your specific situation. Tax laws change frequently.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {taxTips.map((tip, index) => (
                <Card key={index} className="glass border-border/50 hover:border-amber-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/20">
                        <tip.icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                        <Badge className="bg-green-500/20 text-green-400 text-xs mt-1">{tip.savings}</Badge>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{tip.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tip.details.map((detail, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Own Nothing, Control Everything */}
        <Card className="glass border-border/50 mt-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Own Nothing, Control Everything</CardTitle>
            <CardDescription className="text-center">
              The wealthy don't own assets personally - they control them through entities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                <h4 className="font-semibold text-purple-400 mb-2">Asset Protection</h4>
                <p className="text-sm text-gray-400">LLCs, trusts, and corporations shield personal assets from business liability</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <h4 className="font-semibold text-green-400 mb-2">Tax Efficiency</h4>
                <p className="text-sm text-gray-400">Business entities allow deductions unavailable to individuals</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                <h4 className="font-semibold text-amber-400 mb-2">Wealth Transfer</h4>
                <p className="text-sm text-gray-400">Dynasty trusts pass wealth to future generations tax-free</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/dynasty-trust">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Learn About Dynasty Trusts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
