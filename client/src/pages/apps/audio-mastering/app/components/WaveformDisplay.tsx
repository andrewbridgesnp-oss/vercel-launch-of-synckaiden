import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface WaveformDisplayProps {
  audioFile?: File;
  color?: string;
  height?: number;
  className?: string;
}

export function WaveformDisplay({ 
  audioFile, 
  color = '#D4AF37', 
  height = 120,
  className = ''
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    if (!audioFile) {
      setWaveformData([]);
      return;
    }

    const generateWaveform = async () => {
      setIsLoading(true);
      
      try {
        // Simulate audio analysis (in production, use Web Audio API)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock waveform data (200 sample points)
        const samples = 200;
        const data: number[] = [];
        
        for (let i = 0; i < samples; i++) {
          // Create realistic waveform shape
          const position = i / samples;
          const envelope = Math.sin(position * Math.PI); // Fade in/out
          const detail = Math.sin(position * 50) * 0.3 + Math.random() * 0.2;
          data.push((envelope * detail + 0.5) * 0.8);
        }
        
        setWaveformData(data);
      } catch (error) {
        console.error('Error generating waveform:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateWaveform();
  }, [audioFile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const centerY = rect.height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, rect.height);
    
    // Draw waveform
    const barWidth = width / waveformData.length;
    
    waveformData.forEach((amplitude, index) => {
      const x = index * barWidth;
      const barHeight = amplitude * centerY;
      
      // Create gradient for each bar
      const gradient = ctx.createLinearGradient(x, centerY - barHeight, x, centerY + barHeight);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color + 'CC');
      gradient.addColorStop(1, color);
      
      ctx.fillStyle = gradient;
      
      // Draw top half
      ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight);
      // Draw bottom half (mirror)
      ctx.fillRect(x, centerY, barWidth - 1, barHeight);
    });
    
    // Draw center line
    ctx.strokeStyle = color + '40';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
  }, [waveformData, color]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px` }}
        className="bg-gradient-to-br from-[#1A1A24]/60 via-[#1C1626]/40 to-transparent rounded-xl border border-[#D4AF37]/20"
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A24]/80 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            <span className="text-[#E5E4E2]/70 text-sm">Analyzing waveform...</span>
          </div>
        </div>
      )}
      
      {!audioFile && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[#E5E4E2]/40 text-sm italic">No audio loaded</span>
        </div>
      )}
    </div>
  );
}
