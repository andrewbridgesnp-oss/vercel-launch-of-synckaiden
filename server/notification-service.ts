import { getDb } from "./db";
import { notifications, type InsertNotification } from "../drizzle/schema";
import { notifyUser } from "./websocket";

export type NotificationType = "security" | "appointment" | "lead" | "campaign" | "system";

export interface CreateNotificationParams {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

/**
 * Create and send a notification to a user
 */
export async function createNotification(params: CreateNotificationParams): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Notification] Database not available");
      return false;
    }

    // Insert notification into database
    const notification: InsertNotification = {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data ? JSON.stringify(params.data) : null,
      read: false,
    };

    const result = await db.insert(notifications).values(notification);
    const notificationId = result[0]?.insertId;

    // Send real-time notification via WebSocket
    const sent = notifyUser(params.userId, "notification", {
      id: notificationId,
      ...notification,
      createdAt: new Date().toISOString(),
    });

    console.log(`[Notification] Created ${params.type} notification for user ${params.userId}${sent ? " (sent via WebSocket)" : " (user offline)"}`);
    
    return true;
  } catch (error) {
    console.error("[Notification] Failed to create notification:", error);
    return false;
  }
}

/**
 * Send security alert notification
 */
export async function notifySecurityAlert(userId: number, eventType: string, description: string, severity: "info" | "warning" | "critical") {
  return createNotification({
    userId,
    type: "security",
    title: `Security Alert: ${eventType}`,
    message: description,
    data: { eventType, severity },
  });
}

/**
 * Send appointment reminder notification
 */
export async function notifyAppointmentReminder(userId: number, appointmentTitle: string, startTime: number) {
  const timeStr = new Date(startTime).toLocaleString();
  return createNotification({
    userId,
    type: "appointment",
    title: "Upcoming Appointment",
    message: `Reminder: ${appointmentTitle} at ${timeStr}`,
    data: { appointmentTitle, startTime },
  });
}

/**
 * Send new lead notification
 */
export async function notifyNewLead(userId: number, leadName: string, leadEmail: string, source: string) {
  return createNotification({
    userId,
    type: "lead",
    title: "New Lead Captured",
    message: `${leadName} (${leadEmail}) from ${source}`,
    data: { leadName, leadEmail, source },
  });
}

/**
 * Send campaign milestone notification
 */
export async function notifyCampaignMilestone(userId: number, campaignName: string, milestone: string, value: number) {
  return createNotification({
    userId,
    type: "campaign",
    title: `Campaign Milestone: ${campaignName}`,
    message: `${milestone}: ${value}`,
    data: { campaignName, milestone, value },
  });
}

/**
 * Send system notification
 */
export async function notifySystem(userId: number, title: string, message: string, data?: any) {
  return createNotification({
    userId,
    type: "system",
    title,
    message,
    data,
  });
}
