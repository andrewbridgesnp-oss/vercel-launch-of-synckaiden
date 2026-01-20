import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Swords, Loader2, ArrowLeft, Trophy, Zap } from 'lucide-react';

const FREE_QUESTION_LIMIT = 1;

interface AIResponse {
  model: string;
  response: string;
  color: string;
  icon: string;
}

export default function FreeAIArena() {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [consensus, setConsensus] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  async function handleAsk() {
    if (!question.trim() || loading) return;

    if (questionCount >= FREE_QUESTION_LIMIT) {
      alert(`You've used your free question. Subscribe to AI Intelligence Suite for unlimited access!`);
      return;
    }

    setLoading(true);
    setQuestionCount(prev => prev + 1);
    setResponses([]);
    setConsensus('');

    try {
      const response = await fetch('/api/ai/arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error('Failed to get responses');

      const data = await response.json();
      
      // Animate responses appearing one by one
      for (let i = 0; i < data.responses.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setResponses(prev => [...prev, data.responses[i]]);
      }
      
      // Show consensus after all responses
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConsensus(data.consensus);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get responses. Please try again.');
      setQuestionCount(prev => prev - 1);
    } finally {
      setLoading(false);
    }
  }

  const hasUsedFreeQuestion = questionCount >= FREE_QUESTION_LIMIT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-500/30 mb-4">
              <Swords className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">FREEBIE</span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-4">
              <span className="text-green-400">GPT</span>
              <span className="text-white/50">vs</span>
              <span className="text-cyan-400">Manus</span>
              <span className="text-white/50">vs</span>
              <span className="text-purple-400">Grok</span>
            </h1>
            <p className="text-white/70 text-xl mb-2">
              Watch 3 AI models debate your question and reach consensus
            </p>
            <p className="text-cyan-400 font-semibold">
              {hasUsedFreeQuestion ? 'Free question used' : '1 free question available'}
            </p>
          </div>

          {/* Input */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-8">
            <label className="block text-white font-semibold mb-3 text-lg">
              Ask your question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's the best way to start a business in 2026?"
              disabled={loading || hasUsedFreeQuestion}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-500/50 resize-none text-lg"
            />
            <Button
              onClick={handleAsk}
              disabled={loading || !question.trim() || hasUsedFreeQuestion}
              className="mt-4 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  AIs are debating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Start AI Debate
                </>
              )}
            </Button>
          </Card>

          {/* AI Responses */}
          {responses.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {responses.map((ai, index) => (
                <Card
                  key={index}
                  className={`bg-${ai.color}-500/10 backdrop-blur-xl border-${ai.color}-500/30 p-6 animate-fade-in`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{ai.icon}</span>
                    <div>
                      <h3 className={`text-xl font-bold text-${ai.color}-400`}>{ai.model}</h3>
                      <p className="text-white/50 text-sm">AI Response</p>
                    </div>
                  </div>
                  <p className="text-white/90 leading-relaxed">{ai.response}</p>
                </Card>
              ))}
            </div>
          )}

          {/* Consensus */}
          {consensus && (
            <Card className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl border-yellow-400/30 p-8 mb-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h3 className="text-3xl font-bold text-yellow-400">Consensus Reached</h3>
              </div>
              <p className="text-white text-lg leading-relaxed">{consensus}</p>
            </Card>
          )}

          {/* Upgrade Prompt */}
          {hasUsedFreeQuestion ? (
            <Card className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border-cyan-400/30 p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">🔥 Want Unlimited AI Debates?</h3>
                <p className="text-white/80 text-lg mb-6">
                  Subscribe to AI Intelligence Suite for unlimited AI Arena access plus 4 more powerful AI apps!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/gate-8">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-lg px-8 py-6">
                      View Plans - $39.99/mo
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            !loading && responses.length === 0 && (
              <Card className="bg-white/5 backdrop-blur-xl border-white/20 p-12">
                <div className="text-center text-white/50">
                  <Swords className="w-24 h-24 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Ask a question to see the AIs debate and reach consensus</p>
                </div>
              </Card>
            )
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
