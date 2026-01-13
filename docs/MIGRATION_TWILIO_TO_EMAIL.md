# 🔄 Migration Guide: Twilio SMS OTP → Email OTP

This document outlines the changes made to replace Twilio SMS OTP with Email OTP using Nodemailer.

## 📊 Summary of Changes

### ✅ Backend Changes (Completed)

1. **New File Created:**
   - `lib/mailer.ts` - Email OTP functionality using Nodemailer

2. **Files Modified:**
   - `app/api/auth/send-otp/route.ts` - Now sends OTP via email
   - `app/api/auth/verify-otp/route.ts` - Now verifies email OTP
   - `.env` - Updated with email configuration
   - `.env.example` - Updated template
   - `package.json` - Added nodemailer dependencies

3. **Files Deprecated (can be removed):**
   - `lib/twilio.ts` - No longer used
   - `TWILIO_SETUP_GUIDE.md` - Replaced by EMAIL_SETUP_GUIDE.md
   - `MOBILE_AUTH_SETUP.md` - No longer relevant

### ⚠️ Frontend Changes (Required)

The following frontend components need to be updated to use email instead of mobile:

#### 1. Authentication Forms
**Files to update:**
- `app/auth/page.tsx` (or wherever your login/signup forms are)
- Any mobile input fields → Change to email input fields
- Mobile validation → Change to email validation

**Changes needed:**
```typescript
// OLD (Mobile-based)
const [mobile, setMobile] = useState('')

// NEW (Email-based)
const [email, setEmail] = useState('')
```

```typescript
// OLD API call
const response = await fetch('/api/auth/send-otp', {
  method: 'POST',
  body: JSON.stringify({ mobile, type: 'login' })
})

// NEW API call
const response = await fetch('/api/auth/send-otp', {
  method: 'POST',
  body: JSON.stringify({ email, type: 'login' })
})
```

#### 2. Input Validation
```typescript
// OLD (Mobile validation)
const validateMobile = (mobile: string) => {
  return /^[6-9]\d{9}$/.test(mobile)
}

// NEW (Email validation)
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

#### 3. UI Text Updates
- "Enter Mobile Number" → "Enter Email Address"
- "Mobile" → "Email"
- "Phone Number" → "Email Address"
- "We'll send an OTP to your mobile" → "We'll send an OTP to your email"

---

## 🔧 API Changes

### Send OTP Endpoint
**Endpoint:** `POST /api/auth/send-otp`

**OLD Request:**
```json
{
  "mobile": "+919876543210",
  "type": "login"
}
```

**NEW Request:**
```json
{
  "email": "user@example.com",
  "type": "login"
}
```

**NEW Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent to your email successfully",
  "email": "user@example.com",
  "tempOtp": "123456",  // Only for signup
  "tempOtpExpiry": "2026-01-13T12:00:00.000Z"  // Only for signup
}
```

### Verify OTP Endpoint
**Endpoint:** `POST /api/auth/verify-otp`

**OLD Request:**
```json
{
  "mobile": "+919876543210",
  "otp": "123456",
  "type": "login"
}
```

**NEW Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "type": "login",
  "tempOtp": "123456",  // Only for signup
  "tempOtpExpiry": "2026-01-13T12:00:00.000Z",  // Only for signup
  "userData": {  // Only for signup
    "name": "John Doe",
    "password": "hashedpassword",
    "role": "tourist"
  }
}
```

---

## 📝 Database Schema Changes

### User Model
The User model should now prioritize email over mobile:

**Before:**
```typescript
{
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  // ...
}
```

**After:**
```typescript
{
  email: { type: String, required: true, unique: true },
  mobile: { type: String },  // Optional now
  // ...
}
```

**Note:** You may need to update existing user documents if you have data.

---

## 🔐 Environment Variables

### Removed (Twilio):
```env
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
TWILIO_VERIFY_SERVICE_SID=...
```

### Added (Email):
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## ✅ Testing Checklist

### Backend Testing:
- [ ] Install nodemailer: `npm install nodemailer @types/nodemailer`
- [ ] Configure email credentials in `.env`
- [ ] Test email configuration: `npm run test-email`
- [ ] Verify OTP email is received
- [ ] Test OTP verification flow
- [ ] Check OTP expiry (10 minutes)
- [ ] Test welcome email on signup

### Frontend Testing:
- [ ] Update all forms to use email input
- [ ] Update API calls to send email instead of mobile
- [ ] Update validation to check email format
- [ ] Update UI text and labels
- [ ] Test signup flow end-to-end
- [ ] Test login flow end-to-end
- [ ] Test error handling (invalid email, expired OTP, etc.)
- [ ] Test on multiple browsers

---

## 🚀 Deployment Steps

1. **Update Environment Variables:**
   ```bash
   # Remove Twilio variables
   # Add Email variables
   EMAIL_USER=your-production-email@gmail.com
   EMAIL_PASSWORD=your-production-app-password
   ```

2. **Update Frontend Code:**
   - Replace all mobile-related code with email
   - Update form validations
   - Update UI text

3. **Test Thoroughly:**
   - Test signup with new email
   - Test login with existing users
   - Verify OTP delivery
   - Check spam folder

4. **Deploy:**
   ```bash
   npm run build
   npm start
   ```

5. **Monitor:**
   - Check email delivery rates
   - Monitor error logs
   - Watch for failed OTP attempts

---

## 💡 Benefits of Email OTP

### Advantages:
✅ **Cost-effective** - No SMS charges
✅ **Global reach** - Works worldwide without country codes
✅ **No phone required** - Users don't need mobile phones
✅ **Better deliverability** - Email is more reliable than SMS
✅ **Rich formatting** - Can send branded HTML emails
✅ **Additional features** - Can send welcome emails, notifications, etc.

### Considerations:
⚠️ **Spam folder** - OTP emails might go to spam
⚠️ **Email delays** - Might take longer than SMS
⚠️ **Email access** - Users need email access
⚠️ **Sending limits** - Free email accounts have daily limits

---

## 🔄 Rollback Plan

If you need to rollback to Twilio SMS:

1. Restore `lib/twilio.ts`
2. Revert API route changes
3. Restore Twilio environment variables
4. Revert frontend changes
5. Redeploy

**Backup files are available in git history.**

---

## 📞 Support

For issues or questions:
1. Check `EMAIL_SETUP_GUIDE.md` for email configuration
2. Run `npm run test-email` to test email setup
3. Check console logs for detailed errors
4. Review Nodemailer docs: https://nodemailer.com

---

## 📚 Related Documentation

- `EMAIL_SETUP_GUIDE.md` - Detailed email setup instructions
- `lib/mailer.ts` - Email OTP implementation
- `scripts/test-email.js` - Email testing script

---

**Migration Date:** January 13, 2026

**Status:** ✅ Backend Complete | ⚠️ Frontend Updates Required
