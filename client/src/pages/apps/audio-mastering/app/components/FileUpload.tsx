import { useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFileName?: string;
}

export function FileUpload({ onFileSelect, selectedFileName }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      onFileSelect(file);
    }
  };

  return (
    <div className="mb-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".wav,.mp3,.aiff,.flac,audio/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload audio file"
      />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`w-full border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.02]'
            : 'border-[#D4AF37]/40 hover:border-[#D4AF37]/80 bg-gradient-to-r from-[#1A1A24] to-[#1C1626]'
        }`}
      >
        <div className="relative overflow-hidden py-12 px-6">
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent ${isDragging ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 animate-shimmer`}></div>
          
          <div className="relative flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941C]/20 border border-[#D4AF37]/30 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
              <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-[#D4AF37]' : 'text-[#E5E4E2]/70'}`} />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-['Cormorant_Garamond'] text-[#E5E4E2] mb-2">
                {isDragging ? 'Drop your file here' : 'Drag & drop your audio file'}
              </p>
              <p className="text-sm text-[#E5E4E2]/50">
                or click to browse • WAV, MP3, AIFF, FLAC
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center min-h-[32px]">
        {selectedFileName ? (
          <div className="flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-transparent via-[#1A1A24]/50 to-transparent border-y border-[#D4AF37]/20">
            <File className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm text-[#E5E4E2] tracking-wide font-medium">{selectedFileName}</span>
            <div className="w-2 h-2 rounded-full bg-[#50C878] shadow-[0_0_10px_rgba(80,200,120,0.7)] animate-pulse"></div>
          </div>
        ) : (
          <p className="text-[#E5E4E2]/40 text-sm italic tracking-wide">No file selected</p>
        )}
      </div>
    </div>
  );
}