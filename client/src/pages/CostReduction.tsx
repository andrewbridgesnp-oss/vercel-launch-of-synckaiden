import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Zap, Droplets, Flame, Building2, TrendingDown, Calculator, DollarSign, Lightbulb, ThermometerSun, Wifi, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function CostReduction() {
  const [businessType, setBusinessType] = useState("");
  const [monthlyUtilities, setMonthlyUtilities] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [employees, setEmployees] = useState("");
  const [savingsEstimate, setSavingsEstimate] = useState<null | { annual: number; strategies: string[] }>(null);

  // Top 3 places businesses waste money (researched)
  const topWasteAreas = [
    {
      title: "Energy & Utilities",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      wastePercent: "23-35%",
      description: "HVAC running 24/7, inefficient lighting, phantom loads from equipment left on standby",
      solutions: [
        "Smart thermostats with occupancy sensors (saves 15-25%)",
        "LED retrofit with motion sensors (saves 50-75% on lighting)",
        "Power strips with auto-shutoff for kitchen equipment",
        "Energy audit to identify phantom loads",
        "Negotiate better utility rates (many businesses overpay)"
      ]
    },
    {
      title: "Food & Inventory Waste",
      icon: Flame,
      color: "from-red-500 to-pink-500",
      wastePercent: "4-10% of revenue",
      description: "Over-ordering, spoilage, portion inconsistency, theft, poor inventory tracking",
      solutions: [
        "AI-powered demand forecasting (reduces over-ordering 20-30%)",
        "FIFO inventory system with expiration tracking",
        "Standardized portion controls and recipes",
        "Weekly inventory audits with variance reports",
        "Vendor consolidation for better pricing"
      ]
    },
    {
      title: "Labor & Scheduling",
      icon: Building2,
      color: "from-blue-500 to-cyan-500",
      wastePercent: "5-15% of labor costs",
      description: "Overstaffing during slow periods, overtime from poor scheduling, high turnover costs",
      solutions: [
        "AI scheduling based on historical traffic patterns",
        "Cross-training employees for flexibility",
        "Predictive scheduling to reduce last-minute overtime",
        "Retention programs (replacing an employee costs 50-200% of salary)",
        "Task automation for repetitive work"
      ]
    }
  ];

  // Investment opportunities
  const investmentOpportunities = [
    {
      title: "Land Bank Properties",
      description: "Acquire distressed properties at 50-80% below market value through county land banks",
      link: "https://communityprogress.org/resources/land-banks/national-land-bank-map/",
      roi: "200-400% after rehab"
    },
    {
      title: "DSCR Loans",
      description: "Debt Service Coverage Ratio loans - qualify based on property income, not personal income",
      link: "https://www.investopedia.com/dscr-loan-definition-5225296",
      roi: "No income verification needed"
    },
    {
      title: "Rehab/Fix & Flip Loans",
      description: "Short-term financing for property renovation with quick approval",
      link: "https://www.bankrate.com/mortgages/fix-and-flip-loans/",
      roi: "12-18 month terms"
    },
    {
      title: "SBA 504 Loans",
      description: "Low down payment (10%) for commercial real estate and equipment",
      link: "https://www.sba.gov/funding-programs/loans/504-loans",
      roi: "Fixed rates, 10-25 year terms"
    },
    {
      title: "Opportunity Zone Investments",
      description: "Tax benefits for investing in designated low-income areas",
      link: "https://opportunityzones.hud.gov/",
      roi: "Capital gains tax deferral"
    }
  ];

  const calculateSavings = () => {
    if (!monthlyUtilities || !businessType) {
      toast.error("Please fill in business type and monthly utilities");
      return;
    }

    const utilities = parseFloat(monthlyUtilities);
    const sqft = parseFloat(squareFootage) || 2000;
    const emps = parseFloat(employees) || 10;

    // Conservative savings estimates based on industry data
    let savingsPercent = 0.20; // Base 20% savings
    const strategies: string[] = [];

    if (businessType === "restaurant") {
      savingsPercent = 0.28;
      strategies.push("Smart kitchen ventilation controls (saves $200-500/month)");
      strategies.push("LED lighting with dimmers (saves $150-300/month)");
      strategies.push("Refrigeration optimization (saves $100-250/month)");
      strategies.push("Water-saving pre-rinse sprayers (saves $50-100/month)");
    } else if (businessType === "hotel") {
      savingsPercent = 0.32;
      strategies.push("Occupancy-based HVAC in rooms (saves 25-40% on HVAC)");
      strategies.push("Key card energy management (saves $5-15/room/month)");
      strategies.push("Laundry water recycling (saves 30-50% on water)");
      strategies.push("LED retrofit in common areas (saves $500-2000/month)");
    } else if (businessType === "retail") {
      savingsPercent = 0.22;
      strategies.push("Daylight harvesting with smart controls");
      strategies.push("HVAC scheduling for business hours only");
      strategies.push("Demand response programs for utility credits");
    } else {
      savingsPercent = 0.18;
      strategies.push("Energy audit to identify quick wins");
      strategies.push("Smart power strips for office equipment");
      strategies.push("HVAC maintenance and filter replacement");
    }

    // Adjust for size
    if (sqft > 5000) savingsPercent += 0.05;
    if (emps > 20) savingsPercent += 0.03;

    const annualSavings = utilities * 12 * savingsPercent;
    setSavingsEstimate({ annual: Math.round(annualSavings), strategies });
    toast.success("Savings calculated!");
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
            <TrendingDown className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Cost Reduction Center
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Hotels & restaurants waste 20-35% on utilities alone. Find your savings and investment opportunities.
          </p>
        </div>

        <Tabs defaultValue="waste" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="waste">
              <TrendingDown className="w-4 h-4 mr-2" />
              Top 3 Waste Areas
            </TabsTrigger>
            <TabsTrigger value="calculator">
              <Calculator className="w-4 h-4 mr-2" />
              Savings Calculator
            </TabsTrigger>
            <TabsTrigger value="invest">
              <DollarSign className="w-4 h-4 mr-2" />
              Investment Loans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waste">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {topWasteAreas.map((area, index) => (
                <Card key={index} className="glass border-border/50 hover:border-cyan-500/50 transition-all">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${area.color} flex items-center justify-center mb-3`}>
                      <area.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{area.title}</CardTitle>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        {area.wastePercent} wasted
                      </Badge>
                    </div>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold text-sm text-cyan-400 mb-3">Solutions:</h4>
                    <ul className="space-y-2">
                      {area.solutions.map((solution, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Automation Section */}
            <Card className="glass border-border/50 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-cyan-400" />
                  AI Automation for Utilities
                </CardTitle>
                <CardDescription>
                  Smart systems that reduce costs automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <ThermometerSun className="w-8 h-8 text-cyan-400 mb-2" />
                    <h4 className="font-semibold">Smart HVAC</h4>
                    <p className="text-sm text-gray-400">AI learns patterns and pre-cools/heats efficiently</p>
                    <p className="text-cyan-400 font-semibold mt-2">Saves 20-40%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                    <h4 className="font-semibold">Demand Response</h4>
                    <p className="text-sm text-gray-400">Automatic load shifting during peak rates</p>
                    <p className="text-yellow-400 font-semibold mt-2">Saves 10-25%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <Droplets className="w-8 h-8 text-blue-400 mb-2" />
                    <h4 className="font-semibold">Water Management</h4>
                    <p className="text-sm text-gray-400">Leak detection and usage optimization</p>
                    <p className="text-blue-400 font-semibold mt-2">Saves 15-30%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <ShieldCheck className="w-8 h-8 text-green-400 mb-2" />
                    <h4 className="font-semibold">Predictive Maintenance</h4>
                    <p className="text-sm text-gray-400">Fix equipment before it fails</p>
                    <p className="text-green-400 font-semibold mt-2">Saves 25-50% on repairs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <div className="max-w-2xl mx-auto">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Utility Savings Calculator</CardTitle>
                  <CardDescription>
                    Estimate your potential annual savings with smart optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Type</label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant / Food Service</SelectItem>
                        <SelectItem value="hotel">Hotel / Hospitality</SelectItem>
                        <SelectItem value="retail">Retail Store</SelectItem>
                        <SelectItem value="office">Office / Professional Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Monthly Utility Bill ($)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 3500"
                      value={monthlyUtilities}
                      onChange={(e) => setMonthlyUtilities(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Square Footage</label>
                      <Input
                        type="number"
                        placeholder="e.g., 5000"
                        value={squareFootage}
                        onChange={(e) => setSquareFootage(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Number of Employees</label>
                      <Input
                        type="number"
                        placeholder="e.g., 25"
                        value={employees}
                        onChange={(e) => setEmployees(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                    onClick={calculateSavings}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Savings
                  </Button>

                  {savingsEstimate && (
                    <div className="mt-6 p-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-400">Estimated Annual Savings</p>
                        <p className="text-4xl font-bold text-cyan-400">
                          ${savingsEstimate.annual.toLocaleString()}
                        </p>
                      </div>
                      <h4 className="font-semibold text-sm mb-2">Recommended Strategies:</h4>
                      <ul className="space-y-2">
                        {savingsEstimate.strategies.map((strategy, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            {strategy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invest">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentOpportunities.map((opp, index) => (
                <Card key={index} className="glass border-border/50 hover:border-green-500/50 transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">{opp.title}</CardTitle>
                    <CardDescription>{opp.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
                      {opp.roi}
                    </Badge>
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => window.open(opp.link, '_blank')}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
