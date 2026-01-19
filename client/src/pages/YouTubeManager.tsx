import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Youtube, Upload, Video, Calendar, Eye, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function YouTubeManager() {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  // Mock data - replace with real tRPC queries
  const channelStats = {
    subscribers: '12.5K',
    totalViews: '450K',
    totalVideos: 87,
    avgViews: '5.2K'
  };

  const recentVideos = [
    {
      id: 1,
      title: 'Creative Clash Live - Episode 45',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
      views: 8234,
      likes: 456,
      comments: 89,
      uploadedAt: '2 days ago'
    },
    {
      id: 2,
      title: 'AI Business Automation Tips',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      views: 12456,
      likes: 892,
      comments: 134,
      uploadedAt: '5 days ago'
    },
    {
      id: 3,
      title: 'Building Your Digital Empire',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      views: 6789,
      likes: 345,
      comments: 67,
      uploadedAt: '1 week ago'
    }
  ];

  const handleScheduleVideo = () => {
    if (!videoTitle || !videoUrl) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // TODO: Integrate with YouTube API via tRPC
    toast.success('Video scheduled successfully!');
    setVideoTitle('');
    setVideoDescription('');
    setVideoUrl('');
    setScheduledDate('');
  };

  return (
    <DashboardLayout title="YouTube Manager">
      <div className="space-y-8">
        {/* Channel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Subscribers</span>
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-white">{channelStats.subscribers}</div>
            <div className="text-xs text-green-500 mt-1">+234 this week</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Views</span>
              <Eye className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-white">{channelStats.totalViews}</div>
            <div className="text-xs text-green-500 mt-1">+12.5K this month</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Videos</span>
              <Video className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-white">{channelStats.totalVideos}</div>
            <div className="text-xs text-green-500 mt-1">+3 this week</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Avg Views</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-white">{channelStats.avgViews}</div>
            <div className="text-xs text-green-500 mt-1">+8% vs last month</div>
          </Card>
        </div>

        {/* Upload/Schedule Video */}
        <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Schedule Video</h2>
              <p className="text-slate-400">Upload and schedule content for your YouTube channel</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Video Title *
              </label>
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter video title..."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <Textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Enter video description..."
                rows={4}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Video URL *
              </label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://storage.example.com/video.mp4"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Schedule Date (Optional)
              </label>
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Button
              onClick={handleScheduleVideo}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Schedule Video
            </Button>
          </div>
        </Card>

        {/* Recent Videos */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <Card key={video.id} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      <Video className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {video.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {video.comments}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">{video.uploadedAt}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <Card className="p-6 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Creative Clash Live</h3>
              <p className="text-slate-300">Manage your live streaming competition</p>
            </div>
            <Link href="/creative-clash">
              <Button className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                Go to Creative Clash
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
