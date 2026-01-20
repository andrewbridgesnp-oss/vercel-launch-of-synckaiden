import { useState } from 'react';
import { Folder, Clock, Music, MoreVertical, Plus, Search, Trash2, Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface Project {
  id: string;
  name: string;
  genre: string;
  duration: string;
  tracks: number;
  lastModified: string;
  created: string;
  size: string;
  thumbnail: string;
}

export function ProjectLibrary() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Summer Vibes',
      genre: 'Pop',
      duration: '3:45',
      tracks: 12,
      lastModified: '2 hours ago',
      created: 'Jan 8, 2026',
      size: '245 MB',
      thumbnail: '#FF6B6B'
    },
    {
      id: '2',
      name: 'Midnight Dreams',
      genre: 'Electronic',
      duration: '4:12',
      tracks: 8,
      lastModified: '1 day ago',
      created: 'Jan 7, 2026',
      size: '189 MB',
      thumbnail: '#4ECDC4'
    },
    {
      id: '3',
      name: 'Acoustic Sessions',
      genre: 'Folk',
      duration: '2:58',
      tracks: 5,
      lastModified: '3 days ago',
      created: 'Jan 5, 2026',
      size: '156 MB',
      thumbnail: '#95E1D3'
    },
    {
      id: '4',
      name: 'Hip-Hop Beat',
      genre: 'Hip-Hop',
      duration: '3:20',
      tracks: 15,
      lastModified: '1 week ago',
      created: 'Jan 3, 2026',
      size: '312 MB',
      thumbnail: '#FFE66D'
    },
    {
      id: '5',
      name: 'Rock Anthem',
      genre: 'Rock',
      duration: '4:45',
      tracks: 10,
      lastModified: '2 weeks ago',
      created: 'Dec 27, 2025',
      size: '298 MB',
      thumbnail: '#A8E6CF'
    },
    {
      id: '6',
      name: 'Jazz Improvisation',
      genre: 'Jazz',
      duration: '5:30',
      tracks: 7,
      lastModified: '3 weeks ago',
      created: 'Dec 20, 2025',
      size: '234 MB',
      thumbnail: '#C7CEEA'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="h-full bg-[#1A1A1A] p-4 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#00FFAA]">Project Library</h2>
            <p className="text-gray-400 mt-1">{projects.length} projects</p>
          </div>
          <Button className="bg-[#00FFAA] text-black hover:bg-[#00DD99]">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 bg-[#252525] border-gray-700"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`${
                viewMode === 'grid'
                  ? 'bg-[#00FFAA] text-black border-[#00FFAA]'
                  : 'bg-[#252525] border-gray-700'
              }`}
            >
              Grid
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`${
                viewMode === 'list'
                  ? 'bg-[#00FFAA] text-black border-[#00FFAA]'
                  : 'bg-[#252525] border-gray-700'
              }`}
            >
              List
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#252525] rounded-lg overflow-hidden border border-gray-700 hover:border-[#00FFAA] transition-all cursor-pointer group"
              >
                {/* Thumbnail */}
                <div
                  className="h-40 relative flex items-center justify-center"
                  style={{ backgroundColor: project.thumbnail }}
                >
                  <Music className="w-16 h-16 text-white/20" />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#252525] border-gray-700">
                        <DropdownMenuItem className="hover:bg-gray-700">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-700">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-gray-700 text-red-400"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 truncate">{project.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{project.genre}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      {project.tracks} tracks
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.duration}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500">
                    Modified {project.lastModified}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Projects List */
          <div className="bg-[#252525] rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#1A1A1A] border-b border-gray-700">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Name</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Genre</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Tracks</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Duration</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Size</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase">Modified</th>
                  <th className="text-left p-3 text-xs font-semibold text-gray-400 uppercase"></th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-gray-700 hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ backgroundColor: project.thumbnail }}
                        >
                          <Music className="w-5 h-5 text-white/50" />
                        </div>
                        <span className="font-semibold text-white">{project.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-400">{project.genre}</td>
                    <td className="p-3 text-gray-400">{project.tracks}</td>
                    <td className="p-3 text-gray-400">{project.duration}</td>
                    <td className="p-3 text-gray-400">{project.size}</td>
                    <td className="p-3 text-gray-400">{project.lastModified}</td>
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="hover:bg-gray-700">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#252525] border-gray-700">
                          <DropdownMenuItem className="hover:bg-gray-700">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-700">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-gray-700 text-red-400"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No projects found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
