import React from 'react';
import { FileQuestion, Search, Wifi, AlertTriangle } from 'lucide-react';

interface EmptyStateProps {
  type: 'no_data' | 'no_results' | '404' | '500' | 'offline';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const getDefaultContent = () => {
    switch (type) {
      case 'no_data':
        return {
          icon: <FileQuestion className="w-16 h-16 text-silver-400" />,
          title: 'No Data Yet',
          description: 'Get started by documenting your first visit.',
          actionLabel: 'Start Visit',
        };
      case 'no_results':
        return {
          icon: <Search className="w-16 h-16 text-silver-400" />,
          title: 'No Results Found',
          description: 'Try adjusting your search or filter criteria.',
          actionLabel: 'Clear Filters',
        };
      case '404':
        return {
          icon: <FileQuestion className="w-16 h-16 text-silver-400" />,
          title: 'Page Not Found',
          description: "The page you're looking for doesn't exist or has been moved.",
          actionLabel: 'Go to Dashboard',
        };
      case '500':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-red-500" />,
          title: 'Something Went Wrong',
          description: "We're working to fix the issue. Please try again in a moment.",
          actionLabel: 'Retry',
        };
      case 'offline':
        return {
          icon: <Wifi className="w-16 h-16 text-orange-500" />,
          title: "You're Offline",
          description: "Check your internet connection and try again.",
          actionLabel: "Retry Connection",
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;
  const finalActionLabel = actionLabel || defaultContent.actionLabel;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">{defaultContent.icon}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-navy-900 mb-3">{finalTitle}</h2>

        {/* Description */}
        <p className="text-silver-600 mb-6">{finalDescription}</p>

        {/* Action Button */}
        {onAction && finalActionLabel && (
          <button
            onClick={onAction}
            className="bg-navy-800 hover:bg-navy-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {finalActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
