import { getDb } from '../db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { videoDrafts, postPlans, affiliateOffers, platformCredentials } from '../../drizzle/schema';
import { decrypt } from '../encryption';

export interface VideoDraft {
  id: number;
  userId: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'published';
  platforms: string[];
  scheduledFor: Date | null;
  createdAt: Date;
}

export interface PostPlan {
  id: number;
  userId: number;
  videoDraftId: number;
  platform: 'facebook' | 'youtube' | 'tiktok' | 'instagram' | 'snapchat';
  scheduledFor: Date;
  status: 'scheduled' | 'posting' | 'posted' | 'failed';
  postId: string | null;
  postUrl: string | null;
  error: string | null;
  postedAt: Date | null;
}

export interface TrendingTopic {
  id: number;
  platform: string;
  topic: string;
  hashtags: string[];
  engagementScore: number;
  scannedAt: Date;
}

export interface AffiliateOffer {
  id: number;
  provider: string;
  productName: string;
  description: string;
  commission: number;
  affiliateLink: string;
  active: boolean;
}

/**
 * Create a new video draft for approval
 */
export async function createVideoDraft(params: {
  userId: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  platforms: string[];
}): Promise<VideoDraft> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db.insert(videoDrafts).values({
    userId: params.userId,
    title: params.title,
    description: params.description,
    videoUrl: params.videoUrl,
    thumbnailUrl: params.thumbnailUrl || null,
    status: 'pending',
    platforms: JSON.stringify(params.platforms),
  });

  // Fetch the created draft
  const [draft] = await db
    .select()
    .from(videoDrafts)
    .where(eq(videoDrafts.userId, params.userId))
    .orderBy(desc(videoDrafts.createdAt))
    .limit(1);

  return {
    ...draft,
    scheduledFor: null,
    platforms: JSON.parse(draft.platforms as string),
  } as VideoDraft;
}

/**
 * Get all video drafts for a user
 */
export async function getUserVideoDrafts(userId: number, status?: string): Promise<VideoDraft[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const query = db
    .select()
    .from(videoDrafts)
    .where(eq(videoDrafts.userId, userId))
    .orderBy(desc(videoDrafts.createdAt));

  const drafts = await query;

  return drafts
    .filter(draft => !status || draft.status === status)
    .map(draft => ({
      ...draft,
      scheduledFor: null,
      platforms: JSON.parse(draft.platforms as string),
    })) as VideoDraft[];
}

/**
 * Approve a video draft
 */
export async function approveVideoDraft(draftId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(videoDrafts)
    .set({ status: 'approved' })
    .where(and(
      eq(videoDrafts.id, draftId),
      eq(videoDrafts.userId, userId)
    ));
}

/**
 * Reject a video draft
 */
export async function rejectVideoDraft(draftId: number, userId: number, reason?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(videoDrafts)
    .set({ 
      status: 'rejected',
      rejectionReason: reason || null,
    })
    .where(and(
      eq(videoDrafts.id, draftId),
      eq(videoDrafts.userId, userId)
    ));
}

/**
 * Schedule a video draft for publishing
 */
export async function scheduleVideoDraft(params: {
  draftId: number;
  userId: number;
  scheduledFor: Date;
  platforms: string[];
}): Promise<PostPlan[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Update draft status
  await db
    .update(videoDrafts)
    .set({ 
      status: 'scheduled',
    })
    .where(and(
      eq(videoDrafts.id, params.draftId),
      eq(videoDrafts.userId, params.userId)
    ));

  // Get the draft details
  const [draft] = await db
    .select()
    .from(videoDrafts)
    .where(eq(videoDrafts.id, params.draftId))
    .limit(1);

  if (!draft) {
    throw new Error('Video draft not found');
  }

  // Create post plans for each platform
  const plans: PostPlan[] = [];
  
  for (const platform of params.platforms) {
    await db.insert(postPlans).values({
      userId: params.userId,
      videoDraftId: params.draftId,
      platform: platform as any,
      scheduledFor: params.scheduledFor,
      status: 'scheduled',
    });
  }

  // Fetch the created plans
  const createdPlans = await db
    .select()
    .from(postPlans)
    .where(and(
      eq(postPlans.userId, params.userId),
      eq(postPlans.videoDraftId, params.draftId)
    ));

  plans.push(...(createdPlans as PostPlan[]));

  return plans;
}

/**
 * Get scheduled post plans for a user
 */
export async function getScheduledPosts(userId: number): Promise<PostPlan[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const plans = await db
    .select()
    .from(postPlans)
    .where(eq(postPlans.userId, userId))
    .orderBy(desc(postPlans.scheduledFor));

  return plans as PostPlan[];
}

/**
 * Publish a post to a platform
 */
export async function publishPost(postPlanId: number, userId: number): Promise<{ success: boolean; postUrl?: string }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get the post plan
  const [plan] = await db
    .select()
    .from(postPlans)
    .where(and(
      eq(postPlans.id, postPlanId),
      eq(postPlans.userId, userId)
    ))
    .limit(1);

  if (!plan) {
    throw new Error('Post plan not found');
  }

  // Get platform credentials
  const [credential] = await db
    .select()
    .from(platformCredentials)
    .where(and(
      eq(platformCredentials.userId, userId),
      eq(platformCredentials.platform, plan.platform)
    ))
    .limit(1);

  if (!credential) {
    throw new Error(`No credentials found for ${plan.platform}`);
  }

  // Decrypt the token
  const decryptedToken = decrypt(credential.encryptedToken, credential.iv);
  const tokenData = JSON.parse(decryptedToken);

  // Update status to posting
  await db
    .update(postPlans)
    .set({ status: 'posting' })
    .where(eq(postPlans.id, postPlanId));

  try {
    // Platform-specific publishing logic
    let postUrl: string | undefined;

    switch (plan.platform) {
      case 'facebook':
        postUrl = await publishToFacebook(tokenData.access_token, plan);
        break;
      case 'youtube':
        postUrl = await publishToYouTube(tokenData.access_token, plan);
        break;
      case 'tiktok':
        postUrl = await publishToTikTok(tokenData.access_token, plan);
        break;
      case 'instagram':
        postUrl = await publishToInstagram(tokenData.access_token, plan);
        break;
      case 'snapchat':
        postUrl = await publishToSnapchat(tokenData.access_token, plan);
        break;
      default:
        throw new Error(`Unsupported platform: ${plan.platform}`);
    }

    // Update status to posted
    await db
      .update(postPlans)
      .set({ 
        status: 'posted',
        postedAt: new Date(),
        postUrl: postUrl || null,
      })
      .where(eq(postPlans.id, postPlanId));

    return { success: true, postUrl };
  } catch (error) {
    // Update status to failed
    await db
      .update(postPlans)
      .set({ status: 'failed' })
      .where(eq(postPlans.id, postPlanId));

    throw error;
  }
}

/**
 * Scan trending topics across platforms
 */
export async function scanTrendingTopics(platform: string): Promise<TrendingTopic[]> {
  // TODO: Implement actual platform API calls for trending topics
  // For now, return mock data
  return [
    {
      id: 1,
      platform,
      topic: 'AI Revolution',
      hashtags: ['#AI', '#Tech', '#Innovation'],
      engagementScore: 95,
      scannedAt: new Date(),
    },
    {
      id: 2,
      platform,
      topic: 'Mental Health Awareness',
      hashtags: ['#MentalHealth', '#Wellness', '#SelfCare'],
      engagementScore: 88,
      scannedAt: new Date(),
    },
  ];
}

/**
 * Get active affiliate offers
 */
export async function getAffiliateOffers(): Promise<AffiliateOffer[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const offers = await db
    .select()
    .from(affiliateOffers)
    .where(eq(affiliateOffers.active, true))
    .orderBy(desc(affiliateOffers.commission));

  return offers.map(offer => ({
    id: offer.id,
    provider: 'Unknown', // Add provider field if needed
    productName: offer.name,
    description: offer.description || '',
    commission: parseFloat(offer.commission || '0'),
    affiliateLink: offer.affiliateLink,
    active: offer.active,
  })) as AffiliateOffer[];
}

/**
 * Get stats for social media dashboard
 */
export async function getStats(userId: number): Promise<{
  scheduledPosts: number;
  publishedPosts: number;
  totalEngagement: number;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get scheduled posts count
  const [scheduledResult] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(postPlans)
    .where(and(
      eq(postPlans.userId, userId),
      eq(postPlans.status, 'scheduled')
    ));

  // Get published posts count
  const [publishedResult] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(postPlans)
    .where(and(
      eq(postPlans.userId, userId),
      eq(postPlans.status, 'posted')
    ));

  return {
    scheduledPosts: scheduledResult?.count || 0,
    publishedPosts: publishedResult?.count || 0,
    totalEngagement: 0, // This would come from actual platform analytics APIs
  };
}

// Platform-specific publishing functions

async function publishToFacebook(accessToken: string, plan: PostPlan): Promise<string> {
  // TODO: Implement Facebook Graph API publishing
  // https://developers.facebook.com/docs/graph-api/reference/user/videos
  return `https://facebook.com/post/${Date.now()}`;
}

async function publishToYouTube(accessToken: string, plan: PostPlan): Promise<string> {
  // TODO: Implement YouTube Data API publishing
  // Already implemented in youtube.ts service
  return `https://youtube.com/watch?v=${Date.now()}`;
}

async function publishToTikTok(accessToken: string, plan: PostPlan): Promise<string> {
  // TODO: Implement TikTok API publishing
  // https://developers.tiktok.com/doc/content-posting-api-get-started
  return `https://tiktok.com/@user/video/${Date.now()}`;
}

async function publishToInstagram(accessToken: string, plan: PostPlan): Promise<string> {
  // TODO: Implement Instagram Graph API publishing
  // https://developers.facebook.com/docs/instagram-api/guides/content-publishing
  return `https://instagram.com/p/${Date.now()}`;
}

async function publishToSnapchat(accessToken: string, plan: PostPlan): Promise<string> {
  // TODO: Implement Snapchat Marketing API publishing
  // https://marketingapi.snapchat.com/docs/
  return `https://snapchat.com/add/${Date.now()}`;
}

/**
 * Get analytics for published posts
 */
export async function getPostAnalytics(postPlanId: number, userId: number): Promise<{
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const [plan] = await db
    .select()
    .from(postPlans)
    .where(and(
      eq(postPlans.id, postPlanId),
      eq(postPlans.userId, userId)
    ))
    .limit(1);

  if (!plan || plan.status !== 'posted') {
    throw new Error('Post not found or not posted');
  }

  // TODO: Fetch real analytics from platform APIs
  // For now, return mock data
  return {
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    shares: Math.floor(Math.random() * 50),
    engagement: Math.random() * 10,
  };
}
