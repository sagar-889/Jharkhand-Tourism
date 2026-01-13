# Backend Configuration - Setup Complete ✅

Your Jharkhand Tourism app is now configured to use the Render backend.

---

## What Was Done

### 1. Created Configuration System
- **`lib/config.ts`** - Centralized API configuration
- **`lib/hooks/useApi.ts`** - Custom hook for API calls
- **`middleware.ts`** - CORS middleware for cross-origin requests

### 2. Updated Environment Variables
- **`.env`** - Added `NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com`
- **`.env.example`** - Added documentation for the new variable

### 3. Created Documentation
- **`BACKEND_CONFIGURATION.md`** - Complete configuration guide
- **`EXAMPLE_API_USAGE.md`** - Code examples and patterns
- **`BACKEND_SETUP_SUMMARY.md`** - This file

### 4. Deployment Files
- **`render.yaml`** - Infrastructure-as-code for Render
- **`RENDER_DEPLOYMENT.md`** - Render-specific deployment guide

---

## Current Configuration

```env
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```

This means:
- ✅ All API calls will go to your Render backend
- ✅ Frontend can be deployed anywhere (Vercel, Netlify, etc.)
- ✅ Backend handles all data, authentication, and business logic

---

## How to Use

### Option 1: Use the Hook (Recommended)
```typescript
import { useApi } from '@/lib/hooks/useApi'

const { post, loading, error } = useApi()
await post('/api/auth/login', { email, password })
```

### Option 2: Use Helper Functions
```typescript
import { getApiUrl, createFetchOptions } from '@/lib/config'

const response = await fetch(
  getApiUrl('/api/auth/login'),
  createFetchOptions({ method: 'POST', body: JSON.stringify(data) })
)
```

---

## Next Steps

### 1. Verify Backend is Running
```bash
curl https://jharkhand-tourism-li3w.onrender.com/api/health
```

If you get a 503 error:
- Wait 30-60 seconds (free tier cold start)
- Check Render dashboard for errors
- Verify environment variables are set

### 2. Test API Endpoints
Try these endpoints:
- `GET /api/public/places` - List places
- `GET /api/public/hotels` - List hotels
- `GET /api/public/restaurants` - List restaurants
- `GET /api/public/events` - List events

### 3. Update Components (Optional)
Your existing components will work as-is because they use relative paths (`/api/*`).

The configuration system automatically converts them to full URLs when `NEXT_PUBLIC_API_URL` is set.

To explicitly use the new system:
```typescript
// Before
fetch('/api/places')

// After (optional, but recommended)
import { getApiUrl } from '@/lib/config'
fetch(getApiUrl('/api/places'))
```

### 4. Deploy Frontend
You can now deploy your frontend to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Render** (separate service)
- Any static hosting

Just ensure `NEXT_PUBLIC_API_URL` is set in the deployment environment variables.

---

## Deployment Scenarios

### Scenario A: Everything on Render (Current)
```env
# No need to set NEXT_PUBLIC_API_URL
# Or set it to empty
NEXT_PUBLIC_API_URL=
```
- Single deployment
- Simplest setup
- No CORS issues

### Scenario B: Frontend on Vercel, Backend on Render
```env
# Vercel environment variables
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```
- Faster frontend (Vercel CDN)
- Backend on Render
- CORS configured via middleware.ts

### Scenario C: Local Development with Render Backend
```env
# .env.local
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```
- Develop locally
- Use production backend
- No need to run backend locally

---

## Troubleshooting

### Backend Returns 503
**Cause**: Render free tier spins down after inactivity

**Solution**: 
1. Wait 30-60 seconds for cold start
2. Refresh the page
3. Use UptimeRobot to keep it awake

### CORS Errors
**Cause**: Frontend domain not in allowed origins

**Solution**: 
1. Open `middleware.ts`
2. Add your frontend URL to `allowedOrigins` array
3. Redeploy backend

### Authentication Not Working
**Cause**: Cookies not being sent cross-origin

**Solution**:
1. Verify `withCredentials: true` in config
2. Check `NEXTAUTH_URL` matches backend URL
3. Ensure CORS allows credentials

### API Calls Fail
**Cause**: Backend URL incorrect or backend down

**Solution**:
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Test backend: `curl https://jharkhand-tourism-li3w.onrender.com/api/health`
3. Check Render dashboard for errors

---

## Environment Variables Checklist

### Backend (Render)
- [x] `DATABASE_URL`
- [x] `JWT_SECRET`
- [x] `NEXTAUTH_SECRET`
- [x] `NEXTAUTH_URL`
- [x] `EMAIL_USER`
- [x] `EMAIL_PASSWORD`
- [x] `STRIPE_SECRET_KEY`
- [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Frontend (Vercel/Netlify)
- [x] `NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com`
- [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (same as backend)

---

## Testing Checklist

- [ ] Backend is accessible (no 503 error)
- [ ] Health endpoint responds: `/api/health`
- [ ] Public endpoints work: `/api/public/places`
- [ ] Authentication works: `/api/auth/login`
- [ ] Protected routes require auth
- [ ] CORS headers present in responses
- [ ] Frontend can make API calls
- [ ] Cookies/tokens are sent correctly

---

## Quick Commands

```bash
# Test backend health
curl https://jharkhand-tourism-li3w.onrender.com/api/health

# Test places endpoint
curl https://jharkhand-tourism-li3w.onrender.com/api/public/places

# Test with authentication
curl -X POST https://jharkhand-tourism-li3w.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Check CORS headers
curl -I -X OPTIONS https://jharkhand-tourism-li3w.onrender.com/api/places \
  -H "Origin: http://localhost:3000"
```

---

## Files Created

1. `lib/config.ts` - API configuration
2. `lib/hooks/useApi.ts` - API hook
3. `middleware.ts` - CORS middleware
4. `render.yaml` - Render deployment config
5. `BACKEND_CONFIGURATION.md` - Full guide
6. `EXAMPLE_API_USAGE.md` - Code examples
7. `RENDER_DEPLOYMENT.md` - Render guide
8. `BACKEND_SETUP_SUMMARY.md` - This file

---

## Support

- **Backend URL**: https://jharkhand-tourism-li3w.onrender.com
- **API Endpoints**: https://jharkhand-tourism-li3w.onrender.com/api/*
- **Render Dashboard**: https://dashboard.render.com/
- **Documentation**: See `BACKEND_CONFIGURATION.md`

---

## Summary

Your app is now configured to use Render as the backend! 🎉

The configuration is flexible:
- Works with same deployment (monolithic)
- Works with separate deployments (frontend + backend)
- Easy to switch between configurations
- No code changes needed in most cases

Just set `NEXT_PUBLIC_API_URL` and you're good to go!

---

**Need help?** Check the documentation files or the Render dashboard logs.
