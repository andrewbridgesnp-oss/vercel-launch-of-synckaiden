import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "wouter";

export default function PersonalitySync() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome! I'm Kaiden, your AI companion. Let's sync our personalities so I can interact with you in the way that resonates best. Tell me about yourself—what brings you here today?"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I appreciate you sharing that with me. To better understand how to support you, could you tell me more about your communication preferences? Do you prefer direct, concise responses or more detailed, conversational interactions?"
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-20"
      >
        <source src="/kaiden-logo-1.mp4" type="video/mp4" />
      </video>
      
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10">
        {/* Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <Link href="/">
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>

        {/* Chat Container */}
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-2xl">
                <img src="/kaiden-logo-ribbons.png" alt="Kaiden" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Personality Sync</h1>
              <p className="text-white/70">Let's get to know each other so I can serve you better</p>
            </div>

            {/* Messages */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-6 h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-6 py-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-purple-500/80 text-white"
                          : "bg-white/10 text-white/90 border border-white/20"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:border-purple-500/50"
                />
                <Button
                  onClick={handleSend}
                  className="bg-purple-500/80 hover:bg-purple-600/80 text-white px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
