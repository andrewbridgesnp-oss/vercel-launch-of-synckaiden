import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Upload, Loader2, ArrowLeft, Download } from 'lucide-react';

const FREE_CONVERSION_LIMIT = 5;

export default function FreePDFTools() {
  const [file, setFile] = useState<File | null>(null);
  const [tool, setTool] = useState<'markdown-to-pdf' | 'merge-pdf'>('markdown-to-pdf');
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversionCount, setConversionCount] = useState(0);

  async function handleConvert() {
    if (!file || loading) return;

    if (conversionCount >= FREE_CONVERSION_LIMIT) {
      alert(`You've reached the free limit of ${FREE_CONVERSION_LIMIT} conversions. Subscribe for unlimited access!`);
      return;
    }

    setLoading(true);
    setConversionCount(prev => prev + 1);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tool', tool);

      const response = await fetch('/api/pdf/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to convert');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process file. Please try again.');
      setConversionCount(prev => prev - 1);
    } finally {
      setLoading(false);
    }
  }

  const remainingConversions = FREE_CONVERSION_LIMIT - conversionCount;

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
            <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30 mb-4">
              <FileText className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-semibold">FREE PDF Tools</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">PDF Converter</h1>
            <p className="text-white/70 text-lg">
              Powered by Manus - {remainingConversions} free conversions remaining
            </p>
          </div>

          {/* Tool Selector */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-6">
            <label className="block text-white font-semibold mb-4">
              Select Tool
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTool('markdown-to-pdf')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tool === 'markdown-to-pdf'
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <FileText className={`w-8 h-8 mx-auto mb-2 ${tool === 'markdown-to-pdf' ? 'text-orange-400' : 'text-white/50'}`} />
                <p className="text-white font-semibold">Markdown to PDF</p>
              </button>
              <button
                onClick={() => setTool('merge-pdf')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tool === 'merge-pdf'
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <FileText className={`w-8 h-8 mx-auto mb-2 ${tool === 'merge-pdf' ? 'text-orange-400' : 'text-white/50'}`} />
                <p className="text-white font-semibold">Merge PDFs</p>
              </button>
            </div>
          </Card>

          {/* Upload */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 mb-6">
            <label className="block text-white font-semibold mb-4">
              Upload File
            </label>
            <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept={tool === 'markdown-to-pdf' ? '.md,.markdown' : '.pdf'}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading || conversionCount >= FREE_CONVERSION_LIMIT}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-white/50 mx-auto mb-3" />
                <p className="text-white/70 mb-2">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-white/50 text-sm">
                  {tool === 'markdown-to-pdf' ? 'Supports .md, .markdown' : 'Supports .pdf'}
                </p>
              </label>
            </div>

            <Button
              onClick={handleConvert}
              disabled={loading || !file || conversionCount >= FREE_CONVERSION_LIMIT}
              className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Convert File
                </>
              )}
            </Button>
          </Card>

          {/* Result */}
          {resultUrl && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-6">
              <div className="text-center">
                <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Conversion Complete!</h3>
                <a href={resultUrl} download="converted.pdf">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </Card>
          )}

          {/* Upgrade Prompt */}
          {conversionCount >= FREE_CONVERSION_LIMIT ? (
            <Card className="mt-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border-orange-400/30 p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Free Limit Reached</h3>
                <p className="text-white/80 mb-4">
                  Subscribe to Business Operations Hub for unlimited PDF tools and 9 more powerful apps!
                </p>
                <Link href="/gate-8">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    View Plans - Starting at $49.99/mo
                  </Button>
                </Link>
              </div>
            </Card>
          ) : remainingConversions <= 2 && (
            <Card className="mt-6 bg-white/5 backdrop-blur-xl border-white/20 p-4">
              <p className="text-white/70 text-center text-sm">
                {remainingConversions} conversion{remainingConversions !== 1 ? 's' : ''} remaining. Want unlimited? Check out our{' '}
                <Link href="/gate-8">
                  <span className="text-orange-400 hover:text-orange-300 cursor-pointer underline">
                    Business Operations Hub
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
