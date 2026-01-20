import { useState } from 'react';
import { Upload, Music, Share2, Download, CheckCircle2, AlertCircle, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TrackMetadata {
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: string;
  isrc: string;
  description: string;
  tags: string[];
}

export function DistributionPanel() {
  const [metadata, setMetadata] = useState<TrackMetadata>({
    title: '',
    artist: '',
    album: '',
    genre: '',
    releaseDate: '',
    isrc: '',
    description: '',
    tags: []
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState('wav');
  const [exportQuality, setExportQuality] = useState('high');

  const platforms = [
    { id: 'spotify', name: 'Spotify', icon: '🎵', status: 'ready', color: '#1DB954' },
    { id: 'apple', name: 'Apple Music', icon: '🎧', status: 'ready', color: '#FA243C' },
    { id: 'soundcloud', name: 'SoundCloud', icon: '☁️', status: 'ready', color: '#FF5500' },
    { id: 'youtube', name: 'YouTube Music', icon: '▶️', status: 'ready', color: '#FF0000' },
    { id: 'tidal', name: 'Tidal', icon: '🌊', status: 'ready', color: '#000000' },
    { id: 'bandcamp', name: 'Bandcamp', icon: '🏷️', status: 'ready', color: '#629AA9' },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleDistribute = () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }
    alert(`🚀 Distribution initiated!\n\nPlatforms: ${selectedPlatforms.join(', ')}\n\nNote: In production, this would authenticate with each platform's API and upload your track.`);
  };

  return (
    <div className="h-full bg-[#1A1A1A] p-4 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#00FFAA]">Distribution & Publishing</h2>
          <p className="text-gray-400 mt-1">Get your music heard on major streaming platforms</p>
        </div>

        <Tabs defaultValue="metadata" className="w-full">
          <TabsList className="bg-[#252525] border-b border-gray-700 w-full justify-start">
            <TabsTrigger value="metadata" className="data-[state=active]:bg-[#00FFAA] data-[state=active]:text-black">
              <Music className="w-4 h-4 mr-2" />
              Metadata
            </TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-[#00FFAA] data-[state=active]:text-black">
              <Radio className="w-4 h-4 mr-2" />
              Platforms
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-[#00FFAA] data-[state=active]:text-black">
              <Download className="w-4 h-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="share" className="data-[state=active]:bg-[#00FFAA] data-[state=active]:text-black">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </TabsTrigger>
          </TabsList>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-6 mt-6">
            <div className="bg-[#252525] rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Track Information</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-400">Track Title *</Label>
                  <Input
                    id="title"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    placeholder="Enter track title"
                    className="bg-[#1A1A1A] border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist" className="text-gray-400">Artist Name *</Label>
                  <Input
                    id="artist"
                    value={metadata.artist}
                    onChange={(e) => setMetadata({ ...metadata, artist: e.target.value })}
                    placeholder="Enter artist name"
                    className="bg-[#1A1A1A] border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="album" className="text-gray-400">Album/EP</Label>
                  <Input
                    id="album"
                    value={metadata.album}
                    onChange={(e) => setMetadata({ ...metadata, album: e.target.value })}
                    placeholder="Enter album name"
                    className="bg-[#1A1A1A] border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre" className="text-gray-400">Genre</Label>
                  <Select value={metadata.genre} onValueChange={(v) => setMetadata({ ...metadata, genre: v })}>
                    <SelectTrigger className="bg-[#1A1A1A] border-gray-700">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#252525] border-gray-700">
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="hiphop">Hip-Hop</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="classical">Classical</SelectItem>
                      <SelectItem value="indie">Indie</SelectItem>
                      <SelectItem value="rnb">R&B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="releaseDate" className="text-gray-400">Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={metadata.releaseDate}
                    onChange={(e) => setMetadata({ ...metadata, releaseDate: e.target.value })}
                    className="bg-[#1A1A1A] border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isrc" className="text-gray-400">ISRC Code</Label>
                  <Input
                    id="isrc"
                    value={metadata.isrc}
                    onChange={(e) => setMetadata({ ...metadata, isrc: e.target.value })}
                    placeholder="US-XXX-XX-XXXXX"
                    className="bg-[#1A1A1A] border-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-400">Description</Label>
                <Textarea
                  id="description"
                  value={metadata.description}
                  onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                  placeholder="Describe your track..."
                  rows={4}
                  className="bg-[#1A1A1A] border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400">Album Artwork</Label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#00FFAA] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload album artwork</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended: 3000x3000px, JPG or PNG</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6 mt-6">
            <div className="bg-[#252525] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Select Distribution Platforms</h3>
              <p className="text-sm text-gray-400 mb-6">Choose where you want your music to be available</p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-[#00FFAA] bg-[#00FFAA]/10'
                        : 'border-gray-700 bg-[#1A1A1A] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold text-white">{platform.name}</div>
                          <div className="text-xs text-gray-400">{platform.status}</div>
                        </div>
                      </div>
                      {selectedPlatforms.includes(platform.id) && (
                        <CheckCircle2 className="w-5 h-5 text-[#00FFAA]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-[#1A1A1A] border border-gray-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-400">
                    <p className="font-semibold text-white mb-1">Backend Integration Required</p>
                    <p>Distribution to streaming platforms requires authentication and API integration. 
                    Each platform has specific requirements for metadata, audio quality, and licensing.</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDistribute}
                disabled={selectedPlatforms.length === 0}
                className="w-full mt-6 bg-[#00FFAA] text-black hover:bg-[#00DD99] disabled:opacity-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Distribute to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6 mt-6">
            <div className="bg-[#252525] rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Export Settings</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">Format</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['wav', 'mp3', 'flac', 'aac'].map((format) => (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        className={`p-3 rounded-lg border-2 transition-all uppercase font-semibold ${
                          exportFormat === format
                            ? 'border-[#00FFAA] bg-[#00FFAA]/10 text-[#00FFAA]'
                            : 'border-gray-700 bg-[#1A1A1A] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">Quality</Label>
                  <Select value={exportQuality} onValueChange={setExportQuality}>
                    <SelectTrigger className="bg-[#1A1A1A] border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#252525] border-gray-700">
                      <SelectItem value="low">Low (128 kbps)</SelectItem>
                      <SelectItem value="medium">Medium (192 kbps)</SelectItem>
                      <SelectItem value="high">High (320 kbps)</SelectItem>
                      <SelectItem value="lossless">Lossless (WAV/FLAC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-[#1A1A1A] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white uppercase">{exportFormat}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Quality:</span>
                    <span className="text-white">{exportQuality}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Size:</span>
                    <span className="text-white">~45 MB</span>
                  </div>
                </div>

                <Button className="w-full bg-[#00FFAA] text-black hover:bg-[#00DD99]">
                  <Download className="w-4 h-4 mr-2" />
                  Export Track
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share" className="space-y-6 mt-6">
            <div className="bg-[#252525] rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white">Share Your Music</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-400">Shareable Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value="https://studio.example.com/track/abc123xyz"
                      readOnly
                      className="bg-[#1A1A1A] border-gray-700"
                    />
                    <Button variant="outline" className="bg-gray-800 border-gray-600">
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-400">Embed Code</Label>
                  <Textarea
                    value='<iframe src="https://studio.example.com/embed/abc123xyz" width="100%" height="200"></iframe>'
                    readOnly
                    rows={3}
                    className="bg-[#1A1A1A] border-gray-700 font-mono text-xs"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-400">Social Media</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="bg-[#1A1A1A] border-gray-700 justify-start">
                      📘 Share on Facebook
                    </Button>
                    <Button variant="outline" className="bg-[#1A1A1A] border-gray-700 justify-start">
                      🐦 Share on Twitter
                    </Button>
                    <Button variant="outline" className="bg-[#1A1A1A] border-gray-700 justify-start">
                      📸 Share on Instagram
                    </Button>
                    <Button variant="outline" className="bg-[#1A1A1A] border-gray-700 justify-start">
                      💼 Share on LinkedIn
                    </Button>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Preview Player</h4>
                  <div className="bg-[#252525] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAA] to-[#00DD99] rounded" />
                      <div>
                        <div className="font-semibold text-white">Your Track Title</div>
                        <div className="text-sm text-gray-400">Artist Name</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-[#00FFAA] text-black">
                        <Play className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 h-1 bg-gray-700 rounded-full">
                        <div className="w-1/3 h-full bg-[#00FFAA] rounded-full" />
                      </div>
                      <span className="text-xs text-gray-400">1:23 / 3:45</span>
                    </div>
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

function Play({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
