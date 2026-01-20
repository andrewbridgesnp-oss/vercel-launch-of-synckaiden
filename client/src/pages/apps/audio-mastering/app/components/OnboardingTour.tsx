import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from './ui/button';

interface TourStep {
  title: string;
  description: string;
  target?: string; // CSS selector
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to KAIDEN ÉLITE',
    description: 'Your premium music production platform by Kaiden. Let\'s take a quick tour of the main features.',
  },
  {
    title: 'Multi-Track Editor',
    description: 'Create and edit multiple audio tracks with professional timeline editing. Drag, cut, and arrange your music with precision.',
  },
  {
    title: 'Effects Rack',
    description: 'Apply professional effects like EQ, reverb, delay, and compression to perfect your sound.',
  },
  {
    title: 'Virtual Instruments',
    description: 'Play and record with built-in instruments including piano, drum pads, and synthesizers.',
  },
  {
    title: 'AI Mastering',
    description: 'Use genre-specific AI mastering presets to give your tracks that professional polish.',
  },
  {
    title: 'Command Palette',
    description: 'Press Cmd+K (or Ctrl+K) anytime to quickly search and execute commands.',
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Use Space to play/pause, Cmd+S to save, Cmd+Z to undo, and many more professional shortcuts.',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
    if (hasSeenTour) {
      setIsVisible(false);
      onComplete();
    }
  }, [onComplete]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboardingTour', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboardingTour', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute -top-12 right-0 text-[#E5E4E2]/60 hover:text-[#D4AF37] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Main card */}
        <div className="bg-gradient-to-br from-[#1A1A24] via-[#1C1626] to-[#1A1A24] border-2 border-[#D4AF37]/30 rounded-2xl shadow-2xl shadow-[#D4AF37]/20 overflow-hidden">
          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                {TOUR_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4E4C1]'
                        : 'bg-[#D4AF37]/20'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[#D4AF37]/60 text-sm font-mono mb-2">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-[#E5E4E2] mb-4 leading-tight">
              {step.title}
            </h2>

            <p className="text-[#E5E4E2]/80 text-lg leading-relaxed mb-8">
              {step.description}
            </p>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="text-[#E5E4E2]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                Skip Tour
              </Button>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="border-[#D4AF37]/40 hover:border-[#D4AF37]/80 text-[#E5E4E2] hover:bg-[#D4AF37]/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8941C] hover:from-[#F4E4C1] hover:to-[#D4AF37] text-[#0A0A0F] font-semibold shadow-lg shadow-[#D4AF37]/40"
                >
                  {isLastStep ? (
                    <>
                      Get Started
                      <Check className="w-4 h-4 ml-2" />
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

          {/* Decorative element */}
          <div className="h-2 bg-gradient-to-r from-[#D4AF37] via-[#F4E4C1] to-[#D4AF37]"></div>
        </div>
      </div>
    </div>
  );
}