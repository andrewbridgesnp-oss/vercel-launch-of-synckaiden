import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, Sparkles, CheckCircle, DollarSign, Lightbulb } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  deductions?: Array<{
    name: string;
    amount: number;
    category: string;
    confidence: number;
  }>;
  timestamp: Date;
}

interface DeductionFinderAIProps {
  onDeductionFound: (deduction: any) => void;
  userIncome: number;
  filingStatus: string;
}

export function DeductionFinderAI({ onDeductionFound, userIncome, filingStatus }: DeductionFinderAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [totalDeductionsFound, setTotalDeductionsFound] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    addAssistantMessage(
      `Hey there! 👋 I'm KAIDEN's Deduction Finder AI. I'll help you discover every deduction you're entitled to.\n\nLet's start simple: Do you work from home?`,
      []
    );
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAssistantMessage = (content: string, deductions: any[] = []) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      deductions,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Process with AI logic
    setIsTyping(true);
    setTimeout(() => {
      processUserInput(input.toLowerCase());
      setIsTyping(false);
    }, 800);

    setInput('');
  };

  const processUserInput = (userInput: string) => {
    // Simple keyword matching AI (in production, this would call GPT-4)
    const responses = getAIResponse(userInput);
    
    if (responses.deductions && responses.deductions.length > 0) {
      // Add deductions
      responses.deductions.forEach(ded => {
        onDeductionFound(ded);
        setTotalDeductionsFound(prev => prev + 1);
        setTotalSavings(prev => prev + ded.estimatedSavings);
      });
    }

    addAssistantMessage(responses.message, responses.deductions);
  };

  const getAIResponse = (input: string): { message: string; deductions?: any[] } => {
    // HOME OFFICE
    if (input.includes('yes') && messages[messages.length - 1]?.content.includes('work from home')) {
      return {
        message: `Perfect! Let's calculate your home office deduction.\n\nHow many square feet is your dedicated home office space?`,
        deductions: []
      };
    }

    if (input.match(/\d+/) && messages[messages.length - 1]?.content.includes('square feet')) {
      const sqft = parseInt(input.match(/\d+/)?.[0] || '0');
      const totalSqft = 1500; // Assume average home size
      const rent = 2000; // Monthly rent assumption
      const annualRent = rent * 12;
      const deductionAmount = Math.round((sqft / totalSqft) * annualRent);
      const taxSavings = Math.round(deductionAmount * 0.22);

      return {
        message: `Excellent! Based on ${sqft} sq ft office in a ${totalSqft} sq ft home:\n\n✅ Home Office Deduction: $${deductionAmount.toLocaleString()}\n💰 Estimated Tax Savings: $${taxSavings.toLocaleString()}\n\nI've added this to your return!\n\nNext question: Did you buy any equipment for work this year? (laptop, desk, monitor, etc.)`,
        deductions: [{
          name: 'Home Office Deduction',
          amount: deductionAmount,
          category: 'Business Expenses',
          confidence: 95,
          estimatedSavings: taxSavings
        }]
      };
    }

    // EQUIPMENT PURCHASES
    if (input.includes('yes') && messages[messages.length - 1]?.content.includes('equipment')) {
      return {
        message: `Great! Tell me what you bought and approximately how much you spent. For example: "MacBook for $2,000" or "desk and monitor for $800"`,
        deductions: []
      };
    }

    if ((input.includes('laptop') || input.includes('macbook') || input.includes('computer')) && input.match(/\d+/)) {
      const amount = parseInt(input.match(/\d+/)?.[0] || '0');
      const taxSavings = Math.round(amount * 0.22);

      return {
        message: `Perfect! I'm adding that equipment purchase.\n\n✅ Equipment Deduction: $${amount.toLocaleString()}\n💰 Tax Savings: $${taxSavings.toLocaleString()}\n\nDid you drive for work (not commuting)? Like visiting clients, job sites, or work-related errands?`,
        deductions: [{
          name: 'Business Equipment',
          amount,
          category: 'Business Expenses',
          confidence: 98,
          estimatedSavings: taxSavings
        }]
      };
    }

    // MILEAGE
    if (input.includes('yes') && messages[messages.length - 1]?.content.includes('drive for work')) {
      return {
        message: `Nice! How many miles would you estimate you drove for work purposes this year?`,
        deductions: []
      };
    }

    if (input.match(/\d+/) && messages[messages.length - 1]?.content.includes('miles')) {
      const miles = parseInt(input.match(/\d+/)?.[0] || '0');
      const deductionAmount = Math.round(miles * 0.67); // 2024 IRS mileage rate
      const taxSavings = Math.round(deductionAmount * 0.22);

      return {
        message: `Awesome! ${miles.toLocaleString()} miles at $0.67/mile:\n\n✅ Mileage Deduction: $${deductionAmount.toLocaleString()}\n💰 Tax Savings: $${taxSavings.toLocaleString()}\n\nAdded!\n\nDid you donate to any charities this year? (Goodwill, church, nonprofits, etc.)`,
        deductions: [{
          name: 'Business Mileage',
          amount: deductionAmount,
          category: 'Vehicle Expenses',
          confidence: 90,
          estimatedSavings: taxSavings
        }]
      };
    }

    // CHARITABLE DONATIONS
    if (input.includes('yes') && messages[messages.length - 1]?.content.includes('charities')) {
      return {
        message: `Great! How much did you donate in total? (Include cash donations and the value of donated items)`,
        deductions: []
      };
    }

    if (input.match(/\d+/) && messages[messages.length - 1]?.content.includes('donate')) {
      const amount = parseInt(input.match(/\d+/)?.[0] || '0');
      const taxSavings = Math.round(amount * 0.22);

      return {
        message: `Perfect!\n\n✅ Charitable Contributions: $${amount.toLocaleString()}\n💰 Tax Savings: $${taxSavings.toLocaleString()}\n\n${amount > 250 ? '⚠️ Remember: You need receipts for donations over $250!' : ''}\n\nDid you pay student loan interest this year?`,
        deductions: [{
          name: 'Charitable Contributions',
          amount,
          category: 'Itemized Deductions',
          confidence: 85,
          estimatedSavings: taxSavings
        }]
      };
    }

    // STUDENT LOANS
    if (input.includes('yes') && messages[messages.length - 1]?.content.includes('student loan')) {
      return {
        message: `You can deduct up to $2,500 in student loan interest! Check your 1098-E form from your lender. How much interest did you pay?`,
        deductions: []
      };
    }

    if (input.match(/\d+/) && messages[messages.length - 1]?.content.includes('1098-E')) {
      const amount = Math.min(parseInt(input.match(/\d+/)?.[0] || '0'), 2500);
      const taxSavings = Math.round(amount * 0.22);

      return {
        message: `Got it!\n\n✅ Student Loan Interest: $${amount.toLocaleString()}\n💰 Tax Savings: $${taxSavings.toLocaleString()}\n\nDid you have any major medical expenses this year? (surgery, dental work, prescriptions, etc.)`,
        deductions: [{
          name: 'Student Loan Interest',
          amount,
          category: 'Adjustments to Income',
          confidence: 100,
          estimatedSavings: taxSavings
        }]
      };
    }

    // MEDICAL EXPENSES
    if (input.includes('yes') && messages[messages.length - 1]?.content.includes('medical')) {
      return {
        message: `Medical expenses are deductible if they exceed 7.5% of your income. What was your total out-of-pocket medical spending?`,
        deductions: []
      };
    }

    if (input.match(/\d+/) && messages[messages.length - 1]?.content.includes('out-of-pocket medical')) {
      const amount = parseInt(input.match(/\d+/)?.[0] || '0');
      const threshold = userIncome * 0.075;
      const deductibleAmount = Math.max(0, amount - threshold);
      const taxSavings = Math.round(deductibleAmount * 0.22);

      if (deductibleAmount > 0) {
        return {
          message: `Good news! Your medical expenses exceeded the threshold.\n\n✅ Medical Expense Deduction: $${deductibleAmount.toLocaleString()}\n💰 Tax Savings: $${taxSavings.toLocaleString()}\n\nThat's all my questions for now! I found ${totalDeductionsFound + 1} deductions worth $${(totalSavings + taxSavings).toLocaleString()} in tax savings.\n\nAnything else you want to ask about?`,
          deductions: [{
            name: 'Medical Expenses',
            amount: deductibleAmount,
            category: 'Itemized Deductions',
            confidence: 90,
            estimatedSavings: taxSavings
          }]
        };
      } else {
        return {
          message: `Your medical expenses ($${amount.toLocaleString()}) didn't exceed the threshold ($${Math.round(threshold).toLocaleString()}), so they're not deductible.\n\nThat's all my questions! I found ${totalDeductionsFound} deductions worth $${totalSavings.toLocaleString()} in tax savings.\n\nAnything else you want to ask about?`,
          deductions: []
        };
      }
    }

    // DEFAULT / NO MATCH
    if (input.includes('no')) {
      // Move to next question based on context
      if (messages[messages.length - 1]?.content.includes('work from home')) {
        return {
          message: `No problem! Did you buy any equipment for work this year? (laptop, desk, monitor, etc.)`,
          deductions: []
        };
      }
      if (messages[messages.length - 1]?.content.includes('equipment')) {
        return {
          message: `Okay! Did you drive for work (not commuting)? Like visiting clients, job sites, or work-related errands?`,
          deductions: []
        };
      }
      if (messages[messages.length - 1]?.content.includes('drive')) {
        return {
          message: `Got it. Did you donate to any charities this year? (Goodwill, church, nonprofits, etc.)`,
          deductions: []
        };
      }
      if (messages[messages.length - 1]?.content.includes('charities')) {
        return {
          message: `No worries. Did you pay student loan interest this year?`,
          deductions: []
        };
      }
      if (messages[messages.length - 1]?.content.includes('student loan')) {
        return {
          message: `Okay. Did you have any major medical expenses this year?`,
          deductions: []
        };
      }
      if (messages[messages.length - 1]?.content.includes('medical')) {
        return {
          message: `That's all my standard questions! I found ${totalDeductionsFound} deductions worth $${totalSavings.toLocaleString()} in tax savings.\n\nIs there anything specific you want to ask about? I can help with:\n• Retirement contributions\n• Education credits\n• State taxes\n• Business expenses\n• And more!`,
          deductions: []
        };
      }
    }

    // FALLBACK
    return {
      message: `I'm not quite sure about that. Let me help you with common deductions. Just answer "yes" or "no" to my questions, or ask me anything about:\n• Home office\n• Business expenses\n• Charitable donations\n• Student loans\n• Medical expenses\n• Retirement\n\nWhat would you like to explore?`,
      deductions: []
    };
  };

  return (
    <div className="flex flex-col h-[600px] rounded-2xl border overflow-hidden"
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(168, 182, 216, 0.2)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b"
        style={{ borderColor: 'rgba(168, 182, 216, 0.2)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Deduction Finder</h3>
              <p className="text-xs text-slate-400">TaxGPT inside KAIDEN</p>
            </div>
          </div>
          {totalDeductionsFound > 0 && (
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                ${totalSavings.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                {totalDeductionsFound} deduction{totalDeductionsFound > 1 ? 's' : ''} found
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-100'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                
                {/* Deductions found */}
                {message.deductions && message.deductions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.deductions.map((ded, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="p-3 rounded-xl bg-green-500/20 border border-green-500/30"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-green-400">{ded.name}</div>
                            <div className="text-xs text-slate-300">{ded.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              ${ded.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-green-400">
                              {ded.confidence}% sure
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-800 p-4 rounded-2xl">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <motion.div
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t"
        style={{ borderColor: 'rgba(168, 182, 216, 0.2)' }}
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your answer or ask a question..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          💡 Tip: Answer with "yes/no" or specific numbers for best results
        </p>
      </div>
    </div>
  );
}
