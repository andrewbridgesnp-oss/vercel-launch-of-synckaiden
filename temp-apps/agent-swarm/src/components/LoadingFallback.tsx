import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingFallback({ 
  message = 'Loading...', 
  fullScreen = false 
}: LoadingFallbackProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
        <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
      </div>
      <div className="text-center">
        <p className="text-white font-medium mb-1">{message}</p>
        <p className="text-blue-400 text-sm">Please wait...</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  );
}

// Skeleton loader for cards
export function SkeletonCard() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-500/20 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-blue-500/20 rounded w-3/4 mb-2" />
          <div className="h-3 bg-blue-500/10 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-blue-500/10 rounded" />
        <div className="h-3 bg-blue-500/10 rounded w-5/6" />
        <div className="h-3 bg-blue-500/10 rounded w-4/6" />
      </div>
    </div>
  );
}

// Skeleton loader for dashboard grid
export function SkeletonDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
