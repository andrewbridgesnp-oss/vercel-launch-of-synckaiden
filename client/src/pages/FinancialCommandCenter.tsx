import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  FileText,
  Calculator,
  Landmark,
  Receipt,
  CreditCard,
  Wallet,
  ArrowRight,
  BarChart3,
  Shield
} from "lucide-react";

export default function FinancialCommandCenter() {
  const [workspaceId] = useState(1);

  // Fetch aggregated financial stats
  const { data: financialStats } = trpc.financialCoPilot.getStats.useQuery({ workspaceId });
  const { data: taxStats } = trpc.taxApp.getStats.useQuery({ workspaceId });
  const { data: invoiceStats } = trpc.invoiceGenerator.getStats.useQuery({ workspaceId });
  const { data: expenseStats } = trpc.expenseTracker.getStats.useQuery({ workspaceId });

  const apps = [
    {
      id: "financial-copilot",
      name: "Financial Co-Pilot",
      description: "AI-powered financial planning and analysis",
      icon: TrendingUp,
      href: "/finance",
      stats: financialStats ? [
        { label: "Total Assets", value: `$${(financialStats.totalAssets || 0).toLocaleString()}` },
        { label: "Monthly Revenue", value: `$${(financialStats.monthlyRevenue || 0).toLocaleString()}` },
        { label: "Profit Margin", value: `${(financialStats.profitMargin || 0).toFixed(1)}%` }
      ] : [],
      color: "bg-emerald-500"
    },
    {
      id: "tax-management",
      name: "Tax Management",
      description: "Comprehensive tax planning and filing",
      icon: Calculator,
      href: "/tax",
      stats: taxStats ? [
        { label: "Tax Year", value: taxStats.currentYear || new Date().getFullYear() },
        { label: "Deductions", value: `$${(taxStats.totalDeductions || 0).toLocaleString()}` },
        { label: "Estimated Tax", value: `$${(taxStats.estimatedTax || 0).toLocaleString()}` }
      ] : [],
      color: "bg-blue-500"
    },
    {
      id: "dynasty-trust",
      name: "Dynasty Trust & Estate Planning",
      description: "Wealth preservation and estate management",
      icon: Shield,
      href: "/dynasty-trust",
      stats: [],
      color: "bg-purple-500"
    },
    {
      id: "invoice-billing",
      name: "Invoice & Billing",
      description: "Create and manage invoices",
      icon: Receipt,
      href: "/contracts",
      stats: invoiceStats ? [
        { label: "Total Invoices", value: invoiceStats.totalInvoices || 0 },
        { label: "Paid", value: `$${(invoiceStats.totalPaid || 0).toLocaleString()}` },
        { label: "Outstanding", value: `$${(invoiceStats.totalOutstanding || 0).toLocaleString()}` }
      ] : [],
      color: "bg-orange-500"
    },
    {
      id: "expense-tracker",
      name: "Expense Tracker",
      description: "Track and categorize business expenses",
      icon: Wallet,
      href: "/expense-tracker",
      stats: expenseStats ? [
        { label: "This Month", value: `$${(expenseStats.monthlyTotal || 0).toLocaleString()}` },
        { label: "Categories", value: expenseStats.categoryCount || 0 },
        { label: "Avg/Day", value: `$${(expenseStats.dailyAverage || 0).toFixed(2)}` }
      ] : [],
      color: "bg-red-500"
    },
    {
      id: "business-credit",
      name: "Business Credit Builder",
      description: "Build and monitor business credit",
      icon: CreditCard,
      href: "/business-credit",
      stats: [],
      color: "bg-cyan-500"
    },
    {
      id: "ai-funding",
      name: "AI Funding Brokerage",
      description: "Find and apply for business funding",
      icon: Landmark,
      href: "/apps/ai-funding-brokerage",
      stats: [],
      color: "bg-indigo-500"
    }
  ];

  // Calculate platform-wide financial metrics
  const totalAssets = financialStats?.totalAssets || 0;
  const monthlyRevenue = financialStats?.monthlyRevenue || 0;
  const totalExpenses = expenseStats?.monthlyTotal || 0;
  const netIncome = monthlyRevenue - totalExpenses;
  const outstandingInvoices = invoiceStats?.totalOutstanding || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Financial Command Center
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete financial management and planning platform
          </p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAssets.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Revenue - Expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${outstandingInvoices.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Unpaid invoices</p>
            </CardContent>
          </Card>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <Link key={app.id} href={app.href}>
                <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${app.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                        <Icon className={`h-6 w-6 ${app.color.replace('bg-', 'text-')}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="mt-4">{app.name}</CardTitle>
                    <CardDescription>{app.description}</CardDescription>
                  </CardHeader>
                  {app.stats.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        {app.stats.map((stat, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{stat.label}</span>
                            <span className="font-semibold">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common financial tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/contracts">
                  <Button variant="outline" className="w-full">
                    <Receipt className="mr-2 h-4 w-4" />
                    New Invoice
                  </Button>
                </Link>
                <Link href="/expense-tracker">
                  <Button variant="outline" className="w-full">
                    <Wallet className="mr-2 h-4 w-4" />
                    Log Expense
                  </Button>
                </Link>
                <Link href="/tax">
                  <Button variant="outline" className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Tax Planning
                  </Button>
                </Link>
                <Link href="/finance">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
