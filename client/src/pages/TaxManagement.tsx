import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";
import { SuggestionCard } from "@/components/SuggestionCard";
import { Receipt, DollarSign, Calculator, Trash2, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function TaxManagement() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  // Expense form state
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Office Supplies");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseVendor, setExpenseVendor] = useState("");
  
  // Income form state
  const [incomeDate, setIncomeDate] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeSource, setIncomeSource] = useState("Client Payment");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomePayer, setIncomePayer] = useState("");

  // Calculator state
  const [filingStatus, setFilingStatus] = useState("single");
  const [grossIncome, setGrossIncome] = useState("");
  const [totalDeductions, setTotalDeductions] = useState("");
  const [estimatedTax, setEstimatedTax] = useState<number | null>(null);

  // Fetch expenses and income
  const { data: expenses = [], refetch: refetchExpenses } = trpc.tax.listExpenses.useQuery();
  const { data: incomeList = [], refetch: refetchIncome } = trpc.tax.listIncome.useQuery();
  
  const addExpenseMutation = trpc.tax.addExpense.useMutation({
    onSuccess: () => {
      toast.success("Expense added!");
      refetchExpenses();
      setExpenseDate("");
      setExpenseAmount("");
      setExpenseDescription("");
      setExpenseVendor("");
    },
    onError: () => toast.error("Failed to add expense"),
  });

  const deleteExpenseMutation = trpc.tax.deleteExpense.useMutation({
    onSuccess: () => {
      toast.success("Expense deleted");
      refetchExpenses();
    },
  });

  const addIncomeMutation = trpc.tax.addIncome.useMutation({
    onSuccess: () => {
      toast.success("Income recorded!");
      refetchIncome();
      setIncomeDate("");
      setIncomeAmount("");
      setIncomeDescription("");
      setIncomePayer("");
    },
    onError: () => toast.error("Failed to record income"),
  });

  const deleteIncomeMutation = trpc.tax.deleteIncome.useMutation({
    onSuccess: () => {
      toast.success("Income deleted");
      refetchIncome();
    },
  });

  const handleAddExpense = () => {
    if (!expenseDate || !expenseAmount || !expenseDescription) {
      toast.error("Please fill in date, amount, and description");
      return;
    }
    addExpenseMutation.mutate({
      date: expenseDate,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      description: expenseDescription,
      vendor: expenseVendor || undefined,
    });
  };

  const handleAddIncome = () => {
    if (!incomeDate || !incomeAmount || !incomeDescription) {
      toast.error("Please fill in date, amount, and description");
      return;
    }
    addIncomeMutation.mutate({
      date: incomeDate,
      amount: parseFloat(incomeAmount),
      category: incomeSource,
      description: incomeDescription,
      source: incomePayer || incomeSource,
    });
  };

  const calculateTax = () => {
    const income = parseFloat(grossIncome) || 0;
    const deductions = parseFloat(totalDeductions) || 0;
    const taxableIncome = Math.max(0, income - deductions);
    
    // 2024 tax brackets (simplified)
    let tax = 0;
    if (filingStatus === "single" || filingStatus === "mfs") {
      if (taxableIncome <= 11600) tax = taxableIncome * 0.10;
      else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12;
      else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22;
      else if (taxableIncome <= 191950) tax = 17168.50 + (taxableIncome - 100525) * 0.24;
      else if (taxableIncome <= 243725) tax = 39110.50 + (taxableIncome - 191950) * 0.32;
      else if (taxableIncome <= 609350) tax = 55678.50 + (taxableIncome - 243725) * 0.35;
      else tax = 183647.25 + (taxableIncome - 609350) * 0.37;
    } else {
      // Married filing jointly / Head of household (simplified)
      if (taxableIncome <= 23200) tax = taxableIncome * 0.10;
      else if (taxableIncome <= 94300) tax = 2320 + (taxableIncome - 23200) * 0.12;
      else if (taxableIncome <= 201050) tax = 10852 + (taxableIncome - 94300) * 0.22;
      else if (taxableIncome <= 383900) tax = 34337 + (taxableIncome - 201050) * 0.24;
      else if (taxableIncome <= 487450) tax = 78221 + (taxableIncome - 383900) * 0.32;
      else if (taxableIncome <= 731200) tax = 111357 + (taxableIncome - 487450) * 0.35;
      else tax = 196669.50 + (taxableIncome - 731200) * 0.37;
    }
    
    // Add self-employment tax estimate (15.3% on 92.35% of SE income)
    const seTax = taxableIncome * 0.9235 * 0.153;
    
    setEstimatedTax(tax + seTax);
    toast.success("Tax estimate calculated - consult a CPA for accuracy");
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0) / 100;
  const totalIncome = incomeList.reduce((sum, i) => sum + (i.amount || 0), 0) / 100;

  const taxSuggestions = [
    {
      title: "Home Office Deduction",
      description: "If you use part of your home exclusively for business, you may qualify for the home office deduction.",
      potentialBenefit: "Up to $1,500/year based on simplified method (300 sq ft × $5/sq ft)",
      sources: [
        { name: "IRS Publication 587", url: "https://www.irs.gov/publications/p587", section: "Business Use of Your Home" },
        { name: "IRS Form 8829", url: "https://www.irs.gov/forms-pubs/about-form-8829" },
      ],
      requirements: [
        "Space must be used EXCLUSIVELY for business",
        "Must be your principal place of business",
        "Cannot be used for personal activities",
        "Must maintain records of business use",
      ],
    },
    {
      title: "Vehicle Mileage Deduction",
      description: "Business miles driven may be deductible at the standard mileage rate.",
      potentialBenefit: `$0.67 per business mile (2024 rate)`,
      sources: [
        { name: "IRS Standard Mileage Rates", url: "https://www.irs.gov/tax-professionals/standard-mileage-rates" },
        { name: "IRS Publication 463", url: "https://www.irs.gov/publications/p463", section: "Travel, Gift, and Car Expenses" },
      ],
      requirements: [
        "Must keep detailed mileage log",
        "Only business miles qualify (not commuting)",
        "Must choose between standard mileage or actual expenses",
        "Records must include date, destination, purpose, miles",
      ],
    },
  ];

  if (showDisclaimer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_240)] via-[oklch(0.14_0.03_260)] to-[oklch(0.12_0.02_240)] p-8 flex items-center justify-center">
        <div className="max-w-2xl">
          <LegalDisclaimer
            type="tax"
            feature="Tax Management"
            onAccept={() => setShowDisclaimer(false)}
            showAcceptButton={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_240)] via-[oklch(0.14_0.03_260)] to-[oklch(0.12_0.02_240)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-2">
              Tax Management
            </h1>
            <p className="text-[oklch(0.78_0.08_240)]">
              Track expenses, identify deductions, and prepare for tax season
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-sm text-[oklch(0.78_0.08_240)]">Total Income</p>
              <p className="text-xl font-bold text-green-400">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[oklch(0.78_0.08_240)]">Total Expenses</p>
              <p className="text-xl font-bold text-red-400">${totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="bg-[oklch(0.16_0.02_240)] border border-[oklch(0.78_0.08_240)]/20">
            <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
            <TabsTrigger value="income">Income ({incomeList.length})</TabsTrigger>
            <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
            <TabsTrigger value="suggestions">Deduction Ideas</TabsTrigger>
          </TabsList>

          {/* Expense Tracking Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <CardTitle className="text-[oklch(0.95_0_0)] flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add New Expense
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Date *</Label>
                    <Input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Amount *</Label>
                    <Input type="number" placeholder="0.00" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Category</Label>
                    <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} className="w-full p-2 rounded bg-[oklch(0.12_0.02_240)] border border-[oklch(0.78_0.08_240)]/20 text-white">
                      <option>Office Supplies</option>
                      <option>Travel</option>
                      <option>Meals</option>
                      <option>Utilities</option>
                      <option>Professional Services</option>
                      <option>Software</option>
                      <option>Equipment</option>
                      <option>Marketing</option>
                      <option>Insurance</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[oklch(0.78_0.08_240)]">Description *</Label>
                    <Input placeholder="What was this expense for?" value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Vendor</Label>
                    <Input placeholder="Who did you pay?" value={expenseVendor} onChange={(e) => setExpenseVendor(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                </div>
                <Button onClick={handleAddExpense} disabled={addExpenseMutation.isPending} className="mt-4 w-full">
                  {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
                </Button>
              </CardContent>
            </Card>

            {/* Expense List */}
            <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <CardTitle className="text-[oklch(0.95_0_0)]">Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <p className="text-center text-[oklch(0.78_0.08_240)] py-8">No expenses recorded yet. Add your first expense above.</p>
                ) : (
                  <div className="space-y-2">
                    {expenses.slice(0, 20).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 rounded bg-[oklch(0.12_0.02_240)] border border-[oklch(0.78_0.08_240)]/10">
                        <div className="flex-1">
                          <p className="font-medium text-white">{expense.description}</p>
                          <p className="text-sm text-[oklch(0.78_0.08_240)]">
                            {expense.category} • {expense.vendor || 'No vendor'} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-red-400">${((expense.amount || 0) / 100).toFixed(2)}</span>
                          <Button size="sm" variant="ghost" onClick={() => deleteExpenseMutation.mutate({ id: expense.id })}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income Tracking Tab */}
          <TabsContent value="income" className="space-y-4">
            <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <CardTitle className="text-[oklch(0.95_0_0)] flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Record New Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Date Received *</Label>
                    <Input type="date" value={incomeDate} onChange={(e) => setIncomeDate(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Amount *</Label>
                    <Input type="number" placeholder="0.00" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Source Type</Label>
                    <select value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} className="w-full p-2 rounded bg-[oklch(0.12_0.02_240)] border border-[oklch(0.78_0.08_240)]/20 text-white">
                      <option>Client Payment</option>
                      <option>Product Sales</option>
                      <option>Service Revenue</option>
                      <option>Consulting</option>
                      <option>1099 Income</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[oklch(0.78_0.08_240)]">Description *</Label>
                    <Input placeholder="What was this income for?" value={incomeDescription} onChange={(e) => setIncomeDescription(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Payer Name</Label>
                    <Input placeholder="Who paid you?" value={incomePayer} onChange={(e) => setIncomePayer(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                </div>
                <Button onClick={handleAddIncome} disabled={addIncomeMutation.isPending} className="mt-4 w-full">
                  {addIncomeMutation.isPending ? "Recording..." : "Record Income"}
                </Button>
              </CardContent>
            </Card>

            {/* Income List */}
            <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <CardTitle className="text-[oklch(0.95_0_0)]">Recent Income</CardTitle>
              </CardHeader>
              <CardContent>
                {incomeList.length === 0 ? (
                  <p className="text-center text-[oklch(0.78_0.08_240)] py-8">No income recorded yet. Add your first income above.</p>
                ) : (
                  <div className="space-y-2">
                    {incomeList.slice(0, 20).map((inc) => (
                      <div key={inc.id} className="flex items-center justify-between p-3 rounded bg-[oklch(0.12_0.02_240)] border border-[oklch(0.78_0.08_240)]/10">
                        <div className="flex-1">
                          <p className="font-medium text-white">{inc.description}</p>
                          <p className="text-sm text-[oklch(0.78_0.08_240)]">
                            {inc.category} • {inc.source || 'Unknown'} • {new Date(inc.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-green-400">${((inc.amount || 0) / 100).toFixed(2)}</span>
                          <Button size="sm" variant="ghost" onClick={() => deleteIncomeMutation.mutate({ id: inc.id })}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Calculator Tab */}
          <TabsContent value="calculator" className="space-y-4">
            <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <CardTitle className="text-[oklch(0.95_0_0)]">Self-Employment Tax Estimator</CardTitle>
                <CardDescription className="text-[oklch(0.78_0.08_240)]">
                  Estimate your tax liability (for educational purposes only - consult a CPA)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Filing Status</Label>
                    <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="w-full p-2 rounded bg-[oklch(0.12_0.02_240)] border border-[oklch(0.78_0.08_240)]/20 text-white">
                      <option value="single">Single</option>
                      <option value="mfj">Married Filing Jointly</option>
                      <option value="mfs">Married Filing Separately</option>
                      <option value="hoh">Head of Household</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-[oklch(0.78_0.08_240)]">Gross Income</Label>
                    <Input type="number" placeholder="Annual income" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-[oklch(0.78_0.08_240)]">Total Deductions</Label>
                    <Input type="number" placeholder="Business expenses, deductions" value={totalDeductions} onChange={(e) => setTotalDeductions(e.target.value)} className="bg-[oklch(0.12_0.02_240)] border-[oklch(0.78_0.08_240)]/20" />
                  </div>
                </div>
                <Button onClick={calculateTax} className="mt-4 w-full">Calculate Estimate</Button>
                
                {estimatedTax !== null && (
                  <div className="mt-6 p-4 rounded bg-[oklch(0.12_0.02_240)] border border-yellow-500/30">
                    <p className="text-sm text-[oklch(0.78_0.08_240)]">Estimated Total Tax (Income + SE Tax)</p>
                    <p className="text-3xl font-bold text-yellow-400">${estimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-yellow-500 mt-2">⚠️ This is a rough estimate. Actual taxes depend on many factors. Consult a licensed CPA.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <Card className="bg-[oklch(0.16_0.02_240)] border-[oklch(0.78_0.08_240)]/20">
              <CardHeader>
                <CardTitle className="text-[oklch(0.95_0_0)]">Potential Tax Deductions</CardTitle>
                <CardDescription className="text-[oklch(0.78_0.08_240)]">
                  These deductions MAY apply to your situation. Verify with a tax professional.
                </CardDescription>
              </CardHeader>
            </Card>
            {taxSuggestions.map((suggestion, idx) => (
              <SuggestionCard
                key={idx}
                title={suggestion.title}
                description={suggestion.description}
                potentialBenefit={suggestion.potentialBenefit}
                category="tax"
                sources={suggestion.sources}
                requirements={suggestion.requirements}
                onAccept={() => toast.success(`Noted: ${suggestion.title}`)}
                onReject={() => toast.info(`Dismissed: ${suggestion.title}`)}
                onReviewWithProfessional={() => window.open('https://www.irs.gov/tax-professionals/choosing-a-tax-professional', '_blank')}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
