import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Public API calls
export const getCategories = () => api.get('/categories');
export const getStats = () => api.get('/stats');
export const getSlideshow = () => api.get('/slideshow');
export const submitBets = (data) => api.post('/bets', data);

// Admin API calls
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const getPayments = (status) => api.get('/admin/payments', { params: { status } });
export const validatePayment = (id, data) => api.put(`/admin/payments/${id}/validate`, data);
export const getBets = () => api.get('/admin/bets');
export const getAdminStats = () => api.get('/admin/stats');
export const uploadImage = (formData) => api.post('/admin/images', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getImages = () => api.get('/admin/images');
export const updateImage = (id, data) => api.put(`/admin/images/${id}`, data);
export const deleteImage = (id) => api.delete(`/admin/images/${id}`);
