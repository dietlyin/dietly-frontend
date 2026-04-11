import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-gules-zeta-65.vercel.app/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dietly_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
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

export default api;

// ── Auth ──
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── Plans ──
export const plansAPI = {
  getAll: () => api.get('/plans'),
  getBySlug: (slug) => api.get(`/plans/${slug}`),
};

// ── Meals ──
export const mealsAPI = {
  getAll: (params) => api.get('/meals', { params }),
  getById: (id) => api.get(`/meals/${id}`),
};

// ── Testimonials ──
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
};

// ── FAQs ──
export const faqsAPI = {
  getAll: () => api.get('/faqs'),
};

// ── Stats ──
export const statsAPI = {
  getAll: () => api.get('/stats'),
};

// ── Orders ──
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMine: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// ── Contact ──
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

// ── Gym Partnership ──
export const gymPartnershipAPI = {
  apply: (data) => api.post('/gym-partnership/apply', data),
};

// ── Users ──
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
};
