import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to Kaiden! 🎉",
    description: "Let's take a quick tour of your new AI-powered business platform. This will only take 30 seconds.",
  },
  {
    title: "Search Everything",
    description: "Use the search bar to quickly find tools, contacts, orders, and more. Try typing 'CRM' or 'orders'.",
  },
  {
    title: "Real-Time Notifications",
    description: "Get instant alerts for new orders, form submissions, and workflow completions. Click the bell icon anytime.",
  },
  {
    title: "Quick Actions",
    description: "Access your most-used tools instantly. Toggle between grid and list views to find what works best for you.",
  },
  {
    title: "You're All Set! 🚀",
    description: "Start exploring Kaiden's 300+ capabilities. Need help? Chat with our AI consultant anytime.",
  },
];

export function OnboardingTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("kayden_tour_completed");
    if (tourCompleted) {
      setShow(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("kayden_tour_completed", "true");
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={handleSkip} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <Card className="p-6 shadow-2xl border-2 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">{step.title}</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">{step.description}</p>
          <div className="flex gap-1 mb-6">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i === currentStep ? "bg-primary" : i < currentStep ? "bg-primary/50" : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleSkip}>Skip Tour</Button>
            <div className="flex gap-2">
              {!isFirst && (
                <Button variant="outline" onClick={handlePrev}>
                  <ArrowLeft className="w-4 h-4 mr-1" />Back
                </Button>
              )}
              <Button onClick={handleNext}>
                {isLast ? "Get Started" : "Next"}
                {!isLast && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
