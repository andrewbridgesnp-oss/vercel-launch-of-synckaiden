import { useState } from 'react';
import { Plus, X, Power, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Effect {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  expanded: boolean;
  params: { [key: string]: number };
}

const effectTypes = [
  { value: 'eq', label: 'Equalizer', params: ['low', 'mid', 'high'] },
  { value: 'reverb', label: 'Reverb', params: ['size', 'decay', 'mix'] },
  { value: 'delay', label: 'Delay', params: ['time', 'feedback', 'mix'] },
  { value: 'chorus', label: 'Chorus', params: ['rate', 'depth', 'mix'] },
  { value: 'distortion', label: 'Distortion', params: ['drive', 'tone', 'mix'] },
  { value: 'compressor', label: 'Compressor', params: ['threshold', 'ratio', 'attack', 'release'] },
  { value: 'limiter', label: 'Limiter', params: ['threshold', 'ceiling', 'release'] },
  { value: 'phaser', label: 'Phaser', params: ['rate', 'depth', 'feedback'] },
];

export function EffectsRack() {
  const [effects, setEffects] = useState<Effect[]>([
    {
      id: '1',
      type: 'eq',
      name: 'Equalizer',
      enabled: true,
      expanded: true,
      params: { low: 50, mid: 50, high: 50 }
    },
    {
      id: '2',
      type: 'compressor',
      name: 'Compressor',
      enabled: true,
      expanded: false,
      params: { threshold: 60, ratio: 50, attack: 30, release: 40 }
    }
  ]);

  const [selectedEffectType, setSelectedEffectType] = useState('');

  const addEffect = () => {
    if (!selectedEffectType) return;
    
    const effectType = effectTypes.find(e => e.value === selectedEffectType);
    if (!effectType) return;

    const newEffect: Effect = {
      id: Date.now().toString(),
      type: effectType.value,
      name: effectType.label,
      enabled: true,
      expanded: true,
      params: effectType.params.reduce((acc, param) => ({ ...acc, [param]: 50 }), {})
    };

    setEffects([...effects, newEffect]);
    setSelectedEffectType('');
  };

  const removeEffect = (id: string) => {
    setEffects(effects.filter(e => e.id !== id));
  };

  const toggleEffect = (id: string) => {
    setEffects(effects.map(e => 
      e.id === id ? { ...e, enabled: !e.enabled } : e
    ));
  };

  const toggleExpanded = (id: string) => {
    setEffects(effects.map(e => 
      e.id === id ? { ...e, expanded: !e.expanded } : e
    ));
  };

  const updateParam = (id: string, param: string, value: number) => {
    setEffects(effects.map(e => 
      e.id === id ? { ...e, params: { ...e.params, [param]: value } } : e
    ));
  };

  return (
    <div className="h-full bg-[#1A1A1A] p-4 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#00FFAA]">Effects Rack</h2>
          <div className="flex items-center gap-2">
            <Select value={selectedEffectType} onValueChange={setSelectedEffectType}>
              <SelectTrigger className="w-40 bg-[#252525] border-gray-700">
                <SelectValue placeholder="Add effect..." />
              </SelectTrigger>
              <SelectContent className="bg-[#252525] border-gray-700">
                {effectTypes.map((effect) => (
                  <SelectItem key={effect.value} value={effect.value}>
                    {effect.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={addEffect}
              disabled={!selectedEffectType}
              className="bg-[#00FFAA] text-black hover:bg-[#00DD99]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {effects.map((effect, index) => (
            <div
              key={effect.id}
              className={`bg-[#252525] rounded-lg border ${
                effect.enabled ? 'border-[#00FFAA]' : 'border-gray-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="text-gray-500 font-mono text-sm">{index + 1}</div>
                  <button
                    onClick={() => toggleEffect(effect.id)}
                    className={`p-1 rounded ${
                      effect.enabled ? 'bg-[#00FFAA] text-black' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                  </button>
                  <span className={`font-semibold ${effect.enabled ? 'text-white' : 'text-gray-500'}`}>
                    {effect.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpanded(effect.id)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    {effect.expanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => removeEffect(effect.id)}
                    className="p-1 hover:bg-red-900/20 rounded"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Parameters */}
              {effect.expanded && (
                <div className="p-4 space-y-4">
                  {Object.entries(effect.params).map(([param, value]) => (
                    <div key={param} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400 capitalize">{param}</label>
                        <span className="text-sm text-[#00FFAA] font-mono">{value}</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={(v) => updateParam(effect.id, param, v[0])}
                        max={100}
                        disabled={!effect.enabled}
                        className="w-full"
                      />
                    </div>
                  ))}

                  {/* Visual representation based on effect type */}
                  {effect.type === 'eq' && (
                    <div className="mt-4 h-32 bg-[#1A1A1A] rounded-lg p-4 relative">
                      <svg className="w-full h-full">
                        <path
                          d={`M 0 ${128 - effect.params.low} Q 33 ${128 - effect.params.low} 33 ${128 - effect.params.mid} T 66 ${128 - effect.params.high} L 100 ${128 - effect.params.high}`}
                          stroke="#00FFAA"
                          strokeWidth="2"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                        <span>Low</span>
                        <span>Mid</span>
                        <span>High</span>
                      </div>
                    </div>
                  )}

                  {effect.type === 'compressor' && (
                    <div className="mt-4 grid grid-cols-2 gap-4 p-3 bg-[#1A1A1A] rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#00FFAA]">
                          {(effect.params.ratio / 10).toFixed(1)}:1
                        </div>
                        <div className="text-xs text-gray-500">Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#00FFAA]">
                          -{100 - effect.params.threshold}dB
                        </div>
                        <div className="text-xs text-gray-500">Threshold</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {effects.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No effects added yet</p>
              <p className="text-sm mt-2">Select an effect type above to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
