import { Phone, Calendar, DollarSign, CheckCircle } from "lucide-react";

interface TimelineStep {
  icon: "phone" | "calendar" | "payment" | "complete";
  label: string;
  time: string;
  status: "completed" | "current" | "pending";
}

interface CallTimelineProps {
  steps: TimelineStep[];
}

const iconMap = {
  phone: Phone,
  calendar: Calendar,
  payment: DollarSign,
  complete: CheckCircle
};

export function CallTimeline({ steps }: CallTimelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = iconMap[step.icon];
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === "completed"
                    ? "bg-accent/20 text-accent"
                    : step.status === "current"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 h-12 ${
                    step.status === "completed" ? "bg-accent/40" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <p className="font-medium">{step.label}</p>
              <p className="text-sm text-muted-foreground">{step.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
