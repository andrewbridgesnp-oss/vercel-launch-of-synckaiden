import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building2, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, 
  Download, ExternalLink, Search, FileText, Scale, Copy, Printer
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// State Secretary of State websites for name search
const STATE_SOS_LINKS: Record<string, { search: string; file: string; fee: number }> = {
  "Alabama": { search: "https://arc-sos.state.al.us/cgi/corpname.mbr/output", file: "https://www.sos.alabama.gov/business-entities", fee: 200 },
  "Alaska": { search: "https://www.commerce.alaska.gov/cbp/main/search/entities", file: "https://www.commerce.alaska.gov/web/cbpl/corporations", fee: 250 },
  "Arizona": { search: "https://ecorp.azcc.gov/EntitySearch/Index", file: "https://azcc.gov/corporations", fee: 50 },
  "Arkansas": { search: "https://www.sos.arkansas.gov/corps/search_all.php", file: "https://www.sos.arkansas.gov/business-commercial-services-bcs", fee: 50 },
  "California": { search: "https://bizfileonline.sos.ca.gov/search/business", file: "https://www.sos.ca.gov/business-programs/business-entities/forms", fee: 70 },
  "Colorado": { search: "https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do", file: "https://www.sos.state.co.us/pubs/business/main.html", fee: 50 },
  "Connecticut": { search: "https://service.ct.gov/business/s/onlinebusinesssearch", file: "https://portal.ct.gov/SOTS/Business-Services", fee: 120 },
  "Delaware": { search: "https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx", file: "https://corp.delaware.gov/howtoform/", fee: 90 },
  "Florida": { search: "https://search.sunbiz.org/Inquiry/CorporationSearch/ByName", file: "https://dos.myflorida.com/sunbiz/start-business/efile/fl-llc/", fee: 125 },
  "Georgia": { search: "https://ecorp.sos.ga.gov/BusinessSearch", file: "https://sos.ga.gov/corporations-division", fee: 100 },
  "Hawaii": { search: "https://hbe.ehawaii.gov/documents/search.html", file: "https://cca.hawaii.gov/breg/", fee: 50 },
  "Idaho": { search: "https://sosbiz.idaho.gov/search/business", file: "https://sos.idaho.gov/business-services/", fee: 100 },
  "Illinois": { search: "https://apps.ilsos.gov/corporatellc/", file: "https://www.ilsos.gov/departments/business_services/llc.html", fee: 150 },
  "Indiana": { search: "https://bsd.sos.in.gov/publicbusinesssearch", file: "https://www.in.gov/sos/business/start-a-business/", fee: 95 },
  "Iowa": { search: "https://sos.iowa.gov/search/business/search.aspx", file: "https://sos.iowa.gov/business/FormsAndFees.html", fee: 50 },
  "Kansas": { search: "https://www.kansas.gov/bess/flow/main?execution=e1s1", file: "https://sos.ks.gov/business/business.html", fee: 165 },
  "Kentucky": { search: "https://web.sos.ky.gov/ftshow/(S(...))/default.aspx", file: "https://www.sos.ky.gov/bus/business-filings/Pages/default.aspx", fee: 40 },
  "Louisiana": { search: "https://coraweb.sos.la.gov/commercialsearch/commercialsearch.aspx", file: "https://www.sos.la.gov/BusinessServices/Pages/default.aspx", fee: 100 },
  "Maine": { search: "https://icrs.informe.org/nei-sos-icrs/ICRS", file: "https://www.maine.gov/sos/cec/corp/", fee: 175 },
  "Maryland": { search: "https://egov.maryland.gov/BusinessExpress/EntitySearch", file: "https://dat.maryland.gov/businesses", fee: 100 },
  "Massachusetts": { search: "https://corp.sec.state.ma.us/corpweb/CorpSearch/CorpSearch.aspx", file: "https://www.sec.state.ma.us/cor/coridx.htm", fee: 500 },
  "Michigan": { search: "https://cofs.lara.state.mi.us/corpweb/CorpSearch/CorpSearch.aspx", file: "https://www.michigan.gov/lara/bureau-list/cscl/corps", fee: 50 },
  "Minnesota": { search: "https://mblsportal.sos.state.mn.us/Business/Search", file: "https://www.sos.state.mn.us/business-liens/start-a-business/", fee: 155 },
  "Mississippi": { search: "https://corp.sos.ms.gov/corp/portal/c/page/corpBusinessIdSearch/portal.aspx", file: "https://www.sos.ms.gov/business-services", fee: 50 },
  "Missouri": { search: "https://bsd.sos.mo.gov/BusinessEntity/BESearch.aspx", file: "https://www.sos.mo.gov/business", fee: 50 },
  "Montana": { search: "https://biz.sosmt.gov/search", file: "https://sosmt.gov/business/", fee: 70 },
  "Nebraska": { search: "https://www.nebraska.gov/sos/corp/corpsearch.cgi", file: "https://sos.nebraska.gov/business-services", fee: 105 },
  "Nevada": { search: "https://esos.nv.gov/EntitySearch/OnlineEntitySearch", file: "https://www.nvsos.gov/sos/businesses", fee: 425 },
  "New Hampshire": { search: "https://quickstart.sos.nh.gov/online/BusinessInquire", file: "https://www.sos.nh.gov/corporation-division", fee: 100 },
  "New Jersey": { search: "https://www.njportal.com/DOR/BusinessNameSearch/", file: "https://www.nj.gov/treasury/revenue/dcr/geninfo/nj_llc.shtml", fee: 125 },
  "New Mexico": { search: "https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch", file: "https://www.sos.state.nm.us/business-services/", fee: 50 },
  "New York": { search: "https://apps.dos.ny.gov/publicInquiry/", file: "https://dos.ny.gov/forming-limited-liability-company-llc", fee: 200 },
  "North Carolina": { search: "https://www.sosnc.gov/online_services/search/by_title/_Business_Registration", file: "https://www.sosnc.gov/divisions/business_registration", fee: 125 },
  "North Dakota": { search: "https://firststop.sos.nd.gov/search/business", file: "https://sos.nd.gov/business/business-services", fee: 135 },
  "Ohio": { search: "https://businesssearch.ohiosos.gov/", file: "https://www.ohiosos.gov/businesses/", fee: 99 },
  "Oklahoma": { search: "https://www.sos.ok.gov/corp/corpInquiryFind.aspx", file: "https://www.sos.ok.gov/business/", fee: 100 },
  "Oregon": { search: "https://egov.sos.state.or.us/br/pkg_web_name_srch_inq.login", file: "https://sos.oregon.gov/business/Pages/register.aspx", fee: 100 },
  "Pennsylvania": { search: "https://www.corporations.pa.gov/search/corpsearch", file: "https://www.dos.pa.gov/BusinessCharities/Business/Pages/default.aspx", fee: 125 },
  "Rhode Island": { search: "https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx", file: "https://www.sos.ri.gov/divisions/business-services", fee: 150 },
  "South Carolina": { search: "https://businessfilings.sc.gov/BusinessFiling/Entity/Search", file: "https://sos.sc.gov/online-filings", fee: 110 },
  "South Dakota": { search: "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx", file: "https://sdsos.gov/business-services/", fee: 150 },
  "Tennessee": { search: "https://tnbear.tn.gov/Ecommerce/FilingSearch.aspx", file: "https://sos.tn.gov/business-services", fee: 300 },
  "Texas": { search: "https://mycpa.cpa.state.tx.us/coa/", file: "https://www.sos.texas.gov/corp/forms_702.shtml", fee: 300 },
  "Utah": { search: "https://secure.utah.gov/bes/", file: "https://corporations.utah.gov/", fee: 54 },
  "Vermont": { search: "https://bizfilings.vermont.gov/online/BusinessInquire", file: "https://sos.vermont.gov/corporations/", fee: 125 },
  "Virginia": { search: "https://cis.scc.virginia.gov/", file: "https://www.scc.virginia.gov/pages/Virginia-Limited-Liability-Company", fee: 100 },
  "Washington": { search: "https://ccfs.sos.wa.gov/#/BusinessSearch", file: "https://www.sos.wa.gov/corps/", fee: 200 },
  "West Virginia": { search: "https://apps.wv.gov/SOS/BusinessEntitySearch/", file: "https://sos.wv.gov/business/Pages/default.aspx", fee: 100 },
  "Wisconsin": { search: "https://www.wdfi.org/apps/CorpSearch/Search.aspx", file: "https://www.wdfi.org/corporations/", fee: 130 },
  "Wyoming": { search: "https://wyobiz.wyo.gov/Business/FilingSearch.aspx", file: "https://sos.wyo.gov/Business/", fee: 100 },
};

const US_STATES = Object.keys(STATE_SOS_LINKS);

export default function LLCFormation() {
  const [step, setStep] = useState(1);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [generatedDocs, setGeneratedDocs] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    businessName: "",
    state: "",
    // Step 2 - Business Details
    businessPurpose: "",
    businessType: "",
    // Step 3 - Members
    members: [] as { name: string; address: string; ownership: string }[],
    managementType: "member-managed",
    // Step 4 - Registered Agent
    agentType: "self",
    agentName: "",
    agentAddress: "",
    agentCity: "",
    agentState: "",
    agentZip: "",
    // Step 5 - Principal Office
    principalAddress: "",
    principalCity: "",
    principalState: "",
    principalZip: "",
    // Step 6 - Additional
    effectiveDate: "immediate",
    duration: "perpetual",
    organizer: "",
  });

  const chatMutation = trpc.chat.sendMessage.useMutation();
  const generateArticlesPDF = trpc.pdf.generateLLCDocument.useMutation();

  const handleNameSearch = () => {
    if (!formData.state || !formData.businessName) {
      toast.error("Enter business name and select state first");
      return;
    }
    const stateInfo = STATE_SOS_LINKS[formData.state];
    if (stateInfo) {
      window.open(stateInfo.search, "_blank");
      toast.info("Name Search Opened", {
        description: "Check if your business name is available in the state database",
      });
    }
  };

  const handleAddMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: "", address: "", ownership: "" }],
    });
  };

  const handleRemoveMember = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index),
    });
  };

  const handleUpdateMember = (index: number, field: string, value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData({ ...formData, members: newMembers });
  };

  const generateArticlesOfOrganization = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a complete Articles of Organization document for an LLC with the following details:

Business Name: ${formData.businessName}
State of Formation: ${formData.state}
Business Purpose: ${formData.businessPurpose || "Any lawful business purpose"}
Management Type: ${formData.managementType}
Duration: ${formData.duration}
Effective Date: ${formData.effectiveDate}

Registered Agent:
Name: ${formData.agentType === "self" ? formData.members[0]?.name || formData.organizer : formData.agentName}
Address: ${formData.agentType === "self" ? formData.principalAddress : formData.agentAddress}
City: ${formData.agentType === "self" ? formData.principalCity : formData.agentCity}
State: ${formData.agentType === "self" ? formData.principalState : formData.agentState}
ZIP: ${formData.agentType === "self" ? formData.principalZip : formData.agentZip}

Principal Office:
${formData.principalAddress}
${formData.principalCity}, ${formData.principalState} ${formData.principalZip}

Members/Organizers:
${formData.members.map((m, i) => `${i + 1}. ${m.name} - ${m.ownership}% ownership - ${m.address}`).join("\n")}

Organizer: ${formData.organizer}

Format this as a professional legal document with proper sections, numbered articles, and signature blocks. Include all required elements for ${formData.state} LLC formation. Add a disclaimer that this is for educational purposes and should be reviewed by an attorney.`;

      const response = await chatMutation.mutateAsync({
        conversationId: 1,
        content: prompt,
      });

      setGeneratedDocs({
        articlesOfOrganization: response.assistantMessage.content,
        state: formData.state,
        businessName: formData.businessName,
      });
      
      toast.success("Documents Generated!", {
        description: "Your Articles of Organization have been drafted",
      });
    } catch (error) {
      toast.error("Generation failed", {
        description: "Please try again or contact support",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateOperatingAgreement = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a comprehensive Operating Agreement for ${formData.businessName}, a ${formData.state} LLC with the following structure:

Management Type: ${formData.managementType}
Members:
${formData.members.map((m, i) => `${i + 1}. ${m.name} - ${m.ownership}% ownership interest`).join("\n")}

Include these sections:
1. Formation and Name
2. Purpose
3. Principal Place of Business
4. Term/Duration
5. Capital Contributions
6. Allocations of Profits and Losses
7. Distributions
8. Management and Voting
9. Meetings
10. Transfer of Membership Interests
11. Dissolution
12. Miscellaneous Provisions
13. Signature Blocks

Make it comprehensive but readable. Add a disclaimer that this is for educational purposes and should be reviewed by an attorney before use.`;

      const response = await chatMutation.mutateAsync({
        conversationId: 1,
        content: prompt,
      });

      setGeneratedDocs((prev: any) => ({
        ...prev,
        operatingAgreement: response.assistantMessage.content,
      }));
      
      toast.success("Operating Agreement Generated!", {
        description: "Your Operating Agreement has been drafted",
      });
    } catch (error) {
      toast.error("Generation failed", {
        description: "Please try again",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, docName: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${docName} copied to clipboard`);
  };

  const stateInfo = formData.state ? STATE_SOS_LINKS[formData.state] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/business-tools">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              LLC Formation Wizard
            </h1>
            <p className="text-muted-foreground">Complete guide to forming your Limited Liability Company</p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-amber-600">Educational Tool - Not Legal Advice</p>
                <p className="text-muted-foreground">
                  This tool provides general information and document templates for educational purposes only. 
                  LLC requirements vary by state. Always consult a licensed attorney before filing. 
                  Kaiden AI is not a law firm and does not provide legal advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {["Basic Info", "Business Details", "Members", "Registered Agent", "Principal Office", "Review & Generate"].map((label, i) => (
            <div key={i} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium cursor-pointer transition-all ${
                  step > i + 1 ? "bg-green-500 text-white" : 
                  step === i + 1 ? "bg-primary text-primary-foreground" : 
                  "bg-muted text-muted-foreground"
                }`}
                onClick={() => step > i + 1 && setStep(i + 1)}
              >
                {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm whitespace-nowrap ${step === i + 1 ? "font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i < 5 && <div className={`w-8 h-0.5 mx-2 ${step > i + 1 ? "bg-green-500" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Step 1: Basic Information</h2>
                      <div className="space-y-4">
                        <div>
                          <Label>State of Formation *</Label>
                          <Select value={formData.state} onValueChange={(v) => setFormData({...formData, state: v})}>
                            <SelectTrigger><SelectValue placeholder="Select your state" /></SelectTrigger>
                            <SelectContent>
                              {US_STATES.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Popular choices: Delaware (privacy), Wyoming (low fees), Nevada (no state tax)
                          </p>
                        </div>

                        <div>
                          <Label>Proposed Business Name *</Label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="e.g., Acme Solutions LLC"
                              value={formData.businessName}
                              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                              className="flex-1"
                            />
                            <Button variant="outline" onClick={handleNameSearch} disabled={!formData.state || !formData.businessName}>
                              <Search className="h-4 w-4 mr-2" /> Check Availability
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Must include "LLC", "L.L.C.", or "Limited Liability Company"
                          </p>
                        </div>

                        {stateInfo && (
                          <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4" /> {formData.state} Filing Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Filing Fee:</span>
                                <span className="ml-2 font-medium">${stateInfo.fee}</span>
                              </div>
                              <div>
                                <a href={stateInfo.file} target="_blank" rel="noopener noreferrer" 
                                   className="text-primary hover:underline flex items-center gap-1">
                                  Official Filing Portal <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => setStep(2)} disabled={!formData.state || !formData.businessName}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Business Details */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Step 2: Business Details</h2>
                    <div className="space-y-4">
                      <div>
                        <Label>Business Purpose</Label>
                        <Textarea 
                          placeholder="Describe what your business will do (or leave blank for 'any lawful purpose')"
                          value={formData.businessPurpose}
                          onChange={(e) => setFormData({...formData, businessPurpose: e.target.value})}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Most states allow "any lawful business purpose" - specific purposes are optional
                        </p>
                      </div>

                      <div>
                        <Label>Business Type</Label>
                        <Select value={formData.businessType} onValueChange={(v) => setFormData({...formData, businessType: v})}>
                          <SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consulting">Professional Services / Consulting</SelectItem>
                            <SelectItem value="retail">Retail / E-commerce</SelectItem>
                            <SelectItem value="realestate">Real Estate / Property Management</SelectItem>
                            <SelectItem value="tech">Technology / Software</SelectItem>
                            <SelectItem value="healthcare">Healthcare Services</SelectItem>
                            <SelectItem value="construction">Construction / Contracting</SelectItem>
                            <SelectItem value="food">Food & Beverage</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Management Structure</Label>
                        <Select value={formData.managementType} onValueChange={(v) => setFormData({...formData, managementType: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member-managed">Member-Managed (all members run the business)</SelectItem>
                            <SelectItem value="manager-managed">Manager-Managed (designated managers run the business)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Most small LLCs choose member-managed. Manager-managed is better for passive investors.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button onClick={() => setStep(3)}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Members */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Step 3: Members (Owners)</h2>
                    
                    {formData.members.length === 0 ? (
                      <div className="text-center py-8 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground mb-4">No members added yet</p>
                        <Button onClick={handleAddMember}>Add First Member</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.members.map((member, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium">Member {index + 1}</h4>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(index)}>
                                Remove
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <Label>Full Legal Name</Label>
                                <Input 
                                  value={member.name}
                                  onChange={(e) => handleUpdateMember(index, "name", e.target.value)}
                                  placeholder="John Smith"
                                />
                              </div>
                              <div>
                                <Label>Address</Label>
                                <Input 
                                  value={member.address}
                                  onChange={(e) => handleUpdateMember(index, "address", e.target.value)}
                                  placeholder="123 Main St, City, State ZIP"
                                />
                              </div>
                              <div>
                                <Label>Ownership %</Label>
                                <Input 
                                  value={member.ownership}
                                  onChange={(e) => handleUpdateMember(index, "ownership", e.target.value)}
                                  placeholder="50"
                                  type="number"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button variant="outline" onClick={handleAddMember} className="w-full">
                          + Add Another Member
                        </Button>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                      <Button onClick={() => setStep(4)} disabled={formData.members.length === 0}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Registered Agent */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Step 4: Registered Agent</h2>
                    <p className="text-sm text-muted-foreground">
                      A registered agent receives legal documents on behalf of your LLC. 
                      They must have a physical address in {formData.state || "your state"} (not a P.O. Box).
                    </p>

                    <div>
                      <Label>Registered Agent Type</Label>
                      <Select value={formData.agentType} onValueChange={(v) => setFormData({...formData, agentType: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">I will be my own registered agent (Free)</SelectItem>
                          <SelectItem value="member">A member will be the registered agent</SelectItem>
                          <SelectItem value="service">I'll use a registered agent service ($50-150/year)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.agentType !== "self" && formData.agentType !== "member" && (
                      <div className="space-y-3">
                        <div>
                          <Label>Agent Name / Company</Label>
                          <Input 
                            value={formData.agentName}
                            onChange={(e) => setFormData({...formData, agentName: e.target.value})}
                            placeholder="Registered Agent Service Inc."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Street Address</Label>
                            <Input 
                              value={formData.agentAddress}
                              onChange={(e) => setFormData({...formData, agentAddress: e.target.value})}
                              placeholder="123 Business Ave"
                            />
                          </div>
                          <div>
                            <Label>City</Label>
                            <Input 
                              value={formData.agentCity}
                              onChange={(e) => setFormData({...formData, agentCity: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>State</Label>
                            <Input value={formData.state} disabled />
                          </div>
                          <div>
                            <Label>ZIP Code</Label>
                            <Input 
                              value={formData.agentZip}
                              onChange={(e) => setFormData({...formData, agentZip: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                      <Button onClick={() => setStep(5)}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Principal Office */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Step 5: Principal Office Address</h2>
                    <p className="text-sm text-muted-foreground">
                      This is the main business address where records will be kept.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <Label>Street Address</Label>
                        <Input 
                          value={formData.principalAddress}
                          onChange={(e) => setFormData({...formData, principalAddress: e.target.value})}
                          placeholder="123 Business Ave, Suite 100"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>City</Label>
                          <Input 
                            value={formData.principalCity}
                            onChange={(e) => setFormData({...formData, principalCity: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Select value={formData.principalState} onValueChange={(v) => setFormData({...formData, principalState: v})}>
                            <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
                            <SelectContent>
                              {US_STATES.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>ZIP Code</Label>
                          <Input 
                            value={formData.principalZip}
                            onChange={(e) => setFormData({...formData, principalZip: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Organizer Name (Person Filing)</Label>
                      <Input 
                        value={formData.organizer}
                        onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                        placeholder="Your full legal name"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The organizer signs the Articles of Organization
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
                      <Button onClick={() => setStep(6)} disabled={!formData.principalAddress || !formData.organizer}>
                        Review & Generate <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 6: Review & Generate */}
                {step === 6 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Step 6: Review & Generate Documents</h2>
                    
                    {/* Summary */}
                    <Card className="bg-muted/30">
                      <CardContent className="pt-6 space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Business Name:</span>
                          <span className="font-medium">{formData.businessName}</span>
                          
                          <span className="text-muted-foreground">State:</span>
                          <span className="font-medium">{formData.state}</span>
                          
                          <span className="text-muted-foreground">Management:</span>
                          <span className="font-medium">{formData.managementType}</span>
                          
                          <span className="text-muted-foreground">Members:</span>
                          <span className="font-medium">{formData.members.length}</span>
                          
                          <span className="text-muted-foreground">Filing Fee:</span>
                          <span className="font-medium">${stateInfo?.fee || "N/A"}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Generate Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        onClick={generateArticlesOfOrganization} 
                        disabled={isGenerating}
                        className="h-auto py-4"
                      >
                        <div className="text-left">
                          <div className="font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Generate Articles of Organization
                          </div>
                          <div className="text-xs opacity-80">Required to file with state</div>
                        </div>
                      </Button>
                      
                      <Button 
                        onClick={generateOperatingAgreement} 
                        disabled={isGenerating || !generatedDocs?.articlesOfOrganization}
                        variant="outline"
                        className="h-auto py-4"
                      >
                        <div className="text-left">
                          <div className="font-semibold flex items-center gap-2">
                            <Scale className="h-4 w-4" />
                            Generate Operating Agreement
                          </div>
                          <div className="text-xs opacity-80">Internal governance document</div>
                        </div>
                      </Button>
                    </div>

                    {/* Generated Documents */}
                    {generatedDocs?.articlesOfOrganization && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            Articles of Organization
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedDocs.articlesOfOrganization, "Articles")}>
                                <Copy className="h-4 w-4 mr-1" /> Copy
                              </Button>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={async () => {
                                  try {
                                    toast.loading("Generating PDF...");
                                    const result = await generateArticlesPDF.mutateAsync({
                                      type: 'articles',
                                      state: formData.state,
                                      companyName: formData.businessName,
                                      content: generatedDocs.articlesOfOrganization,
                                    });
                                    toast.dismiss();
                                    toast.success("PDF Generated!");
                                    window.open(result.url, '_blank');
                                  } catch (e) {
                                    toast.dismiss();
                                    toast.error("Failed to generate PDF");
                                  }
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" /> Download PDF
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                            {generatedDocs.articlesOfOrganization}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {generatedDocs?.operatingAgreement && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            Operating Agreement
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedDocs.operatingAgreement, "Operating Agreement")}>
                                <Copy className="h-4 w-4 mr-1" /> Copy
                              </Button>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={async () => {
                                  try {
                                    toast.loading("Generating PDF...");
                                    const result = await generateArticlesPDF.mutateAsync({
                                      type: 'operating',
                                      state: formData.state,
                                      companyName: formData.businessName,
                                      content: generatedDocs.operatingAgreement,
                                    });
                                    toast.dismiss();
                                    toast.success("PDF Generated!");
                                    window.open(result.url, '_blank');
                                  } catch (e) {
                                    toast.dismiss();
                                    toast.error("Failed to generate PDF");
                                  }
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" /> Download PDF
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                            {generatedDocs.operatingAgreement}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Next Steps */}
                    {generatedDocs && (
                      <Card className="border-green-500/30 bg-green-500/5">
                        <CardHeader>
                          <CardTitle className="text-lg text-green-600">Next Steps to Complete Your LLC</CardTitle>
                          <CardDescription>Click each link to complete the action - we've done the research for you</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Step 1: File with State */}
                          <div className="p-3 border rounded-lg bg-background">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                              <div className="flex-1">
                                <h4 className="font-semibold">File Articles of Organization</h4>
                                <p className="text-sm text-muted-foreground mb-2">Submit your documents to {formData.state} Secretary of State</p>
                                <div className="flex flex-wrap gap-2">
                                  <a href={stateInfo?.file} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="gap-1"><ExternalLink className="h-3 w-3" /> File Online (${stateInfo?.fee})</Button>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Step 2: Get EIN */}
                          <div className="p-3 border rounded-lg bg-background">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                              <div className="flex-1">
                                <h4 className="font-semibold">Get Your EIN (Tax ID)</h4>
                                <p className="text-sm text-muted-foreground mb-2">Free from IRS - takes 5 minutes online. You'll get it immediately.</p>
                                <div className="flex flex-wrap gap-2">
                                  <a href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="gap-1"><ExternalLink className="h-3 w-3" /> Apply for EIN (FREE)</Button>
                                  </a>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Hours: Mon-Fri 7am-10pm ET. Have your LLC info ready.</p>
                              </div>
                            </div>
                          </div>

                          {/* Step 3: Business Bank Account */}
                          <div className="p-3 border rounded-lg bg-background">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                              <div className="flex-1">
                                <h4 className="font-semibold">Open Business Bank Account</h4>
                                <p className="text-sm text-muted-foreground mb-2">Keep business and personal finances separate. Bring: EIN letter, Articles of Organization, Operating Agreement, ID.</p>
                                <div className="flex flex-wrap gap-2">
                                  <a href="https://www.bluevine.com/business-checking" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> Bluevine (No fees)</Button>
                                  </a>
                                  <a href="https://mercury.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> Mercury (Startups)</Button>
                                  </a>
                                  <a href="https://www.chase.com/business/banking" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> Chase Business</Button>
                                  </a>
                                  <a href="https://www.relay.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> Relay (Free)</Button>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Step 4: Business Licenses */}
                          <div className="p-3 border rounded-lg bg-background">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                              <div className="flex-1">
                                <h4 className="font-semibold">Register for Business Licenses</h4>
                                <p className="text-sm text-muted-foreground mb-2">Requirements vary by state, city, and business type.</p>
                                <div className="flex flex-wrap gap-2">
                                  <a href={`https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits`} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> SBA License Guide</Button>
                                  </a>
                                  <a href={`https://www.usa.gov/state-business`} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> State Requirements</Button>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Step 5: Accounting */}
                          <div className="p-3 border rounded-lg bg-background">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">5</div>
                              <div className="flex-1">
                                <h4 className="font-semibold">Set Up Accounting</h4>
                                <p className="text-sm text-muted-foreground mb-2">Track income, expenses, and prepare for taxes from day one.</p>
                                <div className="flex flex-wrap gap-2">
                                  <a href="https://quickbooks.intuit.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> QuickBooks</Button>
                                  </a>
                                  <a href="https://www.waveapps.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> Wave (Free)</Button>
                                  </a>
                                  <a href="https://www.xero.com" target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> Xero</Button>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 border-2 border-dashed border-primary/30 rounded-lg text-center">
                            <p className="text-sm font-medium">🎉 Once complete, your LLC is officially in business!</p>
                            <p className="text-xs text-muted-foreground">Connect your accounts in the Integrations page to manage everything from Kaiden</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(5)}>Back</Button>
                      <Button variant="outline" onClick={() => setStep(1)}>Start New LLC</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" 
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <ExternalLink className="h-4 w-4" /> Get Free EIN (IRS)
                </a>
                {formData.state && stateInfo && (
                  <>
                    <a href={stateInfo.search} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Search className="h-4 w-4" /> {formData.state} Name Search
                    </a>
                    <a href={stateInfo.file} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <FileText className="h-4 w-4" /> {formData.state} Filing Portal
                    </a>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estimated Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>State Filing Fee</span>
                    <span className="font-medium">${stateInfo?.fee || "Varies"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EIN (IRS)</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registered Agent (if using service)</span>
                    <span className="font-medium">$50-150/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kaiden AI Documents</span>
                    <span className="font-medium text-green-600">Included</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total (DIY)</span>
                    <span>${stateInfo?.fee || "~150"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Compare to: LegalZoom $79-359 + state fees
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>✓ Delaware is popular for privacy and flexible laws</p>
                <p>✓ Wyoming has no state income tax and low fees</p>
                <p>✓ Form in your home state if operating locally</p>
                <p>✓ Single-member LLCs are taxed as sole proprietors by default</p>
                <p>✓ Keep personal and business finances completely separate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
