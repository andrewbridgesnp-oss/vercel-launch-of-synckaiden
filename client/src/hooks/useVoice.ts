/**
 * Voice Hook - Simplified TTS via backend
 */

import { useState, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { mutate: synthesize, isPending } = trpc.voice.synthesize.useMutation();

  const speak = useCallback(
    (text: string, options?: { voiceId?: string; stability?: number; similarityBoost?: number }) => {
      if (!text.trim()) return;

      setError(null);
      setIsSpeaking(true);

      synthesize(
        {
          text,
          voiceId: options?.voiceId,
          stability: options?.stability,
          similarityBoost: options?.similarityBoost,
        },
        {
          onSuccess: (data) => {
            if (data.success && data.audio) {
              // Create audio element
              if (!audioRef.current) {
                audioRef.current = new Audio();
              }

              // Convert base64 to blob
              const binaryString = atob(data.audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: data.mimeType });
              const url = URL.createObjectURL(blob);

              audioRef.current.src = url;
              audioRef.current.onplay = () => setIsSpeaking(true);
              audioRef.current.onended = () => setIsSpeaking(false);
              audioRef.current.onerror = () => {
                setError("Failed to play audio");
                setIsSpeaking(false);
              };

              audioRef.current.play().catch((err) => {
                setError("Failed to play audio");
                setIsSpeaking(false);
              });
            } else {
              setError(data.error || "Failed to synthesize speech");
              setIsSpeaking(false);
            }
          },
          onError: (error) => {
            setError("Voice synthesis failed");
            setIsSpeaking(false);
          },
        }
      );
    },
    [synthesize]
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking: isSpeaking || isPending,
    error,
  };
}
