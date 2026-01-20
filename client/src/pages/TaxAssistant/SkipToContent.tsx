
import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-kaiden-gold focus:text-white focus:rounded-xl focus:shadow-2xl font-bold"
    >
      Skip to content
    </a>
  );
};
