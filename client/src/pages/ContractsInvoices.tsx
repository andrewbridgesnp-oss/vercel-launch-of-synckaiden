import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { FileText, DollarSign, Plus, Send, Download } from "lucide-react";
import { LegalDisclaimer } from "../components/LegalDisclaimer";

export default function ContractsInvoices() {
  const [activeTab, setActiveTab] = useState<"contracts" | "invoices">("contracts");
  const [workspaceId] = useState(1); // TODO: Get from workspace context

  // Contract state
  const [contractType, setContractType] = useState<"nda" | "service_agreement" | "employment" | "partnership">("nda");
  const [contractParties, setContractParties] = useState("");
  const [contractTerms, setContractTerms] = useState("");

  // Invoice state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([{ description: "", quantity: 1, rate: 0 }]);

  // Queries
  const contracts = trpc.contracts.list.useQuery({ workspaceId });
  const invoices = trpc.invoices.list.useQuery({ workspaceId });
  const nextInvoiceNumber = trpc.invoices.getNextInvoiceNumber.useQuery({ workspaceId });

  // Mutations
  const generateContract = trpc.contracts.generate.useMutation({
    onSuccess: () => {
      contracts.refetch();
      setContractParties("");
      setContractTerms("");
    },
  });

  const createInvoice = trpc.invoices.create.useMutation({
    onSuccess: () => {
      invoices.refetch();
      setClientName("");
      setClientEmail("");
      setInvoiceItems([{ description: "", quantity: 1, rate: 0 }]);
    },
  });

  const handleGenerateContract = () => {
    if (!contractParties.trim() || !contractTerms.trim()) {
      alert("Please fill in all fields");
      return;
    }

    generateContract.mutate({
      workspaceId,
      type: contractType,
      parties: contractParties.split(",").map((p) => ({
        name: p.trim(),
        role: "Party",
      })),
      terms: {
        scope: contractTerms,
      },
    });
  };

  const handleCreateInvoice = () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      alert("Please fill in client information");
      return;
    }

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

    createInvoice.mutate({
      workspaceId,
      clientName,
      clientEmail,
      invoiceNumber: nextInvoiceNumber.data || "INV-0001",
      items: invoiceItems.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),
      subtotal,
      taxRate,
      taxAmount,
      total,
      dueDate: dueDate.toISOString().split("T")[0],
    });
  };

  const addInvoiceItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, rate: 0 }]);
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updated = [...invoiceItems];
    updated[index] = { ...updated[index], [field]: value };
    setInvoiceItems(updated);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Contracts & Invoices</h1>
        <p className="text-muted-foreground">
          Generate AI-powered contracts and professional invoices
        </p>
      </div>

      <LegalDisclaimer
        type="legal"
        feature="Contracts & Invoices"
      />

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b mt-6">
        <Button
          variant={activeTab === "contracts" ? "default" : "ghost"}
          onClick={() => setActiveTab("contracts")}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          Contracts
        </Button>
        <Button
          variant={activeTab === "invoices" ? "default" : "ghost"}
          onClick={() => setActiveTab("invoices")}
          className="gap-2"
        >
          <DollarSign className="w-4 h-4" />
          Invoices
        </Button>
      </div>

      {/* Contracts Tab */}
      {activeTab === "contracts" && (
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Generate New Contract
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contract Type</label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value as any)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="nda">Non-Disclosure Agreement (NDA)</option>
                  <option value="service_agreement">Service Agreement</option>
                  <option value="employment">Employment Contract</option>
                  <option value="partnership">Partnership Agreement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Parties Involved</label>
                <Input
                  placeholder="e.g., Company A and Company B"
                  value={contractParties}
                  onChange={(e) => setContractParties(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Key Terms & Conditions</label>
                <Textarea
                  placeholder="Describe the main terms, obligations, and conditions..."
                  value={contractTerms}
                  onChange={(e) => setContractTerms(e.target.value)}
                  rows={6}
                />
              </div>

              <Button
                onClick={handleGenerateContract}
                disabled={generateContract.isPending}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate Contract with AI
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Contracts</h2>
            <div className="space-y-2">
              {contracts.data?.map((contract) => (
                <div key={contract.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium capitalize">{contract.type.replace("_", " ")}</div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        contract.status === "pending_review"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : contract.status === "approved"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {contract.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {Array.isArray(contract.parties) 
                      ? contract.parties.map((p: any) => p.name).join(", ")
                      : String(contract.parties)}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Created: {new Date(contract.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {contracts.data?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No contracts yet. Generate your first contract above!
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Create New Invoice
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client Name</label>
                  <Input
                    placeholder="Client or Company Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Client Email</label>
                  <Input
                    type="email"
                    placeholder="client@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Invoice Items</label>
                {invoiceItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                      className="col-span-6"
                    />
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(index, "quantity", parseInt(e.target.value) || 0)}
                      className="col-span-2"
                    />
                    <Input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateInvoiceItem(index, "rate", parseFloat(e.target.value) || 0)}
                      className="col-span-3"
                    />
                    <div className="col-span-1 flex items-center font-mono">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </div>
                  </div>
                ))}
                <Button onClick={addInvoiceItem} variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-end space-y-1 text-right">
                  <div className="w-48">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-mono">
                        ${invoiceItems.reduce((sum, item) => sum + item.quantity * item.rate, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax (8%):</span>
                      <span className="font-mono">
                        ${(invoiceItems.reduce((sum, item) => sum + item.quantity * item.rate, 0) * 0.08).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t mt-1 pt-1">
                      <span>Total:</span>
                      <span className="font-mono">
                        ${(invoiceItems.reduce((sum, item) => sum + item.quantity * item.rate, 0) * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateInvoice}
                disabled={createInvoice.isPending}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Create Invoice
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Invoices</h2>
            <div className="space-y-2">
              {invoices.data?.map((invoice) => (
                <div key={invoice.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-muted-foreground">{invoice.clientName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${(invoice.total / 100).toFixed(2)}</div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          invoice.status === "draft"
                            ? "bg-gray-500/10 text-gray-600"
                            : invoice.status === "sent"
                              ? "bg-blue-500/10 text-blue-600"
                              : invoice.status === "paid"
                                ? "bg-green-500/10 text-green-600"
                                : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {String(invoice.status)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {invoices.data?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No invoices yet. Create your first invoice above!
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
