import nodemailer from 'nodemailer';

export const sendOrderConfirmationEmail = async ({
  customerEmail,
  orderNumber,
  totalAmount,
  items
}: {
  customerEmail: string;
  orderNumber: string;
  totalAmount: number;
  items: any[];
}) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER || 'purelis.botanical@ethereal.email';
  const smtpPass = process.env.SMTP_PASS || 'purelis2026';
  const smtpFrom = process.env.SMTP_FROM || '"PURELIS Botanical Skincare" <orders@purelis.com>';

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  const info = await transporter.sendMail({
    from: smtpFrom,
    to: customerEmail || 'customer@purelis.com',
    subject: `Order Confirmation #${orderNumber} — PURELIS Skincare`,
    html: `
      <div style="font-family: serif; color: #1C3829; padding: 24px; background: #FAF8F5; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #EAE5DA;">
        <h2 style="color: #1C3829; border-bottom: 2px solid #1C3829; padding-bottom: 12px;">Order Confirmed • #${orderNumber}</h2>
        <p style="font-size: 14px; color: #3E5244;">Thank you for your botanical order. We are carefully handcrafting and packing your items for carbon-neutral delivery.</p>
        <div style="background: #ffffff; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #EAE5DA;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>Order Reference:</strong> ${orderNumber}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Total Charged:</strong> $${Number(totalAmount).toFixed(2)}</p>
        </div>
        <h3 style="font-size: 15px; color: #1C3829; margin-top: 16px;">Purchased Items (${items?.length || 0}):</h3>
        <ul style="padding-left: 20px; font-size: 13px; color: #3E5244;">
          ${(items || []).map((i: any) => `<li style="margin-bottom: 6px;"><strong>${i.name}</strong> (Qty: ${i.quantity}) — $${Number(i.price).toFixed(2)}</li>`).join('')}
        </ul>
        <p style="margin-top: 24px; font-size: 11px; color: #7A8A7F; border-top: 1px solid #EAE5DA; padding-top: 12px;">
          PURELIS Skincare & Home • SOC2 Type I Compliant Secure Checkout • Support: concierge@purelis.com
        </p>
      </div>
    `
  });

  return { messageId: info.messageId, smtpHost };
};

export const sendOtpEmail = async (email: string, otpCode: string) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER || 'purelis.botanical@ethereal.email';
  const smtpPass = process.env.SMTP_PASS || 'purelis2026';
  const smtpFrom = process.env.SMTP_FROM || '"PURELIS Botanical Skincare" <security@purelis.com>';

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    auth: { user: smtpUser, pass: smtpPass }
  });

  await transporter.sendMail({
    from: smtpFrom,
    to: email,
    subject: `Your PURELIS Verification Code: ${otpCode}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #1C3829; background: #FAF8F5; border-radius: 8px;">
        <h2>Verify Your Email Address</h2>
        <p>Your 6-digit verification code for creating your PURELIS account is:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; background: #fff; padding: 12px 20px; display: inline-block; border-radius: 6px; border: 1px solid #EAE5DA; margin: 12px 0;">
          ${otpCode}
        </div>
        <p style="font-size: 12px; color: #6E7E73;">If you did not request this, please ignore this message.</p>
      </div>
    `
  });
};
