# Quick Reference Card

## 🚀 Backend Configuration - Jharkhand Tourism

---

## Environment Variables

```env
# Backend URL (leave empty for same deployment)
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Authentication
JWT_SECRET=your-secret-min-32-chars
NEXTAUTH_SECRET=your-secret-min-32-chars
NEXTAUTH_URL=https://jharkhand-tourism-li3w.onrender.com

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Quick Commands

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Test backend connection
npm run test-backend

# Test email
npm run test-email

# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## API Usage

### Using the Hook (Recommended)
```typescript
import { useApi } from '@/lib/hooks/useApi'

const { post, loading, error } = useApi()
await post('/api/auth/login', { email, password })
```

### Using Helper Functions
```typescript
import { getApiUrl, createFetchOptions } from '@/lib/config'

const response = await fetch(
  getApiUrl('/api/auth/login'),
  createFetchOptions({ method: 'POST', body: JSON.stringify(data) })
)
```

---

## API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/public/places` - List places
- `GET /api/public/hotels` - List hotels
- `GET /api/public/restaurants` - List restaurants
- `GET /api/public/events` - List events

### Authentication
- `POST /api/auth/send-otp-simple` - Send OTP
- `POST /api/auth/verify-otp-simple` - Verify OTP
- `POST /api/auth/login-simple` - Login
- `POST /api/auth/forgot-password-simple` - Forgot password
- `POST /api/auth/reset-password-simple` - Reset password

### Bookings
- `POST /api/hotel-bookings` - Book hotel
- `POST /api/restaurant-bookings` - Book restaurant
- `GET /api/bookings` - Get bookings

### Admin (requires auth)
- `GET /api/admin/[resource]` - List resources
- `POST /api/admin/[resource]` - Create/update
- `DELETE /api/admin/[resource]` - Delete

---

## Testing

### Test Backend
```bash
# Local
npm run test-backend

# Remote
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com npm run test-backend

# Manual
curl https://jharkhand-tourism-li3w.onrender.com/api/health
```

### Expected Response
```json
{
  "status": "ok",
  "message": "Jharkhand Tourism API is running",
  "timestamp": "2026-01-13T...",
  "environment": "production",
  "version": "1.0.0"
}
```

---

## Deployment

### Vercel (Frontend)
```bash
npm i -g vercel
vercel
```

### Render (Backend)
1. Push to GitHub
2. Create Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy

### Environment Variables to Set
- All variables from `.env.example`
- `NEXT_PUBLIC_API_URL` (frontend only)
- `NEXTAUTH_URL` (backend only)

---

## Troubleshooting

### 503 Service Unavailable
- Wait 30-60 seconds (cold start)
- Check Render dashboard
- Verify environment variables

### CORS Errors
- Add frontend URL to `middleware.ts`
- Redeploy backend

### Authentication Fails
- Check `JWT_SECRET` is set
- Verify `NEXTAUTH_URL` is correct
- Ensure cookies are enabled

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check database is running
- Test connection: `npx prisma db pull`

---

## File Structure

```
lib/
├── config.ts              # API configuration
├── hooks/
│   └── useApi.ts         # API hook
middleware.ts             # CORS middleware
app/
├── api/
│   ├── health/          # Health check
│   ├── auth/            # Authentication
│   ├── public/          # Public endpoints
│   └── admin/           # Admin endpoints
render.yaml              # Render config
```

---

## CORS Configuration

Edit `middleware.ts`:
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://jharkhand-tourism-li3w.onrender.com',
  'https://your-frontend.vercel.app', // Add yours
]
```

---

## Default Credentials

**Admin:**
- Email: `admin@jharkhand-tourism.gov.in`
- Password: `Admin@2024`

**Government:**
- Email: `gov@jharkhand.gov.in`
- Password: `Gov@2024`

---

## Documentation

- `README.md` - Main documentation
- `BACKEND_CONFIGURATION.md` - Full config guide
- `EXAMPLE_API_USAGE.md` - Code examples
- `RENDER_DEPLOYMENT.md` - Render guide
- `ARCHITECTURE_DIAGRAM.md` - Architecture overview
- `SETUP_COMPLETE.md` - Setup summary

---

## Support

**Backend URL:** https://jharkhand-tourism-li3w.onrender.com

**Test Health:**
```bash
curl https://jharkhand-tourism-li3w.onrender.com/api/health
```

**Check Logs:**
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Deployments → Logs

---

## Quick Tips

✅ Use `useApi()` hook for all API calls
✅ Test backend with `npm run test-backend`
✅ Keep `.env` out of git (already in `.gitignore`)
✅ Use strong secrets (min 32 characters)
✅ Enable CORS for your frontend domain
✅ Monitor Render dashboard for errors
✅ Use UptimeRobot to prevent cold starts

---

**Made with ❤️ for Jharkhand Tourism**

Backend: https://jharkhand-tourism-li3w.onrender.com
