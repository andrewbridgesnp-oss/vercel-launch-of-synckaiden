import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Loader2, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PsychologicalSyncProps {
  onComplete: (data: {
    responses: string[];
    personalityType: string;
    insights: string[];
  }) => void;
}

const QUESTIONS = [
  "Tell me about a recent business challenge you faced and how you handled it.",
  "What does success look like for you in the next 6 months?",
  "How do you prefer to make important decisions?",
  "What tasks in your business drain your energy the most?",
];

export function PsychologicalSync({ onComplete }: PsychologicalSyncProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const analyzePersonality = trpc.profile.analyzePersonality.useMutation();
  const transcribeVoice = trpc.profile.transcribeVoice.useMutation();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error("Microphone access denied. Please enable microphone permissions.");
      console.error("Microphone error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Transcribe audio using Whisper API
        const transcriptionResult = await transcribeVoice.mutateAsync({
          audioBase64: base64Audio,
          mimeType: audioBlob.type,
        });
        
        setTranscript(transcriptionResult.text);
        
        const newResponses = [...responses, transcriptionResult.text];
        setResponses(newResponses);
        
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setTranscript("");
        } else {
          // All questions answered, analyze personality
          const result = await analyzePersonality.mutateAsync({
            responses: newResponses,
          });
          
          onComplete({
            responses: newResponses,
            personalityType: result.personalityType,
            insights: result.insights,
          });
        }
      };
    } catch (error) {
      toast.error("Failed to process audio. Please try again.");
      console.error("Audio processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const skipQuestion = () => {
    const newResponses = [...responses, "[Skipped]"];
    setResponses(newResponses);
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTranscript("");
    } else {
      // Complete with skipped responses
      onComplete({
        responses: newResponses,
        personalityType: "Balanced",
        insights: ["Complete the sync process to get personalized insights."],
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-gray-900 to-black border-cyan-500/30 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Psychological Sync
          </h2>
          <p className="text-gray-400">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-200">{QUESTIONS[currentQuestion]}</p>
          </div>

          {transcript && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300">{transcript}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {!isRecording && !isProcessing && (
              <Button
                size="lg"
                onClick={startRecording}
                className="w-full py-6 text-lg"
                style={{
                  background: "linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)",
                  color: "#000",
                }}
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button
                size="lg"
                onClick={stopRecording}
                className="w-full py-6 text-lg"
                style={{
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "#fff",
                }}
              >
                <MicOff className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}

            {isProcessing && (
              <Button
                size="lg"
                disabled
                className="w-full py-6 text-lg"
              >
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </Button>
            )}

            <Button
              variant="outline"
              onClick={skipQuestion}
              disabled={isRecording || isProcessing}
              className="w-full"
            >
              Skip Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          {QUESTIONS.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index < currentQuestion
                  ? "bg-cyan-500"
                  : index === currentQuestion
                  ? "bg-cyan-500/50"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
