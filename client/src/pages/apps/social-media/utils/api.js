import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardAPI = {
  getStatus: () => apiClient.get('/dashboard/status'),
};

export const trendsAPI = {
  getDailyTrends: () => apiClient.get('/trends/daily'),
  triggerScan: () => apiClient.post('/trends/scan'),
};

export const videosAPI = {
  getQueue: () => apiClient.get('/videos/queue'),
  approve: (id) => apiClient.post(`/videos/approve/${id}`),
  reject: (id) => apiClient.post(`/videos/reject/${id}`),
  generate: () => apiClient.post('/videos/generate'),
};

export const scheduleAPI = {
  getPosts: () => apiClient.get('/schedule/posts'),
  createPost: (data) => apiClient.post('/schedule/create', data),
};

export const affiliatesAPI = {
  getAll: () => apiClient.get('/affiliates'),
  create: (data) => apiClient.post('/affiliates', data),
  update: (id, data) => apiClient.put(`/affiliates/${id}`, data),
  delete: (id) => apiClient.delete(`/affiliates/${id}`),
};

export const capabilitiesAPI = {
  getAll: (search) => apiClient.get('/capabilities', { params: { search } }),
  create: (data) => apiClient.post('/capabilities', data),
};

export const settingsAPI = {
  getBrand: () => apiClient.get('/settings/brand'),
  updateBrand: (data) => apiClient.put('/settings/brand', data),
  getCredentials: () => apiClient.get('/settings/credentials'),
  saveCredentials: (data) => apiClient.post('/settings/credentials', data),
};

export const directiveAPI = {
  getToday: () => apiClient.get('/directive/today'),
  save: (data) => apiClient.post('/directive', data),
};