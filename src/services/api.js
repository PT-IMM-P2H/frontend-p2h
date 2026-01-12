import axios from 'axios';

<<<<<<< HEAD
// Konfigurasi Axios untuk Backend FastAPI Anda
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Sesuaikan dengan URL Backend Anda
  withCredentials: true, // WAJIB: Agar HttpOnly Cookie bisa terkirim otomatis
=======
// Base URL API backend
const API_BASE_URL = 'http://127.0.0.1:8000';

// Buat instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // PENTING: Agar cookie (jika ada) bisa dikirim/diterima
>>>>>>> fetch-fe
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< HEAD
// Interceptor untuk menambahkan Authorization header di setiap request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('access_token');
    
    // Jika token ada, tambahkan ke Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
=======
// --- 1. INTERCEPTORS (Logika Anda Tetap Dipertahankan) ---

// Request interceptor - tambahkan token JWT ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
>>>>>>> fetch-fe
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
// Interceptor untuk handle response error (opsional, untuk auto-logout jika 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid - redirect ke login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
=======
// Response interceptor - handle error 401 (unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, bersihkan storage & redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');

      // Cek agar tidak redirect loop jika user sudah di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
>>>>>>> fetch-fe
    }
    return Promise.reject(error);
  }
);

<<<<<<< HEAD
export default api;
=======
// --- 2. API SERVICES TERPUSAT ---
// Kita bungkus semua endpoint dalam objek agar mudah dipanggil di Component

const apiService = {
  // Akses raw axios instance jika butuh custom request
  instance: api,

  // A. AUTHENTICATION
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/me'), // Endpoint /users/me atau /auth/me sesuaikan backend
  },

  // B. MASTER DATA (CRUD)
  master: {
    // Perusahaan
    getCompanies: () => api.get('/master-data/companies'),
    createCompany: (data) => api.post('/master-data/companies', data),
    updateCompany: (id, data) => api.put(`/master-data/companies/${id}`, data),
    deleteCompany: (id) => api.delete(`/master-data/companies/${id}`),

    // Departemen
    getDepartments: () => api.get('/master-data/departments'),
    createDepartment: (data) => api.post('/master-data/departments', data),
    updateDepartment: (id, data) => api.put(`/master-data/departments/${id}`, data),
    deleteDepartment: (id) => api.delete(`/master-data/departments/${id}`),

    // Posisi
    getPositions: () => api.get('/master-data/positions'),
    createPosition: (data) => api.post('/master-data/positions', data),
    updatePosition: (id, data) => api.put(`/master-data/positions/${id}`, data),
    deletePosition: (id) => api.delete(`/master-data/positions/${id}`),

    // Status Kerja
    getStatuses: () => api.get('/master-data/work-statuses'),
    createStatus: (data) => api.post('/master-data/work-statuses', data),
    updateStatus: (id, data) => api.put(`/master-data/work-statuses/${id}`, data),
    deleteStatus: (id) => api.delete(`/master-data/work-statuses/${id}`),
  },

  // C. CHECKLIST (KELOLA PERTANYAAN)
  checklist: {
    getAll: () => api.get('/checklist'), // Admin: Semua pertanyaan
    create: (data) => api.post('/checklist', data), // Admin: Tambah
    delete: (id) => api.delete(`/checklist/${id}`), // Admin: Hapus
    // User: Mengambil checklist aktif untuk form P2H
    getActive: (vehicleType) => api.get(`/p2h/checklist/${vehicleType}`),
  },

  // D. USER MANAGEMENT
  users: {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`), // Soft delete
  },

  // E. KENDARAAN (VEHICLES) & MONITORING
  vehicles: {
    // Ambil semua (bisa filter ?kategori_pengguna=IMM)
    getAll: (params) => api.get('/vehicles', { params }),
    // Detail per ID
    getById: (id) => api.get(`/vehicles/${id}`),
    // Cari Publik via No Lambung (P.309)
    getByLambung: (lambung) => api.get(`/vehicles/lambung/${lambung}`),
    // Create new vehicle
    create: (data) => api.post('/vehicles', data),
    // Update vehicle
    update: (id, data) => api.put(`/vehicles/${id}`, data),
    // Delete vehicle (soft delete)
    delete: (id) => api.delete(`/vehicles/${id}`),
  },

  // F. LAPORAN P2H
  p2h: {
    submit: (data) => api.post('/p2h/reports', data),
    getList: (params) => api.get('/p2h/reports', { params }),
    getDetail: (id) => api.get(`/p2h/reports/${id}`),
  }
};

// Export default apiService untuk component yang sudah diupdate
export default apiService;

// Export named api instance untuk backward compatibility
export { api };
>>>>>>> fetch-fe
