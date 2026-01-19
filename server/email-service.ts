import sgMail from "@sendgrid/mail";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email service using SendGrid
 * Requires SENDGRID_API_KEY environment variable
 */
export class EmailService {
  private initialized = false;
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SENDGRID_API_KEY;
    if (this.apiKey) {
      sgMail.setApiKey(this.apiKey);
      this.initialized = true;
    }
  }

  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    if (!this.initialized || !this.apiKey) {
      return {
        success: false,
        error: "SendGrid API key not configured",
      };
    }

    try {
      const msg = {
        to: params.to,
        from: params.from || process.env.SENDGRID_FROM_EMAIL || "noreply@kayden.ai",
        replyTo: params.replyTo,
        subject: params.subject,
        text: params.text || params.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
        html: params.html,
      };

      const [response] = await sgMail.send(msg);
      
      return {
        success: true,
        messageId: response.headers["x-message-id"] as string,
      };
    } catch (error: any) {
      console.error("[EmailService] Send failed:", error.response?.body || error.message);
      return {
        success: false,
        error: error.response?.body?.errors?.[0]?.message || error.message,
      };
    }
  }

  async sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string,
    text?: string
  ): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = await Promise.allSettled(
      recipients.map((to) =>
        this.sendEmail({ to, subject, html, text })
      )
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

  async sendTemplateEmail(
    to: string | string[],
    templateId: string,
    dynamicData: Record<string, any>
  ): Promise<EmailResult> {
    if (!this.initialized || !this.apiKey) {
      return {
        success: false,
        error: "SendGrid API key not configured",
      };
    }

    try {
      const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@kayden.ai",
        templateId,
        dynamicTemplateData: dynamicData,
      };

      const [response] = await sgMail.send(msg as any);
      
      return {
        success: true,
        messageId: response.headers["x-message-id"] as string,
      };
    } catch (error: any) {
      console.error("[EmailService] Template send failed:", error.response?.body || error.message);
      return {
        success: false,
        error: error.response?.body?.errors?.[0]?.message || error.message,
      };
    }
  }
}

// Singleton instance
let emailService: EmailService | null = null;

export function getEmailService(apiKey?: string): EmailService {
  if (!emailService) {
    emailService = new EmailService(apiKey);
  }
  return emailService;
}
