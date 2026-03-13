import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance for admin API calls
const createAdminAPI = (token) => {
    // Do not set a global Content-Type here so multipart/form-data
    // requests can let the browser set the proper boundary header.
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    });
};

// Auth APIs
export const adminAuthAPI = {
    login: (email, password) => {
        const api = createAdminAPI();
        return api.post('/auth/login', { email, password });
    },
    signup: (name, email, password) => {
        const api = createAdminAPI();
        return api.post('/auth/signup', { name, email, password });
    },
    getMe: (token) => {
        const api = createAdminAPI(token);
        return api.get('/auth/me');
    }
};

// Profile Admin APIs
export const adminProfileAPI = {
    get: (token) => createAdminAPI(token).get('/profile'),
    create: (token, data) => createAdminAPI(token).put('/profile', data),
    update: (token, data) => createAdminAPI(token).put('/profile', data),
    uploadAvatar: (token, formData) => {
        return createAdminAPI(token).post('/profile/image', formData);
    },
    uploadBackground: (token, formData) => {
        return createAdminAPI(token).post('/profile/background', formData);
    }
};

// Resume Admin APIs
export const adminResumeAPI = {
    get: (token) => createAdminAPI(token).get('/resume'),
    upload: (token, formData) => createAdminAPI(token).post('/resume', formData),
    create: (token, formData) => createAdminAPI(token).post('/resume', formData),
    delete: (token, id) => createAdminAPI(token).delete(`/resume/${id}`),
    activate: (token, id) => createAdminAPI(token).patch(`/resume/${id}/activate`)
};

// Projects Admin APIs
export const adminProjectsAPI = {
    getAll: (token) => createAdminAPI(token).get('/projects/admin/all'),
    getById: (token, id) => createAdminAPI(token).get(`/projects/${id}`),
    create: (token, formData) => {
        return createAdminAPI(token).post('/projects', formData);
    },
    update: (token, id, formData) => {
        return createAdminAPI(token).put(`/projects/${id}`, formData);
    },
    delete: (token, id) => createAdminAPI(token).delete(`/projects/${id}`),
    toggleVisibility: (token, id) => createAdminAPI(token).patch(`/projects/${id}/visibility`)
};

// Skills Admin APIs
export const adminSkillsAPI = {
    getAll: (token) => createAdminAPI(token).get('/skills/admin/all'),
    create: (token, data) => createAdminAPI(token).post('/skills', data),
    update: (token, id, data) => createAdminAPI(token).put(`/skills/${id}`, data),
    delete: (token, id) => createAdminAPI(token).delete(`/skills/${id}`)
};

// Experience Admin APIs
export const adminExperienceAPI = {
    getAll: (token) => createAdminAPI(token).get('/experience/admin/all'),
    create: (token, formData) => {
        return createAdminAPI(token).post('/experience', formData);
    },
    update: (token, id, formData) => {
        return createAdminAPI(token).put(`/experience/${id}`, formData);
    },
    delete: (token, id) => createAdminAPI(token).delete(`/experience/${id}`),
    toggleVisibility: (token, id) => createAdminAPI(token).patch(`/experience/${id}/visibility`)
};

// Education Admin APIs
export const adminEducationAPI = {
    getAll: (token) => createAdminAPI(token).get('/education/admin/all'),
    create: (token, data) => createAdminAPI(token).post('/education', data),
    update: (token, id, data) => createAdminAPI(token).put(`/education/${id}`, data),
    delete: (token, id) => createAdminAPI(token).delete(`/education/${id}`),
    toggleVisibility: (token, id) => createAdminAPI(token).patch(`/education/${id}/visibility`)
};

// Certificates Admin APIs
export const adminCertificatesAPI = {
    getAll: (token) => createAdminAPI(token).get('/certificates/admin/all'),
    create: (token, formData) => {
        return createAdminAPI(token).post('/certificates', formData);
    },
    update: (token, id, formData) => {
        return createAdminAPI(token).put(`/certificates/${id}`, formData);
    },
    delete: (token, id) => createAdminAPI(token).delete(`/certificates/${id}`),
    toggleVisibility: (token, id) => createAdminAPI(token).patch(`/certificates/${id}/visibility`)
};

// Achievements Admin APIs
export const adminAchievementsAPI = {
    getAll: (token) => createAdminAPI(token).get('/achievements/admin/all'),
    create: (token, data) => createAdminAPI(token).post('/achievements', data),
    update: (token, id, data) => createAdminAPI(token).put(`/achievements/${id}`, data),
    delete: (token, id) => createAdminAPI(token).delete(`/achievements/${id}`),
    toggleVisibility: (token, id) => createAdminAPI(token).patch(`/achievements/${id}/visibility`)
};

// Blogs Admin APIs
export const adminBlogsAPI = {
    getAll: (token) => createAdminAPI(token).get('/blogs/admin/all'),
    create: (token, formData) => {
        return createAdminAPI(token).post('/blogs', formData);
    },
    update: (token, id, formData) => {
        return createAdminAPI(token).put(`/blogs/${id}`, formData);
    },
    delete: (token, id) => createAdminAPI(token).delete(`/blogs/${id}`),
    toggleVisibility: (token, id) => createAdminAPI(token).patch(`/blogs/${id}/visibility`)
};

// Publications Admin APIs
export const adminPublicationsAPI = {
    getAll: (token) => createAdminAPI(token).get('/publications/admin/all'),
    create: (token, formData) => {
        return createAdminAPI(token).post('/publications', formData);
    },
    update: (token, id, formData) => {
        return createAdminAPI(token).put(`/publications/${id}`, formData);
    },
    delete: (token, id) => createAdminAPI(token).delete(`/publications/${id}`),
    toggleVisibility: (token, id) => createAdminAPI(token).patch(`/publications/${id}/visibility`)
};

// Activities Admin APIs
export const adminActivitiesAPI = {
    getAll: (token) => createAdminAPI(token).get('/activities/admin/all'),
    create: (token, formData) => {
        return createAdminAPI(token).post('/activities', formData);
    },
    update: (token, id, formData) => {
        return createAdminAPI(token).put(`/activities/${id}`, formData);
    },
    delete: (token, id) => createAdminAPI(token).delete(`/activities/${id}`),
    toggleVisibility: (token, id) => createAdminAPI(token).patch(`/activities/${id}/visibility`)
};

export default createAdminAPI;
