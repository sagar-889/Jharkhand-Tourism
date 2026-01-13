# 🔍 Debugging OTP Issues

## Current Error: 400 Bad Request

This means the OTP verification is failing. Let's debug it step by step.

---

## Step 1: Check Browser Console

Open your browser console (F12) and look for these logs:

```
Verifying OTP with email: your-email@gmail.com
Sending payload: { email: "...", otp: "***", type: "..." }
```

**What to check:**
- Is the email correct?
- Is the type correct (signup or login)?

---

## Step 2: Check Server Console

Look at your terminal where `npm run dev` is running. You should see:

```
Simple Verify OTP API called
Request received: { email: '...', otp: '***', type: '...', hasUserData: true/false }
Normalized email: ...
Stored OTP data: { email: '...', hasOtp: true, expiry: '...' }
Verification check: { isEmailMatch: true/false, isOtpMatch: true/false, isNotExpired: true/false }
```

**What to check:**
- Does the stored email match the provided email?
- Is the OTP match true?
- Is it not expired?

---

## Common Issues & Solutions

### Issue 1: "No OTP found in storage"

**Cause:** OTP wasn't stored when you clicked "Send OTP"

**Solution:**
1. Click "Send OTP" again
2. Wait for email
3. Then enter OTP

### Issue 2: "OTP has expired"

**Cause:** More than 10 minutes passed since OTP was sent

**Solution:**
1. Click "Send OTP" again to get a new one
2. Enter the new OTP quickly

### Issue 3: "Invalid OTP"

**Cause:** Wrong OTP entered or email mismatch

**Solution:**
1. Check the OTP in your email carefully
2. Make sure you're using the same email you sent OTP to
3. Try copying and pasting the OTP

### Issue 4: Email mismatch

**Cause:** You entered email in one field but it's checking another

**Solution:**
1. Make sure you entered your email in the form
2. For signup: Enter email in the "Mobile Number" field
3. For login: Enter email in the "Email or Mobile Number" field

---

## Testing Steps

### Test 1: Send OTP
```
1. Go to: http://localhost:3000/auth?mode=signup
2. Enter email: your-email@gmail.com (in "Mobile Number" field)
3. Click "Send OTP"
4. Check browser console for: "OTP sent to your email successfully"
5. Check server console for: "Generated OTP: 123456"
6. Check your email inbox
```

### Test 2: Verify OTP
```
1. Enter the 6-digit OTP from email
2. Click verify
3. Check browser console for: "Verifying OTP with email: ..."
4. Check server console for verification logs
```

---

## Manual Testing

If you want to test without email, you can see the OTP in the server console:

1. **Send OTP** - Look for this in server console:
   ```
   Generated OTP: 123456
   ```

2. **Copy that OTP** and enter it in the form

3. **Verify** - Should work!

---

## Debug Checklist

- [ ] Email is entered in the form
- [ ] "Send OTP" was clicked
- [ ] Email was received (check spam)
- [ ] OTP is less than 10 minutes old
- [ ] Correct OTP is entered
- [ ] Same email is used for send and verify
- [ ] Server console shows OTP stored
- [ ] Browser console shows correct email

---

## Quick Fix

If nothing works, try this:

1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies
   - Refresh page

3. **Try again:**
   - Enter email
   - Send OTP
   - Check server console for OTP
   - Enter OTP
   - Verify

---

## Still Not Working?

Check these:

1. **MongoDB running?**
   ```bash
   # Check if MongoDB is running
   # Should see mongod process
   ```

2. **Environment variables set?**
   ```bash
   # Check .env file has:
   EMAIL_USER=...
   EMAIL_PASSWORD=...
   MONGODB_URI=...
   JWT_SECRET=...
   ```

3. **Dependencies installed?**
   ```bash
   npm install
   ```

---

## Get More Info

Add this to your browser console to see what's being sent:

```javascript
// Before clicking verify, run this in console:
console.log('Form data:', {
  email: document.querySelector('input[name="email"]')?.value,
  mobile: document.querySelector('input[name="mobile"]')?.value,
  otp: document.querySelector('input[name="otp"]')?.value
})
```

---

## Contact Info

If you're still stuck:
1. Check server console logs
2. Check browser console logs
3. Share the error messages
4. Check if email was received

The detailed logging should now show exactly what's failing!
