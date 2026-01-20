import { cn } from "./ui/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border backdrop-blur-xl shadow-2xl",
        "bg-[rgba(15,23,42,0.4)] border-[rgba(192,200,216,0.15)]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        hover && "transition-all duration-300 hover:bg-[rgba(15,23,42,0.6)] hover:border-[rgba(192,200,216,0.25)] hover:shadow-[0_12px_48px_rgba(192,200,216,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}