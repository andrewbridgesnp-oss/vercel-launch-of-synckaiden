import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export function VoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setTranscript('');
    } else {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        const commands = [
          'Show agent performance',
          'Deploy new workflow',
          'Analyze revenue trends',
          'Open workflow builder',
          'Show active agents'
        ];
        setTranscript(commands[Math.floor(Math.random() * commands.length)]);
        setIsProcessing(true);
        
        setTimeout(() => {
          setIsProcessing(false);
          setIsListening(false);
          setTranscript('');
        }, 2000);
      }, 1500);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-lg transition-all flex items-center gap-2 ${
          isListening
            ? 'bg-red-600 text-white animate-pulse'
            : 'bg-slate-900/50 text-blue-400 hover:bg-slate-900 border border-blue-800/30'
        }`}
      >
        {isListening ? (
          <>
            <Mic className="w-4 h-4" />
            <span className="text-sm hidden md:inline">Listening...</span>
          </>
        ) : (
          <>
            <MicOff className="w-4 h-4" />
            <span className="text-sm hidden md:inline">Voice Command</span>
          </>
        )}
      </button>

      {/* Voice Input Display */}
      {(transcript || isProcessing) && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-950 border border-blue-600/50 rounded-lg p-4 shadow-xl z-50">
          <div className="flex items-start gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-blue-400 text-xs mb-1">
                {isProcessing ? 'Processing...' : 'You said:'}
              </div>
              <div className="text-white text-sm">{transcript}</div>
            </div>
          </div>
          {isProcessing && (
            <div className="flex gap-1 mt-3">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
