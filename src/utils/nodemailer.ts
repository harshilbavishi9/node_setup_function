import nodemailer, { Transporter } from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { errorMessages } from './errorMessages';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const createTransporter = (): Transporter => {
  return nodemailer.createTransport(
    smtpTransport({
      host: process.env.SMTP_HOST,
      port: +(process.env.SMTP_PORT || 587),
      secure: false,
      requireTLS: true,
      tls: {
        rejectUnauthorized: true,
      },
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  );
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_USER,
    ...options,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error(errorMessages.FAILED_TO_SEND_EMAIL);
  }
};
