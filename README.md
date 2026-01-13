# Jharkhand Tourism Platform

A comprehensive tourism platform for Jharkhand with multi-role authentication, booking system, and backend API.

---

## 🌐 Live Deployment

- **Backend API**: https://jharkhand-tourism-li3w.onrender.com
- **API Health**: https://jharkhand-tourism-li3w.onrender.com/api/health

---

## ✨ Features

### 🏠 **Landing Page**
- Beautiful homepage showcasing Jharkhand tourism
- Browse places, hotels, restaurants, and events
- Multi-language support
- Interactive map integration

### 👥 **Multi-Role Authentication System**
- **Tourist**: Browse and book hotels, restaurants, and travel packages
- **Travel Provider**: Manage travel packages and bookings
- **Admin**: Manage all content and verify providers
- **Government**: Access comprehensive tourism analytics

### 🎯 **Core Features**
- Hotel and restaurant booking system
- Travel package management
- Event listings and management
- Budget planner for trips
- AI-powered chatbot assistance
- Payment integration with Stripe
- Email notifications (OTP, bookings, confirmations)
- Interactive maps with routing

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or use Render's free tier)
- Git
- Gmail account for email notifications

### 1. Clone and Install
```bash
git clone https://github.com/sagar-889/Jharkhand-Tourism.git
cd Jharkhand-Tourism
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable

# Backend API (for separate deployments)
NEXT_PUBLIC_API_URL=
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Initialize with default data
npm run init-db
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🔧 Backend Configuration

This app supports two deployment architectures:

### Option 1: Monolithic (Default)
Frontend and backend together in one deployment.
```env
NEXT_PUBLIC_API_URL=
```

### Option 2: Separated
Frontend and backend deployed separately.
```env
# Frontend .env
NEXT_PUBLIC_API_URL=https://jharkhand-tourism-li3w.onrender.com
```

**See `BACKEND_CONFIGURATION.md` for detailed setup instructions.**

---

## 📚 Documentation

- **[Quick Deploy Guide](QUICK_DEPLOY.md)** - Fast deployment to Vercel
- **[Render Deployment](RENDER_DEPLOYMENT.md)** - Deploy to Render
- **[Backend Configuration](BACKEND_CONFIGURATION.md)** - Configure frontend-backend connection
- **[API Usage Examples](EXAMPLE_API_USAGE.md)** - Code examples for API calls
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Comprehensive deployment instructions
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions
- **[Architecture](ARCHITECTURE.md)** - System architecture overview

---

## 🔑 Default Credentials

After running `npm run init-db`:

**Admin Account**
- Email: `admin@jharkhand-tourism.gov.in`
- Password: `Admin@2024`

**Government Account**
- Email: `gov@jharkhand.gov.in`
- Password: `Gov@2024`

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Lucide Icons
- **Maps**: Leaflet, React Leaflet
- **Charts**: Chart.js, Recharts
- **3D**: Three.js, React Three Fiber

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Payments**: Stripe
- **File Upload**: Multer

### Deployment
- **Frontend**: Vercel (recommended) or Render
- **Backend**: Render
- **Database**: Render PostgreSQL
- **CDN**: Vercel Edge Network

---

## 📡 API Endpoints

### Public Endpoints
- `GET /api/public/places` - List all places
- `GET /api/public/hotels` - List all hotels
- `GET /api/public/restaurants` - List all restaurants
- `GET /api/public/events` - List all events
- `GET /api/health` - Health check

### Authentication
- `POST /api/auth/send-otp-simple` - Send OTP to email
- `POST /api/auth/verify-otp-simple` - Verify OTP
- `POST /api/auth/login-simple` - Login with email/password
- `POST /api/auth/forgot-password-simple` - Request password reset
- `POST /api/auth/reset-password-simple` - Reset password

### Bookings
- `POST /api/hotel-bookings` - Create hotel booking
- `POST /api/restaurant-bookings` - Create restaurant booking
- `GET /api/bookings` - Get user bookings

### Admin
- `GET /api/admin/places` - Manage places
- `GET /api/admin/hotels` - Manage hotels
- `GET /api/admin/restaurants` - Manage restaurants
- `POST /api/admin/[resource]` - Create/update resource
- `DELETE /api/admin/[resource]` - Delete resource

**Full API documentation**: See `BACKEND_CONFIGURATION.md`

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel dashboard: https://vercel.com/new

### Deploy to Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Configure environment variables
5. Deploy

**See `RENDER_DEPLOYMENT.md` for detailed instructions.**

---

## 🧪 Testing

### Test Backend Connection
```bash
curl https://jharkhand-tourism-li3w.onrender.com/api/health
```

### Test Email Configuration
```bash
npm run test-email
```

### Run Development Server
```bash
npm run dev
```

---

## 📦 Project Structure

```
jharkhand-tourism/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── dashboard/         # Dashboard pages
│   ├── auth/              # Authentication pages
│   └── ...
├── lib/                   # Utility libraries
│   ├── config.ts          # API configuration
│   ├── hooks/             # Custom React hooks
│   ├── models/            # Database models
│   └── ...
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets
├── scripts/               # Utility scripts
├── docs/                  # Documentation
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── middleware.ts          # CORS middleware
├── render.yaml            # Render deployment config
└── package.json           # Dependencies
```

---

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Email OTP verification
- CORS protection
- Environment variable protection
- SQL injection prevention (Prisma)
- XSS protection

**Important**: Never commit `.env` files to version control!

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

### Common Issues

**503 Service Unavailable**
- Render free tier spins down after inactivity
- Wait 30-60 seconds for cold start
- See `TROUBLESHOOTING.md`

**CORS Errors**
- Check `middleware.ts` configuration
- Verify allowed origins
- See `BACKEND_CONFIGURATION.md`

**Database Connection Failed**
- Verify `DATABASE_URL` is correct
- Check database is running
- See `RENDER_DEPLOYMENT.md`

### Resources
- [Documentation](docs/)
- [GitHub Issues](https://github.com/sagar-889/Jharkhand-Tourism/issues)
- [Render Status](https://status.render.com/)

---

## 🎯 Roadmap

- [x] Multi-role authentication
- [x] Hotel and restaurant booking
- [x] Payment integration (Stripe)
- [x] Email notifications
- [x] Admin dashboard
- [x] Backend API configuration
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] PWA support

---

## 👨‍💻 Author

**Sagar Kanda**
- GitHub: [@sagar-889](https://github.com/sagar-889)
- Email: kandasagar2006@gmail.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Render for free PostgreSQL hosting
- Vercel for deployment platform
- All contributors and users

---

**Backend API**: https://jharkhand-tourism-li3w.onrender.com

**Made with ❤️ for Jharkhand Tourism**
