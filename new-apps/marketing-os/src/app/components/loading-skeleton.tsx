import { GlassCard } from "./glass-card";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="p-6">
            <div className="h-4 bg-accent rounded w-1/2 mb-4" />
            <div className="h-8 bg-accent rounded w-3/4 mb-2" />
            <div className="h-3 bg-accent rounded w-1/3" />
          </GlassCard>
        ))}
      </div>
      
      <GlassCard className="p-6">
        <div className="h-6 bg-accent rounded w-1/4 mb-4" />
        <div className="h-64 bg-accent rounded" />
      </GlassCard>
    </div>
  );
}
