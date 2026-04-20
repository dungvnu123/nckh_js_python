import axios from 'axios';

// Base URL cho backend Django
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL.endsWith('/') ? API_URL : `${API_URL}/`,
});

// Thêm Interceptor để tự động đính kèm Access Token vào mọi Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm Interceptor để xử lý lỗi Token hết hạn (401)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Xử lý Network Error (Lỗi không kết nối được tới Backend)
    if (!error.response) {
      console.error("Không thể kết nối đến Backend. Vui lòng đảm bảo Backend đang chạy tại http://localhost:8000");
      return Promise.reject(new Error("Lỗi kết nối mạng: Không tìm thấy Backend (Server is down or blocked by CORS)."));
    }
    
    // Nếu lỗi 401 (Unauthorized)
    if (error.response.status === 401) {
      console.error("Token có thể đã hết hạn. Đang đăng xuất...");
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
