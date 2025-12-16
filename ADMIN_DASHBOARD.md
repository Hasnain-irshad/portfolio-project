# Admin Dashboard - Quick Start Guide

## Overview
Your portfolio now has a complete admin dashboard where you can manage all content dynamically. The admin panel is accessible only to authenticated users (you), while the public portfolio displays the content you add.

## Getting Started

### 1. Start the Backend
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (or another port shown in the terminal)

### 3. Create Your Admin Account
First, you need to register an admin account. Use Postman, curl, or any API client to send a POST request:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "your.email@example.com",
    "password": "your-strong-password"
  }'
```

**IMPORTANT**: For production, disable or protect the `/api/auth/register` endpoint so others cannot create admin accounts!

### 4. Access the Admin Dashboard

1. Open your browser and navigate to: `http://localhost:5173/admin/login`
2. Enter your email and password
3. You'll be redirected to the admin dashboard

## Admin Dashboard Features

### Navigation
The sidebar on the left provides access to all management sections:

- **Dashboard**: Overview and quick actions
- **Profile**: Manage your profile info, bio, social links, and avatar
- **Resume**: Upload/update your resume/CV
- **Projects**: Add, edit, delete projects with images
- **Skills**: Manage your technical skills with proficiency levels
- **Experience**: Add work experience entries
- **Education**: Manage education history
- **Achievements**: Add awards and achievements
- **Certificates**: Upload and manage certificates

### Managing Content

#### Adding Items
1. Click the "+ Add [Item]" button
2. Fill in the required fields (marked with *)
3. Upload images if applicable
4. Check "Visible on portfolio" to make it public
5. Click "Create"

#### Editing Items
1. Click "Edit" on any item card
2. Update the information
3. Click "Update"

#### Deleting Items
1. Click "Delete" on any item
2. Confirm the deletion
3. The item will be permanently removed

#### Visibility Toggle
- Use the "Show/Hide" button to control whether an item appears on your public portfolio
- Hidden items remain in your admin panel but won't be visible to visitors

### Image Uploads
- **Projects**: Up to 5 images per project
- **Profile**: One avatar image
- **Certificates**: One certificate image
- **Experience**: Company logo (optional)
- **Achievements**: One image (optional)

All images are automatically uploaded to Cloudinary and optimized.

## Public Portfolio

Your public portfolio is accessible at: `http://localhost:5173/`

All changes made in the admin dashboard are immediately reflected on the public portfolio (after refresh).

## Routes

- **Public Portfolio**: `/`
- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`
- **Admin Management Pages**: `/admin/[section]`
  - `/admin/profile`
  - `/admin/resume`
  - `/admin/projects`
  - `/admin/skills`
  - `/admin/experience`
  - `/admin/education`
  - `/admin/achievements`
  - `/admin/certificates`

## Security Notes

1. **JWT Token**: Stored in browser localStorage, valid for 7 days
2. **Protected Routes**: All admin pages require authentication
3. **Auto-Logout**: Click "Logout" in the header to end your session
4. **Production Deployment**:
   - Use HTTPS for all requests
   - Set strong environment variables
   - Disable `/api/auth/register` endpoint
   - Consider implementing httpOnly cookies instead of localStorage

## Troubleshooting

### Cannot Login
- Verify backend is running on port 5000
- Check console for error messages
- Ensure you registered an admin account
- Try clearing browser cache/localStorage

### Images Not Uploading
- Check Cloudinary credentials in backend `.env`
- Verify file size (max usually 10MB)
- Check file format (jpg, png, pdf supported)

### Changes Not Showing on Public Portfolio
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check that "Visible on portfolio" is enabled
- Verify the item was saved successfully

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

When deploying to production:

1. **Update API URL**: Change `VITE_API_URL` to your production backend URL
2. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```
3. **Deploy Backend**: Use services like Railway, Render, or Heroku
4. **Deploy Frontend**: Use Vercel, Netlify, or similar
5. **Secure Admin**: Consider hiding `/admin/login` URL or adding extra layer of auth
6. **SSL Certificate**: Ensure HTTPS is enabled

## Tips

1. **Regular Backups**: Export your MongoDB data regularly
2. **Test Changes**: Preview items before making them visible
3. **Optimize Images**: Use compressed images for faster loading
4. **SEO**: Add descriptive titles and content for better search ranking
5. **Update Regularly**: Keep your content fresh and up-to-date

## Next Steps

1. Add your profile information
2. Upload your resume
3. Add 3-5 key projects with screenshots
4. List your top skills
5. Add work experience and education
6. Share your portfolio link!

---

For questions or issues, check the main README.md or contact support.
