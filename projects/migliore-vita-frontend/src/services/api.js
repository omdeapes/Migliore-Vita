import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1'

/**
 * Axios instance with auth interceptors
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem('migliore-vita-auth') || '{}')
    const token = authData?.state?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('migliore-vita-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email, password) =>
    apiClient.post('/admin/login', { email, password }),

  logout: () =>
    apiClient.post('/admin/logout'),
}

// ── Trips ──────────────────────────────────────────────────────────────────

export const tripsApi = {
  list: (params) =>
    apiClient.get('/admin/trips', { params }),

  get: (id) =>
    apiClient.get(`/admin/trips/${id}`),

  create: (data) =>
    apiClient.post('/admin/trips', data),

  update: (id, data) =>
    apiClient.patch(`/admin/trips/${id}`, data),
}

// ── Invoices ───────────────────────────────────────────────────────────────

export const invoicesApi = {
  list: (params) =>
    apiClient.get('/admin/invoices', { params }),

  get: (id) =>
    apiClient.get(`/admin/invoices/${id}`),

  resendDelivery: (id, channel) =>
    apiClient.post(`/admin/invoices/${id}/deliver`, { channel }),
}

// ── Media ──────────────────────────────────────────────────────────────────

export const mediaApi = {
  list: (params) =>
    apiClient.get('/admin/media', { params }),

  resendLink: (id) =>
    apiClient.post(`/admin/media/${id}/deliver`),
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () =>
    apiClient.get('/admin/dashboard/stats'),
}

export default apiClient
