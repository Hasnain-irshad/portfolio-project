# Deployment Guide

Deploy your Dynamic Portfolio System to production.

## Architecture

- **Backend API**: Deploy to Render / Railway / Heroku
- **Frontend Portfolio**: Deploy to Vercel / Netlify
- **Admin Dashboard**: Deploy to Vercel / Netlify  
- **Database**: MongoDB Atlas (already cloud-based)
- **File Storage**: Cloudinary (already cloud-based)

---

## Backend Deployment (Render)

### 1. Prepare Backend

Ensure `package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_URL=https://your-portfolio.vercel.app
   ADMIN_URL=https://your-admin.vercel.app
   ```

7. Click "Create Web Service"

8. Once deployed, note your backend URL (e.g., `https://portfolio-backend.onrender.com`)

---

## Frontend Deployment (Vercel)

### 1. Prepare Frontend

Update `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### 2. Deploy to Vercel

**Option A: Vercel CLI**
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Select `frontend` directory as root
4. Add environment variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
5. Click "Deploy"

### 3. Configure Domain (Optional)
- Go to project settings → Domains
- Add custom domain
- Update DNS records as instructed

---

## Admin Dashboard Deployment (Vercel)

### 1. Prepare Admin

Update `admin/.env.production`:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### 2. Deploy to Vercel

```bash
cd admin
vercel --prod
```

Or useVercel dashboard and import the `admin` directory.

---

## Alternative: Deploy to Netlify

### Frontend/Admin on Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Configure:
   - **Base directory**: `frontend` or `admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables in Site settings
6. Deploy

---

## Alternative: Backend on Railway

### Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub
4. Select backend directory
5. Add environment variables
6. Deploy

Railway provides better cold start performance than Render's free tier.

---

## Post-Deployment Checklist

### 1. Update CORS Origins

Update `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'https://your-portfolio.vercel.app',
    'https://your-admin.vercel.app'
  ],
  credentials: true
}));
```

### 2. Test All Endpoints

```bash
# Test backend
curl https://your-backend.onrender.com

# Test login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

### 3. Register Admin (if not done)

```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "admin@example.com",
    "password": "secure_password"
  }'
```

### 4. Test Frontend

Visit your frontend URL and verify:
- ✅ All sections load correctly
- ✅ Contact form works
- ✅ Resume download works
- ✅ Images load from Cloudinary

### 5. Test Admin Dashboard

Login and verify:
- ✅ Authentication works
- ✅ Can upload images/PDFs
- ✅ CRUD operations work
- ✅ Changes reflect on frontend

---

## MongoDB Atlas Configuration

### 1. Whitelist IP Addresses

1. Go to MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Add:
   - `0.0.0.0/0` (allow from anywhere) - for development
   - Or specific IPs of Render/Railway servers

### 2. Database User

Ensure you have a database user with read/write permissions.

---

## Custom Domain Setup

### Frontend Domain (e.g., yourname.com)

1. Buy domain from Namecheap/GoDaddy
2. In Vercel: Settings → Domains → Add
3. Add DNS records as instructed:
   ```
   Type: A
   Name: @
   Value: 76.76.19.19

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Admin Subdomain (e.g., admin.yourname.com)

1. Deploy admin to Vercel
2. Add custom domain: `admin.yourname.com`
3. Add DNS record:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

---

## Environment Variables Reference

### Backend (Render/Railway)
```
NODE_ENV=production
PORT=5000 (Render sets this automatically)
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://...
ADMIN_URL=https://...
```

### Frontend (Vercel/Netlify)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Admin (Vercel/Netlify)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Monitoring & Maintenance

### 1. Backend Monitoring

- Render: Check Logs tab for errors
- Set up Uptime monitoring (UptimeRobot, Better Uptime)

### 2. Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for user session replay

### 3. Analytics

Add to frontend:
- Google Analytics
- Plausible Analytics (privacy-friendly)

### 4. Performance

- Monitor Lighthouse scores
- Optimize images with Cloudinary transformations
- Enable caching headers

---

## Troubleshooting

### Backend not responding
- Check Render logs
- Verify environment variables
- Check MongoDB Atlas whitelist

### CORS errors
- Verify CORS origins in backend match deployed URLs
- Check if backend is running

### File uploads failing
- Verify Cloudinary credentials
- Check file size limits
- Ensure uploads directory exists

### Images not loading
- Check Cloudinary URLs
- Verify public access to Cloudinary resources

---

## Cost Breakdown

### Free Tier
- **MongoDB Atlas**: 512MB free
- **Cloudinary**: 25GB storage, 25GB bandwidth/month free
- **Render**: 750 hours/month free (1 instance)
- **Vercel**: Unlimited deployments, 100GB bandwidth

**Total: $0/month** for small portfolios!

### Paid Recommendations (for production)
- **Render**: $7/month for better performance
- **MongoDB Atlas**: $9/month for M2 cluster
- **Cloudinary**: $99/month for more storage/bandwidth

---

## Security Best Practices

1. ✅ Use HTTPS (automatic on Vercel/Render)
2. ✅ Strong JWT secret (32+ characters)
3. ✅ Rotate secrets regularly
4. ✅ Implement rate limiting in production
5. ✅ Enable MongoDB Atlas IP whitelist
6. ✅ Use environment variables (never hardcode)
7. ✅ Keep dependencies updated
8. ✅ Enable 2FA on hosting accounts

---

## Backup Strategy

### 1. Database Backups

MongoDB Atlas provides:
- Automated daily backups (paid tiers)
- Manual export: `mongodump` command

### 2. Code Backups

- GitHub repository (with private settings)
- Local backups

### 3. Media Backups

Cloudinary stores all images/PDFs permanently.

---

## Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Add content via admin dashboard
3. ✅ Set up custom domain
4. ✅ Add SEO metadata
5. ✅ Submit sitemap to Google
6. ✅ Set up monitoring
7. ✅ Share your portfolio! 🎉
