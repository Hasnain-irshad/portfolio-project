import nodemailer from 'nodemailer';
import { Resend } from 'resend';

/**
 * Dual-mode email sender:
 * - If RESEND_API_KEY is set → uses Resend HTTP API (works on Render/cloud)
 * - Otherwise → uses nodemailer SMTP (works locally)
 */

// ─── Resend (HTTP) mode ──────────────────────────────────────────────
const sendViaResend = async (to, subject, htmlContent) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Use the verified Resend "from" address.
    // Free tier: onboarding@resend.dev
    // Custom domain: you@yourdomain.com
    const fromAddress = process.env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>';

    console.log(`📨 [Resend] Sending email to ${to} | Subject: ${subject}`);

    const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html: htmlContent,
        reply_to: process.env.EMAIL_USER // so replies come to your Gmail
    });

    if (error) {
        console.error('❌ [Resend] Error:', error);
        throw new Error(error.message || 'Resend email failed');
    }

    console.log('✅ [Resend] Email sent. ID:', data?.id);
    return data;
};

// ─── Nodemailer SMTP mode (local dev) ────────────────────────────────
const sendViaSMTP = async (to, subject, htmlContent) => {
    const port = Number(process.env.EMAIL_PORT) || 587;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port,
        secure: port === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 30000
    });

    console.log(`📨 [SMTP] Sending email to ${to} via ${process.env.EMAIL_HOST || 'smtp.gmail.com'}:${port}`);

    const result = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent
    });

    console.log('✅ [SMTP] Email sent. Message ID:', result.messageId);
    return result;
};

// ─── Public API ──────────────────────────────────────────────────────
/**
 * Send email – automatically picks the right transport
 */
export const sendEmail = async (to, subject, htmlContent) => {
    try {
        if (process.env.RESEND_API_KEY) {
            return await sendViaResend(to, subject, htmlContent);
        } else {
            return await sendViaSMTP(to, subject, htmlContent);
        }
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};

/**
 * Send contact form notification to admin
 */
export const sendContactNotification = async (adminEmail, contactData) => {
    const { name, email, subject, message } = contactData;

    const htmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Received at: ${new Date().toLocaleString()}</small></p>
    `;

    return sendEmail(adminEmail, `New Contact: ${subject}`, htmlContent);
};

/**
 * Send confirmation email to user
 */
export const sendContactConfirmation = async (userEmail, name) => {
    const htmlContent = `
        <h2>Thank You for Contacting Me!</h2>
        <p>Hi ${name},</p>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p>${process.env.PORTFOLIO_OWNER_NAME || 'Hasnain Irshad'}</p>
    `;

    return sendEmail(userEmail, 'We Received Your Message', htmlContent);
};
