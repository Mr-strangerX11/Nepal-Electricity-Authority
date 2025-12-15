import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const applicationService = {
  createApplication: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my-applications'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateApplicationStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  getAllApplications: (page = 1, limit = 10) => api.get('/applications', { params: { page, limit } }),
};

export const documentService = {
  uploadDocument: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  verifyDocument: (id) => api.get(`/documents/${id}/verify`),
};

export const paymentService = {
  initiatePayment: (data) => api.post('/payments/initiate', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentDetails: (id) => api.get(`/payments/${id}`),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllApplications: () => api.get('/admin/applications'),
  assignStaff: (data) => api.post('/admin/assign-staff', data),
};

export default api;
