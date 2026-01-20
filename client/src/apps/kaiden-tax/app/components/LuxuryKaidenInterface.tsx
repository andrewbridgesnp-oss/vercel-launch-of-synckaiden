import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Mic, Send, FileText, Download, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  citations?: string[];
}

interface LuxuryKaidenInterfaceProps {
  onAnalysisComplete?: (data: any) => void;
}

export function LuxuryKaidenInterface({ onAnalysisComplete }: LuxuryKaidenInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    addMessage({
      role: 'assistant',
      content: `Good ${getTimeOfDay()}. I'm KAIDEN, your tax intelligence advisor.\n\nBefore we begin, please understand:\n\n• This is a tax planning and analysis tool\n• Not a substitute for professional tax preparation\n• Complex situations require CPA consultation\n• All analysis is subject to IRS verification\n\nHow may I assist with your tax planning today?`,
      confidence: 100,
      citations: ['IRS Circular 230', 'Professional Standards'],
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    addMessage({ role: 'user', content: userMessage });
    setInput('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const response = generateResponse(userMessage);
      addMessage({
        role: 'assistant',
        content: response.content,
        confidence: response.confidence,
        citations: response.citations,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const generateResponse = (userInput: string): Omit<Message, 'id' | 'timestamp' | 'role'> => {
    const input = userInput.toLowerCase();

    // Multi-entity business
    if (input.includes('llc') || input.includes('business') || input.includes('entity')) {
      return {
        content: `I notice you're inquiring about business entity taxation.\n\nFor comprehensive multi-entity analysis including LLCs, partnerships, and S-corporations, you'll need:\n\n• Form 1065 (Partnership Returns)\n• Form 1120S (S-Corporation Returns)  \n• Schedule K-1 distribution analysis\n• QBI deduction calculations\n• Multi-state apportionment (if applicable)\n\nRECOMMENDATION: Given the complexity, I suggest engaging a licensed CPA who specializes in business taxation. I can prepare preliminary analysis and projections to bring to your CPA consultation.\n\nWould you like me to generate a business tax planning summary for CPA review?`,
        confidence: 95,
        citations: ['IRC §§701-777', 'IRC §§1361-1379', 'IRS Publication 541', 'IRS Publication 542'],
      };
    }

    // Trust and estate
    if (input.includes('trust') || input.includes('estate') || input.includes('inheritance') || input.includes('died')) {
      return {
        content: `Trust and estate matters require specialized attention.\n\nKEY CONSIDERATIONS:\n\n• Basis step-up under IRC §1014 (inherited property)\n• Estate tax threshold: $13.61M (2024)\n• Form 706 filing requirements\n• Form 1041 for ongoing trust/estate income\n• Irrevocable trust taxation\n• Generation-skipping transfer tax\n\nLEGAL NOTICE: Estate planning constitutes legal advice. You must consult:\n1. Estate planning attorney (for legal documents)\n2. CPA (for tax compliance)\n3. Financial advisor (for asset management)\n\nI can provide tax impact analysis ONLY. This does not constitute legal advice.\n\nShall I prepare an estate tax impact summary for your professional advisors?`,
        confidence: 90,
        citations: ['IRC §1014', 'IRC §2001-2210', 'IRC §641-692', 'IRS Publication 559'],
      };
    }

    // Amended return / fraud
    if (input.includes('amend') || input.includes('fraud') || input.includes('wrong') || input.includes('mistake')) {
      return {
        content: `Amended returns and potential fraud situations require immediate professional attention.\n\nIMPORTANT:\n\n• Statute of limitations: Generally 3 years from filing\n• Fraud extends statute indefinitely\n• Form 1040-X required for amendments\n• Interest and penalties may apply\n• Voluntary disclosure programs available\n\nCRITICAL: If your previous preparer committed fraud:\n1. Contact IRS immediately (1-800-829-1040)\n2. File Form 14157 (Complaint: Tax Return Preparer)\n3. Engage a licensed CPA for review\n4. Consider legal counsel\n5. File amended returns promptly\n\nI cannot provide legal advice. This situation requires attorney consultation.\n\nWould you like contact information for IRS Whistleblower Office?`,
        confidence: 100,
        citations: ['IRC §6501', 'IRC §7206', 'IRS Publication 556', 'Treas. Reg. §1.6694-1'],
      };
    }

    // Default response
    return {
      content: `I'm here to assist with tax planning analysis.\n\nI can help with:\n\n• W-2 income optimization\n• Deduction identification\n• Tax bracket planning\n• Retirement contribution strategies\n• Crypto tax calculations\n• Estimated tax payments\n\nFor complex situations involving business entities, trusts, estates, or legal matters, professional consultation is required.\n\nWhat specific tax planning question may I address?`,
      confidence: 85,
      citations: ['IRS Publication 17', 'IRS Publication 334'],
    };
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <div className="min-h-screen relative overflow-hidden" 
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1A2B47 50%, #0A1628 100%)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Subtle premium pattern overlay */}
      <div className="absolute inset-0 opacity-5" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Header with KAIDEN Presence */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-8 mb-12 pb-8 border-b"
          style={{
            borderColor: 'rgba(212, 175, 55, 0.2)',
          }}
        >
          {/* Professional Photo Placeholder */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2"
              style={{
                borderColor: '#D4AF37',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
              }}
            >
              {/* Placeholder for KAIDEN photo */}
              <div className="w-full h-full flex items-center justify-center text-4xl"
                style={{ color: '#D4AF37' }}
              >
                K
              </div>
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2"
              style={{
                background: '#10b981',
                borderColor: '#0A1628',
              }}
            />
          </div>

          {/* Title & Description */}
          <div className="flex-1">
            <h1 className="text-4xl font-light mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                color: '#E8EBF0',
              }}
            >
              KAIDEN
            </h1>
            <p className="text-sm mb-4"
              style={{ 
                color: '#C0C5CE',
                fontFamily: 'var(--font-body)',
              }}
            >
              Tax Intelligence Advisor
            </p>
            <div className="flex items-center gap-6 text-xs"
              style={{ color: '#C0C5CE' }}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: '#D4AF37' }} />
                <span>Bank-Level Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: '#D4AF37' }} />
                <span>IRS Circular 230 Compliant</span>
              </div>
            </div>
          </div>

          {/* Voice Status */}
          <div className="text-right">
            <div className="text-xs mb-2" style={{ color: '#C0C5CE' }}>
              Voice Assistant
            </div>
            <motion.button
              onClick={handleVoiceInput}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-full transition-all ${
                isListening ? 'ring-2' : ''
              }`}
              style={{
                background: isListening 
                  ? 'linear-gradient(135deg, #D4AF37, #B8941F)'
                  : 'rgba(212, 175, 55, 0.1)',
                borderColor: '#D4AF37',
                color: isListening ? '#0A1628' : '#D4AF37',
              }}
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="space-y-6 mb-6 min-h-[500px] max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl p-6 rounded-2xl ${
                  message.role === 'user' ? 'ml-12' : 'mr-12'
                }`}
                style={{
                  background: message.role === 'user'
                    ? 'rgba(212, 175, 55, 0.1)'
                    : 'rgba(255, 255, 255, 0.03)',
                  borderLeft: message.role === 'assistant' ? '3px solid #D4AF37' : 'none',
                  borderRight: message.role === 'user' ? '3px solid #D4AF37' : 'none',
                }}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b"
                  style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium uppercase tracking-wide"
                      style={{ 
                        color: '#D4AF37',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {message.role === 'user' ? 'You' : 'KAIDEN'}
                    </span>
                    <span className="text-xs"
                      style={{ color: '#C0C5CE' }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {message.confidence && (
                    <div className="text-xs"
                      style={{ 
                        color: '#D4AF37',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {message.confidence}% Confidence
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="text-sm leading-relaxed whitespace-pre-line mb-4"
                  style={{ 
                    color: '#E8EBF0',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {message.content}
                </div>

                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="pt-3 border-t"
                    style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
                  >
                    <div className="text-xs mb-2"
                      style={{ 
                        color: '#C0C5CE',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Legal Citations:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.citations.map((citation, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: 'rgba(212, 175, 55, 0.1)',
                            color: '#D4AF37',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {citation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Processing Indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderLeft: '3px solid #D4AF37',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#D4AF37' }}
                        animate={{ 
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs"
                    style={{ color: '#C0C5CE' }}
                  >
                    Analyzing with professional tax standards...
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 pt-6">
          <div className="p-4 rounded-2xl backdrop-blur-xl"
            style={{
              background: 'rgba(26, 43, 71, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your tax situation..."
                className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  fontFamily: 'var(--font-body)',
                }}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="px-6 py-3 rounded-xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
                  color: '#0A1628',
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
            
            {/* Disclaimer */}
            <div className="mt-3 text-xs text-center"
              style={{ 
                color: '#C0C5CE',
                fontFamily: 'var(--font-mono)',
              }}
            >
              This is a tax planning tool. Not a substitute for professional tax preparation. 
              Complex situations require licensed CPA consultation.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            className="px-6 py-3 rounded-xl transition-all"
            style={{
              borderColor: '#D4AF37',
              color: '#D4AF37',
              background: 'transparent',
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
          <Button
            variant="outline"
            className="px-6 py-3 rounded-xl transition-all"
            style={{
              borderColor: '#D4AF37',
              color: '#D4AF37',
              background: 'transparent',
            }}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 175, 55, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
}
