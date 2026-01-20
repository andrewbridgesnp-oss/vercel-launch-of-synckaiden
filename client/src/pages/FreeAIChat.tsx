import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Send, Loader2, ArrowLeft } from 'lucide-react';

const FREE_MESSAGE_LIMIT = 10;

export default function FreeAIChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  async function handleSend() {
    if (!input.trim() || loading) return;

    if (messageCount >= FREE_MESSAGE_LIMIT) {
      alert(`You've reached the free limit of ${FREE_MESSAGE_LIMIT} messages. Subscribe to AI Intelligence Suite for unlimited access!`);
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  const remainingMessages = FREE_MESSAGE_LIMIT - messageCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">FREE AI Chat</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Chat with AI</h1>
            <p className="text-white/70 text-lg">
              Powered by Manus AI - {remainingMessages} free messages remaining
            </p>
          </div>

          {/* Chat Container */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-6 min-h-[500px] max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles className="w-16 h-16 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Start a conversation</h3>
                <p className="text-white/60">Ask me anything! I'm powered by advanced AI.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white border border-white/20 p-4 rounded-2xl">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              disabled={loading || messageCount >= FREE_MESSAGE_LIMIT}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim() || messageCount >= FREE_MESSAGE_LIMIT}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>

          {/* Upgrade Prompt */}
          {messageCount >= FREE_MESSAGE_LIMIT ? (
            <Card className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-purple-400/30 p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Free Limit Reached</h3>
                <p className="text-white/80 mb-4">
                  Subscribe to AI Intelligence Suite for unlimited AI chat and 4 more powerful apps!
                </p>
                <Link href="/gate-8">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    View Plans - Starting at $39.99/mo
                  </Button>
                </Link>
              </div>
            </Card>
          ) : remainingMessages <= 3 && (
            <Card className="mt-6 bg-white/5 backdrop-blur-xl border-white/20 p-4">
              <p className="text-white/70 text-center text-sm">
                {remainingMessages} messages remaining. Want unlimited? Check out our{' '}
                <Link href="/gate-8">
                  <span className="text-purple-400 hover:text-purple-300 cursor-pointer underline">
                    AI Intelligence Suite
                  </span>
                </Link>
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
