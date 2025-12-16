import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Profile API
export const profileAPI = {
    get: () => api.get('/profile'),
};

// Resume API
export const resumeAPI = {
    get: () => api.get('/resume'),
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/projects'),
    getById: (id) => api.get(`/projects/${id}`),
};

// Skills API
export const skillsAPI = {
    getAll: (category) => {
        const params = category ? { category } : {};
        return api.get('/skills', { params });
    },
};

// Experience API
export const experienceAPI = {
    getAll: () => api.get('/experience'),
};

// Certificates API
export const certificatesAPI = {
    getAll: () => api.get('/certificates'),
};

// Achievements API
export const achievementsAPI = {
    getAll: () => api.get('/achievements'),
    getById: (id) => api.get(`/achievements/${id}`),
};

// Education API
export const educationAPI = {
    getAll: () => api.get('/education'),
    getById: (id) => api.get(`/education/${id}`),
};

// Contact API
export const contactAPI = {
    submit: (data) => api.post('/contact', data),
};

export default api;
