# Backend Configuration Setup Complete! ✅

Your Jharkhand Tourism application is now configured to use a separate backend deployment.

---

## 📦 What Was Created

### Configuration Files
1. **`lib/config.ts`** - Centralized API configuration system
2. **`lib/hooks/useApi.ts`** - Custom React hook for API calls
3. **`middleware.ts`** - CORS middleware for cross-origin requests
4. **`app/api/health/route.ts`** - Health check endpoint

### Deployment Files
5. **`render.yaml`** - Infrastructure-as-code for Render deployment
6. **`RENDER_DEPLOYMENT.md`** - Complete Render deployment guide

### Documentation
7. **`BACKEND_CONFIGURATION.md`** - Full configuration guide
8. **`EXAMPLE_API_USAGE.md`** - Code examples and patterns
9. **`BACKEND_SETUP_SUMMARY.md`** - Quick reference
10. **`README.md`** - Updated main README with backend info

### Testing
11. **`scripts/test-backend.js`** - Backend connection test script

### Environment Variables
12. Updated **`.env`** with `NEXT_PUBLIC_API_URL`
13. Updated **`.env.example`** with documentation

---

## 🎯 Current Configuration

Your `.env` file is configured to use the Render backend:

```env
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```

This means:
- ✅ All API calls will be directed to your Render backend
- ✅ Frontend can be deployed anywhere (Vercel, Netlify, etc.)
- ✅ Backend handles all data, authentication, and business logic
- ✅ CORS is configured to allow cross-origin requests

---

## 🚀 How to Use

### Option 1: Use the Custom Hook (Recommended)

```typescript
import { useApi } from '@/lib/hooks/useApi'

function MyComponent() {
  const { post, loading, error } = useApi()
  
  const handleLogin = async () => {
    await post('/api/auth/login', { email, password })
  }
  
  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Loading...' : 'Login'}
    </button>
  )
}
```

### Option 2: Use Helper Functions

```typescript
import { getApiUrl, createFetchOptions } from '@/lib/config'

const response = await fetch(
  getApiUrl('/api/auth/login'),
  createFetchOptions({
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
)
```

### Option 3: Existing Code Works Automatically

Your existing code with relative paths (`/api/*`) will automatically work because the configuration system intercepts and converts them to full URLs when `NEXT_PUBLIC_API_URL` is set.

---

## 🧪 Testing

### Test Backend Connection

```bash
# Test with current configuration
npm run test-backend

# Test specific backend
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com npm run test-backend
```

### Manual Testing

```bash
# Health check
curl https://jharkhand-tourism-li3w.onrender.com/api/health

# Test places endpoint
curl https://jharkhand-tourism-li3w.onrender.com/api/public/places

# Test with authentication
curl -X POST https://jharkhand-tourism-li3w.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 📋 Next Steps

### 1. Deploy Backend to Render

If not already deployed:

```bash
# Push to GitHub
git add .
git commit -m "Add backend configuration"
git push origin main

# Then deploy on Render dashboard
# Or use render.yaml for automatic deployment
```

### 2. Verify Backend is Running

Check the Render dashboard:
- Build logs for any errors
- Deploy logs for startup issues
- Environment variables are all set

### 3. Test Backend Endpoints

Once deployed, test the health endpoint:
```bash
curl https://jharkhand-tourism-li3w.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Jharkhand Tourism API is running",
  "timestamp": "2026-01-13T...",
  "environment": "production",
  "version": "1.0.0"
}
```

### 4. Deploy Frontend

Deploy your frontend to Vercel, Netlify, or any platform:

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Environment Variables to Set:**
- `NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- All other public variables

### 5. Update CORS Origins

If deploying frontend to a new domain, update `middleware.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://jharkhand-tourism-li3w.onrender.com',
  'https://your-frontend-domain.vercel.app', // Add this
]
```

Then redeploy the backend.

---

## 🔧 Configuration Options

### Same Deployment (Monolithic)

Frontend and backend together:
```env
NEXT_PUBLIC_API_URL=
```

### Separate Deployments

Frontend on Vercel, backend on Render:
```env
# Frontend .env (Vercel)
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com

# Backend .env (Render)
NEXTAUTH_URL=https://jharkhand-tourism-li3w.onrender.com
```

### Local Development with Remote Backend

Develop locally but use production backend:
```env
# .env.local
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```

---

## 🐛 Troubleshooting

### Backend Returns 503

**Cause**: Render free tier spins down after 15 minutes of inactivity

**Solution**:
1. Wait 30-60 seconds for cold start
2. Refresh the page
3. Use [UptimeRobot](https://uptimerobot.com/) to keep it awake (free)

### CORS Errors in Browser

**Cause**: Frontend domain not in allowed origins

**Solution**:
1. Open `middleware.ts`
2. Add your frontend URL to `allowedOrigins`
3. Redeploy backend

### Authentication Not Working

**Cause**: Cookies not being sent cross-origin

**Solution**:
1. Verify `withCredentials: true` in `lib/config.ts`
2. Check `NEXTAUTH_URL` matches backend URL
3. Ensure CORS allows credentials (already configured)

### API Calls Return 404

**Cause**: Backend URL incorrect or endpoint doesn't exist

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check endpoint exists on backend
3. Test with curl: `curl https://jharkhand-tourism-li3w.onrender.com/api/health`

---

## 📚 Documentation Reference

- **[BACKEND_CONFIGURATION.md](BACKEND_CONFIGURATION.md)** - Complete configuration guide
- **[EXAMPLE_API_USAGE.md](EXAMPLE_API_USAGE.md)** - Code examples
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Render deployment guide
- **[README.md](README.md)** - Main project documentation

---

## 🎉 Summary

Your application now has:

✅ Flexible backend configuration system
✅ Support for same-deployment or separate deployments
✅ CORS middleware for cross-origin requests
✅ Custom React hook for API calls
✅ Helper functions for fetch requests
✅ Health check endpoint
✅ Comprehensive documentation
✅ Testing scripts
✅ Render deployment configuration

**Backend URL**: https://jharkhand-tourism-li3w.onrender.com

All API endpoints are available at: `https://jharkhand-tourism-li3w.onrender.com/api/*`

---

## 🚀 Ready to Deploy!

1. Commit and push your changes
2. Deploy backend to Render (if not already)
3. Deploy frontend to Vercel/Netlify
4. Test the connection
5. Update CORS if needed
6. You're live! 🎊

---

**Need help?** Check the documentation files or test with:
```bash
npm run test-backend
```

Good luck with your deployment! 🚀
