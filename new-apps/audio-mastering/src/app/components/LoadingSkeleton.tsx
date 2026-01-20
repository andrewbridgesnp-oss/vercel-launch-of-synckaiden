interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'track' | 'table';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ type = 'card', count = 3, className = '' }: LoadingSkeletonProps) {
  const shimmer = 'animate-pulse';

  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br from-[#1A1A24]/60 to-[#1C1626]/40 border border-[#D4AF37]/10 rounded-xl p-6 ${shimmer}`}
          >
            <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-lg mb-4"></div>
            <div className="h-6 bg-[#D4AF37]/20 rounded-md mb-3 w-3/4"></div>
            <div className="h-4 bg-[#D4AF37]/10 rounded-md mb-2 w-full"></div>
            <div className="h-4 bg-[#D4AF37]/10 rounded-md w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 bg-gradient-to-r from-[#1A1A24]/60 to-transparent border border-[#D4AF37]/10 rounded-lg ${shimmer}`}
          >
            <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#D4AF37]/20 rounded-md w-1/3"></div>
              <div className="h-3 bg-[#D4AF37]/10 rounded-md w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'track') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 bg-gradient-to-r from-[#1A1A24]/40 to-transparent border-l-4 border-[#D4AF37]/20 rounded-r-lg ${shimmer}`}
          >
            <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-md flex-shrink-0"></div>
            <div className="flex-1 h-16 bg-[#D4AF37]/10 rounded-md"></div>
            <div className="w-20 h-8 bg-[#D4AF37]/20 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className={`grid grid-cols-4 gap-4 p-4 bg-[#1A1A24]/60 border border-[#D4AF37]/20 rounded-t-lg ${shimmer}`}>
          <div className="h-4 bg-[#D4AF37]/30 rounded-md"></div>
          <div className="h-4 bg-[#D4AF37]/30 rounded-md"></div>
          <div className="h-4 bg-[#D4AF37]/30 rounded-md"></div>
          <div className="h-4 bg-[#D4AF37]/30 rounded-md"></div>
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-[#1A1A24]/30 to-transparent border-b border-[#D4AF37]/10 ${shimmer}`}
          >
            <div className="h-4 bg-[#D4AF37]/20 rounded-md"></div>
            <div className="h-4 bg-[#D4AF37]/20 rounded-md"></div>
            <div className="h-4 bg-[#D4AF37]/20 rounded-md"></div>
            <div className="h-4 bg-[#D4AF37]/20 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
