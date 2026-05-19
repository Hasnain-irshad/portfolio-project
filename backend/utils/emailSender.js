import nodemailer from 'nodemailer';
import { Resend } from 'resend';

/**
 * Multi-mode email sender. Transport is chosen automatically:
 *   1. BREVO_API_KEY  → Brevo HTTP API   (recommended — free, works on Render,
 *                                         can send to anyone with a verified
 *                                         single sender; no domain required)
 *   2. RESEND_API_KEY → Resend HTTP API  (needs a verified domain to email
 *                                         arbitrary recipients)
 *   3. otherwise      → nodemailer SMTP  (local dev / Gmail)
 */

// ─── Brevo (HTTP) mode ───────────────────────────────────────────────
const sendViaBrevo = async (to, subject, htmlContent, replyTo) => {
    // The sender MUST be an address verified in your Brevo account
    // (Brevo dashboard → Senders → add & verify a single email).
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;
    const senderName =
        process.env.BREVO_SENDER_NAME || process.env.PORTFOLIO_OWNER_NAME || 'Portfolio';

    if (!senderEmail) {
        throw new Error('BREVO_SENDER_EMAIL is not configured');
    }

    console.log(`📨 [Brevo] Sending email to ${to} | Subject: ${subject}`);

    const payload = {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent,
    };
    if (replyTo) {
        payload.replyTo = { email: replyTo };
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error('❌ [Brevo] Error:', response.status, errText);
        throw new Error(`Brevo email failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    console.log('✅ [Brevo] Email sent. messageId:', data?.messageId);
    return data;
};

// ─── Resend (HTTP) mode ──────────────────────────────────────────────
const sendViaResend = async (to, subject, htmlContent, replyTo) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Free tier (no domain): onboarding@resend.dev
    // Custom domain:         you@yourdomain.com
    const fromAddress = process.env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>';

    console.log(`📨 [Resend] Sending email to ${to} | Subject: ${subject}`);

    const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html: htmlContent,
        reply_to: replyTo || process.env.EMAIL_USER,
    });

    if (error) {
        console.error('❌ [Resend] Error:', error);
        throw new Error(error.message || 'Resend email failed');
    }

    console.log('✅ [Resend] Email sent. ID:', data?.id);
    return data;
};

// ─── Nodemailer SMTP mode (local dev) ────────────────────────────────
const sendViaSMTP = async (to, subject, htmlContent, replyTo) => {
    const port = Number(process.env.EMAIL_PORT) || 587;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port,
        secure: port === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 30000,
    });

    console.log(`📨 [SMTP] Sending email to ${to} via ${process.env.EMAIL_HOST || 'smtp.gmail.com'}:${port}`);

    const result = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
        replyTo: replyTo || process.env.EMAIL_USER,
    });

    console.log('✅ [SMTP] Email sent. Message ID:', result.messageId);
    return result;
};

// ─── Public API ──────────────────────────────────────────────────────
/**
 * Send email – automatically picks the right transport.
 * @param {string} to        - recipient address
 * @param {string} subject   - email subject
 * @param {string} htmlContent
 * @param {string} [replyTo] - address that "Reply" should go to
 */
export const sendEmail = async (to, subject, htmlContent, replyTo) => {
    if (!to) {
        throw new Error('No recipient address provided (check ADMIN_EMAIL / EMAIL_USER env vars)');
    }

    try {
        if (process.env.BREVO_API_KEY) {
            return await sendViaBrevo(to, subject, htmlContent, replyTo);
        } else if (process.env.RESEND_API_KEY) {
            return await sendViaResend(to, subject, htmlContent, replyTo);
        } else {
            return await sendViaSMTP(to, subject, htmlContent, replyTo);
        }
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        throw error;
    }
};

/**
 * Send contact form notification to the portfolio owner.
 * Reply-To is set to the visitor's address so the owner can reply directly.
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

    return sendEmail(adminEmail, `New Contact: ${subject}`, htmlContent, email);
};

/**
 * Send confirmation email to the visitor.
 */
export const sendContactConfirmation = async (userEmail, name) => {
    const htmlContent = `
        <h2>Thank You for Contacting Me!</h2>
        <p>Hi ${name},</p>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p>${process.env.PORTFOLIO_OWNER_NAME || 'Hasnain Irshad'}</p>
    `;

    return sendEmail(userEmail, 'We Received Your Message', htmlContent, process.env.EMAIL_USER);
};
