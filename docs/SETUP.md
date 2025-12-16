# Setup Guide

Complete setup instructions for the Dynamic Portfolio System.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Git installed

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT Secret (generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

**How to get credentials:**

**MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get connection string from "Connect" → "Connect your application"

**Cloudinary:**
1. Go to https://cloudinary.com/console
2. Sign up/login
3. Copy Cloud Name, API Key, and API Secret from dashboard

### 4. Start Backend Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### 5. Register Admin User

Make a POST request to `/api/auth/register`:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "admin@example.com",
    "password": "your_secure_password"
  }'
```

Or use Postman/Thunder Client to register.

---

## Frontend Portfolio Setup

### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server
```bash
npm run dev
```

Portfolio will run on `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

Production files will be in the `dist` folder.

---

## Admin Dashboard Setup

### 1. Navigate to Admin Directory
```bash
cd ../admin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `admin` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server
```bash
npm run dev --port 5174
```

Admin dashboard will run on `http://localhost:5174`

### 5. Login to Admin Dashboard

1. Open `http://localhost:5174`
2. Login with the admin credentials you registered

---

## Testing the System

### 1. Test Backend API
```bash
# Test server
curl http://localhost:5000

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

### 2. Test Frontend
- Open `http://localhost:5173` in browser
- Should see the portfolio (may be empty initially)

### 3. Test Admin Dashboard
- Open `http://localhost:5174` in browser
- Login with admin credentials
- Add sample data (profile, projects, skills, etc.)
- Refresh frontend to see updates

---

## Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Ensure all environment variables are set
- Check if port 5000 is not in use

### Frontend/Admin can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify `VITE_API_URL` in .env files

### File uploads not working
- Check Cloudinary credentials
- Ensure `uploads` directory exists in backend
- Check file size limits

### Database connection errors
- Whitelist your IP in MongoDB Atlas
- Check username/password in connection string
- Ensure cluster is running

---

## Next Steps

1. **Add Content**: Login to admin dashboard and add:
   - Personal profile information
   - Upload profile picture
   - Upload resume PDF
   - Add skills
   - Add work experience
   - Add projects with images
   - Add certificates

2. **Customize Frontend**:
   - Update colors in `frontend/src/styles/index.css`
   - Modify sections as needed
   - Add your own branding

3. **Deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions

---

## Security Notes

- **Never commit `.env` files** to version control
- Use strong passwords for admin account
- Rotate JWT_SECRET regularly in production
- Enable MongoDB Atlas IP whitelist
- Use HTTPS in production
- Implement rate limiting for production
