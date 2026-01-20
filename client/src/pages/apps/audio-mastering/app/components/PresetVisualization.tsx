import { Activity, Waves, Zap } from 'lucide-react';

interface PresetVisualizationProps {
  presetName: string;
  intensity: number;
}

const PRESET_TECHNICAL_DETAILS = {
  "Modern Pop": {
    eqBands: [
      { freq: "80 Hz", gain: -1.5, label: "Clean mud" },
      { freq: "200 Hz", gain: 1.0, label: "Warmth" },
      { freq: "1.5 kHz", gain: 2.0, label: "Presence" },
      { freq: "6 kHz", gain: 3.5, label: "Air" },
    ],
    compression: "4:1 ratio, -18dB threshold",
    limiter: "-1.5dB",
  },
  "Hip-Hop": {
    eqBands: [
      { freq: "60 Hz", gain: 2.5, label: "Sub-bass" },
      { freq: "250 Hz", gain: -2.0, label: "Mud cut" },
      { freq: "1 kHz", gain: 1.0, label: "Body" },
      { freq: "5 kHz", gain: 1.5, label: "Vocal" },
    ],
    compression: "5:1 ratio, -15dB threshold",
    limiter: "-1.0dB",
  },
  "Rock / Indie": {
    eqBands: [
      { freq: "100 Hz", gain: 1.5, label: "Weight" },
      { freq: "400 Hz", gain: -1.0, label: "Mud cut" },
      { freq: "2 kHz", gain: 2.5, label: "Crunch" },
      { freq: "8 kHz", gain: 2.0, label: "Sparkle" },
    ],
    compression: "3.5:1 ratio, -20dB threshold",
    limiter: "-1.2dB",
  },
  "Electronic / EDM": {
    eqBands: [
      { freq: "50 Hz", gain: 3.0, label: "Sub drop" },
      { freq: "300 Hz", gain: -2.5, label: "Mud cut" },
      { freq: "3 kHz", gain: 1.5, label: "Synth" },
      { freq: "10 kHz", gain: 4.0, label: "Sizzle" },
    ],
    compression: "6:1 ratio, -12dB threshold",
    limiter: "-0.8dB",
  },
  "Acoustic / Folk": {
    eqBands: [
      { freq: "120 Hz", gain: 1.0, label: "Body" },
      { freq: "350 Hz", gain: -1.5, label: "Box cut" },
      { freq: "2.5 kHz", gain: 2.0, label: "Detail" },
      { freq: "7 kHz", gain: 1.5, label: "Air" },
    ],
    compression: "2.5:1 ratio, -22dB threshold",
    limiter: "-2.0dB",
  },
};

export function PresetVisualization({ presetName, intensity }: PresetVisualizationProps) {
  const details = PRESET_TECHNICAL_DETAILS[presetName as keyof typeof PRESET_TECHNICAL_DETAILS];

  return (
    <div className="mt-4 p-3 sm:p-4 bg-gray-900/40 border border-gray-700 rounded-lg space-y-3 sm:space-y-4">
      <h3 className="text-sm font-bold text-[#00FFAA] flex items-center gap-2">
        <Activity className="w-4 h-4" />
        Processing Chain
      </h3>

      {/* EQ Bands */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Waves className="w-3 h-3" />
          <span className="font-semibold">Parametric EQ:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {details.eqBands.map((band, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs bg-gray-800/50 rounded px-2 py-1.5">
              <span className="text-gray-400 min-w-[50px]">{band.freq}</span>
              <div className="flex items-center gap-1 flex-wrap">
                <span className={band.gain > 0 ? "text-green-400" : "text-orange-400"}>
                  {band.gain > 0 ? '+' : ''}{(band.gain * intensity).toFixed(1)} dB
                </span>
                <span className="text-gray-500 hidden sm:inline">·</span>
                <span className="text-gray-500 text-[10px]">{band.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compression & Limiting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
        <div className="bg-gray-800/50 rounded px-3 py-2">
          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            <Zap className="w-3 h-3" />
            <span className="font-semibold">Compression:</span>
          </div>
          <p className="text-white text-xs">{details.compression}</p>
        </div>
        <div className="bg-gray-800/50 rounded px-3 py-2">
          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            <Zap className="w-3 h-3" />
            <span className="font-semibold">Limiter:</span>
          </div>
          <p className="text-white text-xs">{details.limiter}</p>
        </div>
      </div>
    </div>
  );
}