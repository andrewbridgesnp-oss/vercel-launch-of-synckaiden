import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Play, Upload, Loader2, Plus } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Videos() {
  const { user } = useAuth();
  const { data: videos, isLoading } = trpc.videos.list.useQuery();

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="" />

      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/tools">
            <Button variant="ghost" className="mb-4">
              ← BACK TO TOOLS
            </Button>
          </Link>
          <h1 className="text-4xl font-bold gold-text">
            VIDEO CREATOR
          </h1>
          <p className="text-muted-foreground mt-2">
            Create reels for Instagram, Facebook, and YouTube
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Total Videos</p>
                <p className="text-3xl font-bold gold-text mt-1">
                  {videos?.length || 0}
                </p>
              </div>
              <Video className="h-8 w-8 gold-text opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Published</p>
                <p className="text-3xl font-bold silver-text mt-1">0</p>
              </div>
              <Upload className="h-8 w-8 silver-text opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground uppercase">Total Views</p>
                <p className="text-3xl font-bold text-accent mt-1">0</p>
              </div>
              <Play className="h-8 w-8 text-accent opacity-50" />
            </div>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin gold-text" />
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="p-6 bg-card/50 backdrop-blur-sm border-2 border-border hover:border-secondary transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <Video className="h-8 w-8 gold-text" />
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      video.status === "ready"
                        ? "bg-secondary/20 text-secondary"
                        : video.status === "processing"
                        ? "bg-muted text-muted-foreground"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {video.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {video.description || "No description"}
                </p>

                <div className="text-xs text-muted-foreground mb-4">
                  Created {new Date(video.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    EDIT
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    PUBLISH
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 bg-card/30 backdrop-blur-sm border-2 border-dashed border-border text-center">
            <Video className="h-16 w-16 gold-text mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">READY TO CREATE</h3>
            <p className="text-muted-foreground mb-6">
              Upload clips or describe what you want - AI will help create engaging reels
            </p>
            <Button
              onClick={() => toast.info("Connect your social accounts in Integrations to publish directly")}
              className="silver-text font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              CREATE VIDEO
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
