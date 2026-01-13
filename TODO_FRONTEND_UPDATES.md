# ✅ TODO: Frontend Updates for Email OTP

## 🎯 Overview
Backend is complete. Frontend needs to be updated to use email instead of mobile for authentication.

---

## 📋 Required Changes

### 1. Update Input Fields

#### Before (Mobile):
```tsx
<input
  type="tel"
  name="mobile"
  placeholder="Enter mobile number"
  pattern="[6-9]{1}[0-9]{9}"
  value={mobile}
  onChange={(e) => setMobile(e.target.value)}
/>
```

#### After (Email):
```tsx
<input
  type="email"
  name="email"
  placeholder="Enter email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### 2. Update State Variables

#### Before:
```typescript
const [mobile, setMobile] = useState('')
```

#### After:
```typescript
const [email, setEmail] = useState('')
```

---

### 3. Update Validation

#### Before (Mobile):
```typescript
const validateMobile = (mobile: string) => {
  const mobileRegex = /^[6-9]\d{9}$/
  if (!mobileRegex.test(mobile)) {
    setError('Please enter a valid 10-digit mobile number')
    return false
  }
  return true
}
```

#### After (Email):
```typescript
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address')
    return false
  }
  return true
}
```

---

### 4. Update API Calls - Send OTP

#### Before:
```typescript
const handleSendOTP = async () => {
  if (!validateMobile(mobile)) return
  
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      mobile: mobile.startsWith('+91') ? mobile : `+91${mobile}`,
      type: 'login' 
    })
  })
  
  const data = await response.json()
  // Handle response
}
```

#### After:
```typescript
const handleSendOTP = async () => {
  if (!validateEmail(email)) return
  
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: email.toLowerCase().trim(),
      type: 'login' 
    })
  })
  
  const data = await response.json()
  
  // For signup, store tempOtp and tempOtpExpiry
  if (data.tempOtp) {
    setTempOtp(data.tempOtp)
    setTempOtpExpiry(data.tempOtpExpiry)
  }
  
  // Handle response
}
```

---

### 5. Update API Calls - Verify OTP

#### Before:
```typescript
const handleVerifyOTP = async () => {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobile: mobile.startsWith('+91') ? mobile : `+91${mobile}`,
      otp,
      type: 'login'
    })
  })
  
  const data = await response.json()
  // Handle response
}
```

#### After:
```typescript
const handleVerifyOTP = async () => {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      otp,
      type: 'login',
      // For signup, include tempOtp and tempOtpExpiry
      ...(type === 'signup' && {
        tempOtp,
        tempOtpExpiry,
        userData: {
          name,
          password,
          role,
          // other fields
        }
      })
    })
  })
  
  const data = await response.json()
  // Handle response
}
```

---

### 6. Update UI Text

| Before | After |
|--------|-------|
| "Enter Mobile Number" | "Enter Email Address" |
| "Mobile" | "Email" |
| "Phone Number" | "Email Address" |
| "10-digit mobile number" | "Valid email address" |
| "We'll send an OTP to your mobile" | "We'll send an OTP to your email" |
| "Check your SMS" | "Check your email inbox" |
| "+91" prefix | Remove country code |

---

### 7. Update Error Messages

#### Before:
```typescript
'Mobile number is required'
'Invalid mobile number format'
'Mobile number already exists'
'No account found with this mobile number'
```

#### After:
```typescript
'Email address is required'
'Invalid email format'
'Email already exists'
'No account found with this email'
```

---

### 8. Update Signup Form

#### Before:
```tsx
<form onSubmit={handleSignup}>
  <input type="text" name="name" placeholder="Full Name" />
  <input type="tel" name="mobile" placeholder="Mobile Number" />
  <input type="email" name="email" placeholder="Email (optional)" />
  <input type="password" name="password" placeholder="Password" />
  <select name="role">
    <option value="tourist">Tourist</option>
    <option value="travel_guide">Travel Guide</option>
  </select>
  <button type="submit">Sign Up</button>
</form>
```

#### After:
```tsx
<form onSubmit={handleSignup}>
  <input type="text" name="name" placeholder="Full Name" required />
  <input type="email" name="email" placeholder="Email Address" required />
  <input type="tel" name="mobile" placeholder="Mobile Number (optional)" />
  <input type="password" name="password" placeholder="Password" required />
  <select name="role">
    <option value="tourist">Tourist</option>
    <option value="travel_guide">Travel Guide</option>
  </select>
  <button type="submit">Sign Up</button>
</form>
```

---

## 📁 Files to Update

### Priority 1 (Critical):
- [ ] `app/auth/page.tsx` - Main authentication page
- [ ] `app/admin-login/page.tsx` - Admin login page
- [ ] Any signup/login forms
- [ ] Authentication context/hooks

### Priority 2 (Important):
- [ ] User profile pages
- [ ] Account settings
- [ ] Any forms that collect user data

### Priority 3 (Optional):
- [ ] Update TypeScript interfaces
- [ ] Update form validation schemas
- [ ] Update test files

---

## 🧪 Testing Checklist

### Signup Flow:
- [ ] Enter email address
- [ ] Click "Send OTP"
- [ ] Check email inbox (and spam folder)
- [ ] Receive OTP email with 6-digit code
- [ ] Enter OTP
- [ ] Complete signup
- [ ] Receive welcome email
- [ ] Redirect to dashboard

### Login Flow:
- [ ] Enter registered email
- [ ] Click "Send OTP"
- [ ] Check email inbox
- [ ] Receive OTP email
- [ ] Enter OTP
- [ ] Login successful
- [ ] Redirect to dashboard

### Error Handling:
- [ ] Invalid email format
- [ ] Email already exists (signup)
- [ ] Email not found (login)
- [ ] Invalid OTP
- [ ] Expired OTP (after 10 minutes)
- [ ] Network errors

### Edge Cases:
- [ ] Email with uppercase letters
- [ ] Email with spaces
- [ ] Very long email
- [ ] Special characters in email
- [ ] Multiple OTP requests
- [ ] OTP resend functionality

---

## 🎨 UI/UX Improvements

### Recommended Changes:
1. **Email Input Icon:**
   ```tsx
   <Mail className="w-5 h-5" /> {/* Lucide React icon */}
   ```

2. **Better Error Messages:**
   ```tsx
   {error && (
     <div className="text-red-500 text-sm flex items-center gap-2">
       <AlertCircle className="w-4 h-4" />
       {error}
     </div>
   )}
   ```

3. **Loading States:**
   ```tsx
   <button disabled={loading}>
     {loading ? 'Sending OTP...' : 'Send OTP'}
   </button>
   ```

4. **Success Messages:**
   ```tsx
   {success && (
     <div className="text-green-500 text-sm flex items-center gap-2">
       <CheckCircle className="w-4 h-4" />
       OTP sent to your email! Check your inbox.
     </div>
   )}
   ```

5. **Spam Folder Notice:**
   ```tsx
   <p className="text-sm text-gray-500">
     Didn't receive the email? Check your spam folder.
   </p>
   ```

---

## 🔍 Example: Complete Login Component

```tsx
'use client'

import { useState } from 'react'
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          type: 'login'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('OTP sent to your email!')
        setStep('otp')
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          otp,
          type: 'login'
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and redirect
        localStorage.setItem('token', data.token)
        window.location.href = `/dashboard/${data.user.role}`
      } else {
        setError(data.error || 'Invalid OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {step === 'email' ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 text-green-500 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter OTP
              </label>
              <p className="text-sm text-gray-500 mb-2">
                We sent a 6-digit code to {email}
              </p>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Didn't receive? Check spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-blue-600 hover:underline"
                >
                  resend OTP
                </button>
              </p>
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
```

---

## ✅ Completion Checklist

- [ ] All input fields updated (mobile → email)
- [ ] All state variables updated
- [ ] All validation functions updated
- [ ] All API calls updated
- [ ] All UI text updated
- [ ] All error messages updated
- [ ] Signup flow tested
- [ ] Login flow tested
- [ ] Error handling tested
- [ ] Email delivery verified
- [ ] Welcome email verified
- [ ] Spam folder checked
- [ ] Mobile responsive tested
- [ ] Cross-browser tested

---

## 📞 Need Help?

- Check `EMAIL_SETUP_GUIDE.md` for backend setup
- Check `MIGRATION_TWILIO_TO_EMAIL.md` for detailed migration guide
- Run `npm run test-email` to test email configuration
- Check console logs for API errors

---

**Estimated Time:** 1-2 hours

**Difficulty:** Easy to Medium

**Status:** ⚠️ Pending Frontend Updates
