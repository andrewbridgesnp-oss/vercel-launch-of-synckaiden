/**
 * Products Configuration Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { WEBSITE_PRODUCTS, SUBSCRIPTION_PRODUCTS, PLATFORM_FEE_PERCENTAGE } from "../../_core/products";

describe("Products Configuration", () => {
  beforeEach(() => {
    // Setup
  });

  describe("Website Products", () => {
    it("should have website products defined", () => {
      expect(WEBSITE_PRODUCTS).toBeDefined();
      expect(Array.isArray(WEBSITE_PRODUCTS)).toBe(true);
    });

    it("should have at least 3 website products", () => {
      expect(WEBSITE_PRODUCTS.length).toBeGreaterThanOrEqual(3);
    });

    it("should have valid product structure", () => {
      WEBSITE_PRODUCTS.forEach((product) => {
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.description).toBeDefined();
        expect(product.priceInCents).toBeGreaterThan(0);
        expect(product.currency).toBe("usd");
      });
    });
  });

  describe("Subscription Products", () => {
    it("should have subscription products defined", () => {
      expect(SUBSCRIPTION_PRODUCTS).toBeDefined();
      expect(Array.isArray(SUBSCRIPTION_PRODUCTS)).toBe(true);
    });

    it("should have at least 3 subscription products", () => {
      expect(SUBSCRIPTION_PRODUCTS.length).toBeGreaterThanOrEqual(3);
    });

    it("should have valid product structure", () => {
      SUBSCRIPTION_PRODUCTS.forEach((product) => {
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.description).toBeDefined();
        expect(product.priceInCents).toBeGreaterThan(0);
        expect(product.currency).toBe("usd");
      });
    });
  });

  describe("Platform Fee", () => {
    it("should have platform fee defined", () => {
      expect(PLATFORM_FEE_PERCENTAGE).toBeDefined();
    });

    it("should have reasonable platform fee percentage", () => {
      expect(PLATFORM_FEE_PERCENTAGE).toBeGreaterThan(0);
      expect(PLATFORM_FEE_PERCENTAGE).toBeLessThan(100);
    });
  });
});
