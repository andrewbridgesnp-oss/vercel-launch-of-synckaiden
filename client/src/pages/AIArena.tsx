import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Swords, Brain, Sparkles, Zap, Send, Loader2, CheckCircle, Clock } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { FeatureGate } from "@/components/FeatureGate";

interface DebateMessage {
  speaker: string;
  message: string;
  timestamp: number;
}

export default function AIArena() {
  return (
    <FeatureGate feature="ai_arena">
      <AIArenaContent />
    </FeatureGate>
  );
}

function AIArenaContent() {
  const { isAuthenticated } = useAuth();
  const [question, setQuestion] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [debateLog, setDebateLog] = useState<DebateMessage[]>([]);
  const [consensus, setConsensus] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [currentRound, setCurrentRound] = useState(0);
  const [hasDebated, setHasDebated] = useState(false);
  const debateLogRef = useRef<HTMLDivElement>(null);

  const llmModels = [
    { id: "kayden", name: "Kaiden", icon: Sparkles, color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
    { id: "analyst", name: "Analyst", icon: Brain, color: "text-purple-400", bgColor: "bg-purple-500/20" },
    { id: "innovator", name: "Innovator", icon: Zap, color: "text-orange-400", bgColor: "bg-orange-500/20" },
  ];

  const sendMessage = trpc.chat.sendMessage.useMutation();
  const createConversation = trpc.chat.createConversation.useMutation();

  // Auto-scroll debate log
  useEffect(() => {
    if (debateLogRef.current) {
      debateLogRef.current.scrollTop = debateLogRef.current.scrollHeight;
    }
  }, [debateLog]);

  // Timer countdown during debate
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDebating && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDebating, timeRemaining]);

  const startDebate = async () => {
    if (!question.trim() || !isAuthenticated) return;

    setIsDebating(true);
    setHasDebated(true);
    setDebateLog([]);
    setConsensus(null);
    setTimeRemaining(60);
    setCurrentRound(0);

    try {
      // Create a conversation for the debate
      const conversation = await createConversation.mutateAsync({
        title: `AI Arena Debate: ${question.slice(0, 30)}...`,
      });

      // Simulate 6 rounds of 10-second exchanges (60 seconds total)
      const totalRounds = 6;
      const perspectives = [
        { name: "Kaiden", style: "balanced and practical" },
        { name: "Analyst", style: "data-driven and analytical" },
        { name: "Innovator", style: "creative and unconventional" },
      ];

      let debateHistory = "";
      
      for (let round = 0; round < totalRounds; round++) {
        setCurrentRound(round + 1);
        
        // Each AI takes a turn in this round
        const speakerIndex = round % 3;
        const speaker = perspectives[speakerIndex];
        
        const prompt = round === 0
          ? `You are ${speaker.name}, a ${speaker.style} advisor. The question is: "${question}". Give your initial perspective in 2-3 sentences. Be direct and specific.`
          : `You are ${speaker.name}, a ${speaker.style} advisor. The debate so far:\n${debateHistory}\n\nRespond to the previous points in 2-3 sentences. ${round >= 4 ? "Start finding common ground for a consensus." : "Challenge or build on their ideas."}`;

        try {
          const result = await sendMessage.mutateAsync({
            conversationId: conversation.id,
            content: prompt,
          });

          const response = result.assistantMessage.content;
          
          setDebateLog(prev => [...prev, {
            speaker: speaker.name,
            message: response,
            timestamp: Date.now(),
          }]);

          debateHistory += `\n${speaker.name}: ${response}`;
          
          // Small delay between responses for readability
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error in round ${round}:`, error);
        }
      }

      // Final consensus round
      setCurrentRound(7);
      const consensusPrompt = `Based on this debate:\n${debateHistory}\n\nAs a moderator, synthesize the key points into ONE unified recommendation that all three perspectives would agree on. Be specific and actionable. Start with "CONSENSUS:"`;

      const consensusResult = await sendMessage.mutateAsync({
        conversationId: conversation.id,
        content: consensusPrompt,
      });

      setConsensus(consensusResult.assistantMessage.content);
      
    } catch (error) {
      console.error("Debate error:", error);
      setConsensus("Unable to reach consensus. Please try again.");
    }

    setIsDebating(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Swords className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #e0e0e8 0%, #ffffff 50%, #c0c0d0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
            AI Arena
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three AI perspectives debate your question and reach a unified consensus in 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left: Question Input & Participants */}
          <div className="space-y-6">
            {/* Question Input */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Your Question</h2>
              <Textarea
                placeholder="Enter a business question, strategy dilemma, or any topic..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] bg-background/50 border-border/50 text-gray-200 mb-4"
                disabled={isDebating}
              />
              {isAuthenticated ? (
                <Button 
                  onClick={startDebate}
                  disabled={!question.trim() || isDebating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                >
                  {isDebating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Debate in Progress...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Start 60-Second Debate
                    </>
                  )}
                </Button>
              ) : (
                <a href={getLoginUrl()} className="block">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90">
                    Sign In to Start Debate
                  </Button>
                </a>
              )}
            </Card>

            {/* Participants */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Debate Participants</h2>
              <div className="space-y-3">
                {llmModels.map((model) => (
                  <div key={model.id} className={`flex items-center gap-3 p-3 rounded-lg ${model.bgColor}`}>
                    <model.icon className={`w-6 h-6 ${model.color}`} />
                    <div>
                      <p className="font-medium text-gray-200">{model.name}</p>
                      <p className="text-xs text-gray-400">
                        {model.id === "kayden" && "Balanced, practical advisor"}
                        {model.id === "analyst" && "Data-driven perspective"}
                        {model.id === "innovator" && "Creative thinker"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Timer & Status */}
            {isDebating && (
              <Card className="glass border-border/50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-cyan-400 animate-pulse" />
                    <div>
                      <p className="text-sm text-gray-400">Time Remaining</p>
                      <p className="text-2xl font-bold text-white">{formatTime(timeRemaining)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Round</p>
                    <p className="text-2xl font-bold text-cyan-400">{currentRound}/6</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right: Debate Log & Consensus */}
          <div className="space-y-6">
            {/* Debate Log */}
            <Card className="glass border-border/50 p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Live Debate</h2>
              <div 
                ref={debateLogRef}
                className="h-[300px] overflow-y-auto space-y-4 pr-2"
              >
                {!hasDebated && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Ask a question to start the debate...</p>
                  </div>
                )}
                {debateLog.map((entry, index) => {
                  const model = llmModels.find(m => m.name === entry.speaker);
                  return (
                    <div key={index} className={`p-3 rounded-lg ${model?.bgColor || 'bg-gray-800'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {model && <model.icon className={`w-4 h-4 ${model.color}`} />}
                        <span className={`font-semibold text-sm ${model?.color || 'text-gray-300'}`}>
                          {entry.speaker}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{entry.message}</p>
                    </div>
                  );
                })}
                {isDebating && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Consensus */}
            {consensus && (
              <Card className="glass border-cyan-500/30 p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-cyan-300">Unified Consensus</h2>
                </div>
                <p className="text-gray-200 leading-relaxed">{consensus}</p>
              </Card>
            )}
          </div>
        </div>

        {/* How It Works */}
        <Card className="glass border-border/50 p-8 mt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-200 mb-6 text-center">How AI Arena Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-cyan-400">1</span>
              </div>
              <h3 className="font-semibold text-gray-200 mb-2">Ask</h3>
              <p className="text-sm text-gray-400">Enter your question</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="font-semibold text-gray-200 mb-2">Debate</h3>
              <p className="text-sm text-gray-400">3 AIs exchange ideas (10s rounds)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-orange-400">3</span>
              </div>
              <h3 className="font-semibold text-gray-200 mb-2">Converge</h3>
              <p className="text-sm text-gray-400">Find common ground</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-green-400">4</span>
              </div>
              <h3 className="font-semibold text-gray-200 mb-2">Consensus</h3>
              <p className="text-sm text-gray-400">One unified answer</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export { AIArenaContent };
