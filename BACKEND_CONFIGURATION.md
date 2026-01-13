# Backend Configuration Guide

This guide explains how to configure your frontend to connect to a separate backend deployment.

---

## Architecture Options

### Option 1: Monolithic (Default)
Frontend and backend deployed together (same URL).
- **Deployment**: Single deployment on Render or Vercel
- **API Calls**: Relative paths (`/api/*`)
- **Configuration**: `NEXT_PUBLIC_API_URL` is empty or not set

### Option 2: Separated
Frontend and backend deployed separately.
- **Frontend**: Vercel, Netlify, or any static host
- **Backend**: Render (https://jharkhand-tourism-li3w.onrender.com)
- **API Calls**: Full URLs to backend
- **Configuration**: `NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com`

---

## Quick Setup

### For Same Deployment (Monolithic)
No configuration needed! Leave `.env` as:
```env
NEXT_PUBLIC_API_URL=
```

### For Separate Backend (Current Setup)
Your `.env` is already configured:
```env
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```

This tells the frontend to make all API calls to your Render backend.

---

## How It Works

### 1. Configuration File (`lib/config.ts`)
Centralizes API configuration:
```typescript
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000,
  withCredentials: true,
}
```

### 2. Helper Functions
- `getApiUrl(endpoint)` - Converts relative paths to full URLs when needed
- `createFetchOptions(options)` - Adds default headers and credentials

### 3. Custom Hook (`lib/hooks/useApi.ts`)
Simplifies API calls with automatic backend URL handling:
```typescript
const { data, loading, error, post } = useApi()

// Automatically uses correct backend URL
await post('/api/auth/login', { email, password })
```

---

## Migration Guide

### Updating Existing Components

#### Before (Direct fetch):
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

#### After (Using config):
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

#### Or (Using hook):
```typescript
import { useApi } from '@/lib/hooks/useApi'

const { post, loading, error } = useApi()
await post('/api/auth/login', { email, password })
```

---

## Environment Variables

### Development (.env.local)
```env
# Use local backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Or use Render backend
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```

### Production (.env.production)
```env
# Same deployment
NEXT_PUBLIC_API_URL=

# Or separate backend
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```

---

## CORS Configuration

When using a separate backend, you need to configure CORS on the backend.

### Add CORS Middleware (Next.js API Routes)

Create `middleware.ts` in the root:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get origin from request
  const origin = request.headers.get('origin')
  
  // Allowed origins
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    'https://jharkhand-tourism-li3w.onrender.com'
  ]

  // Check if origin is allowed
  const isAllowed = allowedOrigins.includes(origin || '')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin! : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

  // Handle actual requests
  const response = NextResponse.next()
  
  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin!)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

// Apply to API routes only
export const config = {
  matcher: '/api/:path*',
}
```

---

## Testing

### Test Backend Connection
```bash
# Check if backend is accessible
curl https://jharkhand-tourism-li3w.onrender.com/api/health

# Test authentication endpoint
curl -X POST https://jharkhand-tourism-li3w.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Test Frontend Connection
1. Set `NEXT_PUBLIC_API_URL` in `.env`
2. Run frontend: `npm run dev`
3. Open browser console
4. Try logging in - check Network tab for API calls
5. Verify requests go to Render backend

---

## Deployment Scenarios

### Scenario 1: Everything on Render
```env
# .env (Render)
NEXT_PUBLIC_API_URL=
```
- Single deployment
- No CORS issues
- Simplest setup

### Scenario 2: Frontend on Vercel, Backend on Render
```env
# .env (Vercel)
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```
- Faster frontend (Vercel edge network)
- Backend on Render
- Requires CORS configuration

### Scenario 3: Multiple Frontends, One Backend
```env
# Frontend 1 (Vercel)
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com

# Frontend 2 (Netlify)
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com

# Mobile App
API_URL=https://jharkhand-tourism-li3w.onrender.com
```
- Shared backend for web and mobile
- Centralized data and logic

---

## Troubleshooting

### Issue: CORS Errors
**Symptoms**: Browser console shows "CORS policy" errors

**Solution**:
1. Add CORS middleware (see above)
2. Verify `Access-Control-Allow-Origin` header in response
3. Check `withCredentials` is set correctly

### Issue: 404 Not Found
**Symptoms**: API calls return 404

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend is deployed and running
3. Ensure API routes exist on backend

### Issue: Authentication Not Working
**Symptoms**: Login succeeds but subsequent requests fail

**Solution**:
1. Verify cookies are being sent (`withCredentials: true`)
2. Check `NEXTAUTH_URL` matches backend URL
3. Ensure JWT_SECRET is same on both deployments

### Issue: Slow API Calls
**Symptoms**: Requests take 30+ seconds

**Solution**:
1. Render free tier spins down - first request is slow
2. Use UptimeRobot to keep backend awake
3. Upgrade to Render paid plan

---

## Best Practices

### 1. Use Environment Variables
Never hardcode backend URLs in components.

### 2. Handle Loading States
```typescript
const { data, loading, error } = useApi()

if (loading) return <Spinner />
if (error) return <Error message={error.message} />
return <Data data={data} />
```

### 3. Implement Retry Logic
```typescript
const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

### 4. Cache API Responses
Use React Query or SWR for automatic caching and revalidation.

### 5. Monitor Backend Health
Create a health check endpoint:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  })
}
```

---

## Current Configuration

Your app is currently configured to use:
- **Backend**: https://jharkhand-tourism-li3w.onrender.com
- **Frontend**: Can be deployed anywhere (Vercel, Netlify, etc.)
- **API Calls**: All requests go to Render backend

To change this, update `NEXT_PUBLIC_API_URL` in your `.env` file.

---

## Next Steps

1. ✅ Configuration files created
2. ✅ Environment variables set
3. ⏳ Add CORS middleware (if using separate frontend)
4. ⏳ Update components to use `getApiUrl()` or `useApi()` hook
5. ⏳ Test backend connection
6. ⏳ Deploy and verify

---

## Support

For issues with:
- **Backend**: Check Render dashboard logs
- **Frontend**: Check browser console and Network tab
- **CORS**: Verify middleware and allowed origins
- **Authentication**: Check JWT_SECRET and NEXTAUTH_URL

---

**Your backend is ready at**: `https://jharkhand-tourism-li3w.onrender.com`

All API endpoints are available at: `https://jharkhand-tourism-li3w.onrender.com/api/*`
