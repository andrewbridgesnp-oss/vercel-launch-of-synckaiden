import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { FeatureGate } from "@/components/FeatureGate";
import {
  CreditCard,
  Search,
  FileText,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Clock,
  Building2,
  Stethoscope,
  ClipboardList,
  Send,
  Loader2,
  Copy,
  Download,
  Star,
  StarOff,
  Heart,
  Trash2,
  Edit3,
  Plus
} from "lucide-react";
import { toast } from "sonner";

// Common CPT codes for telehealth
const TELEHEALTH_CPT_CODES = [
  { code: "99201", description: "Office/outpatient visit, new patient, straightforward", rvu: "0.93", avgReimb: "$45" },
  { code: "99202", description: "Office/outpatient visit, new patient, low complexity", rvu: "1.60", avgReimb: "$75" },
  { code: "99203", description: "Office/outpatient visit, new patient, moderate complexity", rvu: "2.60", avgReimb: "$115" },
  { code: "99204", description: "Office/outpatient visit, new patient, moderate-high complexity", rvu: "3.80", avgReimb: "$165" },
  { code: "99205", description: "Office/outpatient visit, new patient, high complexity", rvu: "5.00", avgReimb: "$210" },
  { code: "99211", description: "Office/outpatient visit, established patient, minimal", rvu: "0.18", avgReimb: "$25" },
  { code: "99212", description: "Office/outpatient visit, established patient, straightforward", rvu: "0.93", avgReimb: "$45" },
  { code: "99213", description: "Office/outpatient visit, established patient, low complexity", rvu: "1.60", avgReimb: "$75" },
  { code: "99214", description: "Office/outpatient visit, established patient, moderate complexity", rvu: "2.60", avgReimb: "$115" },
  { code: "99215", description: "Office/outpatient visit, established patient, high complexity", rvu: "3.80", avgReimb: "$165" },
];

// Telehealth modifiers
const TELEHEALTH_MODIFIERS = [
  { code: "95", description: "Synchronous telemedicine service via real-time interactive audio/video" },
  { code: "GT", description: "Via interactive audio and video telecommunications systems" },
  { code: "GQ", description: "Via asynchronous telecommunications system" },
  { code: "FQ", description: "Service furnished using audio-only communication technology" },
];

// Place of Service codes
const POS_CODES = [
  { code: "02", description: "Telehealth Provided Other than in Patient's Home" },
  { code: "10", description: "Telehealth Provided in Patient's Home" },
  { code: "11", description: "Office" },
];

// Common ICD-10 codes
const COMMON_ICD10 = [
  { code: "J06.9", description: "Acute upper respiratory infection, unspecified" },
  { code: "J02.9", description: "Acute pharyngitis, unspecified" },
  { code: "N39.0", description: "Urinary tract infection, site not specified" },
  { code: "F41.1", description: "Generalized anxiety disorder" },
  { code: "F32.9", description: "Major depressive disorder, single episode, unspecified" },
  { code: "I10", description: "Essential (primary) hypertension" },
  { code: "E11.9", description: "Type 2 diabetes mellitus without complications" },
  { code: "M54.5", description: "Low back pain" },
  { code: "R51", description: "Headache" },
  { code: "K21.0", description: "Gastro-esophageal reflux disease with esophagitis" },
];

export default function MedicalBilling() {
  return (
    <FeatureGate feature="medical_billing">
      <MedicalBillingContent />
    </FeatureGate>
  );
}

function MedicalBillingContent() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("cpt-lookup");
  const [searchTerm, setSearchTerm] = useState("");
  const [icd10Search, setIcd10Search] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const [suggestedCodes, setSuggestedCodes] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingNotes, setEditingNotes] = useState<{ id: number; notes: string } | null>(null);
  const [addCodeDialog, setAddCodeDialog] = useState<{ open: boolean; code: string; description: string; type: 'cpt' | 'icd10' } | null>(null);

  // Claim calculator state
  const [cptCode, setCptCode] = useState("");
  const [modifier, setModifier] = useState("");
  const [posCode, setPosCode] = useState("10");
  const [units, setUnits] = useState("1");

  const chatMutation = trpc.chat.sendMessage.useMutation();
  
  // Favorites queries and mutations
  const { data: savedCodes, refetch: refetchSavedCodes } = trpc.medicalCodes.list.useQuery(undefined, {
    enabled: !!user,
  });
  
  const addCodeMutation = trpc.medicalCodes.add.useMutation({
    onSuccess: () => {
      toast.success("Code added to favorites!");
      refetchSavedCodes();
      setAddCodeDialog(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add code");
    },
  });

  const updateNotesMutation = trpc.medicalCodes.updateNotes.useMutation({
    onSuccess: () => {
      toast.success("Notes updated!");
      refetchSavedCodes();
      setEditingNotes(null);
    },
    onError: () => {
      toast.error("Failed to update notes");
    },
  });

  const deleteCodeMutation = trpc.medicalCodes.delete.useMutation({
    onSuccess: () => {
      toast.success("Code removed from favorites");
      refetchSavedCodes();
    },
    onError: () => {
      toast.error("Failed to remove code");
    },
  });

  const incrementUsageMutation = trpc.medicalCodes.incrementUsage.useMutation();

  const filteredCPT = TELEHEALTH_CPT_CODES.filter(
    code => code.code.includes(searchTerm) || code.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredICD10 = COMMON_ICD10.filter(
    code => code.code.toLowerCase().includes(icd10Search.toLowerCase()) || 
            code.description.toLowerCase().includes(icd10Search.toLowerCase())
  );

  const savedCPTCodes = savedCodes?.filter(c => c.codeType === 'cpt') || [];
  const savedICD10Codes = savedCodes?.filter(c => c.codeType === 'icd10') || [];

  const isCodeSaved = (code: string, type: 'cpt' | 'icd10') => {
    return savedCodes?.some(c => c.code === code && c.codeType === type);
  };

  const generateCodingSuggestion = async () => {
    if (!visitNotes.trim()) {
      toast.error("Please enter visit notes first");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await chatMutation.mutateAsync({
        conversationId: Date.now(),
        content: `You are a certified medical coder. Based on the following visit notes, suggest appropriate CPT and ICD-10 codes. Be specific and explain your reasoning. Format your response clearly with:
1. Recommended CPT code(s) with justification
2. Recommended ICD-10 code(s) with justification
3. Any modifiers needed
4. Documentation tips to support the codes

Visit Notes:
${visitNotes}

Important: This is for educational purposes only. Always verify codes with current CMS guidelines and payer requirements.`,
      });
      setSuggestedCodes(result.assistantMessage.content);
    } catch (error) {
      toast.error("Failed to generate coding suggestions");
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateEstimate = () => {
    const selectedCode = TELEHEALTH_CPT_CODES.find(c => c.code === cptCode);
    if (!selectedCode) return null;

    const baseAmount = parseFloat(selectedCode.avgReimb.replace('$', ''));
    const unitCount = parseInt(units) || 1;
    return (baseAmount * unitCount).toFixed(2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleAddToFavorites = (code: string, description: string, type: 'cpt' | 'icd10') => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }
    setAddCodeDialog({ open: true, code, description, type });
  };

  const handleSaveCode = (notes?: string) => {
    if (!addCodeDialog) return;
    addCodeMutation.mutate({
      codeType: addCodeDialog.type,
      code: addCodeDialog.code,
      description: addCodeDialog.description,
      notes: notes || undefined,
    });
  };

  const handleUseCode = (savedCode: typeof savedCodes extends (infer T)[] | undefined ? T : never) => {
    if (!savedCode) return;
    copyToClipboard(savedCode.code);
    incrementUsageMutation.mutate({ id: savedCode.id });
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <CreditCard className="w-3 h-3 mr-1" />
            Educational Tool
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-shimmer">
            Medical Billing & Coding Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered coding suggestions, CPT/ICD-10 lookup, and reimbursement calculator 
            for telehealth providers. Educational tool - always verify with certified coders.
          </p>
        </div>

        {/* Disclaimer */}
        <Card className="mb-8 border-amber-500/50 bg-amber-500/10">
          <CardContent className="flex items-start gap-4 py-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-400">Important Legal Disclaimer</h3>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>This tool is for EDUCATIONAL and REFERENCE purposes ONLY.</strong> It does NOT constitute 
                medical coding advice, billing guidance, or professional consultation. This tool does NOT:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside mb-2 space-y-1">
                <li>Replace certified medical coders (CPC, CCS, RHIT, RHIA)</li>
                <li>Guarantee reimbursement or claim approval</li>
                <li>Provide payer-specific billing guidance</li>
                <li>Constitute compliance advice for HIPAA, CMS, or OIG regulations</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>ALWAYS</strong> verify codes with current CMS guidelines, payer-specific LCD/NCD policies, 
                and consult with certified medical coders and compliance officers before submitting claims. 
                Incorrect coding may result in claim denials, audits, or allegations of fraud.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2 bg-card/50 backdrop-blur mb-8">
            <TabsTrigger value="cpt-lookup" className="py-3">
              <Search className="w-4 h-4 mr-2" />
              CPT Lookup
            </TabsTrigger>
            <TabsTrigger value="icd10-lookup" className="py-3">
              <ClipboardList className="w-4 h-4 mr-2" />
              ICD-10 Lookup
            </TabsTrigger>
            <TabsTrigger value="favorites" className="py-3">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
              {savedCodes && savedCodes.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{savedCodes.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ai-coder" className="py-3">
              <Stethoscope className="w-4 h-4 mr-2" />
              AI Coder
            </TabsTrigger>
            <TabsTrigger value="calculator" className="py-3">
              <Calculator className="w-4 h-4 mr-2" />
              Calculator
            </TabsTrigger>
          </TabsList>

          {/* CPT Lookup Tab */}
          <TabsContent value="cpt-lookup">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Telehealth CPT Code Reference</CardTitle>
                <CardDescription>
                  Common E/M codes for telehealth visits with RVU values and average reimbursement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by code or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-semibold">CPT Code</th>
                        <th className="text-left py-3 px-4 font-semibold">Description</th>
                        <th className="text-center py-3 px-4 font-semibold">RVU</th>
                        <th className="text-right py-3 px-4 font-semibold">Avg. Reimb.</th>
                        <th className="text-center py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCPT.map((code) => (
                        <tr key={code.code} className="border-b border-border/30 hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="font-mono">{code.code}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">{code.description}</td>
                          <td className="py-3 px-4 text-center text-sm">{code.rvu}</td>
                          <td className="py-3 px-4 text-right font-semibold text-green-400">{code.avgReimb}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyToClipboard(code.code)}
                                title="Copy code"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              {user && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddToFavorites(code.code, code.description, 'cpt')}
                                  disabled={isCodeSaved(code.code, 'cpt')}
                                  title={isCodeSaved(code.code, 'cpt') ? "Already saved" : "Add to favorites"}
                                >
                                  {isCodeSaved(code.code, 'cpt') ? (
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  ) : (
                                    <StarOff className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Telehealth Modifiers */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Telehealth Modifiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TELEHEALTH_MODIFIERS.map((mod) => (
                      <div key={mod.code} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-mono">
                            {mod.code}
                          </Badge>
                          <span className="text-sm">{mod.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place of Service */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Place of Service Codes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {POS_CODES.map((pos) => (
                      <div key={pos.code} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono">
                            POS {pos.code}
                          </Badge>
                          <span className="text-sm">{pos.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ICD-10 Lookup Tab */}
          <TabsContent value="icd10-lookup">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>ICD-10 Code Reference</CardTitle>
                <CardDescription>
                  Common diagnosis codes for telehealth encounters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by code or diagnosis..."
                      value={icd10Search}
                      onChange={(e) => setIcd10Search(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredICD10.map((code) => (
                    <Card key={code.code} className="bg-muted/20 border-border/30">
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-mono">
                            {code.code}
                          </Badge>
                          <span className="text-sm">{code.description}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(code.code)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          {user && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddToFavorites(code.code, code.description, 'icd10')}
                              disabled={isCodeSaved(code.code, 'icd10')}
                            >
                              {isCodeSaved(code.code, 'icd10') ? (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <h3 className="font-semibold text-blue-400 mb-2">Pro Tip: ICD-10 Coding</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Always code to the highest level of specificity supported by documentation</li>
                    <li>• List the primary diagnosis first, followed by secondary diagnoses</li>
                    <li>• Use combination codes when available instead of multiple codes</li>
                    <li>• Avoid using unspecified codes when more specific codes exist</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  My Favorite Codes
                </CardTitle>
                <CardDescription>
                  Quick access to your frequently used CPT and ICD-10 codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">Sign in to save and manage your favorite codes</p>
                    <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                      Sign In
                    </Button>
                  </div>
                ) : savedCodes && savedCodes.length === 0 ? (
                  <div className="text-center py-12">
                    <StarOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">No saved codes yet</p>
                    <p className="text-sm text-muted-foreground">
                      Browse the CPT or ICD-10 tabs and click the star icon to save codes
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* CPT Favorites */}
                    {savedCPTCodes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">CPT</Badge>
                          Procedure Codes ({savedCPTCodes.length})
                        </h3>
                        <div className="space-y-3">
                          {savedCPTCodes.map((code) => (
                            <div key={code.id} className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge variant="outline" className="font-mono text-lg">{code.code}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Used {code.usageCount} times
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{code.description}</p>
                                  {code.notes && (
                                    <p className="text-xs text-blue-400 mt-2 italic">📝 {code.notes}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUseCode(code)}
                                    title="Copy & track usage"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingNotes({ id: code.id, notes: code.notes || '' })}
                                    title="Edit notes"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteCodeMutation.mutate({ id: code.id })}
                                    className="text-red-400 hover:text-red-300"
                                    title="Remove from favorites"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ICD-10 Favorites */}
                    {savedICD10Codes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">ICD-10</Badge>
                          Diagnosis Codes ({savedICD10Codes.length})
                        </h3>
                        <div className="space-y-3">
                          {savedICD10Codes.map((code) => (
                            <div key={code.id} className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-mono text-lg">{code.code}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Used {code.usageCount} times
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{code.description}</p>
                                  {code.notes && (
                                    <p className="text-xs text-blue-400 mt-2 italic">📝 {code.notes}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUseCode(code)}
                                    title="Copy & track usage"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingNotes({ id: code.id, notes: code.notes || '' })}
                                    title="Edit notes"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteCodeMutation.mutate({ id: code.id })}
                                    className="text-red-400 hover:text-red-300"
                                    title="Remove from favorites"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Coder Tab */}
          <TabsContent value="ai-coder">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>AI Coding Assistant</CardTitle>
                  <CardDescription>
                    Paste your visit notes and get AI-suggested CPT and ICD-10 codes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste your visit notes here... Include chief complaint, HPI, exam findings, assessment, and plan."
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    className="min-h-[300px] bg-background/50"
                  />
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    onClick={generateCodingSuggestion}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Notes...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Generate Coding Suggestions
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Suggested Codes</CardTitle>
                  <CardDescription>
                    AI-generated coding recommendations based on your notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {suggestedCodes ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-sm">{suggestedCodes}</div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter visit notes and click "Generate" to get coding suggestions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <div className="max-w-2xl mx-auto">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Reimbursement Estimator</CardTitle>
                  <CardDescription>
                    Estimate expected reimbursement for telehealth services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">CPT Code</label>
                      <Select value={cptCode} onValueChange={setCptCode}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select CPT code" />
                        </SelectTrigger>
                        <SelectContent>
                          {TELEHEALTH_CPT_CODES.map((code) => (
                            <SelectItem key={code.code} value={code.code}>
                              {code.code} - {code.description.substring(0, 40)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Modifier</label>
                      <Select value={modifier} onValueChange={setModifier}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select modifier" />
                        </SelectTrigger>
                        <SelectContent>
                          {TELEHEALTH_MODIFIERS.map((mod) => (
                            <SelectItem key={mod.code} value={mod.code}>
                              {mod.code} - {mod.description.substring(0, 40)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Place of Service</label>
                      <Select value={posCode} onValueChange={setPosCode}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select POS" />
                        </SelectTrigger>
                        <SelectContent>
                          {POS_CODES.map((pos) => (
                            <SelectItem key={pos.code} value={pos.code}>
                              {pos.code} - {pos.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Units</label>
                      <Input
                        type="number"
                        value={units}
                        onChange={(e) => setUnits(e.target.value)}
                        min="1"
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  {cptCode && (
                    <div className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Estimated Reimbursement</p>
                        <p className="text-4xl font-bold text-green-400">
                          ${calculateEstimate()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Based on 2024 Medicare Physician Fee Schedule
                        </p>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">CPT Code</p>
                          <p className="font-mono font-semibold">{cptCode}{modifier ? `-${modifier}` : ''}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">POS</p>
                          <p className="font-mono font-semibold">{posCode}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Units</p>
                          <p className="font-mono font-semibold">{units}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Important Notes
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Estimates based on 2024 Medicare Physician Fee Schedule</li>
                      <li>• Commercial payer rates typically 110-150% of Medicare</li>
                      <li>• Geographic adjustments (GPCI) not included</li>
                      <li>• Always verify with actual payer fee schedules</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Code Dialog */}
      <Dialog open={!!addCodeDialog?.open} onOpenChange={(open) => !open && setAddCodeDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Favorites</DialogTitle>
            <DialogDescription>
              Save this code for quick access
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-lg">{addCodeDialog?.code}</Badge>
              <Badge className={addCodeDialog?.type === 'cpt' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}>
                {addCodeDialog?.type?.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{addCodeDialog?.description}</p>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
              <Textarea
                placeholder="Add personal notes about this code..."
                className="bg-background/50"
                id="code-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCodeDialog(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleSaveCode((document.getElementById('code-notes') as HTMLTextAreaElement)?.value)}
              disabled={addCodeMutation.isPending}
            >
              {addCodeMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Star className="w-4 h-4 mr-2" />
              )}
              Save to Favorites
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notes Dialog */}
      <Dialog open={!!editingNotes} onOpenChange={(open) => !open && setEditingNotes(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>
              Update your personal notes for this code
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editingNotes?.notes || ''}
              onChange={(e) => setEditingNotes(prev => prev ? { ...prev, notes: e.target.value } : null)}
              placeholder="Add personal notes about this code..."
              className="bg-background/50"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNotes(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => editingNotes && updateNotesMutation.mutate({ id: editingNotes.id, notes: editingNotes.notes })}
              disabled={updateNotesMutation.isPending}
            >
              {updateNotesMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
