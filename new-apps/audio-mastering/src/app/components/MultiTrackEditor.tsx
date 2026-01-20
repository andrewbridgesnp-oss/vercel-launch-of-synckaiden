import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Scissors, Copy, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface Track {
  id: string;
  name: string;
  color: string;
  volume: number;
  pan: number;
  solo: boolean;
  mute: boolean;
  regions: AudioRegion[];
}

interface AudioRegion {
  id: string;
  start: number;
  duration: number;
  offset: number;
  name: string;
}

export function MultiTrackEditor() {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'Vocals',
      color: '#FF6B6B',
      volume: 75,
      pan: 0,
      solo: false,
      mute: false,
      regions: [
        { id: 'r1', start: 0, duration: 120, offset: 0, name: 'vocal_take1.wav' }
      ]
    },
    {
      id: '2',
      name: 'Drums',
      color: '#4ECDC4',
      volume: 80,
      pan: 0,
      solo: false,
      mute: false,
      regions: [
        { id: 'r2', start: 0, duration: 120, offset: 0, name: 'drums_loop.wav' }
      ]
    },
    {
      id: '3',
      name: 'Bass',
      color: '#95E1D3',
      volume: 70,
      pan: 0,
      solo: false,
      mute: false,
      regions: [
        { id: 'r3', start: 20, duration: 100, offset: 0, name: 'bass_line.wav' }
      ]
    },
    {
      id: '4',
      name: 'Synth',
      color: '#FFE66D',
      volume: 65,
      pan: 20,
      solo: false,
      mute: false,
      regions: [
        { id: 'r4', start: 40, duration: 80, offset: 0, name: 'synth_pad.wav' }
      ]
    }
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [zoom, setZoom] = useState(1);

  const toggleTrackSolo = (trackId: string) => {
    setTracks(tracks.map(t => 
      t.id === trackId ? { ...t, solo: !t.solo } : t
    ));
  };

  const toggleTrackMute = (trackId: string) => {
    setTracks(tracks.map(t => 
      t.id === trackId ? { ...t, mute: !t.mute } : t
    ));
  };

  const updateTrackVolume = (trackId: string, volume: number) => {
    setTracks(tracks.map(t => 
      t.id === trackId ? { ...t, volume } : t
    ));
  };

  const updateTrackPan = (trackId: string, pan: number) => {
    setTracks(tracks.map(t => 
      t.id === trackId ? { ...t, pan } : t
    ));
  };

  const addNewTrack = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFE66D', '#A8E6CF'];
    const newTrack: Track = {
      id: Date.now().toString(),
      name: `Track ${tracks.length + 1}`,
      color: colors[tracks.length % colors.length],
      volume: 75,
      pan: 0,
      solo: false,
      mute: false,
      regions: []
    };
    setTracks([...tracks, newTrack]);
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A]">
      {/* Transport Controls */}
      <div className="flex items-center justify-between p-4 bg-[#252525] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-gray-800 border-gray-600 hover:bg-gray-700"
            onClick={() => setPlayheadPosition(0)}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            className="bg-[#00FFAA] text-black hover:bg-[#00DD99]"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-gray-800 border-gray-600 hover:bg-gray-700"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[#00FFAA] font-mono text-sm">
            {Math.floor(playheadPosition / 60)}:{String(playheadPosition % 60).padStart(2, '0')}
          </div>
          <div className="text-gray-400 text-sm">120 BPM | 4/4</div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Zoom:</span>
          <Slider
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0])}
            min={0.5}
            max={3}
            step={0.1}
            className="w-24"
          />
          <Button
            size="sm"
            variant="outline"
            className="bg-gray-800 border-gray-600 hover:bg-gray-700"
            onClick={addNewTrack}
          >
            <Plus className="w-4 h-4 mr-1" />
            Track
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto">
        <div className="flex">
          {/* Track Controls */}
          <div className="w-56 bg-[#252525] border-r border-gray-700 flex-shrink-0">
            <div className="h-12 border-b border-gray-700 flex items-center px-3 bg-[#2A2A2A]">
              <span className="text-xs text-gray-400 font-semibold">TRACKS</span>
            </div>
            {tracks.map((track) => (
              <div
                key={track.id}
                className="h-20 border-b border-gray-700 p-2 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: track.color }}
                    />
                    <input
                      type="text"
                      value={track.name}
                      onChange={(e) => {
                        setTracks(tracks.map(t =>
                          t.id === track.id ? { ...t, name: e.target.value } : t
                        ));
                      }}
                      className="bg-transparent text-white text-xs border-none outline-none w-20"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleTrackSolo(track.id)}
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        track.solo ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      S
                    </button>
                    <button
                      onClick={() => toggleTrackMute(track.id)}
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        track.mute ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      M
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {track.mute ? (
                    <VolumeX className="w-3 h-3 text-gray-500" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-[#00FFAA]" />
                  )}
                  <Slider
                    value={[track.volume]}
                    onValueChange={(v) => updateTrackVolume(track.id, v[0])}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-[10px] text-gray-400 w-8">{track.volume}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-gray-500">L</span>
                  <Slider
                    value={[track.pan + 50]}
                    onValueChange={(v) => updateTrackPan(track.id, v[0] - 50)}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-gray-500">R</span>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Grid */}
          <div className="flex-1 relative overflow-x-auto">
            {/* Ruler */}
            <div className="h-12 bg-[#2A2A2A] border-b border-gray-700 flex items-end px-2 sticky top-0 z-10">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 border-l border-gray-600 h-full flex items-end pb-1"
                  style={{ width: `${60 * zoom}px` }}
                >
                  <span className="text-[10px] text-gray-400 ml-1">{i * 8}</span>
                </div>
              ))}
            </div>

            {/* Tracks Timeline */}
            {tracks.map((track) => (
              <div
                key={track.id}
                className="h-20 border-b border-gray-700 relative bg-[#1E1E1E]"
              >
                {/* Grid lines */}
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-gray-800"
                    style={{ left: `${i * 60 * zoom}px` }}
                  />
                ))}

                {/* Audio Regions */}
                {track.regions.map((region) => (
                  <div
                    key={region.id}
                    className="absolute top-2 bottom-2 rounded cursor-move hover:opacity-90"
                    style={{
                      left: `${region.start * zoom * 5}px`,
                      width: `${region.duration * zoom * 5}px`,
                      backgroundColor: track.color,
                      opacity: track.mute ? 0.3 : 0.7
                    }}
                  >
                    <div className="px-2 py-1 text-[10px] text-white font-semibold truncate">
                      {region.name}
                    </div>
                    {/* Waveform representation */}
                    <svg className="absolute inset-0 opacity-30">
                      {Array.from({ length: 50 }, (_, i) => (
                        <line
                          key={i}
                          x1={`${(i / 50) * 100}%`}
                          y1="50%"
                          x2={`${(i / 50) * 100}%`}
                          y2={`${50 - Math.random() * 40}%`}
                          stroke="white"
                          strokeWidth="1"
                        />
                      ))}
                    </svg>
                  </div>
                ))}
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#00FFAA] pointer-events-none z-20"
              style={{ left: `${playheadPosition * zoom * 5}px` }}
            >
              <div className="w-3 h-3 bg-[#00FFAA] rounded-full -ml-1.5 -mt-1.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Bar */}
      <div className="h-12 bg-[#252525] border-t border-gray-700 flex items-center gap-2 px-4">
        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
          <Scissors className="w-4 h-4 mr-1" />
          Split
        </Button>
        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
          <Copy className="w-4 h-4 mr-1" />
          Duplicate
        </Button>
        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}
