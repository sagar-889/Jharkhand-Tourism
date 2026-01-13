# 📧 Email OTP System - Complete Guide

## 🎉 Welcome!

Your Jharkhand Tourism Platform now uses **Email OTP** for authentication instead of SMS. This guide will help you get started quickly.

---

## ⚡ Quick Start (5 Minutes)

### 1. Get Gmail App Password
1. Visit: https://myaccount.google.com/apppasswords
2. Create password for "Mail"
3. Copy the 16-character code

### 2. Configure Environment
```bash
# Add to .env file
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-password
```

### 3. Test Configuration
```bash
npm run test-email
```

### 4. Start Application
```bash
npm run dev
```

**That's it!** Your email OTP system is ready. 🎉

---

## 📚 Documentation Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **QUICK_START_EMAIL_OTP.md** | Quick reference card | First time setup |
| **EMAIL_SETUP_GUIDE.md** | Detailed setup instructions | Configuration help |
| **EMAIL_OTP_IMPLEMENTATION.md** | Technical implementation | Understanding the code |
| **MIGRATION_TWILIO_TO_EMAIL.md** | Migration from Twilio | Backend changes |
| **TODO_FRONTEND_UPDATES.md** | Frontend update guide | Frontend development |
| **CHANGES_SUMMARY.md** | What changed | Overview of changes |
| **README_EMAIL_OTP.md** | This file | Getting started |

---

## 🎯 What You Get

### Professional Email Templates
- **OTP Email**: Beautiful HTML template with 6-digit code
- **Welcome Email**: Sent automatically after signup
- **Branded Design**: Jharkhand Tourism branding
- **Mobile Responsive**: Works on all devices

### Features
- ✅ 6-digit OTP generation
- ✅ 10-minute validity
- ✅ Professional HTML emails
- ✅ Welcome emails for new users
- ✅ Spam-folder friendly
- ✅ Easy to customize

### Cost Savings
- **Before (Twilio SMS):** ~$0.0075 per SMS
- **After (Email):** Free (up to 500/day with Gmail)
- **Savings:** 100% 💰

---

## 🔧 How It Works

### Signup Flow:
```
User enters email → System sends OTP → User receives email → 
User enters OTP → Account created → Welcome email sent
```

### Login Flow:
```
User enters email → System sends OTP → User receives email → 
User enters OTP → Login successful
```

### OTP Details:
- **Format:** 6 digits (100000-999999)
- **Validity:** 10 minutes
- **Delivery:** Professional HTML email
- **Security:** One-time use, deleted after verification

---

## 📧 Email Providers

### Gmail (Recommended)
- **Limit:** 500 emails/day
- **Setup:** App Password required
- **Cost:** Free
- **Guide:** See EMAIL_SETUP_GUIDE.md

### Outlook/Hotmail
- **Limit:** 300 emails/day
- **Setup:** App Password recommended
- **Cost:** Free
- **Guide:** See EMAIL_SETUP_GUIDE.md

### Production Services
For high volume, use:
- **SendGrid:** 100/day free, then paid
- **Mailgun:** 5,000/month free
- **AWS SES:** Very low cost
- **Postmark:** Reliable delivery

---

## 🧪 Testing

### Test Email Configuration:
```bash
npm run test-email
```

This will:
- ✅ Verify email credentials
- ✅ Test SMTP connection
- ✅ Send test email to yourself
- ✅ Confirm everything works

### Test Authentication Flow:
1. Start app: `npm run dev`
2. Go to signup/login page
3. Enter your email
4. Click "Send OTP"
5. Check email inbox (and spam)
6. Enter 6-digit OTP
7. Complete authentication

---

## 🎨 Customization

### Email Templates
Edit `lib/mailer.ts` to customize:
- Email design and colors
- Sender name and address
- Email subject lines
- OTP validity period
- Welcome email content

### Example:
```typescript
// Change sender name
from: {
  name: 'Your Company Name',
  address: process.env.EMAIL_USER
}

// Change OTP validity
const otpExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
```

---

## 🔐 Security

### Best Practices:
- ✅ Use App Passwords (never regular passwords)
- ✅ Enable 2-Factor Authentication
- ✅ Keep credentials in .env (not in code)
- ✅ Never commit .env to Git
- ✅ Use different credentials for dev/prod
- ✅ Implement rate limiting
- ✅ Monitor email sending logs

### OTP Security:
- ✅ 10-minute expiry
- ✅ One-time use only
- ✅ Deleted after verification
- ✅ Secure storage in database
- ✅ Email validation

---

## 🐛 Troubleshooting

### Email Not Sending?
```bash
# Run diagnostic test
npm run test-email

# Check these:
1. Email credentials correct?
2. Using App Password (not regular password)?
3. 2FA enabled on Gmail?
4. Internet connection working?
5. Check console logs for errors
```

### Email Not Received?
1. Check spam/junk folder
2. Verify email address is correct
3. Wait a few minutes (email can be delayed)
4. Check email provider's sending limits
5. Try resending OTP

### "Invalid login" Error?
- For Gmail: Use App Password, not regular password
- Enable 2-Factor Authentication first
- Create new App Password if needed
- Check EMAIL_SETUP_GUIDE.md for help

### OTP Expired?
- OTP valid for 10 minutes only
- Request new OTP
- Check server time is correct

---

## 📊 Email Limits

| Provider | Free Limit | Notes |
|----------|-----------|-------|
| Gmail | 500/day | Per account |
| Outlook | 300/day | Per account |
| Yahoo | 500/day | Per account |
| SendGrid | 100/day | Free tier |
| Mailgun | 5,000/month | Free tier |

**Tip:** For production with >500 users/day, use a dedicated email service.

---

## 🚀 Production Deployment

### Before Going Live:
1. ✅ Use production email service (SendGrid, Mailgun, etc.)
2. ✅ Set up proper email domain
3. ✅ Configure SPF and DKIM records
4. ✅ Implement rate limiting
5. ✅ Set up email monitoring
6. ✅ Test email delivery rates
7. ✅ Configure error alerts
8. ✅ Set up backup email service

### Environment Variables:
```env
# Production
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=production-password
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
```

---

## 📱 Frontend Integration

### Required Updates:
The backend is complete, but frontend needs updates:

1. **Change input fields:** mobile → email
2. **Update validation:** email format
3. **Update API calls:** send email instead of mobile
4. **Update UI text:** all references to mobile

**See:** `TODO_FRONTEND_UPDATES.md` for complete guide

---

## 💡 Tips & Tricks

### Development:
- Use your own email for testing
- Check spam folder regularly
- Use `npm run test-email` to diagnose issues
- Monitor console logs for errors

### Production:
- Use dedicated email service
- Set up email analytics
- Monitor delivery rates
- Implement retry logic
- Set up alerts for failures

### User Experience:
- Clear instructions in emails
- Professional branding
- Mobile-responsive templates
- Spam-folder friendly
- Quick delivery

---

## 📞 Support

### Quick Commands:
```bash
npm run test-email    # Test email configuration
npm run dev          # Start development server
npm run init-db      # Initialize database
```

### Documentation:
- **Setup Help:** EMAIL_SETUP_GUIDE.md
- **Migration Guide:** MIGRATION_TWILIO_TO_EMAIL.md
- **Frontend Updates:** TODO_FRONTEND_UPDATES.md
- **Implementation:** EMAIL_OTP_IMPLEMENTATION.md

### External Resources:
- Nodemailer Docs: https://nodemailer.com
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- SendGrid: https://sendgrid.com
- Mailgun: https://mailgun.com

---

## ✅ Checklist

### Setup:
- [ ] Gmail App Password created
- [ ] EMAIL_USER configured in .env
- [ ] EMAIL_PASSWORD configured in .env
- [ ] Test email sent successfully
- [ ] OTP email received
- [ ] Welcome email received

### Testing:
- [ ] Signup flow works
- [ ] Login flow works
- [ ] OTP verification works
- [ ] Email delivery confirmed
- [ ] Spam folder checked
- [ ] Error handling tested

### Production:
- [ ] Production email service configured
- [ ] Email domain set up
- [ ] SPF/DKIM configured
- [ ] Rate limiting implemented
- [ ] Monitoring set up
- [ ] Backup service configured

---

## 🎉 Success!

Your email OTP system is ready to use. Here's what you accomplished:

✅ **Cost Savings:** No more SMS charges
✅ **Better UX:** Professional branded emails
✅ **Global Reach:** Works worldwide
✅ **Easy Testing:** Free during development
✅ **Scalable:** Ready for production

**Next Steps:**
1. Configure your email credentials
2. Run `npm run test-email`
3. Update frontend code (see TODO_FRONTEND_UPDATES.md)
4. Test complete authentication flow
5. Deploy to production

---

**Need Help?** Check the documentation files or run `npm run test-email` to diagnose issues.

**Questions?** Review EMAIL_SETUP_GUIDE.md for detailed instructions.

**Ready to Deploy?** See MIGRATION_TWILIO_TO_EMAIL.md for deployment checklist.

---

**Version:** 1.0.0  
**Last Updated:** January 13, 2026  
**Status:** ✅ Backend Complete | ⚠️ Frontend Updates Required
