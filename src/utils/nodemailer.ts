import { resMessages } from './resMessages';
import { appConfig } from '../config/appConfig';
import nodemailer, { Transporter } from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const createTransporter = (): Transporter => {
  return nodemailer.createTransport(
    smtpTransport({
      host: appConfig.smtp.smtpHost,
      port: +appConfig.smtp.smtpPort,
      secure: false,
      requireTLS: true,
      tls: {
        rejectUnauthorized: true,
      },
      auth: {
        type: 'OAuth2',
        user: appConfig.smtp.smtpUser,
        pass: appConfig.smtp.smtpPass,
      },
    })
  );
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: appConfig.smtp.smtpUser,
    ...options,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    throw new Error(resMessages.FAILED_TO_SEND_EMAIL);
  }
};
