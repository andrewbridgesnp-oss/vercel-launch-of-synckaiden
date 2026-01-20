import { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Play, Download, Loader2 } from 'lucide-react';
import { PresetVisualization } from './PresetVisualization';

export const MASTERING_PRESETS = {
  "Modern Pop": {
    description: "Bright, loud, and wide.",
    targetLufs: -14.0,
    color: "#D4AF37"
  },
  "Hip-Hop": {
    description: "Punchy low-end, solid mids.",
    targetLufs: -10.0,
    color: "#E8C5A5"
  },
  "Rock / Indie": {
    description: "Warm, dynamic, and powerful.",
    targetLufs: -12.0,
    color: "#F4E4C1"
  },
  "Electronic / EDM": {
    description: "Clean, tight, and extremely loud.",
    targetLufs: -8.0,
    color: "#50C878"
  },
  "Acoustic / Folk": {
    description: "Natural, warm, and dynamic.",
    targetLufs: -16.0,
    color: "#B8941C"
  }
};

interface MasteringControlsProps {
  disabled: boolean;
  onPreview: (presetName: string, intensity: number) => void;
  onMaster: (presetName: string, intensity: number) => void;
  isProcessing: boolean;
}

export function MasteringControls({ disabled, onPreview, onMaster, isProcessing }: MasteringControlsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("Modern Pop");
  const [intensity, setIntensity] = useState<number[]>([1.0]);

  const presetData = MASTERING_PRESETS[selectedPreset as keyof typeof MASTERING_PRESETS];

  return (
    <div className="space-y-6 sm:space-y-8 mb-6">
      {/* Luxury Genre Preset Selection */}
      <div className="relative">
        <label className="block text-[#E5E4E2] font-['Cormorant_Garamond'] text-lg mb-3 tracking-wide">Genre Preset</label>
        <div className="flex flex-col gap-3">
          <Select value={selectedPreset} onValueChange={setSelectedPreset} disabled={disabled}>
            <SelectTrigger className="bg-gradient-to-r from-[#1A1A24]/90 to-[#1C1626]/90 border-[#D4AF37]/30 text-[#E5E4E2] hover:border-[#D4AF37]/60 transition-all duration-300 backdrop-blur-sm h-12 shadow-lg shadow-[#D4AF37]/5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-b from-[#1A1A24] to-[#1C1626] border-[#D4AF37]/30 backdrop-blur-xl">
              {Object.keys(MASTERING_PRESETS).map((preset) => (
                <SelectItem 
                  key={preset} 
                  value={preset}
                  className="text-[#E5E4E2] hover:bg-gradient-to-r hover:from-[#D4AF37]/20 hover:to-[#B8941C]/20 focus:bg-gradient-to-r focus:from-[#D4AF37]/30 focus:to-[#B8941C]/30 cursor-pointer transition-all duration-200"
                >
                  {preset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#1A1A24]/50 to-transparent border-l-2 border-[#D4AF37]/40 rounded-r-lg">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg" 
              style={{ backgroundColor: presetData.color, boxShadow: `0 0 15px ${presetData.color}80` }}
            />
            <span className="text-[#E5E4E2]/70 text-sm tracking-wide font-light italic">{presetData.description}</span>
          </div>
        </div>
      </div>

      {/* Luxury Intensity Slider */}
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <label className="text-[#E5E4E2] font-['Cormorant_Garamond'] text-lg tracking-wide">Intensity</label>
          <span className="text-[#D4AF37] font-bold text-xl font-mono tracking-wider bg-gradient-to-r from-[#D4AF37]/10 to-transparent px-4 py-1 rounded-full border border-[#D4AF37]/30">
            {Math.round(intensity[0] * 100)}%
          </span>
        </div>
        <Slider
          value={intensity}
          onValueChange={setIntensity}
          min={0.1}
          max={1.5}
          step={0.1}
          disabled={disabled}
          className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-[#D4AF37] [&_[role=slider]]:to-[#F4E4C1] [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-[#D4AF37]/50 [&_[role=slider]]:border-2 [&_[role=slider]]:border-[#D4AF37]/50"
        />
        <div className="flex justify-between text-xs text-[#E5E4E2]/40 mt-2 font-mono">
          <span>10%</span>
          <span className="text-[#D4AF37]/60">100%</span>
          <span>150%</span>
        </div>
      </div>

      {/* Luxury Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Button
          onClick={() => onPreview(selectedPreset, intensity[0])}
          disabled={disabled || isProcessing}
          className="bg-gradient-to-r from-[#1A1A24] to-[#1C1626] hover:from-[#D4AF37]/20 hover:to-[#B8941C]/20 border-2 border-[#D4AF37]/40 hover:border-[#D4AF37]/80 text-[#E5E4E2] font-semibold py-6 sm:py-7 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/20 group"
        >
          <Play className="w-5 h-5 mr-2 group-hover:text-[#D4AF37] transition-colors" />
          <span className="tracking-wider">PREVIEW (10s)</span>
        </Button>
        
        <Button
          onClick={() => onMaster(selectedPreset, intensity[0])}
          disabled={disabled || isProcessing}
          className="bg-gradient-to-r from-[#D4AF37] to-[#B8941C] hover:from-[#F4E4C1] hover:to-[#D4AF37] text-[#0A0A0F] font-bold py-6 sm:py-7 transition-all duration-300 shadow-2xl shadow-[#D4AF37]/40 hover:shadow-[#D4AF37]/60 hover:scale-[1.02] transform"
        >
          {isProcessing ? 
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 
            <Download className="w-5 h-5 mr-2" />
          }
          <span className="tracking-widest font-['Cormorant_Garamond'] text-lg">MASTER & SAVE</span>
        </Button>
      </div>

      {/* Luxury Preset Details */}
      <div className="p-5 bg-gradient-to-br from-[#1A1A24]/60 via-[#1C1626]/40 to-transparent border border-[#D4AF37]/20 rounded-xl backdrop-blur-sm shadow-xl">
        <h3 className="text-base font-['Cormorant_Garamond'] text-[#D4AF37] mb-4 tracking-widest flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-[#D4AF37] to-transparent"></div>
          PRESET DETAILS
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[#E5E4E2]/50 text-xs tracking-wider">Target LUFS</span>
            <span className="text-[#E5E4E2] font-mono text-lg font-bold">{presetData.targetLufs} <span className="text-[#D4AF37]/60 text-xs">dB</span></span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#E5E4E2]/50 text-xs tracking-wider">Genre</span>
            <span className="text-[#E5E4E2] font-medium tracking-wide">{selectedPreset}</span>
          </div>
        </div>
      </div>

      {/* Preset Visualization */}
      <PresetVisualization presetName={selectedPreset} intensity={intensity[0]} />
    </div>
  );
}