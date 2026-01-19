import axios from "axios";
import { getDb } from "./db";
import { products, type InsertProduct } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export interface ShopifyConfig {
  shopDomain: string; // e.g., "mystore.myshopify.com"
  accessToken: string;
  apiVersion?: string;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    sku: string;
    inventory_quantity: number;
    image_id?: number;
  }>;
  images: Array<{
    id: number;
    src: string;
  }>;
}

/**
 * Create Shopify API client
 */
function createShopifyClient(config: ShopifyConfig) {
  const apiVersion = config.apiVersion || "2024-01";
  const baseURL = `https://${config.shopDomain}/admin/api/${apiVersion}`;

  return axios.create({
    baseURL,
    headers: {
      "X-Shopify-Access-Token": config.accessToken,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Fetch all products from Shopify
 */
export async function fetchShopifyProducts(config: ShopifyConfig): Promise<ShopifyProduct[]> {
  try {
    const client = createShopifyClient(config);
    const response = await client.get("/products.json", {
      params: {
        limit: 250, // Max limit per request
      },
    });

    return response.data.products || [];
  } catch (error: any) {
    console.error("[Shopify] Failed to fetch products:", error.response?.data || error.message);
    throw new Error(`Shopify API error: ${error.response?.data?.errors || error.message}`);
  }
}

/**
 * Sync Shopify products to local database
 */
export async function syncShopifyProducts(userId: number, config: ShopifyConfig): Promise<{
  synced: number;
  errors: number;
}> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const shopifyProducts = await fetchShopifyProducts(config);
    let synced = 0;
    let errors = 0;

    for (const shopifyProduct of shopifyProducts) {
      try {
        // Use first variant for simplicity (can be extended to handle multiple variants)
        const variant = shopifyProduct.variants[0];
        if (!variant) continue;

        const imageUrl = shopifyProduct.images[0]?.src || null;
        const priceInCents = Math.round(parseFloat(variant.price) * 100);

        // Check if product already exists
        const existing = await db
          .select()
          .from(products)
          .where(eq(products.shopifyId, String(shopifyProduct.id)))
          .limit(1);

        const productData: Partial<InsertProduct> = {
          userId,
          name: shopifyProduct.title,
          description: shopifyProduct.body_html?.replace(/<[^>]*>/g, "") || null, // Strip HTML
          sku: variant.sku || null,
          price: priceInCents,
          stock: variant.inventory_quantity,
          imageUrl,
          shopifyId: String(shopifyProduct.id),
          status: variant.inventory_quantity > 0 ? "active" : "out_of_stock",
          metadata: {
            vendor: shopifyProduct.vendor,
            productType: shopifyProduct.product_type,
            variantId: variant.id,
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
        console.error(`[Shopify] Failed to sync product ${shopifyProduct.id}:`, error);
        errors++;
      }
    }

    console.log(`[Shopify] Sync complete: ${synced} products synced, ${errors} errors`);
    return { synced, errors };
  } catch (error) {
    console.error("[Shopify] Sync failed:", error);
    throw error;
  }
}

/**
 * Update product inventory in Shopify
 */
export async function updateShopifyInventory(
  config: ShopifyConfig,
  variantId: number,
  quantity: number
): Promise<boolean> {
  try {
    const client = createShopifyClient(config);
    await client.put(`/variants/${variantId}.json`, {
      variant: {
        id: variantId,
        inventory_quantity: quantity,
      },
    });

    console.log(`[Shopify] Updated inventory for variant ${variantId} to ${quantity}`);
    return true;
  } catch (error: any) {
    console.error("[Shopify] Failed to update inventory:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Create order in Shopify (for dropshipping)
 */
export async function createShopifyOrder(
  config: ShopifyConfig,
  orderData: {
    lineItems: Array<{
      variantId: number;
      quantity: number;
    }>;
    customer: {
      email: string;
      firstName?: string;
      lastName?: string;
    };
    shippingAddress?: {
      address1: string;
      city: string;
      province: string;
      country: string;
      zip: string;
    };
  }
): Promise<any> {
  try {
    const client = createShopifyClient(config);
    const response = await client.post("/orders.json", {
      order: {
        line_items: orderData.lineItems.map((item) => ({
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
        customer: orderData.customer,
        shipping_address: orderData.shippingAddress,
        financial_status: "pending",
      },
    });

    console.log(`[Shopify] Created order ${response.data.order.id}`);
    return response.data.order;
  } catch (error: any) {
    console.error("[Shopify] Failed to create order:", error.response?.data || error.message);
    throw new Error(`Shopify order creation failed: ${error.response?.data?.errors || error.message}`);
  }
}
