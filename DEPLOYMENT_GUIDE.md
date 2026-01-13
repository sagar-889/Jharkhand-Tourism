# Jharkhand Tourism - Deployment Guide

## Architecture Overview
- **Frontend + Backend**: Vercel (Next.js with API routes)
- **Database**: Render (PostgreSQL)

---

## Prerequisites
1. GitHub account with repository: https://github.com/sagar-889/Jharkhand-Tourism
2. Vercel account (sign up at https://vercel.com)
3. Render account with PostgreSQL database (already set up)

---

## Step 1: Database Setup on Render ✓ (Already Complete)

Your PostgreSQL database is already running on Render:
- **Host**: dpg-d5j7htu3jp1c73fahdt0-a.frankfurt-postgres.render.com
- **Database**: jharkhandtourism
- **User**: jharkhandtourism_user

---

## Step 2: Deploy to Vercel

### A. Initial Setup

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import GitHub Repository**
   - Click "Import Git Repository"
   - Select: `sagar-889/Jharkhand-Tourism`
   - Click "Import"

### B. Configure Project Settings

1. **Framework Preset**: Next.js (auto-detected)

2. **Build & Development Settings**:
   - Build Command: `prisma generate && npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

3. **Environment Variables** (Click "Environment Variables"):

Add the following variables:

```env
# Database
DATABASE_URL=your_postgresql_connection_string_from_render

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_ACCOUNT_ID=acct_your_stripe_account_id

# Server Configuration
PORT=3000
```

**Note**: Replace all placeholder values with your actual credentials from your `.env` file.

4. **Click "Deploy"**

### C. Post-Deployment Steps

1. **Update NEXTAUTH_URL**:
   - After first deployment, copy your Vercel URL (e.g., `https://jharkhand-tourism.vercel.app`)
   - Go to Project Settings → Environment Variables
   - Update `NEXTAUTH_URL` with your actual URL
   - Redeploy

2. **Run Database Migrations**:
   ```bash
   # On your local machine with DATABASE_URL set
   npx prisma db push
   ```

3. **Verify Deployment**:
   - Visit your Vercel URL
   - Test authentication
   - Test admin panel
   - Test booking features

---

## Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` with custom domain

---

## Troubleshooting

### Build Fails with Prisma Error
**Solution**: Ensure `postinstall` script in package.json runs `prisma generate`

### Database Connection Error
**Solution**: 
- Verify DATABASE_URL is correct
- Check if Render database is running
- Ensure IP whitelist allows Vercel IPs (Render allows all by default)

### Authentication Not Working
**Solution**:
- Verify JWT_SECRET is set
- Ensure NEXTAUTH_URL matches your deployment URL
- Check NEXTAUTH_SECRET is set

### Stripe Webhooks Not Working
**Solution**:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
3. Update STRIPE_WEBHOOK_SECRET with new webhook secret

---

## Environment Variables Checklist

- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] NEXTAUTH_URL (update after first deploy)
- [ ] NEXTAUTH_SECRET
- [ ] EMAIL_USER
- [ ] EMAIL_PASSWORD
- [ ] STRIPE_SECRET_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] STRIPE_ACCOUNT_ID

---

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor deployment logs
- Check function execution logs
- View analytics

### Database Management
- Use Render dashboard for database metrics
- Use Prisma Studio locally: `npm run prisma:studio`

---

## Alternative: Deploy to Render (Full Stack)

If you prefer to deploy everything on Render:

1. **Create Web Service on Render**
   - Connect GitHub repository
   - Build Command: `npm install && prisma generate && npm run build`
   - Start Command: `npm start`
   - Add all environment variables

2. **Advantages**:
   - Database and app in same region (lower latency)
   - Simpler architecture

3. **Disadvantages**:
   - Slower cold starts compared to Vercel
   - Less optimized for Next.js

---

## Quick Deploy Commands

```bash
# Push changes to GitHub
git add .
git commit -m "Your commit message"
git push origin main

# Vercel will auto-deploy on push (if connected)
```

---

## Support

For issues:
1. Check Vercel deployment logs
2. Check Render database logs
3. Review browser console for frontend errors
4. Check API route responses in Network tab

---

## Security Notes

⚠️ **Important**:
- Never commit `.env` file to GitHub
- Rotate secrets regularly
- Use environment-specific secrets for production
- Enable 2FA on all service accounts
- Monitor Stripe webhook signatures
