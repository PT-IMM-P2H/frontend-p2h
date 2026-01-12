import axios from 'axios';

// Konfigurasi Axios untuk Backend FastAPI Anda
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Sesuaikan dengan URL Backend Anda
  withCredentials: true, // WAJIB: Agar HttpOnly Cookie bisa terkirim otomatis
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan Authorization header di setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('access_token');
    
    // Jika token ada, tambahkan ke Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response error (opsional, untuk auto-logout jika 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid - redirect ke login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;