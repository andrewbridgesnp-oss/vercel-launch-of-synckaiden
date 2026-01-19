import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CreditCard, GraduationCap, Scale, AlertTriangle, CheckCircle2, ArrowRight, Phone, Mail, ExternalLink } from "lucide-react";

// US States for selection
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// LLC Formation Component
function LLCFormation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    state: "",
    businessType: "",
    members: "1",
    registeredAgent: "self",
  });

  const stateFilingFees: Record<string, number> = {
    "Delaware": 90, "Wyoming": 100, "Nevada": 425, "New Mexico": 50, "California": 70,
    "Texas": 300, "Florida": 125, "New York": 200, "South Carolina": 110,
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-500">Legal Disclaimer</p>
            <p className="text-muted-foreground">This tool provides general information only. LLC formation requirements vary by state. Consult a licensed attorney in your state before forming an LLC. Kaiden AI does not provide legal advice.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Step 1: Business Information</h3>
          <div className="space-y-3">
            <div>
              <Label>Proposed Business Name</Label>
              <Input 
                placeholder="e.g., Smith Consulting LLC"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
              <p className="text-xs text-muted-foreground mt-1">Must include "LLC" or "Limited Liability Company"</p>
            </div>
            <div>
              <Label>State of Formation</Label>
              <Select value={formData.state} onValueChange={(v) => setFormData({...formData, state: v})}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Delaware, Wyoming, and Nevada offer favorable LLC laws</p>
            </div>
          </div>
          <Button onClick={() => setStep(2)} disabled={!formData.businessName || !formData.state}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Step 2: Business Structure</h3>
          <div className="space-y-3">
            <div>
              <Label>Business Type</Label>
              <Select value={formData.businessType} onValueChange={(v) => setFormData({...formData, businessType: v})}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="consulting">Professional Services / Consulting</SelectItem>
                  <SelectItem value="retail">Retail / E-commerce</SelectItem>
                  <SelectItem value="realestate">Real Estate / Property Management</SelectItem>
                  <SelectItem value="tech">Technology / Software</SelectItem>
                  <SelectItem value="healthcare">Healthcare Services</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Number of Members</Label>
              <Select value={formData.members} onValueChange={(v) => setFormData({...formData, members: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Single Member (1 owner)</SelectItem>
                  <SelectItem value="2-5">Multi-Member (2-5 owners)</SelectItem>
                  <SelectItem value="6+">Multi-Member (6+ owners)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)} disabled={!formData.businessType}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Step 3: Registered Agent</h3>
          <p className="text-sm text-muted-foreground">Every LLC needs a registered agent to receive legal documents.</p>
          <div className="space-y-3">
            <div>
              <Label>Registered Agent Option</Label>
              <Select value={formData.registeredAgent} onValueChange={(v) => setFormData({...formData, registeredAgent: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">I will be my own registered agent (Free)</SelectItem>
                  <SelectItem value="service">Use a registered agent service ($50-150/year)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Review Summary <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Step 4: Summary & Next Steps</h3>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Business Name:</span><span className="font-medium">{formData.businessName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">State:</span><span className="font-medium">{formData.state}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Business Type:</span><span className="font-medium">{formData.businessType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Members:</span><span className="font-medium">{formData.members}</span></div>
              <hr className="my-3" />
              <div className="flex justify-between"><span className="text-muted-foreground">Est. State Filing Fee:</span><span className="font-medium">${stateFilingFees[formData.state] || 150}</span></div>
            </CardContent>
          </Card>
          
          <div className="bg-primary/10 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold">Next Steps to Complete Formation:</h4>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              <li>Check name availability with {formData.state} Secretary of State</li>
              <li>Prepare and file Articles of Organization</li>
              <li>Create an Operating Agreement</li>
              <li>Obtain an EIN from the IRS (free)</li>
              <li>Open a business bank account</li>
              <li>Register for state/local business licenses</li>
            </ol>
          </div>

          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Get Your Results</h4>
            <p className="text-sm text-muted-foreground">Receive a detailed summary with document templates and next steps.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="your@email.com" className="flex-1" />
              <Button>Email My Results</Button>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Scale className="h-4 w-4 text-amber-500" /> Attorney Review Option</h4>
            <p className="text-sm text-muted-foreground">Have a licensed attorney review your LLC formation documents before filing. A real human reviews everything - this just helps reduce your costs.</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">$99</span>
                <span className="text-muted-foreground text-sm ml-2">3-5 business days</span>
              </div>
              <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500/10">Request Attorney Review</Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Start Over</Button>
            <Link href="/professionals">
              <Button>Find an Attorney <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Credit Repair Assessment Component
function CreditRepair() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    { id: "score", question: "What is your current credit score range?", options: ["Below 500", "500-579", "580-669", "670-739", "740+"] },
    { id: "negatives", question: "Do you have negative items on your credit report?", options: ["Yes, multiple", "Yes, a few", "Not sure", "No"] },
    { id: "debt", question: "What is your current debt-to-income ratio?", options: ["Over 50%", "36-50%", "20-35%", "Under 20%"] },
    { id: "late", question: "Have you had late payments in the last 2 years?", options: ["Yes, frequently", "Yes, occasionally", "Once or twice", "Never"] },
    { id: "collections", question: "Do you have accounts in collections?", options: ["Yes, multiple", "Yes, one", "Not sure", "No"] },
  ];

  const calculateScore = () => {
    let score = 0;
    if (answers.score === "740+") score += 20;
    else if (answers.score === "670-739") score += 15;
    else if (answers.score === "580-669") score += 10;
    else if (answers.score === "500-579") score += 5;
    
    if (answers.negatives === "No") score += 20;
    else if (answers.negatives === "Not sure") score += 10;
    else if (answers.negatives === "Yes, a few") score += 5;
    
    if (answers.debt === "Under 20%") score += 20;
    else if (answers.debt === "20-35%") score += 15;
    else if (answers.debt === "36-50%") score += 10;
    
    if (answers.late === "Never") score += 20;
    else if (answers.late === "Once or twice") score += 15;
    else if (answers.late === "Yes, occasionally") score += 5;
    
    if (answers.collections === "No") score += 20;
    else if (answers.collections === "Not sure") score += 10;
    else if (answers.collections === "Yes, one") score += 5;
    
    return score;
  };

  const getRecommendations = (score: number) => {
    if (score >= 80) return { status: "Good Standing", color: "text-green-500", recommendations: [
      "Continue making on-time payments",
      "Keep credit utilization below 30%",
      "Monitor your credit reports annually",
    ]};
    if (score >= 50) return { status: "Needs Improvement", color: "text-yellow-500", recommendations: [
      "Dispute any inaccurate negative items",
      "Set up automatic payments to avoid late fees",
      "Consider a secured credit card to rebuild",
      "Pay down high-balance credit cards first",
    ]};
    return { status: "Needs Significant Work", color: "text-red-500", recommendations: [
      "Request free credit reports from AnnualCreditReport.com",
      "Dispute all inaccurate or unverifiable items",
      "Negotiate pay-for-delete agreements with collectors",
      "Consider credit counseling from a nonprofit agency",
      "Consult with a credit repair attorney",
    ]};
  };

  if (showResults) {
    const score = calculateScore();
    const result = getRecommendations(score);
    return (
      <div className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-500">Disclaimer</p>
              <p className="text-muted-foreground">This assessment is for educational purposes only. Results are estimates based on your responses. For personalized credit advice, consult a licensed credit counselor or attorney.</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Credit Health Assessment
              <Badge className={result.color}>{result.status}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Credit Health Score</span>
                <span className="font-bold">{score}/100</span>
              </div>
              <Progress value={score} className="h-3" />
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Recommended Actions:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Your Rights Under the FCRA</h4>
              <p className="text-sm text-muted-foreground">Under the Fair Credit Reporting Act (15 U.S.C. § 1681), you have the right to dispute inaccurate information, receive one free credit report annually from each bureau, and be notified when negative information is reported.</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Get Your Action Plan</h4>
          <p className="text-sm text-muted-foreground">Receive dispute letter templates and a personalized credit repair roadmap.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="your@email.com" className="flex-1" />
            <Button>Email My Plan</Button>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2"><Scale className="h-4 w-4 text-amber-500" /> Professional Review</h4>
          <p className="text-sm text-muted-foreground">Have a credit specialist review your situation and provide personalized guidance. A real human reviews everything.</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">$79</span>
              <span className="text-muted-foreground text-sm ml-2">3-5 business days</span>
            </div>
            <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500/10">Request Review</Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowResults(false); setAnswers({}); }}>Start Over</Button>
          <Link href="/professionals">
            <Button>Find Credit Attorney <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-500">Educational Tool</p>
            <p className="text-muted-foreground">This assessment helps identify areas for credit improvement. It is not a substitute for professional credit counseling.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <Card key={q.id}>
            <CardContent className="pt-6">
              <Label className="text-base">{idx + 1}. {q.question}</Label>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {q.options.map(opt => (
                  <Button
                    key={opt}
                    variant={answers[q.id] === opt ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnswers({...answers, [q.id]: opt})}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={() => setShowResults(true)} 
        disabled={Object.keys(answers).length < questions.length}
        className="w-full"
      >
        Get Assessment Results
      </Button>
    </div>
  );
}

// Brunner Test Calculator Component
function BrunnerTest() {
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
    loanBalance: "",
    monthlyPayment: "",
    yearsInRepayment: "",
    healthIssues: "no",
    dependents: "0",
    employmentStatus: "employed",
  });
  const [showResults, setShowResults] = useState(false);

  const calculateBrunnerScore = () => {
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = parseFloat(formData.monthlyExpenses) || 0;
    const payment = parseFloat(formData.monthlyPayment) || 0;
    const years = parseInt(formData.yearsInRepayment) || 0;
    
    let prongScores = { prong1: 0, prong2: 0, prong3: 0 };
    
    // Prong 1: Minimal Standard of Living
    const disposable = income - expenses;
    if (disposable < payment) prongScores.prong1 = 100;
    else if (disposable < payment * 1.5) prongScores.prong1 = 70;
    else if (disposable < payment * 2) prongScores.prong1 = 40;
    else prongScores.prong1 = 10;
    
    // Prong 2: Persistence of Circumstances
    if (formData.healthIssues === "yes") prongScores.prong2 += 40;
    if (formData.employmentStatus === "disabled") prongScores.prong2 += 40;
    else if (formData.employmentStatus === "unemployed") prongScores.prong2 += 30;
    if (parseInt(formData.dependents) >= 3) prongScores.prong2 += 20;
    else if (parseInt(formData.dependents) >= 1) prongScores.prong2 += 10;
    
    // Prong 3: Good Faith Effort
    if (years >= 10) prongScores.prong3 = 100;
    else if (years >= 5) prongScores.prong3 = 70;
    else if (years >= 2) prongScores.prong3 = 40;
    else prongScores.prong3 = 20;
    
    return prongScores;
  };

  if (showResults) {
    const scores = calculateBrunnerScore();
    const avgScore = (scores.prong1 + scores.prong2 + scores.prong3) / 3;
    
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-red-500">Important Legal Notice</p>
              <p className="text-muted-foreground">The Brunner Test is a legal standard applied by bankruptcy courts. This calculator provides an estimate only. Actual outcomes depend on your specific circumstances, jurisdiction, and judge. You MUST consult a bankruptcy attorney before filing. Student loan discharge is extremely difficult to obtain.</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brunner Test Assessment</CardTitle>
            <CardDescription>Based on Brunner v. New York State Higher Education Services Corp., 831 F.2d 395 (2d Cir. 1987)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Prong 1: Minimal Standard of Living</span>
                  <span>{scores.prong1}%</span>
                </div>
                <Progress value={scores.prong1} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Can you maintain a minimal standard of living while repaying?</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Prong 2: Persistence of Circumstances</span>
                  <span>{scores.prong2}%</span>
                </div>
                <Progress value={scores.prong2} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Are your circumstances likely to persist for a significant portion of the repayment period?</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Prong 3: Good Faith Effort</span>
                  <span>{scores.prong3}%</span>
                </div>
                <Progress value={scores.prong3} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Have you made good faith efforts to repay the loans?</p>
              </div>
            </div>

            <hr />

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Assessment Summary</h4>
              <p className="text-sm text-muted-foreground">
                {avgScore >= 70 
                  ? "Based on your responses, you may have a case for undue hardship discharge. However, courts apply this test very strictly. Consult a bankruptcy attorney to evaluate your specific situation."
                  : avgScore >= 40
                  ? "Your situation shows some factors that may support a hardship claim, but the Brunner Test is notoriously difficult to satisfy. Consider income-driven repayment plans as an alternative."
                  : "Based on your responses, you may face significant challenges meeting the Brunner Test requirements. Consider exploring income-driven repayment plans, Public Service Loan Forgiveness, or other relief options."
                }
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Alternative Options to Consider:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Income-Driven Repayment (IDR) Plans</li>
                <li>• Public Service Loan Forgiveness (PSLF)</li>
                <li>• Total and Permanent Disability Discharge</li>
                <li>• Borrower Defense to Repayment</li>
                <li>• Closed School Discharge</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Get Your Assessment</h4>
          <p className="text-sm text-muted-foreground">Receive a detailed report with your Brunner Test scores and next steps.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="your@email.com" className="flex-1" />
            <Button>Email My Results</Button>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2"><Scale className="h-4 w-4 text-amber-500" /> Attorney Consultation</h4>
          <p className="text-sm text-muted-foreground">Have a bankruptcy attorney review your case and advise on your options. A real human reviews everything - this helps reduce your out-of-pocket costs.</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">$149</span>
              <span className="text-muted-foreground text-sm ml-2">Initial consultation</span>
            </div>
            <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500/10">Schedule Consultation</Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowResults(false); }}>Recalculate</Button>
          <Link href="/professionals">
            <Button>Find Bankruptcy Attorney <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-500">Legal Disclaimer</p>
            <p className="text-muted-foreground">This calculator is for educational purposes only. The Brunner Test is a legal standard that requires proving "undue hardship" in bankruptcy court. Discharging student loans in bankruptcy is extremely rare and difficult. Always consult a qualified bankruptcy attorney.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Monthly Gross Income ($)</Label>
          <Input type="number" placeholder="3000" value={formData.monthlyIncome} onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})} />
        </div>
        <div>
          <Label>Monthly Necessary Expenses ($)</Label>
          <Input type="number" placeholder="2500" value={formData.monthlyExpenses} onChange={(e) => setFormData({...formData, monthlyExpenses: e.target.value})} />
          <p className="text-xs text-muted-foreground mt-1">Rent, utilities, food, transportation, medical</p>
        </div>
        <div>
          <Label>Total Student Loan Balance ($)</Label>
          <Input type="number" placeholder="50000" value={formData.loanBalance} onChange={(e) => setFormData({...formData, loanBalance: e.target.value})} />
        </div>
        <div>
          <Label>Required Monthly Payment ($)</Label>
          <Input type="number" placeholder="500" value={formData.monthlyPayment} onChange={(e) => setFormData({...formData, monthlyPayment: e.target.value})} />
        </div>
        <div>
          <Label>Years in Repayment</Label>
          <Input type="number" placeholder="5" value={formData.yearsInRepayment} onChange={(e) => setFormData({...formData, yearsInRepayment: e.target.value})} />
        </div>
        <div>
          <Label>Number of Dependents</Label>
          <Select value={formData.dependents} onValueChange={(v) => setFormData({...formData, dependents: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Employment Status</Label>
          <Select value={formData.employmentStatus} onValueChange={(v) => setFormData({...formData, employmentStatus: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed Full-Time</SelectItem>
              <SelectItem value="parttime">Employed Part-Time</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Chronic Health Issues?</Label>
          <Select value={formData.healthIssues} onValueChange={(v) => setFormData({...formData, healthIssues: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={() => setShowResults(true)} className="w-full">
        Calculate Brunner Test Assessment
      </Button>
    </div>
  );
}

// Main Legal Services Page
export default function LegalServices() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Legal & Financial Services</h1>
          <p className="text-muted-foreground">Interactive tools to help you understand your options. Always consult licensed professionals.</p>
        </div>

        <Tabs defaultValue="llc" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="llc" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">LLC Formation</span>
            </TabsTrigger>
            <TabsTrigger value="credit" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Credit Repair</span>
            </TabsTrigger>
            <TabsTrigger value="brunner" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Brunner Test</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="llc">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  LLC Formation Wizard
                </CardTitle>
                <CardDescription>Step-by-step guide to forming a Limited Liability Company</CardDescription>
              </CardHeader>
              <CardContent>
                <LLCFormation />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Repair Assessment
                </CardTitle>
                <CardDescription>Evaluate your credit health and get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <CreditRepair />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brunner">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Student Loan Brunner Test Calculator
                </CardTitle>
                <CardDescription>Assess potential eligibility for student loan discharge under the Brunner Test</CardDescription>
              </CardHeader>
              <CardContent>
                <BrunnerTest />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Scale className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Need Professional Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">These tools provide general information only. For personalized legal or financial advice, consult licensed professionals in your state.</p>
                <Link href="/professionals">
                  <Button>Find Lawyers & CPAs in Your Area <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
