import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { 
  Search, Upload, Download, Play, Pause, Music2, 
  Sliders, Piano, FolderOpen, Save, Undo2, Redo2,
  Layers, Radio, Users, TrendingUp, Library
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
  category: string;
}

interface CommandPaletteProps {
  onNavigate: (tab: string) => void;
  onAction: (action: string) => void;
}

export function CommandPalette({ onNavigate, onAction }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    // Navigation
    { id: 'nav-multitrack', label: 'Go to Multi-Track Editor', icon: <Layers className="w-4 h-4" />, action: () => onNavigate('multitrack'), keywords: ['track', 'edit', 'timeline'], category: 'Navigation' },
    { id: 'nav-effects', label: 'Go to Effects Rack', icon: <Sliders className="w-4 h-4" />, action: () => onNavigate('effects'), keywords: ['fx', 'effect', 'plugin'], category: 'Navigation' },
    { id: 'nav-instruments', label: 'Go to Virtual Instruments', icon: <Piano className="w-4 h-4" />, action: () => onNavigate('instruments'), keywords: ['vst', 'synth', 'piano', 'drum'], category: 'Navigation' },
    { id: 'nav-mastering', label: 'Go to Mastering', icon: <Music2 className="w-4 h-4" />, action: () => onNavigate('mastering'), keywords: ['master', 'final', 'polish'], category: 'Navigation' },
    { id: 'nav-samples', label: 'Go to Sample Browser', icon: <Library className="w-4 h-4" />, action: () => onNavigate('samples'), keywords: ['loop', 'sample', 'sound'], category: 'Navigation' },
    { id: 'nav-distribution', label: 'Go to Distribution', icon: <Radio className="w-4 h-4" />, action: () => onNavigate('distribution'), keywords: ['publish', 'release', 'spotify'], category: 'Navigation' },
    { id: 'nav-projects', label: 'Go to Projects', icon: <FolderOpen className="w-4 h-4" />, action: () => onNavigate('projects'), keywords: ['file', 'open', 'save'], category: 'Navigation' },
    { id: 'nav-collaborate', label: 'Go to Collaboration', icon: <Users className="w-4 h-4" />, action: () => onNavigate('collaboration'), keywords: ['team', 'share', 'comment'], category: 'Navigation' },
    { id: 'nav-analytics', label: 'Go to Analytics', icon: <TrendingUp className="w-4 h-4" />, action: () => onNavigate('analytics'), keywords: ['stats', 'data', 'streams'], category: 'Navigation' },
    
    // Actions
    { id: 'import-audio', label: 'Import Audio File', icon: <Upload className="w-4 h-4" />, action: () => onAction('import'), keywords: ['upload', 'file', 'import'], category: 'Actions' },
    { id: 'export-project', label: 'Export Project', icon: <Download className="w-4 h-4" />, action: () => onAction('export'), keywords: ['download', 'save', 'export'], category: 'Actions' },
    { id: 'save-project', label: 'Save Project', icon: <Save className="w-4 h-4" />, action: () => onAction('save'), keywords: ['save', 'store'], category: 'Actions' },
    { id: 'play-pause', label: 'Play/Pause', icon: <Play className="w-4 h-4" />, action: () => onAction('play'), keywords: ['play', 'pause', 'stop'], category: 'Actions' },
    { id: 'undo', label: 'Undo', icon: <Undo2 className="w-4 h-4" />, action: () => onAction('undo'), keywords: ['undo', 'back'], category: 'Actions' },
    { id: 'redo', label: 'Redo', icon: <Redo2 className="w-4 h-4" />, action: () => onAction('redo'), keywords: ['redo', 'forward'], category: 'Actions' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen(prev => !prev);
      setSearch('');
      setSelectedIndex(0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCommandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      setOpen(false);
      setSearch('');
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gradient-to-br from-[#1A1A24] to-[#1C1626] border-[#D4AF37]/30 p-0 max-w-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#D4AF37]/20">
          <Search className="w-5 h-5 text-[#D4AF37]" />
          <Input
            placeholder="Search commands... (type to filter)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleCommandKeyDown}
            className="border-0 bg-transparent text-[#E5E4E2] placeholder:text-[#E5E4E2]/40 focus-visible:ring-0 text-lg"
            autoFocus
          />
          <kbd className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-xs text-[#D4AF37] font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-[#E5E4E2]/40">
              No commands found
            </div>
          ) : (
            <>
              {Object.entries(
                filteredCommands.reduce((acc, cmd) => {
                  if (!acc[cmd.category]) acc[cmd.category] = [];
                  acc[cmd.category].push(cmd);
                  return acc;
                }, {} as Record<string, Command[]>)
              ).map(([category, cmds]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs text-[#D4AF37]/60 font-semibold tracking-wider bg-[#1A1A24]/50">
                    {category}
                  </div>
                  {cmds.map((cmd, index) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          setOpen(false);
                          setSearch('');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${
                          globalIndex === selectedIndex
                            ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-l-2 border-[#D4AF37]'
                            : 'hover:bg-[#1A1A24]/50'
                        }`}
                      >
                        <div className={`${globalIndex === selectedIndex ? 'text-[#D4AF37]' : 'text-[#E5E4E2]/60'}`}>
                          {cmd.icon}
                        </div>
                        <span className={`flex-1 ${globalIndex === selectedIndex ? 'text-[#E5E4E2]' : 'text-[#E5E4E2]/80'}`}>
                          {cmd.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="px-4 py-3 bg-[#1A1A24]/50 border-t border-[#D4AF37]/20 flex items-center gap-4 text-xs text-[#E5E4E2]/50">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded font-mono">↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded font-mono">↵</kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded font-mono">⌘K</kbd>
            <span>Toggle</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
