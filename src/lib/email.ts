import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface EmailOptions {
    to: string;
    cc?: string | string[];
    subject: string;
    html: string;
    attachments?: Array<{
        filename: string;
        content: Buffer;
    }>;
}

export const sendEmail = async (options: EmailOptions) => {
    const mailOptions = {
        from: `"Shreeji Enterprise Services" <${process.env.SMTP_USER}>`,
        to: options.to,
        cc: options.cc,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
