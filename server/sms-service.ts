import twilio from "twilio";

interface SendSMSParams {
  to: string;
  message: string;
  from?: string;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * SMS service using Twilio
 * Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables
 */
export class SMSService {
  private client: ReturnType<typeof twilio> | null = null;
  private fromNumber: string | undefined;

  constructor(accountSid?: string, authToken?: string, fromNumber?: string) {
    const sid = accountSid || process.env.TWILIO_ACCOUNT_SID;
    const token = authToken || process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = fromNumber || process.env.TWILIO_PHONE_NUMBER;

    if (sid && token) {
      this.client = twilio(sid, token);
    }
  }

  async sendSMS(params: SendSMSParams): Promise<SMSResult> {
    if (!this.client) {
      return {
        success: false,
        error: "Twilio credentials not configured",
      };
    }

    if (!this.fromNumber && !params.from) {
      return {
        success: false,
        error: "Twilio phone number not configured",
      };
    }

    try {
      const message = await this.client.messages.create({
        body: params.message,
        to: params.to,
        from: params.from || this.fromNumber,
      });

      return {
        success: true,
        messageId: message.sid,
      };
    } catch (error: any) {
      console.error("[SMSService] Send failed:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulkSMS(
    recipients: string[],
    message: string
  ): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = await Promise.allSettled(
      recipients.map((to) => this.sendSMS({ to, message }))
    );

    const sent = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.length - sent;
    const errors = results
      .filter((r) => r.status === "fulfilled" && !r.value.success)
      .map((r: any) => r.value.error)
      .filter(Boolean);

    return { sent, failed, errors };
  }

  async getMessageStatus(messageSid: string): Promise<string | null> {
    if (!this.client) {
      return null;
    }

    try {
      const message = await this.client.messages(messageSid).fetch();
      return message.status;
    } catch (error: any) {
      console.error("[SMSService] Status check failed:", error.message);
      return null;
    }
  }
}

// Singleton instance
let smsService: SMSService | null = null;

export function getSMSService(
  accountSid?: string,
  authToken?: string,
  fromNumber?: string
): SMSService {
  if (!smsService) {
    smsService = new SMSService(accountSid, authToken, fromNumber);
  }
  return smsService;
}
