
import React from 'react';

export const DemoWatermark: React.FC = () => {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-[0.03] select-none">
      <div className="text-[15vw] font-serif font-black tracking-tighter rotate-[-30deg]">
        KAIDEN
      </div>
    </div>
  );
};
