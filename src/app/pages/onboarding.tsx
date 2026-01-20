import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Phone, Calendar, CreditCard, MessageSquare, Plus, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { GlassmorphismCard } from "../components/avery/glassmorphism-card";
import { Textarea } from "../components/ui/textarea";

interface OnboardingPageProps {
  onNavigate: (page: string) => void;
}

interface Service {
  name: string;
  price: string;
  duration: string;
}

export function OnboardingPage({ onNavigate }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [businessData, setBusinessData] = useState({
    name: "",
    phone: "",
    timezone: "America/New_York",
    location: ""
  });

  const [hours, setHours] = useState({
    weekdayStart: "09:00",
    weekdayEnd: "17:00",
    weekendStart: "10:00",
    weekendEnd: "14:00"
  });

  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Service>({ name: "", price: "", duration: "" });

  const [bookingRules, setBookingRules] = useState({
    requireDeposit: false,
    cancellationWindow: "24",
    bufferTime: "15",
    maxDailyBookings: "10"
  });

  const [greeting, setGreeting] = useState("");

  const [integrations, setIntegrations] = useState({
    phone: false,
    calendar: false,
    payments: false,
    sms: false
  });

  const [errors, setErrors] = useState<string[]>([]);

  const addService = () => {
    if (!newService.name || !newService.price || !newService.duration) {
      setErrors(["Please fill in all service fields"]);
      return;
    }
    setServices([...services, newService]);
    setNewService({ name: "", price: "", duration: "" });
    setErrors([]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    setErrors([]);
    const newErrors: string[] = [];

    if (currentStep === 1) {
      if (!businessData.name) newErrors.push("Business name is required");
      if (!businessData.phone) newErrors.push("Business phone is required");
      if (businessData.phone && !/^\+?[\d\s-()]+$/.test(businessData.phone)) {
        newErrors.push("Invalid phone number format");
      }
    }

    if (currentStep === 2) {
      if (services.length === 0) {
        newErrors.push("Add at least one service to continue");
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        onNavigate("dashboard");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const testCall = () => {
    alert("Initiating test call to: " + businessData.phone);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 p-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Progress Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Set Up Avery</h1>
          <p className="text-muted-foreground">
            Get Avery operational in under 5 minutes
          </p>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 max-w-md mx-auto">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    i + 1 <= currentStep ? "bg-accent" : "bg-muted"
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <GlassmorphismCard className="p-4 bg-destructive/10 border-destructive/50">
            <ul className="space-y-1">
              {errors.map((error, i) => (
                <li key={i} className="text-sm text-destructive flex items-start gap-2">
                  <span>•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </GlassmorphismCard>
        )}

        {/* Step Content */}
        <GlassmorphismCard className="p-8">
          {/* Step 1: Business Profile */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Business Profile</h2>
                <p className="text-muted-foreground">
                  Tell Avery about your business so calls are answered correctly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Acme Services"
                    value={businessData.name}
                    onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Business Phone *</Label>
                  <Input
                    id="businessPhone"
                    placeholder="+1 (555) 123-4567"
                    value={businessData.phone}
                    onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={businessData.timezone} onValueChange={(value) => setBusinessData({ ...businessData, timezone: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="New York, NY"
                      value={businessData.location}
                      onChange={(e) => setBusinessData({ ...businessData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weekdayStart" className="text-sm text-muted-foreground">
                        Weekday Start
                      </Label>
                      <Input
                        id="weekdayStart"
                        type="time"
                        value={hours.weekdayStart}
                        onChange={(e) => setHours({ ...hours, weekdayStart: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weekdayEnd" className="text-sm text-muted-foreground">
                        Weekday End
                      </Label>
                      <Input
                        id="weekdayEnd"
                        type="time"
                        value={hours.weekdayEnd}
                        onChange={(e) => setHours({ ...hours, weekdayEnd: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services & Pricing */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Services & Pricing</h2>
                <p className="text-muted-foreground">
                  What should Avery book for you?
                </p>
              </div>

              {/* Existing Services */}
              {services.length > 0 && (
                <div className="space-y-2">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${service.price} • {service.duration} min
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeService(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Service */}
              <div className="space-y-4 p-4 border border-border/50 rounded-lg">
                <p className="font-medium">Add Service</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3 md:col-span-1 space-y-2">
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input
                      id="serviceName"
                      placeholder="Consultation"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servicePrice">Price ($)</Label>
                    <Input
                      id="servicePrice"
                      type="number"
                      placeholder="100"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceDuration">Duration (min)</Label>
                    <Input
                      id="serviceDuration"
                      type="number"
                      placeholder="60"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addService} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {services.length === 0 && (
                <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground">
                    Add at least one service to continue
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Booking Rules */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Booking Rules</h2>
                <p className="text-muted-foreground">
                  Set simple rules so Avery books the right way.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <Label>Require Deposit</Label>
                    <p className="text-sm text-muted-foreground">
                      Collect payment before confirming bookings
                    </p>
                  </div>
                  <Switch
                    checked={bookingRules.requireDeposit}
                    onCheckedChange={(checked) => setBookingRules({ ...bookingRules, requireDeposit: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
                  <Input
                    id="cancellationWindow"
                    type="number"
                    value={bookingRules.cancellationWindow}
                    onChange={(e) => setBookingRules({ ...bookingRules, cancellationWindow: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum notice required for cancellations
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
                  <Input
                    id="bufferTime"
                    type="number"
                    value={bookingRules.bufferTime}
                    onChange={(e) => setBookingRules({ ...bookingRules, bufferTime: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Time between appointments
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDaily">Max Daily Bookings</Label>
                  <Input
                    id="maxDaily"
                    type="number"
                    value={bookingRules.maxDailyBookings}
                    onChange={(e) => setBookingRules({ ...bookingRules, maxDailyBookings: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum appointments per day
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Avery's Voice & Greeting */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Avery's Voice & Greeting</h2>
                <p className="text-muted-foreground">
                  This is how Avery introduces your business.
                </p>
              </div>

              <div className="p-6 bg-accent/5 border border-accent/20 rounded-lg">
                <Label className="text-accent mb-2 block">Greeting Preview</Label>
                <p className="text-lg">
                  "Hi, this is Avery with{" "}
                  <span className="font-semibold text-accent">
                    {businessData.name || "{{Business Name}}"}
                  </span>
                  . How can I help you today?"
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customGreeting">Custom Greeting (Optional)</Label>
                <Textarea
                  id="customGreeting"
                  placeholder="Add any special instructions or custom greeting..."
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="p-4 border border-border/50 rounded-lg">
                <Label>Tone</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Professional (locked default)
                </p>
                <div className="inline-flex px-3 py-1 bg-muted/50 rounded-full text-sm">
                  Professional
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Integrations */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Integrations</h2>
                <p className="text-muted-foreground">
                  Connect the tools Avery needs to work for you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-xs text-muted-foreground">Required</p>
                      </div>
                    </div>
                    <Switch
                      checked={integrations.phone}
                      onCheckedChange={(checked) => setIntegrations({ ...integrations, phone: checked })}
                    />
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Calendar</p>
                        <p className="text-xs text-muted-foreground">Required</p>
                      </div>
                    </div>
                    <Switch
                      checked={integrations.calendar}
                      onCheckedChange={(checked) => setIntegrations({ ...integrations, calendar: checked })}
                    />
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Payments</p>
                        <p className="text-xs text-muted-foreground">Recommended</p>
                      </div>
                    </div>
                    <Switch
                      checked={integrations.payments}
                      onCheckedChange={(checked) => setIntegrations({ ...integrations, payments: checked })}
                    />
                  </div>
                </div>

                <div className="p-4 border border-border/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-xs text-muted-foreground">Optional</p>
                      </div>
                    </div>
                    <Switch
                      checked={integrations.sms}
                      onCheckedChange={(checked) => setIntegrations({ ...integrations, sms: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={testCall} variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Test Call with Avery
              </Button>
            </div>
          )}
        </GlassmorphismCard>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button onClick={handleNext}>
            {currentStep === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete Setup
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
