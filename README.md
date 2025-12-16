# Dynamic Portfolio System

A fully dynamic, production-ready personal portfolio system with a separate admin dashboard. Built with MERN stack (MongoDB, Express, React, Node.js).

## 🌟 Features

### Portfolio Frontend
- ✨ Fully responsive and modern UI
- 🎨 Smooth animations with Framer Motion
- 📱 Mobile-first design
- 🚀 Fast loading with optimized assets
- 📧 Contact form with backend integration
- 📄 Dynamic resume download
- 🔄 Auto-updates when content changes

### Admin Dashboard
- 🔐 Secure JWT authentication
- 📝 Complete CRUD operations for all sections
- 🖼️ Image & PDF upload (Cloudinary integration)
- 👁️ Visibility toggle for each section
- 📊 Clean, intuitive interface
- 🎯 Real-time updates

### Backend API
- 🛡️ Robust authentication system
- 📦 RESTful API architecture
- ✅ Request validation
- 🔒 Secure file uploads
- 🌐 CORS enabled
- 📝 Comprehensive error handling

## 📁 Project Structure

```
portfolio-project/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database & Cloudinary config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, validation, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
│
├── frontend/                # Portfolio Site (Vite + React)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API integration
│   │   └── styles/         # Global CSS
│   └── index.html
│
├── admin/                   # Admin Dashboard (Vite + React)
│   ├── src/
│   │   ├── components/     # Dashboard components
│   │   ├── pages/          # Dashboard pages
│   │   ├── context/        # Auth context
│   │   └── services/       # API integration
│   └── index.html
│
└── docs/                    # Documentation
    ├── API_ENDPOINTS.md
    ├── SETUP.md
    └── DEPLOYMENT.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

### Installation

1. **Clone & Install**
```bash
git clone <your-repo>
cd portfolio-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin dependencies (once created)
cd ../admin
npm install
```

2. **Configure Environment Variables**

Create `.env` files in `backend`, `frontend`, and `admin` directories (see `.env.example` files).

3. **Start Development Servers**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Admin
cd admin
npm run dev
```

4. **Access the Applications**
- Portfolio Frontend: http://localhost:5173
- Admin Dashboard: http://localhost:5174
- Backend API: http://localhost:5000

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed setup instructions
- **[API Documentation](./docs/API_ENDPOINTS.md)** - Complete API reference
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to production

## 🛠️ Tech Stack

### Backend
-Express.js - Web framework
- MongoDB + Mongoose - Database
- JWT - Authentication
- Cloudinary - File storage
- Multer - File uploads
- Bcrypt - Password hashing

### Frontend & Admin
- React - UI library
- Vite - Build tool
- Axios - HTTP client
- Framer Motion - Animations
- CSS3 - Styling

## 📝 API Endpoints

### Public Endpoints
- `GET /api/profile` - Get profile data
- `GET /api/resume` - Get active resume
- `GET /api/projects` - Get all projects
- `GET /api/skills` - Get all skills
- `GET /api/experience` - Get work experience
- `GET /api/certificates` - Get certificates
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Admin)
All CRUD operations for:
- Profile management
- Resume upload
- Projects (with image uploads)
- Skills
- Experience
- Certificates
- Contact messages

See [API_ENDPOINTS.md](./docs/API_ENDPOINTS.md) for complete documentation.

## 🎨 Customization

### Colors & Theming
Edit `frontend/src/styles/index.css` to customize:
- Color palette
- Typography
- Spacing
- Animations

### Content Structure
All content is managed through the admin dashboard - no code changes needed!

## 🚀 Deployment

### Recommended Stack
- **Backend**: Render / Railway (free tier available)
- **Frontend**: Vercel / Netlify (free)
- **Admin**: Vercel / Netlify (free)
- **Database**: MongoDB Atlas (free tier)
- **Storage**: Cloudinary (free tier)

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for step-by-step deployment instructions.

## 📦 Features Breakdown

### Content Management
- ✅ Personal profile & bio
- ✅ Profile picture upload
- ✅ Resume PDF upload & management
- ✅ Projects with multiple images
- ✅ Skills by category with proficiency levels
- ✅ Work experience timeline
- ✅ Certificates with credential verification
- ✅ Contact form submissions

### Admin Features
- ✅ Secure authentication
- ✅ Upload/update/delete all content
- ✅ Toggle visibility for each section
- ✅ View contact form submissions
- ✅ Manage multiple resumes
- ✅ Order/prioritize items

### Frontend Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth scrolling navigation
- ✅ Animated sections
- ✅ Contact form with validation
- ✅ Social media links
- ✅ SEO optimized
- ✅ Fast loading

## 🔒 Security Features

- JWT authentication for admin
- Password hashing with bcrypt
- Request validation
- CORS protection
- Environment variables for sensitive data
- Secure file uploads to Cloudinary

## 📊 Performance

- Lazy loading of images
- Optimized builds with Vite
- CDN delivery via Cloudinary
- Minimal bundle size
- Server-side caching support

## 🤝 Contributing

This is a personal portfolio system template. Feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

- 📖 Check documentation in `/docs`
- 🐛 Report issues on GitHub
- 💬 See troubleshooting section in SETUP.md

## 🎉 Acknowledgments

- Built with modern best practices
- Inspired by professional portfolio designs
- Uses industry-standard technologies

---

**Made with ❤️ using React, Node.js, and MongoDB**
