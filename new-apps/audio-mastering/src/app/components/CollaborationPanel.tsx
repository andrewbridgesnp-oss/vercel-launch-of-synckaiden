import { useState } from 'react';
import { Users, MessageSquare, Clock, Send, UserPlus, Share2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Collaborator {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline';
  avatar: string;
  lastActive: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  position?: number;
}

interface Version {
  id: string;
  name: string;
  author: string;
  timestamp: string;
  changes: string;
}

export function CollaborationPanel() {
  const [collaborators] = useState<Collaborator[]>([
    { id: '1', name: 'Alex Morgan', role: 'Producer', status: 'online', avatar: 'AM', lastActive: 'Active now' },
    { id: '2', name: 'Jordan Lee', role: 'Mix Engineer', status: 'online', avatar: 'JL', lastActive: 'Active now' },
    { id: '3', name: 'Sam Chen', role: 'Vocalist', status: 'offline', avatar: 'SC', lastActive: '2 hours ago' },
    { id: '4', name: 'Taylor Kim', role: 'Songwriter', status: 'offline', avatar: 'TK', lastActive: '1 day ago' },
  ]);

  const [comments] = useState<Comment[]>([
    { id: '1', user: 'Alex Morgan', text: 'Love the new bass line! Maybe add some reverb?', timestamp: '10 min ago', position: 45 },
    { id: '2', user: 'Jordan Lee', text: 'The vocals need to be a bit louder in the mix', timestamp: '1 hour ago', position: 120 },
    { id: '3', user: 'Sam Chen', text: 'I can re-record the chorus if needed', timestamp: '3 hours ago' },
  ]);

  const [versions] = useState<Version[]>([
    { id: '1', name: 'v1.3 - Final Mix', author: 'Jordan Lee', timestamp: '2 hours ago', changes: 'Adjusted EQ on vocals, added compression' },
    { id: '2', name: 'v1.2 - Vocal Edit', author: 'Sam Chen', timestamp: '1 day ago', changes: 'Re-recorded chorus, fixed timing' },
    { id: '3', name: 'v1.1 - Beat Update', author: 'Alex Morgan', timestamp: '2 days ago', changes: 'Changed kick pattern, added hi-hats' },
    { id: '4', name: 'v1.0 - Initial Draft', author: 'Alex Morgan', timestamp: '1 week ago', changes: 'First complete arrangement' },
  ]);

  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const sendComment = () => {
    if (newComment.trim()) {
      // In production, this would send to backend
      alert(`Comment posted: "${newComment}"`);
      setNewComment('');
    }
  };

  const inviteCollaborator = () => {
    if (inviteEmail.trim()) {
      alert(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    }
  };

  return (
    <div className="h-full bg-[#1A1A1A] p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#00FFAA]">Collaboration</h2>
          <p className="text-gray-400 mt-1">Work together in real-time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Collaborators & Invite */}
          <div className="space-y-6">
            {/* Active Collaborators */}
            <div className="bg-[#252525] rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00FFAA]" />
                  Collaborators
                </h3>
                <span className="text-xs text-gray-400">{collaborators.length}</span>
              </div>

              <div className="space-y-3">
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-[#1A1A1A] transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10 bg-[#00FFAA] text-black">
                        <AvatarFallback>{collab.avatar}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#252525] ${
                          collab.status === 'online' ? 'bg-green-400' : 'bg-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm truncate">{collab.name}</div>
                      <div className="text-xs text-gray-400">{collab.role}</div>
                    </div>
                    <div className="text-xs text-gray-500">{collab.lastActive}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Collaborator */}
            <div className="bg-[#252525] rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                <UserPlus className="w-4 h-4 text-[#00FFAA]" />
                Invite Collaborator
              </h3>
              <div className="space-y-3">
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  className="bg-[#1A1A1A] border-gray-700"
                />
                <Button
                  onClick={inviteCollaborator}
                  className="w-full bg-[#00FFAA] text-black hover:bg-[#00DD99]"
                >
                  Send Invitation
                </Button>
              </div>
            </div>

            {/* Share Project */}
            <div className="bg-[#252525] rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-[#00FFAA]" />
                Share Project
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value="https://studio.example.com/project/abc123"
                    readOnly
                    className="bg-[#1A1A1A] border-gray-700 text-sm"
                  />
                  <Button variant="outline" className="bg-gray-800 border-gray-600">
                    Copy
                  </Button>
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input type="checkbox" className="rounded" />
                    Allow downloads
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <input type="checkbox" className="rounded" defaultChecked />
                    Allow edits
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Comments */}
          <div className="bg-[#252525] rounded-lg border border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00FFAA]" />
                Comments & Feedback
              </h3>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-[#1A1A1A] rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 bg-[#00FFAA] text-black flex-shrink-0">
                      <AvatarFallback>{comment.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white text-sm">{comment.user}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                      {comment.position && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#00FFAA]">
                          <Clock className="w-3 h-3" />
                          @ {Math.floor(comment.position / 60)}:{String(comment.position % 60).padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="bg-[#1A1A1A] border-gray-700 resize-none"
                />
                <Button
                  onClick={sendComment}
                  size="sm"
                  className="bg-[#00FFAA] text-black hover:bg-[#00DD99] self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Version History */}
          <div className="bg-[#252525] rounded-lg border border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00FFAA]" />
                Version History
              </h3>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`bg-[#1A1A1A] rounded-lg p-3 border-l-4 ${
                    index === 0 ? 'border-[#00FFAA]' : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{version.name}</span>
                      {index === 0 && (
                        <span className="text-xs bg-[#00FFAA] text-black px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    by {version.author} • {version.timestamp}
                  </div>
                  <p className="text-sm text-gray-300">{version.changes}</p>
                  {index !== 0 && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs bg-gray-800 border-gray-600">
                        Restore
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs bg-gray-800 border-gray-600">
                        Compare
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <Button className="w-full bg-[#00FFAA] text-black hover:bg-[#00DD99]">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save New Version
              </Button>
            </div>
          </div>
        </div>

        {/* Permissions Notice */}
        <div className="mt-6 bg-[#252525] rounded-lg p-4 border border-gray-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <p className="font-semibold text-white mb-1">Real-time Collaboration</p>
              <p>Collaboration features require backend integration with WebSocket support for real-time updates, 
              user authentication for managing permissions, and cloud storage for version control.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
