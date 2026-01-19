import { router, protectedProcedure, publicProcedure } from "../../_core/trpc";
import { z } from "zod";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || "";
const PRINTFUL_BASE_URL = "https://api.printful.com";

/**
 * Printful Integration Router
 * Handles automatic dropshipping orders and inventory sync
 * 
 * Features:
 * - Automatic order fulfillment via Printful
 * - Real-time inventory sync
 * - Order status tracking
 * - Product catalog management
 */

// Printful API Client
const printfulClient = {
  async request(method: string, endpoint: string, body?: any) {
    const headers = {
      "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${PRINTFUL_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    return response.json();
  },

  async getProducts() {
    return this.request("GET", "/catalog/products");
  },

  async getProduct(id: string) {
    return this.request("GET", `/catalog/products/${id}`);
  },

  async createOrder(orderData: any) {
    return this.request("POST", "/orders", orderData);
  },

  async getOrder(id: string) {
    return this.request("GET", `/orders/${id}`);
  },

  async updateOrder(id: string, data: any) {
    return this.request("PATCH", `/orders/${id}`, data);
  },

  async getOrderStatus(id: string) {
    return this.request("GET", `/orders/${id}/status`);
  },
};

export const printfulRouter = router({
  /**
   * Create a dropship order in Printful
   * Automatically fulfills orders without manual intervention
   */
  createDropshipOrder: protectedProcedure
    .input(z.object({
      items: z.array(z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().min(1),
      })),
      recipient: z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address1: z.string(),
        address2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        country: z.string(),
      }),
      externalId: z.string(), // Reference to internal order ID
    }))
    .mutation(async ({ input }) => {
      try {
        const orderData = {
          external_id: input.externalId,
          shipping: "STANDARD",
          items: input.items.map(item => ({
            external_id: `${input.externalId}-${item.productId}`,
            variant_id: parseInt(item.variantId),
            quantity: item.quantity,
          })),
          recipient: {
            name: input.recipient.name,
            email: input.recipient.email,
            phone: input.recipient.phone,
            address1: input.recipient.address1,
            address2: input.recipient.address2 || "",
            city: input.recipient.city,
            state_code: input.recipient.state,
            zip: input.recipient.zip,
            country_code: input.recipient.country,
          },
        };

        const result = await printfulClient.createOrder(orderData);
        return {
          success: true,
          printfulOrderId: result.data.id,
          status: result.data.status,
          externalId: input.externalId,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create Printful order",
        };
      }
    }),

  /**
   * Get order status from Printful
   */
  getOrderStatus: publicProcedure
    .input(z.object({
      printfulOrderId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const status = await printfulClient.getOrderStatus(input.printfulOrderId);
        return {
          success: true,
          status: status.data,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to get order status",
        };
      }
    }),

  /**
   * Sync inventory from Printful
   * Gets current stock levels for all products
   */
  syncInventory: protectedProcedure
    .query(async () => {
      try {
        const products = await printfulClient.getProducts();
        return {
          success: true,
          products: products.data,
          lastSync: new Date().toISOString(),
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to sync inventory",
        };
      }
    }),

  /**
   * Get product details from Printful catalog
   */
  getProduct: publicProcedure
    .input(z.object({
      productId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const product = await printfulClient.getProduct(input.productId);
        return {
          success: true,
          product: product.data,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to get product",
        };
      }
    }),

  /**
   * List all available products from Printful catalog
   */
  listProducts: publicProcedure
    .query(async () => {
      try {
        const products = await printfulClient.getProducts();
        return {
          success: true,
          products: products.data,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to list products",
        };
      }
    }),

  /**
   * Webhook handler for Printful order updates
   * Called by Printful when order status changes
   */
  handleWebhook: publicProcedure
    .input(z.object({
      type: z.string(),
      data: z.any(),
    }))
    .mutation(async ({ input }) => {
      // Handle different webhook types
      switch (input.type) {
        case "order_created":
          // Order successfully created in Printful
          console.log("Order created in Printful:", input.data);
          break;
        case "order_updated":
          // Order status updated
          console.log("Order updated:", input.data);
          break;
        case "order_failed":
          // Order failed to create
          console.log("Order failed:", input.data);
          break;
        case "shipment_created":
          // Order shipped
          console.log("Shipment created:", input.data);
          break;
        default:
          console.log("Unknown webhook type:", input.type);
      }

      return { success: true };
    }),
});
