import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    businessGoals: "",
    teamSize: "",
  });

  const completeOnboarding = trpc.profile.completeOnboarding.useMutation({
    onSuccess: () => {
      toast.success("Welcome to kaiden! Your profile is all set.");
      onComplete();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    completeOnboarding.mutate(formData);
  };

  const canProceed = () => {
    if (step === 1) return true; // Welcome step
    if (step === 2) return formData.industry && formData.businessGoals;
    if (step === 3) return formData.teamSize;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass premium-card border-border/50 p-8 fade-in">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-12 bg-primary"
                  : s < step
                  ? "w-8 bg-primary/50"
                  : "w-8 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Sparkles className="h-16 w-16 gold-text glow-gold" />
            </div>
            <h1 className="text-4xl font-bold gold-shimmer">Welcome to kaiden</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Your AI business consultant is here to help you succeed. Let's personalize your experience in just 3 quick steps.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 glass rounded-lg border border-border/30">
                <CheckCircle2 className="h-8 w-8 silver-text mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Business Context</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about your industry and goals
                </p>
              </div>
              <div className="p-4 glass rounded-lg border border-border/30">
                <CheckCircle2 className="h-8 w-8 silver-text mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Team Details</h3>
                <p className="text-sm text-muted-foreground">
                  Share your team size and structure
                </p>
              </div>
              <div className="p-4 glass rounded-lg border border-border/30">
                <CheckCircle2 className="h-8 w-8 silver-text mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Personalization</h3>
                <p className="text-sm text-muted-foreground">
                  Get tailored recommendations
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Context */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2 gold-shimmer">Tell Us About Your Business</h2>
              <p className="text-muted-foreground">
                This helps kaiden provide relevant advice and insights
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName" className="text-base">
                  Company Name (Optional)
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Acme Corp"
                  className="mt-2 bg-background/50 border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="industry" className="text-base">
                  Industry *
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger className="mt-2 bg-background/50 border-border/50">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessGoals" className="text-base">
                  Business Goals *
                </Label>
                <Textarea
                  id="businessGoals"
                  value={formData.businessGoals}
                  onChange={(e) => setFormData({ ...formData, businessGoals: e.target.value })}
                  placeholder="e.g., Increase revenue by 30%, expand to new markets, improve customer retention..."
                  rows={4}
                  className="mt-2 bg-background/50 border-border/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Team Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2 gold-shimmer">About Your Team</h2>
              <p className="text-muted-foreground">
                Understanding your team helps kaiden scale advice appropriately
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="teamSize" className="text-base">
                  Team Size *
                </Label>
                <Select
                  value={formData.teamSize}
                  onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                >
                  <SelectTrigger className="mt-2 bg-background/50 border-border/50">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Just me (Solo)</SelectItem>
                    <SelectItem value="2-10">2-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-8 p-6 glass rounded-lg border border-primary/30">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 gold-text" />
                  What's Next?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 silver-text mt-0.5 flex-shrink-0" />
                    <span>kaiden will tailor responses based on your industry and goals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 silver-text mt-0.5 flex-shrink-0" />
                    <span>You'll get relevant business tools and recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 silver-text mt-0.5 flex-shrink-0" />
                    <span>Your preferences are saved and can be updated anytime</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border/30">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-border/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="elegant-button bg-primary hover:bg-primary/90 text-primary-foreground ml-auto"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed() || completeOnboarding.isPending}
              className="elegant-button bg-primary hover:bg-primary/90 text-primary-foreground ml-auto glow-gold"
            >
              {completeOnboarding.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
