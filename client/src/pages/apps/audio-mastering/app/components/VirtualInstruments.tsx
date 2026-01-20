import { useState } from 'react';
import { Music, Drum, Waves } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

export function VirtualInstruments() {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const pianoKeys = [
    { note: 'C', type: 'white', label: 'C4' },
    { note: 'C#', type: 'black', label: 'C#4' },
    { note: 'D', type: 'white', label: 'D4' },
    { note: 'D#', type: 'black', label: 'D#4' },
    { note: 'E', type: 'white', label: 'E4' },
    { note: 'F', type: 'white', label: 'F4' },
    { note: 'F#', type: 'black', label: 'F#4' },
    { note: 'G', type: 'white', label: 'G4' },
    { note: 'G#', type: 'black', label: 'G#4' },
    { note: 'A', type: 'white', label: 'A4' },
    { note: 'A#', type: 'black', label: 'A#4' },
    { note: 'B', type: 'white', label: 'B4' },
  ];

  const drumPads = [
    { id: 1, name: 'Kick', color: '#FF6B6B', key: 'Q' },
    { id: 2, name: 'Snare', color: '#4ECDC4', key: 'W' },
    { id: 3, name: 'Hi-Hat', color: '#45B7D1', key: 'E' },
    { id: 4, name: 'Clap', color: '#96CEB4', key: 'R' },
    { id: 5, name: 'Tom 1', color: '#FFEAA7', key: 'A' },
    { id: 6, name: 'Tom 2', color: '#DFE6E9', key: 'S' },
    { id: 7, name: 'Crash', color: '#A29BFE', key: 'D' },
    { id: 8, name: 'Ride', color: '#FD79A8', key: 'F' },
    { id: 9, name: 'Perc 1', color: '#FDCB6E', key: 'Z' },
    { id: 10, name: 'Perc 2', color: '#6C5CE7', key: 'X' },
    { id: 11, name: 'FX 1', color: '#00B894', key: 'C' },
    { id: 12, name: 'FX 2', color: '#E17055', key: 'V' },
  ];

  const [activePad, setActivePad] = useState<number | null>(null);
  const [synthParams, setSynthParams] = useState({
    attack: 10,
    decay: 30,
    sustain: 70,
    release: 40,
    cutoff: 60,
    resonance: 30,
  });

  const playNote = (note: string) => {
    setActiveNote(note);
    setTimeout(() => setActiveNote(null), 200);
  };

  const triggerPad = (padId: number) => {
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 150);
  };

  return (
    <div className="h-full bg-[#1A1A1A] p-4 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-[#00FFAA] mb-4">Virtual Instruments</h2>

        <Tabs defaultValue="piano" className="w-full">
          <TabsList className="bg-[#252525] border-b border-gray-700 w-full justify-start">
            <TabsTrigger value="piano" className="data-[state=active]:bg-[#00FFAA] data-[state=active]:text-black">
              <Music className="w-4 h-4 mr-2" />
              Piano
            </TabsTrigger>
            <TabsTrigger value="drums" className="data-[state=active]:bg-[#00FFAA] data-[state=active]:text-black">
              <Drum className="w-4 h-4 mr-2" />
              Drum Pads
            </TabsTrigger>
            <TabsTrigger value="synth" className="data-[state=active]:bg-[#00FFAA] data-[state=active]:text-black">
              <Waves className="w-4 h-4 mr-2" />
              Synthesizer
            </TabsTrigger>
          </TabsList>

          {/* Piano Roll */}
          <TabsContent value="piano" className="space-y-6 mt-6">
            <div className="bg-[#252525] rounded-lg p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Virtual Piano</h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">Octave: <span className="text-white">4</span></div>
                  <div className="text-sm text-gray-400">Velocity: <span className="text-white">100</span></div>
                </div>
              </div>

              {/* Piano Keyboard */}
              <div className="relative h-64 flex justify-center">
                <div className="relative flex">
                  {pianoKeys.map((key, index) => (
                    <div key={key.label} className="relative">
                      {key.type === 'white' ? (
                        <button
                          onClick={() => playNote(key.label)}
                          className={`w-16 h-64 border-2 border-gray-700 rounded-b-lg transition-all ${
                            activeNote === key.label
                              ? 'bg-[#00FFAA] border-[#00FFAA]'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-600">
                            {key.note}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => playNote(key.label)}
                          className={`absolute w-10 h-40 -ml-5 z-10 rounded-b-lg transition-all ${
                            activeNote === key.label
                              ? 'bg-[#00FFAA] border-[#00FFAA]'
                              : 'bg-gray-900 hover:bg-gray-800'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Piano Roll Grid */}
              <div className="mt-6 bg-[#1A1A1A] rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Piano Roll (MIDI Editor)</div>
                <div className="h-48 bg-[#0F0F0F] rounded border border-gray-800 relative overflow-auto">
                  {/* Grid */}
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className="h-8 border-b border-gray-800 relative"
                    >
                      {Array.from({ length: 16 }, (_, j) => (
                        <div
                          key={j}
                          className="absolute h-full border-l border-gray-800"
                          style={{ left: `${(j / 16) * 100}%`, width: `${100 / 16}%` }}
                        />
                      ))}
                    </div>
                  ))}
                  {/* Sample notes */}
                  <div className="absolute top-16 left-[12.5%] w-[12.5%] h-8 bg-[#00FFAA] opacity-70 rounded" />
                  <div className="absolute top-24 left-[25%] w-[12.5%] h-8 bg-[#00FFAA] opacity-70 rounded" />
                  <div className="absolute top-32 left-[37.5%] w-[12.5%] h-8 bg-[#00FFAA] opacity-70 rounded" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Drum Pads */}
          <TabsContent value="drums" className="space-y-6 mt-6">
            <div className="bg-[#252525] rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Drum Machine</h3>
                <p className="text-sm text-gray-400 mt-1">Click pads or use keyboard shortcuts</p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {drumPads.map((pad) => (
                  <button
                    key={pad.id}
                    onClick={() => triggerPad(pad.id)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all transform ${
                      activePad === pad.id ? 'scale-95 brightness-125' : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: pad.color,
                      opacity: activePad === pad.id ? 1 : 0.8,
                    }}
                  >
                    <span className="text-white font-bold text-lg">{pad.name}</span>
                    <span className="text-white/70 text-sm font-mono">{pad.key}</span>
                  </button>
                ))}
              </div>

              {/* Sequencer */}
              <div className="mt-6 bg-[#1A1A1A] rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-3">Step Sequencer</div>
                <div className="space-y-2">
                  {['Kick', 'Snare', 'Hi-Hat', 'Clap'].map((instrument) => (
                    <div key={instrument} className="flex items-center gap-2">
                      <div className="w-16 text-xs text-gray-400">{instrument}</div>
                      <div className="flex gap-1 flex-1">
                        {Array.from({ length: 16 }, (_, i) => (
                          <button
                            key={i}
                            className={`flex-1 h-8 rounded ${
                              i % 4 === 0 ? 'bg-gray-700' : 'bg-gray-800'
                            } hover:bg-[#00FFAA] transition-colors`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Synthesizer */}
          <TabsContent value="synth" className="space-y-6 mt-6">
            <div className="bg-[#252525] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Analog Synthesizer</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* ADSR Envelope */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-[#00FFAA]">ADSR Envelope</h4>
                  {['attack', 'decay', 'sustain', 'release'].map((param) => (
                    <div key={param} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-400 capitalize">{param}</label>
                        <span className="text-sm text-[#00FFAA] font-mono">
                          {synthParams[param as keyof typeof synthParams]}
                        </span>
                      </div>
                      <Slider
                        value={[synthParams[param as keyof typeof synthParams]]}
                        onValueChange={(v) => setSynthParams({ ...synthParams, [param]: v[0] })}
                        max={100}
                        className="w-full"
                      />
                    </div>
                  ))}

                  {/* ADSR Visual */}
                  <div className="h-32 bg-[#1A1A1A] rounded-lg p-4 mt-4">
                    <svg className="w-full h-full">
                      <path
                        d={`M 0 100 L ${synthParams.attack} 0 L ${synthParams.attack + synthParams.decay} ${100 - synthParams.sustain} L 70 ${100 - synthParams.sustain} L ${70 + synthParams.release} 100`}
                        stroke="#00FFAA"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>

                {/* Filter */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-[#00FFAA]">Filter</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-400">Cutoff</label>
                      <span className="text-sm text-[#00FFAA] font-mono">{synthParams.cutoff}</span>
                    </div>
                    <Slider
                      value={[synthParams.cutoff]}
                      onValueChange={(v) => setSynthParams({ ...synthParams, cutoff: v[0] })}
                      max={100}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-400">Resonance</label>
                      <span className="text-sm text-[#00FFAA] font-mono">{synthParams.resonance}</span>
                    </div>
                    <Slider
                      value={[synthParams.resonance]}
                      onValueChange={(v) => setSynthParams({ ...synthParams, resonance: v[0] })}
                      max={100}
                      className="w-full"
                    />
                  </div>

                  {/* Oscilloscope */}
                  <div className="h-32 bg-[#1A1A1A] rounded-lg p-4 mt-4">
                    <svg className="w-full h-full">
                      <path
                        d={`M 0 ${50 + Math.sin(0) * 20} ${Array.from({ length: 100 }, (_, i) => 
                          `L ${i} ${50 + Math.sin(i * 0.3) * (20 * synthParams.cutoff / 100)}`
                        ).join(' ')}`}
                        stroke="#00FFAA"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* Waveform selector */}
                  <div className="flex gap-2 mt-4">
                    {['Sine', 'Square', 'Saw', 'Triangle'].map((wave) => (
                      <Button
                        key={wave}
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-gray-800 border-gray-600 hover:bg-[#00FFAA] hover:text-black"
                      >
                        {wave}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
