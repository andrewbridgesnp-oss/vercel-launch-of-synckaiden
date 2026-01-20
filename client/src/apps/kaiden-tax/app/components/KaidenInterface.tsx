import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, TrendingUp, Calculator, AlertCircle, Loader2, Clock, Lightbulb, Command, Settings, Menu, Activity, ChevronDown, Mic, Volume2, Power } from 'lucide-react';
import { TaxReturn } from '@/lib/taxEngine';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';
import { KaidenAvatar } from '@/app/components/KaidenAvatar';
import { VoiceWaveform } from '@/app/components/VoiceWaveform';
import { QuickActions } from '@/app/components/QuickActions';
import { CommandHistory } from '@/app/components/CommandHistory';
import { InsightsPanel } from '@/app/components/InsightsPanel';
import { SettingsPanel } from '@/app/components/SettingsPanel';
import { KeyboardShortcuts } from '@/app/components/KeyboardShortcuts';

interface KaidenInterfaceProps {
  userMode: 'filer' | 'preparer' | 'planner';
  taxData?: Partial<TaxReturn>;
}

interface Message {
  id: string;
  type: 'user' | 'kaiden';
  content: string;
  timestamp: Date;
}

type AvatarState = 'listening' | 'active' | 'thinking' | 'standby';

export function KaidenInterface({ userMode, taxData }: KaidenInterfaceProps) {
  const [avatarState, setAvatarState] = useState<AvatarState>('listening');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready');
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'kaiden',
      content: `Hello! I'm KAIDEN, your AI tax intelligence assistant. I can help you understand your tax situation, identify opportunities, and answer questions. ${taxData ? "I can see your tax data and provide personalized insights." : "Upload your tax data to get started with personalized advice."}`,
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    if (avatarState === 'active' && isTyping) {
      handleStateChange('thinking');
      setStatusMessage('Analyzing...');
      
      // Simulate voice recognition
      setTimeout(() => {
        handleStateChange('active');
        setIsTyping(false);
        setStatusMessage('Ready');
      }, 2000);
    }
  }, [avatarState, isTyping]);

  const handleStateChange = (newState: AvatarState) => {
    setAvatarState(newState);
    
    switch(newState) {
      case 'listening':
        setStatusMessage('Ready');
        break;
      case 'active':
        setStatusMessage('Processing');
        break;
      case 'thinking':
        setStatusMessage('Analyzing');
        break;
      case 'standby':
        setStatusMessage('Standby');
        break;
    }
  };

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      handleStateChange('thinking');
      setStatusMessage('Listening...');
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        handleStateChange('active');
        setIsTyping(true);
      }, 2000);
    }
  };

  const handleQuickAction = (action: any) => {
    setShowQuickActions(false);
    
    // Navigate to the appropriate module based on action
    if (action.id === 'tax-calc') {
      // Show tax dashboard
      toast.success('Opening Tax Calculator...', {
        description: 'Launching comprehensive tax analysis'
      });
      // Use setTimeout to ensure toast shows before navigation
      setTimeout(() => {
        window.location.hash = '#tax-dashboard';
      }, 100);
    } else if (action.id === 'crypto-report') {
      // Show crypto calculator
      toast.success('Opening Crypto Tax Calculator...', {
        description: 'Loading cryptocurrency portfolio analysis'
      });
      setTimeout(() => {
        window.location.hash = '#crypto-calculator';
      }, 100);
    } else {
      // For other actions, show AI response
      toast.success(`Opening ${action.label}...`, {
        description: 'Initializing module'
      });
      handleStateChange('thinking');
      setStatusMessage(`Initiating ${action.label}...`);
      
      setTimeout(() => {
        handleStateChange('active');
        setIsTyping(true);
      }, 1500);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call REAL AI API
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3b494ce7/ai/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            message: input,
            taxContext: taxData || {},
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'kaiden',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);

        // Optional: Play voice synthesis
        playVoice(data.response);
      } else if (data.fallback) {
        // Fallback message if API fails
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'kaiden',
          content: data.fallback + '\n\n💡 **Note:** To enable AI features, add your OpenAI API key to Supabase Secrets. See /API_KEYS_SETUP.md for instructions.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, fallbackMessage]);
        toast.error('AI service temporarily unavailable', {
          description: 'Using fallback mode. Add OpenAI API key to enable AI.',
        });
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      
      // Fallback to basic response when API not configured
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'kaiden',
        content: `I apologize, but I'm currently running in limited mode. To enable full AI capabilities:\n\n1. Get an OpenAI API key from https://platform.openai.com\n2. Add it to Supabase Secrets as OPENAI_API_KEY\n3. See /API_KEYS_SETUP.md for detailed instructions\n\nIn the meantime, you can:\n• Use the Tax Calculator for calculations\n• Import/export CSV files\n• Use the Crypto Tax calculator\n• Review the legal compliance docs`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
      
      toast.error('AI features not configured', {
        description: 'Add OpenAI API key to Supabase Secrets',
        duration: 5000,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const playVoice = async (text: string) => {
    // Only try if not too long (to save costs)
    if (text.length > 500) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3b494ce7/ai/voice`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      // Silent fail - voice is optional
      console.log('Voice synthesis not available');
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(168, 182, 216, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 182, 216, 0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Ambient Background Gradient */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[140px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: 'radial-gradient(circle, rgba(168, 182, 216, 0.5), transparent)',
        }}
      />

      {/* Panels */}
      <CommandHistory isOpen={showHistory} />
      <InsightsPanel isOpen={showInsights} />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <KeyboardShortcuts isOpen={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />

      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top Navigation Bar */}
        <div className="flex-shrink-0 p-4 md:p-6 mt-20 md:mt-8">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="p-2.5 md:p-3 rounded-xl backdrop-blur-md hover:scale-105 transition-all"
                style={{
                  background: showHistory ? 'rgba(168, 182, 216, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(168, 182, 216, 0.2)',
                }}
                aria-label="Toggle command history (H)"
              >
                <Clock className="w-5 h-5 text-slate-300" />
              </button>
              
              <button 
                onClick={() => setShowInsights(!showInsights)}
                className="p-2.5 md:p-3 rounded-xl backdrop-blur-md hover:scale-105 transition-all"
                style={{
                  background: showInsights ? 'rgba(168, 182, 216, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(168, 182, 216, 0.2)',
                }}
                aria-label="Toggle insights panel (I)"
              >
                <Lightbulb className="w-5 h-5 text-slate-300" />
              </button>

              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(168, 182, 216, 0.2)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
                <span className="text-slate-300 text-sm font-medium tracking-wide">SYSTEM ONLINE</span>
              </div>
            </div>
            
            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowKeyboardHelp(true)}
                className="p-2.5 md:p-3 rounded-xl backdrop-blur-md hover:scale-105 transition-all hidden md:flex"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(168, 182, 216, 0.2)',
                }}
                aria-label="Keyboard shortcuts (?)"
              >
                <Command className="w-5 h-5 text-slate-300" />
              </button>
              
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2.5 md:p-3 rounded-xl backdrop-blur-md hover:scale-105 transition-all"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(168, 182, 216, 0.2)',
                }}
                aria-label="Settings (S)"
              >
                <Settings className="w-5 h-5 text-slate-300" />
              </button>
              
              <button 
                className="p-2.5 md:p-3 rounded-xl backdrop-blur-md hover:scale-105 transition-all md:hidden"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(168, 182, 216, 0.2)',
                }}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 pb-8 overflow-y-auto">
          {/* Avatar Section */}
          <div className="relative mb-20 md:mb-24 mt-12 md:mt-16">
            <KaidenAvatar 
              state={avatarState}
              className="w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80"
            />
            
            {/* Enhanced Status Indicator */}
            <motion.div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 px-8 py-3 rounded-2xl backdrop-blur-xl"
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(168, 182, 216, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-medium tracking-wide">
                  {statusMessage}
                </span>
                {(avatarState === 'active' || avatarState === 'thinking') && (
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                )}
              </div>
            </motion.div>
          </div>

          {/* Identity Section */}
          <motion.div
            className="text-center mb-8 md:mb-10 mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-light mb-3 tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #a8b6d8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              KAIDEN
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium tracking-[0.3em] uppercase">
              AI Executive Intelligence
            </p>
          </motion.div>

          {/* Voice Waveform Display */}
          <AnimatePresence mode="wait">
            {(isListening || isTyping) && (
              <motion.div
                className="w-full max-w-md h-16 mb-6 rounded-2xl backdrop-blur-md flex items-center justify-center px-6"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(168, 182, 216, 0.2)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <VoiceWaveform isActive={isListening || isTyping} variant="compact" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Response Display */}
          <AnimatePresence mode="wait">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                className="w-full max-w-3xl px-6 md:px-8 py-6 md:py-8 rounded-2xl backdrop-blur-xl mb-8"
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(168, 182, 216, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-1 h-full bg-gradient-to-b from-emerald-400 via-blue-400 to-transparent rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-200 text-base md:text-lg leading-relaxed">
                      {msg.content}
                      {msg.type === 'kaiden' && (
                        <motion.span
                          className="inline-block w-1 h-5 bg-slate-400 ml-1"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Quick Actions Toggle */}
          {!showQuickActions && !isTyping && (
            <motion.button
              onClick={() => setShowQuickActions(true)}
              className="mb-6 px-6 py-3 rounded-2xl backdrop-blur-md hover:scale-105 transition-all"
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(168, 182, 216, 0.2)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-sm font-medium">Quick Actions</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </motion.button>
          )}

          {/* Quick Actions Grid */}
          <AnimatePresence>
            {showQuickActions && !isTyping && (
              <motion.div
                className="w-full max-w-5xl mb-8 mt-16 relative z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuickActions onActionSelect={handleQuickAction} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Control Panel */}
          <motion.div
            className="flex items-center gap-4 md:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {/* Microphone Button - Primary Action */}
            <button
              onClick={toggleListening}
              disabled={isListening || isTyping}
              className="relative group"
            >
              <motion.div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                style={{
                  background: isListening 
                    ? 'linear-gradient(135deg, rgba(168, 182, 216, 0.4), rgba(147, 158, 187, 0.3))'
                    : 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6))',
                  border: '2px solid rgba(168, 182, 216, 0.4)',
                  boxShadow: isListening
                    ? '0 0 40px rgba(168, 182, 216, 0.6), 0 0 80px rgba(168, 182, 216, 0.3)'
                    : '0 10px 40px rgba(0, 0, 0, 0.4)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${isListening ? 'text-slate-100' : 'text-slate-300'}`} />
              </motion.div>
              
              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-slate-300"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{
                      scale: [1, 1.5],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-slate-400"
                    initial={{ scale: 1, opacity: 0.4 }}
                    animate={{
                      scale: [1, 1.6],
                      opacity: [0.4, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                  />
                </>
              )}
            </button>

            {/* Volume Button */}
            <button className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center backdrop-blur-md hover:scale-105 transition-transform"
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(168, 182, 216, 0.3)',
              }}
            >
              <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
            </button>

            {/* Standby Button */}
            <button
              onClick={() => handleStateChange(avatarState === 'standby' ? 'listening' : 'standby')}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center backdrop-blur-md hover:scale-105 transition-transform"
              style={{
                background: avatarState === 'standby' ? 'rgba(168, 182, 216, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(168, 182, 216, 0.3)',
              }}
            >
              <Power className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
            </button>
          </motion.div>
        </div>

        {/* Bottom Info Bar */}
        <div className="flex-shrink-0 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs text-slate-500 tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
              <span>SECURE CONNECTION</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
              <span>END-TO-END ENCRYPTED</span>
            </div>
            <div className="flex items-center gap-2 hidden md:flex">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
              <span>NEURAL ENGINE ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}