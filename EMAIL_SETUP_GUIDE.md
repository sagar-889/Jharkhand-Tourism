# 📧 Email OTP Setup Guide - Nodemailer

This guide will help you set up email-based OTP authentication using Nodemailer for the Jharkhand Tourism Platform.

## 🎯 Overview

The application now uses **Email OTP** instead of SMS OTP for user verification. This is more cost-effective and reliable for most use cases.

## 📋 Prerequisites

- A valid email account (Gmail, Outlook, Yahoo, etc.)
- Access to email account settings

---

## 🔧 Setup Instructions

### Option 1: Gmail (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled

#### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter "Jharkhand Tourism" as the name
5. Click **Generate**
6. Copy the 16-character password (remove spaces)

#### Step 3: Update Environment Variables
Add to your `.env` or `.env.local` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Example:**
```env
EMAIL_USER=jharkhandtourism@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # (remove spaces: abcdefghijklmnop)
```

---

### Option 2: Outlook/Hotmail

#### Step 1: Enable App Password
1. Go to: https://account.microsoft.com/security
2. Navigate to **Advanced security options**
3. Under **App passwords**, create a new app password
4. Copy the generated password

#### Step 2: Update Environment Variables
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password
```

**Note:** Nodemailer will automatically detect Outlook and use the correct SMTP settings.

---

### Option 3: Custom SMTP Server

If you're using a different email provider, you'll need to modify `lib/mailer.ts`:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587, // or 465 for SSL
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})
```

**Common SMTP Settings:**

| Provider | Host | Port | Secure |
|----------|------|------|--------|
| Gmail | smtp.gmail.com | 587 | false |
| Outlook | smtp-mail.outlook.com | 587 | false |
| Yahoo | smtp.mail.yahoo.com | 587 | false |
| SendGrid | smtp.sendgrid.net | 587 | false |
| Mailgun | smtp.mailgun.org | 587 | false |

---

## 🧪 Testing the Setup

### 1. Test Email Sending
Create a test file `test-email.js`:

```javascript
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password',
  },
})

transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test-recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email from Jharkhand Tourism Platform',
}, (error, info) => {
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Email sent:', info.messageId)
  }
})
```

Run: `node test-email.js`

### 2. Test OTP Flow
1. Start your application: `npm run dev`
2. Go to signup/login page
3. Enter your email address
4. Click "Send OTP"
5. Check your email inbox (and spam folder)
6. Enter the 6-digit OTP
7. Complete the verification

---

## 📧 Email Templates

The application sends two types of emails:

### 1. OTP Verification Email
- **Subject:** Your Verification Code - Jharkhand Tourism
- **Content:** 6-digit OTP code
- **Validity:** 10 minutes
- **Design:** Professional HTML template with branding

### 2. Welcome Email
- **Subject:** Welcome to Jharkhand Tourism Platform!
- **Content:** Welcome message and platform features
- **Sent:** After successful signup

---

## 🔒 Security Best Practices

### For Gmail Users:
1. ✅ Always use App Passwords (never use your actual Gmail password)
2. ✅ Enable 2-Factor Authentication
3. ✅ Keep your App Password secure (don't commit to Git)
4. ✅ Revoke App Passwords you're not using

### For All Users:
1. ✅ Never commit `.env` files to version control
2. ✅ Use different credentials for development and production
3. ✅ Regularly rotate your email passwords
4. ✅ Monitor email sending logs for suspicious activity
5. ✅ Implement rate limiting to prevent abuse

---

## 🚨 Troubleshooting

### Issue 1: "Invalid login" or "Authentication failed"
**Solution:**
- Verify your email and password are correct
- For Gmail: Make sure you're using an App Password, not your regular password
- Check if 2FA is enabled (required for Gmail App Passwords)

### Issue 2: Email not received
**Solution:**
- Check spam/junk folder
- Verify the recipient email is correct
- Check email provider's sending limits
- Look at server logs for error messages

### Issue 3: "Connection timeout"
**Solution:**
- Check your internet connection
- Verify SMTP settings (host, port)
- Check if your firewall is blocking SMTP ports
- Try using port 465 with `secure: true`

### Issue 4: "Daily sending limit exceeded"
**Solution:**
- Gmail free accounts: 500 emails/day
- Outlook free accounts: 300 emails/day
- Consider using a dedicated email service (SendGrid, Mailgun) for production

### Issue 5: OTP expired
**Solution:**
- OTP is valid for 10 minutes only
- Request a new OTP if expired
- Check server time is synchronized

---

## 📊 Email Sending Limits

| Provider | Free Tier Limit | Notes |
|----------|----------------|-------|
| Gmail | 500/day | Per account |
| Outlook | 300/day | Per account |
| Yahoo | 500/day | Per account |
| SendGrid | 100/day | Free tier |
| Mailgun | 5,000/month | Free tier |

**For Production:** Consider using dedicated email services like:
- SendGrid
- Mailgun
- Amazon SES
- Postmark
- Mailjet

---

## 🔄 Migration from Twilio SMS

### Changes Made:
1. ✅ Replaced `lib/twilio.ts` with `lib/mailer.ts`
2. ✅ Updated `send-otp` API to use email instead of mobile
3. ✅ Updated `verify-otp` API to verify email OTP
4. ✅ Changed authentication flow from mobile to email
5. ✅ Added welcome email functionality
6. ✅ Updated environment variables

### Frontend Changes Needed:
- Update signup/login forms to use email input instead of mobile
- Update API calls to send `email` instead of `mobile`
- Update validation to check email format
- Update UI text from "Mobile" to "Email"

---

## 📝 Environment Variables Reference

```env
# Required for Email OTP
EMAIL_USER=your-email@gmail.com          # Your email address
EMAIL_PASSWORD=your-app-password         # App password (not regular password)

# Optional (if using custom SMTP)
EMAIL_HOST=smtp.gmail.com                # SMTP host
EMAIL_PORT=587                           # SMTP port
EMAIL_SECURE=false                       # true for 465, false for 587
```

---

## 🎨 Customizing Email Templates

Edit `lib/mailer.ts` to customize:

1. **Email Design:** Modify HTML in `sendOTPEmail` function
2. **Sender Name:** Change `from.name` field
3. **Email Subject:** Update `subject` field
4. **OTP Validity:** Change expiry time in API routes
5. **Welcome Email:** Customize `sendWelcomeEmail` function

---

## 📞 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test email sending with the test script above
4. Check your email provider's documentation
5. Review Nodemailer documentation: https://nodemailer.com

---

## ✅ Checklist

Before going live:
- [ ] Email credentials configured in `.env`
- [ ] Test OTP sending and receiving
- [ ] Test OTP verification
- [ ] Check spam folder delivery
- [ ] Verify email templates display correctly
- [ ] Test on multiple email providers
- [ ] Set up rate limiting
- [ ] Configure production email service
- [ ] Monitor email delivery rates
- [ ] Set up email logging

---

**Last Updated:** January 2026

**Version:** 1.0.0
