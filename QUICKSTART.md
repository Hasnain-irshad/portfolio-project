# 🚀 Quick Start Guide

Get your portfolio running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Step 2: Setup Environment

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Start Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Step 4: Register Admin

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "admin@example.com",
    "password": "secure_password"
  }'
```

## Step 5: Add Content

1. Open admin login page at http://localhost:5173/admin/login
2. Click on "Signup" to create your account (if not already created)
3. Login with your credentials
4. Add profile, projects, skills, etc.
5. Visit http://localhost:5173 to see your portfolio!

---

## 📝 Quick Commands

### Development
```bash
# Backend with auto-reload
npm run dev

# Frontend with HMR
npm run dev
```

### Production
```bash
# Build frontend
npm run build

# Start backend
npm start
```

---

## 🔗 Important URLs

- Portfolio: http://localhost:5173
- Admin: http://localhost:5174 (when created)
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api

---

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md)
- [API Endpoints](./docs/API_ENDPOINTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🆘 Troubleshooting

**Backend won't start?**
- Check MongoDB connection string
- Verify all environment variables
- Ensure port 5000 is free

**Frontend can't connect?**
- Is backend running on port 5000?
- Check `VITE_API_URL` in .env
- Verify CORS settings

**File uploads failing?**
- Check Cloudinary credentials
- Verify uploads directory exists
- Check file size limits

---

**Need help? Check the full [Setup Guide](./docs/SETUP.md)!**
