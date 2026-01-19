import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc, and, sql } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../../_core/trpc";
import { getDb } from "../../db";
import { marketplaceProducts, productPurchases } from "../../../drizzle/schema";
import { storagePut } from "../../storage";

// Helper to generate random license key
function generateLicenseKey(): string {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    segments.push(Math.random().toString(36).substring(2, 8).toUpperCase());
  }
  return segments.join("-");
}

export const marketplaceRouter = router({
  // Get all products (public)
  list: publicProcedure
    .input(
      z.object({
        category: z.enum(["ebook", "crypto_stack", "youtube_automation", "template", "course", "all"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const conditions = input.category && input.category !== "all"
        ? [eq(marketplaceProducts.category, input.category)]
        : [];

      const products = await db
        .select()
        .from(marketplaceProducts)
        .where(and(...conditions))
        .orderBy(desc(marketplaceProducts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(marketplaceProducts)
        .where(and(...conditions));

      return {
        products,
        total: Number(total[0]?.count || 0),
      };
    }),

  // Get single product (public)
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const product = await db
        .select()
        .from(marketplaceProducts)
        .where(eq(marketplaceProducts.id, input.id))
        .limit(1);

      if (!product[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      return product[0];
    }),

  // Create product with file upload
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        description: z.string().min(1).max(2000),
        category: z.enum(["ebook", "crypto_stack", "youtube_automation", "template", "course"]),
        price: z.number().min(0),
        fileData: z.string(), // Base64 encoded file data
        fileName: z.string(),
        fileType: z.string(),
        coverImage: z.string().optional(), // Base64 encoded cover image
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      try {
        // Upload file to S3
        const fileBuffer = Buffer.from(input.fileData, "base64");
        const fileKey = `marketplace/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        const { url: fileUrl } = await storagePut(fileKey, fileBuffer, input.fileType);

        // Upload cover image if provided
        let coverImageUrl: string | null = null;
        if (input.coverImage) {
          const coverBuffer = Buffer.from(input.coverImage, "base64");
          const coverKey = `marketplace/${ctx.user.id}/covers/${Date.now()}-cover.jpg`;
          const { url } = await storagePut(coverKey, coverBuffer, "image/jpeg");
          coverImageUrl = url;
        }

        // Create product in database
        await db.insert(marketplaceProducts).values({
          name: input.name,
          description: input.description,
          category: input.category,
          price: input.price,
          fileUrl,
        coverImage: coverImageUrl,
        workspaceId: 1, // TODO: Use actual workspace ID from context
        });

        return { success: true, message: "Product created successfully" };
      } catch (error) {
        console.error("Product creation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create product",
        });
      }
    }),

  // Update product
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().min(1).max(2000).optional(),
        price: z.number().min(0).optional(),
        coverImage: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify ownership
      const product = await db
        .select()
        .from(marketplaceProducts)
        .where(eq(marketplaceProducts.id, input.id))
        .limit(1);

      if (!product[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      // TODO: Check workspace ownership
      // if (product[0].workspaceId !== ctx.workspaceId) {
      //   throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to update this product" });
      // }

      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.description) updates.description = input.description;
      if (input.price !== undefined) updates.price = input.price;
      
      if (input.coverImage) {
        const coverBuffer = Buffer.from(input.coverImage, "base64");
        const coverKey = `marketplace/${ctx.user.id}/covers/${Date.now()}-cover.jpg`;
        const { url } = await storagePut(coverKey, coverBuffer, "image/jpeg");
        updates.coverImage = url;
      }

      await db
        .update(marketplaceProducts)
        .set(updates)
        .where(eq(marketplaceProducts.id, input.id));

      return { success: true };
    }),

  // Delete product
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Verify ownership
      const product = await db
        .select()
        .from(marketplaceProducts)
        .where(eq(marketplaceProducts.id, input.id))
        .limit(1);

      if (!product[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      // TODO: Check workspace ownership
      // if (product[0].workspaceId !== ctx.workspaceId) {
      //   throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to delete this product" });
      // }

      await db.delete(marketplaceProducts).where(eq(marketplaceProducts.id, input.id));

      return { success: true };
    }),

  // Purchase product (creates purchase record and generates license key)
  purchase: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
        paymentIntentId: z.string(), // Stripe payment intent ID
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Get product
      const product = await db
        .select()
        .from(marketplaceProducts)
        .where(eq(marketplaceProducts.id, input.productId))
        .limit(1);

      if (!product[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      // Generate license key
      const licenseKey = generateLicenseKey();

      // Create purchase record
      await db.insert(productPurchases).values({
        productId: input.productId,
        buyerWorkspaceId: 1, // TODO: Use actual workspace ID
        buyerUserId: ctx.user.id,
        amount: product[0].price,
        stripePaymentId: input.paymentIntentId,
        licenseKey,
      });

      // Update product sales count
      await db
        .update(marketplaceProducts)
        .set({
          sales: sql`${marketplaceProducts.sales} + 1`,
          revenue: sql`${marketplaceProducts.revenue} + ${product[0].price}`,
        })
        .where(eq(marketplaceProducts.id, input.productId));

      return {
        success: true,
        licenseKey,
        downloadUrl: product[0].fileUrl,
      };
    }),

  // Get user's purchases
  myPurchases: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const purchases = await db
      .select({
        id: productPurchases.id,
        productId: productPurchases.productId,
        amount: productPurchases.amount,
        licenseKey: productPurchases.licenseKey,
        purchasedAt: productPurchases.createdAt,
        productName: marketplaceProducts.name,
        productCategory: marketplaceProducts.category,
        downloadUrl: marketplaceProducts.fileUrl,
      })
      .from(productPurchases)
      .innerJoin(marketplaceProducts, eq(productPurchases.productId, marketplaceProducts.id))
      .where(eq(productPurchases.buyerUserId, ctx.user.id))
      .orderBy(desc(productPurchases.createdAt));

    return purchases;
  }),

  // Get product sales analytics (owner only)
  analytics: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const products = await db
      .select()
      .from(marketplaceProducts)
      .where(eq(marketplaceProducts.workspaceId, 1)); // TODO: Use actual workspace ID

    const totalRevenue = products.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);

    return {
      products,
      totalRevenue,
      totalSales,
      productCount: products.length,
    };
  }),
});
