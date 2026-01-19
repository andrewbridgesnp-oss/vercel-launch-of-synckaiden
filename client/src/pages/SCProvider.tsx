import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import {
  Stethoscope,
  FileText,
  Shield,
  Monitor,
  CreditCard,
  Users,
  CheckCircle2,
  Download,
  ExternalLink,
  AlertTriangle,
  Laptop,
  Headphones,
  Camera,
  Wifi,
  Lock,
  Building2,
  Scale,
  DollarSign,
  Clock,
  ArrowRight,
  Phone,
  Video,
  ClipboardList
} from "lucide-react";

// Checklist items for starting a telehealth practice
const SETUP_CHECKLIST = {
  licensing: [
    { id: "sc-license", label: "Active SC NP/MD License", required: true, link: "https://llr.sc.gov/med/" },
    { id: "dea", label: "DEA Registration (if prescribing controlled substances)", required: false, link: "https://www.deadiversion.usdoj.gov/" },
    { id: "npi", label: "National Provider Identifier (NPI)", required: true, link: "https://nppes.cms.hhs.gov/" },
    { id: "caqh", label: "CAQH ProView Profile", required: true, link: "https://proview.caqh.org/" },
    { id: "malpractice", label: "Malpractice Insurance (telehealth coverage)", required: true },
    { id: "collaborative", label: "Collaborative Practice Agreement (NPs)", required: true },
  ],
  business: [
    { id: "llc", label: "Business Entity (LLC/PLLC recommended)", required: true, link: "/llc-formation" },
    { id: "ein", label: "EIN from IRS", required: true, link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
    { id: "bank", label: "Business Bank Account", required: true },
    { id: "policies", label: "HIPAA Policies & Procedures", required: true },
    { id: "baa", label: "Business Associate Agreements (BAAs)", required: true },
    { id: "consent", label: "Telehealth Consent Forms", required: true },
  ],
  technology: [
    { id: "ehr", label: "HIPAA-Compliant EHR System", required: true },
    { id: "telehealth-platform", label: "Telehealth Video Platform", required: true },
    { id: "eprescribe", label: "E-Prescribing System (EPCS for controlled)", required: true },
    { id: "secure-email", label: "HIPAA-Compliant Email", required: true },
    { id: "backup", label: "Data Backup Solution", required: true },
  ],
  equipment: [
    { id: "computer", label: "HIPAA-Compliant Computer/Laptop", required: true },
    { id: "webcam", label: "HD Webcam (1080p minimum)", required: true },
    { id: "headset", label: "Noise-Canceling Headset", required: true },
    { id: "internet", label: "High-Speed Internet (25+ Mbps)", required: true },
    { id: "lighting", label: "Professional Lighting", required: false },
    { id: "backdrop", label: "Professional Backdrop", required: false },
  ],
  credentialing: [
    { id: "medicare", label: "Medicare Enrollment", required: false, link: "https://pecos.cms.hhs.gov/" },
    { id: "medicaid", label: "SC Medicaid Enrollment", required: false, link: "https://www.scdhhs.gov/" },
    { id: "bcbs", label: "BlueCross BlueShield SC", required: false },
    { id: "united", label: "UnitedHealthcare", required: false },
    { id: "aetna", label: "Aetna", required: false },
    { id: "cigna", label: "Cigna", required: false },
  ]
};

// Recommended products with affiliate-style links
const RECOMMENDED_EQUIPMENT = [
  {
    category: "Computers",
    items: [
      { name: "Dell Latitude 5540 (HIPAA Ready)", price: "$1,299", specs: "i7, 16GB RAM, 512GB SSD, TPM 2.0", recommended: true },
      { name: "HP EliteBook 840 G10", price: "$1,199", specs: "i5, 16GB RAM, 256GB SSD, Fingerprint" },
      { name: "Lenovo ThinkPad T14s", price: "$1,149", specs: "i5, 16GB RAM, 512GB SSD, Privacy Screen" },
    ]
  },
  {
    category: "Webcams",
    items: [
      { name: "Logitech C920s HD Pro", price: "$69", specs: "1080p, Privacy Shutter, Auto-focus", recommended: true },
      { name: "Logitech Brio 4K", price: "$199", specs: "4K, HDR, Windows Hello" },
      { name: "Razer Kiyo Pro", price: "$149", specs: "1080p, Adaptive Light Sensor" },
    ]
  },
  {
    category: "Headsets",
    items: [
      { name: "Jabra Evolve2 65", price: "$249", specs: "Wireless, ANC, 37hr battery", recommended: true },
      { name: "Poly Voyager Focus 2", price: "$299", specs: "ANC, Hybrid ANC, Multi-device" },
      { name: "Logitech Zone Wireless", price: "$199", specs: "ANC, Qi Charging, Flip-to-mute" },
    ]
  },
  {
    category: "Lighting",
    items: [
      { name: "Elgato Key Light Air", price: "$129", specs: "1400 lumens, App control", recommended: true },
      { name: "Lume Cube Video Conference Kit", price: "$69", specs: "Laptop mount, Adjustable" },
      { name: "Ring Light 18\"", price: "$45", specs: "Dimmable, Phone holder" },
    ]
  }
];

// EHR/Telehealth Platform Options
const PLATFORM_OPTIONS = [
  {
    name: "SimplePractice",
    type: "All-in-One",
    price: "$69-99/mo",
    features: ["EHR", "Telehealth", "Billing", "Scheduling", "Client Portal"],
    bestFor: "Solo practitioners",
    link: "https://www.simplepractice.com/"
  },
  {
    name: "Practice Fusion",
    type: "EHR",
    price: "Free (ad-supported)",
    features: ["EHR", "E-Prescribe", "Labs", "Charting"],
    bestFor: "Budget-conscious practices",
    link: "https://www.practicefusion.com/"
  },
  {
    name: "Doxy.me",
    type: "Telehealth Only",
    price: "Free-$50/mo",
    features: ["HIPAA Video", "Waiting Room", "Screen Share"],
    bestFor: "Simple telehealth needs",
    link: "https://doxy.me/"
  },
  {
    name: "Athenahealth",
    type: "Enterprise",
    price: "% of collections",
    features: ["Full RCM", "EHR", "Telehealth", "Analytics"],
    bestFor: "Growing practices",
    link: "https://www.athenahealth.com/"
  },
  {
    name: "DrChrono",
    type: "All-in-One",
    price: "$199-499/mo",
    features: ["EHR", "Billing", "Telehealth", "iPad App"],
    bestFor: "Tech-forward practices",
    link: "https://www.drchrono.com/"
  }
];

// Document templates
const DOCUMENT_TEMPLATES = [
  { name: "Telehealth Consent Form", description: "Patient consent for virtual visits", type: "consent" },
  { name: "HIPAA Notice of Privacy Practices", description: "Required privacy disclosure", type: "hipaa" },
  { name: "Collaborative Practice Agreement Template", description: "NP-Physician agreement (SC specific)", type: "legal" },
  { name: "Business Associate Agreement", description: "For vendors handling PHI", type: "hipaa" },
  { name: "Telehealth Policies & Procedures", description: "Practice protocols", type: "policy" },
  { name: "Patient Intake Forms", description: "Medical history, demographics", type: "clinical" },
  { name: "Treatment Agreement", description: "For controlled substance prescribing", type: "clinical" },
  { name: "Fee Schedule Template", description: "Service pricing document", type: "business" },
];

export default function SCProvider() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("overview");

  const toggleItem = (id: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedItems(newCompleted);
  };

  const getProgress = (items: typeof SETUP_CHECKLIST.licensing) => {
    const completed = items.filter(item => completedItems.has(item.id)).length;
    return Math.round((completed / items.length) * 100);
  };

  const totalProgress = () => {
    const allItems = [
      ...SETUP_CHECKLIST.licensing,
      ...SETUP_CHECKLIST.business,
      ...SETUP_CHECKLIST.technology,
      ...SETUP_CHECKLIST.equipment,
    ];
    const completed = allItems.filter(item => completedItems.has(item.id)).length;
    return Math.round((completed / allItems.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Stethoscope className="w-3 h-3 mr-1" />
            SC Healthcare Providers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-shimmer">
            Start Your Telehealth Practice
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything NPs and MDs need to launch a compliant telehealth practice in South Carolina. 
            Step-by-step guidance, required documents, and recommended equipment.
          </p>
          
          {/* Overall Progress */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Setup Progress</span>
              <span className="text-primary font-semibold">{totalProgress()}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${totalProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-500/50 bg-amber-500/10">
          <CardContent className="flex items-start gap-4 py-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-400">Important Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                This guide is for educational purposes only. Always consult with a healthcare attorney 
                and compliance expert before starting your practice. Regulations change frequently - 
                verify all requirements with the SC Board of Medical Examiners and SC Board of Nursing.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2 bg-card/50 backdrop-blur mb-8">
            <TabsTrigger value="overview" className="py-3">
              <ClipboardList className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="checklist" className="py-3">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="equipment" className="py-3">
              <Laptop className="w-4 h-4 mr-2" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="platforms" className="py-3">
              <Monitor className="w-4 h-4 mr-2" />
              Platforms
            </TabsTrigger>
            <TabsTrigger value="documents" className="py-3">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Step 1 */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</div>
                    <CardTitle>Licensing & Credentials</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Ensure your SC license is active and obtain necessary credentials.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Active SC NP/MD License
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      NPI Number
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      DEA (if prescribing controlled)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Malpractice Insurance
                    </li>
                  </ul>
                  <Badge variant="outline" className="mt-2">Timeline: 2-4 weeks</Badge>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">2</div>
                    <CardTitle>Business Setup</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Establish your legal business entity and compliance framework.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Form LLC/PLLC
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Get EIN from IRS
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Open Business Bank Account
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      HIPAA Compliance Program
                    </li>
                  </ul>
                  <Link href="/llc-formation">
                    <Button variant="outline" size="sm" className="mt-2">
                      Start LLC Formation <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">3</div>
                    <CardTitle>Technology Setup</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Choose HIPAA-compliant platforms and equipment.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      EHR System
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Telehealth Platform
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      E-Prescribing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Secure Communications
                    </li>
                  </ul>
                  <Badge variant="outline" className="mt-2">Timeline: 1-2 weeks</Badge>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">4</div>
                    <CardTitle>Insurance Credentialing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get credentialed with insurance payers to accept patients.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      CAQH ProView Profile
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Medicare/Medicaid
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Commercial Payers
                    </li>
                  </ul>
                  <Badge variant="outline" className="mt-2 text-amber-400 border-amber-400">Timeline: 60-120 days</Badge>
                </CardContent>
              </Card>

              {/* Step 5 */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">5</div>
                    <CardTitle>Launch & Market</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Start seeing patients and grow your practice.
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Website & Online Presence
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Patient Scheduling
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Marketing Strategy
                    </li>
                  </ul>
                  <Badge variant="outline" className="mt-2">Ongoing</Badge>
                </CardContent>
              </Card>

              {/* Cost Estimate */}
              <Card className="glass border-primary/50 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-10 h-10 text-primary" />
                    <CardTitle>Estimated Startup Costs</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>LLC Formation</span>
                      <span>$110-500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Malpractice Insurance</span>
                      <span>$2,000-5,000/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EHR/Telehealth Platform</span>
                      <span>$70-200/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment</span>
                      <span>$1,500-3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HIPAA Compliance</span>
                      <span>$500-2,000</span>
                    </div>
                    <hr className="border-border/50 my-2" />
                    <div className="flex justify-between font-bold text-primary">
                      <span>Total Estimated</span>
                      <span>$5,000-12,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(SETUP_CHECKLIST).map(([key, items]) => (
                <Card key={key} className="glass border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                      <Badge variant="outline">{getProgress(items)}%</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                        style={{ width: `${getProgress(items)}%` }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <Checkbox
                          id={item.id}
                          checked={completedItems.has(item.id)}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={item.id}
                            className={`text-sm cursor-pointer ${completedItems.has(item.id) ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {item.label}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                        </div>
                        {'link' in item && item.link && (
                          <a 
                            href={item.link.startsWith('/') ? undefined : item.link}
                            onClick={item.link.startsWith('/') ? () => window.location.href = item.link : undefined}
                            target={item.link.startsWith('/') ? undefined : "_blank"}
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </a>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment">
            <div className="space-y-8">
              {RECOMMENDED_EQUIPMENT.map((category) => (
                <div key={category.category}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    {category.category === "Computers" && <Laptop className="w-5 h-5" />}
                    {category.category === "Webcams" && <Camera className="w-5 h-5" />}
                    {category.category === "Headsets" && <Headphones className="w-5 h-5" />}
                    {category.category === "Lighting" && <Monitor className="w-5 h-5" />}
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.items.map((item, index) => (
                      <Card 
                        key={index} 
                        className={`glass border-border/50 ${item.recommended ? 'border-green-500/50 bg-green-500/5' : ''}`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            {item.recommended && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{item.specs}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-primary">{item.price}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLATFORM_OPTIONS.map((platform, index) => (
                <Card key={index} className="glass border-border/50 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{platform.name}</CardTitle>
                      <Badge variant="outline">{platform.type}</Badge>
                    </div>
                    <CardDescription>{platform.bestFor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-2xl font-bold text-primary">{platform.price}</p>
                    <div className="space-y-2">
                      {platform.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => window.open(platform.link, '_blank')}
                    >
                      Learn More <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOCUMENT_TEMPLATES.map((doc, index) => (
                <Card key={index} className="glass border-border/50 hover:border-primary/50 transition-all">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        doc.type === 'consent' ? 'bg-blue-500/20' :
                        doc.type === 'hipaa' ? 'bg-red-500/20' :
                        doc.type === 'legal' ? 'bg-purple-500/20' :
                        doc.type === 'clinical' ? 'bg-green-500/20' :
                        doc.type === 'policy' ? 'bg-orange-500/20' :
                        'bg-cyan-500/20'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          doc.type === 'consent' ? 'text-blue-400' :
                          doc.type === 'hipaa' ? 'text-red-400' :
                          doc.type === 'legal' ? 'text-purple-400' :
                          doc.type === 'clinical' ? 'text-green-400' :
                          doc.type === 'policy' ? 'text-orange-400' :
                          'text-cyan-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 glass border-primary/50 bg-primary/5">
              <CardContent className="py-6 text-center">
                <h3 className="text-xl font-bold mb-2">Need Custom Documents?</h3>
                <p className="text-muted-foreground mb-4">
                  Kaiden can help you generate customized documents for your specific practice needs.
                </p>
                <Link href="/chat">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Talk to Kaiden
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="https://llr.sc.gov/med/" target="_blank" rel="noopener noreferrer">
            <Card className="glass border-border/50 hover:border-primary/50 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Scale className="w-8 h-8 text-primary mb-2" />
                <h4 className="font-semibold text-sm">SC Board of Medical Examiners</h4>
              </CardContent>
            </Card>
          </a>
          <a href="https://llr.sc.gov/nurse/" target="_blank" rel="noopener noreferrer">
            <Card className="glass border-border/50 hover:border-primary/50 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Stethoscope className="w-8 h-8 text-primary mb-2" />
                <h4 className="font-semibold text-sm">SC Board of Nursing</h4>
              </CardContent>
            </Card>
          </a>
          <a href="https://www.hhs.gov/hipaa/" target="_blank" rel="noopener noreferrer">
            <Card className="glass border-border/50 hover:border-primary/50 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <Shield className="w-8 h-8 text-primary mb-2" />
                <h4 className="font-semibold text-sm">HIPAA Resources</h4>
              </CardContent>
            </Card>
          </a>
          <Link href="/medical-billing">
            <Card className="glass border-border/50 hover:border-primary/50 cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                <CreditCard className="w-8 h-8 text-primary mb-2" />
                <h4 className="font-semibold text-sm">Medical Billing Tool</h4>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
