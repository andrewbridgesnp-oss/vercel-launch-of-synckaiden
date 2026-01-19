import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calculator, DollarSign, Calendar, Upload, Download, Loader2, TrendingUp, MessageSquare, CheckCircle, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function TaxApp() {
  const { user, isAuthenticated } = useAuth();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [filingStatus, setFilingStatus] = useState("single");
  const [income, setIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  const [taxQuestion, setTaxQuestion] = useState("");
  const [expenses, setExpenses] = useState([{ category: "", amount: "", description: "" }]);

  const { data: entitlement, isLoading: checkingAccess } = trpc.entitlements.checkBySlug.useQuery(
    { slug: "comprehensive-tax-app" },
    { enabled: isAuthenticated }
  );

  const { data: taxReturns = [], refetch: refetchReturns } = trpc.taxApp.getTaxReturns.useQuery(
    undefined,
    { enabled: isAuthenticated && entitlement?.hasAccess }
  );

  const { data: documents = [] } = trpc.taxApp.getDocuments.useQuery(
    { taxYear: selectedYear },
    { enabled: isAuthenticated && entitlement?.hasAccess }
  );

  const { data: checklist = [] } = trpc.taxApp.getFilingChecklist.useQuery(
    { taxYear: selectedYear },
    { enabled: isAuthenticated && entitlement?.hasAccess }
  );

  const createReturn = trpc.taxApp.createTaxReturn.useMutation({
    onSuccess: () => {
      toast.success("Tax return created successfully");
      refetchReturns();
    },
    onError: (error) => {
      toast.error(`Failed to create return: ${error.message}`);
    },
  });

  const calculateEstimate = trpc.taxApp.calculateEstimate.useMutation({
    onSuccess: (data) => {
      toast.success(`Estimated tax: $${data.estimatedTax.toFixed(2)}`);
    },
    onError: (error) => {
      toast.error(`Calculation failed: ${error.message}`);
    },
  });

  const calculateQuarterly = trpc.taxApp.calculateQuarterlyTaxes.useMutation({
    onSuccess: (data) => {
      toast.success(`Quarterly payment: $${data.quarterlyPayment.toFixed(2)}`);
    },
    onError: (error) => {
      toast.error(`Calculation failed: ${error.message}`);
    },
  });

  const findDeductions = trpc.taxApp.findDeductions.useMutation({
    onSuccess: (data) => {
      toast.success(`Found ${data.deductions.length} potential deductions`);
    },
    onError: (error) => {
      toast.error(`Search failed: ${error.message}`);
    },
  });

  const getAdvice = trpc.taxApp.getAdvice.useMutation({
    onSuccess: (data) => {
      toast.success("Tax advice generated");
    },
    onError: (error) => {
      toast.error(`Failed to get advice: ${error.message}`);
    },
  });

  const analyzeSavings = trpc.taxApp.analyzeSavings.useMutation({
    onSuccess: (data) => {
      toast.success(`Potential savings: $${data.potentialSavings.toFixed(2)}`);
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Calculator className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4 text-center">Sign in required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Please sign in to access the Tax Application.
          </p>
          <Button asChild className="w-full">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </Card>
      </div>
    );
  }

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!entitlement?.hasAccess) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center p-4">
        <Card className="glass premium-card border-border/50 p-8 max-w-md">
          <Calculator className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4 text-center">Subscription Required</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Subscribe to access the Comprehensive Tax Application.
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                <a>View Plans</a>
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/app/sync-bundle">
                <a>Get Bundle</a>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleCreateReturn = () => {
    createReturn.mutate({
      taxYear: selectedYear,
      filingStatus: filingStatus as any,
    });
  };

  const handleCalculateEstimate = () => {
    if (!income) {
      toast.error("Please enter your income");
      return;
    }
    calculateEstimate.mutate({
      income: parseFloat(income),
      filingStatus,
      state: "CA",
    });
  };

  const handleCalculateQuarterly = () => {
    if (!income) {
      toast.error("Please enter your estimated annual income");
      return;
    }
    calculateQuarterly.mutate({
      estimatedAnnualIncome: parseFloat(income),
      filingStatus,
    });
  };

  const handleFindDeductions = () => {
    if (!income) {
      toast.error("Please enter your income");
      return;
    }
    const validExpenses = expenses.filter(e => e.category && e.amount && e.description);
    if (validExpenses.length === 0) {
      toast.error("Please add at least one expense");
      return;
    }
    findDeductions.mutate({
      income: parseFloat(income),
      expenses: validExpenses.map(e => ({
        category: e.category,
        amount: parseFloat(e.amount),
        description: e.description,
      })),
    });
  };

  const handleGetAdvice = () => {
    if (!taxQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }
    getAdvice.mutate({
      question: taxQuestion,
      context: {
        income: income ? parseFloat(income) : undefined,
        filingStatus,
      },
    });
  };

  const handleAnalyzeSavings = () => {
    if (!income || !deductions) {
      toast.error("Please enter income and current deductions");
      return;
    }
    analyzeSavings.mutate({
      income: parseFloat(income),
      currentDeductions: parseFloat(deductions),
    });
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      {/* Hero */}
      <div className="border-b border-border/50 glass">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/30">
              <Calculator className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">Comprehensive Tax App</h1>
              <p className="text-muted-foreground text-lg">
                AI-powered tax filing, deduction finder, and savings analyzer
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm">E-File Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-primary" />
              <span className="text-sm">Auto Calculations</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-sm">Max Refunds</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm">AI Deduction Finder</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="returns" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="returns">Tax Returns</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="advice">AI Advice</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>

          {/* Tax Returns */}
          <TabsContent value="returns" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Your Tax Returns</h3>
                <div className="flex gap-3">
                  <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCreateReturn} disabled={createReturn.isPending}>
                    {createReturn.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                    New Return
                  </Button>
                </div>
              </div>

              {taxReturns.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No tax returns yet. Create your first return to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {taxReturns.map((ret: any) => (
                    <Card key={ret.id} className="glass border-border/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Tax Year {ret.taxYear}</h4>
                          <p className="text-sm text-muted-foreground">
                            {ret.filingStatus.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </p>
                        </div>
                        <Badge variant={ret.status === "filed" ? "default" : "secondary"}>
                          {ret.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Tax Documents</h3>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet. Upload W-2s, 1099s, and receipts.</p>
              </div>
            </Card>
          </TabsContent>

          {/* Tax Calculator */}
          <TabsContent value="calculator" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-6">Tax Estimate Calculator</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income">Annual Income</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="75000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="filing-status">Filing Status</Label>
                  <Select value={filingStatus} onValueChange={setFilingStatus}>
                    <SelectTrigger id="filing-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
                      <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                      <SelectItem value="head_of_household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCalculateEstimate} disabled={calculateEstimate.isPending} className="w-full">
                  {calculateEstimate.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calculator className="w-4 h-4 mr-2" />}
                  Calculate Tax Estimate
                </Button>
                {calculateEstimate.data && (
                  <Card className="glass border-border/30 p-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Tax</p>
                        <p className="text-2xl font-bold">${calculateEstimate.data.estimatedTax.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Effective Rate</p>
                        <p className="text-2xl font-bold">{calculateEstimate.data.effectiveRate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Quarterly Taxes */}
          <TabsContent value="quarterly" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-6">Quarterly Tax Estimator</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="annual-income">Estimated Annual Income</Label>
                  <Input
                    id="annual-income"
                    type="number"
                    placeholder="100000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="filing-status-q">Filing Status</Label>
                  <Select value={filingStatus} onValueChange={setFilingStatus}>
                    <SelectTrigger id="filing-status-q">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
                      <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                      <SelectItem value="head_of_household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCalculateQuarterly} disabled={calculateQuarterly.isPending} className="w-full">
                  {calculateQuarterly.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
                  Calculate Quarterly Payments
                </Button>
                {calculateQuarterly.data && (
                  <Card className="glass border-border/30 p-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Quarterly Payment</p>
                        <p className="text-2xl font-bold">${calculateQuarterly.data.quarterlyPayment.toFixed(2)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Q1 Due: Apr 15</p>
                          <p className="font-semibold">${calculateQuarterly.data.quarterlyPayment.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Q2 Due: Jun 15</p>
                          <p className="font-semibold">${calculateQuarterly.data.quarterlyPayment.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Q3 Due: Sep 15</p>
                          <p className="font-semibold">${calculateQuarterly.data.quarterlyPayment.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Q4 Due: Jan 15</p>
                          <p className="font-semibold">${calculateQuarterly.data.quarterlyPayment.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* AI Deduction Finder */}
          <TabsContent value="deductions" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-6">AI-Powered Deduction Finder</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income-ded">Annual Income</Label>
                  <Input
                    id="income-ded"
                    type="number"
                    placeholder="75000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Expenses</Label>
                  {expenses.map((expense, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                      <Input
                        placeholder="Category"
                        value={expense.category}
                        onChange={(e) => {
                          const newExpenses = [...expenses];
                          newExpenses[idx].category = e.target.value;
                          setExpenses(newExpenses);
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={expense.amount}
                        onChange={(e) => {
                          const newExpenses = [...expenses];
                          newExpenses[idx].amount = e.target.value;
                          setExpenses(newExpenses);
                        }}
                      />
                      <Input
                        placeholder="Description"
                        value={expense.description}
                        onChange={(e) => {
                          const newExpenses = [...expenses];
                          newExpenses[idx].description = e.target.value;
                          setExpenses(newExpenses);
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpenses([...expenses, { category: "", amount: "", description: "" }])}
                  >
                    Add Expense
                  </Button>
                </div>
                <Button onClick={handleFindDeductions} disabled={findDeductions.isPending} className="w-full">
                  {findDeductions.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lightbulb className="w-4 h-4 mr-2" />}
                  Find Eligible Deductions
                </Button>
                {findDeductions.data && (
                  <Card className="glass border-border/30 p-4 mt-4">
                    <h4 className="font-semibold mb-3">Found {findDeductions.data.deductions.length} Deductions</h4>
                    <div className="space-y-2">
                      {findDeductions.data.deductions.map((ded: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                          <div>
                            <p className="font-medium">{ded.category}</p>
                            <p className="text-sm text-muted-foreground">{ded.description}</p>
                            <p className="text-sm font-semibold">${ded.amount.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <p className="text-sm text-muted-foreground">Total Potential Deductions</p>
                      <p className="text-2xl font-bold">${findDeductions.data.totalDeductions.toFixed(2)}</p>
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* AI Tax Advice */}
          <TabsContent value="advice" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-6">AI Tax Advisor</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tax-question">Ask a Tax Question</Label>
                  <Textarea
                    id="tax-question"
                    placeholder="e.g., Can I deduct home office expenses if I work remotely?"
                    value={taxQuestion}
                    onChange={(e) => setTaxQuestion(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleGetAdvice} disabled={getAdvice.isPending} className="w-full">
                  {getAdvice.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                  Get AI Advice
                </Button>
                {getAdvice.data && (
                  <Card className="glass border-border/30 p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="font-semibold mb-2">AI Tax Advisor</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{getAdvice.data.advice}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Filing Checklist */}
          <TabsContent value="checklist" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-6">Tax Filing Checklist</h3>
              {checklist.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No checklist items yet. Create a tax return to generate your checklist.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {checklist.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 glass border border-border/30 rounded-lg">
                      <CheckCircle className={`w-5 h-5 mt-0.5 ${item.completed ? "text-green-500" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Tax Savings Analyzer */}
          <TabsContent value="savings" className="space-y-6">
            <Card className="glass premium-card border-border/50 p-6">
              <h3 className="text-xl font-semibold mb-6">Tax Savings Analyzer</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income-sav">Annual Income</Label>
                  <Input
                    id="income-sav"
                    type="number"
                    placeholder="75000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="current-ded">Current Deductions</Label>
                  <Input
                    id="current-ded"
                    type="number"
                    placeholder="12000"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                  />
                </div>
                <Button onClick={handleAnalyzeSavings} disabled={analyzeSavings.isPending} className="w-full">
                  {analyzeSavings.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                  Analyze Savings Opportunities
                </Button>
                {analyzeSavings.data && (
                  <Card className="glass border-border/30 p-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Potential Annual Savings</p>
                        <p className="text-3xl font-bold text-green-500">${analyzeSavings.data.potentialSavings.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Recommendations</p>
                        <ul className="space-y-2">
                          {analyzeSavings.data.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
