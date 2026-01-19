import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, Wifi, Lock, Eye, Server, Globe, Zap, Radio, Antenna, MapPin, Building, Hotel, Coffee, Calendar, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function ThreatScan() {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [domain, setDomain] = useState("");
  const [activeTab, setActiveTab] = useState("website");

  // On-site service booking
  const [bookingForm, setBookingForm] = useState({
    businessName: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    preferredDate: "",
    serviceType: "",
    notes: "",
  });

  // Simulated scan results
  const [results, setResults] = useState<{
    score: number;
    threats: { severity: string; title: string; description: string }[];
    recommendations: string[];
  } | null>(null);

  const runScan = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain to scan");
      return;
    }

    setScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setResults(null);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Simulate scan completion
    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setScanning(false);
      setScanComplete(true);
      
      // Generate mock results
      setResults({
        score: Math.floor(Math.random() * 30) + 60,
        threats: [
          { severity: "high", title: "SSL Certificate Expiring", description: "Your SSL certificate expires in 14 days" },
          { severity: "medium", title: "Missing Security Headers", description: "X-Frame-Options and CSP headers not configured" },
          { severity: "low", title: "Outdated Software Detected", description: "Some server software may need updates" }
        ],
        recommendations: [
          "Renew SSL certificate before expiration",
          "Add security headers to web server configuration",
          "Enable two-factor authentication for all admin accounts",
          "Implement rate limiting on login endpoints",
          "Set up automated security monitoring"
        ]
      });
      
      toast.success("Scan complete!");
    }, 5000);
  };

  const handleBooking = () => {
    if (!bookingForm.businessName || !bookingForm.contactEmail || !bookingForm.serviceType) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("On-Site Assessment Requested!", {
      description: "We'll contact you within 24 hours to confirm your appointment.",
    });
  };

  // SDR Equipment Services
  const sdrServices = [
    {
      icon: Radio,
      title: "RF Spectrum Analysis",
      description: "Using RTL-SDR V3 to scan 24MHz-1.7GHz for unauthorized transmissions, hidden cameras, and rogue devices.",
      equipment: "RTL-SDR V3 + Antenna",
      price: "$397",
      features: [
        "Full spectrum sweep",
        "Hidden camera detection",
        "Bug sweeping",
        "Rogue transmitter identification",
        "Detailed frequency report"
      ]
    },
    {
      icon: Wifi,
      title: "WiFi Security Audit",
      description: "Using Alfa AWUS1900 for comprehensive wireless network analysis and penetration testing.",
      equipment: "Alfa AWUS1900 WiFi Adapter",
      price: "$497",
      features: [
        "Rogue access point detection",
        "WPA/WPA2 security assessment",
        "Evil twin attack testing",
        "Guest network isolation check",
        "Bandwidth theft detection"
      ]
    },
    {
      icon: Antenna,
      title: "Signal Intelligence",
      description: "Advanced RF monitoring for hotels, offices, and sensitive facilities.",
      equipment: "RTL-SDR + Directional Antenna",
      price: "$697",
      features: [
        "24/7 monitoring setup",
        "Automated threat alerts",
        "Signal triangulation",
        "Interference mapping",
        "Compliance reporting"
      ]
    },
    {
      icon: Shield,
      title: "Complete Security Sweep",
      description: "Full-spectrum physical and digital security assessment for high-value targets.",
      equipment: "Full Equipment Suite",
      price: "$1,497",
      features: [
        "RF spectrum analysis",
        "WiFi penetration test",
        "Network vulnerability scan",
        "Physical security review",
        "Executive summary report"
      ]
    }
  ];

  // Business types for on-site services
  const businessTypes = [
    { value: "hotel", label: "Hotel / Resort", icon: Hotel },
    { value: "restaurant", label: "Restaurant / Bar", icon: Coffee },
    { value: "office", label: "Office Building", icon: Building },
    { value: "retail", label: "Retail Store", icon: Building },
    { value: "medical", label: "Medical Facility", icon: Building },
    { value: "other", label: "Other", icon: Building },
  ];

  // Security tips
  const securityTips = [
    {
      title: "Use Strong, Unique Passwords",
      description: "Every account should have a unique password. Use a password manager like 1Password or Bitwarden."
    },
    {
      title: "Enable Two-Factor Authentication",
      description: "Add an extra layer of security to all critical accounts. Use authenticator apps, not SMS."
    },
    {
      title: "Keep Software Updated",
      description: "Outdated software is the #1 attack vector. Enable automatic updates where possible."
    },
    {
      title: "Train Your Team",
      description: "90% of breaches start with phishing. Regular security awareness training is essential."
    },
    {
      title: "Backup Everything",
      description: "Follow the 3-2-1 rule: 3 copies, 2 different media, 1 offsite. Test restores regularly."
    },
    {
      title: "Segment Your Network",
      description: "Separate guest WiFi from business network. IoT devices should be on their own VLAN."
    }
  ];

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            Threat Scanner & Security Services
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From website scans to on-site RF spectrum analysis. Protect your business with military-grade security tools.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="website">Website Scan</TabsTrigger>
            <TabsTrigger value="onsite">On-Site Services</TabsTrigger>
            <TabsTrigger value="equipment">Our Equipment</TabsTrigger>
          </TabsList>

          {/* Website Scan Tab */}
          <TabsContent value="website">
            <Card className="glass border-border/50 border-cyan-500/30 mb-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Quick Website Security Scan
                </CardTitle>
                <CardDescription>
                  Enter your domain to check for common security issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="bg-background/50"
                    disabled={scanning}
                  />
                  <Button 
                    onClick={runScan}
                    disabled={scanning}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500"
                  >
                    {scanning ? "Scanning..." : "Scan Now"}
                  </Button>
                </div>

                {scanning && (
                  <div className="space-y-2">
                    <Progress value={scanProgress} className="h-2" />
                    <p className="text-sm text-gray-400 text-center">
                      Analyzing security configuration...
                    </p>
                  </div>
                )}

                {scanComplete && results && (
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${
                        results.score >= 80 ? 'text-green-400' : 
                        results.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {results.score}/100
                      </div>
                      <p className="text-sm text-gray-400">Security Score</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Issues Found
                      </h4>
                      <div className="space-y-2">
                        {results.threats.map((threat, i) => (
                          <div key={i} className={`p-3 rounded-lg ${
                            threat.severity === 'high' ? 'bg-red-500/10 border border-red-500/30' :
                            threat.severity === 'medium' ? 'bg-amber-500/10 border border-amber-500/30' :
                            'bg-blue-500/10 border border-blue-500/30'
                          }`}>
                            <div className="flex items-center gap-2">
                              <Badge className={
                                threat.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                threat.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-blue-500/20 text-blue-400'
                              }>
                                {threat.severity}
                              </Badge>
                              <span className="font-medium text-sm">{threat.title}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{threat.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {results.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                            <Zap className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full" variant="outline" onClick={() => setActiveTab("onsite")}>
                      Get Full Security Audit
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* On-Site Services Tab */}
          <TabsContent value="onsite">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Service Selection */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Radio className="w-6 h-6 text-cyan-400" />
                  On-Site Security Services
                </h2>
                <p className="text-gray-400">
                  Our team comes to your location with professional-grade equipment to identify threats 
                  that remote scans can't detect.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {sdrServices.map((service, index) => (
                    <Card 
                      key={index} 
                      className={`glass border-border/50 cursor-pointer transition-all ${
                        bookingForm.serviceType === service.title 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'hover:border-cyan-500/50'
                      }`}
                      onClick={() => setBookingForm({...bookingForm, serviceType: service.title})}
                    >
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <service.icon className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold">{service.title}</h3>
                              <span className="text-lg font-bold text-cyan-400">{service.price}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                            <p className="text-xs text-cyan-400/70 mt-1">Equipment: {service.equipment}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {service.features.slice(0, 3).map((f, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Booking Form */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Schedule On-Site Assessment
                  </CardTitle>
                  <CardDescription>
                    Fill out the form and we'll contact you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Business Name *</Label>
                      <Input 
                        value={bookingForm.businessName}
                        onChange={(e) => setBookingForm({...bookingForm, businessName: e.target.value})}
                        placeholder="Your Business Name"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Business Type</Label>
                      <Select 
                        value={bookingForm.businessType} 
                        onValueChange={(v) => setBookingForm({...bookingForm, businessType: v})}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <Input 
                        value={bookingForm.address}
                        onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})}
                        placeholder="Street Address"
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input 
                        value={bookingForm.city}
                        onChange={(e) => setBookingForm({...bookingForm, city: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input 
                        value={bookingForm.state}
                        onChange={(e) => setBookingForm({...bookingForm, state: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Contact Name *</Label>
                      <Input 
                        value={bookingForm.contactName}
                        onChange={(e) => setBookingForm({...bookingForm, contactName: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input 
                        type="email"
                        value={bookingForm.contactEmail}
                        onChange={(e) => setBookingForm({...bookingForm, contactEmail: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input 
                        type="tel"
                        value={bookingForm.contactPhone}
                        onChange={(e) => setBookingForm({...bookingForm, contactPhone: e.target.value})}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Preferred Date</Label>
                      <Input 
                        type="date"
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Additional Notes</Label>
                      <Textarea 
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                        placeholder="Specific concerns, access requirements, etc."
                        className="bg-background/50"
                        rows={3}
                      />
                    </div>
                  </div>

                  {bookingForm.serviceType && (
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                      <p className="text-sm">
                        <span className="font-semibold">Selected Service:</span> {bookingForm.serviceType}
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    onClick={handleBooking}
                  >
                    Request Assessment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Professional-Grade Security Equipment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* RTL-SDR V3 */}
                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <Radio className="w-8 h-8 text-cyan-400" />
                    </div>
                    <CardTitle>RTL-SDR V3</CardTitle>
                    <CardDescription>Software Defined Radio</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      Receives radio signals from 500 kHz to 1.7 GHz. Used for detecting hidden cameras, 
                      wireless bugs, and unauthorized transmitters.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Capabilities:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Hidden camera detection (common frequencies)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Wireless microphone/bug sweeping
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Rogue transmitter identification
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          RF interference mapping
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Alfa AWUS1900 */}
                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <Wifi className="w-8 h-8 text-cyan-400" />
                    </div>
                    <CardTitle>Alfa AWUS1900</CardTitle>
                    <CardDescription>Long-Range WiFi Adapter</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      802.11ac dual-band adapter with 4 external antennas. Used for WiFi security 
                      auditing, penetration testing, and rogue access point detection.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Capabilities:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Rogue access point detection
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Evil twin attack testing
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          WPA/WPA2 security assessment
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Extended range monitoring
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Raspberry Pi Setup */}
                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <Server className="w-8 h-8 text-cyan-400" />
                    </div>
                    <CardTitle>Raspberry Pi Security Node</CardTitle>
                    <CardDescription>24/7 Monitoring System</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      Compact monitoring device that can be deployed on-site for continuous security 
                      monitoring. Includes Pi-hole for network-wide ad/malware blocking.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Capabilities:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Network traffic monitoring
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          DNS-level malware blocking
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Intrusion detection alerts
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Bandwidth monitoring
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* External Storage */}
                <Card className="glass border-border/50">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                      <Lock className="w-8 h-8 text-cyan-400" />
                    </div>
                    <CardTitle>Secure Data Storage</CardTitle>
                    <CardDescription>Encrypted Evidence Collection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400">
                      All scan data and reports are stored on encrypted external drives. Data is 
                      securely transferred to you and then wiped from our systems.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Security Features:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          AES-256 encryption
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Chain of custody documentation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Secure data destruction
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          NDA available upon request
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass border-cyan-500/30 bg-cyan-500/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Ready to Secure Your Business?</h3>
                    <p className="text-gray-400 mb-4">
                      Our team brings professional equipment to your location. No software to install, 
                      no ongoing subscriptions - just results.
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500"
                      onClick={() => setActiveTab("onsite")}
                    >
                      Schedule Your Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Security Tips */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Security Best Practices</CardTitle>
            <CardDescription>Essential tips to protect your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityTips.map((tip, index) => (
                <div key={index} className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <h4 className="font-semibold text-cyan-400 text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-400">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
