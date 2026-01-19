/**
 * Voice Chat Component
 * Integrates voice input/output with chat interface
 */

import React, { useState, useRef, useEffect } from "react";
import { useVoice } from "@/hooks/useVoice";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, StopCircle } from "lucide-react";

interface VoiceChatProps {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
  lastMessage?: string;
}

export function VoiceChat({
  onSendMessage,
  isLoading = false,
  lastMessage,
}: VoiceChatProps) {
  const { speak, stop, isSpeaking, error: voiceError } = useVoice();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript("");
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setTranscript((prev) => prev + transcript);
            } else {
              interimTranscript += transcript;
            }
          }

          if (interimTranscript) {
            setTranscript((prev) => prev + interimTranscript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Auto-play voice response when new message arrives
  useEffect(() => {
    if (lastMessage && voiceEnabled && !isLoading && !isSpeaking) {
      speak(lastMessage, {
        voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
        stability: 0.5,
        similarityBoost: 0.75,
      });
    }
  }, [lastMessage, voiceEnabled, isLoading, isSpeaking, speak]);

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSendTranscript = () => {
    if (transcript.trim()) {
      onSendMessage(transcript);
      setTranscript("");
    }
  };

  const handleStopSpeaking = () => {
    stop();
  };

  const handleToggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      stop();
    }
  };

  // Auto-play voice response when new message arrives
  React.useEffect(() => {
    if (lastMessage && voiceEnabled && !isLoading && !isSpeaking) {
      speak(lastMessage);
    }
  }, [lastMessage, voiceEnabled, isLoading, isSpeaking, speak]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700">
      {/* Voice Controls */}
      <div className="flex gap-2">
        {/* Microphone Button */}
        <Button
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isLoading || isSpeaking}
          variant={isListening ? "destructive" : "default"}
          size="sm"
          className="flex-1"
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Listening
            </>
          )}
        </Button>

        {/* Voice Toggle */}
        <Button
          onClick={handleToggleVoice}
          variant={voiceEnabled ? "default" : "outline"}
          size="sm"
          title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
          disabled={isLoading}
        >
          {voiceEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>

        {/* Stop Speaking Button */}
        {isSpeaking && (
          <Button
            onClick={handleStopSpeaking}
            variant="destructive"
            size="sm"
            title="Stop current speech"
          >
            <StopCircle className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="p-3 bg-slate-700 rounded border border-slate-600">
          <p className="text-sm text-slate-300">
            <span className="font-semibold">Transcript:</span> {transcript}
          </p>
        </div>
      )}

      {/* Send Button */}
      {transcript && (
        <Button
          onClick={handleSendTranscript}
          disabled={isLoading || isSpeaking || !transcript.trim()}
          className="w-full"
        >
          Send Message
        </Button>
      )}

      {/* Status Indicators */}
      <div className="flex gap-2 text-xs text-slate-400">
        {isListening && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Listening...
          </span>
        )}
        {isSpeaking && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Speaking...
          </span>
        )}
      </div>
    </div>
  );
}
