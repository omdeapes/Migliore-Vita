import axios from 'axios'

// Using Vite proxy: /v1 → localhost:3000/v1 in dev
// In production, set VITE_API_BASE_URL to the full backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/v1'

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

// Response interceptor — handle 401
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
    apiClient.post('/auth/login', { email, password }),

  logout: () =>
    apiClient.post('/auth/logout'),
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () =>
    apiClient.get('/admin/dashboard'),
}

// ── Trips ──────────────────────────────────────────────────────────────────

export const tripsApi = {
  list: (params) =>
    apiClient.get('/admin/trips', { params }),

  get: (id) =>
    apiClient.get(`/admin/trips/${id}`),

  getSummary: (id) =>
    apiClient.get(`/admin/trips/${id}/summary`),

  create: (data) =>
    apiClient.post('/admin/trips', data),

  update: (id, data) =>
    apiClient.patch(`/admin/trips/${id}`, data),

  close: (id, dryRun = false) =>
    apiClient.post(`/admin/trips/${id}/close?dry_run=${dryRun}`),
}

// ── Invoices ───────────────────────────────────────────────────────────────

export const invoicesApi = {
  list: (params) =>
    apiClient.get('/admin/invoices', { params }),

  get: (id) =>
    apiClient.get(`/admin/invoices/${id}`),

  update: (id, data) =>
    apiClient.patch(`/admin/invoices/${id}`, data),

  recordPayment: (id, data) =>
    apiClient.post(`/admin/invoices/${id}/payouts`, data),

  deliver: (id, channel) =>
    apiClient.post(`/admin/invoices/${id}/deliver`, { channel }),
}

// ── Media ──────────────────────────────────────────────────────────────────

export const mediaApi = {
  list: (params) =>
    apiClient.get('/admin/media', { params }),

  deliver: (id) =>
    apiClient.post(`/admin/media/${id}/deliver`),
}

// ── Photographers ─────────────────────────────────────────────────────────

export const photographersApi = {
  list: (params) =>
    apiClient.get('/admin/photographers', { params }),

  get: (id) =>
    apiClient.get(`/admin/photographers/${id}`),

  create: (data) =>
    apiClient.post('/admin/photographers', data),

  update: (id, data) =>
    apiClient.patch(`/admin/photographers/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/admin/photographers/${id}`),
}

// ── Payouts ───────────────────────────────────────────────────────────────

export const payoutsApi = {
  list: (params) =>
    apiClient.get('/admin/payouts', { params }),

  record: (invoiceId, data) =>
    apiClient.post(`/admin/invoices/${invoiceId}/payouts`, data),
}

// ── Reports ───────────────────────────────────────────────────────────────

export const reportsApi = {
  revenue: (params) =>
    apiClient.get('/admin/reports/revenue', { params }),

  photographers: (params) =>
    apiClient.get('/admin/reports/photographers', { params }),
}

export default apiClient
