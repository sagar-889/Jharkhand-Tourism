# Render Deployment Guide - Jharkhand Tourism

## 🚀 Quick Deploy with render.yaml

Your project now includes a `render.yaml` file for automated deployment on Render.

---

## Option 1: Deploy with Blueprint (Recommended)

### Step 1: Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository: `sagar-889/Jharkhand-Tourism`
4. Render will detect `render.yaml` automatically

### Step 2: Configure Environment Variables
Render will prompt you to set these **required** environment variables:

```env
DATABASE_URL=postgresql://jharkhandtourism_user:YOUR_PASSWORD@dpg-d5j7htu3jp1c73fahdt0-a.frankfurt-postgres.render.com/jharkhandtourism
JWT_SECRET=your_jwt_secret_minimum_32_characters
NEXTAUTH_SECRET=your_nextauth_secret_minimum_32_characters
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_ACCOUNT_ID=acct_your_stripe_account
```

### Step 3: Deploy
- Click **"Apply"**
- Render will create the web service and deploy automatically
- First deployment takes 5-10 minutes

---

## Option 2: Manual Deployment

### Step 1: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

### Step 2: Configure Service

**Basic Settings:**
- **Name**: `jharkhand-tourism`
- **Region**: Frankfurt (or closest to your database)
- **Branch**: `main`
- **Runtime**: Node

**Build & Deploy:**
- **Build Command**: 
  ```bash
  npm install && npx prisma generate && npm run build
  ```
- **Start Command**: 
  ```bash
  npm start
  ```

**Instance Type:**
- **Plan**: Free (or upgrade for better performance)

### Step 3: Add Environment Variables
Go to **Environment** tab and add all variables listed above.

### Step 4: Deploy
Click **"Create Web Service"** - deployment starts automatically.

---

## Post-Deployment Steps

### 1. Initialize Database
After first successful deployment, run migrations:

```bash
# Set your DATABASE_URL locally
export DATABASE_URL="your_render_postgres_url"

# Push schema to database
npx prisma db push

# (Optional) Seed initial data
npm run init-db
```

### 2. Update NEXTAUTH_URL
If your Render URL is different from the default:
1. Go to **Environment** tab
2. Update `NEXTAUTH_URL` with your actual URL
3. Click **"Save Changes"** (triggers auto-redeploy)

### 3. Configure Stripe Webhooks
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter URL: `https://jharkhand-tourism-li3w.onrender.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.succeeded`
5. Copy webhook secret and update `STRIPE_WEBHOOK_SECRET` in Render

---

## Troubleshooting Common Issues

### ❌ Build Fails: "Prisma Client not generated"
**Solution**: Ensure build command includes `npx prisma generate`

### ❌ Service Crashes: "Cannot connect to database"
**Solution**: 
- Verify `DATABASE_URL` is correct
- Check database is running in Render dashboard
- Ensure database and web service are in same region

### ❌ 503 Service Unavailable
**Causes**:
1. **Free tier spin-down** - Wait 30-60 seconds for service to wake up
2. **Build failure** - Check build logs in Render dashboard
3. **Startup crash** - Check deploy logs for errors

**Fix**:
- Go to Render dashboard → Your service → Logs
- Look for error messages in deploy logs
- Common issues: missing env vars, database connection, port binding

### ❌ Authentication Not Working
**Solution**:
- Verify `JWT_SECRET` and `NEXTAUTH_SECRET` are set
- Ensure `NEXTAUTH_URL` matches your Render URL exactly
- Check browser console for CORS errors

### ❌ Images/Uploads Not Working
**Note**: Render's free tier has ephemeral storage. Uploaded files are lost on redeploy.

**Solutions**:
1. Use external storage (AWS S3, Cloudinary)
2. Upgrade to Render paid plan with persistent disk
3. Store images in database as base64 (not recommended for production)

---

## Performance Optimization

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- Cold start takes 30-60 seconds
- 512 MB RAM, shared CPU

### Upgrade Benefits (Starter Plan - $7/month)
- No spin-down
- Faster cold starts
- More RAM and CPU
- Persistent disk storage

### Keep Free Service Awake
Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your site every 5 minutes.

---

## Monitoring & Logs

### View Logs
```bash
# In Render Dashboard
Services → jharkhand-tourism → Logs
```

### Check Service Health
```bash
curl https://jharkhand-tourism-li3w.onrender.com/api/health
```

### Database Management
- Use Render dashboard for database metrics
- Connect with Prisma Studio locally:
  ```bash
  npx prisma studio
  ```

---

## Environment Variables Checklist

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Min 32 characters
- [ ] `NEXTAUTH_SECRET` - Min 32 characters  
- [ ] `NEXTAUTH_URL` - Your Render URL
- [ ] `EMAIL_USER` - Gmail address
- [ ] `EMAIL_PASSWORD` - Gmail app password
- [ ] `STRIPE_SECRET_KEY` - From Stripe dashboard
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From Stripe dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` - From Stripe webhook config
- [ ] `STRIPE_ACCOUNT_ID` - Your Stripe account ID

---

## Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render detects the push and starts a new deployment automatically.

---

## Custom Domain (Optional)

1. Go to **Settings** → **Custom Domains**
2. Add your domain
3. Configure DNS records as shown
4. Update `NEXTAUTH_URL` with custom domain

---

## Security Best Practices

✅ **Do:**
- Use strong secrets (min 32 characters)
- Enable 2FA on Render account
- Rotate secrets regularly
- Use environment-specific secrets
- Monitor Stripe webhook signatures

❌ **Don't:**
- Commit `.env` to GitHub
- Share environment variables
- Use weak JWT secrets
- Expose API keys in client code

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com/
- **Community**: https://community.render.com/

---

## Quick Commands Reference

```bash
# Check database connection
npx prisma db pull

# View database in browser
npx prisma studio

# Run migrations
npx prisma db push

# Generate Prisma client
npx prisma generate

# Test email configuration
npm run test-email

# Initialize default users
npm run init-db
```

---

## Next Steps

1. ✅ Deploy to Render using this guide
2. ✅ Configure all environment variables
3. ✅ Initialize database with Prisma
4. ✅ Test authentication and booking flows
5. ✅ Configure Stripe webhooks
6. ✅ Set up monitoring/uptime checks
7. ✅ (Optional) Configure custom domain

---

**Your app will be live at**: `https://jharkhand-tourism-li3w.onrender.com`

Good luck with your deployment! 🚀
