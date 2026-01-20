import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Loader2, ArrowLeft, Download, RefreshCw, FileCheck } from 'lucide-react';

const FREE_CONVERSION_LIMIT = 5;

const CONVERSION_TYPES = [
  { from: 'PDF', to: 'Word', icon: '📄→📝', color: 'blue' },
  { from: 'Word', to: 'PDF', icon: '📝→📄', color: 'red' },
  { from: 'Markdown', to: 'PDF', icon: '📋→📄', color: 'green' },
  { from: 'HTML', to: 'PDF', icon: '🌐→📄', color: 'orange' },
  { from: 'Image', to: 'PDF', icon: '🖼️→📄', color: 'purple' },
  { from: 'Excel', to: 'PDF', icon: '📊→📄', color: 'emerald' },
];

export default function FreeDocConverter() {
  const [selectedType, setSelectedType] = useState(CONVERSION_TYPES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState('');
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
      formData.append('from', selectedType.from);
      formData.append('to', selectedType.to);

      const response = await fetch('/api/convert-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to convert document');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to convert document. Please try again.');
      setConversionCount(prev => prev - 1);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setConvertedUrl('');
    }
  };

  const remainingConversions = FREE_CONVERSION_LIMIT - conversionCount;
  const hasReachedLimit = conversionCount >= FREE_CONVERSION_LIMIT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30 mb-4">
              <RefreshCw className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-semibold">FREEBIE</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Universal Document Converter</h1>
            <p className="text-white/70 text-lg mb-2">
              Convert between PDF, Word, Markdown, HTML, Images, and more
            </p>
            <p className="text-orange-400 font-semibold">
              {remainingConversions > 0 ? `${remainingConversions} free conversions remaining` : 'Free limit reached'}
            </p>
          </div>

          {/* Conversion Type Selector */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-6">
            <label className="block text-white font-semibold mb-4 text-lg">
              Choose conversion type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CONVERSION_TYPES.map((type) => (
                <button
                  key={`${type.from}-${type.to}`}
                  onClick={() => setSelectedType(type)}
                  disabled={hasReachedLimit}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedType === type
                      ? `bg-${type.color}-500/20 border-${type.color}-500/50`
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  } ${hasReachedLimit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-white font-semibold text-sm">
                    {type.from} → {type.to}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* File Upload */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 mb-6">
            <label className="block text-white font-semibold mb-4 text-lg">
              Upload your {selectedType.from} file
            </label>
            <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-orange-500/50 transition-all">
              <FileText className="w-16 h-16 mx-auto mb-4 text-white/50" />
              <input
                type="file"
                onChange={handleFileChange}
                disabled={hasReachedLimit}
                accept={selectedType.from === 'PDF' ? '.pdf' : selectedType.from === 'Word' ? '.doc,.docx' : '*'}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`inline-block px-6 py-3 rounded-xl bg-white/10 text-white font-semibold ${
                  hasReachedLimit ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 cursor-pointer'
                } transition-all`}
              >
                {file ? file.name : 'Choose File'}
              </label>
            </div>

            <Button
              onClick={handleConvert}
              disabled={loading || !file || hasReachedLimit}
              className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Converting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Convert to {selectedType.to}
                </>
              )}
            </Button>
          </Card>

          {/* Converted File */}
          {convertedUrl && (
            <Card className="bg-green-500/10 backdrop-blur-xl border-green-500/30 p-8 mb-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-2xl font-bold text-green-400">Conversion Complete!</h3>
                  <p className="text-white/70">Your file is ready to download</p>
                </div>
              </div>
              <a href={convertedUrl} download={`converted.${selectedType.to.toLowerCase()}`}>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download {selectedType.to} File
                </Button>
              </a>
            </Card>
          )}

          {/* Upgrade Prompt */}
          {hasReachedLimit ? (
            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border-orange-400/30 p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">🔥 Need More Conversions?</h3>
                <p className="text-white/80 text-lg mb-6">
                  Subscribe to Business Operations Hub for unlimited document conversions plus 9 more business apps!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/gate-8">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg px-8 py-6">
                      View Plans - $49.99/mo
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            !loading && !convertedUrl && (
              <Card className="bg-white/5 backdrop-blur-xl border-white/20 p-12">
                <div className="text-center text-white/50">
                  <RefreshCw className="w-24 h-24 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select a conversion type and upload your file to get started</p>
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
