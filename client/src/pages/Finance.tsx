import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Receipt,
  TrendingUp,
  FileText,
  CreditCard,
  BarChart3,
  Calculator,
  CheckCircle,
  PieChart,
  Wallet
} from "lucide-react";

export default function Finance() {
  const financeStats = [
    { label: "Monthly Revenue", value: "$284K", icon: DollarSign, color: "text-green-500" },
    { label: "Outstanding Invoices", value: "$47K", icon: Receipt, color: "text-blue-500" },
    { label: "Profit Margin", value: "34%", icon: TrendingUp, color: "text-purple-500" },
    { label: "Expenses (MTD)", value: "$112K", icon: Wallet, color: "text-cyan-500" },
  ];

  const capabilities = [
    {
      category: "Invoicing & Billing",
      icon: Receipt,
      features: [
        "Create and send professional invoices instantly",
        "Automate recurring invoices for subscriptions",
        "Accept online payments (credit card, ACH, PayPal)",
        "Track invoice status (sent, viewed, paid, overdue)",
        "Send automatic payment reminders",
        "Apply late fees and payment terms",
        "Support multiple currencies and tax rates",
        "Generate custom invoice templates with branding",
        "Batch invoice creation for multiple clients",
        "Integrate with accounting software (QuickBooks, Xero)"
      ]
    },
    {
      category: "Expense Management",
      icon: CreditCard,
      features: [
        "Track and categorize business expenses",
        "Scan receipts with OCR (optical character recognition)",
        "Submit expense reports for approval",
        "Reimburse employees automatically",
        "Integrate with corporate credit cards",
        "Set spending limits and approval workflows",
        "Track mileage and travel expenses",
        "Manage vendor bills and payments",
        "Identify duplicate or fraudulent expenses",
        "Generate expense reports by category, department, project"
      ]
    },
    {
      category: "Accounting & Bookkeeping",
      icon: Calculator,
      features: [
        "Maintain chart of accounts and general ledger",
        "Record journal entries and adjustments",
        "Reconcile bank and credit card statements",
        "Track accounts payable and receivable",
        "Manage cash flow and working capital",
        "Calculate depreciation and amortization",
        "Handle accruals and deferrals",
        "Support double-entry bookkeeping",
        "Generate trial balance and financial statements",
        "Ensure GAAP compliance"
      ]
    },
    {
      category: "Financial Reporting",
      icon: BarChart3,
      features: [
        "Generate profit & loss (P&L) statements",
        "Create balance sheets and cash flow statements",
        "Track revenue and expenses by category",
        "Analyze profitability by product, service, or client",
        "Monitor key financial ratios (ROI, ROE, debt-to-equity)",
        "Compare actuals vs budget vs forecast",
        "Create custom financial dashboards",
        "Schedule automated report delivery",
        "Export to Excel, PDF, or accounting software",
        "Visualize trends with charts and graphs"
      ]
    },
    {
      category: "Budgeting & Forecasting",
      icon: PieChart,
      features: [
        "Create annual and departmental budgets",
        "Track budget vs actual spending",
        "Set budget alerts and notifications",
        "Forecast revenue based on historical data",
        "Model different financial scenarios (best/worst case)",
        "Plan for seasonal fluctuations",
        "Allocate resources across projects and teams",
        "Track capital expenditures (CapEx)",
        "Manage operating expenses (OpEx)",
        "Generate variance reports and analysis"
      ]
    },
    {
      category: "Tax Management",
      icon: FileText,
      features: [
        "Calculate sales tax by state/country",
        "Track tax-deductible expenses",
        "Generate 1099s for contractors",
        "Prepare W-2s for employees",
        "Estimate quarterly tax payments",
        "Track tax credits and incentives",
        "Manage sales tax nexus and filing",
        "Support international VAT and GST",
        "Generate tax reports for accountants",
        "Integrate with tax preparation software"
      ]
    },
    {
      category: "Payroll Integration",
      icon: DollarSign,
      features: [
        "Sync payroll data with accounting",
        "Track labor costs by project and department",
        "Allocate payroll expenses to correct accounts",
        "Monitor payroll tax liabilities",
        "Generate payroll reports for finance team",
        "Track contractor payments (1099)",
        "Manage employee reimbursements",
        "Calculate fully-loaded labor costs",
        "Forecast payroll expenses",
        "Ensure payroll compliance"
      ]
    },
    {
      category: "Audit & Compliance",
      icon: CheckCircle,
      features: [
        "Maintain audit trail for all transactions",
        "Track who created, edited, or deleted records",
        "Generate compliance reports for regulators",
        "Manage internal controls and SOX compliance",
        "Prepare for external audits",
        "Document accounting policies and procedures",
        "Monitor for unusual transactions or fraud",
        "Ensure data security and encryption",
        "Support multi-entity and consolidation",
        "Maintain historical records and archives"
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
        <source src="/grok-video-f14f30f2-5402-4aaf-9275-fd17eb9a7c44.mp4" type="video/mp4" />
      </video>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.72_0.18_200)] to-[oklch(0.68_0.15_280)] bg-clip-text text-transparent mb-2">
            Finance & Accounting
          </h1>
          <p className="text-[oklch(0.78_0.08_240)]">
            Complete financial management from invoicing to tax compliance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financeStats.map((stat, index) => (
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
                Ready to Master Your Finances?
              </h3>
              <p className="text-white/80 mb-4">
                Kaiden handles everything from invoicing to tax compliance, giving you complete financial control.
              </p>
              <Button size="lg" variant="outline" className="bg-white text-[oklch(0.72_0.18_200)] hover:bg-white/90">
                Start Managing Finances
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
