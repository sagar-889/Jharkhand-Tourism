# Quick Deployment Checklist

## ✅ Pre-Deployment (Complete)
- [x] Code pushed to GitHub
- [x] PostgreSQL database on Render
- [x] Prisma schema configured
- [x] Environment variables documented

## 🚀 Deploy to Vercel (Follow These Steps)

### 1. Go to Vercel
Visit: https://vercel.com/new

### 2. Import Repository
- Click "Import Git Repository"
- Select: `sagar-889/Jharkhand-Tourism`
- Click "Import"

### 3. Configure Build Settings
- Framework: **Next.js** (auto-detected)
- Build Command: `prisma generate && npm run build`
- Leave other settings as default

### 4. Add Environment Variables
Copy from your `.env` file and add these in Vercel:

**Required Variables:**
```
DATABASE_URL
JWT_SECRET
NEXTAUTH_SECRET
EMAIL_USER
EMAIL_PASSWORD
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

**Set NEXTAUTH_URL as:**
```
NEXTAUTH_URL=https://your-project-name.vercel.app
```
(You'll update this after first deployment)

### 5. Deploy
Click "Deploy" button

### 6. Post-Deployment
1. Copy your Vercel URL (e.g., `jharkhand-tourism-xyz.vercel.app`)
2. Go to Project Settings → Environment Variables
3. Update `NEXTAUTH_URL` with your actual URL
4. Click "Redeploy" from Deployments tab

### 7. Initialize Database
Run locally with your DATABASE_URL:
```bash
npx prisma db push
```

### 8. Test Your Deployment
- [ ] Homepage loads
- [ ] Authentication works
- [ ] Admin login works
- [ ] Places/Hotels/Restaurants display
- [ ] Booking system works

## 🎉 Done!

Your app is now live at: `https://your-project-name.vercel.app`

---

## Need Help?
- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Review Vercel deployment logs for errors
- Verify all environment variables are set correctly
