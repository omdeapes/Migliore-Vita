// src/utils/api.js
// API utility for Migliore Vita Admin Dashboard

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000';

// Helper: Fetch with error handling
const fetchWithErrorHandling = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

// Auth API
export const login = async (email, password) => {
  return fetchWithErrorHandling('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// Dashboard API
export const fetchDashboardStats = async () => {
  return fetchWithErrorHandling('/v1/admin/dashboard/stats');
};

// Trips API
export const fetchTrips = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetchWithErrorHandling(`/v1/admin/trips?${query}`);
};

export const createTrip = async (tripData) => {
  return fetchWithErrorHandling('/v1/admin/trips', {
    method: 'POST',
    body: JSON.stringify(tripData),
  });
};

export const updateTrip = async (id, tripData) => {
  return fetchWithErrorHandling(`/v1/admin/trips/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(tripData),
  });
};

// Invoices API
export const fetchInvoices = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetchWithErrorHandling(`/v1/admin/invoices?${query}`);
};

export const deliverInvoice = async (id) => {
  return fetchWithErrorHandling(`/v1/admin/invoices/${id}/deliver`, {
    method: 'POST',
  });
};

// Media API
export const fetchMedia = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetchWithErrorHandling(`/v1/admin/media?${query}`);
};

export const deliverMedia = async (id) => {
  return fetchWithErrorHandling(`/v1/admin/media/${id}/deliver`, {
    method: 'POST',
  });
};

// Photographers API
export const fetchPhotographers = async () => {
  return fetchWithErrorHandling('/v1/admin/photographers');
};

export const createPhotographer = async (photographerData) => {
  return fetchWithErrorHandling('/v1/admin/photographers', {
    method: 'POST',
    body: JSON.stringify(photographerData),
  });
};

export const updatePhotographer = async (id, photographerData) => {
  return fetchWithErrorHandling(`/v1/admin/photographers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(photographerData),
  });
};