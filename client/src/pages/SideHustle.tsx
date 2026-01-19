import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Sparkles, Crown, Clock, DollarSign, Users, Briefcase, Send, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function SideHustle() {
  const { isAuthenticated, user } = useAuth();
  const [problem, setProblem] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Top 25 problems rich people have (researched)
  const richPeopleProblems = [
    { problem: "Finding reliable household staff", solution: "Vetted staffing placement service", price: "$500-2,000" },
    { problem: "Managing multiple properties", solution: "Property management coordination", price: "$200-500/month" },
    { problem: "Travel planning & concierge", solution: "Custom itinerary & booking service", price: "$300-1,000" },
    { problem: "Finding quality childcare/tutors", solution: "Background-checked referral network", price: "$200-500" },
    { problem: "Vehicle maintenance coordination", solution: "Mobile detailing & service scheduling", price: "$100-300" },
    { problem: "Personal shopping & styling", solution: "Curated shopping with delivery", price: "$150-500" },
    { problem: "Event planning & hosting", solution: "Full-service event coordination", price: "$500-5,000" },
    { problem: "Home organization & decluttering", solution: "Professional organizing service", price: "$200-800" },
    { problem: "Pet care & services", solution: "Premium pet sitting & grooming coordination", price: "$50-200" },
    { problem: "Technology setup & support", solution: "Smart home installation & troubleshooting", price: "$100-500" },
    { problem: "Meal planning & chef services", solution: "Personal chef or meal prep coordination", price: "$300-1,500/week" },
    { problem: "Fitness & wellness coordination", solution: "Personal trainer & spa booking", price: "$200-1,000" },
    { problem: "Legal document organization", solution: "Document scanning & secure storage", price: "$100-300" },
    { problem: "Gift sourcing & wrapping", solution: "Curated gift selection & delivery", price: "$50-500" },
    { problem: "Reservation securing", solution: "Hard-to-get restaurant & event reservations", price: "$100-500" },
    { problem: "Art & collectibles management", solution: "Inventory, insurance & appraisal coordination", price: "$200-1,000" },
    { problem: "Charitable giving coordination", solution: "Donation research & tax documentation", price: "$150-500" },
    { problem: "Family calendar management", solution: "Schedule coordination across households", price: "$100-300/month" },
    { problem: "Vendor management", solution: "Coordinate contractors, landscapers, cleaners", price: "$150-400/month" },
    { problem: "Mail & package management", solution: "Sort, scan, forward important mail", price: "$50-150/month" },
    { problem: "Errand running", solution: "Same-day pickup/delivery service", price: "$25-100/errand" },
    { problem: "Waiting in lines", solution: "Queue holding for DMV, stores, etc.", price: "$50-150" },
    { problem: "Research & comparison shopping", solution: "Product research with recommendations", price: "$50-200" },
    { problem: "Social media management", solution: "Personal brand curation", price: "$200-1,000/month" },
    { problem: "Memory preservation", solution: "Photo/video digitization & organization", price: "$100-500" }
  ];

  // Side hustle opportunities
  const sideHustles = [
    {
      title: "Syndica Concierge Partner",
      description: "Join our network to fulfill 1st World Problems requests. Get matched with clients in your area.",
      earnings: "$25-100/hour",
      requirements: ["Background check", "Reliable transportation", "Professional demeanor"],
      category: "Service"
    },
    {
      title: "Virtual Assistant",
      description: "Help busy professionals with scheduling, email, research, and admin tasks remotely.",
      earnings: "$20-50/hour",
      requirements: ["Strong communication", "Organized", "Tech-savvy"],
      category: "Remote"
    },
    {
      title: "Notary Public",
      description: "Mobile notary services are in high demand. Low startup cost, flexible hours.",
      earnings: "$75-200/signing",
      requirements: ["State certification", "E&O insurance", "Transportation"],
      category: "Service"
    },
    {
      title: "Property Caretaker",
      description: "Manage vacation homes, check on properties, coordinate maintenance.",
      earnings: "$200-500/property/month",
      requirements: ["Reliable", "Handyman skills helpful", "Local presence"],
      category: "Service"
    },
    {
      title: "Personal Shopper",
      description: "Shop for busy clients - groceries, gifts, clothing, home goods.",
      earnings: "$25-75/hour + tips",
      requirements: ["Good taste", "Efficient", "Transportation"],
      category: "Service"
    },
    {
      title: "Pet Services",
      description: "Dog walking, pet sitting, grooming coordination for busy pet owners.",
      earnings: "$20-50/visit",
      requirements: ["Love animals", "Reliable", "Pet first aid helpful"],
      category: "Service"
    }
  ];

  const handleSubmitProblem = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!problem.trim() || !budget.trim()) {
      toast.error("Please describe your problem and budget");
      return;
    }

    setSubmitting(true);
    // In production, this would create a ticket/request
    setTimeout(() => {
      toast.success("Request submitted! We'll respond within 24 hours with a solution.");
      setProblem("");
      setBudget("");
      setSubmitting(false);
    }, 1500);
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
            <Crown className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            1st World Problems
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Concierge solutions for busy professionals. Submit your problem, get a solution within 24 hours.
          </p>
        </div>

        <Tabs defaultValue="submit" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="submit">
              <Send className="w-4 h-4 mr-2" />
              Submit Problem
            </TabsTrigger>
            <TabsTrigger value="problems">
              <Crown className="w-4 h-4 mr-2" />
              Common Problems
            </TabsTrigger>
            <TabsTrigger value="earn">
              <DollarSign className="w-4 h-4 mr-2" />
              Earn Money
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <div className="max-w-2xl mx-auto">
              <Card className="glass border-border/50 border-amber-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Syndica Concierge
                  </CardTitle>
                  <CardDescription>
                    Tell us your problem and budget. We'll find a vetted professional to solve it within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">What do you need help with?</label>
                    <textarea
                      className="w-full h-32 p-3 rounded-lg bg-background/50 border border-border/50 focus:border-amber-500/50 focus:outline-none resize-none"
                      placeholder="Example: I need someone to wait in line at the DMV for me tomorrow morning, then coordinate with my landscaper to fix the sprinkler system..."
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Budget</label>
                    <Input
                      placeholder="e.g., $100-200"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                    onClick={handleSubmitProblem}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>24hr Response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Vetted Professionals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>Satisfaction Guaranteed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="problems">
            <div className="mb-6 text-center">
              <p className="text-gray-400">Common problems we solve for busy professionals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {richPeopleProblems.map((item, index) => (
                <Card key={index} className="glass border-border/50 hover:border-amber-500/50 transition-all">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-1">{item.problem}</h4>
                    <p className="text-xs text-gray-400 mb-2">{item.solution}</p>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                      {item.price}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earn">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Become a Syndica Partner</h2>
              <p className="text-gray-400">Join our network and earn money solving problems for busy professionals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sideHustles.map((hustle, index) => (
                <Card key={index} className="glass border-border/50 hover:border-green-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{hustle.category}</Badge>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {hustle.earnings}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{hustle.title}</CardTitle>
                    <CardDescription>{hustle.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {hustle.requirements.map((req, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          {req}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => { toast.success("Application Started!", { description: "Email partners@syndicasolutions.com with your resume and service areas" }); window.open("mailto:partners@syndicasolutions.com?subject=Syndica Partner Application&body=I would like to apply to become a Syndica Partner.%0A%0AService Area:%0AExperience:%0AAvailability:", "_blank"); }}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Apply to Join
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Background Check Notice */}
            <Card className="glass border-border/50 mt-8">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">All Partners Are Vetted</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Every Syndica partner undergoes a background check and verification process to ensure quality service for our clients.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => { toast.info("Background Check", { description: "Redirecting to Checkr for verification" }); window.open("https://checkr.com/apply", "_blank"); }}
                >
                  Start Background Check
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
