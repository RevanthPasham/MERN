import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === "true";

    if (!host || !user || !pass) {
      throw new Error("SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.");
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }
  return transporter;
}

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendAdminInvitation(to: string, token: string, baseUrl: string): Promise<void> {
  const setPasswordUrl = `${baseUrl.replace(/\/$/, "")}/set-password?token=${encodeURIComponent(token)}`;
  const html = `
    <p>You have been invited to join the admin panel.</p>
    <p><strong>Email:</strong> ${to}</p>
    <p>Click the link below to set your password and activate your account. This link expires in 24 hours.</p>
    <p><a href="${setPasswordUrl}" style="display:inline-block;padding:10px 20px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;">Set Password</a></p>
    <p>Or copy this URL: ${setPasswordUrl}</p>
    <p>If you did not expect this invitation, you can ignore this email.</p>
  `;
  const t = getTransporter();
  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Admin invitation - set your password",
    html,
  });
}

export async function sendOrderConfirmation(to: string, orderId: string, totalAmount: number): Promise<void> {
  const html = `
    <p>Thank you for your order!</p>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Total:</strong> ₹${totalAmount}</p>
    <p>Your order has been confirmed.</p>
  `;
  const t = getTransporter();
  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Order confirmed - ${orderId}`,
    html,
  });
}
