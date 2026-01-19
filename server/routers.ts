import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { printfulRouter } from "./api/routers/printful";
import { youtubeRouter } from "./routers/youtube";
import { socialMediaRouter } from "./routers/socialMedia";
import { marketingOSRouter } from "./routers/marketingOS";
import { financialCoPilotRouter } from "./routers/financialCoPilot";
import { taxAppRouter } from "./routers/taxApp";
import { aiFundingBrokerageRouter } from "./routers/aiFundingBrokerage";
import { vitalSyncRouter } from "./routers/vitalSync";
import { atlasAcademyRouter } from "./routers/atlasAcademy";
import { averyAIRouter } from "./routers/averyAI";
import { agentSwarmRouter, pantryInventoryRouter, audioMasteringRouter, healthSyncScribeRouter, spamSlayerRouter } from "./routers/remainingApps";
import { creativeClashLiveRouter } from "./routers/creativeClashLive";
import { profileRouter } from "./routers/profile";
import { apparelRouter } from "./routers/apparel";
import { llcFormationRouter } from "./routers/llcFormation";
import { dynastyTrustRouter } from "./routers/dynastyTrust";
import { buildWealthRouter } from "./routers/buildWealth";
import { salesCrmRouter } from "./routers/salesCrm";
import { employeeOsRouter } from "./routers/employeeOs";
import { invoiceGeneratorRouter } from "./routers/invoiceGenerator";
import { expenseTrackerRouter } from "./routers/expenseTracker";
import { projectManagerRouter } from "./routers/projectManager";
import { emailMarketingRouter } from "./routers/emailMarketing";
import { contractGeneratorRouter } from "./routers/contractGenerator";
import { appointmentSchedulerRouter } from "./routers/appointmentScheduler";
import {
  getAllProducts,
  getProductBySlug,
  getPricesByProductId,
  getUserEntitlements,
  checkUserEntitlement,
  getUserSubscriptions,
  getUserPayments,
  getAllApps,
  getAppBySlug,
  getUserApiKey,
  getUserApiKeys,
  createUserApiKey,
  deactivateUserApiKey,
  updateApiKeyLastUsed,
  createAuditLog,
  getAuditLogs,
  getBoutiqueProducts,
  getUserCart,
  getUserYoutubeChannels,
  getUserYoutubeVideos,
  getUserVideoDrafts,
  getPendingVideoDrafts,
  getScheduledPostPlans,
} from "./db";
import { encrypt, decrypt } from "./encryption";
import { createCheckoutSession, createPortalSession } from "./billing/stripe";

export const appRouter = router({
  system: systemRouter,
  profile: profileRouter,
  youtube: youtubeRouter,
  socialMedia: socialMediaRouter,
  marketingOS: marketingOSRouter,
  financialCoPilot: financialCoPilotRouter,
  taxApp: taxAppRouter,
  aiFundingBrokerage: aiFundingBrokerageRouter,
  vitalSync: vitalSyncRouter,
  atlasAcademy: atlasAcademyRouter,
  averyAI: averyAIRouter,
  agentSwarm: agentSwarmRouter,
  pantryInventory: pantryInventoryRouter,
  audioMastering: audioMasteringRouter,
  healthSyncScribe: healthSyncScribeRouter,
  spamSlayer: spamSlayerRouter,
  creativeClashLive: creativeClashLiveRouter,
  apparel: apparelRouter,
  llcFormation: llcFormationRouter,
  dynastyTrust: dynastyTrustRouter,
  buildWealth: buildWealthRouter,
  salesCrm: salesCrmRouter,
  employeeOs: employeeOsRouter,
  invoiceGenerator: invoiceGeneratorRouter,
  expenseTracker: expenseTrackerRouter,
  projectManager: projectManagerRouter,
  emailMarketing: emailMarketingRouter,
  contractGenerator: contractGeneratorRouter,
  appointmentScheduler: appointmentSchedulerRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: protectedProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============= PRODUCT & PRICING ROUTES =============
  
  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await getProductBySlug(input.slug);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }
        return product;
      }),
    
    getPrices: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await getPricesByProductId(input.productId);
      }),
  }),

  // ============= SUBSCRIPTION & BILLING ROUTES =============
  
  billing: router({
    createCheckout: protectedProcedure
      .input(z.object({
        productId: z.number(),
        priceId: z.string(),
        successUrl: z.string(),
        cancelUrl: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const session = await createCheckoutSession({
          userId: ctx.user.id,
          priceId: input.priceId,
          productId: input.productId,
          successUrl: input.successUrl,
          cancelUrl: input.cancelUrl,
          customerEmail: ctx.user.email || undefined,
        });
        
        return { sessionId: session.id, url: session.url };
      }),
    
    createPortal: protectedProcedure
      .input(z.object({
        customerId: z.string(),
        returnUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        const session = await createPortalSession(input.customerId, input.returnUrl);
        return { url: session.url };
      }),
    
    getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSubscriptions(ctx.user.id);
    }),
    
    getPayments: protectedProcedure.query(async ({ ctx }) => {
      return await getUserPayments(ctx.user.id);
    }),
  }),

  // ============= ENTITLEMENT ROUTES =============
  
  entitlements: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserEntitlements(ctx.user.id);
    }),
    
    check: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ ctx, input }) => {
        const hasAccess = await checkUserEntitlement(ctx.user.id, input.productId);
        return { hasAccess };
      }),
    
    checkBySlug: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ ctx, input }) => {
        const product = await getProductBySlug(input.slug);
        if (!product) {
          return { hasAccess: false };
        }
        const hasAccess = await checkUserEntitlement(ctx.user.id, product.id);
        return { hasAccess };
      }),
  }),

  // ============= APP REGISTRY ROUTES =============
  
  apps: router({
    list: publicProcedure.query(async () => {
      return await getAllApps();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const app = await getAppBySlug(input.slug);
        if (!app) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'App not found' });
        }
        return app;
      }),
  }),

  // ============= API KEY VAULT ROUTES =============
  
  apiKeys: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const keys = await getUserApiKeys(ctx.user.id);
      // Don't return encrypted keys or IVs to client
      return keys.map(key => ({
        id: key.id,
        service: key.service,
        keyName: key.keyName,
        active: key.active,
        lastUsed: key.lastUsed,
        expiresAt: key.expiresAt,
        createdAt: key.createdAt,
      }));
    }),
    
    create: protectedProcedure
      .input(z.object({
        service: z.string(),
        keyName: z.string(),
        apiKey: z.string(),
        expiresAt: z.date().optional(),
        metadata: z.any().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Encrypt the API key
        const { encrypted, iv } = encrypt(input.apiKey);
        
        await createUserApiKey({
          userId: ctx.user.id,
          service: input.service,
          keyName: input.keyName,
          encryptedKey: encrypted,
          iv,
          expiresAt: input.expiresAt,
          metadata: input.metadata,
        });
        
        await createAuditLog({
          userId: ctx.user.id,
          action: 'api_key_created',
          resource: 'api_keys',
          details: { service: input.service, keyName: input.keyName },
          severity: 'info',
        });
        
        return { success: true };
      }),
    
    get: protectedProcedure
      .input(z.object({
        service: z.string(),
        keyName: z.string(),
      }))
      .query(async ({ ctx, input }) => {
        const key = await getUserApiKey(ctx.user.id, input.service, input.keyName);
        
        if (!key) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'API key not found' });
        }
        
        // Decrypt the key
        const decryptedKey = decrypt(key.encryptedKey, key.iv);
        
        // Update last used timestamp
        await updateApiKeyLastUsed(key.id);
        
        await createAuditLog({
          userId: ctx.user.id,
          action: 'api_key_accessed',
          resource: 'api_keys',
          resourceId: key.id,
          details: { service: input.service, keyName: input.keyName },
          severity: 'info',
        });
        
        return { apiKey: decryptedKey };
      }),
    
    deactivate: protectedProcedure
      .input(z.object({
        service: z.string(),
        keyName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await deactivateUserApiKey(ctx.user.id, input.service, input.keyName);
        
        await createAuditLog({
          userId: ctx.user.id,
          action: 'api_key_deactivated',
          resource: 'api_keys',
          details: { service: input.service, keyName: input.keyName },
          severity: 'warning',
        });
        
        return { success: true };
      }),
  }),

  // ============= AUDIT LOG ROUTES (ADMIN ONLY) =============
  
  audit: router({
    logs: protectedProcedure
      .input(z.object({
        userId: z.number().optional(),
        action: z.string().optional(),
        resource: z.string().optional(),
        severity: z.enum(['info', 'warning', 'critical']).optional(),
        limit: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        // Only admins can view audit logs
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        
        return await getAuditLogs(input);
      }),
  }),

  // ============= BOUGIE BOUTIQUE ROUTES =============
  
  boutique: router({
    products: publicProcedure
      .input(z.object({
        category: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await getBoutiqueProducts({
          category: input.category,
          active: true,
        });
      }),
    
    cart: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCart(ctx.user.id);
    }),
  }),

  // ============= YOUTUBE AUTOMATION ROUTES =============
  // (Moved to youtube router imported above)

  // ============= PRINTFUL INTEGRATION =============
  
  printful: printfulRouter,

  // ============= ORDERS ROUTES =============
  
  orders: router({ list: protectedProcedure.query(async ({ ctx }) => {
      // Get orders from database
      const db = await import("./db");
      return await db.getBoutiqueOrdersByUser(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await import("./db");
        return await db.getBoutiqueOrderById(input.orderId, ctx.user.id);
      }),
  }),

  // ============= SOCIAL MEDIA AUTOPILOT ROUTES =============
  // (Moved to socialMedia router imported above)
});

export type AppRouter = typeof appRouter;
