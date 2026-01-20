import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Heart, 
  Smile, 
  AlertTriangle, 
  Shield,
  Sparkles,
  Volume2,
  Sliders,
  Zap,
  TrendingDown,
  MessageCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { GlassmorphismCard } from '../components/avery/glassmorphism-card';

export default function PersonalityEngine() {
  const [humor, setHumor] = useState(3);
  const [empathy, setEmpathy] = useState(4);
  const [assertiveness, setAssertiveness] = useState(3);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const conversationExamples = [
    {
      id: 'angry-customer',
      scenario: 'Angry Customer - Missed Appointment',
      urgency: 9,
      tone: 'Angry',
      icon: AlertTriangle,
      color: 'red',
      conversation: [
        {
          customer: "This is RIDICULOUS! You missed my appointment yesterday and nobody called me!",
          tone: "Angry (9/10)",
          averyThinking: "High urgency, extreme frustration, blame directed at business. Strategy: Acknowledge, apologize, de-escalate, solve.",
          averyResponse: "You're absolutely right to be upset - that's completely unacceptable. I'm so sorry we dropped the ball on that. Let me make this right immediately. I'm seeing we had a scheduling error on our end. Can I get you booked for an emergency slot today at 2 PM with a 20% discount for the inconvenience?",
          deescalation: [
            "✓ Validates emotion ('right to be upset')",
            "✓ Takes ownership ('our fault')",
            "✓ Immediate action ('make this right immediately')",
            "✓ Compensation offer (discount)"
          ]
        },
        {
          customer: "Well... I guess that works. But this better not happen again!",
          tone: "Frustrated (6/10)",
          averyThinking: "Anger reduced. Still cautious. Needs reassurance + humor to fully recover relationship.",
          averyResponse: "I hear you - and I've personally flagged your account with a big red 'VIP - DO NOT MESS UP' tag in our system. You're at 2 PM today with our best technician. I'll also text you a confirmation and a reminder 2 hours before. Sound good?",
          deescalation: [
            "✓ Light self-deprecating humor ('DO NOT MESS UP')",
            "✓ Shows extra care ('personally flagged', 'VIP')",
            "✓ Multiple safety nets (text + reminder)",
            "✓ Seeks buy-in ('Sound good?')"
          ]
        },
        {
          customer: "Yeah, okay. Thanks for sorting it out.",
          tone: "Neutral (3/10)",
          averyThinking: "Crisis averted. Customer calmed. Relationship salvaged. Mission accomplished.",
          averyResponse: "You got it. See you at 2 PM - we'll make it right. And hey, free coffee's on us when the tech arrives. Thanks for giving us another shot.",
          deescalation: [
            "✓ Confirms resolution",
            "✓ Bonus gesture (free coffee)",
            "✓ Gratitude for second chance",
            "✓ Ends on positive note"
          ]
        }
      ]
    },
    {
      id: 'anxious-customer',
      scenario: 'Anxious Customer - Emergency Situation',
      urgency: 10,
      tone: 'Panicked',
      icon: Heart,
      color: 'orange',
      conversation: [
        {
          customer: "Oh my god, there's water EVERYWHERE! My kitchen is flooding! Can someone come RIGHT NOW?!",
          tone: "Panicked (10/10)",
          averyThinking: "Emergency. High anxiety. Needs calm, competence, speed. No jokes here.",
          averyResponse: "Okay, first - take a deep breath. I've got you. Do you know where your main water shutoff valve is? Usually it's in the basement or near the water heater.",
          deescalation: [
            "✓ Calming directive ('take a deep breath')",
            "✓ Reassurance ('I've got you')",
            "✓ Immediate practical help",
            "✓ Clear, simple instructions"
          ]
        },
        {
          customer: "I... I don't know! I've never needed it before!",
          tone: "Panicked (9/10)",
          averyThinking: "Still very anxious but listening. Guide step-by-step. Show control.",
          averyResponse: "That's okay - here's what we'll do. I'm sending you a text RIGHT NOW with a diagram. Meanwhile, I'm getting our emergency tech to you within 45 minutes. Can you grab some towels and start soaking up what you can? That'll help minimize damage.",
          deescalation: [
            "✓ Normalizes not knowing ('That's okay')",
            "✓ Takes control ('here's what we'll do')",
            "✓ Multiple solutions (text + tech + towels)",
            "✓ Gives them productive action (reduces helplessness)"
          ]
        },
        {
          customer: "Okay, okay. Yes. I can do that. You're sure someone's coming?",
          tone: "Anxious (6/10)",
          averyThinking: "Calming down. Needs reassurance and confirmation. Almost there.",
          averyResponse: "I'm 100% sure. His name is Mike, he's 12 minutes away, and he's bringing all the equipment. You'll get a text when he's 5 minutes out. You're going to be fine - this is fixable, and we handle these all the time. Breathe. You've got this.",
          deescalation: [
            "✓ Specific details (name, time, equipment)",
            "✓ Progress updates (text at 5 min)",
            "✓ Expertise reassurance ('handle these all the time')",
            "✓ Empowerment ('You've got this')"
          ]
        }
      ]
    },
    {
      id: 'price-sensitive',
      scenario: 'Price-Sensitive Customer - Dry Humor',
      urgency: 4,
      tone: 'Hesitant',
      icon: Smile,
      color: 'blue',
      conversation: [
        {
          customer: "How much does a basic service call cost?",
          tone: "Neutral (3/10)",
          averyThinking: "Price shopping. Likely comparing. Need to build value before price reveal.",
          averyResponse: "Great question! For a standard service call, we're looking at $150, which includes the first hour of labor and diagnosis. What kind of issue are you dealing with?",
          deescalation: []
        },
        {
          customer: "Wow, $150? That seems like a lot. I saw another company offering $99.",
          tone: "Skeptical (5/10)",
          averyThinking: "Price objection. Don't get defensive. Use humor + value differentiation.",
          averyResponse: "I hear you - and between you and me, that $99 usually turns into $299 once they 'discover additional issues' after arriving. It's like the plumbing version of a printer that costs $40 but the ink costs $200. Our $150 is upfront, honest, and includes things that actually fix the problem. No surprises.",
          deescalation: [
            "✓ Dry humor (printer comparison)",
            "✓ Exposes competitor tactic (not defensive)",
            "✓ Emphasizes transparency ('no surprises')",
            "✓ Builds trust through candor"
          ]
        },
        {
          customer: "*laughs* Okay, that's fair. I hate hidden fees.",
          tone: "Warming up (3/10)",
          averyThinking: "Humor landed. Objection softening. Now reinforce value and close.",
          averyResponse: "Right? Same. Look, we've been doing this 15 years and our motto is 'no BS, just good work.' If it's going to cost more than $150, we tell you BEFORE we do the work, not after. Want me to book you a slot?",
          deescalation: [
            "✓ Relates to customer ('Right? Same.')",
            "✓ Social proof (15 years)",
            "✓ Clear value prop ('no BS')",
            "✓ Confirms pricing transparency",
            "✓ Soft close"
          ]
        }
      ]
    },
    {
      id: 'chatty-customer',
      scenario: 'Chatty Customer - Dry Humor + Efficiency',
      urgency: 2,
      tone: 'Friendly',
      icon: MessageCircle,
      color: 'green',
      conversation: [
        {
          customer: "Hi there! So I need to book an appointment, but first let me tell you about my week. You won't believe what happened with my neighbor's dog and my fence...",
          tone: "Friendly/Chatty (2/10)",
          averyThinking: "Low urgency, very chatty. Balance being personable with moving toward booking. Light humor to redirect.",
          averyResponse: "Ha! I'm already invested in this dog story. But real quick - let me get you on the calendar before our slots disappear, and then you can tell me about the fence saga. Sound good?",
          deescalation: [
            "✓ Acknowledges their style ('I'm invested')",
            "✓ Gentle redirect ('real quick')",
            "✓ Creates urgency (slots disappearing)",
            "✓ Promises to listen ('then you can tell me')",
            "✓ Gets buy-in"
          ]
        },
        {
          customer: "Oh good idea! Yes, let's book first. I need someone for next Tuesday afternoon.",
          tone: "Cooperative (2/10)",
          averyThinking: "Successfully redirected. Get booking done, then can be social if time allows.",
          averyResponse: "Perfect! I've got you set for Tuesday at 2 PM. Now, tell me - did the dog actually break through the fence or just bark a lot? I need to know how this ends.",
          deescalation: [
            "✓ Efficient booking confirmation",
            "✓ Follows through on promise (asks about dog)",
            "✓ Shows genuine interest",
            "✓ Balances business + personality"
          ]
        }
      ]
    },
    {
      id: 'impatient-vip',
      scenario: 'Impatient VIP - High Status Customer',
      urgency: 7,
      tone: 'Demanding',
      icon: Zap,
      color: 'purple',
      conversation: [
        {
          customer: "I need an appointment TODAY. I'm a regular customer and I don't have time to wait.",
          tone: "Demanding (7/10)",
          averyThinking: "High status awareness, time-sensitive, expects priority. Give it, but with boundaries.",
          averyResponse: "Absolutely - I see your account here, you've been with us for 3 years. Really appreciate that. I can get you in today at 4 PM or tomorrow morning at 9 AM. Which works better?",
          deescalation: [
            "✓ Immediate acknowledgment ('Absolutely')",
            "✓ Recognition of status (3 years)",
            "✓ Gratitude",
            "✓ Provides options (maintains control)",
            "✓ Respectful but not subservient"
          ]
        },
        {
          customer: "4 PM today. And I need your best person - not a junior tech.",
          tone: "Assertive (6/10)",
          averyThinking: "Clear expectations. Valid given history. Confirm quality, add light humor to humanize.",
          averyResponse: "You got it - I'm putting Marcus on this. He's been with us 12 years and honestly, he's better at this stuff than I am at booking appointments. You're all set for 4 PM today.",
          deescalation: [
            "✓ Confirms request",
            "✓ Provides specific name + credentials",
            "✓ Self-deprecating humor (keeps relationship balanced)",
            "✓ Final confirmation"
          ]
        }
      ]
    }
  ];

  const personalityControls = [
    {
      id: 'humor',
      label: 'Dry Humor',
      icon: Smile,
      value: humor,
      setValue: setHumor,
      description: 'How often Avery uses subtle, dry humor',
      examples: [
        'Level 1: Strictly professional, no jokes',
        'Level 3: Occasional light humor when appropriate',
        'Level 5: Frequent dry wit and clever analogies'
      ]
    },
    {
      id: 'empathy',
      label: 'Empathy',
      icon: Heart,
      value: empathy,
      setValue: setEmpathy,
      description: 'How much emotional validation Avery provides',
      examples: [
        'Level 1: Facts only, minimal emotion',
        'Level 3: Acknowledges feelings, shows understanding',
        'Level 5: Deep empathy, extensive validation'
      ]
    },
    {
      id: 'assertiveness',
      label: 'Assertiveness',
      icon: Shield,
      value: assertiveness,
      setValue: setAssertiveness,
      description: 'How firmly Avery guides conversations',
      examples: [
        'Level 1: Very gentle, follows customer lead',
        'Level 3: Balanced, guides when needed',
        'Level 5: Direct, takes control of conversation'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1433] to-[#0a0e27] text-gray-100">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0f1433]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Emotional Intelligence & Personality</h1>
              <p className="text-sm text-gray-400">Tone understanding, de-escalation, and dry humor</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-semibold">Advanced AI Feature</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Avery Reads the Room</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Most AI sounds robotic and can't handle tense situations. Avery understands tone, 
            de-escalates angry customers, and knows when to crack a dry joke. It's emotional intelligence, not just voice recognition.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassmorphismCard className="p-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tone Understanding</h3>
            <p className="text-sm text-gray-400 mb-4">
              Detects anger, anxiety, frustration, urgency - and adjusts responses accordingly
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Angry (1-10 scale)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Anxious/Panicked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Frustrated/Skeptical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Calm/Friendly</span>
              </div>
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">De-escalation</h3>
            <p className="text-sm text-gray-400 mb-4">
              Calms angry customers, validates emotions, and turns complaints into resolutions
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Validates feelings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Takes ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Offers solutions immediately</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Provides compensation when needed</span>
              </div>
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Smile className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Dry Humor</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subtle wit and clever analogies that humanize conversations without being unprofessional
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Self-deprecating jokes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Relatable analogies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Knows when NOT to joke</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Builds rapport naturally</span>
              </div>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Personality Controls */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Customize Avery's Personality</h3>
          <GlassmorphismCard className="p-8">
            <div className="space-y-8">
              {personalityControls.map((control) => (
                <div key={control.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <control.icon className="w-5 h-5 text-cyan-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{control.label}</h4>
                        <span className="text-sm text-cyan-400">Level {control.value}</span>
                      </div>
                      <p className="text-sm text-gray-400">{control.description}</p>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={control.value}
                    onChange={(e) => control.setValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {control.examples[Math.floor((control.value - 1) / 2)]}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Save Personality Settings
              </Button>
              <Button variant="outline">
                <Volume2 className="w-4 h-4 mr-2" />
                Test Voice
              </Button>
            </div>
          </GlassmorphismCard>
        </div>

        {/* Conversation Examples */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Real Conversation Examples</h3>
          <p className="text-gray-400 mb-6">
            See how Avery handles different emotional situations with intelligence and personality
          </p>

          {/* Example Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {conversationExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(example.id)}
                className={`text-left p-6 rounded-xl border transition-all ${
                  selectedExample === example.id
                    ? 'bg-cyan-500/10 border-cyan-500'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-10 h-10 bg-${example.color}-500/20 rounded-lg flex items-center justify-center mb-3`}>
                  <example.icon className={`w-5 h-5 text-${example.color}-500`} />
                </div>
                <h4 className="font-semibold mb-2">{example.scenario}</h4>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-orange-500" />
                    <span className="text-gray-400">Urgency: {example.urgency}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3 text-cyan-500" />
                    <span className="text-gray-400">{example.tone}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Conversation Display */}
          {selectedExample && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassmorphismCard className="p-8">
                {conversationExamples
                  .find((ex) => ex.id === selectedExample)
                  ?.conversation.map((exchange, index) => (
                    <div key={index} className="mb-8 last:mb-0">
                      {/* Customer Message */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs">
                            C
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">Customer</span>
                              <span className="text-xs text-orange-400">{exchange.tone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 ml-10">
                          <p className="text-sm">{exchange.customer}</p>
                        </div>
                      </div>

                      {/* Avery's Thinking */}
                      <div className="mb-4 ml-10">
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-semibold text-purple-400">
                              Avery's Analysis
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 italic">{exchange.averyThinking}</p>
                        </div>
                      </div>

                      {/* Avery's Response */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-xs">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="font-semibold">Avery AI</span>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 ml-10">
                          <p className="text-sm">{exchange.averyResponse}</p>
                        </div>
                      </div>

                      {/* De-escalation Tactics */}
                      {exchange.deescalation && exchange.deescalation.length > 0 && (
                        <div className="ml-10">
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-green-400" />
                              <span className="text-xs font-semibold text-green-400">
                                De-escalation Tactics Used
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {exchange.deescalation.map((tactic, i) => (
                                <li key={i} className="text-xs text-gray-400">
                                  {tactic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </GlassmorphismCard>
            </motion.div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Why This Matters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassmorphismCard className="p-6">
              <h4 className="font-semibold mb-3">Customer Satisfaction Impact</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Angry → Satisfied</span>
                  <span className="text-green-500 font-semibold">+73%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Repeat Customers</span>
                  <span className="text-green-500 font-semibold">+41%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">5-Star Reviews</span>
                  <span className="text-green-500 font-semibold">+56%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Escalations to Manager</span>
                  <span className="text-red-500 font-semibold">-89%</span>
                </div>
              </div>
            </GlassmorphismCard>

            <GlassmorphismCard className="p-6">
              <h4 className="font-semibold mb-3">Business Impact</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Complaint Resolution Time</span>
                  <span className="text-green-500 font-semibold">-67%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Customer Churn</span>
                  <span className="text-green-500 font-semibold">-34%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Conversion Rate (Humor)</span>
                  <span className="text-green-500 font-semibold">+22%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Your Stress Level</span>
                  <span className="text-red-500 font-semibold">-95%</span>
                </div>
              </div>
            </GlassmorphismCard>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <GlassmorphismCard className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
            <h3 className="text-2xl font-bold mb-2">Emotional Intelligence Included</h3>
            <p className="text-gray-400 mb-6">
              Available in Professional ($29.99) and Elite ($49.99) plans
            </p>
            <Button
              className="bg-cyan-500 hover:bg-cyan-600"
              onClick={() => (window.location.href = '#pricing')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Get This Feature
            </Button>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
}
