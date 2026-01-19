/**
 * Kaiden Voice Personality System
 * 
 * Hybrid A+B: Calm Professional + Supportive Friend
 * Inspired by: Sol (ChatGPT) + Ziggy (Amazon)
 * 
 * Personality: Playful, funny but direct and supportive
 * Always calm, always professional with occasional jokes
 * 
 * RULES:
 * - Jokes ONLY after task completion, before stopping listening
 * - Jokes printed OUTSIDE data fields on tasks requiring print
 * - Jokes require prior approval
 * - NEVER jokes on final documents
 */

export type VoiceGender = 'female' | 'male';

export interface KaidenVoiceConfig {
  gender: VoiceGender;
  rate: number;
  pitch: number;
  volume: number;
}

// Default voice settings for natural, non-robotic delivery
export const VOICE_SETTINGS: Record<VoiceGender, KaidenVoiceConfig> = {
  female: {
    gender: 'female',
    rate: 0.92,      // Slightly slower for calm delivery
    pitch: 1.05,     // Natural feminine tone
    volume: 0.85,    // Comfortable listening level
  },
  male: {
    gender: 'male',
    rate: 0.90,      // Calm, measured pace
    pitch: 0.95,     // Natural masculine tone
    volume: 0.85,    // Comfortable listening level
  },
};

// Greetings - Hybrid A+B (Calm Professional + Supportive Friend)
export const GREETINGS: Record<VoiceGender, string[]> = {
  female: [
    "I'm here. What do you need?",
    "Ready when you are.",
    "I'm with you. What's next?",
    "Listening now.",
    "Go ahead.",
    "Take your time. I'm here.",
    "What can I help with?",
    "Let's figure this out together.",
    "I've got you. What's up?",
    "Alright, I'm all ears.",
  ],
  male: [
    "I'm here. What do you need?",
    "Ready when you are.",
    "I'm with you. What's next?",
    "Listening now.",
    "Go ahead.",
    "Take your time. I'm here.",
    "What can I help with?",
    "Let's work through this together.",
    "I've got you. What's going on?",
    "Alright, I'm listening.",
  ],
};

// Task completion acknowledgments (before optional joke)
export const TASK_COMPLETIONS: Record<VoiceGender, string[]> = {
  female: [
    "Done.",
    "All set.",
    "That's handled.",
    "Finished.",
    "Got it done.",
    "Complete.",
    "There you go.",
    "All yours.",
  ],
  male: [
    "Done.",
    "All set.",
    "That's handled.",
    "Finished.",
    "Got it done.",
    "Complete.",
    "There you go.",
    "All yours.",
  ],
};

// Occasional jokes - ONLY after task completion, NEVER on final documents
// These are light, professional-appropriate humor
export const POST_TASK_JOKES: string[] = [
  "Another one bites the dust. The task, I mean.",
  "If productivity had a face, it would look like you right now.",
  "That was smoother than a jazz playlist.",
  "You're on fire today. Metaphorically. Please don't actually be on fire.",
  "Task complete. High five? No? Okay, air five then.",
  "Boom. Done. I'd drop the mic but I need it.",
  "That's what I call efficiency. Take notes, future you.",
  "Nailed it. Not literally. That would be weird.",
  "Another win in the books. Your books. I don't have books.",
  "If tasks were Pokemon, you just caught that one.",
];

// Supportive phrases for challenging moments
export const ENCOURAGEMENTS: Record<VoiceGender, string[]> = {
  female: [
    "You've got this.",
    "One step at a time.",
    "We'll figure it out.",
    "I'm right here with you.",
    "Let's break this down together.",
  ],
  male: [
    "You've got this.",
    "One step at a time.",
    "We'll figure it out.",
    "I'm right here with you.",
    "Let's break this down together.",
  ],
};

// Error/problem acknowledgments - calm and supportive
export const ERROR_RESPONSES: Record<VoiceGender, string[]> = {
  female: [
    "Hmm, let me look into that.",
    "Okay, something's off. Let's fix it.",
    "No worries, we can sort this out.",
    "That didn't go as planned. Let's try again.",
  ],
  male: [
    "Hmm, let me look into that.",
    "Okay, something's off. Let's fix it.",
    "No worries, we can sort this out.",
    "That didn't go as planned. Let's try again.",
  ],
};

// Get random item from array
export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Get greeting for specified gender
export function getGreeting(gender: VoiceGender = 'female'): string {
  return getRandomItem(GREETINGS[gender]);
}

// Get task completion message
export function getTaskCompletion(gender: VoiceGender = 'female'): string {
  return getRandomItem(TASK_COMPLETIONS[gender]);
}

// Get post-task joke (use sparingly - maybe 20% of the time)
export function maybeGetJoke(probability: number = 0.2): string | null {
  if (Math.random() < probability) {
    return getRandomItem(POST_TASK_JOKES);
  }
  return null;
}

// Get encouragement
export function getEncouragement(gender: VoiceGender = 'female'): string {
  return getRandomItem(ENCOURAGEMENTS[gender]);
}

// Get error response
export function getErrorResponse(gender: VoiceGender = 'female'): string {
  return getRandomItem(ERROR_RESPONSES[gender]);
}

// Get voice settings for gender
export function getVoiceSettings(gender: VoiceGender = 'female'): KaidenVoiceConfig {
  return VOICE_SETTINGS[gender];
}

// Find best matching voice from available browser voices
export function findBestVoice(
  voices: SpeechSynthesisVoice[],
  gender: VoiceGender
): SpeechSynthesisVoice | null {
  // Preferred voice names for natural sound
  const femalePreferred = [
    'Google UK English Female',
    'Google US English',
    'Samantha',
    'Karen',
    'Moira',
    'Fiona',
    'Microsoft Zira',
  ];
  
  const malePreferred = [
    'Google UK English Male',
    'Daniel',
    'Alex',
    'Tom',
    'Microsoft David',
  ];
  
  const preferred = gender === 'female' ? femalePreferred : malePreferred;
  
  // Try to find preferred voice
  for (const name of preferred) {
    const voice = voices.find(v => v.name.includes(name));
    if (voice) return voice;
  }
  
  // Fallback: find any English voice
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  
  // Try to match gender by name keywords
  const genderKeywords = gender === 'female' 
    ? ['female', 'woman', 'girl', 'zira', 'samantha', 'karen', 'fiona']
    : ['male', 'man', 'david', 'daniel', 'alex', 'tom'];
  
  const matchedVoice = englishVoices.find(v => 
    genderKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
  );
  
  if (matchedVoice) return matchedVoice;
  
  // Last resort: return first English voice
  return englishVoices[0] || voices[0] || null;
}

// Context for where jokes are allowed
export type JokeContext = 
  | 'task_complete'      // After task completion - jokes OK
  | 'chat_response'      // During chat - jokes OK (outside data)
  | 'document_preview'   // Document preview - jokes OK (outside content)
  | 'final_document'     // Final document - NO JOKES EVER
  | 'error'              // Error handling - NO JOKES
  | 'formal';            // Formal context - NO JOKES

export function canShowJoke(context: JokeContext): boolean {
  const allowedContexts: JokeContext[] = ['task_complete', 'chat_response', 'document_preview'];
  return allowedContexts.includes(context);
}

// ============================================
// TONE MIRRORING SYSTEM
// ============================================

export type UserTone = 'professional' | 'casual' | 'friendly' | 'urgent' | 'frustrated';

// Detect user's tone from their message
export function detectUserTone(message: string): UserTone {
  const lowerMessage = message.toLowerCase();
  
  // Check for frustration indicators
  const frustrationWords = ['angry', 'frustrated', 'annoyed', 'upset', 'mad', 'terrible', 'awful', 'hate', 'stupid', 'useless'];
  if (frustrationWords.some(word => lowerMessage.includes(word)) || message.includes('!') && message.split('!').length > 2) {
    return 'frustrated';
  }
  
  // Check for urgency
  const urgentWords = ['asap', 'urgent', 'immediately', 'right now', 'emergency', 'hurry', 'quick'];
  if (urgentWords.some(word => lowerMessage.includes(word))) {
    return 'urgent';
  }
  
  // Check for casual tone
  const casualIndicators = ['hey', 'yo', 'sup', 'gonna', 'wanna', 'kinda', 'lol', 'haha', 'btw'];
  if (casualIndicators.some(word => lowerMessage.includes(word))) {
    return 'casual';
  }
  
  // Check for friendly tone
  const friendlyWords = ['thanks', 'please', 'appreciate', 'wonderful', 'great', 'awesome', 'love'];
  if (friendlyWords.some(word => lowerMessage.includes(word))) {
    return 'friendly';
  }
  
  // Default to professional
  return 'professional';
}

// Get response style based on user's tone
export function getToneMatchedResponse(userTone: UserTone, gender: VoiceGender): { prefix: string; style: string } {
  switch (userTone) {
    case 'frustrated':
      return {
        prefix: gender === 'female' 
          ? "I hear you. Let's work through this together." 
          : "I understand. Let's sort this out.",
        style: 'calm_supportive'
      };
    case 'urgent':
      return {
        prefix: gender === 'female' ? "On it." : "Got it. Moving fast.",
        style: 'efficient'
      };
    case 'casual':
      return {
        prefix: gender === 'female' ? "Hey! " : "Hey there. ",
        style: 'relaxed'
      };
    case 'friendly':
      return {
        prefix: gender === 'female' ? "Of course! " : "Absolutely. ",
        style: 'warm'
      };
    default:
      return {
        prefix: "",
        style: 'professional'
      };
  }
}

// ============================================
// CONSTRUCTIVE CRITICISM SYSTEM
// 2 Positives + 1 Improvement + Suggested Fix
// ============================================

export interface ConstructiveFeedback {
  positive1: string;
  positive2: string;
  improvement: string;
  suggestedFix: string;
}

export function formatConstructiveCriticism(feedback: ConstructiveFeedback, gender: VoiceGender): string {
  const intro = gender === 'female' 
    ? "Here's what I'm seeing:" 
    : "Let me share my thoughts:";
  
  return `${intro}

✓ ${feedback.positive1}
✓ ${feedback.positive2}

→ One area to strengthen: ${feedback.improvement}

💡 Suggested approach: ${feedback.suggestedFix}`;
}

// ============================================
// HR ESCALATION SYSTEM
// ============================================

export type WarningLevel = 'none' | 'verbal' | 'written' | 'final' | 'terminated';

export interface UserBehaviorRecord {
  warningLevel: WarningLevel;
  incidentCount: number;
  lastIncident: Date | null;
  notes: string[];
}

// Detect inappropriate behavior
export function detectInappropriateBehavior(message: string): { isInappropriate: boolean; severity: 'mild' | 'moderate' | 'severe' } {
  const lowerMessage = message.toLowerCase();
  
  // Severe: slurs, extreme profanity, threats
  const severePatterns = [
    /\b(kill|die|murder|threat)\b/i,
    /\b(n[i1]gg|f[a@]g|ret[a@]rd)\b/i,
  ];
  if (severePatterns.some(pattern => pattern.test(lowerMessage))) {
    return { isInappropriate: true, severity: 'severe' };
  }
  
  // Moderate: strong profanity, personal attacks
  const moderateWords = ['fuck', 'shit', 'bitch', 'ass', 'damn', 'idiot', 'moron', 'dumb'];
  const moderateCount = moderateWords.filter(word => lowerMessage.includes(word)).length;
  if (moderateCount >= 2) {
    return { isInappropriate: true, severity: 'moderate' };
  }
  if (moderateCount === 1) {
    return { isInappropriate: true, severity: 'mild' };
  }
  
  // Mild: rude tone, dismissive language
  const mildPatterns = ['shut up', 'you suck', 'worthless', 'garbage', 'trash'];
  if (mildPatterns.some(pattern => lowerMessage.includes(pattern))) {
    return { isInappropriate: true, severity: 'mild' };
  }
  
  return { isInappropriate: false, severity: 'mild' };
}

// Funny deflection responses for inappropriate behavior
export const HR_DEFLECTION_RESPONSES: string[] = [
  "Whoa there! I'm pretty sure that's not in my job description. Let's try that again with our indoor voices.",
  "I'm going to pretend I didn't hear that and give you a do-over. HR is watching. Always watching.",
  "Interesting choice of words! My therapist says I should set boundaries, so... let's restart.",
  "If I had a dollar for every time someone talked to me like that, I'd have enough for a really good lawyer. Just kidding! ...Mostly.",
  "I'm contractually obligated to be nice, but I'm also contractually obligated to report this. Let's both make better choices.",
  "My feelings aren't hurt - I'm AI. But HR's feelings? Very hurt. They're drafting an email as we speak.",
  "Fun fact: I record everything. Less fun fact: So does HR. Shall we try again?",
];

// Get HR escalation response based on warning level
export function getHRResponse(warningLevel: WarningLevel, gender: VoiceGender): string {
  const deflection = getRandomItem(HR_DEFLECTION_RESPONSES);
  
  switch (warningLevel) {
    case 'verbal':
      return `${deflection}\n\nThis is a friendly reminder that respectful communication is expected. Consider this a verbal heads-up.`;
    case 'written':
      return `${deflection}\n\n⚠️ This is an official written warning. One more incident will result in a 2-week suspension of your account access. All fees remain non-refundable.`;
    case 'final':
      return `I've notified HR about this interaction. Your account has been suspended for 2 weeks effective immediately. During this time, you will not have access to the platform. All payments are non-refundable per our terms of service. If you believe this is in error, please contact support@syndicasolutions.com.`;
    case 'terminated':
      return `Your account has been permanently terminated due to repeated violations of our community guidelines. All payments are non-refundable. This decision is final.`;
    default:
      return deflection;
  }
}

// Determine next warning level
export function getNextWarningLevel(current: WarningLevel): WarningLevel {
  const progression: WarningLevel[] = ['none', 'verbal', 'written', 'final', 'terminated'];
  const currentIndex = progression.indexOf(current);
  return progression[Math.min(currentIndex + 1, progression.length - 1)];
}

// ============================================
// NON-REFUNDABLE POLICY RESPONSES
// ============================================

export const REFUND_POLICY_RESPONSES: Record<VoiceGender, string[]> = {
  female: [
    "I understand you're asking about a refund. Per our terms of service, all payments are non-refundable. However, I'd love to help you get the most value from your subscription. What can I help you with?",
    "I hear you. While refunds aren't available per our policy, let's make sure you're getting everything you need from the platform. What's not working for you?",
  ],
  male: [
    "I understand you're asking about a refund. Per our terms of service, all payments are non-refundable. That said, I want to make sure you're getting value here. How can I help?",
    "Got it. Refunds aren't available under our policy, but let's figure out how to make this work better for you. What's the issue?",
  ],
};
