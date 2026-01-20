import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image as ImageIcon, Wand2, Loader2, ArrowLeft, Download } from 'lucide-react';

const FREE_GENERATION_LIMIT = 3;

export default function FreeImageGen() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    if (generationCount >= FREE_GENERATION_LIMIT) {
      alert(`You've reached the free limit of ${FREE_GENERATION_LIMIT} images. Subscribe to AI Intelligence Suite for more!`);
      return;
    }

    setLoading(true);
    setGenerationCount(prev => prev + 1);

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate image');

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate image. Please try again.');
      setGenerationCount(prev => prev - 1);
    } finally {
      setLoading(false);
    }
  }

  const remainingGenerations = FREE_GENERATION_LIMIT - generationCount;

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
            <div className="inline-flex items-center gap-2 bg-pink-500/20 px-4 py-2 rounded-full border border-pink-500/30 mb-4">
              <Wand2 className="w-4 h-4 text-pink-400" />
              <span className="text-pink-400 font-semibold">FREE Image Generator</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">AI Image Generator</h1>
            <p className="text-white/70 text-lg">
              Powered by Manus AI - {remainingGenerations} free generations remaining
            </p>
          </div>

          {/* Input */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-6">
            <label className="block text-white font-semibold mb-3">
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city at sunset with flying cars..."
              disabled={loading || generationCount >= FREE_GENERATION_LIMIT}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-pink-500/50 resize-none"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || generationCount >= FREE_GENERATION_LIMIT}
              className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </Card>

          {/* Generated Image */}
          {imageUrl && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-6">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full rounded-xl shadow-2xl"
                />
                <a
                  href={imageUrl}
                  download="generated-image.png"
                  className="absolute top-4 right-4"
                >
                  <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </a>
              </div>
            </Card>
          )}

          {!imageUrl && !loading && (
            <Card className="bg-white/5 backdrop-blur-xl border-white/20 p-12">
              <div className="text-center text-white/50">
                <ImageIcon className="w-24 h-24 mx-auto mb-4 opacity-30" />
                <p>Your generated image will appear here</p>
              </div>
            </Card>
          )}

          {/* Upgrade Prompt */}
          {generationCount >= FREE_GENERATION_LIMIT ? (
            <Card className="mt-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl border-pink-400/30 p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Free Limit Reached</h3>
                <p className="text-white/80 mb-4">
                  Subscribe to AI Intelligence Suite for unlimited image generation and 4 more powerful apps!
                </p>
                <Link href="/gate-8">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    View Plans - Starting at $39.99/mo
                  </Button>
                </Link>
              </div>
            </Card>
          ) : remainingGenerations <= 1 && (
            <Card className="mt-6 bg-white/5 backdrop-blur-xl border-white/20 p-4">
              <p className="text-white/70 text-center text-sm">
                {remainingGenerations} generation{remainingGenerations !== 1 ? 's' : ''} remaining. Want unlimited? Check out our{' '}
                <Link href="/gate-8">
                  <span className="text-pink-400 hover:text-pink-300 cursor-pointer underline">
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
