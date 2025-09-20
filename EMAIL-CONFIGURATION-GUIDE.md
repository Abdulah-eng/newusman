# Email Configuration Guide

## Private Email Provider Setup

Your website is now configured to work with private email providers. Here's what you need to set up in your environment variables:

### Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Email Configuration (Private Email Provider)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@yourdomain.com
SMTP_PASS=your_email_password
MAIL_FROM=your_email@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Optional: For private email providers with self-signed certificates
SMTP_TLS_REJECT_UNAUTHORIZED=false
```

### Common Private Email Provider Settings

#### Gmail (with App Password)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=your_gmail@gmail.com
```

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
MAIL_FROM=your_email@outlook.com
```

#### Custom Private Email Server
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=your_email@yourdomain.com
SMTP_PASS=your_password
MAIL_FROM=your_email@yourdomain.com
SMTP_TLS_REJECT_UNAUTHORIZED=false
```

### Configuration Features

✅ **Automatic SSL/TLS Detection**: The system automatically uses SSL for port 465 and TLS for other ports

✅ **Self-Signed Certificate Support**: Set `SMTP_TLS_REJECT_UNAUTHORIZED=false` for private servers with self-signed certificates

✅ **Fallback Email Address**: If `MAIL_FROM` is not set, it uses `SMTP_USER` as the sender

✅ **Admin Notifications**: Order notifications are sent to the `ADMIN_EMAIL` address

### Testing Your Configuration

1. Set up your environment variables
2. Restart your development server
3. Test by placing an order or using the admin panel to send test emails

### Troubleshooting

- **Authentication Failed**: Check your email credentials and ensure you're using an app password for Gmail
- **Connection Timeout**: Verify your SMTP host and port settings
- **Certificate Errors**: Set `SMTP_TLS_REJECT_UNAUTHORIZED=false` for private servers
- **Emails Not Sending**: Check your email provider's SMTP settings and firewall rules

### Security Notes

- Never commit your `.env.local` file to version control
- Use app passwords instead of your main email password when possible
- Consider using environment-specific configurations for production
