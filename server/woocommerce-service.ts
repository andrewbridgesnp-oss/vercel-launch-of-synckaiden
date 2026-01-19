import axios from "axios";
import { getDb } from "./db";
import { products, type InsertProduct } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export interface WooCommerceConfig {
  storeUrl: string; // e.g., "https://mystore.com"
  consumerKey: string;
  consumerSecret: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: string;
  stock_quantity: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: Array<{
    id: number;
    src: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
  }>;
}

/**
 * Create WooCommerce API client
 */
function createWooCommerceClient(config: WooCommerceConfig) {
  const baseURL = `${config.storeUrl}/wp-json/wc/v3`;

  return axios.create({
    baseURL,
    auth: {
      username: config.consumerKey,
      password: config.consumerSecret,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Fetch all products from WooCommerce
 */
export async function fetchWooCommerceProducts(config: WooCommerceConfig): Promise<WooCommerceProduct[]> {
  try {
    const client = createWooCommerceClient(config);
    const response = await client.get("/products", {
      params: {
        per_page: 100, // Max per page
        page: 1,
      },
    });

    return response.data || [];
  } catch (error: any) {
    console.error("[WooCommerce] Failed to fetch products:", error.response?.data || error.message);
    throw new Error(`WooCommerce API error: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Sync WooCommerce products to local database
 */
export async function syncWooCommerceProducts(userId: number, config: WooCommerceConfig): Promise<{
  synced: number;
  errors: number;
}> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const wooProducts = await fetchWooCommerceProducts(config);
    let synced = 0;
    let errors = 0;

    for (const wooProduct of wooProducts) {
      try {
        const imageUrl = wooProduct.images[0]?.src || null;
        const priceInCents = Math.round(parseFloat(wooProduct.price) * 100);

        // Check if product already exists
        const existing = await db
          .select()
          .from(products)
          .where(eq(products.woocommerceId, String(wooProduct.id)))
          .limit(1);

        const productData: Partial<InsertProduct> = {
          userId,
          name: wooProduct.name,
          description: wooProduct.description?.replace(/<[^>]*>/g, "") || null, // Strip HTML
          sku: wooProduct.sku || null,
          price: priceInCents,
          stock: wooProduct.stock_quantity || 0,
          imageUrl,
          woocommerceId: String(wooProduct.id),
          status: wooProduct.stock_status === "instock" ? "active" : "out_of_stock",
          metadata: {
            stockStatus: wooProduct.stock_status,
            categories: wooProduct.categories.map((c) => c.name),
          },
        };

        if (existing.length > 0) {
          // Update existing product
          await db
            .update(products)
            .set({
              ...productData,
              updatedAt: new Date(),
            })
            .where(eq(products.id, existing[0].id));
        } else {
          // Insert new product
          await db.insert(products).values(productData as InsertProduct);
        }

        synced++;
      } catch (error) {
        console.error(`[WooCommerce] Failed to sync product ${wooProduct.id}:`, error);
        errors++;
      }
    }

    console.log(`[WooCommerce] Sync complete: ${synced} products synced, ${errors} errors`);
    return { synced, errors };
  } catch (error) {
    console.error("[WooCommerce] Sync failed:", error);
    throw error;
  }
}

/**
 * Update product inventory in WooCommerce
 */
export async function updateWooCommerceInventory(
  config: WooCommerceConfig,
  productId: number,
  quantity: number
): Promise<boolean> {
  try {
    const client = createWooCommerceClient(config);
    await client.put(`/products/${productId}`, {
      stock_quantity: quantity,
      stock_status: quantity > 0 ? "instock" : "outofstock",
    });

    console.log(`[WooCommerce] Updated inventory for product ${productId} to ${quantity}`);
    return true;
  } catch (error: any) {
    console.error("[WooCommerce] Failed to update inventory:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Create order in WooCommerce (for dropshipping)
 */
export async function createWooCommerceOrder(
  config: WooCommerceConfig,
  orderData: {
    lineItems: Array<{
      productId: number;
      quantity: number;
    }>;
    customer: {
      email: string;
      firstName?: string;
      lastName?: string;
    };
    billing?: {
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
    shipping?: {
      address_1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  }
): Promise<any> {
  try {
    const client = createWooCommerceClient(config);
    const response = await client.post("/orders", {
      line_items: orderData.lineItems.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      billing: {
        email: orderData.customer.email,
        first_name: orderData.customer.firstName || "",
        last_name: orderData.customer.lastName || "",
        ...orderData.billing,
      },
      shipping: orderData.shipping,
      status: "pending",
    });

    console.log(`[WooCommerce] Created order ${response.data.id}`);
    return response.data;
  } catch (error: any) {
    console.error("[WooCommerce] Failed to create order:", error.response?.data || error.message);
    throw new Error(`WooCommerce order creation failed: ${error.response?.data?.message || error.message}`);
  }
}
