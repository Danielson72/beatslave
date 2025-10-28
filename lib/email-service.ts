import { resend, RESEND_FROM, RESEND_TO } from "./resend";
import {
  generatePurchaseConfirmationEmail,
  generateAdminNotificationEmail,
} from "./email-templates";

interface SendPurchaseConfirmationParams {
  customerEmail: string;
  trackTitle: string;
  artistName: string;
  licenseType: string;
  priceCents: number;
  downloadToken: string;
  orderId: string;
}

export async function sendPurchaseConfirmation(
  params: SendPurchaseConfirmationParams
) {
  try {
    const { subject, html, text } = generatePurchaseConfirmationEmail(params);

    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: params.customerEmail,
      subject,
      html,
      text,
    });

    console.log("Purchase confirmation email sent:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send purchase confirmation email:", error);
    return { success: false, error };
  }
}

interface SendAdminNotificationParams {
  customerEmail: string;
  trackTitle: string;
  artistName: string;
  licenseType: string;
  priceCents: number;
  orderId: string;
}

export async function sendAdminNotification(
  params: SendAdminNotificationParams
) {
  try {
    const { subject, html, text } = generateAdminNotificationEmail(params);

    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: RESEND_TO,
      subject,
      html,
      text,
    });

    console.log("Admin notification email sent:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    return { success: false, error };
  }
}

