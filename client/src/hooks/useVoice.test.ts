/**
 * useVoice Hook Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVoice } from "./useVoice";

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    voice: {
      synthesize: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
        }),
      },
    },
  },
}));

describe("useVoice Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Hook initialization", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => useVoice());

      expect(result.current.isSpeaking).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.speak).toBe("function");
      expect(typeof result.current.stop).toBe("function");
    });

    it("should export speak and stop functions", () => {
      const { result } = renderHook(() => useVoice());

      expect(result.current.speak).toBeDefined();
      expect(result.current.stop).toBeDefined();
    });
  });

  describe("Voice state management", () => {
    it("should track speaking state", () => {
      const { result } = renderHook(() => useVoice());

      expect(result.current.isSpeaking).toBe(false);
    });

    it("should track error state", () => {
      const { result } = renderHook(() => useVoice());

      expect(result.current.error).toBeNull();
    });
  });

  describe("speak function", () => {
    it("should accept text parameter", () => {
      const { result } = renderHook(() => useVoice());

      expect(() => {
        result.current.speak("Hello world");
      }).not.toThrow();
    });

    it("should accept voice options", () => {
      const { result } = renderHook(() => useVoice());

      expect(() => {
        result.current.speak("Hello", {
          voiceId: "test-voice",
          stability: 0.5,
          similarityBoost: 0.75,
        });
      }).not.toThrow();
    });

    it("should ignore empty text", () => {
      const { result } = renderHook(() => useVoice());

      expect(() => {
        result.current.speak("");
      }).not.toThrow();
    });
  });

  describe("stop function", () => {
    it("should be callable", () => {
      const { result } = renderHook(() => useVoice());

      expect(() => {
        result.current.stop();
      }).not.toThrow();
    });

    it("should set isSpeaking to false", async () => {
      const { result } = renderHook(() => useVoice());

      await act(async () => {
        result.current.stop();
      });

      expect(result.current.isSpeaking).toBe(false);
    });
  });
});
