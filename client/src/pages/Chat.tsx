import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Streamdown } from "streamdown";
import { Mic, Send, Loader2, Plus, MessageSquare, Volume2, VolumeX } from "lucide-react";
import { useTTS } from "@/hooks/useTTS";
import { toast } from "sonner";

export default function Chat() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isSupported: ttsSupported, isSpeaking, speak, stop } = useTTS();

  const utils = trpc.useUtils();

  // Fetch conversations
  const { data: conversations } = trpc.chat.getConversations.useQuery();

  // Fetch current conversation messages
  const { data: conversationData } = trpc.chat.getConversation.useQuery(
    { id: selectedConversation! },
    { enabled: selectedConversation !== null }
  );

  // Create conversation mutation
  const createConversation = trpc.chat.createConversation.useMutation({
    onSuccess: (data) => {
      setSelectedConversation(data.id);
      utils.chat.getConversations.invalidate();
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationData?.messages, streamingMessage]);

  const handleStreamingChat = async (conversationId: number, message: string) => {
    setIsStreaming(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId, message }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to streaming endpoint");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                toast.error(data.error);
                break;
              }

              if (data.done) {
                // Stream complete
                const finalMessage = streamingMessage;
                setIsStreaming(false);
                setStreamingMessage("");
                
                // Speak the response if TTS is enabled
                if (ttsEnabled && finalMessage) {
                  speak(finalMessage);
                }
                
                // Refresh conversation to show final message
                utils.chat.getConversation.invalidate({ id: conversationId });
                utils.chat.getConversations.invalidate();
                break;
              }

              if (data.content) {
                setStreamingMessage((prev) => prev + data.content);
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      toast.error("Failed to send message");
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const message = input;
    setInput(""); // Clear input immediately

    if (!selectedConversation) {
      // Create new conversation first
      const newConv = await createConversation.mutateAsync({ title: "New Chat" });
      setSelectedConversation(newConv.id);
      
      // Send message with streaming
      await handleStreamingChat(newConv.id, message);
    } else {
      // Send message with streaming
      await handleStreamingChat(selectedConversation, message);
    }
  };

  const handleNewChat = () => {
    createConversation.mutate({ title: "New Chat" });
  };

  const handleVoiceRecord = () => {
    toast.info("Voice input: Click and hold to record, release to send to Kaiden.");
    // Voice recording uses browser's speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        toast.success('Voice captured!');
      };
      recognition.onerror = () => toast.error('Voice recognition failed. Try again.');
      recognition.start();
      setIsRecording(true);
      setTimeout(() => {
        recognition.stop();
        setIsRecording(false);
      }, 5000);
    } else {
      toast.error('Voice input not supported in this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto h-screen flex gap-4 py-6">
        {/* Sidebar - Conversations List */}
        <Card className="w-80 glass premium-card border-border/50 flex flex-col">
          <div className="p-4 border-b border-border">
            <Button
              onClick={handleNewChat}
              className="w-full elegant-button bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={createConversation.isPending}
            >
              {createConversation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              New Conversation
            </Button>
          </div>

          <ScrollArea className="flex-1 p-2">
            {conversations?.map((conv) => (
              <Button
                key={conv.id}
                variant={selectedConversation === conv.id ? "default" : "ghost"}
                className="w-full justify-start mb-2 text-left"
                onClick={() => setSelectedConversation(conv.id)}
              >
                <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{conv.title || "New Chat"}</span>
              </Button>
            ))}
          </ScrollArea>
        </Card>

        {/* Main Chat Area */}
        <Card className="flex-1 glass premium-card border-border/50 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-6">
                  {conversationData?.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "glass border border-border/50"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <Streamdown>{msg.content}</Streamdown>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Streaming message */}
                  {isStreaming && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl px-6 py-4 glass border border-border/50">
                        {streamingMessage ? (
                          <Streamdown>{streamingMessage}</Streamdown>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Kaiden is thinking...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-6 border-t border-border/30">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleVoiceRecord}
                    disabled={isRecording || isStreaming}
                    className="border-border/50"
                    title="Voice input"
                  >
                    <Mic className={`h-4 w-4 ${isRecording ? "text-destructive" : ""}`} />
                  </Button>
                  {ttsSupported && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (isSpeaking) {
                          stop();
                        }
                        setTtsEnabled(!ttsEnabled);
                      }}
                      disabled={isStreaming}
                      className={`border-border/50 ${ttsEnabled ? "bg-primary/20 border-primary/50" : ""}`}
                      title={ttsEnabled ? "Voice responses enabled" : "Voice responses disabled"}
                    >
                      {ttsEnabled ? (
                        <Volume2 className="h-4 w-4 text-primary" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Message Kaiden..."
                    disabled={isStreaming}
                    className="flex-1 bg-background/50 border-border/50"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className="elegant-button bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isStreaming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="fade-in">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 gold-text" />
                <h2 className="text-2xl font-bold mb-2 gold-shimmer">Welcome to Kaiden</h2>
                <p className="text-muted-foreground mb-6">
                  Select a conversation or start a new one to begin chatting with your AI business consultant.
                </p>
                <Button
                  onClick={handleNewChat}
                  className="elegant-button bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={createConversation.isPending}
                >
                  {createConversation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Start New Conversation
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
