# 🚀 Professional MERN Portfolio & Admin System

A high-performance, fully dynamic portfolio system with an integrated Admin Dashboard. Built with the MERN stack (MongoDB, Express, React, Node.js), this project offers a seamless experience for both viewers and administrators.

## ✨ Features

### 💻 Public Portfolio
- **Modern UI/UX**: Stunning design with a dark/light mode aesthetic.
- **Dynamic Content**: Every section (Bio, Projects, Skills, etc.) is managed via the admin panel.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.
- **Micro-animations**: Smooth transitions and hover effects for a premium feel.
- **Contact System**: Integrated contact form with backend validation and email notifications.

### 🔐 Admin Dashboard
- **Secure Authentication**: Refined JWT-based auth with bcrypt password hashing.
- **Full CRUD**: Manage Projects, Certificates, Experience, Education, and more.
- **Asset Management**: Seamless image and PDF uploads integrated with Cloudinary.
- **Visibility Control**: Toggle sections on/off with a single click.
- **Analytics**: At-a-glance dashboard stats for engagements and content.

### 🛠️ Backend API
- **RESTful Design**: Clean, scalable API architecture.
- **Security First**: Middleware-protected routes and input validation.
- **Global Error Handling**: Robust error management and standardized API responses.

## 📁 Project Structure

```
portfolio-project/
├── backend/                 # Node.js + Express API
│   ├── config/             # DB & Cloudinary configurations
│   ├── controllers/        # Business logic for routes
│   ├── middleware/         # Auth, validation, & error handlers
│   ├── models/             # Mongoose schemas (MongoDB)
│   ├── routes/             # API endpoint definitions
│   └── server.js           # API entry point
│
└── frontend/                # React + Vite Application
    ├── src/
    │   ├── components/     # UI components (Public & Admin)
    │   ├── contexts/       # Auth & Theme state management
    │   ├── pages/          # Individual page views
    │   │   ├── admin/      # Integrated Admin Dashboard pages
    │   │   └── ...         # Public portfolio pages
    │   └── services/       # Axios API services
    └── index.html
```

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0+
- **MongoDB**: Atlas account or local instance
- **Cloudinary**: Account for media storage

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio-project.git
cd portfolio-project

# Setup Backend
cd backend
npm install

# Setup Frontend
cd ../frontend
npm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the App

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 📝 API Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new admin | Public |
| `POST` | `/api/auth/login` | Login & get JWT | Public |
| `GET` | `/api/dashboard` | Get dashboard stats | Private |
| `GET` | `/api/projects` | Get all projects | Public |
| `POST` | `/api/projects` | Create project | Private |

*See `/docs/API_ENDPOINTS.md` for the full reference.*

## 🛡️ Security Features
- **Passwords**: Hashed with salt (bcryptjs).
- **Sessions**: JWT tokens with 7-day expiration.
- **Validation**: Strict request body checks using Express Validator.
- **CORS**: Restricted origins for production safety.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

---
**Made with ❤️ by [Hasnain Irshad](https://github.com/Hasnain-irshad)**
