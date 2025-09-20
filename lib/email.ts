import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Do not fail on invalid certs for private email providers
    rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false'
  }
})

export async function sendMail(options: { to: string; subject: string; html: string }) {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com'
  await transporter.sendMail({ from, ...options })
}



