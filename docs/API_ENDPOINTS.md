# API Endpoints Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register Admin
```
POST /auth/register
Body: { name, email, password }
Response: { success, message, data: { id, name, email } }
```

### Login Admin
```
POST /auth/login
Body: { email, password }
Response: { success, message, data: { token, admin: { id, name, email } } }
```

### Get Current Admin
```
GET /auth/me
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: admin }
```

---

## Profile

### Get Profile (Public)
```
GET /profile
Response: { success, message, data: profile }
```

### Update Profile (Admin)
```
PUT /profile
Headers: { Authorization: Bearer TOKEN }
Body: { name, title, bio, email, phone, location, socialLinks, isVisible }
Response: { success, message, data: profile }
```

### Upload Profile Image (Admin)
```
POST /profile/image
Headers: { Authorization: Bearer TOKEN }
Content-Type: multipart/form-data
Body: FormData with 'image' field
Response: { success, message, data: { profileImage } }
```

### Toggle Profile Visibility (Admin)
```
PATCH /profile/visibility
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: profile }
```

---

## Resume

### Get Active Resume (Public)
```
GET /resume
Response: { success, message, data: resume }
```

### Get All Resumes (Admin)
```
GET /resume/all
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: [resumes] }
```

### Upload Resume (Admin)
```
POST /resume
Headers: { Authorization: Bearer TOKEN }
Content-Type: multipart/form-data
Body: FormData with 'resume' field (PDF), title, description
Response: { success, message, data: resume }
```

### Delete Resume (Admin)
```
DELETE /resume/:id
Headers: { Authorization: Bearer TOKEN }
Response: { success, message }
```

### Activate Resume (Admin)
```
PATCH /resume/:id/activate
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: resume }
```

---

## Projects

### Get All Projects (Public)
```
GET /projects
Response: { success, message, data: [projects] }
```

### Get All Projects - Admin (Admin)
```
GET /projects/admin/all
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: [projects] }
```

### Get Project by ID (Public)
```
GET /projects/:id
Response: { success, message, data: project }
```

### Create Project (Admin)
```
POST /projects
Headers: { Authorization: Bearer TOKEN }
Content-Type: multipart/form-data
Body: FormData with 'images' array, title, description, longDescription, technologies (JSON array), liveUrl, githubUrl, featured, isVisible, order
Response: { success, message, data: project }
```

### Update Project (Admin)
```
PUT /projects/:id
Headers: { Authorization: Bearer TOKEN }
Content-Type: multipart/form-data
Body: Same as Create
Response: { success, message, data: project }
```

### Delete Project (Admin)
```
DELETE /projects/:id
Headers: { Authorization: Bearer TOKEN }
Response: { success, message }
```

### Toggle Project Visibility (Admin)
```
PATCH /projects/:id/visibility
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: project }
```

---

## Skills

### Get All Skills (Public)
```
GET /skills?category=Frontend
Response: { success, message, data: { skills: [], grouped: {} } }
```

### Get All Skills - Admin (Admin)
```
GET /skills/admin/all
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: [skills] }
```

### Create Skill (Admin)
```
POST /skills
Headers: { Authorization: Bearer TOKEN }
Body: { name, category, proficiency, proficiencyLevel, icon, order, isVisible }
Response: { success, message, data: skill }
```

### Update Skill (Admin)
```
PUT /skills/:id
Headers: { Authorization: Bearer TOKEN }
Body: Same as Create
Response: { success, message, data: skill }
```

### Delete Skill (Admin)
```
DELETE /skills/:id
Headers: { Authorization: Bearer TOKEN }
Response: { success, message }
```

---

## Experience

### Get All Experience (Public)
```
GET /experience
Response: { success, message, data: [experiences] }
```

### Get All Experience - Admin (Admin)
```
GET /experience/admin/all
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: [experiences] }
```

### Create Experience (Admin)
```
POST /experience
Headers: { Authorization: Bearer TOKEN }
Body: { company, position, location, type, startDate, endDate, current, description, achievements (JSON array), order, isVisible }
Response: { success, message, data: experience }
```

### Update Experience (Admin)
```
PUT /experience/:id
Headers: { Authorization: Bearer TOKEN }
Body: Same as Create
Response: { success, message, data: experience }
```

### Delete Experience (Admin)
```
DELETE /experience/:id
Headers: { Authorization: Bearer TOKEN }
Response: { success, message }
```

---

## Certificates

### Get All Certificates (Public)
```
GET /certificates
Response: { success, message, data: [certificates] }
```

### Get All Certificates - Admin (Admin)
```
GET /certificates/admin/all
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: [certificates] }
```

### Create Certificate (Admin)
```
POST /certificates
Headers: { Authorization: Bearer TOKEN }
Content-Type: multipart/form-data
Body: FormData with 'image' field, title, issuer, issueDate, expiryDate, credentialId, credentialUrl, order, isVisible
Response: { success, message, data: certificate }
```

### Update Certificate (Admin)
```
PUT /certificates/:id
Headers: { Authorization: Bearer TOKEN }
Content-Type: multipart/form-data
Body: Same as Create
Response: { success, message, data: certificate }
```

### Delete Certificate (Admin)
```
DELETE /certificates/:id
Headers: { Authorization: Bearer TOKEN }
Response: { success, message }
```

---

## Contact

### Submit Contact Form (Public)
```
POST /contact
Body: { name, email, subject, message }
Response: { success, message, data: contact }
```

### Get All Messages (Admin)
```
GET /contact?read=true
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: { messages: [], unreadCount: number } }
```

### Get Message by ID (Admin)
```
GET /contact/:id
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: message }
```

### Mark as Read (Admin)
```
PATCH /contact/:id/read
Headers: { Authorization: Bearer TOKEN }
Response: { success, message, data: message }
```

### Delete Message (Admin)
```
DELETE /contact/:id
Headers: { Authorization: Bearer TOKEN }
Response: { success, message }
```

---

## Error Responses

All endpoints may return error responses in this format:
```json
{
  "success": false,
  "message": "Error message"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request / Validation Error
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
