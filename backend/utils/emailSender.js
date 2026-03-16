import nodemailer from 'nodemailer';

/**
 * Create a reusable transporter with retry-friendly settings.
 * Uses port 587 + STARTTLS by default (works more reliably on cloud
 * platforms like Render where port 465 SSL can time out).
 */
const createTransporter = () => {
    const port = Number(process.env.EMAIL_PORT) || 587;
    const secure = port === 465; // true only for implicit TLS (465)

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port,
        secure,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        // Generous timeouts for cloud environments
        connectionTimeout: 30000,  // 30 seconds to establish connection
        greetingTimeout: 30000,    // 30 seconds for SMTP greeting
        socketTimeout: 60000,      // 60 seconds for socket inactivity
        // TLS options
        tls: {
            // Do not fail on self-signed certs (some cloud proxies use them)
            rejectUnauthorized: false
        },
        // Use connection pooling so multiple emails reuse the same connection
        pool: true,
        maxConnections: 3
    });
};

/**
 * Send email with automatic retry
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} htmlContent - HTML email body
 * @param {Number} retries - Number of retry attempts (default 2)
 */
export const sendEmail = async (to, subject, htmlContent, retries = 2) => {
    let lastError;

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            console.log(`📨 [Attempt ${attempt}] Sending email to ${to} with subject: ${subject}`);
            console.log(`🔐 Using email account: ${process.env.EMAIL_USER} via ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`);

            const transporter = createTransporter();

            const mailOptions = {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to,
                subject,
                html: htmlContent
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully. Message ID:', result.messageId);

            // Close the pooled connection
            transporter.close();
            return result;
        } catch (error) {
            lastError = error;
            console.error(`❌ [Attempt ${attempt}] Error sending email:`, error.message);

            if (attempt <= retries) {
                const delay = attempt * 3000; // 3s, 6s back-off
                console.log(`🔄 Retrying in ${delay / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    console.error('❌ All retry attempts failed. Last error:', lastError?.message);
    throw lastError;
};

/**
 * Send contact form notification email
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
