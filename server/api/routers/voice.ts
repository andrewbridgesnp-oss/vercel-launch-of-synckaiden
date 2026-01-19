/**
 * Voice Router - tRPC procedures for voice synthesis
 */

import { router, publicProcedure } from "../../_core/trpc";
import { z } from "zod";
import { generateSpeech, getAvailableVoices } from "../../_core/elevenLabsVoice";

export const voiceRouter = router({
  /**
   * Synthesize speech from text
   */
  synthesize: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        voiceId: z.string().optional(),
        stability: z.number().min(0).max(1).optional(),
        similarityBoost: z.number().min(0).max(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const audioBuffer = await generateSpeech(input.text, {
          voiceId: input.voiceId,
          stability: input.stability,
          similarityBoost: input.similarityBoost,
        });

        // Convert buffer to base64 for transmission
        const base64Audio = audioBuffer.toString("base64");

        return {
          success: true,
          audio: base64Audio,
          mimeType: "audio/mpeg",
        };
      } catch (error) {
        console.error("Voice synthesis error:", error);
        return {
          success: false,
          error: "Failed to synthesize speech",
        };
      }
    }),

  /**
   * Get available voices
   */
  getVoices: publicProcedure.query(async () => {
    try {
      const voices = await getAvailableVoices();
      return {
        success: true,
        voices,
      };
    } catch (error) {
      console.error("Failed to fetch voices:", error);
      return {
        success: false,
        voices: [],
        error: "Failed to fetch voices",
      };
    }
  }),
});
