import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Upload, Loader2, ArrowLeft, Copy, Check } from 'lucide-react';

const FREE_TRANSCRIPTION_LIMIT = 5;

export default function FreeSpeechToText() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcriptionCount, setTranscriptionCount] = useState(0);
  const [copied, setCopied] = useState(false);

  async function handleTranscribe() {
    if (!file || loading) return;

    if (transcriptionCount >= FREE_TRANSCRIPTION_LIMIT) {
      alert(`You've reached the free limit of ${FREE_TRANSCRIPTION_LIMIT} transcriptions. Subscribe for unlimited access!`);
      return;
    }

    setLoading(true);
    setTranscriptionCount(prev => prev + 1);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to transcribe');

      const data = await response.json();
      setTranscription(data.text);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to transcribe audio. Please try again.');
      setTranscriptionCount(prev => prev - 1);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const remainingTranscriptions = FREE_TRANSCRIPTION_LIMIT - transcriptionCount;

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
            <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30 mb-4">
              <Mic className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-semibold">FREE Speech-to-Text</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Audio Transcription</h1>
            <p className="text-white/70 text-lg">
              Powered by Manus AI - {remainingTranscriptions} free transcriptions remaining
            </p>
          </div>

          {/* Upload */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 mb-6">
            <label className="block text-white font-semibold mb-4">
              Upload Audio File
            </label>
            <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.mp4,.webm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading || transcriptionCount >= FREE_TRANSCRIPTION_LIMIT}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-white/50 mx-auto mb-3" />
                <p className="text-white/70 mb-2">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-white/50 text-sm">
                  Supports MP3, WAV, M4A, MP4, WebM
                </p>
              </label>
            </div>

            <Button
              onClick={handleTranscribe}
              disabled={loading || !file || transcriptionCount >= FREE_TRANSCRIPTION_LIMIT}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Transcribe Audio
                </>
              )}
            </Button>
          </Card>

          {/* Transcription Result */}
          {transcription && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Transcription</h3>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-white whitespace-pre-wrap max-h-96 overflow-y-auto">
                {transcription}
              </div>
            </Card>
          )}

          {/* Upgrade Prompt */}
          {transcriptionCount >= FREE_TRANSCRIPTION_LIMIT ? (
            <Card className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border-blue-400/30 p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Free Limit Reached</h3>
                <p className="text-white/80 mb-4">
                  Subscribe to AI Intelligence Suite for unlimited transcription and 4 more powerful apps!
                </p>
                <Link href="/gate-8">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    View Plans - Starting at $39.99/mo
                  </Button>
                </Link>
              </div>
            </Card>
          ) : remainingTranscriptions <= 2 && (
            <Card className="mt-6 bg-white/5 backdrop-blur-xl border-white/20 p-4">
              <p className="text-white/70 text-center text-sm">
                {remainingTranscriptions} transcription{remainingTranscriptions !== 1 ? 's' : ''} remaining. Want unlimited? Check out our{' '}
                <Link href="/gate-8">
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline">
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
