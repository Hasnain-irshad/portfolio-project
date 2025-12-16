import nodemailer from 'nodemailer';

/**
 * Send email using nodemailer
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} htmlContent - HTML email body
 */
export const sendEmail = async (to, subject, htmlContent) => {
    try {
        console.log(`📨 Sending email to ${to} with subject: ${subject}`);
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        console.log(`🔐 Using email account: ${process.env.EMAIL_USER}`);

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        };

        // Send email
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully. Message ID:', result.messageId);
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('Error details:', error);
        throw error;
    }
};

/**
 * Send contact form notification email
 * @param {String} adminEmail - Admin email to receive the message
 * @param {Object} contactData - Contact form data
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
 * @param {String} userEmail - User email
 * @param {String} name - User name
 */
export const sendContactConfirmation = async (userEmail, name) => {
    const htmlContent = `
        <h2>Thank You for Contacting Me!</h2>
        <p>Hi ${name},</p>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,</p>
        <p>${process.env.PORTFOLIO_OWNER_NAME || 'Your Portfolio Owner'}</p>
    `;

    return sendEmail(userEmail, 'We Received Your Message', htmlContent);
};
