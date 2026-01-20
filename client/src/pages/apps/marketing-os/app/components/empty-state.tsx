import { GlassCard } from "./glass-card";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <GlassCard className="p-12 text-center border-2 border-dashed border-primary/30">
      <div className="inline-flex rounded-full bg-primary/10 p-6 mb-4">
        <Icon className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-primary/80"
        >
          {actionLabel}
        </Button>
      )}
    </GlassCard>
  );
}
