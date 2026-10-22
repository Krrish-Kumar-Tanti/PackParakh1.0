// ============================================================================
// PackParakh (पैक-परख) — Free Multi-Channel Email Service
// Ministry of Consumer Affairs, Food & Public Distribution | Legal Metrology PCR 2011
// Author: Gitansh (Backend Lead)
// ============================================================================

import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { toReferenceSlug } from '../utils/reference';

export interface SendAcknowledgementEmailOptions {
  recipientEmail: string;
  referenceId: string;
  productName?: string;
  brandName?: string;
  pdfBuffer: Buffer;
  dueDate?: string;
}

/**
 * Dispatch asynchronous, non-blocking email with attached Acknowledgement Slip PDF.
 * Uses free Gmail App Password configured in .env.
 * Will never throw or crash the main request lifecycle if SMTP is unconfigured or fails.
 */
export async function sendAcknowledgementEmail(
  options: SendAcknowledgementEmailOptions
): Promise<boolean> {
  const { recipientEmail, referenceId, productName, brandName, pdfBuffer, dueDate } = options;

  if (!recipientEmail || !recipientEmail.includes('@')) {
    console.log(`[EmailService] Skipping email: invalid recipient '${recipientEmail}'`);
    return false;
  }

  // Check if SMTP is configured
  if (!env.SMTP_EMAIL || !env.SMTP_APP_PASSWORD) {
    console.log(
      `[EmailService] SMTP credentials not fully configured (SMTP_EMAIL/SMTP_APP_PASSWORD). Simulated email sent to: ${recipientEmail}`
    );
    return true; // Mark as queued/simulated in test/dev environments
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.SMTP_EMAIL,
        pass: env.SMTP_APP_PASSWORD,
      },
    });

    const refSlug = toReferenceSlug(referenceId);
    const verifyUrl = `https://packparakh.gov.in/verify/${refSlug}`;
    const dueFormatted = dueDate
      ? new Date(dueDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'within 7 days';

    const mailOptions = {
      from: `"Department of Consumer Affairs (Legal Metrology)" <${env.SMTP_EMAIL}>`,
      to: recipientEmail,
      subject: `[DoCA PackParakh] Grievance Acknowledgement Slip — Ref: ${referenceId}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0B1220; padding: 20px; text-align: center; border-bottom: 3px solid #DAB10E;">
            <h2 style="color: #ffffff; margin: 0; font-size: 18px; letter-spacing: 0.5px;">GOVERNMENT OF INDIA</h2>
            <p style="color: #cbd5e1; margin: 4px 0 0 0; font-size: 13px;">Ministry of Consumer Affairs, Food & Public Distribution</p>
            <p style="color: #DAB10E; margin: 4px 0 0 0; font-size: 12px; font-weight: bold;">Legal Metrology Enforcement Division</p>
          </div>

          <div style="padding: 24px; color: #1e293b;">
            <p style="font-size: 15px; line-height: 1.5;">Dear Citizen / Officer,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Your statutory packaging compliance inspection / grievance has been officially registered on the <strong>PackParakh (पैक-परख)</strong> national registry.
            </p>

            <div style="background-color: #f8fafc; border: 1px solid #DAB10E; border-radius: 6px; padding: 16px; margin: 20px 0; text-align: center;">
              <div style="font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase;">Official Reference Token</div>
              <div style="font-size: 20px; font-family: monospace; font-weight: bold; color: #0B1220; margin-top: 6px;">
                ${referenceId}
              </div>
            </div>

            <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Commodity:</td>
                <td style="padding: 8px 0; color: #0f172a;">${productName || 'Packaged Commodity'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Brand:</td>
                <td style="padding: 8px 0; color: #0f172a;">${brandName || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Statutory Due Date:</td>
                <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${dueFormatted}</td>
              </tr>
            </table>

            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;">
                <strong>Statutory Directive:</strong> Please present the attached Acknowledgement Slip along with the physical packaging at your nearest District Legal Metrology Office or SDM Directorate within 7 days.
              </p>
            </div>

            <div style="text-align: center; margin: 24px 0;">
              <a href="${verifyUrl}" style="background-color: #0B1220; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; border: 1px solid #DAB10E;">
                Track Live Case Status Online
              </a>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 24px;">
              Please find your 1-page Official Acknowledgement Slip attached with this email in PDF format.
            </p>
          </div>

          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
            PackParakh (पैक-परख) • Ministry of Consumer Affairs, Food & Public Distribution
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Acknowledgement-${refSlug}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email asynchronously in background
    transporter.sendMail(mailOptions).then(
      (info) => {
        console.log(`[EmailService] Acknowledgement email dispatched successfully to ${recipientEmail} (ID: ${info.messageId})`);
      },
      (err) => {
        console.error(`[EmailService] Failed to send email to ${recipientEmail}:`, err.message);
      }
    );

    return true;
  } catch (err) {
    console.error('[EmailService] Unexpected transporter error:', err);
    return false;
  }
}

export default {
  sendAcknowledgementEmail,
};
