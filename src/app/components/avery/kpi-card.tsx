import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function KPICard({ title, value, change, icon: Icon, trend = "neutral" }: KPICardProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold">{value}</p>
          {change && (
            <p className={`text-sm ${trendColors[trend]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-accent/10 rounded-lg">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      </div>
    </Card>
  );
}
