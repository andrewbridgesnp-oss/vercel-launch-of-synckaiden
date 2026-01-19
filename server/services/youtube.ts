import { google } from 'googleapis';
import { getDb } from '../db';
import { eq } from 'drizzle-orm';
import { platformCredentials } from '../../drizzle/schema';
import { decrypt } from '../encryption';

const youtube = google.youtube('v3');

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  status: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface UploadVideoParams {
  title: string;
  description: string;
  tags?: string[];
  categoryId?: string;
  privacyStatus: 'private' | 'public' | 'unlisted';
  scheduledPublishTime?: string;
  videoFilePath: string;
  thumbnailPath?: string;
}

export interface VideoAnalytics {
  videoId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
  averageViewDuration: number;
  subscribersGained: number;
  estimatedRevenue: number;
}

/**
 * Get OAuth2 client for a user's YouTube credentials
 */
async function getYouTubeClient(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const credentials = await db
    .select()
    .from(platformCredentials)
    .where(eq(platformCredentials.userId, userId))
    .limit(1);

  const credential = credentials.find(c => c.platform === 'youtube');

  if (!credential) {
    throw new Error('YouTube credentials not found. Please connect your YouTube account.');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  // Decrypt the stored token
  const decryptedToken = decrypt(credential.encryptedToken, credential.iv);
  const tokenData = JSON.parse(decryptedToken);

  oauth2Client.setCredentials({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry_date: credential.expiresAt ? new Date(credential.expiresAt).getTime() : undefined,
  });

  return oauth2Client;
}

/**
 * Get user's YouTube channel information
 */
export async function getChannelInfo(userId: number): Promise<YouTubeChannel> {
  const auth = await getYouTubeClient(userId);

  const response = await youtube.channels.list({
    auth,
    part: ['snippet', 'statistics'],
    mine: true,
  });

  const channel = response.data.items?.[0];
  if (!channel) {
    throw new Error('No YouTube channel found');
  }

  return {
    id: channel.id || '',
    title: channel.snippet?.title || '',
    description: channel.snippet?.description || '',
    thumbnailUrl: channel.snippet?.thumbnails?.high?.url || '',
    subscriberCount: parseInt(channel.statistics?.subscriberCount || '0'),
    videoCount: parseInt(channel.statistics?.videoCount || '0'),
    viewCount: parseInt(channel.statistics?.viewCount || '0'),
  };
}

/**
 * Get user's uploaded videos
 */
export async function getVideos(userId: number, maxResults: number = 50): Promise<YouTubeVideo[]> {
  const auth = await getYouTubeClient(userId);

  // First get the uploads playlist ID
  const channelResponse = await youtube.channels.list({
    auth,
    part: ['contentDetails'],
    mine: true,
  });

  const uploadsPlaylistId = channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    return [];
  }

  // Get videos from uploads playlist
  const playlistResponse = await youtube.playlistItems.list({
    auth,
    part: ['snippet', 'contentDetails'],
    playlistId: uploadsPlaylistId,
    maxResults,
  });

  const videoIds = playlistResponse.data.items?.map((item: any) => item.contentDetails?.videoId).filter(Boolean) || [];

  if (videoIds.length === 0) {
    return [];
  }

  // Get detailed video statistics
  const videosResponse = await youtube.videos.list({
    auth,
    part: ['snippet', 'statistics', 'contentDetails', 'status'],
    id: videoIds as string[],
  });

  return (videosResponse.data.items || []).map((video: any) => ({
    id: video.id || '',
    title: video.snippet?.title || '',
    description: video.snippet?.description || '',
    thumbnailUrl: video.snippet?.thumbnails?.high?.url || '',
    publishedAt: video.snippet?.publishedAt || '',
    viewCount: parseInt(video.statistics?.viewCount || '0'),
    likeCount: parseInt(video.statistics?.likeCount || '0'),
    commentCount: parseInt(video.statistics?.commentCount || '0'),
    duration: video.contentDetails?.duration || '',
    status: video.status?.privacyStatus || 'private',
  }));
}

/**
 * Upload a video to YouTube
 */
export async function uploadVideo(userId: number, params: UploadVideoParams): Promise<string> {
  const auth = await getYouTubeClient(userId);

  // Note: Actual file upload requires multipart/form-data handling
  // This is a simplified version - in production, use resumable upload
  const response = await youtube.videos.insert({
    auth,
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: params.title,
        description: params.description,
        tags: params.tags,
        categoryId: params.categoryId || '22', // Default to People & Blogs
      },
      status: {
        privacyStatus: params.privacyStatus,
        publishAt: params.scheduledPublishTime,
      },
    },
    // media: {
    //   body: fs.createReadStream(params.videoFilePath),
    // },
  });

  const videoId = response.data.id;
  if (!videoId) {
    throw new Error('Failed to upload video');
  }

  // Upload thumbnail if provided
  if (params.thumbnailPath) {
    await youtube.thumbnails.set({
      auth,
      videoId,
      // media: {
      //   body: fs.createReadStream(params.thumbnailPath),
      // },
    });
  }

  return videoId;
}

/**
 * Schedule a video for future publication
 */
export async function scheduleVideo(
  userId: number,
  videoId: string,
  publishTime: string
): Promise<void> {
  const auth = await getYouTubeClient(userId);

  await youtube.videos.update({
    auth,
    part: ['status'],
    requestBody: {
      id: videoId,
      status: {
        privacyStatus: 'private',
        publishAt: publishTime,
      },
    },
  });
}

/**
 * Get video analytics
 */
export async function getVideoAnalytics(
  userId: number,
  videoId: string,
  startDate: string,
  endDate: string
): Promise<VideoAnalytics> {
  const auth = await getYouTubeClient(userId);

  const youtubeAnalytics = google.youtubeAnalytics('v2');

  const response = await youtubeAnalytics.reports.query({
    auth,
    ids: 'channel==MINE',
    startDate,
    endDate,
    metrics: 'views,likes,comments,shares,estimatedMinutesWatched,averageViewDuration,subscribersGained,estimatedRevenue',
    dimensions: 'video',
    filters: `video==${videoId}`,
  });

  const row = response.data.rows?.[0] || [];

  return {
    videoId,
    views: parseInt(row[0] as string) || 0,
    likes: parseInt(row[1] as string) || 0,
    comments: parseInt(row[2] as string) || 0,
    shares: parseInt(row[3] as string) || 0,
    watchTime: parseInt(row[4] as string) || 0,
    averageViewDuration: parseInt(row[5] as string) || 0,
    subscribersGained: parseInt(row[6] as string) || 0,
    estimatedRevenue: parseFloat(row[7] as string) || 0,
  };
}

/**
 * Get channel analytics overview
 */
export async function getChannelAnalytics(
  userId: number,
  startDate: string,
  endDate: string
): Promise<{
  views: number;
  subscribers: number;
  watchTime: number;
  revenue: number;
}> {
  const auth = await getYouTubeClient(userId);

  const youtubeAnalytics = google.youtubeAnalytics('v2');

  const response = await youtubeAnalytics.reports.query({
    auth,
    ids: 'channel==MINE',
    startDate,
    endDate,
    metrics: 'views,subscribersGained,estimatedMinutesWatched,estimatedRevenue',
  });

  const row = response.data.rows?.[0] || [];

  return {
    views: parseInt(row[0] as string) || 0,
    subscribers: parseInt(row[1] as string) || 0,
    watchTime: parseInt(row[2] as string) || 0,
    revenue: parseFloat(row[3] as string) || 0,
  };
}

/**
 * Delete a video
 */
export async function deleteVideo(userId: number, videoId: string): Promise<void> {
  const auth = await getYouTubeClient(userId);

  await youtube.videos.delete({
    auth,
    id: videoId,
  });
}

/**
 * Update video metadata
 */
export async function updateVideo(
  userId: number,
  videoId: string,
  updates: {
    title?: string;
    description?: string;
    tags?: string[];
    categoryId?: string;
    privacyStatus?: 'private' | 'public' | 'unlisted';
  }
): Promise<void> {
  const auth = await getYouTubeClient(userId);

  await youtube.videos.update({
    auth,
    part: ['snippet', 'status'],
    requestBody: {
      id: videoId,
      snippet: {
        title: updates.title,
        description: updates.description,
        tags: updates.tags,
        categoryId: updates.categoryId,
      },
      status: {
        privacyStatus: updates.privacyStatus,
      },
    },
  });
}
