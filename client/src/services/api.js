import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3003',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (auth.token) {
      config.headers['Authorization'] = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'Terjadi kesalahan pada server';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Tidak dapat terhubung ke server'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

// API Methods
export const apiService = {
  // Get transaction history
  getMutasi: async (username, token, jenis = 'IN') => {
    return api.get(`/mutasi/${username}/${token}`, {
      params: { jenis }
    });
  },

  // Long polling for specific transaction
  waitForTransaction: async (username, token, nominal, starttime) => {
    return api.get(`/mutasi/${username}/${token}/${nominal}/${starttime}`);
  },

  // Generate QRIS with nominal
  generateQRIS: async (qrisString, nominal) => {
    return api.get(`/qris/${encodeURIComponent(qrisString)}/${nominal}`);
  },

  // Health check
  healthCheck: async () => {
    return api.get('/');
  },
};

export default api;
