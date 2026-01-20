import { ReactNode } from "react";
import { Card } from "../ui/card";

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassmorphismCard({ children, className = "", hover = true }: GlassmorphismCardProps) {
  return (
    <Card
      className={`
        bg-card/30 backdrop-blur-md border-border/50
        ${hover ? "hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10" : ""}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </Card>
  );
}
