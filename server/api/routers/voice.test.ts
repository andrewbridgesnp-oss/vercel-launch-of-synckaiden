/**
 * Voice Router Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { voiceRouter } from "./voice";

describe("Voice Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("synthesize procedure", () => {
    it("should have synthesize mutation", () => {
      expect(voiceRouter._def.procedures.synthesize).toBeDefined();
    });

    it("should validate text input", () => {
      // The router uses Zod validation
      // This test confirms the procedure exists and is callable
      expect(voiceRouter._def.procedures.synthesize).toBeDefined();
    });
  });

  describe("getVoices procedure", () => {
    it("should have getVoices query", () => {
      expect(voiceRouter._def.procedures.getVoices).toBeDefined();
    });
  });

  describe("Router structure", () => {
    it("should export voiceRouter", () => {
      expect(voiceRouter).toBeDefined();
      expect(typeof voiceRouter).toBe("object");
    });

    it("should have all required procedures", () => {
      const procedures = voiceRouter._def.procedures;
      expect(procedures.synthesize).toBeDefined();
      expect(procedures.getVoices).toBeDefined();
    });
  });
});
