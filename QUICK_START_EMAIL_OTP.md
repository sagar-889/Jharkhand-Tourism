# ⚡ Quick Start: Email OTP Setup

## 🚀 5-Minute Setup

### Step 1: Get Gmail App Password (2 minutes)
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" → "Other (Custom name)"
3. Enter "Jharkhand Tourism"
4. Copy the 16-character password

### Step 2: Configure Environment (1 minute)
Add to `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

### Step 3: Test Configuration (1 minute)
```bash
npm run test-email
```

### Step 4: Start Application (1 minute)
```bash
npm run dev
```

---

## 📧 API Quick Reference

### Send OTP
```typescript
POST /api/auth/send-otp
{
  "email": "user@example.com",
  "type": "login" // or "signup"
}
```

### Verify OTP
```typescript
POST /api/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456",
  "type": "login",
  "userData": { ... } // for signup only
}
```

---

## 🔧 Frontend Update (Required)

### Change Input Field:
```tsx
// OLD
<input type="tel" placeholder="Mobile Number" />

// NEW
<input type="email" placeholder="Email Address" />
```

### Update API Call:
```typescript
// OLD
fetch('/api/auth/send-otp', {
  body: JSON.stringify({ mobile, type })
})

// NEW
fetch('/api/auth/send-otp', {
  body: JSON.stringify({ email, type })
})
```

### Update Validation:
```typescript
// OLD
const isValid = /^[6-9]\d{9}$/.test(mobile)

// NEW
const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid login" | Use App Password, not regular password |
| Email not received | Check spam folder |
| Connection timeout | Check internet, try port 465 |
| OTP expired | Valid for 10 minutes, request new one |

---

## 📚 Full Documentation

- **Setup Guide:** `EMAIL_SETUP_GUIDE.md`
- **Migration Guide:** `MIGRATION_TWILIO_TO_EMAIL.md`
- **Implementation Details:** `EMAIL_OTP_IMPLEMENTATION.md`

---

## ✅ Checklist

- [ ] Get Gmail App Password
- [ ] Add EMAIL_USER and EMAIL_PASSWORD to .env
- [ ] Run `npm run test-email`
- [ ] Update frontend (mobile → email)
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Check spam folder
- [ ] Deploy!

---

**Need Help?** Run `npm run test-email` to diagnose issues.
