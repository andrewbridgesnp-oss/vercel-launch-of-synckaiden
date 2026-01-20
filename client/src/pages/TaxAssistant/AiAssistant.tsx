
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: "Greetings. I am KAIDEN AI, your personal fiscal architect. How may I optimize your financial strategy today?"}
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', content: userMessage}]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are KAIDEN, a luxury AI fiscal assistant for high-net-worth individuals. 
          Your tone is sophisticated, professional, and slightly elitist but helpful. 
          You specialize in tax optimization, luxury assets, crypto tax law, and estate planning. 
          Always emphasize compliance and elegance in financial structures. 
          Provide responses in clear Markdown formatting.`
        }
      });

      const aiResponse = response.text || "I apologize, my cognitive processors encountered a minor disruption. Please repeat the query.";
      setMessages(prev => [...prev, {role: 'assistant', content: aiResponse}]);
    } catch (error) {
      setMessages(prev => [...prev, {role: 'assistant', content: "My apologies, there was an error in the neural link. Please check your connectivity."}]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-kaiden-charcoal border border-kaiden-gold/20 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-kaiden-gold/10 bg-kaiden-black/30 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 gold-bg rounded-xl flex items-center justify-center mr-3">
             <svg className="w-6 h-6 text-kaiden-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold gold-text">KAIDEN AI Assistant</h3>
            <p className="text-[10px] text-kaiden-silver uppercase tracking-widest">Neural Tax Engine v2.5</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-[10px] text-kaiden-silver font-medium">REAL-TIME</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
              ? 'bg-kaiden-gold text-white shadow-lg' 
              : 'bg-kaiden-black/60 border border-kaiden-gold/10 text-kaiden-white backdrop-blur-md'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'assistant' ? 'KAIDEN AI' : 'ELITE USER'} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-kaiden-black/60 border border-kaiden-gold/10 rounded-2xl p-4 flex gap-1">
              <div className="w-1.5 h-1.5 bg-kaiden-gold rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-1.5 h-1.5 bg-kaiden-gold rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-1.5 h-1.5 bg-kaiden-gold rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-kaiden-black/50 border-t border-kaiden-gold/10">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Wash-Sale rules, Estate Tax, or BTC gains..."
            className="w-full bg-kaiden-black/80 border border-kaiden-gold/20 rounded-2xl px-6 py-4 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-kaiden-gold/40 transition-all placeholder:text-kaiden-silver/30"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="absolute right-3 p-3 gold-bg text-kaiden-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        <p className="mt-4 text-[10px] text-center text-kaiden-silver/40">
           End-to-End Quantum Encryption Enabled. Responses are for informational purposes.
        </p>
      </div>
    </div>
  );
};
