import { useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

interface AudioPlayerProps {
  duration?: string;
  fileName?: string;
}

export function AudioPlayer({ duration = "2:34", fileName = "call-recording.mp3" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      <div className="flex-1 space-y-1">
        <Slider
          value={progress}
          onValueChange={setProgress}
          max={100}
          step={1}
          className="cursor-pointer"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{fileName}</span>
          <span>{duration}</span>
        </div>
      </div>

      <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  );
}
