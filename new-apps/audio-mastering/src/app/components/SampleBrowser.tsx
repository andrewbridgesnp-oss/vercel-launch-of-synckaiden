import { useState } from 'react';
import { Search, Play, Plus, Folder, Music, Drum, Waves, Download, Star } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Sample {
  id: string;
  name: string;
  category: string;
  type: string;
  duration: string;
  bpm?: number;
  key?: string;
  tags: string[];
  favorite: boolean;
}

export function SampleBrowser() {
  const [samples] = useState<Sample[]>([
    { id: '1', name: 'Deep House Kick', category: 'drums', type: 'One-Shot', duration: '0:01', tags: ['kick', 'house'], favorite: true },
    { id: '2', name: 'Snappy Snare', category: 'drums', type: 'One-Shot', duration: '0:01', tags: ['snare', 'acoustic'], favorite: false },
    { id: '3', name: 'Hi-Hat Loop', category: 'drums', type: 'Loop', duration: '0:04', bpm: 120, tags: ['hihat', 'loop'], favorite: true },
    { id: '4', name: 'Ambient Pad', category: 'synths', type: 'Loop', duration: '0:08', bpm: 90, key: 'Am', tags: ['pad', 'ambient'], favorite: false },
    { id: '5', name: 'Acid Bass', category: 'bass', type: 'Loop', duration: '0:04', bpm: 128, key: 'C', tags: ['bass', 'acid'], favorite: true },
    { id: '6', name: 'Piano Chord', category: 'melody', type: 'One-Shot', duration: '0:02', key: 'Em', tags: ['piano', 'chord'], favorite: false },
    { id: '7', name: 'Vocal Chop', category: 'vocals', type: 'One-Shot', duration: '0:01', tags: ['vocal', 'chop'], favorite: true },
    { id: '8', name: 'Synth Lead', category: 'synths', type: 'Loop', duration: '0:08', bpm: 140, key: 'G', tags: ['lead', 'synth'], favorite: false },
    { id: '9', name: 'Electric Guitar Riff', category: 'melody', type: 'Loop', duration: '0:04', bpm: 110, key: 'D', tags: ['guitar', 'rock'], favorite: false },
    { id: '10', name: 'Sub Bass Hit', category: 'bass', type: 'One-Shot', duration: '0:02', tags: ['sub', 'bass'], favorite: true },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingSample, setPlayingSample] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Samples', icon: Music },
    { id: 'drums', label: 'Drums', icon: Drum },
    { id: 'bass', label: 'Bass', icon: Waves },
    { id: 'synths', label: 'Synths', icon: Waves },
    { id: 'melody', label: 'Melody', icon: Music },
    { id: 'vocals', label: 'Vocals', icon: Music },
  ];

  const filteredSamples = samples.filter(sample => {
    const matchesSearch = sample.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sample.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || sample.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const playSample = (id: string) => {
    setPlayingSample(id);
    setTimeout(() => setPlayingSample(null), 1000);
  };

  return (
    <div className="h-full bg-[#1A1A1A] p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#00FFAA]">Sample Library</h2>
          <p className="text-gray-400 mt-1">Browse and preview audio samples</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search samples, tags, instruments..."
            className="pl-10 bg-[#252525] border-gray-700"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="bg-[#252525] border-b border-gray-700 w-full justify-start mb-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-[#00FFAA] data-[state=active]:text-black"
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            {/* Sample Packs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform">
                <Folder className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">House Essentials</h3>
                <p className="text-sm text-white/80">120 samples • 4/4 grooves</p>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform">
                <Folder className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Hip-Hop Drums</h3>
                <p className="text-sm text-white/80">95 samples • Boom bap</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform">
                <Folder className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Lo-Fi Melodies</h3>
                <p className="text-sm text-white/80">78 samples • Chill vibes</p>
              </div>
            </div>

            {/* Samples List */}
            <div className="bg-[#252525] rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1A1A1A] border-b border-gray-700">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase w-8"></th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Name</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Duration</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">BPM</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Key</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Tags</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSamples.map((sample) => (
                      <tr
                        key={sample.id}
                        className="border-b border-gray-700 hover:bg-[#1A1A1A] transition-colors"
                      >
                        <td className="p-3">
                          {sample.favorite && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-white">{sample.name}</span>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            sample.type === 'Loop'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {sample.type}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400 font-mono text-sm">{sample.duration}</td>
                        <td className="p-3 text-gray-400">{sample.bpm || '-'}</td>
                        <td className="p-3 text-gray-400">{sample.key || '-'}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {sample.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => playSample(sample.id)}
                              className={`hover:bg-gray-700 ${
                                playingSample === sample.id ? 'bg-[#00FFAA] text-black' : ''
                              }`}
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-gray-700"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-gray-700"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredSamples.length === 0 && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No samples found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Upload Section */}
        <div className="mt-6 bg-[#252525] rounded-lg p-6 border border-gray-700">
          <h3 className="font-semibold text-white mb-3">Upload Your Samples</h3>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#00FFAA] transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Drag & drop audio files or click to browse</p>
            <p className="text-xs text-gray-500 mt-1">Supports WAV, MP3, AIFF, FLAC</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Upload({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}
