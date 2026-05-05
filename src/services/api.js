import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-gules-zeta-65.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const deliveryClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dietly_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

deliveryClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('dietly_delivery_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dietly_token');
      localStorage.removeItem('dietly_user');
    }
    return Promise.reject(err);
  }
);

deliveryClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dietly_delivery_token');
      localStorage.removeItem('dietly_delivery_agent');
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const plansAPI = {
  getAll: () => api.get('/plans'),
  getBySlug: (slug) => api.get(`/plans/${slug}`),
};

export const mealsAPI = {
  getAll: (params) => api.get('/meals', { params }),
  getById: (id) => api.get(`/meals/${id}`),
};

export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
};

export const faqsAPI = {
  getAll: () => api.get('/faqs'),
};

export const statsAPI = {
  getAll: () => api.get('/stats'),
};

export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMine: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export const gymPartnershipAPI = {
  apply: (data) => api.post('/gym-partnership/apply', data),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
};

export const deliveryAPI = {
  login: (data) => deliveryClient.post('/delivery/login', data),
  getMe: () => deliveryClient.get('/delivery/me'),
  getOrders: (params) => deliveryClient.get('/delivery/orders', { params }),
  updateOrderStatus: (data) => deliveryClient.patch('/delivery/order-status', data),
};
