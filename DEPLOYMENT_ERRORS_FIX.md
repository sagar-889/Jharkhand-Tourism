# Deployment Errors - Diagnosis & Fixes

## Current Errors

### 1. 404 Error: `/api/admin/places`
**Status**: ✅ Route exists, likely a client-side routing issue

### 2. 500 Error: `/api/upload`
**Status**: ⚠️ Server error - needs investigation

### 3. 401 Error: `/api/upload` - "Invalid token"
**Status**: 🔴 **CRITICAL** - Authentication failing

---

## Root Cause: JWT_SECRET Mismatch

The "Invalid token" error occurs because:

1. **Tokens are created locally** with your local `JWT_SECRET`
2. **Tokens are verified on Vercel** with a different (or missing) `JWT_SECRET`
3. This causes all authentication to fail

---

## Solution: Set Environment Variables on Vercel

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Select your project: `jharkhand-tourism`
3. Go to: **Settings** → **Environment Variables**

### Step 2: Add/Verify These Variables

Make sure these are set **EXACTLY** as in your local `.env` file:

```env
# CRITICAL - Must match your local .env
JWT_SECRET=your_jwt_secret_from_local_env

# Database
DATABASE_URL=your_postgresql_connection_string

# NextAuth
NEXTAUTH_URL=https://jharkhand-tourism.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_ACCOUNT_ID=acct_your_stripe_account_id
```

**IMPORTANT**: Copy the exact values from your local `.env` file!

### Step 3: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **three dots** on the latest deployment
3. Click **Redeploy**

---

## Testing Authentication

### Debug Endpoint Created

I've created a debug endpoint to test authentication:

**URL**: `https://your-app.vercel.app/api/debug/auth`

**Test it**:
```bash
# Get your token from localStorage in browser console
localStorage.getItem('token')

# Then test with curl or Postman
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://jharkhand-tourism.vercel.app/api/debug/auth
```

**Expected Response** (when working):
```json
{
  "hasToken": true,
  "tokenLength": 200,
  "hasJwtSecret": true,
  "jwtSecretLength": 64,
  "tokenValid": true,
  "userId": "some-user-id",
  "role": "admin"
}
```

---

## Additional Issues

### File Upload on Vercel

Vercel's serverless functions have **read-only file systems**. The `/api/upload` route tries to write files to disk, which won't work on Vercel.

**Solutions**:

1. **Use Vercel Blob Storage** (Recommended)
   - https://vercel.com/docs/storage/vercel-blob

2. **Use Cloudinary** (Free tier available)
   - Upload images to Cloudinary instead of local disk

3. **Use AWS S3** or similar cloud storage

### Quick Fix for Upload

Update `app/api/upload/route.ts` to use cloud storage instead of local filesystem.

---

## Checklist

- [ ] Set `JWT_SECRET` on Vercel (must match local)
- [ ] Set `DATABASE_URL` on Vercel
- [ ] Set all Stripe keys on Vercel
- [ ] Set email credentials on Vercel
- [ ] Redeploy after setting environment variables
- [ ] Test authentication with debug endpoint
- [ ] Implement cloud storage for file uploads
- [ ] Remove debug endpoint after testing

---

## Quick Commands

### Check if logged in (Browser Console)
```javascript
console.log('Token:', localStorage.getItem('token'))
console.log('User:', localStorage.getItem('user'))
```

### Re-login as Admin
1. Go to: `/auth?mode=login`
2. Email: `admin@jharkhand-tourism.gov.in`
3. Password: `Admin@2024`

---

## Need Help?

If errors persist after setting environment variables:
1. Check Vercel deployment logs
2. Test the debug endpoint
3. Clear browser localStorage and re-login
4. Check browser console for detailed error messages
