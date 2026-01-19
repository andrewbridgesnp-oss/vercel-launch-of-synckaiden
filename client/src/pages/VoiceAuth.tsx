import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mic, Check, X, Shield } from "lucide-react";

const ENROLLMENT_PHRASES = [
  "Kaiden, this is my voice",
  "I authorize access to my business",
  "My voice is my password",
];

export default function VoiceAuth() {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [isReenrolling, setIsReenrolling] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const enrollVoiceprint = trpc.auth.enrollVoiceprint.useMutation({
    onSuccess: () => {
      toast.success("Voice authentication enrolled successfully!");
      setIsReenrolling(false);
    },
    onError: () => {
      toast.error("Failed to enroll voice. Please try again.");
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordings([...recordings, blob]);
        
        if (currentPhrase < ENROLLMENT_PHRASES.length - 1) {
          setCurrentPhrase(currentPhrase + 1);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after 3 seconds
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 3000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleEnroll = async () => {
    if (recordings.length < ENROLLMENT_PHRASES.length) {
      toast.error("Please complete all recordings");
      return;
    }

    try {
      // Convert recordings to base64
      const base64Recordings = await Promise.all(
        recordings.map(blob => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = (reader.result as string).split(",")[1];
              resolve(base64);
            };
            reader.readAsDataURL(blob);
          });
        })
      );

      await enrollVoiceprint.mutateAsync({
        recordings: base64Recordings,
      });

      toast.success("Voice authentication enrolled successfully!");
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to enroll voice. Please try again.");
    }
  };

  const resetEnrollment = () => {
    setCurrentPhrase(0);
    setRecordings([]);
    setIsReenrolling(false);
  };
  
  const startReenrollment = () => {
    setCurrentPhrase(0);
    setRecordings([]);
    setIsReenrolling(true);
    toast.info("Starting re-enrollment. Your old voiceprint will be replaced.");
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-gray-200">Voice Authentication</h1>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-2">
                Enroll Your Voiceprint
              </h2>
              <p className="text-gray-400">
                Record three phrases to secure your platform with voice biometrics
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex gap-4">
              {ENROLLMENT_PHRASES.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                    index < recordings.length
                      ? "bg-green-500"
                      : index === currentPhrase
                      ? "bg-primary animate-pulse"
                      : "bg-gray-700"
                  }`}
                />
              ))}
            </div>

            {/* Current Phrase */}
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 mb-2">
                Phrase {currentPhrase + 1} of {ENROLLMENT_PHRASES.length}
              </p>
              <p className="text-2xl font-semibold text-gray-200">
                "{ENROLLMENT_PHRASES[currentPhrase]}"
              </p>
            </div>

            {/* Recording Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={recordings.length >= ENROLLMENT_PHRASES.length}
                className={`w-32 h-32 rounded-full ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                <Mic className="h-12 w-12" />
              </Button>
            </div>

            {/* Recording Status */}
            <div className="grid grid-cols-3 gap-4">
              {ENROLLMENT_PHRASES.map((phrase, index) => (
                <Card
                  key={index}
                  className={`p-4 text-center ${
                    index < recordings.length
                      ? "bg-green-500/20 border-green-500/30"
                      : "bg-card/30 border-gray-700"
                  }`}
                >
                  {index < recordings.length ? (
                    <Check className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  ) : (
                    <X className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  )}
                  <p className="text-sm text-gray-400">Phrase {index + 1}</p>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={resetEnrollment}
                disabled={recordings.length === 0}
              >
                Reset
              </Button>
              <Button
                onClick={handleEnroll}
                disabled={recordings.length < ENROLLMENT_PHRASES.length || enrollVoiceprint.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {enrollVoiceprint.isPending ? "Enrolling..." : "Complete Enrollment"}
              </Button>
              {enrollVoiceprint.isSuccess && (
                <Button
                  onClick={startReenrollment}
                  variant="outline"
                  className="bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30"
                >
                  Re-enroll Voice
                </Button>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-1">
                    Voice Biometric Security
                  </h3>
                  <p className="text-sm text-gray-400">
                    Your voiceprint is encrypted and stored securely. Only you can access the platform
                    using your voice. This adds an extra layer of protection beyond passwords.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
