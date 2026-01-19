import { describe, it, expect } from "vitest";

describe("Printful API Integration", () => {
  it("should validate PRINTFUL_API_KEY by fetching store info", async () => {
    const apiKey = process.env.PRINTFUL_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");

    // Test API connection by fetching store info
    const response = await fetch("https://api.printful.com/store", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Printful API Error:", data);
      throw new Error(`Printful API returned ${response.status}: ${JSON.stringify(data)}`);
    }
    
    expect(response.ok).toBe(true);
    expect(data.code).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.id).toBeDefined();
    
    console.log("✅ Printful API credentials validated successfully");
    console.log(`Store ID: ${data.result.id}`);
    console.log(`Store Name: ${data.result.name || "N/A"}`);
  });
});
