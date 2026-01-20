import { Info } from 'lucide-react';

interface StatusBarProps {
  status: string;
}

export function StatusBar({ status }: StatusBarProps) {
  const isSuccess = status.includes('✅');
  const isError = status.toLowerCase().includes('error');
  const isProcessing = status.toLowerCase().includes('processing') || status.toLowerCase().includes('please wait');

  return (
    <div className={`
      w-full p-4 rounded-xl border flex items-center gap-3 backdrop-blur-sm transition-all duration-300 shadow-lg
      ${isSuccess ? 'bg-gradient-to-r from-[#50C878]/20 via-[#50C878]/10 to-transparent border-[#50C878]/40 text-[#50C878] shadow-[#50C878]/20' : ''}
      ${isError ? 'bg-gradient-to-r from-[#E0115F]/20 via-[#E0115F]/10 to-transparent border-[#E0115F]/40 text-[#E0115F] shadow-[#E0115F]/20' : ''}
      ${isProcessing ? 'bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent border-[#D4AF37]/40 text-[#D4AF37] shadow-[#D4AF37]/20 animate-pulse' : ''}
      ${!isSuccess && !isError && !isProcessing ? 'bg-gradient-to-r from-[#1A1A24]/60 to-transparent border-[#E5E4E2]/20 text-[#E5E4E2]/70' : ''}
    `}>
      <Info className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm tracking-wide font-medium">{status}</span>
    </div>
  );
}