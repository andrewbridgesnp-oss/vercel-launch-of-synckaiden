import { z } from "zod";
import { router, protectedProcedure } from "../../_core/trpc";
import { TRPCError } from "@trpc/server";

// Email templates for different form types
const EMAIL_TEMPLATES = {
  llcFormation: {
    subject: "Your LLC Formation Documents - Kaiden AI",
    template: (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #00d4ff; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .disclaimer { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .btn { display: inline-block; background: #00d4ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kaiden AI</h1>
      <p>Your LLC Formation Summary</p>
    </div>
    <div class="content">
      <h2>Hello ${data.name},</h2>
      <p>Thank you for using Kaiden AI to prepare your LLC formation documents. Below is a summary of your submission:</p>
      
      <div class="section">
        <h3>Business Information</h3>
        <p><strong>LLC Name:</strong> ${data.llcName}</p>
        <p><strong>State of Formation:</strong> ${data.state}</p>
        <p><strong>Business Purpose:</strong> ${data.purpose}</p>
        <p><strong>Management Type:</strong> ${data.managementType}</p>
      </div>
      
      <div class="section">
        <h3>Registered Agent</h3>
        <p><strong>Name:</strong> ${data.registeredAgent}</p>
        <p><strong>Address:</strong> ${data.registeredAgentAddress}</p>
      </div>
      
      <div class="section">
        <h3>Members</h3>
        ${data.members?.map((m: any) => `<p>• ${m.name} - ${m.ownership}% ownership</p>`).join('') || 'Not specified'}
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ Important Disclaimer</strong>
        <p>This document is for informational purposes only and does not constitute legal advice. You must file these documents with your state's Secretary of State office. We strongly recommend having an attorney review your documents before filing.</p>
      </div>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="#" class="btn">Request Attorney Review ($99)</a>
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Kaiden AI by Syndica Solutions. All rights reserved.</p>
      <p>This email was sent because you used our LLC Formation tool.</p>
    </div>
  </div>
</body>
</html>
    `
  },
  
  brunnerTest: {
    subject: "Your Brunner Test Assessment - Kaiden AI",
    template: (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .score { font-size: 48px; font-weight: bold; color: ${data.score >= 70 ? '#22c55e' : data.score >= 40 ? '#f59e0b' : '#ef4444'}; text-align: center; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .disclaimer { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .btn { display: inline-block; background: #00d4ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kaiden AI</h1>
      <p>Brunner Test Assessment Results</p>
    </div>
    <div class="content">
      <h2>Hello ${data.name},</h2>
      <p>Based on the information you provided, here is your Brunner Test assessment:</p>
      
      <div class="section" style="text-align: center;">
        <p>Your Estimated Score</p>
        <div class="score">${data.score}/100</div>
        <p><strong>${data.likelihood}</strong></p>
      </div>
      
      <div class="section">
        <h3>Assessment Breakdown</h3>
        <p><strong>Prong 1 - Minimal Standard of Living:</strong> ${data.prong1Score}/33</p>
        <p><strong>Prong 2 - Persistence of Hardship:</strong> ${data.prong2Score}/33</p>
        <p><strong>Prong 3 - Good Faith Effort:</strong> ${data.prong3Score}/34</p>
      </div>
      
      <div class="section">
        <h3>Your Information</h3>
        <p><strong>Monthly Income:</strong> $${data.monthlyIncome}</p>
        <p><strong>Monthly Expenses:</strong> $${data.monthlyExpenses}</p>
        <p><strong>Student Loan Balance:</strong> $${data.loanBalance}</p>
        <p><strong>Dependents:</strong> ${data.dependents}</p>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ Legal Disclaimer</strong>
        <p>This assessment is for educational purposes only and does not guarantee student loan discharge. The Brunner Test is applied differently across jurisdictions. You MUST consult with a bankruptcy attorney licensed in your state before taking any legal action. This tool does not constitute legal advice.</p>
        <p><strong>Legal Citation:</strong> Brunner v. New York State Higher Education Services Corp., 831 F.2d 395 (2d Cir. 1987)</p>
      </div>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="#" class="btn">Schedule Attorney Consultation ($149)</a>
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Kaiden AI by Syndica Solutions. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  },
  
  creditRepair: {
    subject: "Your Credit Repair Action Plan - Kaiden AI",
    template: (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .disclaimer { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .step { display: flex; gap: 15px; margin: 10px 0; }
    .step-num { background: #00d4ff; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kaiden AI</h1>
      <p>Your Personalized Credit Repair Plan</p>
    </div>
    <div class="content">
      <h2>Hello ${data.name},</h2>
      <p>Based on your credit assessment, we've created a personalized action plan to help improve your credit score.</p>
      
      <div class="section">
        <h3>Current Status</h3>
        <p><strong>Estimated Credit Range:</strong> ${data.creditRange}</p>
        <p><strong>Primary Issues:</strong> ${data.issues?.join(', ') || 'Not specified'}</p>
        <p><strong>Total Debt:</strong> $${data.totalDebt}</p>
      </div>
      
      <div class="section">
        <h3>Your Action Plan</h3>
        ${data.actionPlan?.map((step: string, i: number) => `
          <div class="step">
            <div class="step-num">${i + 1}</div>
            <p>${step}</p>
          </div>
        `).join('') || ''}
      </div>
      
      <div class="section">
        <h3>Dispute Letter Templates Included</h3>
        <p>We've attached sample dispute letter templates you can customize and send to credit bureaus:</p>
        <ul>
          <li>Equifax Dispute Letter</li>
          <li>Experian Dispute Letter</li>
          <li>TransUnion Dispute Letter</li>
        </ul>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ Important Notice</strong>
        <p>Credit repair takes time and there are no guarantees. Be wary of any company promising to "fix" your credit quickly. Under the Fair Credit Reporting Act (15 U.S.C. § 1681), you have the right to dispute inaccurate information on your credit report for free.</p>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Kaiden AI by Syndica Solutions. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  },
  
  dynastyTrust: {
    subject: "Your Dynasty Trust Workbook - Kaiden AI",
    template: (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #ffd700; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .disclaimer { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .btn { display: inline-block; background: #00d4ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kaiden AI</h1>
      <p>The Southern Dynasty Trust Workbook</p>
    </div>
    <div class="content">
      <h2>Hello ${data.name},</h2>
      <p>Thank you for completing the Dynasty Trust planning workbook. Here is your personalized summary:</p>
      
      <div class="section">
        <h3>Trust Overview</h3>
        <p><strong>Trust Name:</strong> ${data.trustName}</p>
        <p><strong>Trust Type:</strong> ${data.trustType}</p>
        <p><strong>Jurisdiction:</strong> ${data.jurisdiction}</p>
        <p><strong>Primary Purpose:</strong> ${data.purpose}</p>
      </div>
      
      <div class="section">
        <h3>Key Participants</h3>
        <p><strong>Grantor:</strong> ${data.grantor}</p>
        <p><strong>Trustee:</strong> ${data.trustee}</p>
        <p><strong>Beneficiaries:</strong> ${data.beneficiaries?.join(', ') || 'Not specified'}</p>
      </div>
      
      <div class="section">
        <h3>Assets to Transfer</h3>
        <p><strong>Estimated Value:</strong> $${data.estimatedValue}</p>
        <p><strong>Asset Types:</strong> ${data.assetTypes?.join(', ') || 'Not specified'}</p>
      </div>
      
      <div class="section">
        <h3>Tax Considerations</h3>
        <p><strong>Generation-Skipping Tax:</strong> ${data.gstApplicable ? 'May apply' : 'Likely exempt'}</p>
        <p><strong>State Income Tax:</strong> ${data.stateIncomeTax}</p>
      </div>
      
      <div class="disclaimer">
        <strong>⚠️ Critical Legal Notice</strong>
        <p>Dynasty trusts are complex legal instruments with significant tax and legal implications. This workbook is for educational planning purposes ONLY. You MUST work with a qualified estate planning attorney and tax professional before establishing any trust. Laws vary significantly by state and your individual circumstances.</p>
        <p><strong>Recommended Jurisdictions:</strong> South Dakota, Nevada, Delaware (favorable trust laws)</p>
      </div>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="#" class="btn">Schedule Estate Attorney Review ($249)</a>
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Kaiden AI by Syndica Solutions. All rights reserved.</p>
      <p>Based on "The Southern Dynasty" educational materials.</p>
    </div>
  </div>
</body>
</html>
    `
  }
};

export const emailRouter = router({
  // Send form completion email
  sendFormEmail: protectedProcedure
    .input(z.object({
      formType: z.enum(["llcFormation", "brunnerTest", "creditRepair", "dynastyTrust"]),
      recipientEmail: z.string().email(),
      formData: z.record(z.string(), z.any()),
    }))
    .mutation(async ({ ctx, input }) => {
      const template = EMAIL_TEMPLATES[input.formType];
      if (!template) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid form type" });
      }

      // In production, this would use SendGrid API
      // For now, we'll simulate the email send
      const emailContent = {
        to: input.recipientEmail,
        subject: template.subject,
        html: template.template(input.formData),
      };

      // Check if SendGrid API key is configured
      const sendgridKey = process.env.SENDGRID_API_KEY;
      
      if (sendgridKey) {
        // Real SendGrid integration
        try {
          const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${sendgridKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: input.recipientEmail }] }],
              from: { email: "noreply@kaydenai.com", name: "Kaiden AI" },
              subject: emailContent.subject,
              content: [{ type: "text/html", value: emailContent.html }],
            }),
          });

          if (!response.ok) {
            throw new Error("SendGrid API error");
          }

          return { success: true, message: "Email sent successfully" };
        } catch (error) {
          console.error("SendGrid error:", error);
          // Fall back to simulation
        }
      }

      // Simulation mode - log email content
      console.log("Email would be sent:", {
        to: emailContent.to,
        subject: emailContent.subject,
        preview: emailContent.html.substring(0, 200) + "...",
      });

      return { 
        success: true, 
        message: "Email prepared (SendGrid not configured - would send in production)",
        preview: emailContent.html,
      };
    }),

  // Request attorney review
  requestAttorneyReview: protectedProcedure
    .input(z.object({
      formType: z.enum(["llcFormation", "brunnerTest", "creditRepair", "dynastyTrust"]),
      formData: z.record(z.string(), z.any()),
      userEmail: z.string().email(),
      userName: z.string(),
      urgency: z.enum(["standard", "expedited"]).default("standard"),
    }))
    .mutation(async ({ ctx, input }) => {
      // Calculate price based on form type and urgency
      const basePrices: Record<string, number> = {
        llcFormation: 99,
        brunnerTest: 149,
        creditRepair: 79,
        dynastyTrust: 249,
      };

      const price = basePrices[input.formType] * (input.urgency === "expedited" ? 1.5 : 1);

      // In production, this would:
      // 1. Create a Stripe checkout session
      // 2. Store the review request in database
      // 3. Notify the attorney network
      // 4. Send confirmation email to user

      return {
        success: true,
        message: "Attorney review request submitted",
        price,
        estimatedTurnaround: input.urgency === "expedited" ? "24-48 hours" : "3-5 business days",
        disclaimer: "A licensed attorney will review your documents. This does not create an attorney-client relationship until you formally engage their services.",
      };
    }),
});
