import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Video, FileCheck, Shield, Clock, DollarSign, 
  CheckCircle2, Calendar, Upload, Users, Globe, Smartphone
} from "lucide-react";
import { toast } from "sonner";

// States that allow Remote Online Notarization (RON)
const RON_STATES = [
  "Alaska", "Arizona", "Arkansas", "Colorado", "Florida", "Hawaii", "Idaho", 
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maryland", "Michigan", 
  "Minnesota", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
  "Pennsylvania", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const DOCUMENT_TYPES = [
  { value: "affidavit", label: "Affidavit / Sworn Statement", price: 25 },
  { value: "poa", label: "Power of Attorney", price: 35 },
  { value: "deed", label: "Real Estate Deed", price: 50 },
  { value: "will", label: "Last Will & Testament", price: 45 },
  { value: "trust", label: "Trust Documents", price: 55 },
  { value: "contract", label: "Business Contract", price: 30 },
  { value: "vehicle", label: "Vehicle Title Transfer", price: 25 },
  { value: "medical", label: "Medical Directive / Healthcare POA", price: 35 },
  { value: "other", label: "Other Document", price: 25 },
];

export default function VirtualNotary() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    signerName: "",
    signerEmail: "",
    signerPhone: "",
    signerState: "",
    documentType: "",
    documentCount: "1",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const selectedDoc = DOCUMENT_TYPES.find(d => d.value === formData.documentType);
  const totalPrice = selectedDoc ? selectedDoc.price * parseInt(formData.documentCount || "1") : 0;

  const handleSchedule = () => {
    if (!formData.signerName || !formData.signerEmail || !formData.signerState || !formData.documentType) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In production, this would create a booking and send confirmation
    toast.success("Notary Session Scheduled!", {
      description: `Confirmation sent to ${formData.signerEmail}`,
    });
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/side-hustle">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-primary" />
              Virtual Notary Services
            </h1>
            <p className="text-muted-foreground">Remote Online Notarization - Fast, Secure, Legal</p>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <Video className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">100% Online</h3>
                <p className="text-sm text-muted-foreground">Video call from anywhere</p>
              </div>
              <div>
                <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">24/7 Available</h3>
                <p className="text-sm text-muted-foreground">Book anytime, any day</p>
              </div>
              <div>
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Legally Binding</h3>
                <p className="text-sm text-muted-foreground">Accepted in 37+ states</p>
              </div>
              <div>
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Starting at $25</h3>
                <p className="text-sm text-muted-foreground">No hidden fees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Your Notary Session</CardTitle>
                <CardDescription>Complete the form below to book your remote notarization</CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-lg">Step 1: Your Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Legal Name *</Label>
                        <Input 
                          value={formData.signerName}
                          onChange={(e) => setFormData({...formData, signerName: e.target.value})}
                          placeholder="As it appears on your ID"
                        />
                      </div>
                      <div>
                        <Label>Email Address *</Label>
                        <Input 
                          type="email"
                          value={formData.signerEmail}
                          onChange={(e) => setFormData({...formData, signerEmail: e.target.value})}
                          placeholder="you@email.com"
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input 
                          type="tel"
                          value={formData.signerPhone}
                          onChange={(e) => setFormData({...formData, signerPhone: e.target.value})}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label>Your State *</Label>
                        <Select value={formData.signerState} onValueChange={(v) => setFormData({...formData, signerState: v})}>
                          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                          <SelectContent>
                            {RON_STATES.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.signerState && !RON_STATES.includes(formData.signerState) && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <p className="text-sm text-amber-600">
                          Remote Online Notarization may not be available in your state. 
                          Please check your state's requirements or contact us for alternatives.
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button onClick={() => setStep(2)} disabled={!formData.signerName || !formData.signerEmail || !formData.signerState}>
                        Continue to Document Details
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-lg">Step 2: Document & Scheduling</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Document Type *</Label>
                        <Select value={formData.documentType} onValueChange={(v) => setFormData({...formData, documentType: v})}>
                          <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                          <SelectContent>
                            {DOCUMENT_TYPES.map(doc => (
                              <SelectItem key={doc.value} value={doc.value}>
                                {doc.label} - ${doc.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Number of Documents</Label>
                        <Select value={formData.documentCount} onValueChange={(v) => setFormData({...formData, documentCount: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(n => (
                              <SelectItem key={n} value={n.toString()}>{n} document{n > 1 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Preferred Date</Label>
                          <Input 
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <Label>Preferred Time</Label>
                          <Select value={formData.preferredTime} onValueChange={(v) => setFormData({...formData, preferredTime: v})}>
                            <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                              <SelectItem value="evening">Evening (5pm - 9pm)</SelectItem>
                              <SelectItem value="asap">ASAP (Next Available)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Additional Notes</Label>
                        <Textarea 
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          placeholder="Any special requirements or questions..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Price Summary */}
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{selectedDoc?.label || "Select document type"}</p>
                            <p className="text-sm text-muted-foreground">{formData.documentCount} document(s)</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${totalPrice}</p>
                            <p className="text-xs text-muted-foreground">Pay after session</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                      <Button onClick={handleSchedule} disabled={!formData.documentType}>
                        Schedule Session
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center py-8 space-y-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Session Scheduled!</h3>
                      <p className="text-muted-foreground">Confirmation sent to {formData.signerEmail}</p>
                    </div>
                    
                    <Card className="text-left">
                      <CardContent className="pt-6 space-y-3">
                        <h4 className="font-semibold">What to Prepare:</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Valid government-issued photo ID (driver's license, passport, or state ID)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Your document(s) ready to upload or share screen</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Computer or phone with camera and microphone</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Stable internet connection</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Quiet, well-lit location</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={() => { setStep(1); setFormData({ signerName: "", signerEmail: "", signerPhone: "", signerState: "", documentType: "", documentCount: "1", preferredDate: "", preferredTime: "", notes: "" }); }}>
                        Schedule Another
                      </Button>
                      <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Schedule</p>
                    <p className="text-sm text-muted-foreground">Book your session online</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Connect</p>
                    <p className="text-sm text-muted-foreground">Join video call with notary</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Verify</p>
                    <p className="text-sm text-muted-foreground">Show ID & answer questions</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Sign & Notarize</p>
                    <p className="text-sm text-muted-foreground">E-sign with digital seal</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Done!</p>
                    <p className="text-sm text-muted-foreground">Receive notarized document</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accepted Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Power of Attorney</Badge>
                  <Badge variant="secondary">Affidavits</Badge>
                  <Badge variant="secondary">Real Estate Deeds</Badge>
                  <Badge variant="secondary">Wills & Trusts</Badge>
                  <Badge variant="secondary">Business Contracts</Badge>
                  <Badge variant="secondary">Vehicle Titles</Badge>
                  <Badge variant="secondary">Medical Directives</Badge>
                  <Badge variant="secondary">Loan Documents</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Become a Notary */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Become a Virtual Notary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Earn $25-50 per notarization from home. Set your own schedule.
                </p>
                <ul className="text-sm space-y-1">
                  <li>✓ Must be a commissioned notary</li>
                  <li>✓ Complete RON certification</li>
                  <li>✓ Pass background check</li>
                </ul>
                <Link href="/side-hustle">
                  <Button className="w-full" variant="outline">Learn More</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-xs">Bank-Level Security</p>
                  </div>
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-xs">37+ States</p>
                  </div>
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-xs">Mobile Friendly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
