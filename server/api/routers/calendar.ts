import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../../_core/trpc";

// Horoscope data by zodiac sign
const horoscopes = {
  aries: "Today brings exciting opportunities for leadership. Trust your instincts and take bold action.",
  taurus: "Financial stability is within reach. Focus on long-term investments and practical decisions.",
  gemini: "Communication flows easily today. Share your ideas and connect with others.",
  cancer: "Emotional intuition guides you. Trust your feelings and nurture important relationships.",
  leo: "Your creativity shines bright. Express yourself confidently and inspire others.",
  virgo: "Attention to detail pays off. Organize your priorities and tackle tasks methodically.",
  libra: "Balance and harmony are key. Seek compromise and maintain peaceful relationships.",
  scorpio: "Transformation is in the air. Embrace change and let go of what no longer serves you.",
  sagittarius: "Adventure calls. Expand your horizons through learning and new experiences.",
  capricorn: "Discipline and determination lead to success. Stay focused on your goals.",
  aquarius: "Innovation and originality set you apart. Think outside the box.",
  pisces: "Intuition and compassion guide your path. Trust your dreams and help others.",
};

// Tarot card meanings
const tarotCards = [
  { name: "The Fool", meaning: "New beginnings, spontaneity, and taking a leap of faith" },
  { name: "The Magician", meaning: "Manifestation, resourcefulness, and power" },
  { name: "The High Priestess", meaning: "Intuition, sacred knowledge, and the subconscious" },
  { name: "The Empress", meaning: "Femininity, beauty, nature, and abundance" },
  { name: "The Emperor", meaning: "Authority, structure, control, and fatherhood" },
  { name: "The Hierophant", meaning: "Spiritual wisdom, tradition, and conformity" },
  { name: "The Lovers", meaning: "Love, harmony, relationships, and choices" },
  { name: "The Chariot", meaning: "Control, willpower, success, and determination" },
  { name: "Strength", meaning: "Courage, patience, control, and compassion" },
  { name: "The Hermit", meaning: "Soul searching, introspection, and inner guidance" },
  { name: "Wheel of Fortune", meaning: "Good luck, karma, life cycles, and destiny" },
  { name: "Justice", meaning: "Justice, fairness, truth, and law" },
  { name: "The Hanged Man", meaning: "Pause, surrender, letting go, and new perspectives" },
  { name: "Death", meaning: "Endings, change, transformation, and transition" },
  { name: "Temperance", meaning: "Balance, moderation, patience, and purpose" },
  { name: "The Devil", meaning: "Shadow self, attachment, addiction, and restriction" },
  { name: "The Tower", meaning: "Sudden change, upheaval, chaos, and revelation" },
  { name: "The Star", meaning: "Hope, faith, purpose, renewal, and spirituality" },
  { name: "The Moon", meaning: "Illusion, fear, anxiety, subconscious, and intuition" },
  { name: "The Sun", meaning: "Positivity, fun, warmth, success, and vitality" },
  { name: "Judgement", meaning: "Judgement, rebirth, inner calling, and absolution" },
  { name: "The World", meaning: "Completion, accomplishment, travel, and fulfillment" },
];

// Daily affirmations
const affirmations = [
  "I am capable of achieving my goals and dreams.",
  "I choose to focus on what I can control and let go of what I cannot.",
  "I am worthy of success, happiness, and abundance.",
  "Every challenge I face is an opportunity to grow stronger.",
  "I trust in my abilities and make decisions with confidence.",
  "I attract positive energy and opportunities into my life.",
  "I am grateful for all the blessings in my life, big and small.",
  "I release all negative thoughts and embrace positivity.",
  "I am the architect of my life; I build its foundation and choose its contents.",
  "I am becoming the best version of myself every single day.",
  "My potential is limitless, and I choose to act on it today.",
  "I deserve to be happy and successful.",
  "I am in charge of how I feel, and I choose happiness.",
  "I am confident in my ability to solve problems.",
  "I radiate love, peace, and positive energy.",
];

// Jokes
const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "What do you call a fake noodle? An impasta!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What did the ocean say to the beach? Nothing, it just waved!",
  "Why did the bicycle fall over? Because it was two-tired!",
  "What do you call a can opener that doesn't work? A can't opener!",
  "Why did the math book look so sad? Because it had too many problems!",
  "What do you call a sleeping bull? A bulldozer!",
];

export const calendarRouter = router({
  // Get daily horoscope
  getHoroscope: publicProcedure
    .input(
      z.object({
        sign: z.enum([
          "aries",
          "taurus",
          "gemini",
          "cancer",
          "leo",
          "virgo",
          "libra",
          "scorpio",
          "sagittarius",
          "capricorn",
          "aquarius",
          "pisces",
        ]),
      })
    )
    .query(async ({ input }) => {
      const date = new Date().toLocaleDateString();
      return {
        sign: input.sign,
        date,
        horoscope: horoscopes[input.sign],
      };
    }),

  // Get lucky numbers
  getLuckyNumbers: publicProcedure.query(async () => {
    const numbers = [];
    for (let i = 0; i < 6; i++) {
      numbers.push(Math.floor(Math.random() * 49) + 1);
    }
    return {
      date: new Date().toLocaleDateString(),
      numbers: numbers.sort((a, b) => a - b),
      powerball: Math.floor(Math.random() * 26) + 1,
    };
  }),

  // Get daily affirmation
  getAffirmation: publicProcedure.query(async () => {
    const index = Math.floor(Math.random() * affirmations.length);
    return {
      date: new Date().toLocaleDateString(),
      affirmation: affirmations[index],
    };
  }),

  // Get joke of the day
  getJoke: publicProcedure.query(async () => {
    const index = Math.floor(Math.random() * jokes.length);
    return {
      date: new Date().toLocaleDateString(),
      joke: jokes[index],
    };
  }),

  // Draw tarot card(s)
  drawTarot: publicProcedure
    .input(
      z.object({
        count: z.number().min(1).max(3).default(1),
      })
    )
    .query(async ({ input }) => {
      const drawn = [];
      const usedIndices = new Set();

      while (drawn.length < input.count) {
        const index = Math.floor(Math.random() * tarotCards.length);
        if (!usedIndices.has(index)) {
          usedIndices.add(index);
          drawn.push(tarotCards[index]);
        }
      }

      let spread = "Single Card";
      if (input.count === 3) {
        spread = "Three Card Spread (Past, Present, Future)";
      }

      return {
        date: new Date().toLocaleDateString(),
        spread,
        cards: drawn,
      };
    }),

  // Get daily digest (all in one)
  getDailyDigest: protectedProcedure
    .input(
      z.object({
        zodiacSign: z
          .enum([
            "aries",
            "taurus",
            "gemini",
            "cancer",
            "leo",
            "virgo",
            "libra",
            "scorpio",
            "sagittarius",
            "capricorn",
            "aquarius",
            "pisces",
          ])
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const date = new Date().toLocaleDateString();

      // Lucky numbers
      const numbers = [];
      for (let i = 0; i < 6; i++) {
        numbers.push(Math.floor(Math.random() * 49) + 1);
      }

      // Random affirmation
      const affirmationIndex = Math.floor(Math.random() * affirmations.length);

      // Random joke
      const jokeIndex = Math.floor(Math.random() * jokes.length);

      // Random tarot card
      const tarotIndex = Math.floor(Math.random() * tarotCards.length);

      return {
        date,
        horoscope: input.zodiacSign ? horoscopes[input.zodiacSign] : null,
        luckyNumbers: numbers.sort((a, b) => a - b),
        powerball: Math.floor(Math.random() * 26) + 1,
        affirmation: affirmations[affirmationIndex],
        joke: jokes[jokeIndex],
        tarotCard: tarotCards[tarotIndex],
      };
    }),
});
